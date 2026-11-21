import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/client";
import Button from "../../components/Button";
import { useAuth } from "../../store/auth";

export default function EventDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const { token, member } = useAuth();
  const [event, setEvent] = useState(null);
  const [form, setForm] = useState({ name: member?.name || "", phone: member?.phone || "" });
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    api.get(`/events/${id}`).then((r) => setEvent(r.data.event)).catch(() => setError("Failed to load event"));
  }, [id]);

  async function rsvp(e) {
    e.preventDefault();
    setError("");
    try {
      await api.post(`/events/${id}/rsvp`, form);
      setDone(true);
      const r = await api.get(`/events/${id}`);
      setEvent(r.data.event);
    } catch (err) {
      setError(err.response?.data?.error || "RSVP failed");
    }
  }

  async function remove() {
    if (!confirm("Delete this event?")) return;
    await api.delete(`/events/${id}`);
    nav("/events");
  }

  if (!event) return <p className="text-center py-6 text-sm text-plu-slate">{error || "Loading…"}</p>;

  return (
    <div className="space-y-4">
      <div className="bg-plu-black text-white rounded-card p-5">
        <p className="text-xs text-plu-yellow">{new Date(event.startAt).toLocaleString()}</p>
        <h2 className="text-xl font-bold mt-1">{event.title}</h2>
        <p className="text-sm text-white/70 mt-1">{event.location}</p>
        {event.endAt && <p className="text-xs text-white/50 mt-1">Ends: {new Date(event.endAt).toLocaleString()}</p>}
      </div>

      <div className="bg-white rounded-card p-5 text-sm">
        <p>{event.description}</p>
      </div>

      <div className="bg-white rounded-card p-5 space-y-3">
        <h3 className="font-bold">Attendees ({event._count.rsvps})</h3>
        {event.rsvps.length === 0 ? (
          <p className="text-sm text-plu-slate">No RSVPs yet.</p>
        ) : (
          <ul className="space-y-1 text-sm">
            {event.rsvps.map((r) => <li key={r.id} className="border-t border-black/5 py-1">{r.name}</li>)}
          </ul>
        )}
      </div>

      {done ? (
        <div className="bg-white rounded-card p-5 text-center">
          <p className="text-emerald-600 font-bold">You're RSVP'd!</p>
        </div>
      ) : (
        <form onSubmit={rsvp} className="bg-white rounded-card p-5 space-y-3">
          <h3 className="font-bold">RSVP</h3>
          <label className="block">
            <span className="text-xs text-plu-slate">Your name</span>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 bg-plu-gray" />
          </label>
          <label className="block">
            <span className="text-xs text-plu-slate">Phone</span>
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 bg-plu-gray" />
          </label>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <Button className="w-full" type="submit" disabled={!form.name || !form.phone}>Confirm RSVP</Button>
        </form>
      )}

      {member?.isReviewer && (
        <Button variant="outline" className="w-full text-red-600" onClick={remove}>Delete event</Button>
      )}
    </div>
  );
}
