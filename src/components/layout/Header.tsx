export function Header() {
  return (
    <header className="header">
      <div className="header__content">
        <div>
          <h1 className="header__title">Olá 👋</h1>
          <p className="header__subtitle">
            Veja como estão suas finanças hoje
          </p>
        </div>

        <div className="header__actions">
          <button className="header__notification">
            Notificações
          </button>

          <button className="header__profile">
            Pedro
          </button>
        </div>
      </div>
    </header>
  );
}