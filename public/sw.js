const CACHE_NAME = 'social-v2';
const urlsToCache = [
  '/',
  '/manifest.json',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        // Only cache files that exist, handle errors gracefully
        return Promise.allSettled(
          urlsToCache.map(url => cache.add(url).catch(err => {
            console.log('Failed to cache:', url, err);
          }))
        );
      })
  );
  // Skip waiting to activate immediately
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      // Claim all clients immediately
      self.clients.claim(),
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      })
    ])
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
      .catch(() => {
        // If both cache and network fail, return a fallback
        return new Response('Offline content not available', {
          status: 503,
          statusText: 'Service Unavailable',
        });
      })
  );
}); 