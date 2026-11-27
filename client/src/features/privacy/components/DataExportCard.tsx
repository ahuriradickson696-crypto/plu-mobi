import { useState } from "react";
import { Button } from "../../../design-system/components";
import { requestDataExport } from "../api";

export function DataExportCard() {
  const [status, setStatus] = useState(null);

  async function handleExport() {
    setStatus("loading");
    try {
      const result = await requestDataExport();
      setStatus(`Requested at ${new Date(result.requestedAt).toLocaleString()}`);
    } catch {
      setStatus("Could not submit request. Try again.");
    }
  }

  return (
    <section
      aria-labelledby="export-heading"
      className="rounded-card border border-line-subtle bg-surface-base p-4 space-y-3"
    >
      <h2 id="export-heading" className="text-sm font-semibold text-ink-primary">
        Download my data
      </h2>
      <p className="text-sm text-ink-secondary">
        Request a copy of all personal data we hold about you. You will receive it in-app and by email if one is on file.
      </p>
      <Button onClick={handleExport} loading={status === "loading"} size="lg">
        Request data export
      </Button>
      {status && status !== "loading" && (
        <p role="status" aria-live="polite" className="text-xs text-ink-secondary">
          {status}
        </p>
      )}
    </section>
  );
}
