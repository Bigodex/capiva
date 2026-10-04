"use client";

import Link from "next/link";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  ArrowDownLeft,
  ArrowUpRight,
  PiggyBank,
  ReceiptText,
} from "lucide-react";

type Transaction = {
  _id: string;
  title: string;
  category: string;
  amount: number;
  type:
  | "income"
  | "expense"
  | "investment";
  date: string;
};

export function RecentTransactions() {
  const [transactions, setTransactions] =
    useState<Transaction[]>([]);

  const [loading, setLoading] =
    useState(true);

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

        setTransactions(
          result.data.slice(0, 4)
        );
      } catch (error) {
        console.error(
          "Erro ao carregar lançamentos:",
          error
        );
      } finally {
        setLoading(false);
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

  function formatCurrency(
    amount: number,
    type: Transaction["type"]
  ) {
    const formatted =
      amount.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });

    if (type === "income") {
      return `+ ${formatted}`;
    }

    return `- ${formatted}`;
  }

  function formatDate(date: string) {
    const formatted =
      new Intl.DateTimeFormat(
        "pt-BR",
        {
          day: "2-digit",
          month: "short",
          timeZone: "UTC",
        }
      ).format(new Date(date));

    return formatted
      .replace(".", "")
      .replace(
        /^(\d{2}) de ([a-z])/,
        (_, day, month) =>
          `${day} ${month.toUpperCase()}`
      );
  }

  function getTransactionIcon(
    type: Transaction["type"]
  ) {
    if (type === "income") {
      return ArrowDownLeft;
    }

    if (type === "investment") {
      return PiggyBank;
    }

    return ArrowUpRight;
  }

  return (
    <section className="recent-transactions">
      <div className="recent-transactions__header">
        <div className="recent-transactions__heading">
          <ReceiptText
            className="recent-transactions__icon"
            size={22}
            strokeWidth={2}
          />

          <div>
            <h3 className="recent-transactions__title">
              Últimos Lançamentos
            </h3>

            <p className="recent-transactions__subtitle">
              Suas movimentações mais recentes
            </p>
          </div>
        </div>

        <Link
          href="/transacoes"
          className="recent-transactions__action"
        >
          Ver Todos
        </Link>
      </div>

      <div className="recent-transactions__list">
        {loading && (
          <div className="recent-transactions__empty">
            Carregando lançamentos...
          </div>
        )}

        {!loading &&
          transactions.length === 0 && (
            <div className="recent-transactions__empty">
              Nenhum lançamento cadastrado.
            </div>
          )}

        {!loading &&
          transactions.map(
            (transaction) => {
              const TransactionIcon =
                getTransactionIcon(
                  transaction.type
                );

              return (
                <div
                  key={transaction._id}
                  className="recent-transactions__item"
                >
                  <div className="recent-transactions__item-left">
                    <TransactionIcon
                      className={`recent-transactions__type-icon recent-transactions__type-icon--${transaction.type}`}
                      size={20}
                      strokeWidth={2}
                    />

                    <div className="recent-transactions__info">
                      <strong>
                        {transaction.title}
                      </strong>

                      <span>
                        {transaction.category}
                        {" · "}
                        {formatDate(
                          transaction.date
                        )}
                      </span>
                    </div>
                  </div>

                  <strong
                    className={`recent-transactions__amount recent-transactions__amount--${transaction.type}`}
                  >
                    {formatCurrency(
                      transaction.amount,
                      transaction.type
                    )}
                  </strong>
                </div>
              );
            }
          )}
      </div>
    </section>
  );
}