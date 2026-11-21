/**
 * PLU Mobi Service Worker
 * Strategy:
 *  - App shell (HTML, JS, CSS, logos, fonts): stale-while-revalidate
 *  - API GETs (verify, officers, events, legal, stats): network-first with cache fallback
 *  - API POST/PUT/PATCH/DELETE: NEVER cached (offline queue handles them)
 *  - Navigations: fall back to cached index.html when offline
 *
 * Bump CACHE_VERSION on every deploy to force-refresh old clients.
 */

const CACHE_VERSION = "plu-mobi-v1";
const RUNTIME_CACHE = "plu-mobi-runtime-v1";

// App shell precache — loaded during install
const PRECACHE_URLS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/plu-logo-circle.png",
  "/plu-logo-192.png",
  "/plu-logo-512.png",
  "/plu-logo-favicon.png",
  "/apple-touch-icon.png",
];

// ---------- INSTALL ----------
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then(async (cache) => {
      // Best-effort: skip any URL that 404s so install isn't blocked
      await Promise.all(
        PRECACHE_URLS.map(async (url) => {
          try {
            await cache.add(url);
          } catch (err) {
            console.warn("[SW] precache miss:", url, err.message);
          }
        })
      );
      // Activate immediately so users get the new SW on next reload
      await self.skipWaiting();
    })
  );
});

// ---------- ACTIVATE ----------
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((k) => k !== CACHE_VERSION && k !== RUNTIME_CACHE)
          .map((k) => caches.delete(k))
      );
      await self.clients.claim();
    })()
  );
});

// ---------- FETCH ----------
self.addEventListener("fetch", (event) => {
  const req = event.request;

  // Never intercept non-GET — offline queue handles those
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // Ignore chrome-extension and devtools requests
  if (!url.protocol.startsWith("http")) return;

  // ---------- API GETs — network-first, cache fallback ----------
  if (url.pathname.startsWith("/api/")) {
    // Only cache safe read-only endpoints
    const cacheable =
      url.pathname.startsWith("/api/verify/") ||
      url.pathname === "/api/officers" ||
      url.pathname.startsWith("/api/officers/") ||
      url.pathname === "/api/events" ||
      url.pathname.startsWith("/api/events/") ||
      url.pathname === "/api/members/stats" ||
      url.pathname === "/api/endorsements/stats";

    if (!cacheable) return; // let network handle (auth, mutations, etc.)

    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(req);
          if (fresh.ok) {
            const cache = await caches.open(RUNTIME_CACHE);
            cache.put(req, fresh.clone());
          }
          return fresh;
        } catch (err) {
          const cached = await caches.match(req);
          if (cached) return cached;
          throw err;
        }
      })()
    );
    return;
  }

  // ---------- Navigations — network-first, cached index.html fallback ----------
  if (req.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          return await fetch(req);
        } catch (err) {
          const cache = await caches.open(CACHE_VERSION);
          const cached = (await cache.match("/index.html")) || (await cache.match("/"));
          if (cached) return cached;
          throw err;
        }
      })()
    );
    return;
  }

  // ---------- Static assets — stale-while-revalidate ----------
  event.respondWith(
    (async () => {
      const cache = await caches.open(RUNTIME_CACHE);
      const cached = await cache.match(req);

      const fetchPromise = fetch(req)
        .then((fresh) => {
          if (fresh && fresh.ok) cache.put(req, fresh.clone());
          return fresh;
        })
        .catch(() => cached);

      return cached || fetchPromise;
    })()
  );
});

// ---------- MESSAGE from client (skip waiting after user consents) ----------
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
