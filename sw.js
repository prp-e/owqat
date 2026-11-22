const CACHE = "owqat-pwa-v1";
const scope = new URL(self.registration.scope);
const shell = [
  "Asia/Tehran/",
  "offline.html",
  "owqat.css?v=4",
  "owqat.js?v=4",
  "zones.json",
  "city-names.json",
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
