const transactions = [
  {
    id: 1,
    title: "Salário",
    category: "Receita",
    date: "01 Out",
    amount: "+ R$ 7.500,00",
    type: "income",
  },
  {
    id: 2,
    title: "Supermercado",
    category: "Alimentação",
    date: "02 Out",
    amount: "- R$ 342,90",
    type: "expense",
  },
  {
    id: 3,
    title: "Internet",
    category: "Casa",
    date: "02 Out",
    amount: "- R$ 212,00",
    type: "expense",
  },
  {
    id: 4,
    title: "Restaurante",
    category: "Alimentação",
    date: "03 Out",
    amount: "- R$ 89,90",
    type: "expense",
  },
];

export function RecentTransactions() {
  return (
    <section className="recent-transactions">
      <div className="recent-transactions__header">
        <div>
          <h3 className="recent-transactions__title">
            Últimos lançamentos
          </h3>

          <p className="recent-transactions__subtitle">
            Suas movimentações mais recentes
          </p>
        </div>

        <button className="recent-transactions__action">
          Ver todos
        </button>
      </div>

      <div className="recent-transactions__list">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="recent-transactions__item"
          >
            <div className="recent-transactions__info">
              <strong>{transaction.title}</strong>

              <span>
                {transaction.category} · {transaction.date}
              </span>
            </div>

            <strong
              className={`recent-transactions__amount recent-transactions__amount--${transaction.type}`}
            >
              {transaction.amount}
            </strong>
          </div>
        ))}
      </div>
    </section>
  );
}