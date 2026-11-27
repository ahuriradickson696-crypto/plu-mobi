import { AlertCircle, CheckCircle2, Clock, Info, XCircle } from 'lucide-react';

type Status = 'tentative' | 'approved' | 'rejected' | 'info' | 'neutral';

const config: Record<Status, { label: string; className: string; Icon: typeof AlertCircle }> = {
  tentative: { label: 'Tentative', className: 'bg-status-tentative/15 text-[#92400E] border-status-tentative/40', Icon: Clock },
  approved:  { label: 'Approved',  className: 'bg-status-approved/15  text-[#065F46] border-status-approved/40',  Icon: CheckCircle2 },
  rejected:  { label: 'Rejected',  className: 'bg-status-rejected/15  text-[#991B1B] border-status-rejected/40',  Icon: XCircle },
  info:      { label: 'Info',      className: 'bg-status-info/15      text-[#1E40AF] border-status-info/40',      Icon: Info },
  neutral:   { label: 'Pending',   className: 'bg-surface-sunken      text-ink-secondary border-line-subtle',       Icon: AlertCircle },
};

export interface StatusChipProps {
  status: Status;
  children?: React.ReactNode;
}

export function StatusChip({ status, children }: StatusChipProps) {
  const { label, className, Icon } = config[status];
  return (
    <span
      role="status"
      className={[
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold',
        className,
      ].join(' ')}
    >
      <Icon aria-hidden="true" className="h-3.5 w-3.5" />
      <span>{children ?? label}</span>
    </span>
  );
}
