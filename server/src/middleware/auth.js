import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: "Not authenticated" });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const member = await prisma.member.findUnique({ where: { id: payload.sub } });
    if (!member) return res.status(401).json({ error: "Invalid session" });

    req.member = member;
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired session" });
  }
}

export function requireCapability(flag) {
  return (req, res, next) => {
    if (!req.member?.[flag]) return res.status(403).json({ error: "Forbidden" });
    next();
  };
}
