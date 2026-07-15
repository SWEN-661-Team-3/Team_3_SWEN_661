export default function AppHeader({ activeView = 'today', onAction }) {
  const buttons = [
    { action: 'new-record', label: 'New' },
    { action: 'save', label: 'Save Plan' },
    'divider',
    { action: 'search', label: 'Search' },
    {
      action: 'view-todays-plan',
      label: "Today's Plan",
      active: activeView === 'today',
    },
    {
      action: 'view-care-team',
      label: 'Care Team',
      active: activeView === 'care-team',
    },
    { action: 'open-settings', label: 'Settings' },
    'divider',
    { action: 'emergency', label: 'Emergency', danger: true },
  ];

  return (
    <header className="app-header" role="banner">
      <div className="app-header__brand">
        <span className="app-header__logo" aria-hidden="true">CC</span>
        <h1 className="app-header__title">CareConnect</h1>
      </div>

      <nav className="toolbar" aria-label="Toolbar">
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
              aria-current={btn.active ? 'true' : undefined}
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
