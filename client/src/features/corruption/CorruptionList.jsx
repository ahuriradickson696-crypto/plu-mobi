import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/client";
import { useAuth } from "../../store/auth";

export default function CorruptionList() {
  const nav = useNavigate();
  const { token, member } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return nav("/login");
    if (!member?.isReviewer) { setError("Forbidden"); setLoading(false); return; }
    api.get("/corruption/list")
      .then((r) => setReports(r.data.reports))
      .catch((e) => setError(e.response?.data?.error || "Failed to load reports"))
      .finally(() => setLoading(false));
  }, [token, member]);

  if (loading) return <p className="text-center py-6 text-sm text-plu-slate">Loading…</p>;
  if (error) return <p className="text-center py-6 text-sm text-red-600">{error}</p>;

  return (
    <div className="space-y-4">
      <div className="bg-plu-black text-white rounded-card p-5">
        <p className="text-xs text-plu-yellow font-semibold tracking-widest">ACCOUNTABILITY</p>
        <h2 className="text-xl font-bold mt-1">Corruption reports</h2>
        <p className="text-sm text-white/70 mt-1">{reports.length} report(s)</p>
      </div>

      {reports.length === 0 && (
        <div className="bg-white rounded-card p-6 text-center">
          <p className="text-sm text-plu-slate">No reports yet.</p>
        </div>
      )}

      {reports.map((r) => (
        <Link key={r.id} to={`/corruption/${r.id}`} className="block bg-white rounded-card p-4 hover:bg-gray-50 space-y-1">
          <div className="flex items-center justify-between">
            <p className="font-mono text-xs text-plu-slate">{r.trackingCode}</p>
            <span className="badge bg-blue-100 text-blue-800">{r.status}</span>
          </div>
          <p className="font-semibold">{r.category}</p>
          <p className="text-xs text-plu-slate">{r.location}</p>
          <p className="text-xs text-plu-slate line-clamp-2 mt-1">{r.description}</p>
          {r.evidencePath && <p className="text-xs text-emerald-700 mt-1">📎 Evidence attached</p>}
          {r.isAnonymous && <p className="text-xs text-amber-700 mt-1">Anonymous</p>}
        </Link>
      ))}
    </div>
  );
}
