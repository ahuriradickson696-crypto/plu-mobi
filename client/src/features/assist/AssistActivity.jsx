import { useEffect, useState } from "react";
import api from "../../api/client";
import { useAuth } from "../../store/auth";

export default function AssistActivity() {
  const { token } = useAuth();
  const [data, setData] = useState({ registrations: [], endorsements: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    api.get("/members/me/assistance").then((r) => setData(r.data)).finally(() => setLoading(false));
  }, [token]);

  if (loading) return <p className="text-center py-6 text-sm text-plu-slate">Loading…</p>;

  return (
    <div className="space-y-4">
      <h2 className="font-bold text-lg">My assistance activity</h2>
      <section className="bg-white rounded-card p-4">
        <h3 className="text-xs uppercase text-plu-slate tracking-wide">Registrations assisted</h3>
        {data.registrations.length === 0 ? (
          <p className="text-sm text-plu-slate mt-2">No assisted registrations yet.</p>
        ) : (
          <ul className="mt-2 divide-y divide-black/5">
            {data.registrations.map((r) => (
              <li key={r.pcNumber} className="py-2">
                <p className="font-mono text-xs">{r.pcNumber}</p>
                <p className="text-sm">{r.name}</p>
                <p className="text-xs text-plu-slate">{new Date(r.createdAt).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
      <section className="bg-white rounded-card p-4">
        <h3 className="text-xs uppercase text-plu-slate tracking-wide">Endorsements assisted</h3>
        {data.endorsements.length === 0 ? (
          <p className="text-sm text-plu-slate mt-2">No assisted endorsements yet.</p>
        ) : (
          <ul className="mt-2 divide-y divide-black/5">
            {data.endorsements.map((e) => (
              <li key={e.id} className="py-2">
                <p className="text-sm">{e.name}</p>
                <p className="text-xs text-plu-slate">{new Date(e.createdAt).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
