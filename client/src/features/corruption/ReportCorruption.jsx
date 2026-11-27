import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/client";
import {
  Button, Field, Input, Textarea, Alert, Card,
} from "../../ui";
import { notify } from "../../lib/notify";
import { classifyError } from "../../lib/net";

const CATEGORIES = [
  { value: "BRIBERY",         label: "Bribery" },
  { value: "EXTORTION",       label: "Extortion" },
  { value: "NEPOTISM",        label: "Nepotism" },
  { value: "MISUSE_OF_FUNDS", label: "Misuse of funds" },
  { value: "ABUSE_OF_OFFICE", label: "Abuse of office" },
  { value: "OTHER",           label: "Other" },
];

const EMPTY = {
  category: "BRIBERY",
  description: "",
  location: "",
  reporterName: "",
  reporterPhone: "",
  isAnonymous: false,
  consent: false,
};

export default function ReportCorruption() {
  const nav = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [success, setSuccess] = useState(null);
  const [sending, setSending] = useState(false);
  const [copied, setCopied] = useState(false);

  const descRef = useRef(null);
  const locRef = useRef(null);
  const consentRef = useRef(null);

  const update = (k) => (e) =>
    setForm({
      ...form,
      [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
    });

  function validate() {
    const errs = {};
    if (!form.description.trim() || form.description.trim().length < 20) {
      errs.description = "Describe what happened (at least 20 characters).";
    }
    if (!form.location.trim()) {
      errs.location = "Where did this happen? Street, town, or institution.";
    }
    if (!form.consent) {
      errs.consent = "You must confirm this before submitting.";
    }
    if (!form.isAnonymous && form.reporterPhone) {
      const p = form.reporterPhone.trim();
      if (p.length < 9) {
        errs.reporterPhone = "Enter a valid phone number, or make the report anonymous.";
      }
    }
    setFieldErrors(errs);
    return errs;
  }

  function focusFirstError(errs) {
    if (errs.description) descRef.current?.focus();
    else if (errs.location) locRef.current?.focus();
    else if (errs.consent) consentRef.current?.focus();
  }

  async function submit(e) {
    e.preventDefault();
    setError("");

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      focusFirstError(errs);
      return;
    }

    setSending(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));
      if (file) fd.append("evidence", file);

      const { data } = await api.post("/corruption", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess(data);
      notify("Report submitted", "A reviewer will look at this. Keep your tracking code safe.");
    } catch (err) {
      setError(classifyError(err));
    } finally {
      setSending(false);
    }
  }

  async function copyTracking() {
    try {
      await navigator.clipboard.writeText(success.trackingCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  /* ---------- Success view ---------- */
  if (success) {
    return (
      <div className="max-w-lg mx-auto space-y-4">
        <Card>
          <div className="text-center space-y-3">
                      <img
            src="/plu-logo-circle.png"
            alt="PLU"
            className="h-16 w-16 rounded-full object-cover border-2 border-plu-yellow mx-auto"
            onError={(e) => { e.currentTarget.style.display = "none"; }}
          />
          <h1 className="text-xl md:text-2xl font-extrabold text-emerald-700">
              Report received
            </h1>
            <p className="text-sm text-plu-slate">
              Save this tracking code to follow up:
            </p>
            <div className="bg-plu-gray rounded-xl py-3 px-4">
              <p className="text-2xl md:text-3xl font-mono font-bold tracking-widest text-plu-black">
                {success.trackingCode}
              </p>
            </div>
            <Button
              variant="secondary"
              onClick={copyTracking}
              className="w-full"
              aria-live="polite"
            >
              {copied ? "Copied âœ“" : "Copy tracking code"}
            </Button>
            {success.hasEvidence && (
              <p className="text-xs text-emerald-700">
                âœ“ Evidence uploaded securely
              </p>
            )}
          </div>
        </Card>

        <Button
          variant="yellow"
          className="w-full"
          onClick={() => nav("/corruption/track")}
        >
          Track this report
        </Button>
        <Button
          variant="secondary"
          className="w-full"
          onClick={() => nav("/")}
        >
          Back to home
        </Button>
      </div>
    );
  }

  /* ---------- Form view ---------- */
  return (
    <form
      onSubmit={submit}
      noValidate
      aria-labelledby="report-heading"
      className="bg-white rounded-2xl shadow-md border border-black/5 p-5 md:p-6 space-y-4 max-w-2xl mx-auto"
    >
      <header>
        <h1
          id="report-heading"
          className="text-xl md:text-2xl font-extrabold text-plu-black"
        >
          Report Corruption
        </h1>
        <p className="text-sm text-plu-slate mt-1">
          Your report helps build a cleaner Uganda. You can report anonymously.
        </p>
      </header>

      {error && (
        <Alert tone="error" title="Could not submit report">
          {error}
        </Alert>
      )}

      <Field label="Type of corruption" required>
        <select
          name="category"
          value={form.category}
          onChange={update("category")}
          className="w-full min-h-[44px] px-3 py-2 rounded-xl bg-white border border-plu-black/15 text-plu-black focus:outline-none focus-visible:ring-4 focus-visible:ring-plu-yellow/60"
        >
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </Field>

      <Field
        label="What happened?"
        required
        hint="Describe the incident. Include names/roles only if you are confident."
        error={fieldErrors.description}
      >
        <Textarea
          ref={descRef}
          name="description"
          value={form.description}
          onChange={update("description")}
          placeholder="At around 10am on 14 March, at the district office in Mbarara-¦"
          rows={5}
        />
      </Field>

      <Field
        label="Where did it happen?"
        required
        hint="Street, town, or institution."
        error={fieldErrors.location}
      >
        <Input
          ref={locRef}
          type="text"
          name="location"
          value={form.location}
          onChange={update("location")}
          placeholder="e.g. District Service Commission, Mbarara"
          autoComplete="off"
        />
      </Field>

      <Field
        label="Attach evidence (optional)"
        hint="Photo, PDF, or document. Max 10MB."
      >
        <input
          type="file"
          name="evidence"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="block w-full text-sm text-plu-slate file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:bg-plu-black file:text-white file:font-semibold file:cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-plu-yellow/60"
        />
      </Field>

      <div className="space-y-3 border-t border-black/5 pt-4">
        <label className="flex items-start gap-2 text-sm font-semibold text-plu-black">
          <input
            type="checkbox"
            checked={form.isAnonymous}
            onChange={update("isAnonymous")}
            className="mt-0.5 h-5 w-5 rounded focus-visible:ring-4 focus-visible:ring-plu-yellow/60"
          />
          <span>Report anonymously (recommended if you fear retaliation)</span>
        </label>

        {!form.isAnonymous && (
          <>
            <Field label="Your name (optional)">
              <Input
                type="text"
                name="reporterName"
                autoComplete="name"
                value={form.reporterName}
                onChange={update("reporterName")}
                placeholder="Only visible to authorised reviewers"
              />
            </Field>

            <Field
              label="Your phone (optional)"
              hint="So reviewers can follow up. Never shared publicly."
              error={fieldErrors.reporterPhone}
            >
              <Input
                type="tel"
                inputMode="tel"
                name="reporterPhone"
                autoComplete="tel"
                value={form.reporterPhone}
                onChange={update("reporterPhone")}
                placeholder="+256 7xx xxx xxx"
              />
            </Field>
          </>
        )}
      </div>

      <Field
        label="Consent to submit"
        required
        error={fieldErrors.consent}
      >
        <div ref={consentRef} tabIndex="-1" className="outline-none">
          <label className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.consent}
              onChange={update("consent")}
              className="mt-0.5 h-5 w-5 rounded focus-visible:ring-4 focus-visible:ring-plu-yellow/60"
              required
            />
            <span>
              I confirm this report is truthful to the best of my knowledge, and I
              understand that knowingly filing a false report may have legal
              consequences in Uganda.
            </span>
          </label>
        </div>
      </Field>

      <Button
        type="submit"
        variant="danger"
        loading={sending}
        className="w-full"
      >
        {sending ? "Sending report-¦" : "Submit report"}
      </Button>

      <p className="text-xs text-plu-slate text-center">
        Submissions are encrypted in transit. Reviewers are bound by confidentiality.
      </p>
    </form>
  );
}

