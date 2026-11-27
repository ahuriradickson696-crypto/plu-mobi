import { Router } from "express";
import prisma from "../lib/prisma.js";
import { requireAuth } from "../middleware/auth.js";
import { writeAudit } from "../lib/audit.js";

const router = Router();

// GET /api/privacy/access - data export
router.post("/access", requireAuth, async (req, res) => {
  try {
    const memberId = req.member.id;
    const [profile, consents, endorsements, reviews, tickets] = await Promise.all([
      prisma.member.findUnique({ where: { id: memberId } }),
      prisma.consent.findMany({ where: { memberId }, orderBy: { createdAt: "desc" } }),
      prisma.endorsement.findMany({ where: { memberId } }),
      prisma.reviewDecision.findMany({ where: { memberId }, orderBy: { createdAt: "desc" } }),
      prisma.correctionTicket.findMany({ where: { memberId }, orderBy: { createdAt: "desc" } }),
    ]);
    if (!profile) return res.status(404).json({ error: "Member not found" });
    const { pinHash, resetToken, resetExpires, ...safeProfile } = profile;
    await writeAudit({
      action: "PRIVACY_EXPORT",
      actorPc: req.member.pcNumber,
      targetPc: req.member.pcNumber,
      meta: {},
    });
    res.json({ profile: safeProfile, consents, endorsements, reviews, tickets });
  } catch (err) {
    console.error("privacy/access failed:", err);
    res.status(500).json({ error: "Export failed" });
  }
});

// POST /api/privacy/rectify - correction ticket
router.post("/rectify", requireAuth, async (req, res) => {
  try {
    const { field, newValue, reason } = req.body || {};
    if (!field || !newValue) {
      return res.status(400).json({ error: "field and newValue are required" });
    }
    const ticket = await prisma.correctionTicket.create({
      data: { memberId: req.member.id, field, newValue, reason: reason || null },
    });
    await writeAudit({
      action: "PRIVACY_RECTIFY_REQUEST",
      actorPc: req.member.pcNumber,
      targetPc: req.member.pcNumber,
      meta: { field, ticketId: ticket.id },
    });
    res.json({ status: "ticket_created", ticket });
  } catch (err) {
    console.error("privacy/rectify failed:", err);
    res.status(500).json({ error: "Rectification request failed" });
  }
});

// POST /api/privacy/erase - pseudonymize PII
router.post("/erase", requireAuth, async (req, res) => {
  try {
    const pseudonym = `erased-${Date.now()}`;
    await prisma.member.update({
      where: { id: req.member.id },
      data: {
        name: "Erased User",
        phone: `erased-${pseudonym}`,
        email: `${pseudonym}@erased.local`,
        location: "Erased",
      },
    });
    await writeAudit({
      action: "PRIVACY_ERASE",
      actorPc: req.member.pcNumber,
      targetPc: req.member.pcNumber,
      meta: { pseudonym },
    });
    res.json({ status: "erased", message: "Your personal data has been pseudonymized." });
  } catch (err) {
    console.error("privacy/erase failed:", err);
    res.status(500).json({ error: "Erasure failed" });
  }
});

// GET /api/privacy/consent - history
router.get("/consent", requireAuth, async (req, res) => {
  try {
    const consents = await prisma.consent.findMany({
      where: { memberId: req.member.id },
      orderBy: { createdAt: "desc" },
    });
    res.json(consents);
  } catch (err) {
    console.error("privacy/consent failed:", err);
    res.status(500).json({ error: "Failed to fetch consent history" });
  }
});

export default router;