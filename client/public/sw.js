// Service Worker for البيت السوداني PWA
const CACHE_NAME = 'sudanese-market-v1.0.0';
const STATIC_CACHE_URLS = [
  '/',
  '/marketplace',
  '/stores',
  '/services',
  '/jobs',
  '/announcements',
  '/manifest.json'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(STATIC_CACHE_URLS);
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          });
      })
      .catch(() => {
        // Return offline page for navigation requests
        if (event.request.destination === 'document') {
          return caches.match('/');
        }
      })
  );
});

// Handle file imports
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'HANDLE_FILE') {
    // Handle file import functionality
    self.clients.matchAll().then((clients) => {
      clients.forEach((client) => {
        client.postMessage({
          type: 'FILE_RECEIVED',
          file: event.data.file
        });
      });
    });
  }
});

// Handle protocol launches
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'HANDLE_PROTOCOL') {
    const { protocol, url } = event.data;
    
    // Navigate to appropriate page based on protocol
    self.clients.matchAll().then((clients) => {
      if (clients.length > 0) {
        clients[0].navigate(url);
        clients[0].focus();
      } else {
        self.clients.openWindow(url);
      }
    });
  }
});