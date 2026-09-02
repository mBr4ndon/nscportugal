import postgres from "postgres";

const databaseUrl = process.env.DATABASE_URL;

export const sql = databaseUrl
  ? postgres(databaseUrl, {
      max: 5,
      idle_timeout: 20,
      connect_timeout: 15,
      prepare: false,
    })
  : null;

export function getDb() {
  if (!sql) throw new Error("DATABASE_URL não configurada");
  return sql;
}

export function hasDatabaseConfiguration() {
  return Boolean(databaseUrl);
}
