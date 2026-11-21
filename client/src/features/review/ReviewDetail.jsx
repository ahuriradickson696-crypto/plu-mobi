import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/client";
import { useAuth } from "../../store/auth";
import Button from "../../components/Button";
import StatusBadge from "../../components/StatusBadge";
import { notify } from "../../lib/notify";

export default function ReviewDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const { token, member } = useAuth();
  const [record, setRecord] = useState(null);
  const [decision, setDecision] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!token) return nav("/login");
    if (!member?.isReviewer) { setError("Forbidden"); return; }
    api.get(`/review/${id}`)
      .then((r) => setRecord(r.data.record))
      .catch((e) => setError(e.response?.data?.error || "Failed to load record"));
  }, [id, token, member]);

  async function submit() {
    setSaving(true); setError("");
    try {
      await api.post(`/review/${id}/decision`, { decision, reason: reason || null });
      setDone(true);
      notify("Decision recorded", `${record.pcNumber} was ${decision.toLowerCase()}.`);
    } catch (e) {
      setError(e.response?.data?.error || "Failed to submit decision");
    } finally { setSaving(false); }
  }

  if (error) return <p className="text-center py-6 text-sm text-red-600">{error}</p>;
  if (!record) return <p className="text-center py-6 text-sm text-plu-slate">Loading…</p>;

  if (done) {
    return (
      <div className="bg-white rounded-card p-6 text-center space-y-3">
        <h2 className="text-xl font-bold text-emerald-600">Decision recorded</h2>
        <p className="text-sm text-plu-slate">{record.pcNumber} → status updated.</p>
        <Button className="w-full" onClick={() => nav("/review")}>Back to queue</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-plu-black text-white rounded-card p-5">
        <p className="text-xs text-plu-yellow">REVIEW RECORD</p>
        <h2 className="text-xl font-bold mt-1">{record.name}</h2>
        <p className="font-mono text-sm">{record.pcNumber}</p>
        <div className="mt-2"><StatusBadge status={record.status} /></div>
      </div>
      <div className="bg-white rounded-card p-5 space-y-2 text-sm">
        <Row label="Pathway" value={record.pathway} />
        <Row label="Phone" value={record.phone} />
        <Row label="Email" value={record.email || "—"} />
        <Row label="Location" value={record.location} />
        <Row label="Registered" value={new Date(record.createdAt).toLocaleString()} />
        <Row label="Assisted by" value={record.assistedBy || "—"} />
      </div>
      {record.reviewsReceived?.length > 0 && (
        <div className="bg-white rounded-card p-4">
          <p className="text-xs uppercase text-plu-slate tracking-wide mb-2">History</p>
          {record.reviewsReceived.map((rv) => (
            <div key={rv.id} className="border-t border-black/5 py-2 text-sm">
              <p><strong>{rv.reviewer.pcNumber}</strong> — {rv.decision}
                <span className="text-xs text-plu-slate"> · {new Date(rv.createdAt).toLocaleString()}</span>
              </p>
              {rv.reason && <p className="text-xs text-plu-slate mt-1">Reason: {rv.reason}</p>}
            </div>
          ))}
        </div>
      )}
      <div className="bg-white rounded-card p-5 space-y-3">
        <h3 className="font-bold">Record a decision</h3>
        <div className="grid grid-cols-3 gap-2">
          {["APPROVED", "REJECTED", "INFO_REQUESTED"].map((d) => (
            <button key={d} onClick={() => setDecision(d)}
              className={`py-2 rounded-card border text-xs font-semibold ${decision === d ? "border-plu-yellow bg-plu-yellow/20" : "border-black/10"}`}>
              {d === "INFO_REQUESTED" ? "Request info" : d}
            </button>
          ))}
        </div>
        <label className="block">
          <span className="text-xs text-plu-slate">Reason (optional)</span>
          <textarea rows={3} value={reason} onChange={(e) => setReason(e.target.value)}
            className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 bg-plu-gray" />
        </label>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <Button className="w-full" onClick={submit} disabled={!decision || saving}>
          {saving ? "Saving…" : "Submit decision"}
        </Button>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-2">
      <span className="text-plu-slate text-xs">{label}</span>
      <span className="text-right">{value}</span>
    </div>
  );
}

