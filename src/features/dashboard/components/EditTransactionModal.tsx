"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import {
  ArrowDownLeft,
  ArrowUpRight,
  PiggyBank,
  X,
} from "lucide-react";

type TransactionType =
  | "income"
  | "expense"
  | "investment";

export type EditableTransaction = {
  _id: string;
  title: string;
  description?: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
};

type EditTransactionModalProps = {
  open: boolean;
  transaction: EditableTransaction | null;
  onClose: () => void;
  onUpdated?: () => void;
};

export function EditTransactionModal({
  open,
  transaction,
  onClose,
  onUpdated,
}: EditTransactionModalProps) {
  const [type, setType] =
    useState<TransactionType>("expense");

  const [title, setTitle] =
    useState("");

  const [category, setCategory] =
    useState("");

  const [amount, setAmount] =
    useState("");

  const [date, setDate] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    if (!open || !transaction) {
      return;
    }

    setType(transaction.type);

    setTitle(
      transaction.title
    );

    setCategory(
      transaction.category
    );

    setAmount(
      String(transaction.amount)
    );

    setDate(
      transaction.date.slice(0, 10)
    );

    setDescription(
      transaction.description ?? ""
    );

    setError("");
  }, [
    open,
    transaction,
  ]);

  function handleClose() {
    if (loading) {
      return;
    }

    setError("");
    onClose();
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!transaction) {
      return;
    }

    setError("");

    if (
      !title.trim() ||
      !category.trim() ||
      !amount ||
      !date
    ) {
      setError(
        "Preencha todos os campos obrigatórios."
      );

      return;
    }

    const parsedAmount =
      Number(
        amount.replace(",", ".")
      );

    if (
      Number.isNaN(parsedAmount) ||
      parsedAmount <= 0
    ) {
      setError(
        "Informe um valor válido."
      );

      return;
    }

    try {
      setLoading(true);

      const response =
        await fetch(
          `/api/transactions/${transaction._id}`,
          {
            method: "PATCH",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              title:
                title.trim(),

              description:
                description.trim(),

              amount:
                parsedAmount,

              type,

              category:
                category.trim(),

              date,
            }),
          }
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Erro ao atualizar lançamento."
        );
      }

      window.dispatchEvent(
        new CustomEvent(
          "capiva:transactions-updated"
        )
      );

      onUpdated?.();

      onClose();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Erro ao atualizar lançamento."
      );
    } finally {
      setLoading(false);
    }
  }

  if (
    !open ||
    !transaction
  ) {
    return null;
  }

  return (
    <div
      className="transaction-modal__overlay"
      onMouseDown={handleClose}
    >
      <div
        className="transaction-modal"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        <div className="transaction-modal__header">
          <div>
            <h2>
              Editar Lançamento
            </h2>

            <p>
              Altere as informações
              da movimentação.
            </p>
          </div>

          <button
            type="button"
            className="transaction-modal__close"
            onClick={handleClose}
            aria-label="Fechar"
          >
            <X
              size={20}
              strokeWidth={2}
            />
          </button>
        </div>

        <form
          className="transaction-modal__form"
          onSubmit={handleSubmit}
        >
          <div className="transaction-modal__types">
            <button
              type="button"
              className={`transaction-modal__type ${
                type === "income"
                  ? "transaction-modal__type--active"
                  : ""
              }`}
              onClick={() =>
                setType("income")
              }
            >
              <ArrowDownLeft
                size={18}
                strokeWidth={2}
              />

              Receita
            </button>

            <button
              type="button"
              className={`transaction-modal__type ${
                type === "expense"
                  ? "transaction-modal__type--active"
                  : ""
              }`}
              onClick={() =>
                setType("expense")
              }
            >
              <ArrowUpRight
                size={18}
                strokeWidth={2}
              />

              Despesa
            </button>

            <button
              type="button"
              className={`transaction-modal__type ${
                type === "investment"
                  ? "transaction-modal__type--active"
                  : ""
              }`}
              onClick={() =>
                setType(
                  "investment"
                )
              }
            >
              <PiggyBank
                size={18}
                strokeWidth={2}
              />

              Investimento
            </button>
          </div>

          <div className="transaction-modal__field">
            <label htmlFor="edit-transaction-title">
              Título
            </label>

            <input
              id="edit-transaction-title"
              type="text"
              value={title}
              onChange={(event) =>
                setTitle(
                  event.target.value
                )
              }
              placeholder="Ex: Supermercado"
            />
          </div>

          <div className="transaction-modal__row">
            <div className="transaction-modal__field">
              <label htmlFor="edit-transaction-category">
                Categoria
              </label>

              <input
                id="edit-transaction-category"
                type="text"
                value={category}
                onChange={(event) =>
                  setCategory(
                    event.target.value
                  )
                }
                placeholder="Ex: Alimentação"
              />
            </div>

            <div className="transaction-modal__field">
              <label htmlFor="edit-transaction-amount">
                Valor
              </label>

              <input
                id="edit-transaction-amount"
                type="text"
                inputMode="decimal"
                value={amount}
                onChange={(event) =>
                  setAmount(
                    event.target.value
                  )
                }
                placeholder="0,00"
              />
            </div>
          </div>

          <div className="transaction-modal__field">
            <label htmlFor="edit-transaction-date">
              Data
            </label>

            <input
              id="edit-transaction-date"
              type="date"
              value={date}
              onChange={(event) =>
                setDate(
                  event.target.value
                )
              }
            />
          </div>

          <div className="transaction-modal__field">
            <label htmlFor="edit-transaction-description">
              Descrição
            </label>

            <textarea
              id="edit-transaction-description"
              value={description}
              onChange={(event) =>
                setDescription(
                  event.target.value
                )
              }
              placeholder="Descrição opcional"
              rows={3}
            />
          </div>

          {error && (
            <div className="transaction-modal__error">
              {error}
            </div>
          )}

          <div className="transaction-modal__actions">
            <button
              type="button"
              className="transaction-modal__cancel"
              onClick={handleClose}
              disabled={loading}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="transaction-modal__submit"
              disabled={loading}
            >
              {loading
                ? "Salvando..."
                : "Salvar Alterações"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}