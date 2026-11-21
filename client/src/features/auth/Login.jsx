import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/client";
import { Button, Field, Input, Alert } from "../../ui";
import { useAuth } from "../../store/auth";
import { notify } from "../../lib/notify";
import { isOnline, classifyError } from "../../lib/net";

export default function Login() {
  const nav = useNavigate();
  const setSession = useAuth((s) => s.setSession);

  const [identifier, setIdentifier] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const identifierRef = useRef(null);
  const pinRef = useRef(null);

  async function submit(e) {
    e.preventDefault();
    setError("");

    const id = identifier.trim();
    const p = pin.trim();
    if (!id) {
      setError("Enter your phone number or email.");
      identifierRef.current?.focus();
      return;
    }
    if (!/^\d{6}$/.test(p)) {
      setError("Your PIN must be exactly 6 digits.");
      pinRef.current?.focus();
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await api.post("/auth/login", { identifier: id, pin: p });
      setSession({ token: data.token, member: data.member });
      notify("Signed in", `Welcome back, ${data.member.name}.`);
      nav("/dashboard");
    } catch (err) {
      // Only say "offline" if the browser truly has no network.
      // Otherwise, it is a server / cold-start issue.
      setError(classifyError(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      noValidate
      className="bg-white rounded-2xl shadow-md border border-black/5 p-5 md:p-8 space-y-4 max-w-md mx-auto"
      aria-labelledby="login-heading"
    >
      <div className="flex flex-col items-center gap-2 pb-2">
        <img
          src="/plu-logo-circle.png"
          alt="Patriotic League of Uganda"
          className="h-16 w-16 rounded-full object-cover border-2 border-plu-yellow shadow-md"
          onError={(e) => { e.currentTarget.style.display = "none"; }}
        />
        <span className="text-[10px] uppercase tracking-widest text-plu-yellow font-semibold">
          Patriotic League of Uganda
        </span>
      </div>
      <header>
        <h1 id="login-heading" className="text-xl md:text-2xl font-extrabold text-plu-black">
          Cadre Sign In
        </h1>
        <p className="text-sm text-plu-slate mt-1">
          Sign in to your PLU Mobi dashboard.
        </p>
      </header>

      {error && <Alert tone="error" title="Could not sign in">{error}</Alert>}

      <Field
        label="Phone number or email"
        required
        hint="Use the same phone number or email you registered with."
      >
        <Input
          ref={identifierRef}
          type="text"
          name="identifier"
          autoComplete="username"
          inputMode="email"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          placeholder="+256 7xx xxx xxx or you@example.com"
        />
      </Field>

      <Field label="6-digit PIN" required hint="The PIN you chose when you registered.">
        <Input
          ref={pinRef}
          type="password"
          name="pin"
          autoComplete="current-password"
          inputMode="numeric"
          pattern="\d{6}"
          maxLength={6}
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
          placeholder="••••••"
        />
      </Field>

      <Button
        type="submit"
        variant="yellow"
        loading={submitting}
        className="w-full"
      >
        {submitting ? "Signing in…" : "Sign in"}
      </Button>

      <p className="text-xs text-plu-slate text-center">
        Demo: <code>+256700000001</code> / PIN <code>123456</code>
      </p>

      <p className="text-xs text-plu-slate text-center">
        Forgot your PIN?{" "}
        <Link to="/forgot-pin" className="underline font-semibold text-plu-black">
          Reset it
        </Link>
      </p>
    </form>
  );
}

