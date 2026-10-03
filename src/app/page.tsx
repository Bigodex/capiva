import { AppShell } from "@/components/layout/AppShell";
import { SummaryCards } from "@/features/dashboard/components/SummaryCards";
import { CashFlowCard } from "@/features/dashboard/components/CashFlowCard";
import { BudgetCard } from "@/features/dashboard/components/BudgetCard";
import { RecentTransactions } from "@/features/dashboard/components/RecentTransactions";

export default function Home() {
  return (
    <AppShell>
      <div className="dashboard-home">
        <SummaryCards />

        <div className="dashboard-home__middle">
          <CashFlowCard />
          <BudgetCard />
        </div>

        <RecentTransactions />
      </div>
    </AppShell>
  );
}