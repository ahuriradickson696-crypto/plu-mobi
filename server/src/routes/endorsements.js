import { Router } from "express";
import prisma from "../lib/prisma.js";
import { endorsementSchema } from "../validators/endorsement.js";
import { writeAudit } from "../lib/audit.js";

const router = Router();

router.post("/", async (req, res, next) => {
  try {
    const data = endorsementSchema.parse(req.body);
    const endorsement = await prisma.endorsement.create({
      data: { name: data.name, phone: data.phone || null, memberId: data.memberId || null, assistedBy: data.assistedBy || null },
    });
    if (data.assistedBy) {
      await writeAudit({ action: "ASSIST_ENDORSE", actorPc: data.assistedBy, meta: { endorsementId: endorsement.id, endorsedName: data.name } });
    }
    const total = await prisma.endorsement.count();
    res.status(201).json({ ok: true, endorsementId: endorsement.id, total });
  } catch (err) { next(err); }
});

router.get("/stats", async (_req, res) => {
  const total = await prisma.endorsement.count();
  const assisted = await prisma.endorsement.count({ where: { NOT: { assistedBy: null } } });
  res.json({ total, assisted, direct: total - assisted });
});

export default router;
