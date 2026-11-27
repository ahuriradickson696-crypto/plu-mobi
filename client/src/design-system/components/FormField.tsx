import { forwardRef, useId, type InputHTMLAttributes } from 'react';

export interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(function FormField(
  { label, error, hint, id, className = '', ...rest },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? `field-${autoId}`;
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={inputId} className="text-sm font-medium text-ink-primary">
        {label}
        {rest.required && <span aria-hidden="true" className="text-status-rejected"> *</span>}
      </label>
      <input
        ref={ref}
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={[hint && hintId, error && errorId].filter(Boolean).join(' ') || undefined}
        className={[
          'min-h-comfortable rounded-md border bg-surface-base px-3 py-2 text-base text-ink-primary',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
          error ? 'border-status-rejected' : 'border-line-strong',
          className,
        ].join(' ')}
        {...rest}
      />
      {hint && <p id={hintId} className="text-xs text-ink-secondary">{hint}</p>}
      {error && <p id={errorId} role="alert" className="text-xs font-medium text-status-rejected">{error}</p>}
    </div>
  );
});
