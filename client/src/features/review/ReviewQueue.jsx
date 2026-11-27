import { useEffect, useState } from "react";
import api from "../../api/client";
import { useAuth } from "../../store/auth";
import { RoleGate } from "./components/RoleGate";
import { TentativeQueue } from "./components/TentativeQueue";

export default function ReviewQueue() {
  const { token } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    api
      .get("/review/queue")
      .then((r) => setRecords(r.data.records || []))
      .catch((e) => setError(e.response?.data?.error || "Failed to load queue"))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <main className="max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-8 space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-widest text-ink-secondary">
          Admin review
        </p>
        <h1 className="text-2xl md:text-3xl font-extrabold text-ink-primary mt-1">
          Tentative queue
        </h1>
        <p className="text-sm text-ink-secondary mt-2">
          {records.length} record(s) awaiting review.
        </p>
      </header>

      <RoleGate>
        {loading ? (
          <p role="status" aria-live="polite" className="text-sm text-ink-secondary">Loading queue…</p>
        ) : error ? (
          <p role="alert" className="text-sm text-status-rejected">{error}</p>
        ) : (
          <TentativeQueue records={records} />
        )}
      </RoleGate>
    </main>
  );
}
