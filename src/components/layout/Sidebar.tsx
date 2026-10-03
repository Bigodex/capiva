export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar__logo">
        <span>Capiva</span>
      </div>

      <nav className="sidebar__nav">
        <button className="sidebar__item sidebar__item--active">
          Início
        </button>

        <button className="sidebar__item">
          Transações
        </button>

        <button className="sidebar__item">
          Contas
        </button>

        <button className="sidebar__item">
          Orçamentos
        </button>

        <button className="sidebar__item">
          Metas
        </button>

        <button className="sidebar__item">
          Relatórios
        </button>
      </nav>
    </aside>
  );
}