const CACHE = "owqat-pwa-v1";
const scope = new URL(self.registration.scope);
const shell = [
  "./",
  "Asia/Tehran/",
  "offline.html",
  "owqat.css?v=5",
  "owqat.js?v=6",
  "place-picker.js",
  "language.js",
  "flags/iran.svg",
  "zones.json",
  "city-names.json",
  "cities/index.json",
  "manifest.webmanifest",
  "icons/apple-touch-icon.png",
  "icons/icon-192.png",
  "icons/icon-512.png",
].map((path) => new URL(path, scope).href);

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(shell)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(
    keys.filter((key) => key.startsWith("owqat-pwa-") && key !== CACHE).map((key) => caches.delete(key)),
  )).then(() => self.clients.claim()));
});

async function networkFirst(request, api) {
  const cache = await caches.open(CACHE);
  try {
    const response = await fetch(request);
    if (response.ok) {
      try {
        await cache.put(request, response.clone());
        if (api) {
          const dates = (await cache.keys()).filter((key) => new URL(key.url).hostname === "api.aladhan.com");
          await Promise.all(dates.slice(0, Math.max(0, dates.length - 24)).map((key) => cache.delete(key)));
        }
      } catch {
        // Storage limits should not prevent loading a live response.
      }
      return response;
    }
    if (response.status < 500) return response;
  } catch {
    // Fall back to the exact cached URL, including the prayer date and zone.
  }
  return (await cache.match(request))
    ?? (request.mode === "navigate" ? await cache.match(new URL("offline.html", scope)) : undefined)
    ?? Response.error();
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  const own = url.origin === scope.origin && url.pathname.startsWith(scope.pathname);
  const api = url.origin === "https://api.aladhan.com" && /^\/v1\/timings\/\d{2}-\d{2}-\d{4}$/.test(url.pathname);
  if (own || api) event.respondWith(networkFirst(request, api));
});
