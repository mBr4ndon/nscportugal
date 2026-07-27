import postgres from "postgres";

const databaseUrl = process.env.DATABASE_URL;

export const sql = databaseUrl
  ? postgres(databaseUrl, {
      // Uma ligação por instância serverless evita esgotar o pool do Neon.
      max: 1,
      idle_timeout: 20,
      connect_timeout: 15,
      // Compatibilidade máxima com o endpoint pooled (PgBouncer) do Neon.
      prepare: false,
    })
  : null;

export function getDb() {
  if (!sql) throw new Error("DATABASE_URL não configurada");
  return sql;
}
