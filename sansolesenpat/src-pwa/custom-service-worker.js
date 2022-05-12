/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

/*
 * This file (which will be your service worker)
 * is picked up by the build system if BOTH conditions are met:
 *  - You are building for production
 *  - quasar.conf > pwa > workboxPluginMode is set to "InjectManifest"
 */


// Importiamo le librerie di firebase che ci servono.
// NOTA: solo FCM funziona nei service workers
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js');

// Vogliamo che le modifiche siano subito disponibili
// workbox.skipWaiting();
// workbox.clientsClaim();
// Ci mettiamo in ascolto di messaggi da parte dell'applicazione principale
self.addEventListener('message', event => {
  console.debug('[Service Worker event][message]', {event})
  // Se l'app chiede di attivare il SW immediatamente => noi obbediamo
  if (event.data.action === 'skipWaiting') self.skipWaiting()
})


const isDev = location.hostname.includes('localhost')
const isTest = location.hostname.startsWith('tst-')
const isAlpha = location.pathname.startsWith('/alpha/')
const isProduction = !isDev && !isTest && !isAlpha

if (!isProduction) {
  // workbox.setConfig({debug: true});
  // workbox.core.setLogLevel(workbox.core.LOG_LEVELS.debug);
}


self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

const CACHE_NAME = 'CACHE_NAME';

// @see https://developers.google.com/web/tools/workbox/reference-docs/latest/workbox.strategies.NetworkOnly
const API_NETWORK_ONLY = workbox.strategies.networkOnly({
  cacheName: CACHE_NAME,
});


// @see https://developers.google.com/web/tools/workbox/reference-docs/latest/workbox.strategies.CacheFirst
const API_CACHE_FIRST_SHORT_HANDLER = workbox.strategies.cacheFirst({
  cacheName: CACHE_NAME,
  plugins: [
    // cache max 50 responses for 5 minutes
    new workbox.expiration.Plugin({maxEntries: 50, maxAgeSeconds: 5 * 60}),
    // cache only success responses
    new workbox.cacheableResponse.Plugin({statuses: [0, 200]}),
  ],
});

const API_CACHE_FIRST_LONG_HANDLER = workbox.strategies.cacheFirst({
  cacheName: CACHE_NAME,
  plugins: [
    // cache max 50 responses for 1 day
    new workbox.expiration.Plugin({maxEntries: 50, maxAgeSeconds: 1 * 60 * 60 * 24}),
    // cache only success responses
    new workbox.cacheableResponse.Plugin({statuses: [0, 200]}),
  ],
});

// @see https://developers.google.com/web/tools/workbox/reference-docs/latest/workbox.strategies.CacheFirst
const API_NETWORK_FIRST_HANDLER = workbox.strategies.networkFirst({
  cacheName: CACHE_NAME,
  plugins: [
    // cache max 50 responses for 5 minutes
    new workbox.expiration.Plugin({maxEntries: 50, maxAgeSeconds: 5 * 60}),
    // cache only success responses
    new workbox.cacheableResponse.Plugin({statuses: [0, 200]}),
  ],
});

// @see https://developers.google.com/web/tools/workbox/reference-docs/latest/workbox.strategies.StaleWhileRevalidate
const API_STALE_WHILE_REVALIDATE_HANDLER = workbox.strategies.staleWhileRevalidate({
  cacheName: CACHE_NAME,
  plugins: [
    // cache max 50 responses for 5 minutes
    new workbox.expiration.Plugin({maxEntries: 50, maxAgeSeconds: 5 * 60}),
    // cache only success responses
    new workbox.cacheableResponse.Plugin({statuses: [0, 200]}),
  ],
});

// @see https://developers.google.com/web/tools/workbox/reference-docs/latest/workbox.routing
// @see https://developers.google.com/web/tools/workbox/modules/workbox-routing
const ROUTES = [
  {capture: new RegExp('URL'), handler: API_CACHE_FIRST_LONG_HANDLER, method: 'GET'},
  {capture: new RegExp('URL'), handler: API_CACHE_FIRST_LONG_HANDLER, method: 'GET'},
  {capture: new RegExp('URL'), handler: API_NETWORK_ONLY, method: 'GET'},
  {capture: new RegExp('URL'), handler: API_NETWORK_ONLY, method: 'GET'},
  {capture: new RegExp('URL'), handler: API_NETWORK_FIRST_HANDLER, method: 'GET'},
  {capture: new RegExp('URL'), handler: API_NETWORK_FIRST_HANDLER, method: 'GET'},
];


ROUTES.forEach(ROUTE => {
  workbox.routing.registerRoute(ROUTE.capture, ROUTE.handler, ROUTE.method);
});


// FCM CODE
// ---------------------------------------------------------------------------------------------------------------------
// Inizializiamo Firebase
// Diciamo qual è il sender che vogliamo ascoltare tramite il "messagingSenderId"
// disponibile nella configurazione del client di firebase
firebase.initializeApp({messagingSenderId: 'SENDER_ID'});

// Otteniamo l'istanza di FCM (Firebase Cloud Messaging) per gestire i messaggi in background
const messaging = firebase.messaging();


// Questo handler viene chiamato quando il messaggio push inviato non contiene la proprietà "notification".
// @NOTE: se il messaggio push inviato contiene la proprietà "notification"
//        => firebase crea un wrapper per generare
//        una notifica veloce, che ha molte restrizioni ed è meno controllabile
messaging.setBackgroundMessageHandler(function (payload) {
  console.debug('Received background message ', payload);
  // Customize notification here
  let data = payload.data;
  let notification = JSON.parse(data.notification);

  let notificationTitle = notification.title;
  let notificationOptions = {
    body: `Inviato al topic: ${data.topic}`,
    actions: notification.actions
  };

  // Mostriamo la notifica all'utente
  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Lifecycle logs
// self.addEventListener('install', (event) => console.debug('onInstall: ', event));
// self.addEventListener('activate', (event) => console.debug('onActivate: ', event));
// self.addEventListener('message', (event) => console.debug('onMessage: ', event));
// self.addEventListener('fetch', (event) => console.debug('onFetch: ', event));
// self.addEventListener('sync', (event) => console.debug('onSync: ', event));
// self.addEventListener('push', (event) => console.debug('onPush: ', event));
// self.addEventListener('notificationclick', (event) => console.debug('onNotificationClick: ', event));
// self.addEventListener('notificationclose', (event) => console.debug('onNotificationClose: ', event));


