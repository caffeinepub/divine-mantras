const CACHE_NAME = 'divine-mantras-audio-v1';
const AUDIO_CACHE_NAME = 'divine-mantras-audio-files-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE_NAME && k !== AUDIO_CACHE_NAME)
          .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = event.request.url;
  const isAudio =
    url.includes('archive.org') ||
    /\.(mp3|ogg|wav|m4a)(\?|$)/.test(url);

  if (isAudio) {
    event.respondWith(
      caches.open(AUDIO_CACHE_NAME).then(cache =>
        cache.match(event.request).then(cached => {
          if (cached) return cached;
          return fetch(event.request).then(response => {
            if (response.ok) cache.put(event.request, response.clone());
            return response;
          }).catch(() => {
            if (cached) return cached;
            return new Response('Audio unavailable', { status: 503 });
          });
        })
      )
    );
  }
});
