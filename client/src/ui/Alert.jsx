const TONES = {
  info:    "bg-blue-50 text-blue-900 border-blue-200",
  success: "bg-emerald-50 text-emerald-900 border-emerald-200",
  warning: "bg-amber-50 text-amber-900 border-amber-200",
  error:   "bg-red-50 text-red-900 border-red-200",
};

export default function Alert({
  tone = "info",
  title,
  children,
  onDismiss,
  className = "",
}) {
  const isError = tone === "error";
  return (
    <div
      role={isError ? "alert" : "status"}
      aria-live={isError ? "assertive" : "polite"}
      className={`flex items-start gap-3 border rounded-xl p-3 text-sm ${TONES[tone] || TONES.info} ${className}`}
    >
      <div className="flex-1">
        {title && <p className="font-bold mb-0.5">{title}</p>}
        {children && <div>{children}</div>}
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss message"
          className="shrink-0 min-h-[32px] min-w-[32px] rounded-lg hover:bg-black/5 focus:outline-none focus-visible:ring-4 focus-visible:ring-black/20"
        >
          <span aria-hidden>✕</span>
        </button>
      )}
    </div>
  );
}
