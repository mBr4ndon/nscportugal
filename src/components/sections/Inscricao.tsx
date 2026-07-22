"use client";

import { useEffect, useMemo, useState, type InputHTMLAttributes, type ReactNode } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { Check, CreditCard, Loader2, Plus, Trash2 } from "lucide-react";
import { getCountryCallingCode, isSupportedCountry, type CountryCode } from "libphonenumber-js";
import { COUNTRY_CODES, nomePais } from "@/lib/countries";
import { calcularInscricao, formatarEuros } from "@/lib/pricing";
import { inscricaoSchema, type InscricaoData } from "@/types/inscricao";

type Etapa = "dados" | "participacao" | "servicos" | "pagamento" | "resultado";

interface ResultadoPagamento {
  ok: boolean;
  orderId?: string;
  metodoPagamento?: "stripe" | "manual" | "isento";
  checkoutUrl?: string;
  mensagem?: string;
  erro?: string;
}

const emptyServices = { dormidaNazare: false, dormidaFatima: false, transporteNazare: false };

export function Inscricao() {
  const t = useTranslations("inscricao");
  const locale = useLocale();
  const [etapa, setEtapa] = useState<Etapa>("dados");
  const [submitting, setSubmitting] = useState(false);
  const [resultado, setResultado] = useState<ResultadoPagamento | null>(null);
  const paymentsEnabled = process.env.NEXT_PUBLIC_PAYMENTS_ENABLED === "true";
  const form = useForm<InscricaoData>({
    resolver: zodResolver(inscricaoSchema),
    mode: "onBlur",
    defaultValues: {
      nome: "", apelido: "", dataNascimento: "", email: "", telefone: "+351 ", nacionalidade: "PT",
      morada: "", codigoPostal: "", localidade: "", contactoEmergenciaNome: "", contactoEmergenciaTelefone: "+351 ",
      estadoVida: "leigo", tipoInscricao: "individual", servicos: emptyServices, membrosFamilia: [],
      aceitaRegulamento: false as true,
      aceitaRGPD: false as true, autorizaImagem: false, locale,
    },
  });
  const { register, control, handleSubmit, watch, setValue, trigger, formState: { errors } } = form;
  const { fields, append, remove } = useFieldArray({ control, name: "membrosFamilia" });
  const values = watch();
  const estadoVida = watch("estadoVida");
  const nacionalidade = watch("nacionalidade");
  const tipoInscricao = watch("tipoInscricao");
  const countries = useMemo(() => COUNTRY_CODES
    .map((code) => ({ code, name: nomePais(code, locale) }))
    .sort((a, b) => a.name.localeCompare(b.name, locale)), [locale]);

  useEffect(() => {
    if (estadoVida !== "leigo") {
      setValue("tipoInscricao", "individual");
      setValue("membrosFamilia", []);
    }
  }, [estadoVida, setValue]);

  const preview = useMemo(() => {
    const parsed = inscricaoSchema.safeParse({
      ...values,
      aceitaRegulamento: true,
      aceitaRGPD: true,
    });
    return parsed.success ? calcularInscricao(parsed.data) : null;
  }, [values]);

  async function next() {
    const fieldsByStep: Record<Exclude<Etapa, "resultado">, Parameters<typeof trigger>[0]> = {
      dados: ["nome", "apelido", "dataNascimento", "email", "telefone", "nacionalidade", "morada", "codigoPostal", "localidade", "contactoEmergenciaNome", "contactoEmergenciaTelefone"],
      participacao: ["estadoVida", "tipoInscricao", "afiliacaoTipo", "afiliacaoNome", "membrosFamilia"],
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
      if (json.ok && json.checkoutUrl) {
        window.location.assign(json.checkoutUrl);
        return;
      }
      setResultado(json);
      setEtapa("resultado");
    } catch {
      setResultado({ ok: false, erro: "Falha de ligação. Verifique a sua internet e tente novamente." });
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
          {etapa === "dados" && <div className="space-y-7">
            <StepTitle title="Dados do responsável" />
            <div className="grid md:grid-cols-2 gap-6">
              <Field label="Nome" error={errors.nome?.message}><input {...register("nome")} className="input-sacred" autoComplete="given-name" /></Field>
              <Field label="Apelido" error={errors.apelido?.message}><input {...register("apelido")} className="input-sacred" autoComplete="family-name" /></Field>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <Field label={t("campo_nasc")} error={errors.dataNascimento?.message}><input type="date" {...register("dataNascimento")} className="input-sacred" /></Field>
              <CountryField label="Nacionalidade" error={errors.nacionalidade?.message} countries={countries} registration={register("nacionalidade")} />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <Field label={t("campo_email")} error={errors.email?.message}><input type="email" {...register("email")} className="input-sacred" autoComplete="email" /></Field>
              <Controller control={control} name="telefone" render={({ field }) => <PhoneField label="Telemóvel" error={errors.telefone?.message} countries={countries} nationality={nacionalidade} value={field.value} onChange={field.onChange} autoComplete="tel" />} />
            </div>
            <Field label={t("campo_morada")} error={errors.morada?.message}><input {...register("morada")} className="input-sacred" autoComplete="street-address" /></Field>
            <div className="grid md:grid-cols-[1fr_2fr] gap-6">
              <Field label={t("campo_cp")} error={errors.codigoPostal?.message}><input {...register("codigoPostal")} className="input-sacred" autoComplete="postal-code" /></Field>
              <Field label={t("campo_localidade")} error={errors.localidade?.message}><input {...register("localidade")} className="input-sacred" autoComplete="address-level2" /></Field>
            </div>
            <div className="pt-5 border-t border-petrol/10"><h4 className="label-sacred mb-5">Contacto de emergência</h4>
              <div className="grid md:grid-cols-2 gap-6">
                <Field label="Nome" error={errors.contactoEmergenciaNome?.message}><input {...register("contactoEmergenciaNome")} className="input-sacred" /></Field>
                <Controller control={control} name="contactoEmergenciaTelefone" render={({ field }) => <PhoneField label="Telefone" error={errors.contactoEmergenciaTelefone?.message} countries={countries} value={field.value} onChange={field.onChange} />} />
              </div>
            </div>
            <button type="button" onClick={next} className="btn-primary">{t("btn_continuar")}</button>
          </div>}

          {etapa === "participacao" && <div className="space-y-8">
            <StepTitle title="Participantes" />
            <RadioCards label="Estado de vida" name="estadoVida" register={register} options={[
              ["leigo", "Leigo"], ["sacerdote", "Sacerdote"], ["religioso", "Religioso / Religiosa"],
            ]} value={estadoVida} />
            {estadoVida !== "leigo" && <div className="grid md:grid-cols-2 gap-6">
              <Field label="Tipo de instituição" error={errors.afiliacaoTipo?.message}><select {...register("afiliacaoTipo")} className="input-sacred"><option value="">Seleccionar</option><option value="diocese">Diocese</option><option value="instituto">Instituto</option><option value="congregacao">Congregação</option><option value="ordem">Ordem</option><option value="outro">Outro</option></select></Field>
              <Field label="Nome da instituição" error={errors.afiliacaoNome?.message}><input {...register("afiliacaoNome")} className="input-sacred" /></Field>
            </div>}
            {estadoVida === "leigo" && <RadioCards label="Tipo de inscrição" name="tipoInscricao" register={register} options={[["individual", "Individual"], ["familia", "Família"]]} value={tipoInscricao} />}
            <div className="p-5 bg-petrol/[0.04] border border-petrol/10 font-serif text-sm text-petrol/75">
              Rota atribuída: <strong>{tipoInscricao === "familia" ? "Famílias — cerca de 10 km por dia" : "Adultos — cerca de 25 km por dia"}</strong>
            </div>
            {tipoInscricao === "familia" && <div className="space-y-6">
              <div className="flex items-center justify-between"><div><h4 className="font-display text-xl text-petrol">Membros da família</h4><p className="font-serif text-sm text-petrol/60 mt-1">Além do responsável indicado na etapa anterior.</p></div>
                <button type="button" className="btn-ghost flex items-center gap-2" onClick={() => append({ nome: "", apelido: "", dataNascimento: "", nacionalidade: "PT", servicos: emptyServices })}><Plus size={16} /> Adicionar</button>
              </div>
              {fields.map((field, index) => <div key={field.id} className="p-5 border border-petrol/15 space-y-5">
                <div className="flex justify-between"><span className="label-sacred">Membro {index + 2}</span><button type="button" onClick={() => remove(index)} className="text-red-700/70" aria-label="Remover membro"><Trash2 size={18} /></button></div>
                <div className="grid md:grid-cols-2 gap-5"><Field label="Nome" error={errors.membrosFamilia?.[index]?.nome?.message}><input {...register(`membrosFamilia.${index}.nome`)} className="input-sacred" /></Field><Field label="Apelido" error={errors.membrosFamilia?.[index]?.apelido?.message}><input {...register(`membrosFamilia.${index}.apelido`)} className="input-sacred" /></Field></div>
                <div className="grid md:grid-cols-2 gap-5"><Field label="Data de nascimento" error={errors.membrosFamilia?.[index]?.dataNascimento?.message}><input type="date" {...register(`membrosFamilia.${index}.dataNascimento`)} className="input-sacred" /></Field><CountryField label="Nacionalidade" error={errors.membrosFamilia?.[index]?.nacionalidade?.message} countries={countries} registration={register(`membrosFamilia.${index}.nacionalidade`)} /></div>
              </div>)}
              {typeof errors.membrosFamilia?.message === "string" && <ErrorText>{errors.membrosFamilia.message}</ErrorText>}
            </div>}
            <Nav back={() => setEtapa("dados")} next={next} />
          </div>}

          {etapa === "servicos" && <div className="space-y-7">
            <StepTitle title="Dormidas e transporte" />
            <p className="font-serif text-petrol/70">Cada opção custa 5 € por participante e representa uma manifestação de interesse. A organização confirmará posteriormente a disponibilidade.</p>
            <Services title={`${values.nome || "Responsável"} ${values.apelido || ""}`} prefix="servicos" register={register} />
            {fields.map((field, index) => <Services key={field.id} title={`${values.membrosFamilia?.[index]?.nome || `Membro ${index + 2}`} ${values.membrosFamilia?.[index]?.apelido || ""}`} prefix={`membrosFamilia.${index}.servicos`} register={register} />)}
            <Nav back={() => setEtapa("participacao")} next={next} />
          </div>}

          {etapa === "pagamento" && <div className="space-y-8">
            <StepTitle title="Resumo e pagamento" />
            {preview && <PriceSummary calculation={preview} locale={locale} />}
            {paymentsEnabled && (!preview || preview.totalCentimos > 0) && <div className="p-6 border border-petrol/15 bg-white/30">
              <div className="flex items-center gap-3 mb-3"><CreditCard className="text-gold" /><h4 className="font-display text-lg text-petrol">Pagamento seguro com Stripe</h4></div>
              <p className="font-serif text-sm text-petrol/70 mb-4">Na página de pagamento poderá escolher cartão bancário, MB WAY, Apple Pay ou Google Pay, conforme a disponibilidade no seu dispositivo.</p>
              <div className="flex flex-wrap gap-2 font-display text-[10px] tracking-wider uppercase text-petrol/60"><span className="border border-petrol/15 px-3 py-2">Cartão</span><span className="border border-petrol/15 px-3 py-2">MB WAY</span><span className="border border-petrol/15 px-3 py-2">Apple Pay</span><span className="border border-petrol/15 px-3 py-2">Google Pay</span></div>
            </div>}
            {!paymentsEnabled && preview && preview.totalCentimos > 0 && <div className="p-6 border border-gold/30 bg-gold/5">
              <h4 className="font-display text-lg text-petrol mb-2">Pagamento ainda não disponível</h4>
              <p className="font-serif text-sm text-petrol/70">Para esta fase de testes, a inscrição será guardada com o pagamento pendente. Não será efetuada qualquer cobrança.</p>
            </div>}
            <div className="space-y-4 pt-5 border-t border-petrol/10">
              <Checkbox label={<>{t("aceita_reg_pre")} <a href="/regulamento" target="_blank" className="text-gold underline">{t("aceita_reg_link")}</a>.</>} {...register("aceitaRegulamento")} error={errors.aceitaRegulamento?.message} />
              <Checkbox label={<>{t("aceita_rgpd_pre")} <a href="/politica-privacidade" target="_blank" className="text-gold underline">{t("aceita_rgpd_link")}</a>.</>} {...register("aceitaRGPD")} error={errors.aceitaRGPD?.message} />
              <Checkbox label={t("autoriza_imagem")} {...register("autorizaImagem")} />
            </div>
            <div className="flex gap-4"><button type="button" className="btn-ghost" onClick={() => setEtapa("servicos")} disabled={submitting}>{t("btn_voltar")}</button><button type="submit" className="btn-primary flex-1" disabled={submitting}>{submitting ? <><Loader2 className="inline animate-spin mr-2" size={16} />{t("btn_processar")}</> : preview?.totalCentimos === 0 ? "Confirmar inscrição" : paymentsEnabled ? "Continuar para pagamento seguro" : "Registar inscrição de teste"}</button></div>
          </div>}

          {etapa === "resultado" && resultado && <Result result={resultado} />}
        </form>
      </div></div>
    </section>
  );
}

function StepTitle({ title }: { title: string }) { return <div><h3 className="font-display text-2xl text-petrol mb-2">{title}</h3><div className="w-12 h-px bg-gold" /></div>; }
function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) { return <div><label className="label-sacred">{label}</label>{children}{error && <ErrorText>{error}</ErrorText>}</div>; }
function ErrorText({ children }: { children: ReactNode }) { return <p className="mt-1 text-xs font-serif italic text-red-700/80">{children}</p>; }

