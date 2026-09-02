import { DatabaseZap } from "lucide-react";
import { DashboardClient } from "@/components/DashboardClient";
import { getDashboardData } from "@/lib/dashboard";
import { hasDatabaseConfiguration } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  if (!hasDatabaseConfiguration()) {
    return (
      <main className="configuration-page">
        <div className="configuration-card">
          <DatabaseZap size={34} />
          <p className="eyebrow">Configuração necessária</p>
          <h1>Ligue o backoffice à base de dados</h1>
          <p>Defina <code>DATABASE_URL</code> com a mesma ligação PostgreSQL utilizada pelo site de inscrições.</p>
        </div>
      </main>
    );
  }

  const data = await getDashboardData();
  return <DashboardClient data={data} />;
}
