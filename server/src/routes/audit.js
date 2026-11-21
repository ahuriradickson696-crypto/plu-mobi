import { Router } from "express";
import prisma from "../lib/prisma.js";

const router = Router();

router.get("/recent", async (_req, res) => {
  const entries = await prisma.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 50 });
  res.json({ entries });
});

export default router;
