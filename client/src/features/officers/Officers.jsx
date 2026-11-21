import { useState } from "react";
import api from "../../api/client";
import Button from "../../components/Button";

export default function Officers() {
  const [q, setQ] = useState("");
  const [officers, setOfficers] = useState([]);
  const [searched, setSearched] = useState(false);

  async function search() {
    const { data } = await api.get(`/officers?q=${encodeURIComponent(q)}`);
    setOfficers(data.officers);
    setSearched(true);
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-card p-5 space-y-3">
        <h2 className="font-bold text-lg">Patriotic Officers register</h2>
        <p className="text-xs text-plu-slate">Public reference only. No account required.</p>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Name, PO number, role or location"
          className="w-full rounded-lg border border-black/10 px-3 py-2 bg-plu-gray" />
        <Button className="w-full" onClick={search}>Search</Button>
      </div>

      {searched && officers.length === 0 && (
        <p className="text-center text-sm text-plu-slate">No matching officers found.</p>
      )}

      {officers.map((o) => (
        <div key={o.id} className="bg-white rounded-card p-4 shadow-sm">
          <p className="font-mono text-xs text-plu-slate">{o.poNumber}</p>
          <p className="font-semibold">{o.name}</p>
          <p className="text-sm">{o.role} — {o.location}</p>
          <p className="text-xs text-emerald-700 mt-1">{o.status}</p>
        </div>
      ))}
    </div>
  );
}
