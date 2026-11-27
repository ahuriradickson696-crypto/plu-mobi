/**
 * Offline queue — IndexedDB + AES-GCM encryption + idempotency + backoff.
 * Standards: W3C IndexedDB 3.0, WebCrypto, IETF Idempotency-Key.
 */
import { openDB } from "idb";

const DB_NAME = "plu-mobi-queue";
const DB_VERSION = 1;
const STORE = "pending";
const MAX_QUEUE = 200;
const BACKOFF_BASE_MS = 1000;
const BACKOFF_MAX_MS = 60000;

let dbPromise;
function db() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(d) {
        if (!d.objectStoreNames.contains(STORE)) {
          const s = d.createObjectStore(STORE, { keyPath: "id" });
          s.createIndex("status", "status");
          s.createIndex("createdAt", "createdAt");
        }
      },
    });
  }
  return dbPromise;
}

/* ---------- Crypto (AES-GCM, key persisted in localStorage) ---------- */
async function getKey() {
  const raw = localStorage.getItem("plu_queue_key");
  if (raw) {
    const jwk = JSON.parse(raw);
    return crypto.subtle.importKey("jwk", jwk, "AES-GCM", true, ["encrypt", "decrypt"]);
  }
  const key = await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]
  );
  const jwk = await crypto.subtle.exportKey("jwk", key);
  localStorage.setItem("plu_queue_key", JSON.stringify(jwk));
  return key;
}

async function encrypt(obj) {
  const key = await getKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const data = new TextEncoder().encode(JSON.stringify(obj));
  const cipher = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, data);
  return { iv: Array.from(iv), cipher: Array.from(new Uint8Array(cipher)) };
}

async function decrypt({ iv, cipher }) {
  const key = await getKey();
  const plain = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: new Uint8Array(iv) },
    key,
    new Uint8Array(cipher)
  );
  return JSON.parse(new TextDecoder().decode(plain));
}

/* ---------- Public API ---------- */

export async function queueRequest({ url, method = "POST", body, headers = {}, photo = null }) {
  const d = await db();
  const size = await d.count(STORE);
  if (size >= MAX_QUEUE) {
    throw new Error(`Offline queue is full (${MAX_QUEUE} items). Please reconnect and sync.`);
  }

  const id = crypto.randomUUID();
  const idemKey = crypto.randomUUID();

  const item = {
    id, idemKey, url, method, body, headers, photo,
    status: "pending",
    attempts: 0,
    lastError: null,
    createdAt: new Date().toISOString(),
    nextAttemptAt: 0,
  };

  const enc = await encrypt(item);
  await d.put(STORE, { id, enc, status: "pending", createdAt: item.createdAt });
  return { id, idemKey };
}

export async function getQueue() {
  const d = await db();
  const rows = await d.getAll(STORE);
  const items = [];
  for (const r of rows) {
    try {
      const item = await decrypt(r.enc);
      items.push({ ...item, status: r.status });
    } catch {
      await d.delete(STORE, r.id);
    }
  }
  return items.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export async function getQueueSize() {
  const d = await db();
  return d.count(STORE);
}

export async function removeFromQueue(id) {
  const d = await db();
  await d.delete(STORE, id);
}

export async function updateQueueItem(id, patch) {
  const d = await db();
  const row = await d.get(STORE, id);
  if (!row) return;
  const item = await decrypt(row.enc);
  const merged = { ...item, ...patch };
  const enc = await encrypt(merged);
  await d.put(STORE, { ...row, enc, status: merged.status });
}

export function backoffMs(attempts) {
  const exp = Math.min(BACKOFF_BASE_MS * 2 ** attempts, BACKOFF_MAX_MS);
  return exp + Math.random() * 1000;
}
