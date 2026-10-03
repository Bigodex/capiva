import { SummaryCard } from "./SummaryCard";

export function SummaryCards() {
  return (
    <section className="summary-cards">
      <SummaryCard
        title="Saldo disponível"
        value="R$ 6.240,00"
        description="Valor atual disponível"
      />

      <SummaryCard
        title="Receitas"
        value="R$ 9.800,00"
        description="Entradas neste mês"
      />

      <SummaryCard
        title="Despesas"
        value="R$ 3.560,00"
        description="Gastos neste mês"
      />

      <SummaryCard
        title="Economia"
        value="R$ 6.240,00"
        description="Diferença entre entradas e saídas"
      />
    </section>
  );
}