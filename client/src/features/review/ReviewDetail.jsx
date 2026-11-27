import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/client";
import { useAuth } from "../../store/auth";
import { Button, StatusChip } from "../../design-system/components";
import { RoleGate } from "./components/RoleGate";
import { ApprovalActions } from "./components/ApprovalActions";
import { AuditLogViewer } from "./components/AuditLogViewer";

const STATUS_MAP = {
  tentative: { status: "tentative", label: "Tentative" },
  active: { status: "approved", label: "Active" },
  approved: { status: "approved", label: "Approved" },
  rejected: { status: "rejected", label: "Rejected" },
  flagged: { status: "neutral", label: "Flagged" },
};

export default function ReviewDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const { token } = useAuth();
  const [record, setRecord] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!token) return;
    api
      .get(`/review/${id}`)
      .then((r) => setRecord(r.data.record))
      .catch((e) => setError(e.response?.data?.error || "Failed to load record"));
  }, [id, token]);

  async function submitDecision(decision, reason) {
    setSaving(true);
    setError("");
    try {
      await api.post(`/review/${id}/decision`, { decision, reason: reason || null });
      setDone(true);
    } catch (e) {
      setError(e.response?.data?.error || "Failed to submit decision");
    } finally {
      setSaving(false);
    }
  }

  const statusKey = (record?.status || "tentative").toLowerCase();
  const status = STATUS_MAP[statusKey] || STATUS_MAP.tentative;

  return (
    <main className="max-w-3xl mx-auto px-4 md:px-6 py-6 md:py-8 space-y-6">
      <RoleGate>
        {error && <p role="alert" className="text-sm text-status-rejected">{error}</p>}

        {done && (
          <div className="rounded-card border border-line-subtle bg-surface-base p-6 text-center space-y-3">
            <h2 className="text-xl font-bold text-status-approved">Decision recorded</h2>
            <p className="text-sm text-ink-secondary">{record.pcNumber} - status updated.</p>
            <Button onClick={() => nav("/review")}>Back to queue</Button>
          </div>
        )}

        {!done && !record && !error && (
          <p role="status" aria-live="polite" className="text-sm text-ink-secondary">Loading…</p>
        )}

        {!done && record && (
          <>
            <section className="rounded-card border border-line-subtle bg-surface-base p-5 space-y-2">
              <p className="text-xs uppercase tracking-widest text-ink-secondary">Review record</p>
              <h1 className="text-2xl font-extrabold text-ink-primary">{record.name}</h1>
              <p className="font-mono text-sm text-ink-secondary">{record.pcNumber}</p>
              <StatusChip status={status.status}>{status.label}</StatusChip>
            </section>

            <section className="rounded-card border border-line-subtle bg-surface-base p-5">
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div><dt className="text-xs text-ink-secondary">Pathway</dt><dd className="text-ink-primary">{record.pathway || ""}</dd></div>
                <div><dt className="text-xs text-ink-secondary">Phone</dt><dd className="text-ink-primary font-mono">{record.phone || ""}</dd></div>
                <div><dt className="text-xs text-ink-secondary">Email</dt><dd className="text-ink-primary">{record.email || ""}</dd></div>
                <div><dt className="text-xs text-ink-secondary">Location</dt><dd className="text-ink-primary">{record.location || ""}</dd></div>
                <div><dt className="text-xs text-ink-secondary">Registered</dt><dd className="text-ink-primary">{new Date(record.createdAt).toLocaleString()}</dd></div>
                <div><dt className="text-xs text-ink-secondary">Assisted by</dt><dd className="text-ink-primary">{record.assistedBy || ""}</dd></div>
              </dl>
            </section>

            <section className="rounded-card border border-line-subtle bg-surface-base p-5 space-y-3">
              <h2 className="text-sm font-semibold text-ink-primary">Decision</h2>
              <ApprovalActions record={record} onDecision={submitDecision} saving={saving} />
            </section>

            <section className="rounded-card border border-line-subtle bg-surface-raised p-5 space-y-3">
              <h2 className="text-sm font-semibold text-ink-primary">History</h2>
              <AuditLogViewer reviews={record.reviewsReceived || []} />
            </section>
          </>
        )}
      </RoleGate>
    </main>
  );
}
