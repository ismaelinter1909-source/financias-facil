const CACHE_NAME = "financas-facil-v2";

self.addEventListener("install", (event) => {

    console.log("Service Worker instalado");

    self.skipWaiting();

});

self.addEventListener("activate", (event) => {

    console.log("Service Worker ativado");

    event.waitUntil(clients.claim());

});

self.addEventListener("fetch", (event) => {

    event.respondWith(

        fetch(event.request)
            .catch(() => caches.match(event.request))

    );

});