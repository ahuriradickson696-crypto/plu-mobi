/**
 * Sync engine — flushes the offline queue with backoff, token refresh,
 * per-item error capture, and audit.
 */
import api from "../api/client";
import {
  getQueue, removeFromQueue, updateQueueItem, queueRequest, backoffMs,
} from "./offlineQueue";

let flushing = false;

export async function enqueue(op) {
  return queueRequest(op);
}

export async function flushQueue({ onProgress } = {}) {
  if (flushing) return { sent: 0, failed: 0, skipped: 0 };
  flushing = true;
  let sent = 0, failed = 0, skipped = 0;

  try {
    const queue = await getQueue();
    const now = Date.now();

    for (const item of queue) {
      if (item.nextAttemptAt > now) { skipped++; continue; }
      if (item.status === "sent") continue;

      try {
        await updateQueueItem(item.id, { status: "sending" });
        const fd = new FormData();
        Object.entries(item.body || {}).forEach(([k, v]) => fd.append(k, String(v)));
        if (item.photo) fd.append("photo", item.photo);

        const { data } = await api.request({
          url: item.url,
          method: item.method,
          data: fd,
          headers: { ...item.headers, "Idempotency-Key": item.idemKey },
        });

        await removeFromQueue(item.id);
        sent++;
        onProgress?.({ item, ok: true, data });
      } catch (err) {
        const attempts = item.attempts + 1;
        const status = err.response?.status;

        if (status >= 400 && status < 500 && status !== 401 && status !== 408 && status !== 429) {
          await updateQueueItem(item.id, {
            status: "failed", attempts,
            lastError: err.response?.data?.error || `HTTP ${status}`,
          });
          failed++;
          onProgress?.({ item, ok: false, error: err });
          continue;
        }

        if (status === 401) {
          try {
            await api.post("/auth/refresh");
            await updateQueueItem(item.id, { status: "pending", attempts });
            skipped++;
            continue;
          } catch {
            await updateQueueItem(item.id, {
              status: "failed", attempts,
              lastError: "Session expired — sign in and retry.",
            });
            failed++;
            continue;
          }
        }

        const delay = backoffMs(attempts);
        await updateQueueItem(item.id, {
          status: "pending", attempts,
          lastError: err.message || "Network error",
          nextAttemptAt: Date.now() + delay,
        });
        failed++;
        onProgress?.({ item, ok: false, error: err });
      }
    }
  } finally {
    flushing = false;
  }
  return { sent, failed, skipped };
}

let flushTimer;
if (typeof window !== "undefined") {
  window.addEventListener("online", () => {
    clearTimeout(flushTimer);
    flushTimer = setTimeout(() => flushQueue(), 1500);
  });
}
