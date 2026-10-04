"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ArrowDownLeft,
  ArrowUpRight,
  Pencil,
  PiggyBank,
  Search,
  SlidersHorizontal,
  Trash2,
} from "lucide-react";

import {
  EditTransactionModal,
  type EditableTransaction,
} from "./EditTransactionModal";

type TransactionType =
  | "income"
  | "expense"
  | "investment";

type Transaction = {
  _id: string;
  title: string;
  description?: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
  createdAt: string;
};

type TypeFilter =
  | "all"
  | TransactionType;

type PeriodFilter =
  | "all"
  | "month"
  | "30days"
  | "3months"
  | "year";

export function TransactionsPageContent() {
  const [transactions, setTransactions] =
    useState<Transaction[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [typeFilter, setTypeFilter] =
    useState<TypeFilter>("all");

  const [
    categoryFilter,
    setCategoryFilter,
  ] = useState("all");

  const [
    periodFilter,
    setPeriodFilter,
  ] =
    useState<PeriodFilter>("all");

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  const [
    selectedTransaction,
    setSelectedTransaction,
  ] =
    useState<EditableTransaction | null>(
      null
    );

  const fetchTransactions =
    useCallback(async () => {
      try {
        setError("");

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
              "Erro ao buscar transações."
          );
        }

        setTransactions(result.data);
      } catch (error) {
        console.error(
          "Erro ao carregar transações:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Não foi possível carregar as transações."
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

  const summary = useMemo(() => {
    return transactions.reduce(
      (accumulator, transaction) => {
        const amount =
          Number(transaction.amount) || 0;

        if (
          transaction.type === "income"
        ) {
          accumulator.income += amount;
        }

        if (
          transaction.type === "expense"
        ) {
          accumulator.expense += amount;
        }

        if (
          transaction.type ===
          "investment"
        ) {
          accumulator.investment += amount;
        }

        return accumulator;
      },
      {
        income: 0,
        expense: 0,
        investment: 0,
      }
    );
  }, [transactions]);

  const categories = useMemo(() => {
    return Array.from(
      new Set(
        transactions
          .map((transaction) =>
            transaction.category.trim()
          )
          .filter(Boolean)
      )
    ).sort((a, b) =>
      a.localeCompare(
        b,
        "pt-BR"
      )
    );
  }, [transactions]);

  const filteredTransactions =
    useMemo(() => {
      const normalizedSearch =
        search
          .trim()
          .toLocaleLowerCase("pt-BR");

      const now =
        new Date();

      const todayStart =
        new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate()
        );

      return transactions.filter(
        (transaction) => {
          const matchesType =
            typeFilter === "all" ||
            transaction.type ===
              typeFilter;

          const matchesCategory =
            categoryFilter === "all" ||
            transaction.category ===
              categoryFilter;

          const transactionDate =
            new Date(
              transaction.date
            );

          let matchesPeriod = true;

          if (
            periodFilter === "month"
          ) {
            matchesPeriod =
              transactionDate.getUTCMonth() ===
                now.getMonth() &&
              transactionDate.getUTCFullYear() ===
                now.getFullYear();
          }

          if (
            periodFilter === "30days"
          ) {
            const startDate =
              new Date(todayStart);

            startDate.setDate(
              startDate.getDate() - 30
            );

            matchesPeriod =
              transactionDate >=
              startDate;
          }

          if (
            periodFilter === "3months"
          ) {
            const startDate =
              new Date(todayStart);

            startDate.setMonth(
              startDate.getMonth() - 3
            );

            matchesPeriod =
              transactionDate >=
              startDate;
          }

          if (
            periodFilter === "year"
          ) {
            matchesPeriod =
              transactionDate.getUTCFullYear() ===
              now.getFullYear();
          }

          const searchableText = [
            transaction.title,
            transaction.category,
            transaction.description ?? "",
          ]
            .join(" ")
            .toLocaleLowerCase("pt-BR");

          const matchesSearch =
            !normalizedSearch ||
            searchableText.includes(
              normalizedSearch
            );

          return (
            matchesType &&
            matchesCategory &&
            matchesPeriod &&
            matchesSearch
          );
        }
      );
    }, [
      transactions,
      search,
      typeFilter,
      categoryFilter,
      periodFilter,
    ]);

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

  function formatDate(
    date: string
  ) {
    return new Intl.DateTimeFormat(
      "pt-BR",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
      }
    )
      .format(new Date(date))
      .replace(".", "");
  }

  function getTransactionLabel(
    type: TransactionType
  ) {
    if (type === "income") {
      return "Receita";
    }

    if (type === "investment") {
      return "Investimento";
    }

    return "Despesa";
  }

  function getTransactionIcon(
    type: TransactionType
  ) {
    if (type === "income") {
      return ArrowDownLeft;
    }

    if (type === "investment") {
      return PiggyBank;
    }

    return ArrowUpRight;
  }

  function getTransactionSignal(
    type: TransactionType
  ) {
    return type === "income"
      ? "+"
      : "-";
  }

  async function handleDelete(
    transaction: Transaction
  ) {
    const confirmed =
      window.confirm(
        `Deseja realmente excluir "${transaction.title}"?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(
        transaction._id
      );

      const response = await fetch(
        `/api/transactions/${transaction._id}`,
        {
          method: "DELETE",
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Erro ao excluir transação."
        );
      }

      setTransactions(
        (currentTransactions) =>
          currentTransactions.filter(
            (item) =>
              item._id !==
              transaction._id
          )
      );

      window.dispatchEvent(
        new CustomEvent(
          "capiva:transactions-updated"
        )
      );
    } catch (error) {
      console.error(
        "Erro ao excluir transação:",
        error
      );

      window.alert(
        error instanceof Error
          ? error.message
          : "Não foi possível excluir a transação."
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <>
      <div className="transactions-page">
        <section className="transactions-summary">
          <div className="transactions-summary__item">
            <ArrowDownLeft
              size={20}
              strokeWidth={2}
              className="transactions-summary__icon transactions-summary__icon--income"
            />

            <div>
              <span>
                Receitas
              </span>

              <strong>
                {formatCurrency(
                  summary.income
                )}
              </strong>
            </div>
          </div>

          <div className="transactions-summary__item">
            <ArrowUpRight
              size={20}
              strokeWidth={2}
              className="transactions-summary__icon transactions-summary__icon--expense"
            />

            <div>
              <span>
                Despesas
              </span>

              <strong>
                {formatCurrency(
                  summary.expense
                )}
              </strong>
            </div>
          </div>

          <div className="transactions-summary__item">
            <PiggyBank
              size={20}
              strokeWidth={2}
              className="transactions-summary__icon transactions-summary__icon--investment"
            />

            <div>
              <span>
                Investimentos
              </span>

              <strong>
                {formatCurrency(
                  summary.investment
                )}
              </strong>
            </div>
          </div>
        </section>

        <section className="transactions-filters">
          <div className="transactions-filters__search">
            <Search
              size={18}
              strokeWidth={2}
            />

            <input
              type="text"
              placeholder="Buscar transação..."
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
            />
          </div>

          <select
            className="transactions-filters__category"
            value={categoryFilter}
            onChange={(event) =>
              setCategoryFilter(
                event.target.value
              )
            }
          >
            <option value="all">
              Todas as categorias
            </option>

            {categories.map(
              (category) => (
                <option
                  key={category}
                  value={category}
                >
                  {category}
                </option>
              )
            )}
          </select>

          <select
            className="transactions-filters__period"
            value={periodFilter}
            onChange={(event) =>
              setPeriodFilter(
                event.target
                  .value as PeriodFilter
              )
            }
          >
            <option value="all">
              Todos os períodos
            </option>

            <option value="month">
              Este mês
            </option>

            <option value="30days">
              Últimos 30 dias
            </option>

            <option value="3months">
              Últimos 3 meses
            </option>

            <option value="year">
              Este ano
            </option>
          </select>

          <div className="transactions-filters__types">
            <SlidersHorizontal
              size={17}
              strokeWidth={2}
            />

            <button
              type="button"
              className={
                typeFilter === "all"
                  ? "transactions-filters__type transactions-filters__type--active"
                  : "transactions-filters__type"
              }
              onClick={() =>
                setTypeFilter("all")
              }
            >
              Todas
            </button>

            <button
              type="button"
              className={
                typeFilter === "income"
                  ? "transactions-filters__type transactions-filters__type--active"
                  : "transactions-filters__type"
              }
              onClick={() =>
                setTypeFilter(
                  "income"
                )
              }
            >
              Receitas
            </button>

            <button
              type="button"
              className={
                typeFilter === "expense"
                  ? "transactions-filters__type transactions-filters__type--active"
                  : "transactions-filters__type"
              }
              onClick={() =>
                setTypeFilter(
                  "expense"
                )
              }
            >
              Despesas
            </button>

            <button
              type="button"
              className={
                typeFilter ===
                "investment"
                  ? "transactions-filters__type transactions-filters__type--active"
                  : "transactions-filters__type"
              }
              onClick={() =>
                setTypeFilter(
                  "investment"
                )
              }
            >
              Investimentos
            </button>
          </div>
        </section>

        <section className="transactions-list">
          <div className="transactions-list__header">
            <div>
              <h3>
                Todas as Transações
              </h3>

              <p>
                Histórico completo das
                suas movimentações.
              </p>
            </div>

            <span className="transactions-list__count">
              {
                filteredTransactions.length
              }{" "}
              {filteredTransactions.length ===
              1
                ? "transação"
                : "transações"}
            </span>
          </div>

          {loading && (
            <div className="transactions-list__empty">
              <p>
                Carregando suas
                transações...
              </p>
            </div>
          )}

          {!loading && error && (
            <div className="transactions-list__empty">
              <p>
                {error}
              </p>
            </div>
          )}

          {!loading &&
            !error &&
            filteredTransactions.length ===
              0 && (
              <div className="transactions-list__empty">
                <p>
                  Nenhuma transação
                  encontrada.
                </p>
              </div>
            )}

          {!loading &&
            !error &&
            filteredTransactions.length >
              0 && (
              <div className="transactions-list__items">
                {filteredTransactions.map(
                  (transaction) => {
                    const Icon =
                      getTransactionIcon(
                        transaction.type
                      );

                    const isDeleting =
                      deletingId ===
                      transaction._id;

                    return (
                      <article
                        key={
                          transaction._id
                        }
                        className="transactions-list__item"
                      >
                        <div className="transactions-list__item-main">
                          <Icon
                            size={20}
                            strokeWidth={2}
                            className={`transactions-list__item-icon transactions-list__item-icon--${transaction.type}`}
                          />

                          <div className="transactions-list__item-info">
                            <strong>
                              {
                                transaction.title
                              }
                            </strong>

                            <span>
                              {
                                transaction.category
                              }
                              {" · "}
                              {formatDate(
                                transaction.date
                              )}
                            </span>
                          </div>
                        </div>

                        <div className="transactions-list__item-type">
                          {getTransactionLabel(
                            transaction.type
                          )}
                        </div>

                        <div className="transactions-list__item-actions">
                          <strong
                            className={`transactions-list__item-amount transactions-list__item-amount--${transaction.type}`}
                          >
                            {getTransactionSignal(
                              transaction.type
                            )}{" "}
                            {formatCurrency(
                              transaction.amount
                            )}
                          </strong>

                          <button
                            type="button"
                            className="transactions-list__edit"
                            onClick={() =>
                              setSelectedTransaction(
                                transaction
                              )
                            }
                            aria-label={`Editar ${transaction.title}`}
                            title="Editar transação"
                          >
                            <Pencil
                              size={17}
                              strokeWidth={2}
                            />
                          </button>

                          <button
                            type="button"
                            className="transactions-list__delete"
                            onClick={() =>
                              handleDelete(
                                transaction
                              )
                            }
                            disabled={
                              isDeleting
                            }
                            aria-label={`Excluir ${transaction.title}`}
                            title="Excluir transação"
                          >
                            <Trash2
                              size={17}
                              strokeWidth={2}
                            />
                          </button>
                        </div>
                      </article>
                    );
                  }
                )}
              </div>
            )}
        </section>
      </div>

      <EditTransactionModal
        open={
          selectedTransaction !== null
        }
        transaction={
          selectedTransaction
        }
        onClose={() =>
          setSelectedTransaction(
            null
          )
        }
        onUpdated={
          fetchTransactions
        }
      />
    </>
  );
}