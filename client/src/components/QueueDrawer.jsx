import { useEffect, useState } from "react";
import { getQueue, removeFromQueue } from "../lib/offlineQueue";
import { flushQueue } from "../lib/syncEngine";

export default function QueueDrawer() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [busy, setBusy] = useState(false);

  const refresh = () => getQueue().then(setItems).catch(() => {});
  useEffect(() => { if (open) refresh(); }, [open]);

  const retry = async () => {
    setBusy(true);
    await flushQueue({ onProgress: refresh });
    await refresh();
    setBusy(false);
  };

  return (
    <>
      <button onClick={() => setOpen((v) => !v)}
        className="fixed top-4 right-4 z-40 px-3 py-2 rounded-xl bg-plu-black text-white text-xs font-semibold"
        aria-expanded={open} aria-controls="queue-drawer">
        Queue ({items.length})
      </button>

      {open && (
        <aside id="queue-drawer" role="dialog" aria-label="Offline queue"
          className="fixed top-16 right-4 z-40 w-80 max-h-[70vh] overflow-auto bg-white rounded-2xl shadow-2xl border border-black/10 p-4 space-y-3">
          <header className="flex justify-between items-center">
            <h2 className="font-bold text-plu-black">Offline Queue</h2>
            <button onClick={retry} disabled={busy} className="text-xs font-semibold underline">
              {busy ? "Syncing…" : "Retry all"}
            </button>
          </header>
          {items.length === 0 && <p className="text-sm text-plu-slate">Nothing queued.</p>}
          <ul className="space-y-2">
            {items.map((it) => (
              <li key={it.id} className="text-xs border rounded-xl p-2 space-y-1">
                <div className="flex justify-between">
                  <span className="font-semibold">{it.status}</span>
                  <button onClick={() => removeFromQueue(it.id).then(refresh)} className="text-red-600">✕</button>
                </div>
                <div className="text-plu-slate">{it.url}</div>
                {it.lastError && <div className="text-red-600">{it.lastError}</div>}
                <div className="text-[10px] text-plu-slate">attempts: {it.attempts}</div>
              </li>
            ))}
          </ul>
        </aside>
      )}
    </>
  );
}
