export function DPOContact() {
  const name = import.meta.env.VITE_DPO_NAME || "";
  const email = import.meta.env.VITE_DPO_EMAIL || "";
  const phone = import.meta.env.VITE_DPO_PHONE || "";
  const regNumber = import.meta.env.VITE_PDPO_REG_NUMBER || "";

  return (
    <section
      aria-labelledby="dpo-heading"
      className="rounded-card border border-line-subtle bg-surface-raised p-4 space-y-2"
    >
      <h2 id="dpo-heading" className="text-sm font-semibold text-ink-primary">
        Data Protection Officer
      </h2>
      {name && email ? (
        <div className="text-sm text-ink-secondary space-y-1">
          <p>
            <span className="font-medium text-ink-primary">Name:</span> {name}
          </p>
          <p>
            <span className="font-medium text-ink-primary">Email:</span>{" "}
            <a href={`mailto:${email}`} className="underline text-ink-primary">
              {email}
            </a>
          </p>
          {phone && (
            <p>
              <span className="font-medium text-ink-primary">Phone:</span> {phone}
            </p>
          )}
        </div>
      ) : (
        <p className="text-sm text-ink-secondary">
          Contact the PLU Secretariat at{" "}
          <a href="mailto:support@plu-mobi.ug" className="underline text-ink-primary">
            support@plu-mobi.ug
          </a>
          .
        </p>
      )}
      <p className="text-xs text-ink-secondary">
        PDPO registration:{" "}
        {regNumber ? (
          <span className="font-mono">{regNumber}</span>
        ) : (
          <span className="italic">Pending registration</span>
        )}
      </p>
    </section>
  );
}
