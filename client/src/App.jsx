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
import InstallPrompt from "./components/InstallPrompt";
import Stats from "./features/public/Stats";
import MyData from "./features/privacy/MyData";
import Carousel from "./components/Carousel";
import { getQueueSize } from "./lib/offlineQueue";
import { flushQueue } from "./lib/syncEngine";
import { useTranslation } from "./locales/LanguageContext";
import { useAuth } from "./store/auth";
import AboutPLU from "./features/about/AboutPLU.jsx";

function OfflineBanner() {
  const [online, setOnline] = useState(typeof navigator !== "undefined" ? navigator.onLine : true);
  const [queueSize, setQueueSize] = useState(0);

  useEffect(() => {
    let mounted = true;
    const refresh = () => {
      getQueueSize().then((n) => { if (mounted) setQueueSize(n); }).catch(() => {});
    };
    const onOnline = async () => {
      setOnline(true);
      try { await flushQueue(); } catch (e) { /* silent */ }
      refresh();
    };
    const onOffline = () => setOnline(false);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    refresh();
    const interval = setInterval(refresh, 3000);
    return () => {
      mounted = false;
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
      clearInterval(interval);
    };
  }, []);

  if (online && queueSize === 0) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className={`text-xs text-center py-2 font-semibold ${online ? "bg-amber-100 text-amber-800" : "bg-red-100 text-red-800"}`}
    >
      {!online && "Offline - the app still works. Actions will sync when back online."}
      {online && queueSize > 0 && `Syncing ${queueSize} queued action(s)`}
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
      className="fixed bottom-4 left-4 z-50 flex items-center justify-center w-12 h-12 bg-plu-black rounded-xl shadow-lg border-2 border-plu-yellow overflow-hidden hover:scale-105 transition-transform focus:outline-none focus-visible:ring-4 focus-visible:ring-plu-yellow/60"
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
          <Route path="/about" element={<AboutPLU />} />
      <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/my-data" element={<MyData />} />
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
    className="h-20 w-20 rounded-xl object-cover border-2 border-plu-yellow"
    onError={(e) => { e.currentTarget.style.display = "none"; }}
  />
  <p className="text-sm text-plu-slate">Screen not built yet.</p>
  <Link to="/" className="text-xs font-semibold text-plu-black underline">
    Go to Home
  </Link>
</div>} />
        </Routes>
      </main>

