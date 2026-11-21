import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../store/auth";

/**
 * Member Dashboard
 * International standards applied:
 *  - Semantic <main>/<section>/<header> landmarks
 *  - WCAG 2.1 AA focus-visible rings on every interactive element
 *  - aria-label / aria-live / role attributes for screen readers
 *  - Minimum 44px touch targets (Apple HIG / Material)
 *  - Consistent 8pt spacing scale
 *  - Status chip with aria-label
 *  - Empty/unauth state handled explicitly
 *  - Back uses history; Home uses router link (no full reload)
 */

const STATUS = {
  tentative: { label: "Tentative, pending approval", tone: "amber" },
  active:    { label: "Active member",              tone: "green" },
  suspended: { label: "Suspended",                  tone: "red"   },
};

const TONE = {
  amber: "bg-amber-100 text-amber-900 ring-1 ring-amber-300",
  green: "bg-emerald-100 text-emerald-900 ring-1 ring-emerald-300",
  red:   "bg-red-100 text-red-900 ring-1 ring-red-300",
};

export default function Dashboard() {
  const nav = useNavigate();
  const { member } = useAuth();

  if (!member) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-10 text-center">
        <p className="text-sm text-plu-slate mb-4">
          You need to sign in to view your dashboard.
        </p>
        <Link
          to="/login"
          className="inline-block bg-plu-yellow text-plu-black font-semibold px-5 py-3 rounded-xl
                     focus:outline-none focus-visible:ring-4 focus-visible:ring-plu-yellow/60"
        >
          Go to Sign in
        </Link>
      </main>
    );
  }

  const statusKey = (member.status || "tentative").toLowerCase();
  const status = STATUS[statusKey] || STATUS.tentative;

  return (
    <main className="max-w-3xl mx-auto px-4 md:px-6 py-6 md:py-8 space-y-6">
      {/* ---- Identity card ---- */}
      <section
        aria-labelledby="member-heading"
        className="bg-white rounded-2xl shadow-md border border-black/5 p-5 md:p-6"
      >
        <header className="flex items-start justify-between gap-3">
          <img
            src="/plu-logo-circle.png"
            alt="PLU"
            className="h-12 w-12 rounded-full object-cover border-2 border-plu-yellow shrink-0"
            onError={(e) => { e.currentTarget.style.display = "none"; }}
          />
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-plu-slate mb-1">
              Member
            </p>
            <h1
              id="member-heading"
              className="text-2xl md:text-3xl font-extrabold text-plu-black leading-tight"
            >
              {member.fullName || "Member"}
            </h1>
            <p className="font-mono text-sm text-plu-slate mt-1">
              {member.pcNumber || "—"}
            </p>
          </div>
          <span
            role="status"
            aria-live="polite"
            aria-label={`Membership status: ${status.label}`}
            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${TONE[status.tone]}`}
          >
            <span aria-hidden>●</span>
            {status.label}
          </span>
        </header>
      </section>

      {/* ---- Actions grid ---- */}
      <section aria-labelledby="actions-heading" className="space-y-3">
        <h2
          id="actions-heading"
          className="text-xs font-semibold uppercase tracking-widest text-plu-slate px-1"
        >
          Quick actions
        </h2>

        <div className="grid grid-cols-2 gap-3">
          <ActionButton onClick={() => nav("/card")} variant="primary">
            View digital card
          </ActionButton>
          <ActionButton onClick={() => nav("/dashboard/notifications")}>
            Test notification
          </ActionButton>
          <ActionButton onClick={() => nav("/dashboard/push")}>
            Enable push
          </ActionButton>
          <ActionLink to="/assist/register">Help register</ActionLink>
          <ActionLink to="/assist/endorse">Help someone endorse</ActionLink>
          <ActionLink to="/assist/activity">My assistance</ActionLink>
          <ActionLink to="/events">Events</ActionLink>
        </div>
      </section>

      {/* ---- Navigation row (Back / Home) ---- */}
      <nav
        aria-label="Dashboard navigation"
        className="flex flex-col-reverse sm:flex-row gap-3 pt-2"
      >
        <button
          type="button"
          onClick={() => nav(-1)}
          className="flex-1 min-h-[44px] inline-flex items-center justify-center gap-2
                     bg-white border border-plu-black/10 text-plu-black font-semibold
                     rounded-xl hover:bg-plu-black/[0.04] transition-colors
                     focus:outline-none focus-visible:ring-4 focus-visible:ring-plu-black/30"
        >
          <span aria-hidden>←</span> Back
        </button>

        <Link
          to="/"
          className="flex-1 min-h-[44px] inline-flex items-center justify-center gap-2
                     bg-plu-yellow text-plu-black font-semibold rounded-xl
                     hover:brightness-95 transition-all
                     focus:outline-none focus-visible:ring-4 focus-visible:ring-plu-yellow/60"
        >
          Home <span aria-hidden>→</span>
        </Link>
      </nav>
    </main>
  );
}

/* ---------- Reusable primitives ---------- */

function ActionButton({ children, onClick, variant = "default" }) {
  const base =
    "min-h-[44px] px-4 py-3 rounded-xl font-semibold text-sm md:text-base transition-colors " +
    "focus:outline-none focus-visible:ring-4";
  const styles =
    variant === "primary"
      ? "bg-plu-black text-white hover:bg-black focus-visible:ring-plu-black/40"
      : "bg-white border border-plu-black/10 text-plu-black hover:bg-plu-black/[0.04] focus-visible:ring-plu-black/30";
  return (
    <button type="button" onClick={onClick} className={`${base} ${styles}`}>
      {children}
    </button>
  );
}

function ActionLink({ to, children }) {
  return (
    <Link
      to={to}
      className="min-h-[44px] px-4 py-3 rounded-xl font-semibold text-sm md:text-base
                 bg-white border border-plu-black/10 text-plu-black text-center
                 hover:bg-plu-black/[0.04] transition-colors
                 focus:outline-none focus-visible:ring-4 focus-visible:ring-plu-black/30"
    >
      {children}
    </Link>
  );
}



