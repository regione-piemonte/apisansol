<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-dialog
    :maximized="$q.screen.lt.md"
    v-bind="attrs"
    v-on="listeners">
    <q-card  class="q-pa-md text-center lms-qr-code-modal full-height" :class="{'minWidth': $q.screen.gt.sm}">
      <q-card-section class="row items-center no-padding">
        <q-space/>
        <q-btn icon="close" flat round dense v-close-popup/>
      </q-card-section>
        <template v-if="pin && taxCode">
          <div class="text-h3 justify-center "  >Il tuo codice QR:</div>
          <vue-qrcode
            tag="div"
            :value="qrCodeString"
            :options="qrCodeOption"
          >
          </vue-qrcode>

          <div class="q-mb-md">
            Ti ricordiamo che il QR code è personale. Se ritieni che un soggetto non autorizzato possa esserne venuto
            in possesso devi rigenerare il PIN per evitarne un utilizzo fraudolento.
          </div>
        </template>
      <template v-else>
        <q-banner  class="h-banner h-banner--negative">
          <div class="text-body1">
            Non è stato possibile recuperare il QR Code
          </div>
        </q-banner>
      </template>
    </q-card>
  </q-dialog>
</template>

<script>

  import {apiErrorNotify} from "../services/utils";
  import VueQrcode from "@chenfengyuan/vue-qrcode";
  import {getCurrentPin} from "src/services/api";
  export default {
    name: "LmsQrCodeModal",
    components: { VueQrcode },
    props: {
      pin:{type:String, default: null},
      taxCode:{type:String, default: null}
    },

    data(){
      return{
        qrCodeOption:{
          errorCorrectionLevel: 'M',
          version: 2
        }
      }
    },
   computed: {
     attrs() {
       const { ...attrs } = this.$attrs;
       return attrs;
     },
     listeners() {
       const { ...listeners } = this.$listeners;
       return listeners;
     },
     qrCodeString(){
       return this.pin + this.taxCode
     }
    },
  }
</script>

<style lang="sass">
.lms-qr-code-modal.minWidth
  min-width: 400px
</style>
