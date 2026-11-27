import { Router } from "express";
import path from "path";
import fs from "fs";
import prisma from "../lib/prisma.js";

const router = Router();

// GET /api/photos/:pcNumber — public, shows the member's photo
router.get("/:pcNumber", async (req, res) => {
  const member = await prisma.member.findUnique({
    where: { pcNumber: req.params.pcNumber },
    select: { photoPath: true },
  });
  if (!member?.photoPath) return res.status(404).json({ error: "No photo" });
  const filePath = path.join(process.cwd(), "uploads", "photos", member.photoPath);
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: "File missing" });
  res.sendFile(filePath);
});

export default router;
