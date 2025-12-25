// Service Worker for PWA
const CACHE_NAME = 'smart-trash-v3'
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  )
})

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)
  
  // Don't cache GraphQL requests, API calls, or external resources
  // Just pass through without intercepting
  if (
    url.pathname.includes('/graphql') ||
    url.pathname.includes('/api/') ||
    url.origin !== self.location.origin ||
    event.request.method !== 'GET'
  ) {
    // For non-GET requests or API calls, don't intercept
    return
  }
  
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request).catch(() => {
          // If fetch fails, return a basic offline response
          if (event.request.destination === 'document') {
            return caches.match('/index.html')
          }
          return new Response('Offline', { status: 503 })
        })
      })
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        })
      )
    })
    .then(() => self.clients.claim())
  )
})

// Push notification event listener
self.addEventListener('push', (event) => {
  let data = {}
  
  if (event.data) {
    try {
      data = event.data.json()
    } catch (e) {
      data = { title: 'Smart Trash', body: event.data.text() || 'New notification' }
    }
  }

  const options = {
    title: data.title || 'Smart Trash',
    body: data.body || 'You have a new notification',
    icon: data.icon || '/icon-192x192.png',
    badge: data.badge || '/icon-96x96.png',
    image: data.image,
    tag: data.tag || 'default',
    data: data.data || {},
    requireInteraction: data.requireInteraction || false,
    vibrate: [200, 100, 200],
    timestamp: Date.now(),
  }

  event.waitUntil(
    self.registration.showNotification(options.title, options)
  )
})

// Notification click event listener
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  const data = event.notification.data || {}
  const urlToOpen = data.url || '/'

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Check if there's already a window open
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i]
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus()
          }
        }
        // Open a new window if none exists
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen)
        }
      })
  )
})

// Notification close event listener
self.addEventListener('notificationclose', (event) => {
  // Handle notification close if needed
  console.log('Notification closed:', event.notification.tag)
})


