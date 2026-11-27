import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../store/auth";
import { Button, Alert } from "../../ui";

// ============================================================
// PLU PARTY PALETTE
// ============================================================
const CARD_BG = "/card-bg.png";
const W = 338;
const H = 213;
const GOLD = "#FFC400";
const GOLD_LIGHT = "#FFD740";
const RED = "#DC0A0A";
const BLACK = "#000000";
const WHITE = "#FFFFFF";
const TEXT_DARK = "#1A1A1A";
const TEXT_MUTED = "#5A4A2A";

function pad(n) { return String(n).padStart(2, "0"); }
function fmtDate(d) {
  if (!d) return "----------";
  const dt = new Date(d);
  if (isNaN(dt)) return "----------";
  const months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
  return pad(dt.getDate()) + " " + months[dt.getMonth()] + " " + dt.getFullYear();
}
function calcAge(d) {
  if (!d) return null;
  const dob = new Date(d);
  if (isNaN(dob)) return null;
  return Math.floor((Date.now() - dob.getTime()) / (1000 * 60 * 60 * 24 * 365.25));
}
function maskPhone(p) {
  if (!p) return "----------";
  const s = String(p);
  if (s.length < 6) return s;
  return s.slice(0, 4) + " XXX " + s.slice(-3);
}
function pretty(v) {
  if (!v) return "----------";
  return String(v).replace(/_/g, " ");
}

function F({ label, value, mono, light }) {
  return (
    <div style={{ minWidth: 0 }}>
      <div style={{
        fontSize: "6px", fontWeight: 700,
        color: light ? "rgba(255,255,255,0.7)" : TEXT_MUTED,
        letterSpacing: "0.4px", textTransform: "uppercase",
        marginBottom: "1px", lineHeight: 1.1,
      }}>{label}</div>
      <div className={mono ? "font-mono" : ""} style={{
        fontSize: "10.5px", fontWeight: 900,
        color: light ? WHITE : TEXT_DARK,
        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        lineHeight: 1.15,
      }}>{value || "—"}</div>
    </div>
  );
}

