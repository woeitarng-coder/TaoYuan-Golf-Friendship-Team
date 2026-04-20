// 專屬這套系統的快取名稱 (千萬不要跟另外兩套重複)
const CACHE_PREFIX = 'taoyuan-cache-'; 
// 以後如果改了外殼 (index.html 等)，只要把 v2 改成 v3, v4 即可
const CACHE_VERSION = 'v3'; 
const CACHE_NAME = CACHE_PREFIX + CACHE_VERSION;

const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon.png'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // 🧹 聰明大掃除：只刪除「自己這套系統」的舊快取，絕對不碰另外兩套！
          if (cacheName.startsWith(CACHE_PREFIX) && cacheName !== CACHE_NAME) {
            console.log('刪除舊快取:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
