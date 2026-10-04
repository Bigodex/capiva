import {
  CalendarClock,
  House,
  Wifi,
  Zap,
} from "lucide-react";

const bills = [
  {
    id: 1,
    title: "Aluguel",
    dueDate: "10 Out",
    amount: "R$ 1.600,00",
    icon: House,
  },
  {
    id: 2,
    title: "Internet",
    dueDate: "12 Out",
    amount: "R$ 212,00",
    icon: Wifi,
  },
  {
    id: 3,
    title: "Energia",
    dueDate: "15 Out",
    amount: "R$ 198,40",
    icon: Zap,
  },
];

export function UpcomingBills() {
  return (
    <section className="upcoming-bills">
      <div className="upcoming-bills__header">
        <div className="upcoming-bills__heading">
          <CalendarClock
            className="upcoming-bills__icon"
            size={22}
            strokeWidth={2}
          />

          <div>
            <h3 className="upcoming-bills__title">
              Próximas Contas
            </h3>

            <p className="upcoming-bills__subtitle">
              Contas que vencem nos próximos dias
            </p>
          </div>
        </div>

        <button className="upcoming-bills__action">
          Ver Todas
        </button>
      </div>

      <div className="upcoming-bills__list">
        {bills.map((bill) => {
          const BillIcon = bill.icon;

          return (
            <div
              key={bill.id}
              className="upcoming-bills__item"
            >
              <div className="upcoming-bills__item-left">
                <BillIcon
                  className="upcoming-bills__bill-icon"
                  size={20}
                  strokeWidth={2}
                />

                <div className="upcoming-bills__info">
                  <strong>{bill.title}</strong>

                  <span>
                    Vence em {bill.dueDate}
                  </span>
                </div>
              </div>

              <strong className="upcoming-bills__amount">
                {bill.amount}
              </strong>
            </div>
          );
        })}
      </div>
    </section>
  );
}