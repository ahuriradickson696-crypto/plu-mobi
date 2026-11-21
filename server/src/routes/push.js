import { Router } from "express";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const webpush = require("web-push");
import prisma from "../lib/prisma.js";
import { requireAuth } from "../middleware/auth.js";

webpush.setVapidDetails(
  "mailto:support@plu-mobi.test",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

const router = Router();

router.get("/public-key", (_req, res) => {
  res.json({ publicKey: process.env.VAPID_PUBLIC_KEY });
});

router.post("/subscribe", requireAuth, async (req, res) => {
  const { subscription } = req.body;
  if (!subscription?.endpoint) return res.status(400).json({ error: "Invalid subscription" });
  await prisma.pushSubscription.upsert({
    where: { endpoint: subscription.endpoint },
    update: { keys: JSON.stringify(subscription.keys), memberId: req.member.id },
    create: {
      endpoint: subscription.endpoint,
      keys: JSON.stringify(subscription.keys),
      memberId: req.member.id,
    },
  });
  res.json({ ok: true });
});

router.post("/test", requireAuth, async (req, res) => {
  const subs = await prisma.pushSubscription.findMany({ where: { memberId: req.member.id } });
  let sent = 0;
  for (const s of subs) {
    try {
      await webpush.sendNotification(
        { endpoint: s.endpoint, keys: JSON.parse(s.keys) },
        JSON.stringify({ title: "PLU Mobi", body: "Push notifications are working!", icon: "/plu-logo-192.png" })
      );
      sent++;
    } catch (e) {
      console.error("Push failed:", e.message);
    }
  }
  res.json({ ok: true, sent, total: subs.length });
});

export default router;


