const CACHE_VERSION = 'stop-thief-cache-v4';

const APP_SHELL = [
    './',
    './index.html',
    './manifest.webmanifest',
    './css/scanner.css',
    './js/game-state.js',
    './js/board-data.js',
    './js/movement-engine.js',
    './js/audio.js',
    './js/ui.js',
    './js/app.js',
    './lib/sound.js',
    './assets/icons/icon-192.png',
    './assets/icons/icon-512.png',
    './assets/audio/arrest_fail.mp3',
    './assets/audio/arrest_success.mp3',
    './assets/audio/arrest_taunt.mp3',
    './assets/audio/crime.mp3',
    './assets/audio/door.mp3',
    './assets/audio/footsteps.mp3',
    './assets/audio/glass.mp3',
    './assets/audio/keypress.mp3',
    './assets/audio/street.mp3',
    './assets/audio/tip.mp3'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_VERSION).then(cache => cache.addAll(APP_SHELL))
    );
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.filter(key => key !== CACHE_VERSION).map(key => caches.delete(key))
            )
        )
    );
    self.clients.claim();
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(cached => cached || fetch(event.request))
    );
});
