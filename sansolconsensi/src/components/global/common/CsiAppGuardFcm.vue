<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<style scoped></style>


<template>
  <div>

    <slot/>

    <!-- MODAL DI RICHIESTA -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <q-modal v-model="isPermissionModalOpen" :position="modalPosition" @hide="onHide">
      <div class="q-pa-md">

        <h4 class="no-margin">Notifiche Push</h4>

        <p>
          <span class="text-italic">Salute Piemonte</span>
          vorrebbe mandarti delle notifiche in caso di eventi importanti.
        </p>

        <div class="row gutter-sm justify-end">
          <div>
            <q-btn color="primary" outline v-close-overlay label="No, grazie"/>
          </div>
          <div>
            <q-btn color="primary" @click="onUiPermissionGranted" label="Ok"/>
          </div>
        </div>
      </div>
    </q-modal>

  </div>
</template>


<script>
  import {isEmpty, isNil} from "@services/global/utils";
  import {
    getToken,
    initFcm,
    listeningTokenRefresh,
    requestPermission,
    setForegroundMessageHandler
  } from "@services/global/fcm";
  const STORAGE_KEY = 'LMS_PWA_BANNER_FCM_DO_NOT_ASK';
  export default {
    name: "CsiAppGuardFcm",
    data() {
      return {
        isPermissionModalOpen: false,
        modalPosition: 'bottom'
      }
    },
    computed: {
      fcmToken() {
        return this.$store.getters['global/fcmToken']
      },
      hasFcmToken() {
        return this.$store.getters['global/hasFcmToken']
      },
      isUserLogged() {
        return this.$store.getters['global/isUserLogged']
      },
      userContacts() {
        return this.$store.getters['global/userContacts']
      },
      watchable() {
        return {
          hasFcmToken: this.hasFcmToken,
          isUserLogged: this.isUserLogged,
          userContacts: this.userContacts,
        }
      }
    },
    async created() {
      let noPopup = location.href.includes("nopopup");
      if (noPopup) return;

      this.messaging = null;

      this.$root.$on('csi-fcm-ask-permission', this.askUiPermission)

      await this.configureFcm()

      // Solo se NON siamo su iOS
      // Se l'utente non ha già un token, è loggato ed ha i contatti impostati (ha terminato il flusso delle preferenze)
      // => gli chiediamo i permessi per le notifiche
      this.$watch(
        () => this.watchable,
        {
          immediate: true,
          handler(val, oldVal) {
            console.debug('[Watch] watchable', {val, oldVal})
            let isIos = this.$q.platform.is.ios;
            let {hasFcmToken, isUserLogged, userContacts} = val
            let isPermissionAsked = this.$q.sessionStorage.get.item(STORAGE_KEY)
            if (!isIos && !hasFcmToken && isUserLogged && !isEmpty(userContacts) && !isPermissionAsked) {
              this.$root.$emit('csi-fcm-ask-permission')
            }
          }
        }
      )
    },
    methods: {
      retrieveServiceWorker() {
        if ('serviceWorker' in navigator) {
          return navigator.serviceWorker.register(`service-worker.js`)
        }
      },
      async configureFcm() {
        let registration = await this.retrieveServiceWorker()
        this.messaging = initFcm(registration)
        setForegroundMessageHandler(this.messaging, this.onForegroundMessage)
        await this.getToken()
      },
      async getToken() {
        let token = await getToken(this.messaging)
        if (token) this.$store.dispatch('global/setFcmToken', token)
      },
      askUiPermission() {
        console.debug('[FCM Flow] Asking with UI')
        this.isPermissionModalOpen = true
      },
      onUiPermissionGranted() {
        console.debug('[FCM Flow] UI Permissions granted')
        this.isPermissionModalOpen = false
        this.askPermission()
      },
      async askPermission() {
        await requestPermission(this.messaging)
        listeningTokenRefresh(this.messaging, this.getToken)
        this.getToken()
      },
      onForegroundMessage(payload) {

        let actions = []
        let callToAction = {
          label: 'vai',
          handler: () => {
            if (isNil(payload.notification.click_action)) return;
            window.location = payload.notification.click_action;
          }
        }

        // Se nella notifica è presente la call to action => aggiungiamo il bottone per invocare la call to action
        if (payload.notification.click_action) {
          actions = [...actions, callToAction]
        }

        let options = {
          message: payload.notification.title,
          detail: payload.notification.body,
          type: 'info',
          position: 'top',
          timeout: 5000,
          actions
        }

        this.$q.notify(options);
      },
      onHide(){
        this.$q.sessionStorage.set(STORAGE_KEY, true)
      }
    }
  }
</script>
