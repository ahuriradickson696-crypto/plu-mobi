export default function Spinner({ label = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-3" role="status" aria-live="polite">
      <div className="w-10 h-10 border-4 border-plu-yellow border-t-plu-black rounded-full animate-spin" />
      <p className="text-sm text-plu-slate">{label}</p>
    </div>
  );
}
