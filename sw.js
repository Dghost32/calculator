self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("sw-cache").then((cache) => {
      cache.add("./css/style.css");
      cache.add("./css/app.js");
      return cache.add("index.html");
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((res) => {
      return res || fetch(event.request);
    })
  );
});
