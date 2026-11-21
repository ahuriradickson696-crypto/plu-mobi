import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";

export default function Header() {
  const nav = useNavigate();
  const { token, member, clear } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu on outside click or Escape
  useEffect(() => {
    function onDown(e) {
      if (menuOpen && menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    function onKey(e) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  function signOut() {
    setMenuOpen(false);
    if (window.confirm("Are you sure you want to sign out?")) {
      clear();
      nav("/");
    }
  }

  const statusLabel = member?.status === "ACTIVE"
    ? "Active"
    : member?.status === "SUSPENDED"
    ? "Suspended"
    : "Pending";

  const statusTone = member?.status === "ACTIVE"
    ? "bg-emerald-400/20 text-emerald-300 border-emerald-400/40"
    : member?.status === "SUSPENDED"
    ? "bg-red-400/20 text-red-300 border-red-400/40"
    : "bg-amber-400/20 text-amber-300 border-amber-400/40";

  return (
    <header className="sticky top-0 z-40 shadow-xl">
      {/* Base gradient bar */}
      <div className="bg-gradient-to-r from-plu-black via-[#1a1a1a] to-plu-black text-white">
        <div className="max-w-3xl md:max-w-5xl lg:max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-3 md:py-4 flex items-center justify-between gap-3">
          {/* Left: logo + brand */}
          <Link
            to="/"
            className="flex items-center gap-3 no-underline group shrink-0"
          >
            <div className="relative">
              <img
                src="/plu-logo-circle.png"
                alt="PLU"
                className="h-11 w-11 md:h-14 md:w-14 rounded-full object-cover border-2 border-plu-yellow shadow-lg ring-2 ring-plu-yellow/20 transition-all duration-300 group-hover:scale-105 group-hover:ring-plu-yellow/50 group-hover:shadow-[0_0_20px_rgba(255,209,0,0.4)]"
                onError={(e) => { e.currentTarget.style.display = "none"; }}
              />
              {member && (
                <span
                  aria-label={`Status: ${statusLabel}`}
                  className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-plu-black ${member.status === "ACTIVE" ? "bg-emerald-400" : member.status === "SUSPENDED" ? "bg-red-400" : "bg-amber-400"}`}
                />
              )}
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-extrabold tracking-tight text-base md:text-xl text-white">
                PLU Mobi
              </span>
              <span className="text-[10px] md:text-xs text-plu-yellow font-semibold tracking-wide">
                Patriotic League of Uganda
              </span>
            </div>
          </Link>

          {/* Right: actions */}
          <div className="flex items-center gap-2 md:gap-3">
            {token && member ? (
              <>
                {/* Status chip — visible on md+ */}
                <span
                  className={`hidden md:inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border ${statusTone}`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  {statusLabel}
                </span>

                {/* PC number — monospace, subtle */}
                <span className="hidden lg:inline text-white/60 font-mono text-xs">
                  {member.pcNumber}
                </span>

                {/* Avatar menu */}
                <div className="relative" ref={menuRef}>
                  <button
                    type="button"
                    onClick={() => setMenuOpen((v) => !v)}
                    aria-haspopup="menu"
                    aria-expanded={menuOpen}
                    aria-label="Account menu"
                    className="flex items-center gap-1.5 text-xs font-semibold text-plu-yellow bg-white/10 hover:bg-white/20 px-2.5 md:px-3 py-1.5 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-plu-yellow/60"
                  >
                    <span className="hidden sm:inline truncate max-w-[80px] md:max-w-[120px]">
                      {member.name?.split(" ")[0] || "Account"}
                    </span>
                    <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor" className={`transition-transform ${menuOpen ? "rotate-180" : ""}`} aria-hidden>
                      <path d="M5.5 7.5L10 12l4.5-4.5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>

                  {menuOpen && (
                    <div
                      role="menu"
                      className="absolute right-0 mt-2 w-56 bg-white text-plu-black rounded-xl shadow-2xl border border-black/10 overflow-hidden z-50 animate-in"
                    >
                      <div className="px-4 py-3 border-b border-black/5 bg-plu-yellow/10">
                        <p className="text-xs text-plu-slate font-semibold uppercase tracking-widest">
                          Signed in
                        </p>
                        <p className="text-sm font-extrabold text-plu-black truncate">
                          {member.name || "Member"}
                        </p>
                        <p className="text-xs font-mono text-plu-slate">
                          {member.pcNumber}
                        </p>
                      </div>
                      <Link
                        to="/dashboard"
                        className="block px-4 py-2.5 text-sm font-semibold hover:bg-plu-yellow/20 transition-colors"
                        role="menuitem"
                        onClick={() => setMenuOpen(false)}
                      >
                        My Dashboard
                      </Link>                      {member?.isAdmin && (
                        <Link
                          to="/admin/users"
                          className="block px-4 py-2.5 text-sm font-semibold hover:bg-plu-yellow/20 transition-colors border-t border-black/5"
                          role="menuitem"
                          onClick={() => setMenuOpen(false)}
                        >
                          Admin Panel
                        </Link>
                      )}
                      <Link
                        to="/events"
                        className="block px-4 py-2.5 text-sm font-semibold hover:bg-plu-yellow/20 transition-colors"
                        role="menuitem"
                        onClick={() => setMenuOpen(false)}
                      >
                        Events
                      </Link>
                      <button
                        onClick={signOut}
                        className="w-full text-left px-4 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-50 transition-colors border-t border-black/5"
                        role="menuitem"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-xs md:text-sm font-semibold text-white/80 hover:text-white px-2 md:px-3 py-1.5 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-xs md:text-sm font-bold text-plu-black bg-plu-yellow hover:brightness-110 px-3 md:px-4 py-1.5 md:py-2 rounded-lg shadow transition-all"
                >
                  Join PLU
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Bottom accent line — subtle yellow brand rule */}
      <div className="h-0.5 bg-gradient-to-r from-transparent via-plu-yellow to-transparent" />

      {/* Small CSS animation for menu dropdown */}
      <style>{`
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-in { animation: fadeSlide 0.15s ease-out; }
        @media (prefers-reduced-motion: reduce) {
          .animate-in { animation: none !important; }
        }
      `}</style>
    </header>
  );
}

