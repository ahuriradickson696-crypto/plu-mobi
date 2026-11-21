import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/client";
import Button from "../../components/Button";
import { useAuth } from "../../store/auth";

export default function CreateEvent() {
  const nav = useNavigate();
  const { member } = useAuth();
  const [form, setForm] = useState({ title: "", description: "", location: "", startAt: "", endAt: "" });
  const [error, setError] = useState("");

  if (!member?.isReviewer) { nav("/events"); return null; }

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setError("");
    try {
      const payload = { ...form };
      if (!payload.endAt) delete payload.endAt;
      const { data } = await api.post("/events", payload);
      nav(`/events/${data.event.id}`);
    } catch (err) {
      setError(err.response?.data?.error || "Create failed");
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="bg-plu-black text-white rounded-card p-5">
        <p className="text-xs text-plu-yellow font-semibold tracking-widest">ADMIN</p>
        <h2 className="text-xl font-bold mt-1">Create event</h2>
      </div>

      <div className="bg-white rounded-card p-5 space-y-3">
        <Field label="Title" value={form.title} onChange={update("title")} />
        <label className="block">
          <span className="text-xs text-plu-slate">Description</span>
          <textarea rows={3} value={form.description} onChange={update("description")}
            className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 bg-plu-gray" />
        </label>
        <Field label="Location" value={form.location} onChange={update("location")} />
        <label className="block">
          <span className="text-xs text-plu-slate">Starts at</span>
          <input type="datetime-local" value={form.startAt} onChange={update("startAt")}
            className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 bg-plu-gray" />
        </label>
        <label className="block">
          <span className="text-xs text-plu-slate">Ends at (optional)</span>
          <input type="datetime-local" value={form.endAt} onChange={update("endAt")}
            className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 bg-plu-gray" />
        </label>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <Button className="w-full" type="submit"
          disabled={!form.title || !form.description || !form.location || !form.startAt}>
          Create event
        </Button>
      </div>
    </form>
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