export default function DigitalCard() {
  const nav = useNavigate();
  const { member } = useAuth();
  const [flipped, setFlipped] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");

  if (!member) {
    return (
      <div className="max-w-lg mx-auto">
        <Alert tone="warning" title="Not signed in">Please sign in to view your digital membership card.</Alert>
        <div className="mt-4 flex justify-center">
          <Button variant="yellow" onClick={() => nav("/login")}>Go to Sign in</Button>
        </div>
      </div>
    );
  }

  const issued = member.createdAt || new Date().toISOString();
  const age = calcAge(member.dateOfBirth);
  const statusBg = member.status === "ACTIVE" ? "#15803D" : (member.status === "SUSPENDED" || member.status === "REJECTED") ? "#B91C1C" : "#D97706";

  async function downloadPng() {
    setError(""); setDownloading(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const el = document.getElementById("plu-id-card");
      const canvas = await html2canvas(el, { backgroundColor: GOLD, scale: 4, useCORS: true, logging: false });
      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/png");
      a.download = "PLU-card-" + member.pcNumber + ".png";
      a.click();
    } catch { setError("Could not save PNG."); }
    finally { setDownloading(false); }
  }

  const photoSrc = member.photoPath && member.photoPath.indexOf("/uploads/") === 0 ? member.photoPath : null;
  const initials = (member.name || "?").split(/\s+/).map(w => (w[0] || "").toUpperCase()).slice(0, 2).join("");

  // ============================================================
  // CARD SHELL — Party colors + background image
  //   Layer 1: BG image
  //   Layer 2: white gradient overlay for readability
  //   Layer 3: content (black top bar, white body, black bottom bar)
  // ============================================================
  const shell = (content) => (
    <div style={{
      position: "absolute", inset: 0,
      borderRadius: "10px",
      overflow: "hidden",
      border: "3px solid " + GOLD,
      boxShadow: "0 12px 32px rgba(255,196,0,0.45)",
      backgroundColor: GOLD,
    }}>
      {/* Layer 1: image */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "url(" + CARD_BG + ")",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }} />
      {/* Layer 2: readability overlay — soft white, preserves image hints */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.78) 50%, rgba(255,255,255,0.55) 100%)",
      }} />
      {/* Layer 3: content */}
      <div style={{ position: "relative", zIndex: 1, height: "100%", display: "flex", flexDirection: "column" }}>
        {content}
      </div>
    </div>
  );

  return (
    <main className="max-w-2xl mx-auto space-y-6 pb-8">
      <header className="text-center">
        <h1 className="text-xl md:text-2xl font-extrabold" style={{ color: TEXT_DARK }}>Digital Membership Card</h1>
      </header>

      {error && <Alert tone="error" title="Action failed">{error}</Alert>}

      <div className="flex justify-center" style={{ perspective: "1500px" }}>
        <div
          id="plu-id-card"
          role="button"
          tabIndex="0"
          aria-label="Membership card. Tap to flip."
          onClick={() => setFlipped(v => !v)}
          onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setFlipped(v => !v); } }}
          style={{
            position: "relative",
            width: W + "px",
            height: H + "px",
            cursor: "pointer",
            transformStyle: "preserve-3d",
            transition: "transform 0.7s cubic-bezier(0.4, 0.2, 0.2, 1)",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* ==================== FRONT ==================== */}
          <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden" }}>
            {shell(
              <>
                {/* TOP BLACK BAR with gold text + red accent */}
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "5px 10px",
                  background: BLACK,
                  borderBottom: "3px solid " + RED,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <img src="/plu-logo-circle.png" alt="" style={{ width: "24px", height: "24px", borderRadius: "50%", border: "2px solid " + GOLD, background: WHITE }} onError={(e) => { e.currentTarget.style.display = "none"; }} />
                    <div style={{ lineHeight: 1.1 }}>
                      <div style={{ fontSize: "8px", fontWeight: 900, color: GOLD, letterSpacing: "0.4px", textTransform: "uppercase" }}>Patriotic League of Uganda</div>
                      <div style={{ fontSize: "6.5px", fontWeight: 700, color: RED, letterSpacing: "0.3px" }}>Republic of Uganda</div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right", lineHeight: 1.1 }}>
                    <div style={{ fontSize: "6px", fontWeight: 700, color: GOLD, textTransform: "uppercase", letterSpacing: "0.4px" }}>Membership Card</div>
                    <div style={{ fontSize: "7px", fontWeight: 900, color: WHITE }}>v1.0</div>
                  </div>
                </div>

                {/* GOLD NIN BAND with red left accent */}
                <div style={{
                  display: "flex", alignItems: "center",
                  background: GOLD,
                  borderBottom: "2px solid " + BLACK,
                  borderLeft: "6px solid " + RED,
                  padding: "3px 10px 3px 6px",
                  lineHeight: 1.1,
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "6px", fontWeight: 900, color: TEXT_DARK, letterSpacing: "1px", textTransform: "uppercase" }}>National Identification Number</div>
                    <div className="font-mono" style={{ fontSize: "15px", fontWeight: 900, color: BLACK, letterSpacing: "1.6px", lineHeight: 1.15 }}>{member.identityNumber || "----------"}</div>
                  </div>
                  <div style={{ fontSize: "6px", fontWeight: 900, color: RED, textAlign: "right", textTransform: "uppercase", letterSpacing: "0.3px" }}>
                    PLU<br/>Mobi
                  </div>
                </div>

                {/* BODY: photo + details — image shows through softly */}
                <div style={{ display: "flex", gap: "8px", padding: "6px 10px", flex: 1, minHeight: 0 }}>
                  <div style={{ flexShrink: 0, textAlign: "center" }}>
                    <div style={{
                      width: "62px", height: "78px",
                      background: "#EEE",
                      border: "2px solid " + GOLD,
                      outline: "2px solid " + BLACK,
                      borderRadius: "3px",
                      overflow: "hidden",
                      boxShadow: "0 3px 10px rgba(0,0,0,0.2)",
                    }}>
                      {photoSrc
                        ? <img src={photoSrc} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", fontWeight: 900, color: TEXT_MUTED }}>{initials || "?"}</div>
                      }
                    </div>
                    <div className="font-mono" style={{ fontSize: "6px", fontWeight: 900, color: TEXT_DARK, marginTop: "2px" }}>{member.pcNumber || "—"}</div>
                  </div>

                  <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "3px" }}>
                    <div>
                      <div style={{ fontSize: "6px", fontWeight: 900, color: RED, letterSpacing: "0.4px", textTransform: "uppercase" }}>Full Name</div>
                      <div style={{ fontSize: "13px", fontWeight: 900, color: BLACK, lineHeight: 1.05, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{member.name || "Member"}</div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3px 8px" }}>
                      <F label="PC Number" value={member.pcNumber} mono />
                      <F label="Pathway" value={member.pathway} />
                      <F label="Sex" value={pretty(member.sex)} />
                      <F label="Date of Birth" value={fmtDate(member.dateOfBirth)} mono />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "3px 5px", paddingTop: "3px", borderTop: "2px solid " + GOLD }}>
                      <F label="District" value={member.location} />
                      <F label="Sub-county" value={member.subCounty} />
                      <F label="Village" value={member.village} />
                    </div>
                  </div>
                </div>

                {/* BOTTOM BLACK BAR with gold status pill */}
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "5px 10px",
                  background: BLACK,
                  borderTop: "3px solid " + RED,
                }}>
                  <div style={{ background: statusBg, color: WHITE, padding: "2px 8px", borderRadius: "3px", fontSize: "7.5px", fontWeight: 900, letterSpacing: "0.5px" }}>
                    {member.status || "TENTATIVE"}
                  </div>
                  <div style={{ fontSize: "7px", fontWeight: 700, color: GOLD }}>
                    Issued: {fmtDate(issued)}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* ==================== BACK ==================== */}
          <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
            {shell(
              <>
                {/* TOP BLACK BAR */}
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "5px 10px",
                  background: BLACK,
                  borderBottom: "3px solid " + GOLD,
                }}>
                  <span className="font-mono" style={{ fontSize: "8px", fontWeight: 800, color: GOLD }}>
                    PLU.MOB-{member.pcNumber || "?????"}
                  </span>
                  <span style={{ fontSize: "8px", fontWeight: 900, color: RED, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Republic of Uganda
                  </span>
                </div>

                {/* DATA GRID on light panel */}
                <div style={{
                  display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
                  gap: "5px 8px",
                  padding: "8px 10px",
                  flex: 1,
                  background: "rgba(255,255,255,0.85)",
                }}>
                  <F label="National ID" value={member.identityNumber} mono />
                  <F label="Age" value={age != null ? age + " years" : null} />
                  <F label="Date of Birth" value={fmtDate(member.dateOfBirth)} mono />
                  <F label="Sex" value={pretty(member.sex)} />
                  <F label="Marital" value={pretty(member.maritalStatus)} />
                  <F label="Occupation" value={member.occupation} />
                  <F label="Phone" value={maskPhone(member.phone)} mono />
                  <F label="Email" value={member.email} />
                  <F label="Member Since" value={fmtDate(issued)} mono />
                </div>

                {/* BOTTOM BLACK BAR */}
                <div style={{
                  display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px",
                  padding: "5px 10px",
                  background: BLACK,
                  borderTop: "3px solid " + GOLD,
                }}>
                  <div>
                    <div style={{ fontSize: "6px", fontWeight: 900, color: GOLD, textTransform: "uppercase", marginBottom: "1px", letterSpacing: "0.3px" }}>If found, return to:</div>
                    <div style={{ fontSize: "5.5px", fontWeight: 700, color: WHITE, lineHeight: 1.25 }}>Patriotic League of Uganda</div>
                    <div style={{ fontSize: "5.5px", color: "rgba(255,255,255,0.75)", lineHeight: 1.25 }}>Plot 7 Saddler Lane, Naguru, Kampala</div>
                    <div style={{ fontSize: "5.5px", color: "rgba(255,255,255,0.75)", lineHeight: 1.25 }}>Tel: 0414675698</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "6px", fontWeight: 900, color: GOLD, textTransform: "uppercase", marginBottom: "1px", letterSpacing: "0.3px" }}>This card</div>
                    <div style={{ fontSize: "5.5px", fontWeight: 700, color: WHITE, lineHeight: 1.25 }}>Property of PLU</div>
                    <div style={{ fontSize: "5.5px", color: "rgba(255,255,255,0.75)", lineHeight: 1.25 }}>Non-transferable</div>
                    <div style={{ fontSize: "5px", color: RED, lineHeight: 1.25, fontStyle: "italic" }}>Prototype — not a government ID</div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Button variant="yellow" onClick={downloadPng} loading={downloading}>
          {downloading ? "Generating..." : "Download PNG"}
        </Button>
        <button onClick={() => window.print()} className="inline-flex items-center justify-center min-h-[44px] px-4 py-3 rounded-xl font-semibold text-sm md:text-base bg-white border border-plu-black/10 text-plu-black hover:bg-plu-black/[0.04] transition-colors">Print card</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Link to="/dashboard" className="inline-flex items-center justify-center min-h-[44px] px-4 py-3 rounded-xl font-semibold text-sm md:text-base bg-white border border-plu-black/10 text-plu-black hover:bg-plu-black/[0.04] transition-colors">Back to Dashboard</Link>
        <Link to="/dashboard/my-data" className="inline-flex items-center justify-center min-h-[44px] px-4 py-3 rounded-xl font-semibold text-sm md:text-base bg-white border border-plu-black/10 text-plu-black hover:bg-plu-black/[0.04] transition-colors">Manage my data</Link>
      </div>
    </main>
  );
}
