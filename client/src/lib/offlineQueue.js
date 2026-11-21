// Simple offline queue using localStorage + Background Sync API
const QUEUE_KEY = "plu_offline_queue";

function readQueue() {
  try {
    return JSON.parse(localStorage.getItem(QUEUE_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeQueue(q) {
  localStorage.setItem(QUEUE_KEY, JSON.stringify(q));
}

export function queueRequest({ url, method = "POST", body, headers = {} }) {
  const queue = readQueue();
  const item = {
    id: `q-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    url,
    method,
    body,
    headers,
    queuedAt: Date.now(),
  };
  queue.push(item);
  writeQueue(queue);
  return item.id;
}

export function getQueueSize() {
  return readQueue().length;
}

export async function flushQueue() {
  const queue = readQueue();
  if (queue.length === 0) return { sent: 0, failed: 0 };

  const remaining = [];
  let sent = 0;
  let failed = 0;

  for (const item of queue) {
    try {
      const response = await fetch(item.url, {
        method: item.method,
        headers: { "Content-Type": "application/json", ...item.headers },
        body: typeof item.body === "string" ? item.body : JSON.stringify(item.body),
      });
      if (response.ok) {
        sent++;
      } else {
        failed++;
        remaining.push(item);
      }
    } catch {
      failed++;
      remaining.push(item);
    }
  }

  writeQueue(remaining);
  return { sent, failed };
}

// Auto-flush when network comes back
if (typeof window !== "undefined") {
  window.addEventListener("online", () => {
    flushQueue().then(({ sent }) => {
      if (sent > 0) {
        console.log(`[offline-queue] Flushed ${sent} queued request(s)`);
      }
    });
  });
}
