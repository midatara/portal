const CACHE_NAME = "midatara-cache-v1";

// Solo los archivos que existen: index.html + imágenes + manifest
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/midatara_logo.png",
  "/midatara_logo_texto.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    })
  );
});