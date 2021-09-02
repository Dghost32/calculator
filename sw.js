self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("sw-cache").then((cache) => {
      return (
        cache.add("index.html"),
        cache.add("./css/app.js"),
        cache.add("./css/style.css")
      );
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
