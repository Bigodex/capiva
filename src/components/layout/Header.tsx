"use client";

import { useState } from "react";

import {
  Bell,
  Plus,
  UserRound,
} from "lucide-react";

import { NewTransactionModal } from "@/features/dashboard/components/NewTransactionModal";

type HeaderProps = {
  title?: string;
  subtitle?: string;
};

export function Header({
  title = "Minhas Finanças",
  subtitle = "Seja bem-vindo, Pedro! Consulte suas finanças aqui no Capiva.",
}: HeaderProps) {
  const [isModalOpen, setIsModalOpen] =
    useState(false);

  return (
    <>
      <header className="header">
        <div className="header__content">
          <div className="header__text">
            <h1 className="header__title">
              {title}
            </h1>

            <p className="header__subtitle">
              {subtitle}
            </p>
          </div>

          <div className="header__actions">
            <button
              className="header__new-transaction"
              onClick={() =>
                setIsModalOpen(true)
              }
            >
              <Plus
                size={18}
                strokeWidth={2}
              />

              <span>
                Novo Lançamento
              </span>
            </button>

            <button
              className="header__notification"
              aria-label="Notificações"
            >
              <Bell
                size={19}
                strokeWidth={2}
              />
            </button>

            <button
              className="header__profile"
              aria-label="Perfil"
            >
              <UserRound
                size={20}
                strokeWidth={2}
              />
            </button>
          </div>
        </div>
      </header>

      <NewTransactionModal
        open={isModalOpen}
        onClose={() =>
          setIsModalOpen(false)
        }
      />
    </>
  );
}