import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/client";
import { useAuth } from "../../store/auth";

export default function EventsList() {
  const nav = useNavigate();
  const { token, member } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/events").then((r) => setEvents(r.data.events)).finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center py-6 text-sm text-plu-slate">Loading events…</p>;

  return (
    <div className="space-y-4 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
      <div className="bg-plu-black text-white rounded-card p-5">
        <p className="text-xs text-plu-yellow font-semibold tracking-widest">EVENTS</p>
        <h2 className="text-xl font-bold mt-1">Upcoming events</h2>
        <p className="text-sm text-white/70 mt-1">{events.length} event(s)</p>
      </div>

      {member?.isReviewer && (
        <Link to="/events/new">
          <button className="w-full bg-plu-yellow text-plu-black font-semibold py-3 rounded-card">
            + Create new event
          </button>
        </Link>
      )}

      {events.length === 0 && (
        <div className="bg-white rounded-card p-6 text-center">
          <p className="text-sm text-plu-slate">No upcoming events.</p>
        </div>
      )}

      {events.map((ev) => (
        <Link key={ev.id} to={`/events/${ev.id}`} className="block bg-white rounded-card p-4 hover:bg-gray-50 space-y-1">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-plu-slate">
              {new Date(ev.startAt).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}
            </p>
            <span className="badge bg-plu-yellow text-plu-black">{ev._count.rsvps} RSVPs</span>
          </div>
          <p className="font-bold text-lg">{ev.title}</p>
          <p className="text-xs text-plu-slate">{ev.location}</p>
          <p className="text-sm text-plu-slate line-clamp-2 mt-1">{ev.description}</p>
        </Link>
      ))}
    </div>
  );
}

