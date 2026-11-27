import { Router } from "express";
import prisma from "../lib/prisma.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// GET /api/members/me
router.get("/me", requireAuth, async (req, res) => {
  const m = req.member;
  res.json({
    pcNumber: m.pcNumber, name: m.name, status: m.status, phone: m.phone,
    email: m.email, pathway: m.pathway, location: m.location,
    assistedBy: m.assistedBy, createdAt: m.createdAt,
    isReviewer: m.isReviewer, isAdmin: m.isAdmin,
  });
});

// GET /api/members/me/assistance
router.get("/me/assistance", requireAuth, async (req, res) => {
  const helperPc = req.member.pcNumber;
  const [registrations, endorsements] = await Promise.all([
    prisma.member.findMany({
      where: { assistedBy: helperPc },
      select: { pcNumber: true, name: true, status: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.endorsement.findMany({
      where: { assistedBy: helperPc },
      select: { id: true, name: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);
  res.json({ registrations, endorsements });
});

// GET /api/members/stats
router.get("/stats", async (_req, res) => {
  const [members, endorsements] = await Promise.all([
    prisma.member.count(),
    prisma.endorsement.count(),
  ]);
  const corruptions = await prisma.corruptionReport.count();
  const districts = await prisma.member.findMany({ select: { location: true }, distinct: ["location"] });
  res.json({ members, endorsements, districts: districts.length, corruptions });
});

export default router;


