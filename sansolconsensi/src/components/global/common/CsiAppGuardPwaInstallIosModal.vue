<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="csi-app-guard-pwa-install-ios-modal">
    <slot/>

    <!-- MODAL DI RICHIESTA -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <q-modal v-model="isInstallBannerVisible" position="bottom" content-classes="pwa-install-ios">
      <div class="q-pa-md">
        <p class="q-display-1 text-primary text-bold">
          Installa "Salute Piemonte" sul tuo dispositivo
        </p>

        <p>
          Tocca l'icona
          <q-icon name="mdi-export-variant" class="csi-icon--sm"/>
          che trovi in basso e poi
          "
          <span class="text-bold">Aggiungi a home.</span>
          <q-icon name="mdi-plus-box-outline" class="csi-icon--sm q-ml-sm"/>
          "
          per installare "Salute Piemonte" sul tuo dispositivo
        </p>

        <csi-buttons class="q-mt-lg">
          <csi-button v-close-overlay secondary label="Chiudi"/>
          <csi-button v-close-overlay flat label="Non dirmelo più" @click="onDoNotAsk"/>
        </csi-buttons>
      </div>
    </q-modal>
  </div>
</template>

<script>
  const STORAGE_KEY = 'LMS_PWA_BANNER_IOS_DO_NOT_ASK';

  export default {
    name: "CsiAppGuardPwaInstallIosModal",
    props: {},
    data() {
      return {
        isInstallBannerVisible: false
      }
    },
    computed: {},
    mounted() {
      let noPopup = location.href.includes("nopopup");
      if (noPopup) return;

      let isIos = this.$q.platform.is.ios;
      // let isInstalledApp = 'standalone' in navigator;
      let isInstalledApp = window.navigator.standalone;
      let doNotAsk = this.$q.localStorage.get.item(STORAGE_KEY);
      let canShowDialog = isIos && !isInstalledApp && !doNotAsk;

      if (canShowDialog) {
        this.isInstallBannerVisible = true
      }
    },
    methods: {
      onDoNotAsk() {
        this.$q.localStorage.set(STORAGE_KEY, true);
      },
    }
  }
</script>

<style lang="stylus">
  .pwa-install-ios
    max-width 580px
</style>
