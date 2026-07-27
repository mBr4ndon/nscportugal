# Peregrinação de Nossa Senhora da Cristandade

Website oficial da Peregrinação de Nossa Senhora da Cristandade, iniciativa apoiada pelo Instituto São Nuno de Santa Maria (ISNSM).

## Stack Técnica

- **Framework**: Next.js 15 (App Router) + TypeScript
- **Styling**: Tailwind CSS 3.4 com design system sacro customizado
- **Formulários**: React Hook Form + Zod (validação)
- **Animações**: Framer Motion + CSS animations
- **Pagamentos**: Stripe Checkout (cartão, MB WAY, Apple Pay e Google Pay)
- **Fontes**: Cinzel (display) + Cormorant Garamond (corpo) + Inter (sans)

## Design System

### Cores principais
- `#2C3E50` — Azul Petróleo (cor primária)
- `#FAF7F2` / `#FFFFFF` — Creme / Branco
- `#B08D57` — Dourado litúrgico (acento discreto)

Todas as cores estão disponíveis em `tailwind.config.ts` com escalas completas (`petrol-50` a `petrol-900`, etc.).

### Tipografia
- **Cinzel** — tipografia inscricional romana, usada para títulos, números romanos, caps tracking
- **Cormorant Garamond** — serifa litúrgica, usada para corpo de texto, citações e prosa
- **Inter** — fallback sans-serif em raros contextos funcionais

## Estrutura do Projeto

```
src/
├── app/
│   ├── api/
│   │   ├── inscricao/route.ts       # POST — recebe inscrição + gera pagamento
│   │   └── stripe/
│   │       ├── webhook/route.ts     # Webhook assinado da Stripe
│   │       └── cancel/route.ts      # Cancelamento do Checkout
│   ├── sucesso/page.tsx             # Página pós-pagamento
│   ├── layout.tsx                   # Layout raiz + fontes
│   ├── page.tsx                     # Landing page
│   └── globals.css                  # Design tokens globais
├── components/
│   ├── Header.tsx                   # Nav fixa com scroll-aware
│   ├── Footer.tsx                   # Footer institucional
│   ├── sections/                    # Secções da landing
│   │   ├── Hero.tsx
│   │   ├── Sobre.tsx
│   │   ├── Historia.tsx
│   │   ├── Percurso.tsx
│   │   ├── Programa.tsx
│   │   ├── Inscricao.tsx           # Formulário multi-etapas + Stripe Checkout
│   │   ├── Testemunhos.tsx
│   │   ├── FAQ.tsx
│   │   └── Contactos.tsx
│   └── ui/
│       ├── Logo.tsx                 # Logo em SVG inline
│       └── Ornament.tsx             # Divisores sacros
├── lib/
│   ├── stripe.ts                    # Cliente Stripe server-side
│   ├── storage.ts                   # Persistência PostgreSQL
│   └── utils.ts
└── types/
    └── inscricao.ts                 # Schema Zod + tipos
```

## Setup e Instalação

### 1. Clonar e instalar

```bash
cd peregrinacao-nossa-senhora-cristandade
npm install
```

### 2. Configurar variáveis de ambiente

```bash
cp .env.example .env.local
```

Preenche as ligações obtidas no painel Neon:

```
DATABASE_URL=postgresql://...-pooler.../neondb?sslmode=require
DIRECT_DATABASE_URL=postgresql://.../neondb?sslmode=require
NEXT_PUBLIC_PAYMENTS_ENABLED=false
```

`DATABASE_URL` deve ser a ligação pooled para a aplicação. `DIRECT_DATABASE_URL`
deve ser a ligação direta e é utilizada apenas pelas migrações.

Aplica todas as migrações pendentes:

```bash
npm run db:migrate
```

Confirma a ligação e o estado da base:

```bash
npm run db:status
```

### 3. Desenvolvimento

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

### 4. Build de produção

```bash
npm run build
npm start
```

## Pagamentos

O formulário e a API de novas inscrições podem ser encerrados com:

```env
REGISTRATIONS_ENABLED=false
```

Neste modo, a página mostra a mensagem localizada «Inscrições em breve» e a API
recusa novas inscrições. Se a variável estiver ausente ou tiver o valor `true`,
o formulário permanece disponível. Depois de alterar a variável na Vercel, é
necessário criar um novo deployment.

Os pagamentos estão desativados enquanto:

```env
NEXT_PUBLIC_PAYMENTS_ENABLED=false
```

Neste modo, inscrições com valor ficam guardadas como `pending_payment`, com
método `manual`, e nenhuma cobrança é iniciada. Inscrições totalmente isentas
ficam confirmadas imediatamente.

### Integração Stripe

Em desenvolvimento, usa apenas chaves de teste:

