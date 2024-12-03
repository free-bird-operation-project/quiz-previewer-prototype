const CACHE_NAME = 'comprehensive-offline-cache-v1';

// Core application assets with correct paths
const CORE_URLS = ['/', '/index.html', '/index.js', '/main.css', '/manifest.json', '/favicon.ico'];

// Image assets with corrected paths
const IMAGE_URLS = ['./assets/33.png', './assets/120.png', './assets/01.png'];

// External resources
const EXTERNAL_RESOURCES = [
	'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Roboto+Mono:ital,wght@0,100..700;1,100..700&display=swap',
	'https://fonts.gstatic.com'
];

// Install event
self.addEventListener('install', (event) => {
	event.waitUntil(
		caches
			.open(CACHE_NAME)
			.then((cache) => {
				console.log('Attempting to cache URLs:', [...CORE_URLS, ...IMAGE_URLS, ...EXTERNAL_RESOURCES]);

				// Attempt to cache all URLs
				return Promise.all([
					cache.addAll(CORE_URLS),
					...IMAGE_URLS.map((url) =>
						cache.add(url).catch((error) => {
							console.warn(`Could not cache ${url}:`, error);
							return null;
						})
					),
					...EXTERNAL_RESOURCES.map((url) =>
						cache.add(url).catch((error) => {
							console.warn(`Could not cache external resource ${url}:`, error);
							return null;
						})
					)
				]);
			})
			.catch((error) => {
				console.error('Caching process failed:', error);
			})
	);
	self.skipWaiting(); // Activate worker immediately
});

// Activate event to clean up old caches
self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches
			.keys()
			.then((cacheNames) => {
				return Promise.all(
					cacheNames.map((cacheName) => {
						if (cacheName !== CACHE_NAME) {
							return caches.delete(cacheName);
						}
					})
				);
			})
			.then(() => {
				return self.clients.claim(); // Take control of all pages
			})
	);
});

// Fetch event with comprehensive caching strategy
self.addEventListener('fetch', (event) => {
	// Skip non-GET requests and chrome-extension requests
	if (event.request.method !== 'GET' || event.request.url.startsWith('chrome-extension')) {
		return;
	}

	event.respondWith(
		caches.match(event.request).then((cachedResponse) => {
			// Return cached response if found
			if (cachedResponse) {
				return cachedResponse;
			}

			// Fetch from network
			return fetch(event.request)
				.then((networkResponse) => {
					// Only cache successful responses
					if (networkResponse && networkResponse.status === 200) {
						// Check if it's a cacheable resource
						const url = event.request.url;
						const shouldCache =
							url.endsWith('.png') ||
							url.endsWith('.jpg') ||
							url.endsWith('.jpeg') ||
							url.endsWith('.gif') ||
							url.endsWith('.svg') ||
							url.endsWith('.css') ||
							url.endsWith('.js');

						if (shouldCache) {
							const responseToCache = networkResponse.clone();

							caches
								.open(CACHE_NAME)
								.then((cache) => {
									cache.put(event.request, responseToCache);
								})
								.catch((error) => {
									console.error('Caching failed:', error);
								});
						}
					}

					return networkResponse;
				})
				.catch((error) => {
					console.error('Fetch failed:', error);
					// Fallback to offline page if both cache and network fail
					return (
						caches.match('/index.html') ||
						new Response('Offline', {
							status: 200,
							headers: { 'Content-Type': 'text/plain' }
						})
					);
				});
		})
	);
});
