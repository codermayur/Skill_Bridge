import './Input.css';

export default function Input({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  className = '',
  wrapperClass = '',
  ...props
}) {
  return (
    <div className={`field ${wrapperClass}`}>
      {label && (
        <label className="field-label">
          {label}
          {props.required && <span className="field-required" aria-hidden="true">*</span>}
        </label>
      )}
      <div className={`field-control ${error ? 'field-error-ring' : ''}`}>
        {leftIcon && <span className="field-icon field-icon-left">{leftIcon}</span>}
        <input
          className={`field-input ${leftIcon ? 'pl-icon' : ''} ${rightIcon ? 'pr-icon' : ''} ${className}`}
          aria-invalid={!!error}
          aria-describedby={error ? 'field-err' : hint ? 'field-hint' : undefined}
          {...props}
        />
        {rightIcon && <span className="field-icon field-icon-right">{rightIcon}</span>}
      </div>
      {error && <p className="field-msg field-msg-error" id="field-err" role="alert">{error}</p>}
      {!error && hint && <p className="field-msg field-msg-hint" id="field-hint">{hint}</p>}
    </div>
  );
}

export function Textarea({ label, error, hint, className = '', wrapperClass = '', ...props }) {
  return (
    <div className={`field ${wrapperClass}`}>
      {label && (
        <label className="field-label">
          {label}
          {props.required && <span className="field-required" aria-hidden="true">*</span>}
        </label>
      )}
      <textarea
        className={`field-input field-textarea ${error ? 'field-error-ring' : ''} ${className}`}
        aria-invalid={!!error}
        {...props}
      />
      {error && <p className="field-msg field-msg-error" role="alert">{error}</p>}
      {!error && hint && <p className="field-msg field-msg-hint">{hint}</p>}
    </div>
  );
}

export function Select({ label, error, hint, children, className = '', wrapperClass = '', ...props }) {
  return (
    <div className={`field ${wrapperClass}`}>
      {label && <label className="field-label">{label}</label>}
      <select
        className={`field-input field-select ${error ? 'field-error-ring' : ''} ${className}`}
        aria-invalid={!!error}
        {...props}
      >
        {children}
      </select>
      {error && <p className="field-msg field-msg-error" role="alert">{error}</p>}
      {!error && hint && <p className="field-msg field-msg-hint">{hint}</p>}
    </div>
  );
}
