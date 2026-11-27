import { useState } from "react";
import { Button, FormField } from "../../../design-system/components";
import { requestCorrection } from "../api";

export function CorrectionRequestForm() {
  const [field, setField] = useState("fullName");
  const [newValue, setNewValue] = useState("");
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("loading");
    try {
      const result = await requestCorrection({ field, newValue, reason });
      setStatus(`Request ${result.ticketId} received.`);
      setNewValue("");
      setReason("");
    } catch {
      setStatus("Could not submit. Try again.");
    }
  }

  return (
    <section
      aria-labelledby="correct-heading"
      className="rounded-card border border-line-subtle bg-surface-base p-4 space-y-3"
    >
      <h2 id="correct-heading" className="text-sm font-semibold text-ink-primary">
        Request a correction
      </h2>
      <p className="text-sm text-ink-secondary">
        Tell us what needs correcting. An administrator will review and apply the change.
      </p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="correction-field" className="text-sm font-medium text-ink-primary">
            Field
          </label>
          <select
            id="correction-field"
            value={field}
            onChange={(e) => setField(e.target.value)}
            className="min-h-comfortable rounded-md border border-line-strong bg-surface-base px-3 py-2 text-base text-ink-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          >
            <option value="fullName">Full name</option>
            <option value="phone">Phone number</option>
            <option value="email">Email</option>
            <option value="location">Location</option>
          </select>
        </div>
        <FormField
          label="New value"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          required
        />
        <FormField
          label="Reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          hint="Briefly explain why this change is needed"
        />
        <Button type="submit" loading={status === "loading"}>
          Submit correction request
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
