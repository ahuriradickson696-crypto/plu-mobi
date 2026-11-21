import { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/client";
import { Button, Field, Input, Alert, Spinner, Card } from "../../ui";
import { useAuth } from "../../store/auth";
import { notify } from "../../lib/notify";

/**
 * Assisted Endorsement (S-20, §5.9, FR-09)
 * Any authenticated member can help another person endorse.
 * Sends `assistedBy` so the server records who helped whom.
 */

export default function AssistEndorse() {
  const nav = useNavigate();
  const { token, member } = useAuth();
  const [form, setForm] = useState({ name: "", phone: "", district: "" });
  const [stats, setStats] = useState({ total: 0, assisted: 0 });
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const nameRef = useRef(null);
  const phoneRef = useRef(null);

  // Redirect guests to login
  useEffect(() => {
    if (!token) nav("/login");
  }, [token, nav]);

  // Load stats + assistance history
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoadingHistory(true);
      try {
        const [s] = await Promise.all([
          api.get("/endorsements/stats"),
          // best-effort; endpoint may not exist yet on server
          api.get("/endorsements/mine").catch(() => ({ data: { items: [] } })),
        ]);
        if (cancelled) return;
        setStats(s.data);
      } catch {
        /* ignore */
      } finally {
        if (!cancelled) setLoadingHistory(false);
      }
    }
    if (token) load();
    return () => { cancelled = true; };
  }, [token]);

  const update = (k) => (e) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  function validate() {
    const errs = {};
    if (!form.name.trim() || form.name.trim().length < 2) {
      errs.name = "Enter the person's full name (at least 2 characters).";
    }
    if (form.phone && !/^\+?[0-9\s-]{7,}$/.test(form.phone.trim())) {
      errs.phone = "Enter a valid phone number, or leave it blank.";
    }
    setFieldErrors(errs);
    return errs;
  }

  async function submit(e) {
    e.preventDefault();
    setError("");
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      if (errs.name) nameRef.current?.focus();
      else if (errs.phone) phoneRef.current?.focus();
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: form.name.trim(),
        phone: form.phone.trim() || null,
        district: form.district.trim() || null,
        assistedBy: member?.pcNumber, // recorded in AuditLog as ASSIST_ENDORSE
      };
      const { data } = await api.post("/endorsements", payload);
      notify("Endorsement recorded", `You helped ${form.name.trim()} endorse PLU.`);
      setSuccess({
        name: form.name.trim(),
        total: data.total,
        assistedBy: member?.pcNumber,
      });
      setStats((s) => ({
        total: data.total ?? s.total + 1,
        assisted: s.assisted + 1,
      }));
    } catch (err) {
      setError(err.response?.data?.error || "Could not record endorsement. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function reset() {
    setForm({ name: "", phone: "", district: "" });
    setFieldErrors({});
    setSuccess(null);
    setError("");
  }

  /* ---------- Success view ---------- */
  if (success) {
    return (
      <main className="max-w-lg mx-auto space-y-4">
        <Card>
          <div className="text-center space-y-3">
            <img
              src="/plu-logo-circle.png"
              alt="PLU"
              className="h-16 w-16 rounded-full object-cover border-2 border-plu-yellow mx-auto"
              onError={(e) => { e.currentTarget.style.display = "none"; }}
            />
            <h1 className="text-xl md:text-2xl font-extrabold text-emerald-700">
              Endorsement recorded
            </h1>
            <p className="text-sm text-plu-black">
              You helped <strong>{success.name}</strong> endorse the Patriotic League of Uganda.
            </p>
            <p className="text-xs text-plu-slate">
              Recorded by: <span className="font-mono">{success.assistedBy}</span>
            </p>
            <p className="text-sm text-plu-slate">
              Total endorsements now: <strong>{success.total}</strong>
            </p>
          </div>
        </Card>

        <div className="flex gap-2">
          <Button variant="yellow" className="flex-1" onClick={reset}>
            Help another
          </Button>
          <Button variant="secondary" className="flex-1" onClick={() => nav("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </main>
    );
  }

  /* ---------- Form view ---------- */
  return (
    <main className="max-w-lg mx-auto space-y-4">
      <header className="text-center space-y-1">
        <h1 className="text-xl md:text-2xl font-extrabold text-plu-black">
          Help someone endorse
        </h1>
        <p className="text-sm text-plu-slate">
          Assist a friend, family member or community member who cannot submit an endorsement themselves.
        </p>
      </header>

      {/* Stats strip */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-plu-black text-white rounded-xl p-3 text-center">
          <p className="text-2xl font-extrabold text-plu-yellow">{stats.total}</p>
          <p className="text-[10px] uppercase tracking-widest text-white/70 font-semibold">Total endorsements</p>
        </div>
        <div className="bg-white border border-plu-black/10 rounded-xl p-3 text-center">
          <p className="text-2xl font-extrabold text-plu-black">{stats.assisted}</p>
          <p className="text-[10px] uppercase tracking-widest text-plu-slate font-semibold">Assisted</p>
        </div>
      </div>

      {error && (
        <Alert tone="error" title="Could not record">
          {error}
        </Alert>
      )}

      <form
        onSubmit={submit}
        noValidate
        aria-labelledby="assist-endorse-heading"
        className="bg-white rounded-2xl shadow-md border border-black/5 p-5 md:p-6 space-y-4"
      >
        <h2 id="assist-endorse-heading" className="sr-only">
          Endorsement assistance form
        </h2>

        <Field
          label="Person's full name"
          required
          hint="The person you are helping to endorse."
          error={fieldErrors.name}
        >
          <Input
            ref={nameRef}
            type="text"
            name="name"
            value={form.name}
            onChange={update("name")}
            placeholder="e.g. Aisha Nakato"
            autoComplete="off"
          />
        </Field>

        <Field
          label="Phone (optional)"
          hint="Only used for duplicate prevention. Never shown publicly."
          error={fieldErrors.phone}
        >
          <Input
            ref={phoneRef}
            type="tel"
            inputMode="tel"
            name="phone"
            value={form.phone}
            onChange={update("phone")}
            placeholder="+256 7xx xxx xxx"
            autoComplete="off"
          />
        </Field>

        <Field
          label="District (optional)"
          hint="Where the person lives."
        >
          <Input
            type="text"
            name="district"
            value={form.district}
            onChange={update("district")}
            placeholder="e.g. Kampala"
            autoComplete="off"
          />
        </Field>

        <Button
          type="submit"
          variant="yellow"
          loading={submitting}
          className="w-full"
        >
          {submitting ? "Recording…" : "Record endorsement"}
        </Button>

        <p className="text-xs text-plu-slate text-center">
          You are recording this endorsement on behalf of someone else. This is an ordinary
          member capability — no special permission is required.
        </p>
      </form>

      {loadingHistory && (
        <div className="text-center py-2">
          <Spinner label="Loading your assistance history…" size="sm" />
        </div>
      )}

      <p className="text-xs text-center text-plu-slate">
        <Link to="/assist/activity" className="underline font-semibold text-plu-black">
          View all your assistance activity
        </Link>
      </p>
    </main>
  );
}
