export default function StatusBadge({ status }) {
  const map = {
    ACTIVE:    { label: "Active member",       cls: "bg-emerald-100 text-emerald-800", icon: "✓" },
    TENTATIVE: { label: "Tentative, pending approval", cls: "bg-amber-100 text-amber-800", icon: "●" },
    APPROVED:  { label: "Active member",       cls: "bg-emerald-100 text-emerald-800", icon: "✓" }, // legacy
    REJECTED:  { label: "Rejected",            cls: "bg-red-100 text-red-800", icon: "✕" },
    SUSPENDED: { label: "Suspended",           cls: "bg-red-100 text-red-800", icon: "✕" },
  };
  const s = map[status] || { label: status || "Unknown", cls: "bg-gray-100 text-gray-800", icon: "•" };
  return <span className={`badge ${s.cls}`}>{s.icon} {s.label}</span>;
}
