import './Card.css';

export default function Card({ children, className = '', hover = false, padding = true, ...props }) {
  return (
    <div
      className={[
        'card',
        hover && 'card-hover',
        !padding && 'card-no-pad',
        className,
      ].filter(Boolean).join(' ')}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '', action, ...props }) {
  return (
    <div className={`card-header ${className}`} {...props}>
      <div className="card-header-content">{children}</div>
      {action && <div className="card-header-action">{action}</div>}
    </div>
  );
}

export function CardBody({ children, className = '', ...props }) {
  return <div className={`card-body ${className}`} {...props}>{children}</div>;
}

export function CardFooter({ children, className = '', ...props }) {
  return <div className={`card-footer ${className}`} {...props}>{children}</div>;
}
