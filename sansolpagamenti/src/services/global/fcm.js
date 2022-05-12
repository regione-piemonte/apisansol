/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

// import firebase from 'firebase/app'
// import 'firebase/messaging'
import firebase from '@firebase/app'
import '@firebase/messaging'
import {config} from 'plugins/config'


// Inizializza l'app di firebase con la configurazione
export const initApp = (config) => {
  console.debug('[FCM Flow] Initialize Firebase with config:', {config})
  firebase.initializeApp(config);
}


// Otteniamo un'istanza della FCM (Firebase  Cloud Messaging)
export const createMessaging = () => {
  return firebase.messaging();
}


// Diciamo ad FCM qual è il SW (Service Worker) che gestirà le notifiche push in background
export const setSw = (messaging, swRegistration) => {
  console.debug('[FCM Flow] FCM user this SW:', {sw: swRegistration})
  messaging.useServiceWorker(swRegistration);
}


// Impostiamo le chiavi pubbliche per le notifiche push
export const setVapidKey = (messaging, key) => {
  console.debug('[FCM Flow] FCM user this public key:', {key})
  messaging.usePublicVapidKey(key);
}


// Imposta un handler per le notifiche push che viene invocata quando:
//  - un messaggio arriva in foreground
//  - un utente clicca su una notifica creata da `setBackgroundMessageHandler` nel Service Worker.
//    quindi si tratta di un Data Messages
//
// NOTA: `payload` contiene solo i dati presenti nel campo `data` del messaggio push. La proprietà `notification`
//       viene automaticamente rimossa da Firebase
export const setForegroundMessageHandler = (messaging, handler) => {
  console.debug('[FCM Flow] Configuring foreground messages handler', {handler})

  let _handler = (payload) => {
    console.debug('[FCM Flow] onForegroundMessage: ', payload);
    handler(payload)
  }

  messaging.onMessage(_handler)
}


// Steps di configurazione:
//    1. Inizializza l'app di firebase con la configurazione
//    2. Crea un'istanza di FCM e la configura passando:
//        a. Il SW da usare
//        b. La public key per le API push
//        c. L'handler dei messaggi in foreground
//    3. Prova ad ottenre il token (per controllare se l'utente lo possiede già o meno)
export const initFcm = (swRegistration) => {

  let firebaseConfig = config.global.firebase.config
  let publicVaipdKey = config.global.firebase.publicVaipdKey

  initApp(firebaseConfig)
  let messaging = createMessaging()

  setSw(messaging, swRegistration)
  setVapidKey(messaging, publicVaipdKey)

  return messaging
}


// Ci mettiamo in ascolto del refresh del token FCM
export const listeningTokenRefresh = (messaging, handler) => {
  console.debug('[FCM Flow] Listening to FCM Token refresh...')

  let _handler = () => {
    console.debug('[FCM Flow] FCM Token refresh', {args: arguments})
    handler()
  }

  messaging.onTokenRefresh(_handler)
}


// Chiediamo all'utente di concederci i permessi per ricevere e mostrare le
// notifiche push
export const requestPermission = async (messaging) => {

  try {
    console.debug('[FCM Flow] Asking permission to user')
    let result = await messaging.requestPermission()
    console.debug('[FCM Flow] Notification permission granted.')
    return result
  } catch (err) {
    console.error('[FCM Flow] Unable to get permission to notify.', {err})
    throw err
  }

}


// Prova ad ottenere il token FCM e poi lo salva nello store Vuex
export const getToken = async (messaging) => {
  console.debug('[FCM Flow] Getting token')

  try {
    let token = await messaging.getToken()
    if (token) {
      console.debug('[FCM Flow] Token retrieved', {token})
      // this.$store.dispatch('global/setFcmToken', token)
    } else {
      console.warn('[FCM Flow] There is no token')
    }

    return token
  } catch (err) {
    console.error('[FCM Flow] An error occurred while retrieving token. ', {err})
    throw err
  }
}

