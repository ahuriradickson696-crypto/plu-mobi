import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import { LanguageProvider } from "./locales/LanguageContext";
import "./index.css";

// Zustand store (useAuth) is global - no provider needed.
// LanguageProvider only used if the module exports one; otherwise pass-through.

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <LanguageProvider>
          <App />
        </LanguageProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);

// ---------- Service Worker registration (PWA offline) ----------
if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => {
        console.log("[SW] registered:", reg.scope);
        reg.addEventListener("updatefound", () => {
          const newWorker = reg.installing;
          if (!newWorker) return;
          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
              // New version available - show refresh prompt
              window.dispatchEvent(new CustomEvent("plu-sw-update"));
            }
          });
        });
      })
      .catch((err) => console.warn("[SW] registration failed:", err));
  });
}
