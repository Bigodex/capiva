export function BudgetCard() {
  return (
    <section className="budget-card">
      <div className="budget-card__header">
        <div>
          <h3 className="budget-card__title">Orçamento mensal</h3>

          <p className="budget-card__subtitle">
            Controle dos seus gastos no mês
          </p>
        </div>

        <button className="budget-card__action">
          Ver detalhes
        </button>
      </div>

      <div className="budget-card__values">
        <div>
          <span className="budget-card__label">
            Utilizado
          </span>

          <strong className="budget-card__value">
            R$ 3.560,00
          </strong>
        </div>

        <div className="budget-card__limit">
          <span className="budget-card__label">
            Limite
          </span>

          <strong className="budget-card__value">
            R$ 5.000,00
          </strong>
        </div>
      </div>

      <div className="budget-card__progress">
        <div className="budget-card__progress-bar" />
      </div>

      <div className="budget-card__footer">
        <span>71% utilizado</span>

        <span>R$ 1.440,00 disponível</span>
      </div>
    </section>
  );
}