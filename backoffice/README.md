# Backoffice — Peregrinação NSC 2026

Aplicação independente para acompanhar inscrições, participantes, pagamentos,
donativos e serviços da peregrinação.

## Configuração

1. Copiar `.env.example` para `.env.local`.
2. Usar em `DATABASE_URL` a mesma base PostgreSQL do site principal.
3. Definir `BACKOFFICE_PASSWORD` e um `SESSION_SECRET` aleatório e longo.
4. Executar `npm install` e `npm run dev` dentro desta pasta.

Em produção, é recomendável que `DATABASE_URL` utilize um utilizador PostgreSQL
com permissões apenas de leitura sobre as tabelas de inscrições.

Para publicar na Vercel como aplicação separada, criar um novo projeto com
`backoffice` como Root Directory e configurar as três variáveis de ambiente.
