import './Avatar.css';

function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('');
}

const COLORS = [
  '#6366f1','#8b5cf6','#ec4899','#f59e0b',
  '#10b981','#3b82f6','#ef4444','#06b6d4',
];

function colorFor(name = '') {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return COLORS[Math.abs(hash) % COLORS.length];
}

const SIZES = { xs: 24, sm: 32, md: 40, lg: 48, xl: 64, '2xl': 80 };

export default function Avatar({ name = '', src, size = 'md', className = '', online }) {
  const px   = SIZES[size] || SIZES.md;
  const color = colorFor(name);
  const initials = getInitials(name);

  return (
    <div
      className={`avatar avatar-${size} ${className}`}
      style={{ '--av-color': color, '--av-size': `${px}px` }}
      aria-label={name}
      title={name}
    >
      {src ? (
        <img src={src} alt={name} className="avatar-img" />
      ) : (
        <span className="avatar-initials">{initials || '?'}</span>
      )}
      {online !== undefined && (
        <span className={`avatar-status ${online ? 'avatar-online' : 'avatar-offline'}`} />
      )}
    </div>
  );
}
