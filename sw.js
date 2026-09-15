// Service worker mínimo: solo habilita la instalación como PWA.
// No cachea llamadas a la API de GLPI (los datos siempre deben ser frescos).
const CACHE = 'girag-forms-v1';
const ASSETS = ['./index.html', './manifest.json'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  // No interceptar llamadas a la API de GLPI
  if (url.pathname.includes('apirest.php')) return;
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
