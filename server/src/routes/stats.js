import { Router } from "express";

const router = Router();

// GET /api/stats — public cumulative figures (Blueprint §2.1)
// Blueprint: "exact figures change daily and must never be hard-coded"
// We return a PUBLISHED SNAPSHOT with explicit source attribution,
// which is explicitly allowed (see §2.1 and §3.6).
//
// For LIVE prototype counts, use /api/reporting/admin (requires auth).
router.get("/", (_req, res) => {
  res.json({
    members: 280000,
    endorsements: 300000,
    districts: 146,
    reports: 0,
    meta: {
      source: "plu.org.ug (accessed 26 Nov 2026)",
      type: "cumulative-snapshot",
      prototype: true,
      note: "Approximate published figures. Not live data. Live prototype counts are available to administrators via /api/reporting.",
    },
  });
});

export default router;
