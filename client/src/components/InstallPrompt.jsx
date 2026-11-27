import { useEffect, useState } from "react";

/**
 * InstallPrompt
 * Shows a branded banner on first visit inviting the user to install PLU Mobi.
 *
 * Behavior:
 *  - Android / Desktop Chrome: captures beforeinstallprompt, shows custom
 *    banner with an "Install" button that triggers the native prompt.
 *  - iOS Safari: shows manual instructions ("Tap Share  Add to Home Screen").
 *  - If already installed (display-mode: standalone), does nothing.
 *  - If user dismisses, stays hidden for 7 days (localStorage).
 */

const DISMISS_KEY = "plu_install_dismissed_until";
const DISMISS_DAYS = 7;

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [show, setShow] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Detect if already running as installed PWA
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;
    if (standalone) {
      setIsInstalled(true);
      return;
    }

    // Detect iOS (Safari only - Chrome on iOS doesn't support install)
    const ua = window.navigator.userAgent;
    const iOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
    setIsIOS(iOS);

    // Check if user dismissed recently
    const dismissedUntil = parseInt(localStorage.getItem(DISMISS_KEY) || "0", 10);
    if (Date.now() < dismissedUntil) return;

    // Android / Desktop Chrome
    function onBeforeInstall(e) {
      e.preventDefault();
      setDeferredPrompt(e);
      setShow(true);
    }
    window.addEventListener("beforeinstallprompt", onBeforeInstall);

    // If iOS, show banner after a small delay (no event available)
    let iosTimer;
    if (iOS) {
      iosTimer = setTimeout(() => setShow(true), 2000);
    }

    // Listen for successful install
    function onInstalled() {
      setShow(false);
      setIsInstalled(true);
    }
    window.addEventListener("appinstalled", onInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
      if (iosTimer) clearTimeout(iosTimer);
    };
  }, []);

  async function handleInstall() {
    if (isIOS) {
      // iOS: no prompt - show inline hint
      return;
    }
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShow(false);
    }
    setDeferredPrompt(null);
  }

  function dismiss() {
    const until = Date.now() + DISMISS_DAYS * 24 * 60 * 60 * 1000;
    localStorage.setItem(DISMISS_KEY, String(until));
    setShow(false);
  }

  if (isInstalled || !show) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="install-title"
      aria-describedby="install-desc"
      className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50 bg-plu-black text-white rounded-2xl shadow-2xl border-2 border-plu-yellow p-4 animate-in"
    >
      <div className="flex items-start gap-3">
        <img
          src="/plu-logo-circle.png"
          alt=""
          className="h-12 w-12 rounded-full object-cover border-2 border-plu-yellow shrink-0"
          onError={(e) => { e.currentTarget.style.display = "none"; }}
        />
        <div className="flex-1 min-w-0">
          <h3 id="install-title" className="text-sm font-extrabold text-plu-yellow">
            Install PLU Mobi
          </h3>
          <p id="install-desc" className="text-xs text-white/85 mt-1">
            {isIOS ? (
              <>
                Tap <strong>Share</strong> <span aria-hidden>⬆</span> then{" "}
                <strong>Add to Home Screen</strong> to install.
              </>
            ) : (
              <>Add PLU Mobi to your home screen for fast, offline access.</>
            )}
          </p>
        </div>
        <button
          onClick={dismiss}
          aria-label="Dismiss install prompt"
          className="shrink-0 text-white/60 hover:text-white text-lg leading-none min-h-[32px] min-w-[32px] rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-plu-yellow/60"
        >
          ✕
        </button>
      </div>

      <div className="mt-3 flex gap-2">
        {!isIOS && (
          <button
            onClick={handleInstall}
            className="flex-1 bg-plu-yellow text-plu-black font-bold text-sm py-2 rounded-lg hover:brightness-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-plu-yellow/60"
          >
            Install now
          </button>
        )}
        <button
          onClick={dismiss}
          className="flex-1 bg-white/10 text-white font-semibold text-sm py-2 rounded-lg hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        >
          {isIOS ? "Got it" : "Not now"}
        </button>
      </div>

      <style>{`
        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-in { animation: slideUpFade 0.25s ease-out; }
        @media (prefers-reduced-motion: reduce) {
          .animate-in { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
