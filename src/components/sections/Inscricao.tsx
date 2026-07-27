"use client";

import { useEffect, useMemo, useState, type InputHTMLAttributes, type ReactNode } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { Check, CreditCard, Gift, Loader2, Plus, Tag, Trash2 } from "lucide-react";
import { getCountryCallingCode, isSupportedCountry, type CountryCode } from "libphonenumber-js";
import { COUNTRY_CODES, nomePais } from "@/lib/countries";
import { Link } from "@/i18n/navigation";
import { REGISTRATION_DRAFT_KEY } from "@/components/ClearRegistrationDraft";
import { calcularInscricao, formatarEuros } from "@/lib/pricing";
import {
  DATA_NASCIMENTO_MAXIMA_RESPONSAVEL,
  inscricaoSchema,
  type InscricaoData,
} from "@/types/inscricao";

type Etapa = "dados" | "participacao" | "servicos" | "pagamento" | "resultado";

interface ResultadoPagamento {
  ok: boolean;
  orderId?: string;
  metodoPagamento?: "stripe" | "manual" | "isento";
  checkoutUrl?: string;
  ticketUrl?: string;
  mensagem?: string;
  erro?: string;
  errorCode?: string;
  resumed?: boolean;
}

interface DescontoAplicado {
  code: string;
  type: "percentage" | "fixed";
  value: number;
}

const emptyServices = { dormidaNazare: false, dormidaFatima: false, transporteNazare: false };

