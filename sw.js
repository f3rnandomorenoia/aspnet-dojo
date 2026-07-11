// Service worker: red primero, caché como respaldo (permite usar la app sin conexión).
const CACHE = "aspnet-dojo-v1";
const RECURSOS = [
  "./",
  "./index.html",
  "./css/styles.css",
  "./js/app.js",
  "./js/data.js",
  "./manifest.webmanifest",
  "./icon.svg",
];

self.addEventListener("install", (evento) => {
  evento.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(RECURSOS)));
  self.skipWaiting();
});

self.addEventListener("activate", (evento) => {
  evento.waitUntil(
    caches.keys().then((claves) =>
      Promise.all(claves.filter((clave) => clave !== CACHE).map((clave) => caches.delete(clave)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (evento) => {
  evento.respondWith(
    fetch(evento.request)
      .then((respuesta) => {
        const copia = respuesta.clone();
        caches.open(CACHE).then((cache) => cache.put(evento.request, copia));
        return respuesta;
      })
      .catch(() => caches.match(evento.request))
  );
});
