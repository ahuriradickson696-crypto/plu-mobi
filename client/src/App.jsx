import { Routes, Route, Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./features/auth/Login";
import Register from "./features/registration/Register";
import Dashboard from "./features/member/Dashboard";
import DigitalCard from "./features/member/DigitalCard";
import Verify from "./features/verify/Verify";
import Officers from "./features/officers/Officers";
import Endorse from "./features/endorse/Endorse";
import AssistRegister from "./features/assist/AssistRegister";
import AssistEndorse from "./features/assist/AssistEndorse";
import AssistActivity from "./features/assist/AssistActivity";
import ForgotPin from "./features/auth/ForgotPin";
import ResetPin from "./features/auth/ResetPin";
import ReviewQueue from "./features/review/ReviewQueue";
import ReviewDetail from "./features/review/ReviewDetail";
import ReportCorruption from "./features/corruption/ReportCorruption";
import TrackCorruption from "./features/corruption/TrackCorruption";
import CorruptionList from "./features/corruption/CorruptionList";
import CorruptionDetail from "./features/corruption/CorruptionDetail";
import ReportingDashboard from "./features/reporting/Dashboard";
import EventsList from "./features/events/EventsList";
import EventDetail from "./features/events/EventDetail";
import CreateEvent from "./features/events/CreateEvent";
import LegalPage from "./features/legal/LegalPage";
import RouteTitle from "./components/RouteTitle";
import AdminHome from "./features/admin/AdminHome";
import AdminUsers from "./features/admin/AdminUsers";
import Header from "./components/Header";
import SWUpdateBanner from "./components/SWUpdateBanner";
import Stats from "./features/public/Stats";
import Carousel from "./components/Carousel";
import { getQueueSize, flushQueue } from "./lib/offlineQueue";
import { useTranslation } from "./locales/LanguageContext";
import { useAuth } from "./store/auth";

function OfflineBanner() {
  const [online, setOnline] = useState(navigator.onLine);
  const [queueSize, setQueueSize] = useState(getQueueSize());

  useEffect(() => {
    const onOnline = () => { setOnline(true); flushQueue().then(() => setQueueSize(getQueueSize())); };
    const onOffline = () => setOnline(false);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    const interval = setInterval(() => setQueueSize(getQueueSize()), 3000);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
      clearInterval(interval);
    };
  }, []);

  if (online && queueSize === 0) return null;
  return (
    <div className={`text-xs text-center py-2 font-semibold ${online ? "bg-amber-100 text-amber-800" : "bg-red-100 text-red-800"}`}>
      {!online && "Offline — the app still works. Actions will sync when back online."}
      {online && queueSize > 0 && `Syncing ${queueSize} queued action(s)…`}
    </div>
  );
}

function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const handler = (e) => { e.preventDefault(); setDeferredPrompt(e); };
    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => setInstalled(true));
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  async function install() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setInstalled(true);
    setDeferredPrompt(null);
  }

  if (installed || !deferredPrompt) return null;
  return (
    <button onClick={install} className="fixed bottom-20 right-4 bg-plu-yellow text-plu-black font-semibold px-4 py-2 rounded-card shadow-lg z-50 text-sm">
      Install PLU Mobi
    </button>
  );
}

function LegalPageWrapper() {
  const { type } = useParams();
  return <LegalPage type={type} />;
}

