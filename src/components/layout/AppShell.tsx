import type { ReactNode } from "react";

import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

type AppShellProps = {
  children: ReactNode;
  title?: string;
  subtitle?: string;
};

export function AppShell({
  children,
  title,
  subtitle,
}: AppShellProps) {
  return (
    <div className="app-shell">
      <Sidebar />

      <div className="app-shell__main">
        <Header
          title={title}
          subtitle={subtitle}
        />

        <main className="app-shell__content">
          {children}
        </main>
      </div>
    </div>
  );
}