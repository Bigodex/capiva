"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ChevronRight,
  Gauge,
} from "lucide-react";

type Transaction = {
  _id: string;
  amount: number;
  type:
    | "income"
    | "expense"
    | "investment";
  date: string;
};

const MONTHLY_BUDGET = 5000;

export function BudgetCard() {
  const [transactions, setTransactions] =
    useState<Transaction[]>([]);

  const fetchTransactions =
    useCallback(async () => {
      try {
        const response = await fetch(
          "/api/transactions",
          {
            cache: "no-store",
          }
        );

        const result =
          await response.json();

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Erro ao buscar lançamentos."
          );
        }

        setTransactions(result.data);
      } catch (error) {
        console.error(
          "Erro ao carregar orçamento:",
          error
        );
      }
    }, []);

  useEffect(() => {
    fetchTransactions();

    const handleUpdate = () => {
      fetchTransactions();
    };

    window.addEventListener(
      "capiva:transactions-updated",
      handleUpdate
    );

    return () => {
      window.removeEventListener(
        "capiva:transactions-updated",
        handleUpdate
      );
    };
  }, [fetchTransactions]);

  const budget = useMemo(() => {
    const now = new Date();

    const currentMonth =
      now.getMonth();

    const currentYear =
      now.getFullYear();

    const used = transactions.reduce(
      (total, transaction) => {
        if (
          transaction.type !== "expense"
        ) {
          return total;
        }

        const transactionDate =
          new Date(transaction.date);

        const isCurrentMonth =
          transactionDate.getUTCMonth() ===
            currentMonth &&
          transactionDate.getUTCFullYear() ===
            currentYear;

        if (!isCurrentMonth) {
          return total;
        }

        return (
          total +
          (Number(transaction.amount) || 0)
        );
      },
      0
    );

    const available =
      Math.max(
        MONTHLY_BUDGET - used,
        0
      );

    const percentage =
      MONTHLY_BUDGET > 0
        ? Math.round(
            (used /
              MONTHLY_BUDGET) *
              100
          )
        : 0;

    const progress =
      Math.min(percentage, 100);

    return {
      used,
      available,
      percentage,
      progress,
    };
  }, [transactions]);

  function formatCurrency(
    value: number
  ) {
    return value.toLocaleString(
      "pt-BR",
      {
        style: "currency",
        currency: "BRL",
      }
    );
  }

  return (
    <section className="budget-card">
      <div className="budget-card__header">
        <div className="budget-card__heading">
          <Gauge
            className="budget-card__icon"
            size={22}
            strokeWidth={2}
          />

          <div>
            <h3 className="budget-card__title">
              Orçamento Mensal
            </h3>

            <p className="budget-card__subtitle">
              Controle dos seus gastos no mês
            </p>
          </div>
        </div>

        <button className="budget-card__action">
          Ver detalhes

          <ChevronRight
            size={15}
            strokeWidth={2}
          />
        </button>
      </div>

      <div className="budget-card__highlight">
        <span>Você utilizou</span>

        <strong>
          {budget.percentage}%
        </strong>

        <span>
          do orçamento deste mês
        </span>
      </div>

      <div className="budget-card__progress">
        <div
          className="budget-card__progress-bar"
          style={{
            width: `${budget.progress}%`,
          }}
        />
      </div>

      <div className="budget-card__values">
        <div>
          <span className="budget-card__label">
            Utilizado
          </span>

          <strong className="budget-card__value">
            {formatCurrency(
              budget.used
            )}
          </strong>
        </div>

        <div className="budget-card__limit">
          <span className="budget-card__label">
            Disponível
          </span>

          <strong className="budget-card__value">
            {formatCurrency(
              budget.available
            )}
          </strong>
        </div>
      </div>

      <div className="budget-card__total">
        Limite mensal de{" "}
        {formatCurrency(
          MONTHLY_BUDGET
        )}
      </div>
    </section>
  );
}