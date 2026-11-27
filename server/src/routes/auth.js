import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import prisma from "../lib/prisma.js";
import { idempotent } from "../lib/idempotency.js";
import { saveDataUrl } from "../lib/uploads.js";
import { generatePcNumber } from "../lib/pcNumber.js";
import { writeAudit } from "../lib/audit.js";
import { sendEmail } from "../lib/mailer.js";
import { registerSchema, loginSchema } from "../validators/auth.js";
import { uploadPhoto } from "../middleware/photoUpload.js";
import rateLimit from "express-rate-limit";

const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many attempts. Try again in a minute." },
});

const router = Router();

function signToken(member) {
  return jwt.sign({ sub: member.id, pc: member.pcNumber }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "2h",
  });
}

// POST /api/auth/register
router.post("/register", idempotent,authLimiter, uploadPhoto, async (req, res, next) => {
  try {
    const data = registerSchema.parse(req.body);

    const existing = await prisma.member.findUnique({ where: { phone: data.phone } });
    if (existing) return res.status(409).json({ error: "Phone number already registered" });

    const pinHash = await bcrypt.hash(data.pin, Number(process.env.PIN_SALT_ROUNDS || 10));
    const pcNumber = await generatePcNumber();

    const member = await prisma.member.create({
      data: {
        pcNumber,
        phone: data.phone,
        email: data.email || null,
        name: data.name,
        pathway: data.pathway,
        location: data.location,
        identityNumber: data.identityNumber,
        photoPath: req.file ? req.file.filename : null,
    dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : null,
    sex: body.sex || null,
    subCounty: body.subCounty || null,
    village: body.village || null,
    maritalStatus: body.maritalStatus || null,
    occupation: body.occupation || null,
        status: "TENTATIVE",
        pinHash,
        assistedBy: data.assistedBy || null,
      },
    });

    await writeAudit({
      action: data.assistedBy ? "ASSIST_REGISTER" : "REGISTER",
      actorPc: data.assistedBy || pcNumber,
      targetPc: pcNumber,
      meta: { pathway: data.pathway, location: data.location },
    });

    if (data.email) {
      await sendEmail({
        to: data.email,
        subject: "Welcome to PLU â€” Your PC Number",
        text: `Your PLU PC number is ${pcNumber}. Status: Tentative. You can sign in immediately.`,
      });
    }

    const token = signToken(member);
    const __resp = {
      token,
      member: { pcNumber: member.pcNumber, name: member.name, status: member.status, phone: member.phone },
    };
    if (res.locals.storeIdempotent) await res.locals.storeIdempotent(__resp, 201);
    res.status(201).json({
      token,
      member: { pcNumber: member.pcNumber, name: member.name, status: member.status, phone: member.phone },
    });
  } catch (err) { next(err); }
});

// POST /api/auth/login
router.post("/login", authLimiter, async (req, res, next) => {
  try {
    const { identifier, pin } = loginSchema.parse(req.body);
    const member = await prisma.member.findFirst({
      where: { OR: [{ phone: identifier }, { email: identifier }] },
    });
    if (!member) return res.status(401).json({ error: "Invalid credentials" });

    const ok = await bcrypt.compare(pin, member.pinHash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    res.json({
      token: signToken(member),
      member: { pcNumber: member.pcNumber, name: member.name, status: member.status, phone: member.phone, email: member.email },
    });
  } catch (err) { next(err); }
});

// POST /api/auth/forgot
router.post("/forgot", authLimiter, async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email required" });

    const member = await prisma.member.findFirst({ where: { email } });
    if (!member) return res.json({ ok: true }); // do not leak existence

    const token = crypto.randomBytes(24).toString("hex");
    await prisma.member.update({
      where: { id: member.id },
      data: { resetToken: token, resetExpires: new Date(Date.now() + 1000 * 60 * 30) },
    });

    await sendEmail({
      to: email,
      subject: "PLU Mobi â€” PIN Reset Link",
      text: `Use this token to reset your PIN: ${token}\n\nThis link expires in 30 minutes.`,
    });

    res.json({ ok: true });
  } catch (err) { next(err); }
});

// POST /api/auth/reset
router.post("/reset", async (req, res, next) => {
  try {
    const { token, pin } = req.body;
    if (!token || !/^\d{6}$/.test(pin || "")) {
      return res.status(400).json({ error: "Token and 6-digit PIN required" });
    }

    const member = await prisma.member.findFirst({
      where: { resetToken: token, resetExpires: { gt: new Date() } },
    });
    if (!member) return res.status(400).json({ error: "Invalid or expired token" });

    const pinHash = await bcrypt.hash(pin, Number(process.env.PIN_SALT_ROUNDS || 10));
    await prisma.member.update({
      where: { id: member.id },
      data: { pinHash, resetToken: null, resetExpires: null },
    });

    res.json({ ok: true });
  } catch (err) { next(err); }
});

export default router;






