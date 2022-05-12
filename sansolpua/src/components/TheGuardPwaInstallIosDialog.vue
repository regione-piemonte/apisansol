<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="the-guard-pwa-install-ios-dialog">
    <slot/>

    <!-- MODAL DI RICHIESTA -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <q-dialog v-model="isInstallBannerVisible" position="bottom" >
      <q-card class="pwa-install-ios">
        <div class="q-pa-md">
          <p class="text-h4 text-primary text-bold">
            Installa "Salute Piemonte" sul tuo dispositivo
          </p>

          <p>
            Tocca l'icona
            <q-icon name="mdi-export-variant" size="sm"/>
            che trovi in basso e poi
            "
            <span class="text-bold">Aggiungi alla schermata Home.</span>
            <q-icon name="mdi-plus-box-outline" size="sm" class="q-ml-sm"/>
            "
            per installare "Salute Piemonte" sul tuo dispositivo
          </p>

          <lms-buttons class="q-mt-lg">
            <lms-button v-close-popup outline label="Chiudi"/>
            <lms-button  v-close-popup  flat label="Non dirmelo più" @click="onDoNotAsk"/>
          </lms-buttons>
        </div>
      </q-card>

    </q-dialog>
  </div>
</template>

<script>
const STORAGE_KEY = 'KEY';
export default {
  name: "TheGuardPwaInstallIosDialog",
  data() {
    return {
      isInstallBannerVisible: false
    }
  },
  mounted() {
    let noPopup = location.href.includes("nopopup");
    if (noPopup) return;

    let isIos = this.$q.platform.is.ios;
    // let isInstalledApp = 'standalone' in navigator;
    let isInstalledApp = window.navigator.standalone;
    let doNotAsk = this.$q.localStorage.getItem(STORAGE_KEY);
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
  .pwa-install-ios{
    max-width: 580px
  }

</style>
