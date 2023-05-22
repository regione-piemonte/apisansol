<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-dialog
    v-bind="attrs"
    v-on="listeners"
    class="cod-document-download-image-dialog"
    ref="downloadImageDialog"
  >
    <q-card style="max-width: 800px">
      <q-toolbar>
        <q-toolbar-title>
          Scarica immagine
        </q-toolbar-title>

        <q-btn v-close-popup aria-label="chiudi finestra" flat icon="close" round/>
      </q-toolbar>

      <q-card-section class="q-gutter-y-md">
        <q-banner class="q-mt-md bg-blue-2" rounded>
          <strong>Attenzione!</strong><br>
          Lo scarico del file contenente le immagini potrebbe richiedere tempi lunghi di attesa: quando sarà terminato,
          il sistema aprirà una nuova finestra per consentirti di salvare il file sul tuo dispositivo.

        </q-banner>

        <lms-buttons>
          <lms-button :loading="isDownloadingImage" @click="onImageDownload">Scarica immagine</lms-button>
          <lms-button v-close-popup outline>Annulla</lms-button>
        </lms-buttons>
      </q-card-section>


    </q-card>
  </q-dialog>
</template>

<script>
import {getDocumentFseImageDownloadUrl2} from "src/services/api";
import {openURL} from "quasar";
import {apiErrorNotifyDialog} from "src/services/utils";

export default {
  name: "CodDocumentDownloadImageDialog",
  props: {
    document: {type: Object, required: true, default: null}
  },
  data() {
    return {
      isDownloadingImage: false
    }
  },
  computed: {
    user() {
      return this.$store.getters["getUser"];
    },
    attrs() {
      const {...attrs} = this.$attrs;
      return attrs;
    },
    listeners() {
      const {...listeners} = this.$listeners;
      return listeners;
    },

    isDocumentIlec() {
      return this.document?.id_documento_ilec;
    },
    documentCl() {
      return this.document?.codice_cl;
    },

  },
  methods: {
    async onImageDownload() {
      let taxCode = this.$store.getters["getTaxCode"];
      let documentId = this.document?.metadati?.codice_documento_dipartimentale;

      this.isDownloadingImage = true;


      let userApplicant = this.$store.getters["getUser"];
      let archDocumentIlec = this.document?.rol === "S" ? 'ROL' : 'FSE';

      let payload = {
        cfAssistito: taxCode,
        cfRichiedente: userApplicant?.cf,
        idDocumentoIlec: this.isDocumentIlec,
        codCL: this.documentCl,
        archivioDocumentoIlec: archDocumentIlec
      }

      try {
        let url = getDocumentFseImageDownloadUrl2(payload);
        openURL(url);


        try {
          let userAudit = this.$store.getters["getUser"];
          let taxCodeAudit = this.$store.getters["getTaxCode"];

          let payloadAudit = {
            codice_verticale: "COD",
            codice_audit: "COD",
            parametri: [
              // {indice: "1", valore: userAudit?.cf},
              // {indice: "2", valore: taxCodeAudit},
              {indice: "1", valore: documentId}
            ]
          };

          // createAudit(taxCodeAudit, payloadAudit);
        } catch (error) {
          console.error(error);
        }
      } catch (error) {
        let message = "Non è stato possibile scaricare l'immagine";
        apiErrorNotifyDialog({error, message});
      }


      this.isDownloadingImage = false;
      this.$refs.downloadImageDialog?.hide()
    },

  }
}
</script>

<style scoped>

</style>
