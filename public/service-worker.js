const QUIZ_CACHE = 'scheduler-viewer-b-v1';
const fontCache = 'font-cache-v1';

const assets = [
	'/',
	'/index.html',
	'/main.css',
	'/index.js',
	'/manifest.json',
	'/assets/favicon.ico',
	'/assets/33.png',
	'/assets/120.png',
	'/assets/01.png',
	'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Roboto+Mono:ital,wght@0,100..700;1,100..700&display=swap'
];

self.addEventListener('install', (installEvent) => {
	installEvent.waitUntil(
		Promise.all([
			caches.open(QUIZ_CACHE).then((cache) => {
				cache.addAll(assets);
			}),
			caches.open(fontCache).then((cache) => {
				cache.addAll([
					'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Roboto+Mono:ital,wght@0,100..700;1,100..700&display=swap'
				]);
			})
		])
	);
	self.skipWaiting();
});

self.addEventListener('activate', (activateEvent) => {
	activateEvent.waitUntil(
		caches.keys().then((cacheNames) => {
			return Promise.all(
				cacheNames
					.filter((cacheName) => {
						return cacheName !== QUIZ_CACHE && cacheName !== fontCache;
					})
					.map((cacheName) => {
						return caches.delete(cacheName);
					})
			);
		})
	);
	self.clients.claim();
});

self.addEventListener('fetch', (fetchEvent) => {
	const requestURL = new URL(fetchEvent.request.url);

	if (requestURL.origin === 'https://fonts.googleapis.com') {
		fetchEvent.respondWith(
			caches.match(fetchEvent.request).then((response) => {
				if (response) {
					// Serve the cached font
					return response;
				}

				// Fetch the font and cache it
				return fetch(fetchEvent.request).then((networkResponse) => {
					const responseToCache = networkResponse.clone(); // Clone the response

					caches.open(fontCache).then((cache) => {
						cache.put(fetchEvent.request, responseToCache); // Use the cloned response
					});

					return networkResponse; // Return the original response
				});
			})
		);
		return;
	}

	// Handle other requests (non-font requests)
	fetchEvent.respondWith(
		caches.match(fetchEvent.request).then((response) => {
			return response || fetch(fetchEvent.request);
		})
	);
});
