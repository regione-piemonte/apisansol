<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-dialog
    :value="value"
    @input="$emit('input', $event)"
    :content-css="{ maxWidth: '800px' }"
  >
    <q-card>
      <q-card-section>
        <p>
          Il pacchetto che stai per scaricare contiene le immagini radiologiche
          e un visualizzatore utile allo loro consultazione.
        </p>
        <p>
          Il visualizzatore non è un dispositivo medicale in base alla
          definizione prevista dalla Direttiva CEE 93/42, recepita in Italia con
          il decreto legislativo n.46/1997 e pertanto non può essere utilizzato
          a fini diagnostici
        </p>
      </q-card-section>

      <q-card-section>
        <lms-buttons class="q-mt-xl">
          <lms-button label="Scarica" @click="download" />
          <lms-button v-close-popup outline label="annulla" />
        </lms-buttons>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { downloadReportImage } from "src/services/api";

export default {
  name: "RolReportImageDownloadDialog",
  props: {
    reportId: { required: true },
    packageId: { required: true },
    value: { type: Boolean, required: false, default: false }
  },
  data() {
    return {};
  },
  computed: {
    user() {
      return this.$store.getters["getUser"];
    },
    delegatorSelected() {
      return this.$store.getters["getDelegatorSelected"];
    },
    taxCode() {
      if (this.delegatorSelected) {
        return this.delegatorSelected.codice_fiscale_delega;
      }

      return this.user?.cf;
    }
  },
  methods: {
    download() {
      let id = this.reportId;
      let zipId = this.packageId;
      downloadReportImage(this.taxCode, id, zipId);
      this.$emit("input", false);
    }
  }
};
</script>

<style scoped lang="stylus"></style>
