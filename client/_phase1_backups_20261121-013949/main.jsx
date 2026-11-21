import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { LanguageProvider } from "./locales/LanguageContext";
import ErrorBoundary from "./components/ErrorBoundary";
import { requestNotificationPermission } from "./lib/notify";
import "./index.css";

requestNotificationPermission().catch(() => {});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LanguageProvider>
    <BrowserRouter>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </BrowserRouter>
    </LanguageProvider>
  </React.StrictMode>
);



