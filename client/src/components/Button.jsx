export default function Button({ variant = "primary", className = "", children, ...props }) {
  const variants = {
    primary: "bg-plu-yellow text-plu-black font-semibold",
    dark:    "bg-plu-black text-white font-semibold",
    outline: "bg-white border border-plu-black/10",
  };
  return (
    <button
      className={`rounded-card px-4 py-3 transition disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
