import { useEffect, useState } from "react";
import { getQueueSize } from "../lib/offlineQueue";

export default function OfflineBadge() {
  const [online, setOnline] = useState(typeof navigator !== "undefined" ? navigator.onLine : true);
  const [pending, setPending] = useState(0);

  useEffect(() => {
    const refresh = () => getQueueSize().then(setPending).catch(() => {});
    const on = () => { setOnline(true); refresh(); };
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    refresh();
    const iv = setInterval(refresh, 5000);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
      clearInterval(iv);
    };
  }, []);

  if (online && pending === 0) return null;
  const label = !online ? `Offline${pending ? ` — ${pending} pending` : ""}` : `${pending} queued`;

  return (
    <div role="status" aria-live="polite"
      className={`fixed bottom-4 right-4 z-50 px-4 py-2 rounded-full text-sm font-semibold shadow-lg ${online ? "bg-amber-500 text-white" : "bg-gray-800 text-white"}`}>
      {label}
    </div>
  );
}
