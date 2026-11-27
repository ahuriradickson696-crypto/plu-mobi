import { useRef, useState } from "react";
import { Button, StatusChip } from "../../../design-system/components";

export function ApprovalActions({ record, onDecision, saving }) {
  const [pending, setPending] = useState(null);
  const [reason, setReason] = useState("");
  const dialogRef = useRef(null);

  function open(decision) {
    setPending(decision);
    setReason("");
    requestAnimationFrame(() => dialogRef.current?.showModal());
  }
  function close() {
    dialogRef.current?.close();
    setPending(null);
  }
  function confirm() {
    if (!pending) return;
    onDecision(pending, reason);
    close();
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3">
        <Button variant="primary" size="lg" onClick={() => open("APPROVED")} className="flex-1">
          Approve
        </Button>
        <Button variant="danger" size="lg" onClick={() => open("REJECTED")} className="flex-1">
          Reject
        </Button>
        <Button variant="secondary" size="lg" onClick={() => open("FLAGGED")} className="flex-1">
          Flag for review
        </Button>
      </div>

      <dialog
        ref={dialogRef}
        aria-labelledby="confirm-title"
        className="rounded-card p-6 max-w-md w-full border border-line-subtle"
        onClose={close}
      >
        <h2 id="confirm-title" className="text-lg font-semibold text-ink-primary mb-2">
          Confirm {pending?.toLowerCase()} for {record.pcNumber}
        </h2>
        <p className="text-sm text-ink-secondary mb-3">
          This will be recorded in the audit log with your reviewer identity.
        </p>
        <div className="flex flex-col gap-1 mb-4">
          <label htmlFor="confirm-reason" className="text-sm font-medium text-ink-primary">
            Reason (optional)
          </label>
          <textarea
            id="confirm-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            className="rounded-md border border-line-strong bg-surface-base px-3 py-2 text-base text-ink-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          />
        </div>
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={close} disabled={saving}>
            Cancel
          </Button>
          <Button
            variant={pending === "REJECTED" ? "danger" : "primary"}
            onClick={confirm}
            loading={saving}
          >
            Confirm {pending?.toLowerCase()}
          </Button>
        </div>
      </dialog>
    </>
  );
}
