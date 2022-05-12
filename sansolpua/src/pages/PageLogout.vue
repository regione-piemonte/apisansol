<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-layout>
    <q-page-container>
      <q-page padding>
        <div class="absolute-center text-center full-width q-px-md">
          <div class="text-center ">
            <img
              src="/statics/la-mia-salute/immagini/logout-spinner.gif"
              alt="A presto"
              class="responsive csi-logout-spinner"
            />
          </div>

          <h1 class="csi-h1 text-primary q-mt-xl">
            Stai per essere disconnesso
          </h1>
        </div>

        <!-- IFRAME LIST -->
        <!-- ------------------------------------------------------------------------------------------------------- -->
        <iframe
          v-for="url in logoutUrlList"
          :key="url"
          :src="url"
          frameborder="0"
          height="0"
          width="0"
          @load="onLoad($event, url)"
          @error="onLog($event, url, 'onError')"
          @abort="onLog($event, url, 'onAbort')"
          @cancel="onLog($event, url, 'onCancel')"
          @change="onLog($event, url, 'onChange')"
          @ended="onLog($event, url, 'onEnded')"
          @loadstart="onLog($event, url, 'onLoadStart')"
          @stalled="onLog($event, url, 'onStalled')"
          @suspend="onLog($event, url, 'onSuspend')"
          @waiting="onLog($event, url, 'onWaiting')"
        />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: "PageLogout",
  props: {},
  data() {
    return {
      logoutUrlList: [],
      loadedList: [],
      testUrl: ""
    };
  },
  computed: {},

  created() {
    this.logoutUrlList = [

    ];

    // Dopo 2 secondi carichiamo la nostra pagina di logout
    setTimeout(() => {
      window.location.assign("url");
    }, 2000);
  },
  methods: {
    onLoad(event, url) {
      console.log("[IFrame] onLoad: ", { event, url });
      this.loadedList.push(url);
    },
    onLog(event, url, mex) {
      console.log("[IFrame] ", mex, ": ", { event, url });
      this.loadedList.push(url);
    },
    timeout(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
  }
};
</script>

<style>
.csi-logout-spinner {
  transform: scale(0.7, 0.7);
}
</style>
