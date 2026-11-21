import { useEffect, useState } from "react";

/**
 * SWUpdateBanner
 * Listens for the "plu-sw-update" event dispatched by main.jsx
 * when a new service worker installs. Shows a persistent banner
 * offering to reload with the new version.
 */
export default function SWUpdateBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    function onUpdate() {
      setShow(true);
    }
    window.addEventListener("plu-sw-update", onUpdate);
    return () => window.removeEventListener("plu-sw-update", onUpdate);
  }, []);

  function refresh() {
    // Ask the waiting SW to skip waiting and take over, then reload
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: "SKIP_WAITING" });
    }
    setTimeout(() => window.location.reload(), 300);
  }

  function dismiss() {
    setShow(false);
  }

  if (!show) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm bg-plu-black text-white rounded-xl shadow-2xl p-4 z-50 flex items-start gap-3 border-2 border-plu-yellow"
    >
      <div className="flex-1">
        <p className="text-sm font-bold text-plu-yellow">New version available</p>
        <p className="text-xs text-white/80 mt-1">
          Reload to get the latest updates.
        </p>
      </div>
      <div className="flex flex-col gap-1 shrink-0">
        <button
          onClick={refresh}
          className="bg-plu-yellow text-plu-black font-semibold text-xs px-3 py-1.5 rounded-lg hover:brightness-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-plu-yellow/60"
        >
          Refresh
        </button>
        <button
          onClick={dismiss}
          className="text-white/60 text-xs hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded"
        >
          Later
        </button>
      </div>
    </div>
  );
}
