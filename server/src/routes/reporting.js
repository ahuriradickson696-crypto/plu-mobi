import { Router } from "express";
import prisma from "../lib/prisma.js";
import { requireAuth, requireCapability } from "../middleware/auth.js";

const router = Router();

router.get("/dashboard", requireAuth, requireCapability("isReviewer"), async (_req, res) => {
  const [
    memberTotal,
    memberByStatus,
    endorsementTotal,
    corruptionTotal,
    corruptionByStatus,
    corruptionByCategory,
    districtCounts,
    recentAudit,
  ] = await Promise.all([
    prisma.member.count(),
    prisma.member.groupBy({ by: ["status"], _count: true }),
    prisma.endorsement.count(),
    prisma.corruptionReport.count(),
    prisma.corruptionReport.groupBy({ by: ["status"], _count: true }),
    prisma.corruptionReport.groupBy({ by: ["category"], _count: true }),
    prisma.member.groupBy({ by: ["location"], _count: true, orderBy: { _count: { location: "desc" } }, take: 10 }),
    prisma.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 10 }),
  ]);

  res.json({
    members: {
      total: memberTotal,
      byStatus: memberByStatus.map((r) => ({ status: r.status, count: r._count })),
    },
    endorsements: { total: endorsementTotal },
    corruption: {
      total: corruptionTotal,
      byStatus: corruptionByStatus.map((r) => ({ status: r.status, count: r._count })),
      byCategory: corruptionByCategory.map((r) => ({ category: r.category, count: r._count })),
    },
    districts: districtCounts.map((r) => ({ location: r.location, count: r._count })),
    recentAudit,
  });
});

export default router;
