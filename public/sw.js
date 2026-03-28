const CACHE_NAME = 'budget-builder-v3.1';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/logo-44.png',
  'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;800&family=Rajdhani:wght@400;500;600;700&display=swap',
  'https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth-compat.js'
];

// Install: cache shell assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate: clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch: network-first for HTML/API, cache-first for assets
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Skip non-GET and Firebase/Google auth requests
  if (event.request.method !== 'GET') return;
  if (url.hostname.includes('googleapis.com') && url.pathname.includes('/token')) return;
  if (url.hostname.includes('firebaseapp.com')) return;
  if (url.hostname.includes('identitytoolkit')) return;
  if (url.hostname.includes('securetoken')) return;

  // Network-first for navigation (HTML)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Cache-first for static assets
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (response.ok && url.protocol === 'https:') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      });
    }).catch(() => new Response('Offline', { status: 503 }))
  );
});
