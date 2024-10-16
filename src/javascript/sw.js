//Service worker

// sw.js
const cacheName = "threejs-cache-v1";
const assetsToCache = [
    "assets/GifO3.mp4",
    "assets/echelle.mp4",
    "./assets/textures/sol.jpg",
    "./assets/textures/mur.jpg",
    "./assets/scene.glb",
    "./assets/postes-sources.json",
    // "./assets/htaS.json",
    // "./assets/htaA.json",
    // Ajoutez d'autres ressources ici
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(cacheName).then((cache) => {
            return cache.addAll(assetsToCache);
        })
    );
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