<footer className="bg-plu-black text-white mt-8">
      <div className="max-w-md mx-auto px-5 py-8 space-y-6">

        {/* Brand */}
        <div className="text-center">
          <p className="text-plu-yellow font-extrabold text-lg leading-tight">Patriotic League of Uganda</p>
          <p className="text-xs text-white/60 mt-1">PLU Mobi · Official App</p>
        </div>

        {/* Compact nav grid - 2 columns of app essentials */}
        <nav aria-label="Footer navigation" className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
          <Link to="/" className="py-2 text-white/80 hover:text-plu-yellow">Home</Link>
          <Link to="/about" className="py-2 text-white/80 hover:text-plu-yellow">About PLU</Link>
          <Link to="/officers" className="py-2 text-white/80 hover:text-plu-yellow">Officers</Link>
          <Link to="/events" className="py-2 text-white/80 hover:text-plu-yellow">Events</Link>
          <Link to="/verify" className="py-2 text-white/80 hover:text-plu-yellow">Verify</Link>
          <Link to="/contact" className="py-2 text-white/80 hover:text-plu-yellow">Contact</Link>
        </nav>

        {/* Legal links - horizontal strip, small but readable */}
        <div className="border-t border-white/10 pt-4">
          <nav aria-label="Legal" className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs">
            <Link to="/legal/privacy" className="text-white/60 hover:text-white py-1">Privacy</Link>
            <Link to="/legal/data-protection" className="text-white/60 hover:text-white py-1">Data Protection</Link>
            <Link to="/legal/terms" className="text-white/60 hover:text-white py-1">Terms</Link>
            <Link to="/legal/cookie" className="text-white/60 hover:text-white py-1">Cookies</Link>
            <Link to="/legal/accessibility" className="text-white/60 hover:text-white py-1">Accessibility</Link>
            <Link to="/legal/security" className="text-white/60 hover:text-white py-1">Security</Link>
          </nav>
        </div>

        {/* Social icons row */}
        <div className="flex justify-center gap-4">
          <a href="https://facebook.com" aria-label="Facebook" rel="noopener noreferrer" target="_blank" className="text-white/70 hover:text-plu-yellow text-sm py-2 px-3">Facebook</a>
          <a href="https://x.com" aria-label="X" rel="noopener noreferrer" target="_blank" className="text-white/70 hover:text-plu-yellow text-sm py-2 px-3">X</a>
          <a href="https://youtube.com" aria-label="YouTube" rel="noopener noreferrer" target="_blank" className="text-white/70 hover:text-plu-yellow text-sm py-2 px-3">YouTube</a>
          <a href="https://instagram.com" aria-label="Instagram" rel="noopener noreferrer" target="_blank" className="text-white/70 hover:text-plu-yellow text-sm py-2 px-3">Instagram</a>
        </div>

        {/* Address + version - bottom block */}
        <div className="text-center text-xs text-white/50 space-y-1 border-t border-white/10 pt-4">
          <p>Plot 7 Saddler Lane, Naguru, Kampala, Uganda</p>
          <p>Tel: 0414675689</p>
          <p>© 2026 Patriotic League of Uganda</p>
          <p className="text-white/30"></p>
        </div>
      </div>
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
              Go to My Dashboard <span aria-hidden></span>
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

      {/* PLU Info - full website content */}
      <section aria-labelledby="plu-heading" className="space-y-10 pt-4">

        {/* VISION + MISSION split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-plu-black text-white rounded-card p-6 md:p-8">
            <p className="text-[10px] uppercase tracking-[0.25em] text-plu-yellow font-bold mb-3">Guiding direction</p>
            <h2 id="plu-heading" className="text-2xl md:text-3xl font-extrabold leading-tight">Our Vision</h2>
            <p className="text-sm md:text-base text-white/80 leading-relaxed mt-4">
              To build a united, patriotic, disciplined, prosperous, self-reliant and sovereign Uganda where every citizen is empowered to contribute to national development, guided by integrity, service, constitutionalism and a shared commitment to the common good.
            </p>
          </div>
          <div className="bg-plu-yellow rounded-card p-6 md:p-8">
            <p className="text-[10px] uppercase tracking-[0.25em] text-plu-black/60 font-bold mb-3">Our mission</p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-plu-black leading-tight">Mission Statement</h2>
            <p className="text-sm md:text-base text-plu-black/80 leading-relaxed mt-4">
              To mobilise Ugandans to fulfil their civic duties as citizens of this land, for the benefit of society as a whole and to jealously guard Uganda's unique natural and social harmony.
            </p>
          </div>
        </div>

        {/* PURPOSE */}
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-[10px] uppercase tracking-[0.25em] text-plu-slate font-bold mb-3">Our identity</p>
          <p className="text-base md:text-lg text-plu-black leading-relaxed">
            PLU's public identity is rooted in service, patriotism, and the belief that citizens can contribute to the nation's progress through participation, leadership, and civic responsibility.
          </p>
        </div>

        {/* CORE VALUES - numbered cards */}
        <div>
          <div className="text-center mb-8">
            <p className="text-[10px] uppercase tracking-[0.25em] text-plu-slate font-bold mb-3">The PLU standard</p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-plu-black">Our Core Values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { n: "01", name: "Patriotism", desc: "Love, loyalty and commitment to Uganda above personal or sectarian interests." },
              { n: "02", name: "National Unity", desc: "Promoting harmony across tribes, religions, regions and political backgrounds." },
              { n: "03", name: "Discipline", desc: "Encouraging responsible, ethical and accountable leadership and citizenship." },
              { n: "04", name: "Service to the Nation", desc: "Putting the interests of the people first through community service and civic engagement." },
              { n: "05", name: "Integrity & Accountability", desc: "Fighting corruption and misuse of public resources while promoting transparency." },
              { n: "06", name: "Socioeconomic Transformation", desc: "Supporting initiatives that create jobs, improve livelihoods and drive development." },
              { n: "07", name: "Youth Empowerment", desc: "Equipping young people with leadership skills, civic education and opportunity." },
              { n: "08", name: "Sovereignty & Self-Reliance", desc: "Advocating for a Uganda that makes independent decisions and builds a resilient economy." },
              { n: "09", name: "Constitutionalism & Rule of Law", desc: "Respecting the Constitution, promoting justice and responsible citizenship." },
              { n: "10", name: "Community Mobilisation", desc: "Organising citizens to participate in national development and grassroots transformation." },
            ].map((v) => (
              <div key={v.n} className="flex gap-3 bg-white rounded-card border border-plu-black/10 p-4 shadow-sm">
                <span className="shrink-0 w-9 h-9 rounded-xl bg-plu-black text-plu-yellow text-xs font-bold flex items-center justify-center">{v.n}</span>
                <div>
                  <h3 className="font-bold text-plu-black text-sm">{v.name}</h3>
                  <p className="text-xs text-plu-slate mt-1 leading-relaxed">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MOTTO - full-bleed band */}
        <div className="bg-plu-black text-white rounded-card px-6 py-10 md:py-14 text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-plu-yellow font-bold mb-4">Our motto</p>
          <p className="text-3xl md:text-4xl font-extrabold italic text-plu-yellow leading-tight">"One God, One People, One Army!"</p>
        </div>

        {/* KEY AREAS OF FOCUS - 4 numbered cards */}
        <div>
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-extrabold text-plu-black">Key Areas of Focus</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { n: "1", name: "National Unity", desc: "Encouraging Ugandans to participate in shaping a stronger national future." },
              { n: "2", name: "Youth & Civic Engagement", desc: "Emphasising the role of young people in service, leadership and community action." },
              { n: "3", name: "Jobs & Opportunity", desc: "Highlighting practical progress, economic opportunity and a secure future for citizens." },
              { n: "4", name: "Justice & Accountability", desc: "Framing fairness, responsibility and a more accountable public life." },
            ].map((f) => (
              <div key={f.n} className="bg-plu-yellow/15 rounded-card border border-plu-yellow p-5">
                <span className="text-3xl font-extrabold text-plu-black/20">{f.n}</span>
                <h3 className="font-bold text-plu-black mt-2">{f.name}</h3>
                <p className="text-sm text-plu-slate mt-1 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* HISTORY - timeline */}
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-[10px] uppercase tracking-[0.25em] text-plu-slate font-bold mb-3">Where we came from</p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-plu-black">Our History</h2>
          </div>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="shrink-0 text-right w-16">
                <span className="text-lg font-extrabold text-plu-black">2024</span>
              </div>
              <div className="relative pl-6 border-l-2 border-plu-yellow pb-6">
                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-xl bg-plu-yellow border-2 border-white" />
                <h3 className="font-bold text-plu-black">A renewed public identity</h3>
                <p className="text-sm text-plu-slate mt-1">The movement publicly rebranded and positioned itself around a stronger national and civic identity.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="shrink-0 text-right w-16">
                <span className="text-lg font-extrabold text-plu-black">2025</span>
              </div>
              <div className="relative pl-6 border-l-2 border-plu-yellow">
                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-xl bg-plu-yellow border-2 border-white" />
                <h3 className="font-bold text-plu-black">Growing public engagement</h3>
                <p className="text-sm text-plu-slate mt-1">PLU expanded its public presence through events, campaigns, and visible participation in national conversations.</p>
              </div>
            </div>
          </div>
        </div>


{/* LEADERSHIP - complete 21-profile, 4-tier structure from plu.org.ug */}
<div className="space-y-10">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-[10px] uppercase tracking-[0.25em] text-plu-slate font-bold mb-3">Who leads</p>
          <h2 className="text-2xl md:text-3xl font-extrabold text-plu-green">PLU Leadership</h2>
          <p className="mt-2 text-sm text-plu-slate">Leadership in Service - United in national purpose.</p>
          <p className="mt-1 text-xs text-plu-slate">Guiding participation, responsibility and service across Uganda.</p>
        </div>
        <p className="text-center text-sm text-plu-slate max-w-2xl mx-auto">National responsibility is organised in clear tiers, beginning with the Chairman and continuing through the leadership teams that coordinate PLU work.</p>
        <p className="text-center font-bold text-plu-green">21 Profiles</p>
        <div className="space-y-3">
          <div className="flex items-baseline gap-3 border-b-2 border-plu-green/20 pb-2">
            <span className="font-extrabold text-plu-gold">01</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-plu-slate font-bold">Highest office</span>
            <h3 className="font-extrabold text-plu-green">Chairman</h3>
          </div>
          <article className="p-6 border-2 border-plu-gold bg-amber-50/40 rounded-xl flex flex-col items-center text-center gap-3">
            <div className="relative w-48 h-48 rounded-xl overflow-hidden bg-plu-green text-white font-extrabold text-4xl flex items-center justify-center flex-none">
              <span className="absolute"><img src="/leaders/MK.jpg" className="w-full h-full object-cover" alt="Gen. Muhoozi" /></span>
              <img src="/leaders/chairman.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            </div>
            <div className="w-full">
              <h4 className="font-bold text-plu-green text-lg">Gen. Muhoozi Kainerugaba - CDF, SPA/SO</h4>
              <p className="text-xs font-semibold text-plu-slate mb-3">Chairman, Patriotic League of Uganda</p>
              <p className="text-sm text-plu-slate text-left">As Chief of Defence Forces of the Uganda People's Defence Forces and Chairman of PLU, General Muhoozi Kainerugaba provides the movement with national leadership, discipline and a strong message of patriotic service. His public role places emphasis on mobilising Ugandans, especially young people, to take part in building the country's next phase of development.</p>
            </div>
          </article>
        </div>
        <div className="space-y-3">
          <div className="flex items-baseline gap-3 border-b-2 border-plu-green/20 pb-2">
            <span className="font-extrabold text-plu-gold">02</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-plu-slate font-bold">Leadership tier</span>
            <h3 className="font-extrabold text-plu-green">Top Leadership</h3>
            <span className="text-xs text-plu-slate ml-auto">2 profiles</span>
          </div>
          <article className="p-6 border border-gray-200 bg-white rounded-xl flex flex-col items-center text-center gap-3">
            <div className="relative w-48 h-48 rounded-xl overflow-hidden bg-plu-green text-white font-extrabold text-4xl flex items-center justify-center flex-none">
              <span className="absolute"><img src="/leaders/MN.jpg" className="w-full h-full object-cover" alt="Michael Nuwagira" /></span>
              <img src="/leaders/vice-chairman.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            </div>
            <div className="w-full">
              <h4 className="font-bold text-plu-green text-lg">Michael Nuwagira</h4>
              <p className="text-xs font-semibold text-plu-slate mb-3">National Vice Chairman</p>
              <p className="text-sm text-plu-slate text-left">Michael Nuwagira serves as the National Vice Chairman, supporting the Chairman in providing political direction, national coordination and strategic oversight of the League. He plays a central role in strengthening mobilisation, promoting unity and cohesion across PLU's leadership and membership, and expanding the League's presence throughout the country.</p>
            </div>
          </article>
          <article className="p-6 border border-gray-200 bg-white rounded-xl flex flex-col items-center text-center gap-3">
            <div className="relative w-48 h-48 rounded-xl overflow-hidden bg-plu-green text-white font-extrabold text-4xl flex items-center justify-center flex-none">
              <span className="absolute"><img src="/leaders/FT.jpg" className="w-full h-full object-cover" alt="Fadil Twalla" /></span>
              <img src="/leaders/general-secretary.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            </div>
            <div className="w-full">
              <h4 className="font-bold text-plu-green text-lg">Hon. Fadil Twalla</h4>
              <p className="text-xs font-semibold text-plu-slate mb-3">General Secretary - MP Tingey County</p>
              <p className="text-sm text-plu-slate text-left">Fadil Twalla serves as General Secretary following the June 2026 changes in the PLU leadership structure. He provides overall leadership to the Secretariat, coordinates the League's administrative and organisational affairs, and drives mobilisation across the country.</p>
            </div>
          </article>
        </div>
        <div className="space-y-3">
          <div className="flex items-baseline gap-3 border-b-2 border-plu-green/20 pb-2">
            <span className="font-extrabold text-plu-gold">03</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-plu-slate font-bold">Leadership tier</span>
            <h3 className="font-extrabold text-plu-green">Central Committee</h3>
            <span className="text-xs text-plu-slate ml-auto">16 profiles</span>
          </div>
          <article className="p-6 border border-gray-200 bg-white rounded-xl flex flex-col items-center text-center gap-3">
            <div className="relative w-48 h-48 rounded-xl overflow-hidden bg-plu-green text-white font-extrabold text-4xl flex items-center justify-center flex-none">
              <span className="absolute"><img src="/leaders/BB.jpg" className="w-full h-full object-cover" alt="Balaam Barugahara" /></span>
              <img src="/leaders/balaam.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            </div>
            <div className="w-full">
              <h4 className="font-bold text-plu-green text-lg">Hon. Balaam Barugahara Ateenyi</h4>
              <p className="text-xs font-semibold text-plu-slate mb-3">Regional Vice Chairperson, Western - Minister of Local Government</p>
              <p className="text-sm text-plu-slate text-left">Hon. Balaam Barugahara Ateenyi serves on the Central Committee and as Regional Vice Chairperson for the Western Region.</p>
            </div>
          </article>
          <article className="p-6 border border-gray-200 bg-white rounded-xl flex flex-col items-center text-center gap-3">
            <div className="relative w-48 h-48 rounded-xl overflow-hidden bg-plu-green text-white font-extrabold text-4xl flex items-center justify-center flex-none">
              <span className="absolute"><img src="/leaders/LA.jpg" className="w-full h-full object-cover" alt="Lillian Aber" /></span>
              <img src="/leaders/lillian-aber.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            </div>
            <div className="w-full">
              <h4 className="font-bold text-plu-green text-lg">Hon. Lillian Aber</h4>
              <p className="text-xs font-semibold text-plu-slate mb-3">Regional Vice Chairperson, Northern - Women Representative, Kitgum District</p>
              <p className="text-sm text-plu-slate text-left">Hon. Lillian Aber serves on the Central Committee and is Minister of State for Relief, Disaster Preparedness and Refugees.</p>
            </div>
          </article>
          <article className="p-6 border border-gray-200 bg-white rounded-xl flex flex-col items-center text-center gap-3">
            <div className="relative w-48 h-48 rounded-xl overflow-hidden bg-plu-green text-white font-extrabold text-4xl flex items-center justify-center flex-none">
              <span className="absolute"><img src="/leaders/KK.jpg" className="w-full h-full object-cover" alt="Kiryowa Kiwanuka" /></span>
              <img src="/leaders/kiryowa.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            </div>
            <div className="w-full">
              <h4 className="font-bold text-plu-green text-lg">Hon. Kiryowa Kiwanuka</h4>
              <p className="text-xs font-semibold text-plu-slate mb-3">Regional Vice Chairperson, Buganda - Minister of Defence and Veteran Affairs</p>
              <p className="text-sm text-plu-slate text-left">Hon. Kiryowa Kiwanuka serves on the Central Committee and as Regional Vice Chairperson for Buganda Region.</p>
            </div>
          </article>
          <article className="p-6 border border-gray-200 bg-white rounded-xl flex flex-col items-center text-center gap-3">
            <div className="relative w-48 h-48 rounded-xl overflow-hidden bg-plu-green text-white font-extrabold text-4xl flex items-center justify-center flex-none">
              <span className="absolute"><img src="/leaders/AM.jpg" className="w-full h-full object-cover" alt="Andrew Mwenda" /></span>
              <img src="/leaders/mwenda.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            </div>
            <div className="w-full">
              <h4 className="font-bold text-plu-green text-lg">Andrew Mwenda</h4>
              <p className="text-xs font-semibold text-plu-slate mb-3">Director of Communications</p>
              <p className="text-sm text-plu-slate text-left">Andrew Mwenda, Managing Director of The Independent, adds a strong policy and media perspective to the Central Committee.</p>
            </div>
          </article>
          <article className="p-6 border border-gray-200 bg-white rounded-xl flex flex-col items-center text-center gap-3">
            <div className="relative w-48 h-48 rounded-xl overflow-hidden bg-plu-green text-white font-extrabold text-4xl flex items-center justify-center flex-none">
              <span className="absolute"><img src="/leaders/EK.jpg" className="w-full h-full object-cover" alt="Edwin Karugire" /></span>
              <img src="/leaders/karugire.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            </div>
            <div className="w-full">
              <h4 className="font-bold text-plu-green text-lg">Edwin Karugire</h4>
              <p className="text-xs font-semibold text-plu-slate mb-3">Director of Legal Affairs</p>
              <p className="text-sm text-plu-slate text-left">Edwin Karugire is a founding partner at K&K Advocates and serves as Director of Legal Affairs for PLU.</p>
            </div>
          </article>
          <article className="p-6 border border-gray-200 bg-white rounded-xl flex flex-col items-center text-center gap-3">
            <div className="relative w-48 h-48 rounded-xl overflow-hidden bg-plu-green text-white font-extrabold text-4xl flex items-center justify-center flex-none">
              <span className="absolute"><img src="/leaders/MM.jpg" className="w-full h-full object-cover" alt="Michael Mawanda" /></span>
              <img src="/leaders/mawanda.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            </div>
            <div className="w-full">
              <h4 className="font-bold text-plu-green text-lg">Hon. Michael Mawanda</h4>
              <p className="text-xs font-semibold text-plu-slate mb-3">Director of Mobilisation - MP Igara East</p>
              <p className="text-sm text-plu-slate text-left">Hon. Michael Mawanda, Member of Parliament for Igara East, serves as Director of Mobilisation.</p>
            </div>
          </article>
          <article className="p-6 border border-gray-200 bg-white rounded-xl flex flex-col items-center text-center gap-3">
            <div className="relative w-48 h-48 rounded-xl overflow-hidden bg-plu-green text-white font-extrabold text-4xl flex items-center justify-center flex-none">
              <span className="absolute"><img src="/leaders/HB.jpg" className="w-full h-full object-cover" alt="Henry Basaliza" /></span>
              <img src="/leaders/basaliza.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            </div>
            <div className="w-full">
              <h4 className="font-bold text-plu-green text-lg">Owek. Henry Basaliza</h4>
              <p className="text-xs font-semibold text-plu-slate mb-3">Deputy Director Mobilisation - Dep. Prime Minister, Tooro Kingdom / Min. of Foreign Affairs and Inter-kingdom Relations</p>
              <p className="text-sm text-plu-slate text-left">Henry Basaliza is a Central Committee member with roots in the Rwenzori sub-region.</p>
            </div>
          </article>
          <article className="p-6 border border-gray-200 bg-white rounded-xl flex flex-col items-center text-center gap-3">
            <div className="relative w-48 h-48 rounded-xl overflow-hidden bg-plu-green text-white font-extrabold text-4xl flex items-center justify-center flex-none">
              <span className="absolute"><img src="/leaders/JO.jpg" className="w-full h-full object-cover" alt="Jacob Oboth-Oboth" /></span>
              <img src="/leaders/oboth.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            </div>
            <div className="w-full">
              <h4 className="font-bold text-plu-green text-lg">Rt. Hon. Jacob Oboth-Oboth</h4>
              <p className="text-xs font-semibold text-plu-slate mb-3">CEC Special Nominee to Parliament - Speaker of Parliament</p>
              <p className="text-sm text-plu-slate text-left">Rt. Hon. Jacob Oboth-Oboth serves as Speaker of the 12th Parliament of Uganda and sits on the PLU Central Committee.</p>
            </div>
          </article>
          <article className="p-6 border border-gray-200 bg-white rounded-xl flex flex-col items-center text-center gap-3">
            <div className="relative w-48 h-48 rounded-xl overflow-hidden bg-plu-green text-white font-extrabold text-4xl flex items-center justify-center flex-none">
              <span className="absolute"><img src="/leaders/TT.jpg" className="w-full h-full object-cover" alt="Thomas Tayebwa" /></span>
              <img src="/leaders/tayebwa.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            </div>
            <div className="w-full">
              <h4 className="font-bold text-plu-green text-lg">Rt. Hon. Thomas Tayebwa</h4>
              <p className="text-xs font-semibold text-plu-slate mb-3">Special Nominee to Parliament - Deputy Speaker of Parliament</p>
              <p className="text-sm text-plu-slate text-left">Rt. Hon. Thomas Tayebwa, Deputy Speaker of the 12th Parliament, is a member of the Central Committee.</p>
            </div>
          </article>
          <article className="p-6 border border-gray-200 bg-white rounded-xl flex flex-col items-center text-center gap-3">
            <div className="relative w-48 h-48 rounded-xl overflow-hidden bg-plu-green text-white font-extrabold text-4xl flex items-center justify-center flex-none">
              <span className="absolute"><img src="/leaders/JR.jpg" className="w-full h-full object-cover" alt="Jane Ruth Aceng" /></span>
              <img src="/leaders/aceng.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            </div>
            <div className="w-full">
              <h4 className="font-bold text-plu-green text-lg">Hon. Dr. Jane Ruth Aceng</h4>
              <p className="text-xs font-semibold text-plu-slate mb-3">Government Chief Whip</p>
              <p className="text-sm text-plu-slate text-left">Dr. Ruth Aceng is a distinguished Ugandan medical doctor, public health specialist, and politician dedicated to transforming Uganda's healthcare system.</p>
            </div>
          </article>
          <article className="p-6 border border-gray-200 bg-white rounded-xl flex flex-col items-center text-center gap-3">
            <div className="relative w-48 h-48 rounded-xl overflow-hidden bg-plu-green text-white font-extrabold text-4xl flex items-center justify-center flex-none">
              <span className="absolute"><img src="/leaders/ST.jpg" className="w-full h-full object-cover" alt="Sanjay Tanna" /></span>
              <img src="/leaders/tanna.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            </div>
            <div className="w-full">
              <h4 className="font-bold text-plu-green text-lg">Hon. Sanjay Tanna</h4>
              <p className="text-xs font-semibold text-plu-slate mb-3">Minister of Trade, Industry and Cooperatives</p>
              <p className="text-sm text-plu-slate text-left">Hon. Sanjay Tanna's name rings across many homesteads, businesses, political groupings and social circles.</p>
            </div>
          </article>
          <article className="p-6 border border-gray-200 bg-white rounded-xl flex flex-col items-center text-center gap-3">
            <div className="relative w-48 h-48 rounded-xl overflow-hidden bg-plu-green text-white font-extrabold text-4xl flex items-center justify-center flex-none">
              <span className="absolute"><img src="/leaders/HK.jpg" className="w-full h-full object-cover" alt="Hussein Kashillingi" /></span>
              <img src="/leaders/kashillingi.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            </div>
            <div className="w-full">
              <h4 className="font-bold text-plu-green text-lg">Hussein Kashillingi</h4>
              <p className="text-xs font-semibold text-plu-slate mb-3">Central Committee Member</p>
              <p className="text-sm text-plu-slate text-left">Hussein Kashillingi, Senior Presidential Advisor on Legal Matters and Vice President of the International Lawyers Network, serves on the Central Committee.</p>
            </div>
          </article>
          <article className="p-6 border border-gray-200 bg-white rounded-xl flex flex-col items-center text-center gap-3">
            <div className="relative w-48 h-48 rounded-xl overflow-hidden bg-plu-green text-white font-extrabold text-4xl flex items-center justify-center flex-none">
              <span className="absolute"><img src="/leaders/AK.jpg" className="w-full h-full object-cover" alt="Alan Kasujja" /></span>
              <img src="/leaders/kasujja.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            </div>
            <div className="w-full">
              <h4 className="font-bold text-plu-green text-lg">Alan Kasujja</h4>
              <p className="text-xs font-semibold text-plu-slate mb-3">Central Committee Member</p>
              <p className="text-sm text-plu-slate text-left">Alan Kasujja, Executive Director of the Uganda Media Centre and internationally recognised broadcaster, serves on the Central Committee.</p>
            </div>
          </article>
          <article className="p-6 border border-gray-200 bg-white rounded-xl flex flex-col items-center text-center gap-3">
            <div className="relative w-48 h-48 rounded-xl overflow-hidden bg-plu-green text-white font-extrabold text-4xl flex items-center justify-center flex-none">
              <span className="absolute"><img src="/leaders/DK.jpg" className="w-full h-full object-cover" alt="David Kabanda" /></span>
              <img src="/leaders/kabanda.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            </div>
            <div className="w-full">
              <h4 className="font-bold text-plu-green text-lg">Hon. David Kabanda</h4>
              <p className="text-xs font-semibold text-plu-slate mb-3">Central Committee Member - MP Kasambya County</p>
              <p className="text-sm text-plu-slate text-left">Hon. David Kabanda, Member of Parliament for Kasambya County and former PLU Secretary General, remains part of the Central Committee.</p>
            </div>
          </article>
          <article className="p-6 border border-gray-200 bg-white rounded-xl flex flex-col items-center text-center gap-3">
            <div className="relative w-48 h-48 rounded-xl overflow-hidden bg-plu-green text-white font-extrabold text-4xl flex items-center justify-center flex-none">
              <span className="absolute"><img src="/leaders/KR.jpg" className="w-full h-full object-cover" alt="Kwame Ruyondo" /></span>
              <img src="/leaders/ruyondo.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            </div>
            <div className="w-full">
              <h4 className="font-bold text-plu-green text-lg">Kwame Ruyondo</h4>
              <p className="text-xs font-semibold text-plu-slate mb-3">Central Committee Member</p>
              <p className="text-sm text-plu-slate text-left">Kwame Ruyondo serves as the Central Committee Representative for National Resistance Army (NRA) Historicals.</p>
            </div>
          </article>
          <article className="p-6 border border-gray-200 bg-white rounded-xl flex flex-col items-center text-center gap-3">
            <div className="relative w-48 h-48 rounded-xl overflow-hidden bg-plu-green text-white font-extrabold text-4xl flex items-center justify-center flex-none">
              <span className="absolute"><img src="/leaders/GK.jpg" className="w-full h-full object-cover" alt="Godfrey Baluku" /></span>
              <img src="/leaders/baluku.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            </div>
            <div className="w-full">
              <h4 className="font-bold text-plu-green text-lg">Hon. Kabbyanga Godfrey Baluku</h4>
              <p className="text-xs font-semibold text-plu-slate mb-3">Central Committee Member</p>
              <p className="text-sm text-plu-slate text-left">Hon. Godfrey Kabbyanga Baluku brings significant leadership and public service experience to the Patriotic League of Uganda.</p>
            </div>
          </article>
        </div>
        <div className="space-y-3">
          <div className="flex items-baseline gap-3 border-b-2 border-plu-green/20 pb-2">
            <span className="font-extrabold text-plu-gold">04</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-plu-slate font-bold">Leadership tier</span>
            <h3 className="font-extrabold text-plu-green">Commissioners</h3>
            <span className="text-xs text-plu-slate ml-auto">2 profiles</span>
          </div>
          <article className="p-6 border border-gray-200 bg-white rounded-xl flex flex-col items-center text-center gap-3">
            <div className="relative w-48 h-48 rounded-xl overflow-hidden bg-plu-green text-white font-extrabold text-4xl flex items-center justify-center flex-none">
              <span className="absolute"><img src="/leaders/SR.jpg" className="w-full h-full object-cover" alt="Steven Rutasharara" /></span>
              <img src="/leaders/rutasharara.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            </div>
            <div className="w-full">
              <h4 className="font-bold text-plu-green text-lg">Mr. Steven Rutasharara</h4>
              <p className="text-xs font-semibold text-plu-slate mb-3">Commissioner for External Affairs</p>
              <p className="text-sm text-plu-slate text-left">Mr. Steven Rutasharara is the Commissioner for External Affairs and External Mobilization for the Patriotic League of Uganda (PLU).</p>
            </div>
          </article>
          <article className="p-6 border border-gray-200 bg-white rounded-xl flex flex-col items-center text-center gap-3">
            <div className="relative w-48 h-48 rounded-xl overflow-hidden bg-plu-green text-white font-extrabold text-4xl flex items-center justify-center flex-none">
              <span className="absolute"><img src="/leaders/RK.jpg" className="w-full h-full object-cover" alt="Ronnie Kananura" /></span>
              <img src="/leaders/kananura.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            </div>
            <div className="w-full">
              <h4 className="font-bold text-plu-green text-lg">Ronnie Kananura</h4>
              <p className="text-xs font-semibold text-plu-slate mb-3">Deputy Commissioner for External Affairs</p>
              <p className="text-sm text-plu-slate text-left">Ronnie Kananura is the Deputy Commissioner for External Affairs at the Patriotic League of Uganda. His work focuses on strategic partnerships, international outreach, diaspora engagement and cross-border policy coordination.</p>
            </div>
          </article>
        </div>
</div>


        {/* SUPPORT TEAMS */}
        <div>
          <div className="text-center mb-8">
            <p className="text-[10px] uppercase tracking-[0.25em] text-plu-slate font-bold mb-3">Behind the scenes</p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-plu-black">Support Teams</h2>
            <p className="text-sm text-plu-slate mt-2 max-w-xl mx-auto">The specialist teams that keep PLU's operations running day to day.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-card border border-plu-black/10 p-5">
              <p className="text-[10px] uppercase tracking-wider text-plu-slate font-semibold mb-3">Administration & Secretariat</p>
              <ul className="space-y-2 text-sm">
                <li><span className="font-bold text-plu-black">Counsel Natamba Pascal</span><span className="text-plu-slate"> - Administrator</span></li>
                <li><span className="font-bold text-plu-black">Mr. Simon Raymond Kadooli</span><span className="text-plu-slate"> - Administrator</span></li>
              </ul>
            </div>
            <div className="bg-white rounded-card border border-plu-black/10 p-5">
              <p className="text-[10px] uppercase tracking-wider text-plu-slate font-semibold mb-3">Communications & Media</p>
              <ul className="space-y-2 text-sm"><li><span className="font-bold text-plu-black">Mr. Frank Mwesigye</span></li></ul>
            </div>
            <div className="bg-white rounded-card border border-plu-black/10 p-5">
              <p className="text-[10px] uppercase tracking-wider text-plu-slate font-semibold mb-3">Protocol</p>
              <ul className="space-y-2 text-sm"><li><span className="font-bold text-plu-black">Mr. Mafaari N. Edson Ruheemba</span><span className="text-plu-slate"> - Head of Protocol</span></li></ul>
            </div>
            <div className="bg-white rounded-card border border-plu-black/10 p-5">
              <p className="text-[10px] uppercase tracking-wider text-plu-slate font-semibold mb-3">Research, Monitoring & Evaluation</p>
              <ul className="space-y-2 text-sm"><li><span className="font-bold text-plu-black">Mr. Peter Opio Lugai</span></li></ul>
            </div>
          </div>
        </div>

{/* 96,207+ - split layout */}
        <div className="bg-plu-yellow rounded-card p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-plu-black/60 font-bold mb-1">Membership</p>
            <p className="text-5xl md:text-6xl font-extrabold text-plu-black">96,207+</p>
            <p className="text-sm text-plu-black/70 mt-1">registered Patriotic Cadres and growing</p>
          </div>
          <p className="text-[10px] text-plu-black/50 max-w-[200px] leading-relaxed">Source: plu.org.ug (accessed 26 Nov 2026). Published cumulative figure, not a live count from this app.</p>
        </div>

        {/* CONTACT */}
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-[0.25em] text-plu-slate font-bold mb-3">Contact</p>
          <h2 className="text-2xl md:text-3xl font-extrabold text-plu-black">Contact Us</h2>
          <div className="bg-white rounded-card border border-plu-black/10 p-6 mt-4 max-w-md mx-auto">
            <p className="font-semibold text-plu-black">Saddler Lane, Plot 7, Naguru, Kampala</p>
            <a href="tel:0414675689" className="text-sm text-plu-slate mt-2 inline-block underline">Tel: 0414675689</a>
          </div>
        </div>

      </section>
</div>
);
}












