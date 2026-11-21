export default function Spinner({ label = "Loading…", size = "md" }) {
  const dim = size === "sm" ? "h-4 w-4 border-2" : size === "lg" ? "h-10 w-10 border-4" : "h-6 w-6 border-[3px]";
  return (
    <span
      role="status"
      aria-label={label}
      className="inline-flex items-center gap-2 text-plu-slate"
    >
      <span
        aria-hidden
        className={`inline-block ${dim} rounded-full border-current border-t-transparent animate-spin`}
      />
      <span className="text-sm">{label}</span>
    </span>
  );
}
