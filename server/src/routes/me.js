import { Router } from "express";
import multer from "multer";
import prisma from "../lib/prisma.js";
import { requireAuth } from "../middleware/auth.js";
import { saveDataUrl, saveBuffer, deleteUpload } from "../lib/uploads.js";
import { idempotent } from "../lib/idempotency.js";
import { writeAudit } from "../lib/audit.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

router.post("/photo", requireAuth, idempotent, upload.single("photo"), async (req, res, next) => {
  try {
    const member = req.member;
    let newUrl = null;
    if (req.file) {
      newUrl = await saveBuffer(req.file.buffer, "jpg");
    } else if (typeof req.body.photo === "string") {
      newUrl = await saveDataUrl(req.body.photo);
    }
    if (!newUrl) return res.status(400).json({ error: "No photo provided" });
    if (member.photoUrl) await deleteUpload(member.photoUrl);
    const updated = await prisma.member.update({
      where: { id: member.id },
      data: { photoUrl: newUrl },
      select: { id: true, pcNumber: true, name: true, photoUrl: true },
    });
    await writeAudit({ action: "PHOTO_UPDATED", actorPc: member.pcNumber, meta: { newUrl: newUrl } });
    const body = { ok: true, member: updated };
    if (res.locals.storeIdempotent) await res.locals.storeIdempotent(body);
    res.json(body);
  } catch (e) { next(e); }
});

router.delete("/photo", requireAuth, async (req, res, next) => {
  try {
    const member = req.member;
    if (member.photoUrl) {
      await deleteUpload(member.photoUrl);
      await prisma.member.update({ where: { id: member.id }, data: { photoUrl: null } });
      await writeAudit({ action: "PHOTO_DELETED", actorPc: member.pcNumber });
    }
    res.json({ ok: true });
  } catch (e) { next(e); }
});

export default router;
