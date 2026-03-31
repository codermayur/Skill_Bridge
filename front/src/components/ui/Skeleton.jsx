import './Skeleton.css';

export default function Skeleton({ width, height, rounded = false, className = '' }) {
  return (
    <div
      className={`skeleton ${rounded ? 'skeleton-circle' : ''} ${className}`}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}

export function SkeletonText({ lines = 3, className = '' }) {
  return (
    <div className={`skeleton-text ${className}`} aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="skeleton"
          style={{ width: i === lines - 1 ? '60%' : '100%', height: '14px', borderRadius: '4px' }}
        />
      ))}
    </div>
  );
}

export function RequestCardSkeleton() {
  return (
    <div className="card" aria-hidden="true" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Skeleton height="20px" style={{ flex: 1, borderRadius: '4px' }} className="flex-1" />
        <Skeleton width="80px" height="22px" className="rounded-full" style={{ borderRadius: '20px', marginLeft: '12px' }} />
      </div>
      <SkeletonText lines={2} />
      <div style={{ display: 'flex', gap: '8px' }}>
        <Skeleton width="60px" height="22px" style={{ borderRadius: '4px' }} />
        <Skeleton width="80px" height="22px" style={{ borderRadius: '4px' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Skeleton width="32px" height="32px" rounded />
          <Skeleton width="100px" height="14px" style={{ borderRadius: '4px' }} />
        </div>
        <Skeleton width="90px" height="34px" style={{ borderRadius: '8px' }} />
      </div>
    </div>
  );
}
