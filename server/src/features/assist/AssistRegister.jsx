import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/client";
import Button from "../../components/Button";
import { useAuth } from "../../store/auth";
import { DISTRICTS, NOT_LISTED } from "../../data/locations";

export default function AssistRegister() {
  const nav = useNavigate();
  const { token, member } = useAuth();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    pathway: "UGANDA", name: "", phone: "", email: "",
    location: "", pin: "", consent: false,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);

  if (!token) { nav("/login"); return null; }

  const update = (k) => (e) =>
    setForm({ ...form, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value });

  async function submit() {
    setError("");
    try {
      const payload = { ...form, assistedBy: member.pcNumber, consent: true };
      if (!payload.email) delete payload.email;
      const { data } = await api.post("/auth/register", payload);
      setSuccess(data.member);
    } catch (e) {
      setError(e.response?.data?.error || "Assisted registration failed");
    }
  }

  if (success) {
    return (
      <div className="bg-white rounded-card p-6 space-y-3 text-center">
        <h2 className="text-xl font-bold">Assisted registration complete</h2>
        <p className="text-sm text-plu-slate">New PC number</p>
        <p className="text-3xl font-mono font-bold">{success.pcNumber}</p>
        <p className="text-xs text-plu-slate">
          Recorded as assisted by {member.pcNumber}. The helped person received their own confirmation.
        </p>
        <Button className="w-full" onClick={() => nav("/assist/activity")}>View my assistance</Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="bg-plu-yellow text-plu-black rounded-card p-4 text-sm font-medium">
        You are registering another person as <strong>{member.pcNumber}</strong>.
        Their PIN is theirs only — you will not retain it.
      </div>

      <div className="bg-white rounded-card p-5 space-y-3">
        <p className="text-xs text-plu-slate">Step {step} of 3</p>

        {step === 1 && (
          <>
            <h2 className="font-bold text-lg">Pathway</h2>
            <div className="grid grid-cols-2 gap-2">
              {["UGANDA", "DIASPORA"].map((p) => (
                <button key={p} onClick={() => setForm({ ...form, pathway: p })}
                  className={`p-3 rounded-card border ${form.pathway === p ? "border-plu-yellow bg-plu-yellow/20" : "border-black/10"}`}>
                  {p}
                </button>
              ))}
            </div>
            <Button className="w-full" onClick={() => setStep(2)}>Continue</Button>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="font-bold text-lg">Their details</h2>
            <Field label="Full name" value={form.name} onChange={update("name")} />
            <Field label="Phone" value={form.phone} onChange={update("phone")} placeholder="+256..." />
            <Field label="Email (optional)" value={form.email} onChange={update("email")} type="email" />
            <label className="block">
              <span className="text-xs text-plu-slate">Location</span>
              <select value={form.location} onChange={update("location")}
                className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 bg-plu-gray">
                <option value="">Select a district…</option>
                {DISTRICTS.map((d) => (
                  <option key={d.name} value={d.name}>{d.region} — {d.name}</option>
                ))}
                <option value={NOT_LISTED}>Not listed</option>
              </select>
            </label>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>Back</Button>
              <Button className="flex-1" onClick={() => setStep(3)} disabled={!form.name || !form.phone || !form.location}>Continue</Button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="font-bold text-lg">Set their PIN</h2>
            <p className="text-xs text-plu-slate">Ask them to enter their 6-digit PIN. Step away if needed.</p>
            <Field label="6-digit PIN" value={form.pin} onChange={update("pin")} type="password" maxLength={6} />
            <label className="flex items-start gap-2 text-sm">
              <input type="checkbox" checked={form.consent} onChange={update("consent")} className="mt-1" />
              <span>They have consented to registration and the details are accurate.</span>
            </label>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setStep(2)}>Back</Button>
              <Button className="flex-1" onClick={submit} disabled={!form.pin || !form.consent}>Submit</Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Field({ label, ...props }) {
  return (
    <label className="block">
      <span className="text-xs text-plu-slate">{label}</span>
      <input {...props} className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 bg-plu-gray" />
    </label>
  );
}
