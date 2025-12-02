// Minimal service worker for INGREE PWA
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Just take control, no offline caching yet
  return self.clients.claim();
});
