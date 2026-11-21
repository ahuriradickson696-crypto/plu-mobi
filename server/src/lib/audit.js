import prisma from "./prisma.js";

export async function writeAudit({ action, actorPc, targetPc = null, meta = null }) {
  return prisma.auditLog.create({
    data: { action, actorPc, targetPc, meta: meta ? JSON.stringify(meta) : null },
  });
}
