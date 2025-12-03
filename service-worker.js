self.addEventListener("install", event => {
    event.waitUntil(
        caches.open("bpt-cache-v1").then(cache => {
            return cache.addAll([
                "index.html",
                "css/style.css",
                "js/app.js",
                "js/searchEngine.js",
                "js/google.js",
                "js/mega.js",
                "js/icedrive.js",
                "manifest.json"
            ]);
        })
    );
});

self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});
