<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-dialog
    v-bind="attrs"
    v-on="listeners"
    class="fse-document-image-booking-dialog"
    :maximized="$q.screen.lt.sm"
    @before-show="onBeforeShow"
  >
    <q-card style="max-width: 800px">
      <q-toolbar>
        <q-toolbar-title>
          Prenota immagine
        </q-toolbar-title>

        <q-btn v-close-popup flat round icon="close"   aria-label="chiudi finestra"/>
      </q-toolbar>

      <q-form
        ref="imageBookingForm"
        novalidate
        greedy
        @submit.prevent="onBooking"
      >
        <q-card-section class="q-gutter-y-md">
          <p>
            Le immagini saranno disponibili appena concluse le elaborazioni
            necessarie. <br />
            I tempi di attesa potranno variare in base al numero di immagini e
            alla loro dimensione.
          </p>

          <q-select
            v-model="osSelectedCode"
            :options="osList"
            label="Sistema operativo"
            option-value="codice"
            option-label="descrizione"
            emit-value
            map-options
            required
            :rules="[v => !!v || 'Campo obbligatorio']"
            no-error-icon
          />

          <lms-buttons class="q-mt-xl">
            <lms-button type="submit" :loading="isBooking">
              Prenota
            </lms-button>
          </lms-buttons>
        </q-card-section>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script>
import { apiErrorNotifyDialog } from "../services/utils";
import { createImageBooking } from "../services/api";
import { DOCUMENT_IMAGE_OS_MAP } from "../services/config";

export default {
  name: "FseDocumentImageBookingDialog",
  inheritAttrs: false,
  props: {
    document: { type: Object, required: false, default: () => null }
  },
  data() {
    return {
      isBooking: false,
      osSelectedCode: null
    };
  },
  computed: {
    user() {
      return this.$store.getters["getUser"];
    },
    osList() {
      return [
        { codice: DOCUMENT_IMAGE_OS_MAP.WINDOWS, descrizione: "Windows" },
        { codice: DOCUMENT_IMAGE_OS_MAP.UNIX, descrizione: "Unix" },
        { codice: DOCUMENT_IMAGE_OS_MAP.MAC, descrizione: "Mac" }
      ];
    },
    attrs() {
      const { ...attrs } = this.$attrs;
      return attrs;
    },
    listeners() {
      const { ...listeners } = this.$listeners;
      return listeners;
    }
  },
  created() {},
  methods: {
    onBeforeShow() {
      if (!this.transcription) {
        this.loadTranscription();
      }
    },
    async onBooking() {
      let taxCode = this.$store.getters["getTaxCode"];
      let documentId = this.document?.id_documento_ilec;

      let payload = {
        sistema_operativo: this.osSelectedCode
      };

      this.isBooking = true;

      try {
        let { data } = await createImageBooking(taxCode, documentId, payload);
      } catch (error) {
        let message = "Non è stato possibile prenotare il referto";
        apiErrorNotifyDialog({ error, message });
      }

      this.isBooking = false;
    }
  }
};
</script>

<style scoped lang="sass"></style>
