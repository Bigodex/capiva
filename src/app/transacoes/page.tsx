import { AppShell } from "@/components/layout/AppShell";
import { TransactionsPageContent } from "@/features/dashboard/components/TransactionsPageContent";

export default function TransactionsPage() {
  return (
    <AppShell
      title="Transações"
      subtitle="Consulte e gerencie todas as suas movimentações financeiras."
    >
      <TransactionsPageContent />
    </AppShell>
  );
}