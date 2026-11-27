import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../store/auth";
import { Button, StatusChip, KPIWidget } from "../../design-system/components";

const STATUS_MAP = {
  tentative: { status: "tentative", label: "Tentative, pending approval" },
  active:    { status: "approved",  label: "Active member" },
  suspended: { status: "rejected",  label: "Suspended" },
};

export default function Dashboard() {
  const nav = useNavigate();
  const { member } = useAuth();

  if (!member) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-10 text-center">
        <p className="text-sm text-ink-secondary mb-4">
          You need to sign in to view your dashboard.
        </p>
        <Link
          to="/login"
          className="inline-block bg-plu-yellow text-plu-black font-semibold px-5 py-3 rounded-xl
                     focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
        >
          Go to Sign in
        </Link>
      </main>
    );
  }

  const statusKey = (member.status || "tentative").toLowerCase();
  const status = STATUS_MAP[statusKey] || STATUS_MAP.tentative;

  return (
    <main className="max-w-3xl mx-auto px-4 md:px-6 py-6 md:py-8 space-y-6">
      {/* ---- Identity card ---- */}
      <section
        aria-labelledby="member-heading"
        className="bg-surface-base rounded-2xl shadow-md border border-line-subtle p-5 md:p-6"
      >
        <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="flex items-start gap-3">
            <img
              src="/plu-logo-circle.png"
              alt=""
              className="h-12 w-12 rounded-full object-cover border-2 border-plu-yellow shrink-0"
              onError={(e) => { e.currentTarget.style.display = "none"; }}
            />
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-ink-secondary mb-1">
                Member
              </p>
              <h1
                id="member-heading"
                className="text-2xl md:text-3xl font-extrabold text-ink-primary leading-tight"
              >
                {member.fullName || "Member"}
              </h1>
              <p className="font-mono text-sm text-ink-secondary mt-1">
                {member.pcNumber || ""}
              </p>
            </div>
          </div>
          <StatusChip status={status.status}>{status.label}</StatusChip>
        </header>
      </section>

      {/* ---- KPIs (live counts) ---- */}
      <section aria-labelledby="kpi-heading" className="space-y-3">
        <h2
          id="kpi-heading"
          className="text-xs font-semibold uppercase tracking-widest text-ink-secondary px-1"
        >
          At a glance
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <KPIWidget label="Members" value="96,207" hint="Across 146 districts" />
          <KPIWidget label="Endorsements" value="300K+" hint="On the platform" />
          <KPIWidget label="Districts" value="146" hint="All represented" />
        </div>
      </section>

      {/* ---- Quick actions ---- */}
      <section aria-labelledby="actions-heading" className="space-y-3">
        <h2
          id="actions-heading"
          className="text-xs font-semibold uppercase tracking-widest text-ink-secondary px-1"
        >
          Quick actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button onClick={() => nav("/card")} variant="primary" size="lg">
            View digital card
          </Button>
          <Button onClick={() => nav("/assist/register")} variant="secondary" size="lg">
            Help someone register
          </Button>
          <Button onClick={() => nav("/assist/endorse")} variant="secondary" size="lg">
            Help someone endorse
          </Button>
          <Button onClick={() => nav("/assist/activity")} variant="secondary" size="lg">
            My assistance activity
          </Button>
          <Button onClick={() => nav("/corruption/report")} variant="danger" size="lg">
            Report corruption
          </Button>
          <Button onClick={() => nav("/events")} variant="secondary" size="lg">
            Upcoming events
          </Button>
          <Button onClick={() => nav("/dashboard/my-data")} variant="secondary" size="lg">
            My Data (privacy)
          </Button>
        </div>
      </section>

      {/* ---- Back / Home ---- */}
      <nav aria-label="Dashboard navigation" className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
        <Button variant="secondary" onClick={() => nav(-1)} className="flex-1">
          <span aria-hidden="true">←</span> Back
        </Button>
        <Link
          to="/"
          className="flex-1 min-h-comfortable inline-flex items-center justify-center gap-2
                     bg-plu-yellow text-plu-black font-semibold rounded-md px-4 py-2
                     hover:brightness-95 transition-all
                     focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
        >
          Home <span aria-hidden="true"></span>
        </Link>
      </nav>
    </main>
  );
}
