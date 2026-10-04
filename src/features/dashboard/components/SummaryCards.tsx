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
  Eye,
  EyeOff,
  PiggyBank,
  Wallet,
} from "lucide-react";

import { SummaryCard } from "./SummaryCard";

type Transaction = {
  _id: string;
  amount: number;
  type:
    | "income"
    | "expense"
    | "investment";
  date: string;
};

export function SummaryCards() {
  const [transactions, setTransactions] =
    useState<Transaction[]>([]);

  const [valuesHidden, setValuesHidden] =
    useState(false);

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
          "Erro ao carregar resumo financeiro:",
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

  useEffect(() => {
    return () => {
      document.body.classList.remove(
        "capiva-values-hidden"
      );
    };
  }, []);

  const summary = useMemo(() => {
    const now = new Date();

    const currentMonth =
      now.getMonth();

    const currentYear =
      now.getFullYear();

    let totalIncome = 0;
    let totalExpense = 0;
    let totalInvestment = 0;

    let monthlyIncome = 0;
    let monthlyExpense = 0;
    let monthlyInvestment = 0;

    transactions.forEach(
      (transaction) => {
        const amount =
          Number(transaction.amount) || 0;

        const transactionDate =
          new Date(transaction.date);

        const isCurrentMonth =
          transactionDate.getUTCMonth() ===
            currentMonth &&
          transactionDate.getUTCFullYear() ===
            currentYear;

        if (
          transaction.type === "income"
        ) {
          totalIncome += amount;

          if (isCurrentMonth) {
            monthlyIncome += amount;
          }
        }

        if (
          transaction.type === "expense"
        ) {
          totalExpense += amount;

          if (isCurrentMonth) {
            monthlyExpense += amount;
          }
        }

        if (
          transaction.type ===
          "investment"
        ) {
          totalInvestment += amount;

          if (isCurrentMonth) {
            monthlyInvestment += amount;
          }
        }
      }
    );

    const availableBalance =
      totalIncome -
      totalExpense -
      totalInvestment;

    return {
      availableBalance,
      monthlyIncome,
      monthlyExpense,
      monthlyInvestment,
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

  function toggleValuesVisibility() {
    const nextValue =
      !valuesHidden;

    setValuesHidden(
      nextValue
    );

    document.body.classList.toggle(
      "capiva-values-hidden",
      nextValue
    );
  }

  return (
    <section className="summary-cards">
      <button
        type="button"
        className="summary-cards__privacy"
        aria-label={
          valuesHidden
            ? "Exibir valores"
            : "Ocultar valores"
        }
        title={
          valuesHidden
            ? "Exibir valores"
            : "Ocultar valores"
        }
        onClick={
          toggleValuesVisibility
        }
      >
        {valuesHidden ? (
          <EyeOff
            size={18}
            strokeWidth={2}
          />
        ) : (
          <Eye
            size={18}
            strokeWidth={2}
          />
        )}
      </button>

      <SummaryCard
        title="Saldo Disponível"
        value={formatCurrency(
          summary.availableBalance
        )}
        description="Valor atual disponível"
        icon={Wallet}
        tone="neutral"
      />

      <SummaryCard
        title="Receitas"
        value={formatCurrency(
          summary.monthlyIncome
        )}
        description="Entradas neste mês"
        icon={ArrowDownLeft}
        tone="income"
      />

      <SummaryCard
        title="Despesas"
        value={formatCurrency(
          summary.monthlyExpense
        )}
        description="Gastos neste mês"
        icon={ArrowUpRight}
        tone="expense"
      />

      <SummaryCard
        title="Investimentos"
        value={formatCurrency(
          summary.monthlyInvestment
        )}
        description="Investido neste mês"
        icon={PiggyBank}
        tone="savings"
      />
    </section>
  );
}