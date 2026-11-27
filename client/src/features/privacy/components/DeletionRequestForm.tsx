import { useState } from "react";
import { Button, FormField } from "../../../design-system/components";
import { requestDeletion } from "../api";

export function DeletionRequestForm() {
  const [confirmation, setConfirmation] = useState("");
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState(null);

  const canSubmit = confirmation.trim().toUpperCase() === "DELETE";

  async function handleSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;
    setStatus("loading");
    try {
      const result = await requestDeletion({ reason, confirmation });
      setStatus(`${result.ticketId} - ${result.note}`);
      setReason("");
      setConfirmation("");
    } catch {
      setStatus("Could not submit. Try again.");
    }
  }

  return (
    <section
      aria-labelledby="delete-heading"
      className="rounded-card border border-status-rejected/40 bg-surface-base p-4 space-y-3"
    >
      <h2 id="delete-heading" className="text-sm font-semibold text-ink-primary">
        Request deletion
      </h2>
      <p className="text-sm text-ink-secondary">
        This will remove your personal data. Audit log entries remain (pseudonymised) to preserve accountability.
      </p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <FormField
          label="Reason (optional)"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        <FormField
          label='Type DELETE to confirm'
          value={confirmation}
          onChange={(e) => setConfirmation(e.target.value)}
          required
          hint="Type the word DELETE in capitals"
        />
        <Button type="submit" variant="danger" disabled={!canSubmit} loading={status === "loading"}>
          Request deletion
        </Button>
        {status && status !== "loading" && (
          <p role="status" aria-live="polite" className="text-xs text-ink-secondary">
            {status}
          </p>
        )}
      </form>
    </section>
  );
}
