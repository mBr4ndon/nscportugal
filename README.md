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

Preenche as variáveis obtidas no Dashboard Stripe e na base PostgreSQL:

```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
DATABASE_URL=postgresql://utilizador:password@host:5432/peregrinacao?sslmode=require
```

Antes de abrir as inscrições, execute por ordem os ficheiros de `db/migrations/` na base PostgreSQL.

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

## Integração Stripe

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
- `checkout.session.expired`

### Testar em desenvolvimento

Instala a Stripe CLI, autentica e encaminha webhooks para o servidor local:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Coloca o valor `whsec_...` apresentado pela CLI em `STRIPE_WEBHOOK_SECRET`.

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
