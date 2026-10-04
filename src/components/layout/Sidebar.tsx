"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  BarChart3,
  CreditCard,
  Goal,
  Home,
  LogOut,
  ReceiptText,
  WalletCards,
} from "lucide-react";

const menuItems = [
  {
    label: "Início",
    icon: Home,
    href: "/",
  },
  {
    label: "Transações",
    icon: ReceiptText,
    href: "/transacoes",
  },
  {
    label: "Contas",
    icon: CreditCard,
    href: "/contas",
  },
  {
    label: "Orçamentos",
    icon: WalletCards,
    href: "/orcamentos",
  },
  {
    label: "Metas",
    icon: Goal,
    href: "/metas",
  },
  {
    label: "Relatórios",
    icon: BarChart3,
    href: "/relatorios",
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="sidebar__panel">
        <Link
          href="/"
          className="sidebar__logo"
          style={{
            textDecoration: "none",
          }}
        >
          <Image
            src="/images/logo_capiva_black.png"
            alt="Logo Capiva"
            width={52}
            height={52}
            priority
            className="sidebar__logo-image"
          />

          <span>Capiva</span>
        </Link>

        <nav className="sidebar__nav">
          {menuItems.map((item) => {
            const Icon = item.icon;

            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(
                    item.href
                  );

            return (
              <Link
                key={item.label}
                href={item.href}
                style={{
                  textDecoration: "none",
                }}
                className={`sidebar__item ${
                  isActive
                    ? "sidebar__item--active"
                    : ""
                }`}
              >
                <Icon
                  size={19}
                  strokeWidth={2}
                />

                <span>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <button className="sidebar__logout">
          <LogOut
            size={18}
            strokeWidth={2}
          />

          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
}