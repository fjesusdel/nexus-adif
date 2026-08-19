const CACHE = 'nexus-v1.5.1';
const ARCHIVOS = [
  '/nexus-adif/',
  '/nexus-adif/index.html',
  '/nexus-adif/manifest.json',
  '/nexus-adif/icons/icon-192.png',
  '/nexus-adif/icons/icon-512.png',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ARCHIVOS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Para el HTML principal (navegación): red primero, caché como respaldo sin conexión.
// Así siempre se ve la última versión subida a GitHub cuando hay internet.
// Para el resto de archivos (iconos, manifest, fuentes): caché primero, más rápido.
self.addEventListener('fetch', e => {
  const esNavegacion = e.request.mode === 'navigate' || e.request.url.endsWith('index.html') || e.request.url.endsWith('/nexus-adif/');

  if (esNavegacion) {
    e.respondWith(
      fetch(e.request)
        .then(resp => {
          caches.open(CACHE).then(c => c.put(e.request, resp.clone()));
          return resp;
        })
        .catch(() => caches.match(e.request).then(cached => cached || caches.match('/nexus-adif/index.html')))
    );
  } else {
    e.respondWith(
      caches.match(e.request).then(cached => cached || fetch(e.request))
    );
  }
});
