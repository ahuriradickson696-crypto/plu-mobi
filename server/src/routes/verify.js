import { Router } from "express";
import prisma from "../lib/prisma.js";

const router = Router();

router.get("/:pcNumber", async (req, res) => {
  const member = await prisma.member.findUnique({ where: { pcNumber: req.params.pcNumber } });
  if (!member) return res.status(404).json({ found: false });
  res.json({
    found: true, pcNumber: member.pcNumber, name: member.name,
    status: member.status, location: member.location, issuedAt: member.createdAt,
    reminder: "Compare these details with any document presented.",
  });
});

export default router;
