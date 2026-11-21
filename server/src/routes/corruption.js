import { Router } from "express";
import prisma from "../lib/prisma.js";
import { requireAuth, requireCapability } from "../middleware/auth.js";
import { uploadEvidence } from "../middleware/upload.js";
import path from "path";
import fs from "fs";

const router = Router();

const CATEGORIES = ["BRIBERY", "EXTORTION", "NEPOTISM", "MISUSE_OF_FUNDS", "ABUSE_OF_OFFICE", "OTHER"];
const STATUSES = ["RECEIVED", "UNDER_REVIEW", "RESOLVED", "DISMISSED"];

router.post("/", uploadEvidence, async (req, res, next) => {
  try {
    // multer puts text fields in req.body
    const {
      category, description, location,
      reporterName, reporterPhone, isAnonymous, evidenceNote,
    } = req.body;

    const isAnon = isAnonymous === "true" || isAnonymous === true;

    if (!CATEGORIES.includes(category)) {
      return res.status(400).json({ error: "Invalid category" });
    }
    if (!description || description.trim().length < 10) {
      return res.status(400).json({ error: "Description must be at least 10 characters" });
    }
    if (!location || location.trim().length < 2) {
      return res.status(400).json({ error: "Location is required" });
    }

    const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let trackingCode = "";
    for (let i = 0; i < 8; i++) {
      trackingCode += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
    const exists = await prisma.corruptionReport.findUnique({ where: { trackingCode } });
    if (exists) trackingCode += Math.floor(Math.random() * 90 + 10);

    const report = await prisma.corruptionReport.create({
      data: {
        trackingCode,
        category,
        description: description.trim(),
        location: location.trim(),
        reporterName: isAnon ? null : (reporterName || null),
        reporterPhone: isAnon ? null : (reporterPhone || null),
        isAnonymous: isAnon,
        evidenceNote: evidenceNote || null,
        evidencePath: req.file ? req.file.filename : null,
      },
    });

    res.status(201).json({
      ok: true,
      trackingCode: report.trackingCode,
      message: "Report received. Keep this tracking code to follow up.",
      hasEvidence: !!report.evidencePath,
    });
  } catch (err) {
    if (err.message?.includes("Only")) return res.status(400).json({ error: err.message });
    if (err.code === "LIMIT_FILE_SIZE") return res.status(400).json({ error: "File too large (max 5MB)" });
    next(err);
  }
});

router.get("/track/:code", async (req, res) => {
  const report = await prisma.corruptionReport.findUnique({
    where: { trackingCode: req.params.code.toUpperCase() },
    select: {
      trackingCode: true, category: true, status: true,
      createdAt: true, updatedAt: true,
    },
  });
  if (!report) return res.status(404).json({ found: false });
  res.json({ found: true, report });
});

router.get("/stats", async (_req, res) => {
  const [total, byStatus, byCategory] = await Promise.all([
    prisma.corruptionReport.count(),
    prisma.corruptionReport.groupBy({ by: ["status"], _count: true }),
    prisma.corruptionReport.groupBy({ by: ["category"], _count: true }),
  ]);
  res.json({ total, byStatus, byCategory });
});

router.get("/list", requireAuth, requireCapability("isReviewer"), async (_req, res) => {
  const reports = await prisma.corruptionReport.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  res.json({ reports });
});

// Download evidence (reviewer only)
router.get("/:id/evidence", requireAuth, requireCapability("isReviewer"), async (req, res) => {
  const report = await prisma.corruptionReport.findUnique({ where: { id: req.params.id } });
  if (!report || !report.evidencePath) return res.status(404).json({ error: "No evidence" });
  const filePath = path.join(process.cwd(), "uploads", "corruption", report.evidencePath);
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: "File missing" });
  res.download(filePath);
});

// Reviewer status update
router.post("/:id/status", requireAuth, requireCapability("isReviewer"), async (req, res) => {
  const { status } = req.body;
  if (!STATUSES.includes(status)) return res.status(400).json({ error: "Invalid status" });

  const report = await prisma.corruptionReport.findUnique({ where: { id: req.params.id } });
  if (!report) return res.status(404).json({ error: "Not found" });

  await prisma.corruptionReport.update({
    where: { id: report.id },
    data: { status },
  });

  res.json({ ok: true, status });
});

// Reviewer detail
router.get("/:id", requireAuth, requireCapability("isReviewer"), async (req, res) => {
  const report = await prisma.corruptionReport.findUnique({ where: { id: req.params.id } });
  if (!report) return res.status(404).json({ error: "Not found" });
  res.json({ report });
});

export default router;
