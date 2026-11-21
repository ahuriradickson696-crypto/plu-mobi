import { useRef, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { useAuth } from "../../store/auth";
import { Button, Alert } from "../../ui";

/**
 * Digital Membership Card (S-11, S-12)
 * Satisfies FR-05 §5.6 of PLU Mobi Product Definition v1.1:
 *  - Shows PC number, name, status, photo
 *  - QR code leads to limited public verification (/verify?pc=PC-XXXXXX)
 *  - Downloadable as PNG
 *  - Shareable via Web Share API on supported devices
 */

const STATUS_LABEL = {
  ACTIVE:    { text: "Active member",   tone: "emerald" },
  TENTATIVE: { text: "Tentative — pending review", tone: "amber" },
  SUSPENDED: { text: "Suspended",       tone: "red" },
  REJECTED:  { text: "Rejected",        tone: "red" },
};

const STATUS_TONE = {
  emerald: "bg-emerald-100 text-emerald-900 border-emerald-300",
  amber:   "bg-amber-100 text-amber-900 border-amber-300",
  red:     "bg-red-100 text-red-900 border-red-300",
};

function pad(n) { return String(n).padStart(2, "0"); }
function fmtDate(d) {
  const dt = new Date(d);
  return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}`;
}

export default function DigitalCard() {
  const nav = useNavigate();
  const { member } = useAuth();
  const cardRef = useRef(null);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");
  const [shareSupported, setShareSupported] = useState(false);

  useEffect(() => {
    setShareSupported(typeof navigator !== "undefined" && "share" in navigator);
  }, []);

  if (!member) {
    return (
      <div className="max-w-lg mx-auto">
        <Alert tone="warning" title="Not signed in">
          Please sign in to view your digital membership card.
        </Alert>
        <div className="mt-4 flex justify-center">
          <Button variant="yellow" onClick={() => nav("/login")}>
            Go to Sign in
          </Button>
        </div>
      </div>
    );
  }

  const status = STATUS_LABEL[member.status] || STATUS_LABEL.TENTATIVE;
  const verifyUrl = `${window.location.origin}/verify?pc=${encodeURIComponent(member.pcNumber || "")}`;
  const issued = member.createdAt || new Date().toISOString();

  async function downloadPng() {
    setError("");
    setDownloading(true);
    try {
      // Dynamic import so we don't load html2canvas until needed
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#ffffff",
        scale: 3,
        useCORS: true,
        logging: false,
      });
      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = `PLU-card-${member.pcNumber}.png`;
      a.click();
    } catch (e) {
      setError("Could not generate PNG. Try the Share button or take a screenshot instead.");
    } finally {
      setDownloading(false);
    }
  }

  async function shareCard() {
    setError("");
    try {
      await navigator.share({
        title: `PLU Mobi — ${member.name}`,
        text: `My PLU membership — ${member.pcNumber}. Verify at ${verifyUrl}`,
        url: verifyUrl,
      });
    } catch (e) {
      if (e.name !== "AbortError") {
        setError("Share was cancelled or unavailable on this device.");
      }
    }
  }

  return (
    <main className="max-w-2xl mx-auto space-y-6 pb-8">
      <header className="text-center">
        <h1 className="text-xl md:text-2xl font-extrabold text-plu-black">
          Digital Membership Card
        </h1>
        <p className="text-sm text-plu-slate mt-1">
          Show this card when requested. The QR code links to a public verification.
        </p>
      </header>

      {error && <Alert tone="error" title="Action failed">{error}</Alert>}

      {/* ---------- THE CARD ---------- */}
      <div
        ref={cardRef}
        className="relative bg-gradient-to-br from-plu-black via-[#1f1f1f] to-plu-black text-white rounded-2xl shadow-2xl overflow-hidden"
        style={{ aspectRatio: "1.6 / 1", minHeight: "260px" }}
      >
        {/* Decorative yellow corner */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-plu-yellow/20 rounded-bl-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-plu-yellow/10 rounded-tr-full pointer-events-none" />

        <div className="relative p-5 md:p-6 h-full flex flex-col justify-between">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <img
                src="/plu-logo-circle.png"
                alt="PLU"
                className="h-12 w-12 md:h-14 md:w-14 rounded-full object-cover border-2 border-plu-yellow shadow-lg"
                onError={(e) => { e.currentTarget.style.display = "none"; }}
              />
              <div className="leading-tight">
                <p className="text-[10px] md:text-xs uppercase tracking-widest text-plu-yellow font-bold">
                  Patriotic League of Uganda
                </p>
                <p className="text-sm md:text-base font-extrabold">
                  Membership Card
                </p>
              </div>
            </div>
            <div className="hidden sm:block text-right">
              <p className="text-[9px] uppercase tracking-widest text-white/50">Issued</p>
              <p className="text-xs font-mono">{fmtDate(issued)}</p>
            </div>
          </div>

          {/* Body — name + PC number */}
          <div className="mt-4 flex items-end justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-[10px] uppercase tracking-widest text-white/50 mb-0.5">
                Cardholder
              </p>
              <p className="text-lg md:text-2xl font-extrabold truncate">
                {member.name || "Member"}
              </p>
              <p className="text-[10px] uppercase tracking-widest text-white/50 mt-2 mb-0.5">
                PC Number
              </p>
              <p className="text-base md:text-xl font-mono font-bold text-plu-yellow">
                {member.pcNumber || "—"}
              </p>
            </div>

            {/* QR code */}
            <div className="bg-white p-1.5 md:p-2 rounded-lg shrink-0">
              <QRCodeSVG
                value={verifyUrl}
                size={72}
                level="M"
                bgColor="#ffffff"
                fgColor="#111111"
              />
            </div>
          </div>

          {/* Status badge */}
          <div className="mt-4 flex items-center justify-between gap-2">
            <span
              className={`inline-flex items-center gap-1.5 text-[10px] md:text-xs font-bold px-2.5 py-1 rounded-full border ${STATUS_TONE[status.tone]}`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              {status.text}
            </span>
            <p className="text-[9px] uppercase tracking-widest text-white/40">
              plu.org.ug
            </p>
          </div>
        </div>
      </div>

      {/* ---------- Actions ---------- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Button
          variant="yellow"
          onClick={downloadPng}
          loading={downloading}
        >
          {downloading ? "Generating…" : "Download PNG"}
        </Button>

        {shareSupported ? (
          <Button variant="secondary" onClick={shareCard}>
            Share
          </Button>
        ) : (
          <Button variant="secondary" onClick={() => nav(`/verify?pc=${encodeURIComponent(member.pcNumber)}`)}>
            Open verification
          </Button>
        )}

        <Link
          to="/dashboard"
          className="inline-flex items-center justify-center min-h-[44px] px-4 py-3 rounded-xl font-semibold text-sm md:text-base bg-white border border-plu-black/10 text-plu-black hover:bg-plu-black/[0.04] transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-plu-black/30"
        >
          Back to Dashboard
        </Link>
      </div>

      {/* ---------- Notes ---------- */}
      <section className="text-xs text-plu-slate space-y-1 px-1">
        <p>
          <strong className="text-plu-black">Show this card</strong> when asked for proof of membership.
        </p>
        <p>
          <strong className="text-plu-black">QR code</strong> — anyone can scan it to see your public membership status at plu.org.ug-verify (no login required, no sensitive data shown).
        </p>
        <p>
          <strong className="text-plu-black">Tentative status</strong> — new members are Tentative pending administrative review. This does not limit participation.
        </p>
      </section>
    </main>
  );
}
