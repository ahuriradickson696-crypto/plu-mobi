import { Router } from "express";
import prisma from "../lib/prisma.js";
import { requireAuth, requireCapability } from "../middleware/auth.js";
import { writeAudit } from "../lib/audit.js";
import { idempotent } from "../lib/idempotency.js";

const router = Router();

router.get("/queue", requireAuth, requireCapability("isReviewer"), async (_req, res) => {
  const records = await prisma.member.findMany({
    where: { status: "TENTATIVE" },
    select: {
      id: true, pcNumber: true, name: true, phone: true, location: true,
      assistedBy: true, createdAt: true,
    },
    orderBy: { createdAt: "asc" },
  });
  res.json({ records });
});

router.get("/whoami", requireAuth, async (req, res) => {
  res.json({
    id: req.member.id,
    pcNumber: req.member.pcNumber,
    isReviewer: Boolean(req.member.isReviewer),
  });
});
router.get("/:id", requireAuth, requireCapability("isReviewer"), async (req, res) => {
  const record = await prisma.member.findUnique({
    where: { id: req.params.id },
    include: {
      reviewsReceived: {
        include: { reviewer: { select: { pcNumber: true, name: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });
  if (!record) return res.status(404).json({ error: "Not found" });
  const { pinHash, resetToken, resetExpires, ...safe } = record;
  res.json({ record: safe });
});

router.post("/:id/decision", requireAuth, requireCapability("isReviewer"), idempotent,async (req, res) => {
  const { decision, reason } = req.body;
  if (!["APPROVED", "REJECTED", "INFO_REQUESTED"].includes(decision)) {
    return res.status(400).json({ error: "Invalid decision" });
  }
  const member = await prisma.member.findUnique({ where: { id: req.params.id } });
  if (!member) return res.status(404).json({ error: "Not found" });

  const newStatus = decision === "APPROVED" ? "ACTIVE"
                  : decision === "REJECTED" ? "REJECTED"
                  : "TENTATIVE";

  await prisma.$transaction([
    prisma.member.update({ where: { id: member.id }, data: { status: newStatus } }),
    prisma.reviewDecision.create({
      data: { memberId: member.id, reviewerId: req.member.id, decision, reason: reason || null },
    }),
  ]);

  await writeAudit({
    action: `REVIEW_${decision}`,
    actorPc: req.member.pcNumber,
    targetPc: member.pcNumber,
    meta: { reason: reason || null },
  });

  const __resp = { ok: true, status: newStatus };
  if (res.locals.storeIdempotent) await res.locals.storeIdempotent(__resp);
  res.json(__resp);
});

export default router;