```env
NEXT_PUBLIC_PAYMENTS_ENABLED=true
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

Nunca coloques estas chaves no Git. Na Vercel, configura as mesmas variáveis em
**Project Settings → Environment Variables**, usando chaves `sk_live_...` apenas
quando o fluxo de teste estiver validado.

### Códigos de desconto

Os códigos podem aplicar uma percentagem ou definir um preço promocional fixo
para a inscrição, depois do limite familiar. Por exemplo, se o preço base for
200 € e o código fixo indicar 30 €, a inscrição passa a custar 30 €. Os serviços
extra de 5 € e os donativos são somados depois e nunca são afetados pelo código.

Depois de aplicar a migração `007_discount_codes.sql`, cria um código na consola
SQL do Neon:

```sql
INSERT INTO discount_codes (code, percentage, max_redemptions, valid_until)
VALUES ('AMIGO25', 25, 10, '2026-10-01T23:59:59+01:00');
```

Para definir um preço promocional fixo de 30 € (o valor é guardado em cêntimos):

```sql
INSERT INTO discount_codes (
  code, discount_type, percentage, fixed_amount_cents, max_redemptions
)
VALUES ('PRECO30', 'fixed', NULL, 3000, 10);
```

Para códigos percentuais, `discount_type` pode ser omitido porque o valor por
defeito é `percentage`. Para códigos de preço fixo, `percentage` tem de ser `NULL` e
`fixed_amount_cents` tem de estar entre 1 e 1 000 000 cêntimos.

`max_redemptions` pode ser `NULL` para utilizações ilimitadas. `valid_from` e
`valid_until` também são opcionais. Os códigos não distinguem maiúsculas de
minúsculas.

Para criar um código individual de utilização única:

```sql
INSERT INTO discount_codes (code, percentage, max_redemptions)
VALUES ('PEREGRINO100', 100, 1);
```

Mesmo com 100% de desconto, as dormidas e o transporte selecionados continuam a
ser cobrados. Para desativar um código:

```sql
UPDATE discount_codes SET active = false, updated_at = now()
WHERE upper(code) = 'AMIGO25';
```

### Donativos

No resumo da inscrição, o participante pode optar por não doar, arredondar o
total ao euro seguinte, acrescentar 5 €, 10 € ou 25 €, ou indicar outro valor
entre 0,01 € e 10 000 €. O donativo é calculado depois dos descontos e dos
serviços extra e nunca é reduzido por um código de desconto. O valor fica guardado separadamente em
`registrations.donation_amount_cents` e aparece como uma linha própria no
Checkout da Stripe.

### Fluxo de pagamento

1. Utilizador preenche o formulário de inscrição
2. Frontend faz `POST /api/inscricao` com os dados validados
3. Backend guarda a inscrição como pendente e cria uma Stripe Checkout Session
4. O utilizador escolhe cartão, MB WAY, Apple Pay ou Google Pay na página Stripe
5. Stripe envia `checkout.session.completed` para `/api/stripe/webhook`
6. O webhook valida a assinatura, o montante e confirma a inscrição

### Configurar o webhook no Dashboard Stripe

Cria um endpoint para `https://teudominio.pt/api/stripe/webhook` com os eventos:

- `checkout.session.completed`
- `checkout.session.async_payment_succeeded`
- `checkout.session.async_payment_failed`
- `checkout.session.expired`

### Testar em desenvolvimento

Instala a Stripe CLI, autentica e encaminha webhooks para o servidor local:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Coloca o valor `whsec_...` apresentado pela CLI em `STRIPE_WEBHOOK_SECRET`.

Noutro terminal, inicia a aplicação:

```bash
npm run dev
```

Para testar um pagamento aprovado por cartão, usa `4242 4242 4242 4242`, uma
data futura e qualquer CVC. Testa também o cartão recusado
`4000 0000 0000 0002` e o fluxo 3D Secure com
`4000 0000 0000 3220`.

No final de cada cenário, confirma no Neon:

- pagamento aprovado: `payments.status = 'paid'` e
  `registrations.status = 'confirmed'`;
- cancelamento ou falha assíncrona: pagamento `failed` e inscrição `cancelled`;
- sessão expirada: pagamento e inscrição `expired`.

Apple Pay e Google Pay só são apresentados pela Stripe em dispositivos,
navegadores e wallets compatíveis. O MB WAY deve ser ativado em
**Stripe Dashboard → Settings → Payment methods**.

## TODO — Próximos Passos

### Funcionalidade
- [x] Persistência PostgreSQL de inscrições, participantes, serviços e pagamentos
- [ ] Envio de emails de confirmação via **Resend** ou **Postmark**
- [ ] Dashboard administrativo para gestão de inscrições
- [ ] Exportação de lista de peregrinos para CSV
- [ ] Notificação ao ISNSM (email ou Slack) por cada nova inscrição confirmada

### Conteúdo
- [ ] Substituir todos os placeholders `{/* [COPY: ...] */}` pelos textos finais
- [ ] Adicionar fotos reais de peregrinações anteriores / similares (Chartres, etc.)
- [ ] Criar e adicionar páginas legais:
  - `/regulamento`
  - `/politica-privacidade`
  - `/termos`
  - `/reembolsos`
- [ ] Adicionar favicon e ícone da aplicação (usar o logo NSC)
- [ ] Configurar OG images para partilha em redes sociais

### SEO & Performance
- [ ] Sitemap + robots.txt
- [ ] Meta tags específicas por página
- [ ] Otimização de imagens (Next.js Image)
- [ ] Schema.org markup (Event + Organization)

### Deployment
- [ ] Deploy na **Vercel** (recomendado — zero config para Next.js)
- [ ] Domínio `peregrinacaocristandade.pt` (ou outro)
- [ ] SSL automático (Vercel trata)
- [ ] Analytics (Plausible / Fathom — GDPR-friendly)

## Licença

Iniciativa apoiada pelo Instituto São Nuno de Santa Maria (ISNSM).

---

*Ad maiorem Dei gloriam · Per Mariam ad Iesum*
