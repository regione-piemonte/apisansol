<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-dialog
    v-bind="attrs"
    v-on="listeners"
    class="fse-document-personal-transcription-dialog"
    @before-show="onBeforeShow"
  >
    <q-card style="max-width: 800px">
      <q-toolbar>
        <q-toolbar-title>
          Trascrizione
        </q-toolbar-title>

        <q-btn v-close-popup flat round icon="close"  aria-label="chiudi finestra" />
      </q-toolbar>

      <q-card-section class="q-gutter-y-md">
        <template v-if="isLoadingTranscription">
          <lms-inner-loading :showing="true" block />
        </template>

        <template v-else>
          {{ text | empty }}
        </template>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { apiErrorNotifyDialog } from "../services/utils";
import { getDocumentPersonalTranscription } from "../services/api";

export default {
  name: "CodDocumentPersonalTranscriptionDialog",
  inheritAttrs: false,
  props: {
    document: { type: Object, required: false, default: () => null }
  },
  data() {
    return {
      isLoadingTranscription: false,
      transcription: null
    };
  },
  computed: {
    user() {
      return this.$store.getters["getUser"];
    },
    attrs() {
      const { ...attrs } = this.$attrs;
      return attrs;
    },
    listeners() {
      const { ...listeners } = this.$listeners;
      return listeners;
    },
    text() {
      return this.transcription?.trascrizione;
    }
  },
  created() {},
  methods: {
    onBeforeShow() {
      if (!this.transcription) {
        this.loadTranscription();
      }
    },
    async loadTranscription() {
      let taxCode = this.$store.getters["getTaxCode"];
      let documentId = this.document?.id_documento_ilec;

      this.isLoadingTranscription = true;

      try {
        let { data } = await getDocumentPersonalTranscription(
          taxCode,
          documentId
        );
        this.transcription = data;
      } catch (error) {
        let message = "Non è stato possibile la trascrizione";
        apiErrorNotifyDialog({ error, message });
      }

      this.isLoadingTranscription = false;
    }
  }
};
</script>

<style scoped lang="sass"></style>
