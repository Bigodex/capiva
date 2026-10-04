"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartNoAxesCombined,
  ChevronDown,
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

export function CashFlowCard() {
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
          "Erro ao carregar fluxo financeiro:",
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

  const cashFlowData = useMemo(() => {
    const now = new Date();

    const months = Array.from(
      { length: 6 },
      (_, index) => {
        const date = new Date(
          now.getFullYear(),
          now.getMonth() - (5 - index),
          1
        );

        return {
          month: date
            .toLocaleDateString("pt-BR", {
              month: "short",
            })
            .replace(".", "")
            .replace(/^./, (letter) =>
              letter.toUpperCase()
            ),

          monthIndex: date.getMonth(),
          year: date.getFullYear(),

          receitas: 0,
          despesas: 0,
        };
      }
    );

    transactions.forEach(
      (transaction) => {
        const transactionDate =
          new Date(transaction.date);

        const month =
          transactionDate.getUTCMonth();

        const year =
          transactionDate.getUTCFullYear();

        const targetMonth = months.find(
          (item) =>
            item.monthIndex === month &&
            item.year === year
        );

        if (!targetMonth) {
          return;
        }

        const amount =
          Number(transaction.amount) || 0;

        if (
          transaction.type === "income"
        ) {
          targetMonth.receitas += amount;
        }

        if (
          transaction.type === "expense"
        ) {
          targetMonth.despesas += amount;
        }
      }
    );

    return months;
  }, [transactions]);

  return (
    <section className="cash-flow-card">
      <div className="cash-flow-card__header">
        <div className="cash-flow-card__heading">
          <ChartNoAxesCombined
            className="cash-flow-card__icon"
            size={22}
            strokeWidth={2}
          />

          <div>
            <h3 className="cash-flow-card__title">
              Fluxo Financeiro
            </h3>

            <p className="cash-flow-card__subtitle">
              Entradas e saídas dos últimos meses
            </p>
          </div>
        </div>

        <button className="cash-flow-card__filter">
          <span>6 Meses</span>

          <ChevronDown
            size={15}
            strokeWidth={2}
          />
        </button>
      </div>

      <div className="cash-flow-card__legend">
        <div className="cash-flow-card__legend-item">
          <span className="cash-flow-card__legend-dot cash-flow-card__legend-dot--income" />
          <span>Receitas</span>
        </div>

        <div className="cash-flow-card__legend-item">
          <span className="cash-flow-card__legend-dot cash-flow-card__legend-dot--expense" />
          <span>Despesas</span>
        </div>
      </div>

      <div className="cash-flow-card__chart">
        <ResponsiveContainer
          width="100%"
          height={260}
        >
          <AreaChart
            data={cashFlowData}
            margin={{
              top: 10,
              right: 8,
              left: 0,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient
                id="receitasGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="#8b5cf6"
                  stopOpacity={0.28}
                />

                <stop
                  offset="95%"
                  stopColor="#8b5cf6"
                  stopOpacity={0}
                />
              </linearGradient>

              <linearGradient
                id="despesasGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="#ff3daf"
                  stopOpacity={0.22}
                />

                <stop
                  offset="95%"
                  stopColor="#ff3daf"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#eeeeef"
            />

            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{
                fontSize: 12,
                fill: "#737373",
              }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fontSize: 12,
                fill: "#737373",
              }}
              tickFormatter={(value) =>
                value >= 1000
                  ? `R$ ${(
                      value / 1000
                    ).toLocaleString(
                      "pt-BR",
                      {
                        maximumFractionDigits: 1,
                      }
                    )}k`
                  : `R$ ${value}`
              }
            />

            <Tooltip
              cursor={{
                stroke: "#e8e8ea",
                strokeWidth: 1,
              }}
              formatter={(value) =>
                Number(
                  value
                ).toLocaleString(
                  "pt-BR",
                  {
                    style: "currency",
                    currency: "BRL",
                  }
                )
              }
              contentStyle={{
                borderRadius: "12px",
                border:
                  "1px solid #e8e8ea",
                boxShadow:
                  "0 10px 30px rgba(23, 23, 23, 0.08)",
                fontFamily: "inherit",
              }}
            />

            <Area
              type="monotone"
              dataKey="receitas"
              name="Receitas"
              stroke="#8b5cf6"
              strokeWidth={2}
              fill="url(#receitasGradient)"
              activeDot={{
                r: 5,
              }}
            />

            <Area
              type="monotone"
              dataKey="despesas"
              name="Despesas"
              stroke="#ff3daf"
              strokeWidth={2}
              fill="url(#despesasGradient)"
              activeDot={{
                r: 5,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}