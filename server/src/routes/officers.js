import { Router } from "express";
import prisma from "../lib/prisma.js";

const router = Router();

router.get("/", async (req, res) => {
  const q = (req.query.q || "").toString().trim();
  const where = q ? {
    OR: [
      { name: { contains: q } }, { poNumber: { contains: q } },
      { role: { contains: q } }, { location: { contains: q } },
    ],
  } : {};
  const officers = await prisma.patrioticOfficer.findMany({ where, orderBy: { name: "asc" }, take: 50 });
  res.json({ officers });
});

export default router;