function CountryField({ label, error, countries, registration }: { label: string; error?: string; countries: { code: string; name: string }[]; registration: ReturnType<ReturnType<typeof useForm<InscricaoData>>["register"]> }) {
  return <Field label={label} error={error}><select {...registration} className="input-sacred">{countries.map((country) => <option key={country.code} value={country.code}>{country.name}</option>)}</select></Field>;
}

function PhoneField({
  label, error, countries, nationality, value, onChange, autoComplete,
}: {
  label: string;
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
        aria-label={`${label}: país do indicativo`}
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

function RadioCards({ label, name, register, options, value }: { label: string; name: "estadoVida" | "tipoInscricao"; register: ReturnType<typeof useForm<InscricaoData>>["register"]; options: string[][]; value: string }) {
  return <div><label className="label-sacred">{label}</label><div className={`grid gap-3 mt-3 ${options.length === 3 ? "md:grid-cols-3" : "grid-cols-2"}`}>{options.map(([key, text]) => <label key={key} className={`cursor-pointer p-5 border text-center ${value === key ? "border-gold bg-gold/5 ring-1 ring-gold" : "border-petrol/20"}`}><input type="radio" value={key} {...register(name)} className="sr-only" /><span className="font-display text-sm text-petrol">{text}</span></label>)}</div></div>;
}

function Services({ title, prefix, register }: { title: string; prefix: "servicos" | `membrosFamilia.${number}.servicos`; register: ReturnType<typeof useForm<InscricaoData>>["register"] }) {
  const options = [["dormidaNazare", "Dormida na Nazaré — sexta-feira, 9 de outubro"], ["dormidaFatima", "Dormida em Fátima — segunda-feira, 12 de outubro"], ["transporteNazare", "Transporte de Fátima para a Nazaré — 12 de outubro"]] as const;
  return <div className="p-5 border border-petrol/15"><h4 className="font-display text-lg text-petrol mb-4">{title}</h4><div className="space-y-3">{options.map(([key, text]) => <label key={key} className="flex items-center gap-3 font-serif text-sm text-petrol/80"><input type="checkbox" {...register(`${prefix}.${key}` as const)} className="w-4 h-4 accent-gold" /><span className="flex-1">{text}</span><span className="text-gold">+5 €</span></label>)}</div></div>;
}

function Nav({ back, next }: { back: () => void; next: () => void }) { return <div className="flex gap-4 pt-4"><button type="button" onClick={back} className="btn-ghost">← Voltar</button><button type="button" onClick={next} className="btn-primary flex-1">Continuar →</button></div>; }

function PriceSummary({ calculation, locale }: { calculation: ReturnType<typeof calcularInscricao>; locale: string }) {
  return <div className="bg-petrol text-cream-50 p-6 space-y-3 font-serif"><div className="font-display text-xs tracking-widest uppercase text-gold mb-4">Resumo</div>{calculation.participantes.map((p) => <div key={`${p.nome}-${p.idade}`} className="flex justify-between text-sm"><span>{p.nome} · {p.idade} anos</span><span>{formatarEuros(p.precoIndividualCentimos, locale)}</span></div>)}{calculation.descontoFamiliaCentimos > 0 && <div className="flex justify-between text-sm text-gold"><span>Desconto até ao limite familiar</span><span>−{formatarEuros(calculation.descontoFamiliaCentimos, locale)}</span></div>}<div className="flex justify-between text-sm"><span>Dormidas e transporte</span><span>{formatarEuros(calculation.extrasCentimos, locale)}</span></div><div className="pt-4 border-t border-cream-50/20 flex justify-between font-display text-xl text-gold"><span>Total</span><span>{formatarEuros(calculation.totalCentimos, locale)}</span></div></div>;
}

const Checkbox = ({ label, error, ...props }: { label: ReactNode; error?: string } & InputHTMLAttributes<HTMLInputElement>) => <div><label className="flex items-start gap-3 cursor-pointer"><input type="checkbox" {...props} className="mt-1 w-4 h-4 accent-gold" /><span className="font-serif text-sm text-petrol/80">{label}</span></label>{error && <ErrorText>{error}</ErrorText>}</div>;

function Result({ result }: { result: ResultadoPagamento }) {
  if (!result.ok) return <div className="text-center py-8"><h3 className="font-display text-2xl text-petrol mb-3">Ocorreu um problema</h3><p className="font-serif text-petrol/70 mb-6">{result.erro}</p><button type="button" onClick={() => window.location.reload()} className="btn-primary">Tentar novamente</button></div>;
  return <div className="text-center py-8"><Check className="mx-auto text-gold mb-5" size={42} /><h3 className="font-display text-3xl text-petrol mb-3">{result.metodoPagamento === "manual" ? "Inscrição registada" : "Inscrição confirmada"}</h3><p className="font-serif text-petrol/70">{result.mensagem}</p><p className="font-display text-xs tracking-widest text-petrol/40 mt-6">REFERÊNCIA: {result.orderId}</p></div>;
}
