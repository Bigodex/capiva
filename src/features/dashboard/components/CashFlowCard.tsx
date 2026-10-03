export function CashFlowCard() {
  return (
    <section className="cash-flow-card">
      <div className="cash-flow-card__header">
        <div>
          <h3 className="cash-flow-card__title">Fluxo financeiro</h3>
          <p className="cash-flow-card__subtitle">
            Entradas e saídas do mês
          </p>
        </div>

        <button className="cash-flow-card__filter">
          Este mês
        </button>
      </div>

      <div className="cash-flow-card__content">
        <div className="cash-flow-card__placeholder">
          Gráfico em breve
        </div>
      </div>
    </section>
  );
}