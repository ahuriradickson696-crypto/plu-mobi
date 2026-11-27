import { forwardRef, type ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const variantClass: Record<Variant, string> = {
  primary:   'bg-plu-yellow text-plu-black hover:bg-[#E6BF00] active:bg-[#CCA800]',
  secondary: 'bg-surface-raised text-ink-primary border border-line-strong hover:bg-surface-sunken',
  ghost:     'bg-transparent text-ink-primary hover:bg-surface-sunken',
  danger:    'bg-status-rejected text-white hover:bg-[#B91C1C]',
};

const sizeClass: Record<Size, string> = {
  sm: 'min-h-touch px-3 py-1.5 text-sm',
  md: 'min-h-comfortable px-4 py-2 text-base',
  lg: 'min-h-[52px] px-6 py-3 text-lg',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', loading = false, disabled, className = '', children, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={rest.type ?? 'button'}
      aria-busy={loading || undefined}
      disabled={disabled || loading}
      className={[
        'inline-flex items-center justify-center gap-2 rounded-md font-medium',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'transition-colors',
        variantClass[variant],
        sizeClass[size],
        className,
      ].join(' ')}
      {...rest}
    >
      {loading && <span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />}
      {children}
    </button>
  );
});
