function AppButton({ variant = "primary", size = "md", className = "", children, ...props }) {
  return (
    <button className={`ui-btn ui-btn-${variant} ui-btn-${size} ${className}`.trim()} {...props}>
      {children}
    </button>
  );
}

function AppCard({ className = "", children, ...props }) {
  return (
    <div className={`ui-card ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}

function StatusChip({ tone = "neutral", children }) {
  return <span className={`ui-chip ui-chip-${tone}`}>{children}</span>;
}

function EmptyState({ icon, title, description, action }) {
  return (
    <div className="ui-empty">
      <div className="ui-empty-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
      {action}
    </div>
  );
}

export { AppButton, AppCard, StatusChip, EmptyState };
