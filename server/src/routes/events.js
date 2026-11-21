import { Router } from "express";
import prisma from "../lib/prisma.js";
import { requireAuth, requireCapability } from "../middleware/auth.js";

const router = Router();

router.get("/", async (_req, res) => {
  const events = await prisma.event.findMany({
    where: { startAt: { gte: new Date(Date.now() - 86400000) } },
    orderBy: { startAt: "asc" },
    include: { _count: { select: { rsvps: true } } },
  });
  res.json({ events });
});

router.get("/all", requireAuth, requireCapability("isReviewer"), async (_req, res) => {
  const events = await prisma.event.findMany({
    orderBy: { startAt: "desc" },
    include: { _count: { select: { rsvps: true } } },
  });
  res.json({ events });
});

router.get("/:id", async (req, res) => {
  const event = await prisma.event.findUnique({
    where: { id: req.params.id },
    include: {
      _count: { select: { rsvps: true } },
      rsvps: { select: { id: true, name: true, createdAt: true }, orderBy: { createdAt: "desc" }, take: 50 },
    },
  });
  if (!event) return res.status(404).json({ error: "Not found" });
  res.json({ event });
});

router.post("/", requireAuth, requireCapability("isReviewer"), async (req, res) => {
  const { title, description, location, startAt, endAt } = req.body;
  if (!title || !description || !location || !startAt) {
    return res.status(400).json({ error: "title, description, location, startAt required" });
  }
  const event = await prisma.event.create({
    data: {
      title, description, location,
      startAt: new Date(startAt),
      endAt: endAt ? new Date(endAt) : null,
      createdById: req.member.id,
    },
  });
  res.status(201).json({ event });
});

router.put("/:id", requireAuth, requireCapability("isReviewer"), async (req, res) => {
  const { title, description, location, startAt, endAt } = req.body;
  try {
    const event = await prisma.event.update({
      where: { id: req.params.id },
      data: {
        title, description, location,
        startAt: startAt ? new Date(startAt) : undefined,
        endAt: endAt ? new Date(endAt) : null,
      },
    });
    res.json({ event });
  } catch { res.status(404).json({ error: "Not found" }); }
});

router.delete("/:id", requireAuth, requireCapability("isReviewer"), async (req, res) => {
  try {
    await prisma.event.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
  } catch { res.status(404).json({ error: "Not found" }); }
});

router.post("/:id/rsvp", async (req, res) => {
  const { name, phone } = req.body;
  if (!name || !phone) return res.status(400).json({ error: "name and phone required" });
  const event = await prisma.event.findUnique({ where: { id: req.params.id } });
  if (!event) return res.status(404).json({ error: "Event not found" });
  try {
    const rsvp = await prisma.eventRSVP.create({
      data: { eventId: req.params.id, name: name.trim(), phone: phone.trim() },
    });
    res.status(201).json({ ok: true, rsvpId: rsvp.id });
  } catch (e) {
    if (e.code === "P2002") return res.status(409).json({ error: "This phone has already RSVP'd" });
    throw e;
  }
});

export default router;
