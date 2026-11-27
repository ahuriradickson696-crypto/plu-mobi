export function AuditLogViewer({ reviews }) {
  if (!reviews || reviews.length === 0) {
    return <p className="text-sm text-ink-secondary">No prior decisions recorded.</p>;
  }
  return (
    <ol className="space-y-2" aria-label="Decision history">
      {reviews.map((rv) => (
        <li key={rv.id} className="border-t border-line-subtle pt-2 first:border-t-0 first:pt-0">
          <p className="text-sm text-ink-primary">
            <span className="font-mono">{rv.reviewer?.pcNumber || ""}</span>{" "}
            - {rv.decision}{" "}
            <span className="text-xs text-ink-secondary">
              · {new Date(rv.createdAt).toLocaleString()}
            </span>
          </p>
          {rv.reason && (
            <p className="text-xs text-ink-secondary mt-1">Reason: {rv.reason}</p>
          )}
        </li>
      ))}
    </ol>
  );
}
