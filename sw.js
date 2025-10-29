const CACHE_NAME = "midatara-cache-v2"; // ← Cambia versión para forzar actualización

// ARCHIVOS ESENCIALES + PORTAL.HTML
const urlsToCache = [
  "/",
  "/index.html",
  "/portal.html",                    // ← AÑADIDO
  "/manifest.json",
  "/midatara_logo.png",
  "/midatara_logo_texto.png",
  // Fuentes externas (opcional, pero recomendado para offline)
  "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700;900&display=swap",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css",
  "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log("Cacheando archivos para offline...");
        return cache.addAll(urlsToCache.map(url => new Request(url, { credentials: 'omit' })));
      })
      .catch(err => console.error("Error al cachear:", err))
  );
  // Forzar activación inmediata
  self.skipWaiting();
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Si está en caché → devolver
        if (response) return response;
        // Si no → intentar red
        return fetch(event.request).catch(() => {
          // Si falla red y es HTML → fallback
          if (event.request.destination === 'document') {
            return caches.match('/index.html');
          }
        });
      })
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => {
            console.log("Eliminando caché vieja:", name);
            return caches.delete(name);
          })
      );
    })
    .then(() => self.clients.claim())
  );
});