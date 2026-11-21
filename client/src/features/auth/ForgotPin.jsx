import { useState } from "react";
import api from "../../api/client";
import Button from "../../components/Button";

export default function ForgotPin() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  async function submit(e) {
    e.preventDefault();
    await api.post("/auth/forgot", { email });
    setSent(true);
  }

  if (sent) {
    return (
      <div className="bg-white rounded-card p-6 space-y-3 text-center">
        <h2 className="text-xl font-bold">Check your email</h2>
        <p className="text-sm text-plu-slate">
          If that address is registered, a reset token has been sent. In the prototype it prints
          to the server's test outbox — check the server terminal.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="bg-white rounded-card p-5 space-y-3">
      <h2 className="font-bold text-lg">Reset your PIN</h2>
      <label className="block">
        <span className="text-xs text-plu-slate">Email</span>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 bg-plu-gray" />
      </label>
      <Button className="w-full" type="submit" disabled={!email}>Send reset link</Button>
    </form>
  );
}