function HomeButton() {
  return (
    <Link
      to="/"
      className="fixed bottom-4 left-4 z-50 flex items-center justify-center w-12 h-12 bg-plu-black rounded-full shadow-lg border-2 border-plu-yellow overflow-hidden hover:scale-105 transition-transform focus:outline-none focus-visible:ring-4 focus-visible:ring-plu-yellow/60"
      title="Back to Home"
      aria-label="Back to Home"
    >
      <img
        src="/plu-logo-circle.png"
        alt=""
        className="w-full h-full object-cover"
        onError={(e) => { e.currentTarget.style.display = "none"; }}
      />
    </Link>
  );
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <RouteTitle />
      <OfflineBanner />
      <Header />
      {/* <InstallButton /> */}
      <SWUpdateBanner />
      <InstallPrompt />
      <HomeButton />

      <main id="main-content" tabIndex="-1" aria-label="Main content" className="flex-1 max-w-3xl md:max-w-5xl lg:max-w-6xl w-full mx-auto p-4 md:p-6 lg:p-8">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/card" element={<DigitalCard />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/officers" element={<Officers />} />
          <Route path="/endorse" element={<Endorse />} />
          <Route path="/assist/register" element={<AssistRegister />} />
          <Route path="/assist/endorse" element={<AssistEndorse />} />
          <Route path="/assist/activity" element={<AssistActivity />} />
          <Route path="/forgot-pin" element={<ForgotPin />} />
          <Route path="/reset-pin" element={<ResetPin />} />
          <Route path="/admin" element={<AdminHome />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/review" element={<ReviewQueue />} />
          <Route path="/review/:id" element={<ReviewDetail />} />
          <Route path="/corruption/report" element={<ReportCorruption />} />
          <Route path="/corruption/track" element={<TrackCorruption />} />
          <Route path="/corruption/list" element={<CorruptionList />} />
          <Route path="/corruption/:id" element={<CorruptionDetail />} />
          <Route path="/reporting" element={<ReportingDashboard />} />
          <Route path="/events" element={<EventsList />} />
          <Route path="/events/new" element={<CreateEvent />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/legal/:type" element={<LegalPageWrapper />} />
          <Route path="*" element={<div className="flex flex-col items-center justify-center py-16 text-center gap-3">
  <img
    src="/plu-logo-circle.png"
    alt="PLU"
    className="h-20 w-20 rounded-full object-cover border-2 border-plu-yellow"
    onError={(e) => { e.currentTarget.style.display = "none"; }}
  />
  <p className="text-sm text-plu-slate">Screen not built yet.</p>
  <Link to="/" className="text-xs font-semibold text-plu-black underline">
    Go to Home
  </Link>
</div>} />
        </Routes>
      </main>

      <footer className="text-center text-xs text-plu-slate py-6 px-4 space-y-2">
        <div className="flex items-center justify-center gap-3 mb-3">
          <img
            src="/plu-logo-circle.png"
            alt="Patriotic League of Uganda"
            className="h-10 w-10 rounded-full object-cover border-2 border-plu-yellow"
            onError={(e) => { e.currentTarget.style.display = "none"; }}
          />
          <span className="text-xs font-extrabold text-plu-black">
            PLU Mobi
          </span>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/legal/about" className="underline">About</Link>
          <Link to="/legal/faq" className="underline">FAQ</Link>
          <Link to="/legal/privacy" className="underline">Privacy Policy</Link>
          <Link to="/legal/terms" className="underline">Terms of Service</Link>
        </div>
        <p>PLU Mobi — Patriotic League of Uganda</p>
      </footer>
    </div>
  );
}

/* ---------- Landing: smart, auth-aware ---------- */
function Landing() {
  const { t } = useTranslation();
  const { token, member } = useAuth();
  const loggedIn = Boolean(token && member);

  return (
    <div className="space-y-5">
      <Carousel />

      {/* Smart welcome banner */}
      {loggedIn ? (
        <section
          aria-labelledby="welcome-heading"
          className="bg-plu-black text-white rounded-2xl p-5 md:p-6 shadow-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <p className="text-[11px] uppercase tracking-widest text-plu-yellow font-semibold mb-1">
              Welcome back
            </p>
            <h2 id="welcome-heading" className="text-xl md:text-2xl font-extrabold leading-tight">
              {member.fullName || "Member"}
            </h2>
            <p className="font-mono text-xs text-white/70 mt-0.5">{member.pcNumber}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center gap-2 bg-plu-yellow text-plu-black font-semibold px-5 py-3 rounded-xl hover:brightness-95 transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-plu-yellow/60"
            >
              Go to My Dashboard <span aria-hidden>→</span>
            </Link>
            <Link
              to="/card"
              className="inline-flex items-center justify-center gap-2 bg-white/10 text-white font-semibold px-5 py-3 rounded-xl hover:bg-white/20 transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
            >
              View digital card
            </Link>
          </div>
        </section>
      ) : (
        <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          <Link to="/register"><button className="w-full bg-plu-yellow text-plu-black font-semibold py-3 rounded-card">{t.join}</button></Link>
          <Link to="/login"><button className="w-full bg-plu-black text-white font-semibold py-3 rounded-card">{t.signin}</button></Link>
          <Link to="/verify"><button className="w-full bg-white border border-plu-black/10 py-3 rounded-card">{t.verify}</button></Link>
          <Link to="/officers"><button className="w-full bg-white border border-plu-black/10 py-3 rounded-card">{t.officers}</button></Link>
        </section>
      )}

      {/* Shared section: works for both states */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        <Link to="/endorse" className="col-span-2 md:col-span-3 lg:col-span-4"><button className="w-full bg-white border border-plu-black/10 py-3 rounded-card">{t.endorse}</button></Link>
        <Link to="/events" className="col-span-2 md:col-span-3 lg:col-span-4"><button className="w-full bg-white border border-plu-black/10 py-3 rounded-card">{t.events}</button></Link>
        <Link to="/corruption/report" className="col-span-2 md:col-span-3 lg:col-span-4"><button className="w-full bg-plu-red text-white font-semibold py-3 rounded-card">{t.report}</button></Link>
        <Link to="/corruption/track" className="col-span-2 md:col-span-3 lg:col-span-4"><button className="w-full bg-white border border-plu-black/10 py-3 rounded-card">{t.track}</button></Link>
      </section>

      <Stats />
    </div>
  );
}












