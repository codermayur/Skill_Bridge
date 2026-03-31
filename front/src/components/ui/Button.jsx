import { Loader2 } from 'lucide-react';

const VARIANTS = {
  primary:  'btn-primary',
  secondary:'btn-secondary',
  ghost:    'btn-ghost',
  danger:   'btn-danger',
  success:  'btn-success',
  outline:  'btn-outline',
};

const SIZES = {
  xs: 'btn-xs',
  sm: 'btn-sm',
  md: 'btn-md',
  lg: 'btn-lg',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  as: Tag = 'button',
  ...props
}) {
  const cls = [
    'btn',
    VARIANTS[variant] || VARIANTS.primary,
    SIZES[size]       || SIZES.md,
    fullWidth && 'btn-full',
    (loading || disabled) && 'btn-disabled',
    className,
  ].filter(Boolean).join(' ');

  return (
    <Tag className={cls} disabled={disabled || loading} {...props}>
      {loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : leftIcon ? (
        <span className="btn-icon-left">{leftIcon}</span>
      ) : null}
      {children}
      {!loading && rightIcon && (
        <span className="btn-icon-right">{rightIcon}</span>
      )}
    </Tag>
  );
}
