<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="csi-service-worker-guard">

    <!-- AGGIORNAMENTO -->
    <!-- Se l'aggiornamento è obbligatorio => mostriamo da subito il loader dell'aggiornamento -->
    <!-- Altrimenti aspettiamo il segnale di "aggiornamento in corso" -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <template v-if="isAppUpdateMandatory || isRefreshing">
      <csi-app-updating-loader>
        <template slot="text">
          Aggiornamento in corso ...
        </template>
      </csi-app-updating-loader>
    </template>

    <!-- APP -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <slot v-else />
  </div>
</template>


<script>
  import {register} from 'register-service-worker';
  import CsiAppUpdatingLoader from "components/global/common/CsiAppUpdatingLoader";

  export default {
    name: 'CsiAppGuardServiceWorker',
    components: {CsiAppUpdatingLoader},
    props: {},
    data() {
      return {
        // il SW sta scaricando i nuovi contenuti?
        isUpdating: false,
        // il SW ha finito di scaricare i nuovi contenuti?
        isUpdated: false,
        // il SW sta pulendo la cache vecchia per aggiornarla con i nuovi contanuti scaricati?
        isRefreshing: false,
      }
    },
    computed: {
      isAppUpdateMandatory() {
        return this.$store.getters['global/isAppUpdateMandatory']
      }
    },
    created() {
      this.registerSw()
    },
    methods: {
      registerSw() {


        // Possibili stati SW:
        //    "installing" - the install event has fired, but not yet complete
        //    "installed"  - install complete
        //    "activating" - the activate event has fired, but not yet complete
        //    "activated"  - fully active
        //    "redundant"  - discarded. Either failed install, or it's been replaced by a newer version
        let hooks = {
          // Service worker has been registered
          // Il primo evento ad essere chiamato quando il SW è stato appena registrato
          registered: this.registered,


          // A wild service worker has appeared in reg.installing!
          // New content is downloading
          updatefound: this.updatefound,

          // Triggered when:
          //    1. after the registration, there is a SW in 'registration.waiting'.
          //       So there is a new SW waiting to control the page.
          //    2. when a new SW change his state from "installing" to "installed" and the page is still
          //       controlled by the old SW
          //
          // At this point, the old content will have been purged and
          // the fresh content will have been added to the cache.
          // It's the perfect time to display a "New content is
          // available; please refresh." message in your web app.
          updated: this.updated,

          // Triggered only in Development (localhost)
          // App is being served from cache by a service worker
          ready: this.ready,

          // Triggered when a new SW change his state from "installing" to "installed" and the page is not
          // controlled by an old SW. So this is not an update, is a fresh installation of the SW
          //
          // At this point, everything has been precached.
          // It's the perfect time to display a
          // "Content is cached for offline use." message.
          cached: this.cached,

          // Triggered only in Development (localhost)
          // No internet connection found. App is running in offline mode.
          offline: this.offline,

          // Error during service worker registration
          error: this.error
        }

        // register(process.env.SERVICE_WORKER_FILE, {
        // register(`${config.envs.PUBLIC_PATH}/service-worker.js`, {
        register(`service-worker.js`, hooks)

        // ServiceWorkerRegistration: https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration
      },
      ready(registration) {
        console.debug('[Service Worker Hook] ready()', {registration})
      },
      registered(registration) {
        console.debug('[Service Worker Hook] registered()', {registration})
      },
      cached(registration) {
        console.debug('[Service Worker Hook] cached()', {registration});
        // this.$q.notify({
        //   message: 'Contenuti salvati in cache per uso offline.',
        //   type: 'positive',
        //   icon: 'offline_pin',
        //   position: 'bottom-right'
        // })
      },
      updatefound(registration) {
        console.debug('[Service Worker Hook] updatefound()', {registration})

        // Se la pagina non è già controllata da un SW si tratta probabilmente della prima installazione
        // in questo caso non mostriamo nessuna UI di aggiornamento
        let isControlled = navigator.serviceWorker.controller
        this.isUpdating = isControlled
      },
      updated(registration) {
        console.debug('[Service Worker Hook] updated()', {registration});
        this.isUpdated = true

        this.isAppUpdateMandatory
          ? this.onUpdateMandatory(registration)
          : this.onUpdateOptional(registration)
      },
      offline() {
        console.debug('[Service Worker Hook] offline()')
        this.$q.notify({
          message: 'Sei offline.',
          color: 'warning',
          position: 'bottom-right'
        })
      },
      error(err) {
        console.error('[Service Worker Hook] error()', {err})
      },
      onUpdateOptional(registration) {
        this.$q.notify({
          message: 'Nuovi contenuti disponibili.',
          type: 'info',
          icon: 'update',
          position: 'bottom-right',
          timeout: 0,
          actions: [
            {label: 'Aggiorna', handler: () => this.skiWaitingAndRefreshThePage(registration)}
          ]
        });
      },
      onUpdateMandatory(registration) {
        this.skiWaitingAndRefreshThePage(registration)
      },
      skiWaitingAndRefreshThePage(registration) {
        // Se la registrazione non è in stato "waiting" => non facciamo nulla
        if (!registration.waiting) return

        // Gestiamo eventuali click furiosi sul bottone
        if (this.isRefreshing) return
        this.isRefreshing = true

        // diciamo al nuovo SW che si trova sicuramente nello stato "waiting" di diventare attivo
        registration.waiting.postMessage({action: 'skipWaiting'})

        // aspettiamo il cambio di stato
        navigator.serviceWorker.addEventListener('controllerchange', event => {
          // a questo punto il nuovo SW è attivo e possiamo effettuare il reaload della pagina
          console.debug('[Service Worker event][controllerchange]', {event})
          location.reload()
        })
      }
    },
  }
</script>


<style scoped lang="stylus"></style>
