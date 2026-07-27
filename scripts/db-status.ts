import postgres from "postgres";

const databaseUrl = process.env.DIRECT_DATABASE_URL ?? process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("Configure DIRECT_DATABASE_URL ou DATABASE_URL.");
}

const sql = postgres(databaseUrl, {
  max: 1,
  connect_timeout: 15,
  idle_timeout: 5,
  prepare: false,
});

async function main() {
  try {
    const [database] = await sql`
      SELECT current_database() AS name, current_user AS username, now() AS checked_at
    `;
    const tables = await sql`
      SELECT tablename
      FROM pg_tables
      WHERE schemaname = 'public'
      ORDER BY tablename
    `;
    const migrations = await sql`
      SELECT filename, applied_at
      FROM schema_migrations
      ORDER BY filename
    `.catch(() => []);

    console.log(`Base: ${database.name}`);
    console.log(`Utilizador: ${database.username}`);
    console.log(`Ligação verificada: ${database.checked_at.toISOString()}`);
    console.log(`Tabelas: ${tables.map((table) => table.tablename).join(", ") || "nenhuma"}`);
    console.log(`Migrações registadas: ${migrations.length}`);
  } finally {
    await sql.end();
  }
}

main().catch((error) => {
  console.error("Falha ao verificar a base de dados:", error);
  process.exitCode = 1;
});
