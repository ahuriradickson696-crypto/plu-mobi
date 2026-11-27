import { useEffect, useState } from "react";
import { fetchConsentHistory } from "../api";

export function ConsentHistory() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchConsentHistory().then((data) => setItems(data.items || []));
  }, []);

  return (
    <section
      aria-labelledby="consent-heading"
      className="rounded-card border border-line-subtle bg-surface-raised p-4 space-y-3"
    >
      <h2 id="consent-heading" className="text-sm font-semibold text-ink-primary">
        Consent history
      </h2>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="text-sm text-ink-secondary border-b border-line-subtle pb-2 last:border-b-0 last:pb-0">
            <p className="font-medium text-ink-primary">{item.policyVersion}</p>
            <p className="text-xs">
              Accepted: {new Date(item.acceptedAt).toLocaleString()}
            </p>
            <p className="text-xs">
              Cross-border transfer consent:{" "}
              {item.crossBorderConsent ? "Given" : "Not given"}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
