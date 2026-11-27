import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/client";
import { Button, Field, Input, Alert } from "../../ui";
import { useAuth } from "../../store/auth";
import { DISTRICTS, NOT_LISTED } from "../../data/locations";
import { notify } from "../../lib/notify";
import { isOnline, classifyError } from "../../lib/net";
import { enqueue } from "../../lib/syncEngine";
import PhotoCapture from "../../components/PhotoCapture";

const DRAFT_KEY = "plu_reg_draft_v2";

const EMPTY = {
  pathway: "UGANDA",
  name: "",
  phone: "",
  email: "",
  identityNumber: "",
  dateOfBirth: "",
  sex: "",
  location: "",
  subCounty: "",
  village: "",
  maritalStatus: "",
  occupation: "",
  pin: "",
  consent: false,
};

function fileToBase64(file) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}

export default function Register() {
  const nav = useNavigate();
  const setSession = useAuth((s) => s.setSession);
  const [step, setStep] = useState(1);
  const [photo, setPhoto] = useState(null);
  const [form, setForm] = useState(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) return { ...EMPTY, ...JSON.parse(saved) };
    } catch {}
    return EMPTY;
  });
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);

  const nameRef = useRef(null);
  const phoneRef = useRef(null);
  const emailRef = useRef(null);
  const ninRef = useRef(null);
  const locationRef = useRef(null);
  const pinRef = useRef(null);
  const consentRef = useRef(null);

  useEffect(() => {
    const { pin, ...safe } = form;
    localStorage.setItem(DRAFT_KEY, JSON.stringify(safe));
  }, [form]);

  const update = (k) => (e) =>
    setForm({
      ...form,
      [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
    });

  const next = () => {
    setError("");
    const errs = validateStep(step);
    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setStep((s) => s + 1);
  };

  const back = () => {
    setError("");
    setFieldErrors({});
    setStep((s) => Math.max(1, s - 1));
  };

  function clearDraft() {
    localStorage.removeItem(DRAFT_KEY);
  }

  function validateStep(current) {
    const errs = {};
    if (current === 1) {
      if (!form.name.trim() || form.name.trim().length < 2) {
        errs.name = "Enter your full name (at least 2 characters).";
      }
      if (!form.phone.trim()) {
        errs.phone = "Enter your phone number.";
      } else if (!/^\+?[0-9\s-]{9,}$/.test(form.phone.trim())) {
        errs.phone = "Enter a valid phone number, e.g. +256 7xx xxx xxx.";
      }
      if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
        errs.email = "Enter a valid email address, or leave it blank.";
      }
    }
    if (current === 2) {
      if (!form.identityNumber.trim()) {
        errs.identityNumber = "Enter your National ID or Passport number.";
      }
      if (!form.dateOfBirth) {
        errs.dateOfBirth = "Enter your date of birth.";
      } else {
        const dob = new Date(form.dateOfBirth);
        const now = new Date();
        const age = (now - dob) / (1000 * 60 * 60 * 24 * 365.25);
        if (age < 16) errs.dateOfBirth = "You must be at least 16 years old.";
        if (age > 120) errs.dateOfBirth = "Please enter a valid date of birth.";
      }
      if (!form.sex) {
        errs.sex = "Select your sex.";
      }
      if (!form.location) {
        errs.location = "Select your district.";
      }
      if (!form.subCounty.trim()) {
        errs.subCounty = "Enter your sub-county or division.";
      }
      if (!form.village.trim()) {
        errs.village = "Enter your village or zone.";
      }
      if (!photo) {
        errs.photo = "A photo is required. It will appear on your digital card.";
      }
    }
    if (current === 3) {
      if (!/^\d{6}$/.test(form.pin)) {
        errs.pin = "Create a 6-digit PIN (numbers only).";
      }
      if (!form.consent) {
        errs.consent = "You must confirm the information and agree to the terms.";
      }
    }
    return errs;
  }

  function focusFirstError(errs) {
    if (errs.name) nameRef.current?.focus();
    else if (errs.phone) phoneRef.current?.focus();
    else if (errs.email) emailRef.current?.focus();
    else if (errs.identityNumber) ninRef.current?.focus();
    else if (errs.location) locationRef.current?.focus();
    else if (errs.pin) pinRef.current?.focus();
    else if (errs.consent) consentRef.current?.focus();
  }

  async function submit() {
    setError("");
    setFieldErrors({});
    const errs = { ...validateStep(1), ...validateStep(2), ...validateStep(3) };
    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) {
      focusFirstError(errs);
      return;
    }

    setSubmitting(true);
    try {
      const payload = { ...form };
      if (!payload.email) delete payload.email;

      if (false) /* disabled: navigator.onLine unreliable */ {
        const photoBase64 = photo ? await fileToBase64(photo) : null;
        await enqueue({
          url: "http://localhost:4000/api/auth/register",
          body: payload,
          photo: photoBase64,
        });
        setSuccess({ pcNumber: "PENDING", name: form.name, status: "TENTATIVE", queuedOffline: true });

      // Auto-login: connect registration to card
      if (resp && resp.token && resp.member) {
        setSession({ token: resp.token, member: resp.member });
        nav("/dashboard");
      }
        clearDraft();
        return;
      }

      const fd = new FormData();
      Object.entries(payload).forEach(([k, v]) => fd.append(k, String(v)));
      if (photo) fd.append("photo", photo);

      const { data } = await api.post("/auth/register", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess(data.member);
      setSession({ token: data.token, member: data.member });
      clearDraft();
      notify("Welcome to PLU", "Your PC number is " + data.member.pcNumber + ".");
    } catch (e) {
      const isNetworkError = !e.response || e.code === "ERR_NETWORK" || (e.message && e.message.includes("Network Error"));
      if (isNetworkError) {
        const photoBase64 = photo ? await fileToBase64(photo) : null;
        await enqueue({ url: "http://localhost:4000/api/auth/register", body: form, photo: photoBase64 });
        setSuccess({ pcNumber: "PENDING", name: form.name, status: "TENTATIVE", queuedOffline: true });

      // Auto-login: connect registration to card
      if (resp && resp.token && resp.member) {
        setSession({ token: resp.token, member: resp.member });
        nav("/dashboard");
      }
        clearDraft();
      } else {
        const resp = e.response?.data || {};
        setError(classifyError(e));
        if (Array.isArray(resp.details)) {
          setFieldErrors((prev) => ({ ...prev, __details: resp.details }));
        }
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="max-w-lg mx-auto space-y-4">
        <section aria-labelledby="success-heading" aria-live="polite" className="bg-white rounded-2xl shadow-md border border-black/5 p-5 md:p-6 text-center space-y-3">
          <h1 id="success-heading" className="text-xl md:text-2xl font-extrabold text-emerald-700">Registration Complete</h1>
          {success.queuedOffline && (
            <Alert tone="warning" title="Saved offline">You are offline. Your registration is queued and will be submitted automatically when you reconnect.</Alert>
          )}
          <p className="text-sm text-plu-slate">Your PC number is</p>
          <p className="text-3xl font-mono font-bold tracking-widest text-plu-black">{success.pcNumber}</p>
          <p className="text-xs text-amber-700">Status: Tentative - pending officer approval</p>
        </section>
        <Button variant="yellow" className="w-full" onClick={() => nav("/dashboard")}>Go to My Dashboard</Button>
        <Button variant="secondary" className="w-full" onClick={() => nav("/")}>Back to Home</Button>
      </div>
    );
  }

  const showBack = step > 1;
  const showNext = step < 3;
  const showSubmit = step === 3;

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={(e) => { e.preventDefault(); if (showSubmit) submit(); }} noValidate aria-labelledby="register-heading" className="bg-white rounded-2xl shadow-md border border-black/5 p-5 md:p-6 space-y-4">
        <div className="flex flex-col items-center gap-2 pb-2">
          <img src="/plu-logo-circle.png" alt="Patriotic League of Uganda" className="h-16 w-16 rounded-full object-cover border-2 border-plu-yellow shadow-md" onError={(e) => { e.currentTarget.style.display = "none"; }} />
          <span className="text-[10px] uppercase tracking-widest text-plu-yellow font-semibold">Patriotic League of Uganda</span>
        </div>

        <header className="space-y-1">
          <h1 id="register-heading" className="text-xl md:text-2xl font-extrabold text-plu-black">Join the Patriotic League</h1>
          <p className="text-sm text-plu-slate">Registration is permanently open. Any member can help another person join.</p>
          <p className="text-xs font-semibold text-plu-slate uppercase tracking-widest pt-1">Step {step} of 3</p>
        </header>

        {error && (
          <Alert tone="error" title="Could not register">
            <p>{error}</p>
          </Alert>
        )}

        {step === 1 && (
          <>
            <fieldset>
              <legend className="block text-sm font-semibold text-plu-black mb-2">Membership pathway <span className="text-plu-red" aria-hidden>*</span></legend>
              <div className="grid grid-cols-2 gap-3" role="radiogroup">
                <label className={"flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-colors " + (form.pathway === "UGANDA" ? "border-plu-yellow bg-plu-yellow/10" : "border-plu-black/10 bg-white hover:bg-plu-black/[0.02]")}>
                  <input type="radio" name="pathway" value="UGANDA" checked={form.pathway === "UGANDA"} onChange={update("pathway")} className="h-4 w-4 accent-plu-yellow" />
                  <span className="flex flex-col"><span className="font-bold text-sm text-plu-black">Uganda</span><span className="text-[11px] text-plu-slate">Resident in Uganda</span></span>
                </label>
                <label className={"flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-colors " + (form.pathway === "DIASPORA" ? "border-plu-yellow bg-plu-yellow/10" : "border-plu-black/10 bg-white hover:bg-plu-black/[0.02]")}>
                  <input type="radio" name="pathway" value="DIASPORA" checked={form.pathway === "DIASPORA"} onChange={update("pathway")} className="h-4 w-4 accent-plu-yellow" />
                  <span className="flex flex-col"><span className="font-bold text-sm text-plu-black">Diaspora</span><span className="text-[11px] text-plu-slate">Ugandan abroad</span></span>
                </label>
              </div>
            </fieldset>
            <Field label="Full name" required hint="As it appears on your National ID or Passport." error={fieldErrors.name}>
              <Input ref={nameRef} type="text" name="name" autoComplete="name" value={form.name} onChange={update("name")} placeholder="e.g. Ahurira Dickson Davis" />
            </Field>
            <Field label="Phone number" required hint="Include country code, e.g. +256 7xx xxx xxx." error={fieldErrors.phone}>
              <Input ref={phoneRef} type="tel" inputMode="tel" name="phone" autoComplete="tel" value={form.phone} onChange={update("phone")} placeholder="+256 7xx xxx xxx" />
            </Field>
            <Field label="Email (optional)" hint="Useful for password resets and receipts." error={fieldErrors.email}>
              <Input ref={emailRef} type="email" name="email" autoComplete="email" value={form.email} onChange={update("email")} placeholder="you@example.com" />
            </Field>
          </>
        )}

        {step === 2 && (
          <>
            <Field label="National ID or Passport" required hint="We only use this to verify your membership. Never shared publicly." error={fieldErrors.identityNumber}>
              <Input ref={ninRef} type="text" name="identityNumber" autoComplete="off" value={form.identityNumber} onChange={update("identityNumber")} placeholder="e.g. CM1234567ABC" />
            </Field>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Date of birth" required hint="Must be 16 or older." error={fieldErrors.dateOfBirth}>
                <Input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={update("dateOfBirth")} max={new Date(Date.now() - 16 * 365.25 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]} />
              </Field>
              <Field label="Sex" required error={fieldErrors.sex}>
                <select name="sex" value={form.sex} onChange={update("sex")} className="w-full min-h-[44px] px-3 py-2 rounded-xl bg-white border border-plu-black/15 text-plu-black focus:outline-none focus-visible:ring-4 focus-visible:ring-plu-yellow/60">
                  <option value="">- Select -</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                  <option value="PREFER_NOT_SAY">Prefer not to say</option>
                </select>
              </Field>
            </div>
            <Field label="District" required hint="Select the district where you are registered." error={fieldErrors.location}>
              <select ref={locationRef} name="location" value={form.location} onChange={update("location")} className="w-full min-h-[44px] px-3 py-2 rounded-xl bg-white border border-plu-black/15 text-plu-black focus:outline-none focus-visible:ring-4 focus-visible:ring-plu-yellow/60">
                <option value="">- Select your district -</option>
                {Object.entries(DISTRICTS.reduce((acc, d) => { (acc[d.region] ||= []).push(d); return acc; }, {})).map(([region, districts]) => (
                  <optgroup key={region} label={region}>
                    {districts.map((d) => (<option key={d.name} value={d.name}>{d.name}</option>))}
                  </optgroup>
                ))}
                <option value={NOT_LISTED}>{NOT_LISTED}</option>
              </select>
            </Field>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Sub-county / Division" required error={fieldErrors.subCounty}>
                <Input type="text" name="subCounty" value={form.subCounty} onChange={update("subCounty")} placeholder="e.g. Kawempe Division" />
              </Field>
              <Field label="Village / Zone" required error={fieldErrors.village}>
                <Input type="text" name="village" value={form.village} onChange={update("village")} placeholder="e.g. Bwaise II" />
              </Field>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Marital status" error={fieldErrors.maritalStatus}>
                <select name="maritalStatus" value={form.maritalStatus} onChange={update("maritalStatus")} className="w-full min-h-[44px] px-3 py-2 rounded-xl bg-white border border-plu-black/15 text-plu-black focus:outline-none focus-visible:ring-4 focus-visible:ring-plu-yellow/60">
                  <option value="">- Select (optional) -</option>
                  <option value="SINGLE">Single</option>
                  <option value="MARRIED">Married</option>
                  <option value="DIVORCED">Divorced</option>
                  <option value="WIDOWED">Widowed</option>
                </select>
              </Field>
              <Field label="Occupation" error={fieldErrors.occupation}>
                <Input type="text" name="occupation" value={form.occupation} onChange={update("occupation")} placeholder="e.g. Farmer, Student, Teacher" />
              </Field>
            </div>
            <PhotoCapture label="Photo (required for your digital card)" hint="This photo will appear on your member card and help officers verify you." required onChange={(file) => setPhoto(file)} />
            {fieldErrors.photo && (<p role="alert" className="text-xs text-red-600">{fieldErrors.photo}</p>)}
          </>
        )}

        {step === 3 && (
          <>
            <Field label="Create a 6-digit Security PIN" required hint="You will use this every time you sign in. Numbers only." error={fieldErrors.pin}>
              <Input ref={pinRef} type="password" name="pin" autoComplete="new-password" inputMode="numeric" pattern="\d{6}" maxLength={6} value={form.pin} onChange={(e) => setForm({ ...form, pin: e.target.value.replace(/\D/g, "") })} placeholder="------" />
            </Field>
            <Field label="Consent" required error={fieldErrors.consent}>
              <div ref={consentRef} tabIndex="-1" className="outline-none space-y-2">
                <label className="flex items-start gap-2 text-sm">
                  <input type="checkbox" checked={form.consent} onChange={update("consent")} className="mt-0.5 h-5 w-5 rounded focus-visible:ring-4 focus-visible:ring-plu-yellow/60" />
                  <span>I confirm the information I have provided is true and correct, and I agree to the <Link to="/legal/privacy" target="_blank" className="underline font-semibold text-plu-black">Privacy Policy</Link> and <Link to="/legal/terms" target="_blank" className="underline font-semibold text-plu-black">Terms of Service</Link>.</span>
                </label>
              </div>
            </Field>
          </>
        )}

        <div className="flex gap-3 pt-2">
          {showBack && (<Button type="button" variant="secondary" onClick={back} className="flex-1">Back</Button>)}
          {showNext && (<Button type="button" variant="yellow" onClick={next} className="flex-1">Next</Button>)}
          {showSubmit && (<Button type="submit" variant="yellow" loading={submitting} className="flex-1">{submitting ? "Creating account..." : "Create my account"}</Button>)}
        </div>

        <p className="text-xs text-plu-slate text-center pt-2">Already a member? <Link to="/login" className="underline font-semibold text-plu-black">Sign in</Link></p>
      </form>
    </div>
  );
}
