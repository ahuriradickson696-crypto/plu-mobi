import { useEffect, useState } from "react";
import api from "../../api/client";
import Button from "../../components/Button";

export default function Endorse() {
  const [stats, setStats] = useState({ total: 0, assisted: 0, direct: 0 });
  const [form, setForm] = useState({ name: "", phone: "" });
  const [done, setDone] = useState(false);

  useEffect(() => {
    api.get("/endorsements/stats").then((r) => setStats(r.data)).catch(() => {});
  }, []);

  async function submit(e) {
    e.preventDefault();
    await api.post("/endorsements", form);
    setDone(true);
    const { data } = await api.get("/endorsements/stats");
    setStats(data);
  }

  if (done) {
    return (
      <div className="bg-white rounded-card p-6 text-center space-y-3">
        <h2 className="text-xl font-bold text-emerald-600">Endorsement recorded</h2>
        <p className="text-sm text-plu-slate">Total endorsements: {stats.total}</p>
        <Button className="w-full" onClick={() => { setDone(false); setForm({name:"", phone:""}); }}>Submit another</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-plu-black text-white rounded-card p-5">
        <p className="text-xs text-plu-yellow font-semibold tracking-widest">PUBLIC ENDORSEMENT</p>
        <p className="text-3xl font-bold mt-1">{stats.total}</p>
        <p className="text-xs text-white/70">total endorsements recorded</p>
      </div>

      <form onSubmit={submit} className="bg-white rounded-card p-5 space-y-3">
        <h2 className="font-bold text-lg">Add your endorsement</h2>
        <p className="text-xs text-plu-slate">Anyone can endorse. No account required.</p>
        <label className="block">
          <span className="text-xs text-plu-slate">Your name</span>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 bg-plu-gray" />
        </label>
        <label className="block">
          <span className="text-xs text-plu-slate">Phone (optional)</span>
          <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 bg-plu-gray" />
        </label>
        <Button className="w-full" type="submit" disabled={!form.name}>Submit endorsement</Button>
      </form>
    </div>
  );
}
