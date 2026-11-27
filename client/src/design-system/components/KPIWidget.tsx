import type { ReactNode } from 'react';

export interface KPIWidgetProps {
  label: string;
  value: ReactNode;
  hint?: string;
  live?: boolean;
}

export function KPIWidget({ label, value, hint, live = true }: KPIWidgetProps) {
  return (
    <div className="rounded-card border border-line-subtle bg-surface-base p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-ink-secondary">{label}</p>
      <p
        role={live ? 'status' : undefined}
        aria-live={live ? 'polite' : undefined}
        aria-atomic="true"
        className="mt-1 text-2xl font-bold text-ink-primary"
      >
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-ink-secondary">{hint}</p>}
    </div>
  );
}
