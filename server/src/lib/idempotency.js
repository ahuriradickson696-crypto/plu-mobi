/**
 * Idempotency middleware.
 * Client sends `Idempotency-Key: <uuid>` header.
 * If key is new → proceed, store key + response.
 * If key seen  → replay cached response, don't re-execute.
 */
import prisma from "./prisma.js";

export function idempotent(req, res, next) {
  const key = req.headers["idempotency-key"];
  if (!key) return next();

  res.locals.idempotencyKey = key;
  res.locals.storeIdempotent = async (responseBody, statusCode = 200) => {
    try {
      await prisma.idempotencyRecord.create({
        data: {
          key,
          responseBody,
          statusCode,
          expiresAt: new Date(Date.now() + 24 * 3600 * 1000),
        },
      });
    } catch (e) {
      // unique violation = another request already stored it; fine
      if (e.code !== "P2002") throw e;
    }
  };

  prisma.idempotencyRecord
    .findUnique({ where: { key } })
    .then((record) => {
      if (record) return res.status(record.statusCode).json(record.responseBody);
      next();
    })
    .catch(next);
}
