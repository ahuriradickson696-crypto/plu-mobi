import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/client";
import { useAuth } from "../../store/auth";

export default function ReportingDashboard() {
  const nav = useNavigate();
  const { token, member } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return nav("/login");
    if (!member?.isReviewer) { setError("Forbidden"); setLoading(false); return; }
    api.get("/reporting/dashboard")
      .then((r) => setData(r.data))
      .catch((e) => setError(e.response?.data?.error || "Failed to load"))
      .finally(() => setLoading(false));
  }, [token, member, nav]);

  if (loading) return <p className="text-center py-6 text-sm text-plu-slate">Loading…</p>;
  if (error) return <p className="text-center py-6 text-sm text-red-600">{error}</p>;
  if (!data) return null;

  const approved = data.members.byStatus.find((s) => s.status === "APPROVED")?.count || 0;
  const tentative = data.members.byStatus.find((s) => s.status === "TENTATIVE")?.count || 0;
  const rejected = data.members.byStatus.find((s) => s.status === "REJECTED")?.count || 0;

  return (
    <div className="space-y-4">
      <div className="bg-plu-black text-white rounded-card p-5">
        <p className="text-xs text-plu-yellow font-semibold tracking-widest">ADMIN DASHBOARD</p>
        <h2 className="text-xl font-bold mt-1">Reporting overview</h2>
      </div>

      <Card title="Members">
        <BigNumber value={data.members.total} label="Total registered" />
        <div className="grid grid-cols-3 gap-2 mt-2">
          <Pill label="Approved" value={approved} tone="emerald" />
          <Pill label="Tentative" value={tentative} tone="amber" />
          <Pill label="Rejected" value={rejected} tone="red" />
        </div>
      </Card>

      <Card title="Endorsements">
        <BigNumber value={data.endorsements.total} label="Total endorsements" />
      </Card>

      <Card title="Corruption reports">
        <BigNumber value={data.corruption.total} label="Total reports" tone="red" />
        {data.corruption.byStatus.length > 0 && (
          <div className="mt-2">
            <p className="text-xs text-plu-slate mb-1">By status</p>
            <div className="grid grid-cols-2 gap-2">
              {data.corruption.byStatus.map((s) => (
                <Pill key={s.status} label={s.status.replace("_", " ")} value={s.count} tone="blue" />
              ))}
            </div>
          </div>
        )}
        {data.corruption.byCategory.length > 0 && (
          <div className="mt-3">
            <p className="text-xs text-plu-slate mb-1">By category</p>
            <ul className="space-y-1">
              {data.corruption.byCategory.map((c) => (
                <li key={c.category} className="flex justify-between text-sm">
                  <span>{c.category}</span>
                  <span className="font-mono">{c.count}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Card>

      {data.districts.length > 0 && (
        <Card title="Top districts">
          <ul className="space-y-1">
            {data.districts.map((d) => (
              <li key={d.location} className="flex justify-between text-sm">
                <span>{d.location}</span>
                <span className="font-mono">{d.count}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {data.recentAudit.length > 0 && (
        <Card title="Recent activity">
          <ul className="space-y-2">
            {data.recentAudit.map((a) => (
              <li key={a.id} className="text-xs border-t border-black/5 pt-2 first:border-0 first:pt-0">
                <p className="font-semibold">{a.action}</p>
                <p className="text-plu-slate">
                  {a.actorPc}{a.targetPc && `  ${a.targetPc}`}{" · "}
                  {new Date(a.createdAt).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}

function Card({ title, children }) {
  return (
    <section className="bg-white rounded-card p-5 space-y-2">
      <h3 className="text-xs uppercase text-plu-slate tracking-wide">{title}</h3>
      {children}
    </section>
  );
}

function BigNumber({ value, label, tone }) {
  const color = tone === "red" ? "text-plu-red" : "text-plu-black";
  return (
    <div>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
      <p className="text-xs text-plu-slate">{label}</p>
    </div>
  );
}

function Pill({ label, value, tone }) {
  const tones = {
    emerald: "bg-emerald-50 text-emerald-800",
    amber:   "bg-amber-50 text-amber-800",
    red:     "bg-red-50 text-red-800",
    blue:    "bg-blue-50 text-blue-800",
  };
  return (
    <div className={`rounded-lg px-3 py-2 text-center ${tones[tone] || tones.blue}`}>
      <p className="text-lg font-bold">{value}</p>
      <p className="text-xs">{label}</p>
    </div>
  );
}
