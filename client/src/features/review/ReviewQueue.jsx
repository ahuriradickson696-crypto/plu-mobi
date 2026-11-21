import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/client";
import { useAuth } from "../../store/auth";

export default function ReviewQueue() {
  const nav = useNavigate();
  const { token, member } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return nav("/login");
    if (!member?.isReviewer) { setError("You do not have reviewer capability."); setLoading(false); return; }
    api.get("/review/queue")
      .then((r) => setRecords(r.data.records))
      .catch((e) => setError(e.response?.data?.error || "Failed to load queue"))
      .finally(() => setLoading(false));
  }, [token, member]);

  if (loading) return <p className="text-center py-6 text-sm text-plu-slate">Loading queue…</p>;
  if (error) return <p className="text-center py-6 text-sm text-red-600">{error}</p>;

  return (
    <div className="space-y-4">
      <div className="bg-plu-black text-white rounded-card p-5">
        <p className="text-xs text-plu-yellow font-semibold tracking-widest">ADMIN REVIEW</p>
        <h2 className="text-xl font-bold mt-1">Tentative queue</h2>
        <p className="text-sm text-white/70 mt-1">{records.length} record(s) awaiting review</p>
      </div>
      {records.length === 0 && (
        <div className="bg-white rounded-card p-6 text-center">
          <p className="text-sm text-plu-slate">Queue is empty.</p>
        </div>
      )}
      {records.map((r) => (
        <Link key={r.id} to={`/review/${r.id}`} className="block bg-white rounded-card p-4 hover:bg-gray-50">
          <div className="flex items-center justify-between">
            <p className="font-mono text-xs text-plu-slate">{r.pcNumber}</p>
            <p className="text-xs text-plu-slate">{new Date(r.createdAt).toLocaleDateString()}</p>
          </div>
          <p className="font-semibold mt-1">{r.name}</p>
          <p className="text-xs text-plu-slate">{r.location} · {r.phone}</p>
          {r.assistedBy && <p className="text-xs text-amber-700 mt-1">Assisted by {r.assistedBy}</p>}
        </Link>
      ))}
    </div>
  );
}
