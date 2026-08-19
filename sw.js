const CACHE = 'nexus-v1.0.0';
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

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).catch(() => caches.match('/nexus-adif/index.html')))
  );
});
