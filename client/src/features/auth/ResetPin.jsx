import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/client";
import Button from "../../components/Button";

export default function ResetPin() {
  const nav = useNavigate();
  const [token, setToken] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    try {
      await api.post("/auth/reset", { token, pin });
      setDone(true);
      setTimeout(() => nav("/login"), 2000);
    } catch (e) {
      setError(e.response?.data?.error || "Reset failed");
    }
  }

  if (done) {
    return (
      <div className="bg-white rounded-card p-6 text-center space-y-2">
        <h2 className="text-xl font-bold text-emerald-600">PIN updated</h2>
        <p className="text-sm text-plu-slate">Redirecting to sign in…</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="bg-white rounded-card p-5 space-y-3">
      <h2 className="font-bold text-lg">Enter reset token</h2>
      <label className="block">
        <span className="text-xs text-plu-slate">Token from email</span>
        <input value={token} onChange={(e) => setToken(e.target.value)}
          className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 bg-plu-gray font-mono text-xs" />
      </label>
      <label className="block">
        <span className="text-xs text-plu-slate">New 6-digit PIN</span>
        <input type="password" maxLength={6} value={pin} onChange={(e) => setPin(e.target.value)}
          className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 bg-plu-gray" />
      </label>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <Button className="w-full" type="submit" disabled={!token || pin.length !== 6}>Reset PIN</Button>
    </form>
  );
}
