<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-page style="max-width: 100%" class="rol-page-anonymous">
    <template v-if="!IS_PROD">
      <template v-if="user">
        <iframe
          ref="frame"
          src="url"
          class="iframe-public full-page-frame iframe-height"
          scrolling="no"
          @load="onLoadIframe"
        >
        </iframe>
      </template>
      <template v-else>
        <iframe
          ref="frame"
          src="url"
          class="iframe-public full-page-frame iframe-height"
          scrolling="no"
          @load="onLoadIframe"
        >
        </iframe>
      </template>

    </template>

    <!-- ALPHA E PRODUZIONE -->
    <template v-else>
      <template v-if="user">
        <iframe
          ref="frame"
          src="url"
          class="iframe-public full-page-frame iframe-height"
          scrolling="no"
          @load="onLoadIframe"
        >
        </iframe>
      </template>
      <template v-else>
        <iframe
          ref="frame"
          src="url"
          class="iframe-public full-page-frame iframe-height"
          scrolling="no"
          @load="onLoadIframe"
        >
        </iframe>
      </template>

    </template>
  </q-page>
</template>

<script>
import "iframe-resizer";
import { REPORT_LIST } from "../router/routes";

export default {
  name: "PageAnonymous",
  props: {},
  data() {
    return {
      IS_PROD: process.env.APP_IS_PROD
    };
  },
  computed: {
    user() {
      return this.$store.getters["getUser"];
    }
  },
  created() {
  },
  methods: {
    resizer(frame) {
      //iFrameResize({log: true, heightCalculationMethod: 'taggedElement', scrolling: false}, frame)
      iFrameResize(
        { log: true, heightCalculationMethod: "min", scrolling: false },
        frame
      );
    },
    onLoadIframe() {
      this.resizer(this.$refs.frame);
    }
  }
};
</script>

<style lang="sass">
.rol-page-anonymous
  .full-page-frame
    width: 1px
    /*width: 100%;*/
    min-width: 100%
    border: none
    margin: 0 0 -6px 0
    padding: 0
    background: white
    height: 100vh
</style>
