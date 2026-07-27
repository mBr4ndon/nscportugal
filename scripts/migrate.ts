import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import postgres from "postgres";

const databaseUrl = process.env.DIRECT_DATABASE_URL ?? process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("Configure DIRECT_DATABASE_URL ou DATABASE_URL antes de executar as migrações.");
}

const sql = postgres(databaseUrl, {
  max: 1,
  connect_timeout: 15,
  idle_timeout: 5,
  prepare: false,
});

async function migrate() {
  await sql`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      filename text PRIMARY KEY,
      applied_at timestamptz NOT NULL DEFAULT now()
    )
  `;

  const migrationsDir = path.join(process.cwd(), "db", "migrations");
  const files = (await readdir(migrationsDir))
    .filter((filename) => /^\d+_.+\.sql$/.test(filename))
    .sort();

  for (const filename of files) {
    const [existing] = await sql`
      SELECT filename FROM schema_migrations WHERE filename = ${filename}
    `;
    if (existing) {
      console.log(`- ${filename} já aplicada`);
      continue;
    }

    const contents = await readFile(path.join(migrationsDir, filename), "utf8");
    await sql.begin(async (transaction) => {
      await transaction.unsafe(contents);
      await transaction`
        INSERT INTO schema_migrations (filename) VALUES (${filename})
      `;
    });
    console.log(`✓ ${filename} aplicada`);
  }
}

async function main() {
  try {
    await migrate();
    console.log("Base de dados atualizada.");
  } finally {
    await sql.end();
  }
}

main().catch((error) => {
  console.error("Falha ao aplicar migrações:", error);
  process.exitCode = 1;
});