export function Inscricao({ pagamentoCancelado = false }: { pagamentoCancelado?: boolean }) {
  const t = useTranslations("inscricao");
  const locale = useLocale();
  const [etapa, setEtapa] = useState<Etapa>("dados");
  const [submitting, setSubmitting] = useState(false);
  const [resultado, setResultado] = useState<ResultadoPagamento | null>(null);
  const [descontoAplicado, setDescontoAplicado] = useState<DescontoAplicado | null>(null);
  const [validandoDesconto, setValidandoDesconto] = useState(false);
  const [erroDesconto, setErroDesconto] = useState<string | null>(null);
  const paymentsEnabled = process.env.NEXT_PUBLIC_PAYMENTS_ENABLED === "true";
  const form = useForm<InscricaoData>({
    resolver: zodResolver(inscricaoSchema),
    mode: "onBlur",
    defaultValues: {
      nome: "", apelido: "", dataNascimento: "", email: "", telefone: "+351 ", nacionalidade: "PT",
      estadoVida: "leigo", tipoInscricao: "individual", rota: "adultos",
      servicos: emptyServices, membrosFamilia: [],
      codigoDesconto: "",
      donativo: "none",
      aceitaRegulamento: false as true,
      aceitaRGPD: false as true, autorizaImagem: false, locale,
    },
  });
  const { register, control, handleSubmit, reset, watch, setError, setValue, trigger, formState: { errors } } = form;
  const { fields, append, remove } = useFieldArray({ control, name: "membrosFamilia" });
  const values = watch();
  const estadoVida = watch("estadoVida");
  const nacionalidade = watch("nacionalidade");
  const tipoInscricao = watch("tipoInscricao");
  const rota = watch("rota");
  const donativo = watch("donativo");
  const countries = useMemo(() => COUNTRY_CODES
    .map((code) => ({ code, name: nomePais(code, locale) }))
    .sort((a, b) => a.name.localeCompare(b.name, locale)), [locale]);

  useEffect(() => {
    if (estadoVida !== "leigo") {
      setValue("tipoInscricao", "individual");
      setValue("membrosFamilia", []);
    }
  }, [estadoVida, setValue]);

  useEffect(() => {
    if (donativo !== "custom") {
      setValue("donativoCustomEuros", undefined);
    }
  }, [donativo, setValue]);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(REGISTRATION_DRAFT_KEY);
      if (!saved) return;
      const draft = JSON.parse(saved) as { data?: InscricaoData; etapa?: Etapa };
      if (draft.data) reset(draft.data);
      if (draft.etapa && draft.etapa !== "resultado") setEtapa(draft.etapa);
    } catch {
      sessionStorage.removeItem(REGISTRATION_DRAFT_KEY);
    }
  }, [reset]);

  const preview = useMemo(() => {
    const parsed = inscricaoSchema.safeParse({
      ...values,
      aceitaRegulamento: true,
      aceitaRGPD: true,
    });
    const currentCode = values.codigoDesconto?.trim().toUpperCase();
    const discount = descontoAplicado?.code === currentCode
      ? { type: descontoAplicado.type, value: descontoAplicado.value }
      : null;
    return parsed.success ? calcularInscricao(parsed.data, new Date(), discount) : null;
  }, [values, descontoAplicado]);

  async function aplicarCodigoDesconto() {
    const code = values.codigoDesconto?.trim();
    if (!code) {
      setDescontoAplicado(null);
      setErroDesconto(t("desconto_invalido"));
      return;
    }
    setValidandoDesconto(true);
    setErroDesconto(null);
    try {
      const response = await fetch("/api/descontos/validar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const result = await response.json() as {
        ok: boolean;
        code?: string;
        type?: "percentage" | "fixed";
        value?: number;
      };
      if (!response.ok || !result.ok || !result.code || !result.type || !result.value) {
        setDescontoAplicado(null);
        setErroDesconto(t("desconto_invalido"));
        return;
      }
      setValue("codigoDesconto", result.code, { shouldDirty: true });
      setDescontoAplicado({ code: result.code, type: result.type, value: result.value });
    } catch {
      setDescontoAplicado(null);
      setErroDesconto(t("erro_ligacao"));
    } finally {
      setValidandoDesconto(false);
    }
  }

  async function next() {
    if (
      etapa === "dados"
      && values.dataNascimento
      && values.dataNascimento > DATA_NASCIMENTO_MAXIMA_RESPONSAVEL
    ) {
      setError("dataNascimento", {
        type: "validate",
        message: "O responsável deve ter pelo menos 16 anos no início da peregrinação",
      }, { shouldFocus: true });
      return;
    }
    const fieldsByStep: Record<Exclude<Etapa, "resultado">, Parameters<typeof trigger>[0]> = {
      dados: ["nome", "apelido", "dataNascimento", "email", "telefone", "nacionalidade"],
      participacao: ["estadoVida", "tipoInscricao", "rota", "afiliacaoNome", "membrosFamilia"],
      servicos: ["servicos", "membrosFamilia"],
      pagamento: [],
    };
    if (!(await trigger(fieldsByStep[etapa as Exclude<Etapa, "resultado">]))) return;
    setEtapa(etapa === "dados" ? "participacao" : etapa === "participacao" ? "servicos" : "pagamento");
  }

  async function onSubmit(data: InscricaoData) {
    setSubmitting(true);
    try {
      const response = await fetch("/api/inscricao", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data),
      });
      const json = await response.json() as ResultadoPagamento;
      if (!json.ok) {
        json.erro = response.status === 409
          ? t("erro_duplicado")
          : json.errorCode === "INVALID_DISCOUNT_CODE"
            ? t("desconto_invalido")
            : json.erro || t("erro_generico");
      }
      if (json.ok && json.checkoutUrl) {
        sessionStorage.setItem(
          REGISTRATION_DRAFT_KEY,
          JSON.stringify({ data, etapa: "pagamento" }),
        );
        if (!json.resumed) {
          window.location.assign(json.checkoutUrl);
          return;
        }
      }
      if (json.ok && !json.checkoutUrl) {
        sessionStorage.removeItem(REGISTRATION_DRAFT_KEY);
      }
      setResultado(json);
      setEtapa("resultado");
    } catch {
      setResultado({ ok: false, erro: t("erro_ligacao") });
      setEtapa("resultado");
    } finally {
      setSubmitting(false);
    }
  }

  const steps: Exclude<Etapa, "resultado">[] = ["dados", "participacao", "servicos", "pagamento"];
  const stepIndex = steps.indexOf(etapa as Exclude<Etapa, "resultado">);

  return (
    <section id="inscricao" className="relative py-32 bg-cream-50">
      <div className="container mx-auto px-6"><div className="max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="font-display text-5xl md:text-6xl text-petrol font-light mb-6">{t("titulo")}</h2>
          <p className="font-serif text-lg text-petrol/70">{t("subtitulo")}</p>
        </div>
        {etapa !== "resultado" && <div className="mb-10 flex items-center justify-center">
          {steps.map((step, index) => <div key={step} className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-display text-sm ${index === stepIndex ? "bg-petrol text-cream-50 ring-4 ring-gold/30" : index < stepIndex ? "bg-gold text-petrol" : "bg-cream-200 text-petrol/40"}`}>
              {index < stepIndex ? <Check size={16} /> : index + 1}
            </div>
            {index < steps.length - 1 && <div className={`w-10 md:w-16 h-px ${index < stepIndex ? "bg-gold" : "bg-petrol/10"}`} />}
          </div>)}
        </div>}

        <form onSubmit={handleSubmit(onSubmit)} className="bg-cream-100 p-6 md:p-12 border border-petrol/10">
          {pagamentoCancelado && etapa !== "resultado" && (
            <div
              role="status"
              className="mb-8 border border-gold/40 bg-gold/10 p-5 font-serif text-petrol"
            >
              <p className="font-display text-sm uppercase tracking-wider">
                {t("pagamento_cancelado_titulo")}
              </p>
              <p className="mt-2 text-sm text-petrol/70">
                {t("pagamento_cancelado_texto")}
              </p>
            </div>
          )}
          {etapa === "dados" && <div className="space-y-7">
            <StepTitle title={t("dados_titulo")} />
            <div className="grid md:grid-cols-2 gap-6">
              <Field label={t("campo_primeiro_nome")} error={errors.nome?.message}><input {...register("nome")} className="input-sacred" autoComplete="given-name" /></Field>
              <Field label={t("campo_apelido")} error={errors.apelido?.message}><input {...register("apelido")} className="input-sacred" autoComplete="family-name" /></Field>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <Field label={t("campo_nasc")} error={errors.dataNascimento?.message}><input type="date" max={DATA_NASCIMENTO_MAXIMA_RESPONSAVEL} {...register("dataNascimento")} className="input-sacred" /></Field>
              <CountryField label={t("campo_nacionalidade")} error={errors.nacionalidade?.message} countries={countries} registration={register("nacionalidade")} />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <Field label={t("campo_email")} error={errors.email?.message}><input type="email" {...register("email")} className="input-sacred" autoComplete="email" /></Field>
              <Controller control={control} name="telefone" render={({ field }) => <PhoneField label={t("campo_telemovel")} callingCodeLabel={t("indicativo_pais")} error={errors.telefone?.message} countries={countries} nationality={nacionalidade} value={field.value} onChange={field.onChange} autoComplete="tel" />} />
            </div>
            <button type="button" onClick={next} className="btn-primary">{t("btn_continuar")}</button>
          </div>}

          {etapa === "participacao" && <div className="space-y-8">
            <StepTitle title={t("participantes_titulo")} />
            <RadioCards label={t("estado_vida")} name="estadoVida" register={register} options={[
              ["leigo", t("estado_leigo")], ["sacerdote", t("estado_sacerdote")], ["religioso", t("estado_religioso")],
            ]} value={estadoVida} />
            {estadoVida !== "leigo" && <Field label={t("afiliacao_label")} error={errors.afiliacaoNome?.message}><input {...register("afiliacaoNome")} className="input-sacred" placeholder={t("afiliacao_placeholder")} /></Field>}
            {estadoVida === "leigo" && <RadioCards label={t("tipo_inscricao")} name="tipoInscricao" register={register} options={[["individual", t("tipo_individual")], ["familia", t("tipo_familia")]]} value={tipoInscricao} />}
            <RadioCards label={t("percurso_label")} name="rota" register={register} options={[["adultos", t("percurso_adultos")], ["familias", t("percurso_familias")]]} value={rota} />
            {tipoInscricao === "familia" && <div className="space-y-6">
              <div className="flex items-center justify-between"><div><h4 className="font-display text-xl text-petrol">{t("familia_titulo")}</h4><p className="font-serif text-sm text-petrol/60 mt-1">{t("familia_descricao")}</p></div>
                <button type="button" className="btn-ghost flex items-center gap-2" onClick={() => append({ nome: "", apelido: "", dataNascimento: "", nacionalidade: "PT", servicos: emptyServices })}><Plus size={16} /> {t("adicionar")}</button>
              </div>
              {fields.map((field, index) => <div key={field.id} className="p-5 border border-petrol/15 space-y-5">
                <div className="flex justify-between"><span className="label-sacred">{t("membro", { numero: index + 2 })}</span><button type="button" onClick={() => remove(index)} className="text-red-700/70" aria-label={t("remover_membro")}><Trash2 size={18} /></button></div>
                <div className="grid md:grid-cols-2 gap-5"><Field label={t("campo_primeiro_nome")} error={errors.membrosFamilia?.[index]?.nome?.message}><input {...register(`membrosFamilia.${index}.nome`)} className="input-sacred" /></Field><Field label={t("campo_apelido")} error={errors.membrosFamilia?.[index]?.apelido?.message}><input {...register(`membrosFamilia.${index}.apelido`)} className="input-sacred" /></Field></div>
                <div className="grid md:grid-cols-2 gap-5"><Field label={t("campo_nasc")} error={errors.membrosFamilia?.[index]?.dataNascimento?.message}><input type="date" {...register(`membrosFamilia.${index}.dataNascimento`)} className="input-sacred" /></Field><CountryField label={t("campo_nacionalidade")} error={errors.membrosFamilia?.[index]?.nacionalidade?.message} countries={countries} registration={register(`membrosFamilia.${index}.nacionalidade`)} /></div>
              </div>)}
              {typeof errors.membrosFamilia?.message === "string" && <ErrorText>{errors.membrosFamilia.message}</ErrorText>}
            </div>}
            <Nav back={() => setEtapa("dados")} next={next} />
          </div>}

          {etapa === "servicos" && <div className="space-y-7">
            <StepTitle title={t("servicos_titulo")} />
            <p className="font-serif text-petrol/70">{estadoVida === "sacerdote" ? t("servicos_sacerdote") : t("servicos_preco")} {t("servicos_disponibilidade")}</p>
            <Services title={`${values.nome || t("responsavel")} ${values.apelido || ""}`} prefix="servicos" register={register} isento={estadoVida === "sacerdote"} />
            {fields.map((field, index) => <Services key={field.id} title={`${values.membrosFamilia?.[index]?.nome || t("membro", { numero: index + 2 })} ${values.membrosFamilia?.[index]?.apelido || ""}`} prefix={`membrosFamilia.${index}.servicos`} register={register} />)}
            <Nav back={() => setEtapa("participacao")} next={next} />
          </div>}

          {etapa === "pagamento" && <div className="space-y-8">
            <StepTitle title={t("pagamento_titulo")} />
            <div className="border border-petrol/15 bg-white/30 p-5">
              <label htmlFor="codigo-desconto" className="label-sacred">{t("desconto_codigo_label")}</label>
              <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                <div className="relative min-w-0 flex-1">
                  <Tag
                    className="pointer-events-none absolute left-1 top-1/2 z-10 -translate-y-1/2 text-gold"
                    size={17}
                    aria-hidden="true"
                  />
                  <input
                    id="codigo-desconto"
                    {...register("codigoDesconto", {
                      onChange: () => {
                        setDescontoAplicado(null);
                        setErroDesconto(null);
                      },
                    })}
                    className="input-sacred !pl-9 uppercase"
                    placeholder={t("desconto_codigo_placeholder")}
                    autoComplete="off"
                  />
                </div>
                <button
                  type="button"
                  className="btn-ghost w-full shrink-0 sm:w-auto"
                  onClick={aplicarCodigoDesconto}
                  disabled={validandoDesconto}
                >
                  {validandoDesconto ? <Loader2 className="animate-spin" size={16} /> : t("desconto_aplicar")}
                </button>
              </div>
              {erroDesconto && <p className="mt-2 font-serif text-xs italic text-red-700/80">{erroDesconto}</p>}
              {descontoAplicado && (
                <p className="mt-2 flex items-center gap-2 font-serif text-sm text-emerald-800">
                  <Check size={15} />
                  {descontoAplicado.type === "percentage"
                    ? t("desconto_aplicado_percentagem", { percentagem: descontoAplicado.value })
                    : t("desconto_aplicado_fixo", { valor: formatarEuros(descontoAplicado.value, locale) })}
                </p>
              )}
              <p className="mt-2 font-serif text-xs text-petrol/55">{t("desconto_nota")}</p>
            </div>
            <DonationOptions
              value={values.donativo}
              registration={register("donativo")}
              customRegistration={register("donativoCustomEuros")}
              customError={errors.donativoCustomEuros?.message}
            />
            {preview && <PriceSummary calculation={preview} locale={locale} />}
            {paymentsEnabled && (!preview || preview.totalCentimos > 0) && <div className="p-6 border border-petrol/15 bg-white/30">
              <div className="flex items-center gap-3 mb-3"><CreditCard className="text-gold" /><h4 className="font-display text-lg text-petrol">{t("stripe_titulo")}</h4></div>
              <p className="font-serif text-sm text-petrol/70 mb-4">{t("stripe_descricao")}</p>
              <div className="flex flex-wrap gap-2 font-display text-[10px] tracking-wider uppercase text-petrol/60"><span className="border border-petrol/15 px-3 py-2">{t("cartao")}</span><span className="border border-petrol/15 px-3 py-2">MB WAY</span><span className="border border-petrol/15 px-3 py-2">Apple Pay</span><span className="border border-petrol/15 px-3 py-2">Google Pay</span></div>
            </div>}
            {!paymentsEnabled && preview && preview.totalCentimos > 0 && <div className="p-6 border border-gold/30 bg-gold/5">
              <h4 className="font-display text-lg text-petrol mb-2">{t("pagamento_indisponivel")}</h4>
              <p className="font-serif text-sm text-petrol/70">{t("pagamento_teste")}</p>
            </div>}
            <div className="space-y-4 pt-5 border-t border-petrol/10">
              <Checkbox label={<>{t("aceita_reg_pre")} <Link href="/regulamento" target="_blank" rel="noopener noreferrer" className="text-gold underline">{t("aceita_reg_link")}</Link>.</>} {...register("aceitaRegulamento")} error={errors.aceitaRegulamento?.message} />
              <Checkbox label={<>{t("aceita_rgpd_pre")} <Link href="/politica-privacidade" target="_blank" rel="noopener noreferrer" className="text-gold underline">{t("aceita_rgpd_link")}</Link>.</>} {...register("aceitaRGPD")} error={errors.aceitaRGPD?.message} />
              <Checkbox label={t("autoriza_imagem")} {...register("autorizaImagem")} />
            </div>
            <div className="flex gap-4"><button type="button" className="btn-ghost" onClick={() => setEtapa("servicos")} disabled={submitting}>{t("btn_voltar")}</button><button type="submit" className="btn-primary flex-1" disabled={submitting}>{submitting ? <><Loader2 className="inline animate-spin mr-2" size={16} />{t("btn_processar")}</> : preview?.totalCentimos === 0 ? t("btn_confirmar") : paymentsEnabled ? t("btn_stripe") : t("btn_teste")}</button></div>
          </div>}

          {etapa === "resultado" && resultado && <Result result={resultado} />}
        </form>
      </div></div>
    </section>
  );
}

function StepTitle({ title }: { title: string }) { return <div><h3 className="font-display text-2xl text-petrol mb-2">{title}</h3><div className="w-12 h-px bg-gold" /></div>; }
function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) { return <div><label className="label-sacred">{label}</label>{children}{error && <ErrorText>{error}</ErrorText>}</div>; }
function ErrorText({ children }: { children: ReactNode }) {
  const t = useTranslations("inscricao");
  const validationKeys: Record<string, string> = {
    "Indique o número com o código do país (ex.: +351 912 345 678)": "validacao_telefone",
    "Data de nascimento inválida": "validacao_data",
    "A data de nascimento não pode estar no futuro": "validacao_data_futuro",
    "O responsável deve ter pelo menos 16 anos no início da peregrinação": "validacao_idade_responsavel",
    "Nome obrigatório": "validacao_nome",
    "Apelido obrigatório": "validacao_apelido",
    "Seleccione uma nacionalidade": "validacao_nacionalidade",
    "Correio electrónico inválido": "validacao_email",
    "Deve aceitar o regulamento": "validacao_regulamento",
    "Deve aceitar a política de privacidade": "validacao_privacidade",
    "Indique a instituição a que pertence": "validacao_afiliacao",
    "Adicione pelo menos mais um membro da família": "validacao_membro",
    "Indique um donativo válido": "validacao_donativo",
  };
  const text = typeof children === "string" && validationKeys[children] ? t(validationKeys[children]) : children;
  return <p className="mt-1 text-xs font-serif italic text-red-700/80">{text}</p>;
}

function CountryField({ label, error, countries, registration }: { label: string; error?: string; countries: { code: string; name: string }[]; registration: ReturnType<ReturnType<typeof useForm<InscricaoData>>["register"]> }) {
  return <Field label={label} error={error}><select {...registration} className="input-sacred">{countries.map((country) => <option key={country.code} value={country.code}>{country.name}</option>)}</select></Field>;
}

function PhoneField({
  label, callingCodeLabel, error, countries, nationality, value, onChange, autoComplete,
}: {
  label: string;
  callingCodeLabel: string;
  error?: string;
  countries: { code: string; name: string }[];
  nationality?: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
}) {
  const supportedCountries = useMemo(
    () => countries.filter((country) => isSupportedCountry(country.code)),
    [countries],
  );
  const initialCountry = isSupportedCountry(nationality ?? "") ? nationality as CountryCode : "PT";
  const [country, setCountry] = useState<CountryCode>(initialCountry);
  const [localNumber, setLocalNumber] = useState(() => value.replace(/^\+\d{1,4}\s*/, ""));

  function changeCountry(next: CountryCode) {
    setCountry(next);
    onChange(`+${getCountryCallingCode(next)} ${localNumber}`);
  }

  function changeLocalNumber(next: string) {
    setLocalNumber(next);
    onChange(`+${getCountryCallingCode(country)} ${next}`);
  }

  useEffect(() => {
    if (nationality && isSupportedCountry(nationality) && nationality !== country) {
      changeCountry(nationality as CountryCode);
    }
    // The country must follow nationality changes; localNumber is intentionally preserved.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nationality]);

  return <Field label={label} error={error}>
    <div className="flex w-full items-stretch border-b border-petrol/20 focus-within:border-petrol transition-colors duration-300">
      <select
        value={country}
        onChange={(event) => changeCountry(event.target.value as CountryCode)}
        className="w-32 md:w-36 shrink-0 bg-transparent border-0 py-3 pr-2 text-petrol font-serif text-base focus:outline-none cursor-pointer"
        aria-label={callingCodeLabel}
      >
        {supportedCountries.map((option) => <option key={option.code} value={option.code}>
          {option.code} +{getCountryCallingCode(option.code as CountryCode)}
        </option>)}
      </select>
      <input
        type="tel"
        inputMode="tel"
        autoComplete={autoComplete}
        value={localNumber}
        onChange={(event) => changeLocalNumber(event.target.value)}
        className="w-0 min-w-0 flex-1 bg-transparent border-0 px-3 py-3 text-petrol placeholder:text-petrol/40 focus:outline-none font-serif text-lg"
        placeholder="912 345 678"
      />
    </div>
  </Field>;
}

function RadioCards({ label, name, register, options, value }: { label: string; name: "estadoVida" | "tipoInscricao" | "rota"; register: ReturnType<typeof useForm<InscricaoData>>["register"]; options: string[][]; value: string }) {
  return <div><label className="label-sacred">{label}</label><div className={`grid gap-3 mt-3 ${options.length === 3 ? "md:grid-cols-3" : "grid-cols-2"}`}>{options.map(([key, text]) => <label key={key} className={`cursor-pointer p-5 border text-center ${value === key ? "border-gold bg-gold/5 ring-1 ring-gold" : "border-petrol/20"}`}><input type="radio" value={key} {...register(name)} className="sr-only" /><span className="font-display text-sm text-petrol">{text}</span></label>)}</div></div>;
}

function Services({ title, prefix, register, isento = false }: { title: string; prefix: "servicos" | `membrosFamilia.${number}.servicos`; register: ReturnType<typeof useForm<InscricaoData>>["register"]; isento?: boolean }) {
  const t = useTranslations("inscricao");
  const options = [["dormidaNazare", t("dormida_nazare")], ["dormidaFatima", t("dormida_fatima")], ["transporteNazare", t("transporte_nazare")]] as const;
  return <div className="p-5 border border-petrol/15"><h4 className="font-display text-lg text-petrol mb-4">{title}</h4><div className="space-y-3">{options.map(([key, text]) => <label key={key} className="flex items-center gap-3 font-serif text-sm text-petrol/80"><input type="checkbox" {...register(`${prefix}.${key}` as const)} className="w-4 h-4 accent-gold" /><span className="flex-1">{text}</span><span className="text-gold">{isento ? t("gratis") : "+5 €"}</span></label>)}</div></div>;
}

function DonationOptions({
  value,
  registration,
  customRegistration,
  customError,
}: {
  value: InscricaoData["donativo"];
  registration: ReturnType<ReturnType<typeof useForm<InscricaoData>>["register"]>;
  customRegistration: ReturnType<ReturnType<typeof useForm<InscricaoData>>["register"]>;
  customError?: string;
}) {
  const t = useTranslations("inscricao");
  const options: { value: InscricaoData["donativo"]; label: string }[] = [
    { value: "none", label: t("donativo_nenhum") },
    { value: "round_up", label: t("donativo_arredondar") },
    { value: "500", label: "+5 €" },
    { value: "1000", label: "+10 €" },
    { value: "2500", label: "+25 €" },
    { value: "custom", label: t("donativo_outro") },
  ];

  return (
    <div className="border border-gold/30 bg-gold/5 p-5">
      <div className="mb-2 flex items-center gap-3">
        <Gift className="text-gold" size={19} />
        <h4 className="font-display text-lg text-petrol">{t("donativo_titulo")}</h4>
      </div>
      <p className="mb-4 font-serif text-sm text-petrol/65">{t("donativo_descricao")}</p>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {options.map((option) => (
          <label
            key={option.value}
            className={`cursor-pointer border px-3 py-3 text-center transition-colors ${
              value === option.value
                ? "border-gold bg-gold/10 ring-1 ring-gold"
                : "border-petrol/15 bg-white/30 hover:border-gold/60"
            }`}
          >
            <input
              type="radio"
              value={option.value}
              {...registration}
              className="sr-only"
            />
            <span className="font-display text-xs uppercase tracking-wider text-petrol">
              {option.label}
            </span>
          </label>
        ))}
      </div>
      {value === "custom" && (
        <div className="mt-4 max-w-xs">
          <label htmlFor="donativo-custom" className="label-sacred">
            {t("donativo_valor")}
          </label>
          <div className="relative">
            <input
              id="donativo-custom"
              type="number"
              inputMode="decimal"
              min="0.01"
              max="10000"
              step="0.01"
              {...customRegistration}
              className="input-sacred !pr-8"
              placeholder="0,00"
            />
            <span className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 font-serif text-petrol/60">
              €
            </span>
          </div>
          {customError && <ErrorText>{customError}</ErrorText>}
        </div>
      )}
      <p className="mt-3 font-serif text-xs text-petrol/55">{t("donativo_nota")}</p>
    </div>
  );
}

function Nav({ back, next }: { back: () => void; next: () => void }) {
  const t = useTranslations("inscricao");
  return <div className="flex gap-4 pt-4"><button type="button" onClick={back} className="btn-ghost">{t("btn_voltar")}</button><button type="button" onClick={next} className="btn-primary flex-1">{t("btn_continuar")}</button></div>;
}

function PriceSummary({ calculation, locale }: { calculation: ReturnType<typeof calcularInscricao>; locale: string }) {
  const t = useTranslations("inscricao");
  const discountLabel = calculation.tipoDescontoPromocional === "percentage"
    ? t("desconto_codigo_resumo_percentagem", { percentagem: calculation.valorDescontoPromocional })
    : t("desconto_codigo_resumo_fixo", { valor: formatarEuros(calculation.valorDescontoPromocional, locale) });
  return <div className="bg-petrol text-cream-50 p-6 space-y-3 font-serif"><div className="font-display text-xs tracking-widest uppercase text-gold mb-4">{t("resumo")}</div>{calculation.participantes.map((p) => <div key={`${p.nome}-${p.idade}`} className="flex justify-between text-sm"><span>{p.nome} · {t("idade_anos", { idade: p.idade })}</span><span>{formatarEuros(p.precoIndividualCentimos, locale)}</span></div>)}{calculation.descontoFamiliaCentimos > 0 && <div className="flex justify-between text-sm text-gold"><span>{t("desconto_familia")}</span><span>−{formatarEuros(calculation.descontoFamiliaCentimos, locale)}</span></div>}{calculation.descontoPromocionalCentimos > 0 && <div className="flex justify-between text-sm text-gold"><span>{discountLabel}</span><span>−{formatarEuros(calculation.descontoPromocionalCentimos, locale)}</span></div>}<div className="flex justify-between text-sm"><span>{t("extras")}</span><span>{formatarEuros(calculation.extrasCentimos, locale)}</span></div>{calculation.donativoCentimos > 0 && <div className="flex justify-between text-sm text-gold"><span>{t("donativo_resumo")}</span><span>+{formatarEuros(calculation.donativoCentimos, locale)}</span></div>}<div className="pt-4 border-t border-cream-50/20 flex justify-between font-display text-xl text-gold"><span>{t("total_label")}</span><span>{formatarEuros(calculation.totalCentimos, locale)}</span></div></div>;
}

const Checkbox = ({ label, error, ...props }: { label: ReactNode; error?: string } & InputHTMLAttributes<HTMLInputElement>) => <div><label className="flex items-start gap-3 cursor-pointer"><input type="checkbox" {...props} className="mt-1 w-4 h-4 accent-gold" /><span className="font-serif text-sm text-petrol/80">{label}</span></label>{error && <ErrorText>{error}</ErrorText>}</div>;

function Result({ result }: { result: ResultadoPagamento }) {
  const t = useTranslations("inscricao");
  if (!result.ok) return <div className="text-center py-8"><h3 className="font-display text-2xl text-petrol mb-3">{t("erro_titulo")}</h3><p className="font-serif text-petrol/70 mb-6">{result.erro}</p><button type="button" onClick={() => window.location.reload()} className="btn-primary">{t("erro_tentar")}</button></div>;
  if (result.resumed && result.checkoutUrl) {
    return <div className="text-center py-8"><CreditCard className="mx-auto text-gold mb-5" size={42} /><h3 className="font-display text-3xl text-petrol mb-3">{t("pagamento_pendente_titulo")}</h3><p className="font-serif text-petrol/70">{t("pagamento_pendente_texto")}</p><p className="font-display text-xs tracking-widest text-petrol/40 mt-6">{t("referencia")}: {result.orderId}</p><a href={result.checkoutUrl} className="btn-primary inline-flex mt-8">{t("pagamento_continuar")}</a></div>;
  }
  return <div className="text-center py-8"><Check className="mx-auto text-gold mb-5" size={42} /><h3 className="font-display text-3xl text-petrol mb-3">{result.metodoPagamento === "manual" ? t("registada_titulo") : t("isento_titulo")}</h3><p className="font-serif text-petrol/70">{result.metodoPagamento === "manual" ? t("registada_desc") : t("isento_desc")}</p><p className="font-display text-xs tracking-widest text-petrol/40 mt-6">{t("referencia")}: {result.orderId}</p>{result.ticketUrl && <a href={result.ticketUrl} className="btn-primary inline-flex mt-8">{t("descarregar_bilhete")}</a>}</div>;
}
