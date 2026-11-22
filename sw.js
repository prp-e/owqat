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
