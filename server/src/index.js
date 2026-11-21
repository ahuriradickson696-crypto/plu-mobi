import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
dotenv.config();

// ============ BOOT GUARDRAILS (fail fast, fail loud) ============
const isProd = process.env.NODE_ENV === "production";

if (!process.env.JWT_SECRET) {
  console.error("FATAL: JWT_SECRET is not set. Refusing to start.");
  process.exit(1);
}
if (isProd && process.env.JWT_SECRET.length < 32) {
  console.error(
    "FATAL: JWT_SECRET must be at least 32 characters in production (current: " +
      process.env.JWT_SECRET.length +
      "). Refusing to start."
  );
  process.exit(1);
}
if (isProd && process.env.PROTOTYPE_MODE === "true") {
  console.warn(
    "WARNING: PROTOTYPE_MODE=true in production. This should only be enabled for demos."
  );
}
const saltRounds = Number(process.env.PIN_SALT_ROUNDS || 10);
if (saltRounds < 12) {
  console.warn(
    `WARNING: PIN_SALT_ROUNDS=${saltRounds} is below OWASP 2024 recommendation (12). ` +
      `Existing PINs will be transparently upgraded on next login once you raise it.`
  );
}
// ================================================================

import authRoutes from "./routes/auth.js";
import memberRoutes from "./routes/members.js";
import verifyRoutes from "./routes/verify.js";
import endorsementRoutes from "./routes/endorsements.js";
import officerRoutes from "./routes/officers.js";
import auditRoutes from "./routes/audit.js";
import adminRoutes from "./routes/admin.js";
import reviewRoutes from "./routes/review.js";
import corruptionRoutes from "./routes/corruption.js";
import eventsRoutes from "./routes/events.js";
import pushRoutes from "./routes/push.js";
import reportingRoutes from "./routes/reporting.js";

const app = express();

// Trust the first proxy hop (Render / nginx / Cloudflare).
// Without this, req.ip is the proxy IP and rate limiting is useless in prod.
app.set("trust proxy", 1);

// Security headers (CSP off for now — SPA needs to be re-verified before we enable it)
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" }, // allow images from client origin
  })
);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (
        origin.startsWith("http://localhost:") ||
        origin.startsWith("http://127.0.0.1:")
      ) {
        return callback(null, true);
      }
      if (process.env.CLIENT_URL && origin === process.env.CLIENT_URL) {
        return callback(null, true);
      }
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "100kb" }));

app.get("/api/health", (_req, res) =>
  res.json({
    ok: true,
    prototype: process.env.PROTOTYPE_MODE === "true",
    env: process.env.NODE_ENV || "development",
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/verify", verifyRoutes);
app.use("/api/endorsements", endorsementRoutes);
app.use("/api/officers", officerRoutes);
app.use("/api/audit", auditRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/corruption", corruptionRoutes);
app.use("/api/events", eventsRoutes);
app.use("/api/push", pushRoutes);
app.use("/api/reporting", reportingRoutes);

// Global error handler
app.use((err, _req, res, _next) => {
  if (err?.name === "ZodError") {
    return res.status(400).json({ error: "Validation failed", details: err.issues });
  }
  if (err?.message === "Not allowed by CORS") {
    return res.status(403).json({ error: "Origin not allowed" });
  }
  console.error(err);
  res.status(500).json({ error: "Server error" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`PLU Mobi API running on http://localhost:${PORT} (env=${process.env.NODE_ENV || "development"})`)
);

