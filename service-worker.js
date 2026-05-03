const CACHE_NAME = 'tvbox-v1';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/app.js',
    '/manifest.json',
    '/assets/icon.svg'
];

const VIDEO_CACHE_NAME = 'tvbox-videos-v1';

// Install event - cache static assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .catch(err => console.log('Cache failed:', err))
    );
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames
                    .filter(name => name !== CACHE_NAME && name !== VIDEO_CACHE_NAME)
                    .map(name => caches.delete(name))
            );
        })
    );
    self.clients.claim();
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') return;
    
    // Skip chrome-extension requests
    if (url.protocol === 'chrome-extension:') return;
    
    // Strategy for static assets
    if (STATIC_ASSETS.includes(url.pathname) || url.pathname.match(/\.(js|css|html|json|svg)$/)) {
        event.respondWith(
            caches.match(request).then(cached => {
                if (cached) {
                    // Return cached version and fetch update in background
                    fetch(request).then(response => {
                        if (response.ok) {
                            caches.open(CACHE_NAME).then(cache => {
                                cache.put(request, response);
                            });
                        }
                    });
                    return cached;
                }
                
                // Not in cache, fetch and cache
                return fetch(request).then(response => {
                    if (!response || response.status !== 200) {
                        return response;
                    }
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(request, responseToCache);
                    });
                    return response;
                });
            })
        );
        return;
    }
    
    // Strategy for images and media - cache with expiration
    if (request.destination === 'image' || request.destination === 'video') {
        event.respondWith(
            caches.open(VIDEO_CACHE_NAME).then(cache => {
                return cache.match(request).then(cached => {
                    if (cached) {
                        return cached;
                    }
                    
                    return fetch(request).then(response => {
                        if (!response || response.status !== 200) {
                            return response;
                        }
                        cache.put(request, response.clone());
                        return response;
                    }).catch(() => {
                        // Return a fallback if available
                        return cached || new Response('', { status: 404 });
                    });
                });
            })
        );
        return;
    }
    
    // Default strategy - network first, then cache
    event.respondWith(
        fetch(request).then(response => {
            if (!response || response.status !== 200) {
                return response;
            }
            return response;
        }).catch(() => {
            return caches.match(request);
        })
    );
});

// Background sync for offline video queue
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-videos') {
        event.waitUntil(syncVideos());
    }
});

async function syncVideos() {
    // Sync logic for queued videos
    console.log('Syncing videos...');
}

// Push notifications (future feature)
self.addEventListener('push', (event) => {
    const options = {
        body: event.data?.text() || 'New content available!',
        icon: '/assets/icon-192.png',
        badge: '/assets/icon-72.png',
        tag: 'tvbox-notification',
        requireInteraction: true
    };
    
    event.waitUntil(
        self.registration.showNotification('TVBox', options)
    );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow('/')
    );
});
