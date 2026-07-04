export default function AppHeader({ onAction }) {
  const buttons = [
    { action: 'new-record', label: 'New', title: 'New reminder (Ctrl+N)' },
    { action: 'save', label: 'Save', title: 'Save (Ctrl+S)' },
    'divider',
    { action: 'search', label: 'Search', title: 'Search (Ctrl+F)' },
    { action: 'view-todays-plan', label: "Today's Plan", title: "Today's Plan (Ctrl+1)", active: true },
    { action: 'open-settings', label: 'Settings', title: 'Settings (Ctrl+,)' },
    'divider',
    { action: 'emergency', label: 'Emergency', title: 'Emergency help', danger: true },
  ];

  return (
    <header className="app-header" role="banner">
      <div className="app-header__brand">
        <span className="app-header__logo" aria-hidden="true">CC</span>
        <h1 className="app-header__title">CareConnect</h1>
      </div>

      <nav className="toolbar" aria-label="CareConnect toolbar">
        {buttons.map((btn, i) => {
          if (btn === 'divider') {
            return <span key={`div-${i}`} className="toolbar-divider" aria-hidden="true" />;
          }

          const classes = [
            'toolbar-btn',
            btn.active && 'toolbar-btn--active',
            btn.danger && 'toolbar-btn--danger',
          ].filter(Boolean).join(' ');

          return (
            <button
              key={btn.action}
              type="button"
              className={classes}
              title={btn.title}
              onClick={() => onAction(btn.action)}
            >
              {btn.label}
            </button>
          );
        })}
      </nav>
    </header>
  );
}
