import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/client";
import { useAuth } from "../../store/auth";
import Button from "../../components/Button";

const STATUSES = ["RECEIVED", "UNDER_REVIEW", "RESOLVED", "DISMISSED"];

export default function CorruptionDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const { token, member } = useAuth();
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!token) return nav("/login");
    if (!member?.isReviewer) { setError("Forbidden"); return; }
    api.get(`/corruption/${id}`)
      .then((r) => setReport(r.data.report))
      .catch((e) => setError(e.response?.data?.error || "Failed to load"));
  }, [id, token, member]);

  async function setStatus(status) {
    setSaving(true);
    try {
      await api.post(`/corruption/${id}/status`, { status });
      setReport({ ...report, status });
    } catch (e) {
      setError(e.response?.data?.error || "Failed to update status");
    } finally {
      setSaving(false);
    }
  }

  async function downloadEvidence() {
    try {
      const response = await api.get(`/corruption/${id}/evidence`, { responseType: "blob" });
      const url = URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = report.evidencePath;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Failed to download evidence");
    }
  }

  if (error) return <p className="text-center py-6 text-sm text-red-600">{error}</p>;
  if (!report) return <p className="text-center py-6 text-sm text-plu-slate">Loading…</p>;

  return (
    <div className="space-y-4">
      <div className="bg-plu-black text-white rounded-card p-5">
        <p className="text-xs text-plu-yellow">CORRUPTION REPORT</p>
        <h2 className="text-xl font-bold mt-1">{report.category}</h2>
        <p className="font-mono text-sm">{report.trackingCode}</p>
        <p className="text-xs text-white/70 mt-1">Status: {report.status}</p>
      </div>

      <div className="bg-white rounded-card p-5 space-y-3 text-sm">
        <div>
          <p className="text-xs text-plu-slate mb-1">Description</p>
          <p>{report.description}</p>
        </div>
        <hr className="border-black/5" />
        <Row label="Location" value={report.location} />
        <Row label="Filed" value={new Date(report.createdAt).toLocaleString()} />
        {report.isAnonymous ? (
          <Row label="Reporter" value="Anonymous" />
        ) : (
          <>
            <Row label="Reporter" value={report.reporterName || ""} />
            <Row label="Phone" value={report.reporterPhone || ""} />
          </>
        )}
      </div>

      {report.evidencePath && (
        <div className="bg-white rounded-card p-5 space-y-2">
          <p className="text-xs text-plu-slate">Evidence</p>
          <p className="text-sm font-mono">{report.evidencePath}</p>
          <Button onClick={downloadEvidence}>Download evidence</Button>
        </div>
      )}

      <div className="bg-white rounded-card p-5 space-y-3">
        <h3 className="font-bold">Update status</h3>
        <div className="grid grid-cols-2 gap-2">
          {STATUSES.map((s) => (
            <button key={s} onClick={() => setStatus(s)}
              disabled={saving || report.status === s}
              className={`py-2 rounded-card border text-xs font-semibold ${report.status === s ? "border-plu-yellow bg-plu-yellow/20" : "border-black/10"} disabled:opacity-50`}>
              {s.replace("_", " ")}
            </button>
          ))}
        </div>
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
