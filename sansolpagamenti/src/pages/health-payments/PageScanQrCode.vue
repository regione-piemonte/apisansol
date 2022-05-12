<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-page padding>

    <div v-if="!isQrCodeReaderVisible" class="q-pa-sm">
      <div class="q-body-2">
        Vuoi effettuare il tuo pagamento sanitario ancora più velocemente?
      </div>
      <div class="q-body-1 q-mt-sm">
        Effettua la scansione del codice QR presente sul tuo pagamento sanitario e sarai pronto per
        completare l'operazione
      </div>
      <div class="text-right q-mt-md">
        <q-btn @click="showQrCodeReader()" label="Ok, scansiona!" color="primary"></q-btn>
      </div>
    </div>


    <div v-else>
      <div class="q-pa-sm">
        <div class="q-body-2">
          Inquadara bene il codice QR ed in pochi secondi il tuo pagamento sanitario sarà riconosciuto.
        </div>

        <div class="q-caption q-mt-md">
          Tip: se il codice non viene riconosciuto, prova a muovere lentamente il codice QR nell'inquadratura
        </div>
      </div>

      <div class="q-mt-md">
        <qrcode-reader
          @init="onInit"
          @decode="onDecode">
        </qrcode-reader>

        <q-inner-loading :visible="isSpinnerVisible" class="q-mt-lg">
          <q-spinner-grid size="40px" color="primary"></q-spinner-grid>
        </q-inner-loading>
      </div>
    </div>

    <div v-if="qrCodeContent" class="q-pa-sm q-mt-md">
      <div class="q-body-2">Il tuo pagamento sanitario è stato scansionato con successo!</div>
      <blockquote class="q-mt-sm">
        <code>{{qrCodeContent}}</code>
      </blockquote>
    </div>

  </q-page>
</template>

<script>
  import {QrcodeReader} from 'vue-qrcode-reader'

  export default {
    name: 'PageScanQrCode',
    components: {QrcodeReader},
    data() {
      return {
        isSpinnerVisible: true,
        isQrCodeReaderVisible: false,
        qrCodeContent: undefined,
      }
    },
    methods: {
      showQrCodeReader() {
        this.isQrCodeReaderVisible = true;
      },
      async onInit(promise) {
        this.isSpinnerVisible = true;

        try {
          let response = await promise;
          console.debug(response);

          // successfully initialized
        } catch (error) {
          if (error.name === 'NotAllowedError') {
            // user denied camera access permisson
          } else if (error.name === 'NotFoundError') {
            // no suitable camera device installed
          } else if (error.name === 'NotSupportedError') {
            // page is not served over HTTPS (or localhost)
          } else if (error.name === 'NotReadableError') {
            // maybe camera is already in use
          } else if (error.name === 'OverconstrainedError') {
            // passed constraints don't match any camera. Did you requested the front camera although there is none?
          } else {
            // browser is probably lacking features (WebRTC, Canvas)
          }
        } finally {
          this.isSpinnerVisible = false;
        }

      },
      onDecode(content) {
        // ...
        console.log('onDecode:', content);
        this.qrCodeContent = content;
        this.isQrCodeReaderVisible = false;
      },
      onLocate(points) {
        // ...
        // console.log('onLocate:', points);
      }
    }
  }
</script>

<style>
</style>
