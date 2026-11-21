import { useState } from "react";
import api from "../../api/client";
import Button from "../../components/Button";

export default function TrackCorruption() {
  const [code, setCode] = useState("");
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");

  async function lookup(e) {
    e.preventDefault();
    setError(""); setReport(null);
    try {
      const { data } = await api.get(`/corruption/track/${code.trim().toUpperCase()}`);
      if (!data.found) return setError("No report found for that code.");
      setReport(data.report);
    } catch {
      setError("Lookup failed.");
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={lookup} className="bg-white rounded-card p-5 space-y-3">
        <h2 className="font-bold text-lg">Track a report</h2>
        <p className="text-xs text-plu-slate">Enter the tracking code you received when you filed the report.</p>
        <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="ABCD1234"
          className="w-full rounded-lg border border-black/10 px-3 py-2 bg-plu-gray font-mono uppercase tracking-widest text-center" />
        <Button className="w-full" type="submit" disabled={!code}>Check status</Button>
        {error && <p className="text-red-600 text-sm">{error}</p>}
      </form>

      {report && (
        <div className="bg-white rounded-card p-5 space-y-2">
          <p className="text-xs text-plu-slate">Tracking code</p>
          <p className="font-mono font-bold text-lg">{report.trackingCode}</p>
          <hr className="border-black/5" />
          <Row label="Category" value={report.category} />
          <Row label="Status" value={report.status} />
          <Row label="Filed" value={new Date(report.createdAt).toLocaleString()} />
          <Row label="Last update" value={new Date(report.updatedAt).toLocaleString()} />
        </div>
      )}
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-2">
      <span className="text-plu-slate text-xs">{label}</span>
      <span className="text-right text-sm">{value}</span>
    </div>
  );
}
