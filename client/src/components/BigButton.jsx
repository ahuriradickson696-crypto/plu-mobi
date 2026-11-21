export default function BigButton({ children, variant = "primary", className = "", ...props }) {
  const variants = {
    primary: "bg-plu-yellow text-plu-black font-bold text-lg",
    dark:    "bg-plu-black text-white font-bold text-lg",
    outline: "bg-white border-2 border-plu-black text-plu-black font-bold text-lg",
    danger:  "bg-plu-red text-white font-bold text-lg",
  };
  return (
    <button
      className={`w-full flex items-center justify-center gap-2 rounded-card px-4 py-4 min-h-[56px] active:scale-95 transition-transform disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
