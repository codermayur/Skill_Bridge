import './Badge.css';

const STATUS_MAP = {
  pending:     'badge-warning',
  accepted:    'badge-info',
  in_progress: 'badge-purple',
  completed:   'badge-success',
  cancelled:   'badge-muted',
};

export function Badge({ children, variant = 'default', dot = false, className = '' }) {
  return (
    <span className={`badge badge-${variant} ${className}`}>
      {dot && <span className="badge-dot" />}
      {children}
    </span>
  );
}

export function StatusBadge({ status }) {
  const cls = STATUS_MAP[status] || 'badge-muted';
  const label = status?.replace('_', ' ') || '—';
  return (
    <span className={`badge ${cls} badge-dot-pre`}>
      <span className="badge-dot" />
      {label}
    </span>
  );
}

export default Badge;
