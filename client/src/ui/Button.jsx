import { forwardRef } from "react";

const BASE =
  "inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-3 rounded-xl " +
  "font-semibold text-sm md:text-base transition-colors " +
  "focus:outline-none focus-visible:ring-4 disabled:opacity-50 disabled:cursor-not-allowed";

const VARIANTS = {
  primary:   "bg-plu-black text-white hover:bg-black focus-visible:ring-plu-black/40",
  secondary: "bg-white border border-plu-black/10 text-plu-black hover:bg-plu-black/[0.04] focus-visible:ring-plu-black/30",
  yellow:    "bg-plu-yellow text-plu-black hover:brightness-95 focus-visible:ring-plu-yellow/60",
  danger:    "bg-plu-red text-white hover:brightness-95 focus-visible:ring-plu-red/40",
  ghost:     "bg-transparent text-plu-black hover:bg-plu-black/[0.04] focus-visible:ring-plu-black/30",
};

const Button = forwardRef(function Button(
  {
    children,
    variant = "primary",
    loading = false,
    disabled = false,
    type = "button",
    className = "",
    ...rest
  },
  ref
) {
  const isDisabled = disabled || loading;
  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      aria-disabled={isDisabled || undefined}
      className={`${BASE} ${VARIANTS[variant] || VARIANTS.primary} ${className}`}
      {...rest}
    >
      {loading && (
        <span
          aria-hidden
          className="inline-block h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin"
        />
      )}
      {children}
    </button>
  );
});

export default Button;
