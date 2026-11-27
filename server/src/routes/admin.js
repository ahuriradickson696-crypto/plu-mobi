import { Router } from "express";
import prisma from "../lib/prisma.js";
import { requireAuth, requireCapability } from "../middleware/auth.js";
import { writeAudit } from "../lib/audit.js";

const router = Router();

// Every endpoint requires isAdmin = true
router.use(requireAuth, requireCapability("isAdmin"));

/**
 * GET /api/admin/users
 * Paginated user list with optional search and role filter.
 * Query params:
 *   q       - search by name, phone, or PC number
 *   role    - "all" | "admins" | "reviewers" | "members"
 *   page    - 1-based page number (default 1)
 *   limit   - items per page (default 20, max 100)
 */
router.get("/users", async (req, res, next) => {
  try {
    const q = (req.query.q || "").toString().trim();
    const role = (req.query.role || "all").toString();
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const skip = (page - 1) * limit;

    const where = {};
    if (q) {
      where.OR = [
        { name: { contains: q } },
        { phone: { contains: q } },
        { pcNumber: { contains: q } },
        { email: { contains: q } },
      ];
    }
    if (role === "admins") where.isAdmin = true;
    else if (role === "reviewers") where.isReviewer = true;
    else if (role === "members") { where.isAdmin = false; where.isReviewer = false; }

    const [total, users] = await Promise.all([
      prisma.member.count({ where }),
      prisma.member.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          pcNumber: true,
          name: true,
          phone: true,
          email: true,
          location: true,
          status: true,
          isAdmin: true,
          isReviewer: true,
          createdAt: true,
        },
      }),
    ]);

    res.json({
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
      users,
    });
  } catch (err) { next(err); }
});

/**
 * PATCH /api/admin/users/:id
 * Update role flags.
 * Body: { isAdmin?: boolean, isReviewer?: boolean }
 * Cannot demote yourself (safety).
 */
router.patch("/users/:id", async (req, res, next) => {
  try {
    const { isAdmin, isReviewer } = req.body;
    const target = await prisma.member.findUnique({ where: { id: req.params.id } });
    if (!target) return res.status(404).json({ error: "User not found" });

    // Safety: don't allow an admin to demote themselves
    if (req.member.id === target.id && isAdmin === false) {
      return res.status(400).json({ error: "You cannot remove your own admin access" });
    }

    const data = {};
    if (typeof isAdmin === "boolean") data.isAdmin = isAdmin;
    if (typeof isReviewer === "boolean") data.isReviewer = isReviewer;
    if (Object.keys(data).length === 0) {
      return res.status(400).json({ error: "No valid fields to update" });
    }

    const updated = await prisma.member.update({
      where: { id: target.id },
      data,
      select: { id: true, pcNumber: true, name: true, isAdmin: true, isReviewer: true, status: true },
    });

    await writeAudit({
      action: "ADMIN_UPDATE_ROLE",
      actorPc: req.member.pcNumber,
      targetPc: target.pcNumber,
      meta: { changes: data },
    });

    res.json({ ok: true, user: updated });
  } catch (err) { next(err); }
});

/**
 * POST /api/admin/users/:id/suspend
 * Body: { reason?: string }
 */
router.post("/users/:id/suspend", async (req, res, next) => {
  try {
    const { reason } = req.body || {};
    const target = await prisma.member.findUnique({ where: { id: req.params.id } });
    if (!target) return res.status(404).json({ error: "User not found" });

    if (req.member.id === target.id) {
      return res.status(400).json({ error: "You cannot suspend your own account" });
    }

    await prisma.member.update({
      where: { id: target.id },
      data: { status: "SUSPENDED" },
    });

    await writeAudit({
      action: "ADMIN_SUSPEND",
      actorPc: req.member.pcNumber,
      targetPc: target.pcNumber,
      meta: { reason: reason || null },
    });

    res.json({ ok: true, status: "SUSPENDED" });
  } catch (err) { next(err); }
});

/**
 * POST /api/admin/users/:id/activate
 * Body: { reason?: string }
 */
router.post("/users/:id/activate", async (req, res, next) => {
  try {
    const { reason } = req.body || {};
    const target = await prisma.member.findUnique({ where: { id: req.params.id } });
    if (!target) return res.status(404).json({ error: "User not found" });

    await prisma.member.update({
      where: { id: target.id },
      data: { status: "ACTIVE" },
    });

    await writeAudit({
      action: "ADMIN_ACTIVATE",
      actorPc: req.member.pcNumber,
      targetPc: target.pcNumber,
      meta: { reason: reason || null },
    });

    res.json({ ok: true, status: "ACTIVE" });
  } catch (err) { next(err); }
});

export default router;
