<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-dialog
    :value="value"
    :maximized="$q.screen.lt.sm"
    class="rol-report-download-dialog"
    @input="$emit('input', $event)"
    @hide="resetModalState"
  >
    <q-card style="width: 800px; max-width: 80vh;">
      <!-- HEADER -->
      <!-- --------------------------------------------------------------------------------------------------------- -->
      <q-card-section class="no-padding">
        <q-toolbar class="bg-primary text-white">
          <q-toolbar-title>
            Scarica {{ getTypeLabel(report.tipoReferto) }}
            <template v-if="report">
              <div class="text-caption">
                {{ report.luogo_produzione_documento.struttura.descrizione }} -
                {{ report.data_episodio | date }}
              </div>
            </template>
          </q-toolbar-title>

          <q-btn v-close-popup flat round dense icon="close" />
        </q-toolbar>
      </q-card-section>

      <!-- BODY -->
      <!-- --------------------------------------------------------------------------------------------------------- -->
      <q-card-section>
        <template v-if="!isDownloading">
          <!-- SCARICA REFERTO -->
          <!-- --------------- -->
          <q-card class="bg-secondary text-white q-mb-md">
            <q-card-section>
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-auto text-center">
                  <q-avatar color="white" size="76px">
                    <q-icon
                      name="img:/statics/la-mia-salute/icone/referto.svg"
                      size="xl"
                    />
                  </q-avatar>
                </div>

                <div class="col">
                  <h2 class="text-h6 text-bold q-mt-none q-mb-md">
                    Referto
                  </h2>

                  <p class="text-body1">
                    Tale documento è una copia informatica del referto digitale
                    originale. Utilizzabile esclusivamente a fini personali
                    (detta copia non ha infatti il medesimo valore legale e
                    probatorio del referto originale).
                  </p>

                  <lms-buttons class="q-mt-lg">
                    <lms-button
                      color="white"
                      text-color="primary"
                      unelevated
                      :loading="isDownloadingReport"
                      @click="onDownload(false)"
                    >
                      Scarica
                    </lms-button>
                  </lms-buttons>
                </div>
              </div>
            </q-card-section>
          </q-card>

          <!-- SCARICA REFERTO CON FIRMA DIGITALE -->
          <!-- ---------------------------------- -->
          <template v-if="isDigitallySigned">
            <q-card class="bg-secondary text-white">
              <q-card-section>
                <div class="row q-col-gutter-md">
                  <div class="col-12 col-md-auto text-center">
                    <q-avatar color="white" size="76px">
                      <q-icon
                        name="img:/statics/la-mia-salute/icone/referto-digitale.svg"
                        size="xl"
                      />
                    </q-avatar>
                  </div>

                  <div class="col">
                    <h2 class="text-h6 text-bold q-mt-none q-mb-md">
                      Referto con firma digitale
                    </h2>

                    <p class="text-body1">
                      Il referto firmato digitalmente costituisce un documento
                      originale valido a tutti gli effetti di legge; la firma
                      digitale ne garantisce l'identificabiliatà dell'autore,
                      l'integrità e l'immodificabilità.
                    </p>

                    <p class="text-body1">
                      Per visualizzare il referto firmato digitalmente è
                      necessario installare sul proprio PC il software gratuito
                      DiKe di Infocert (
                      <a :href="dikeUrl" target="_blank">scaricalo ora</a>
                      ) o similari
                    </p>

                    <lms-buttons class="q-mt-lg">
                      <lms-button
                        color="white"
                        text-color="primary"
                        unelevated
                        :loading="isDownloadingReportDigitallySigned"
                        @click="onDownload(true)"
                      >
                        Scarica
                      </lms-button>
                    </lms-buttons>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </template>
        </template>

        <!-- VISUALIZZAZIONE CARICAMENTO -->
        <!-- ------------------------------------------------------------------------------------------------------- -->
        <template v-else>
          <div class="text-center">
            <div class=" q-py-xl">
              <q-spinner color="primary" size="50px" />
            </div>

            <p class="csi-h3 text-primary">Download del referto in corso ...</p>
            <p class="csi-h6">
              Se non dovesse partire
              <a
                href="#"
                @click.prevent="onDownload(isDownloadingReportDigitallySigned)"
              >
                clicca qui
              </a>
            </p>
          </div>
        </template>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { getTypeLabel } from "src/services/business-logic";
import { downloadPdf } from "src/services/api";

export default {
  name: "RolReportDownloadDialog",
  props: {
    value: { type: Boolean, required: true },
    report: { type: Object, required: true }
  },
  data() {
    return {
      downloadDigitallySigned: false,
      isDownloadingReport: false,
      isDownloadingReportDigitallySigned: false,
      hideTimeout: null
    };
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
    },
    isDigitallySigned() {
      return this.report.firmato_digitalmente;
    },
    dikeUrl() {
      if (this.$q.platform.is.ios) {
        return "url";
      }

      if (this.$q.platform.is.android) {
        return "url";
      }

      return "url";
    },
    isDownloading() {
      return (
        this.isDownloadingReport || this.isDownloadingReportDigitallySigned
      );
    }
  },
  methods: {
    getTypeLabel,
    onDownload(digitallySigned = false) {
      let id = this.report?.id_referto;
      let params = {};

      if (digitallySigned) params.firmato = "S";

      digitallySigned
        ? (this.isDownloadingReportDigitallySigned = true)
        : (this.isDownloadingReport = true);

      console.log('before download');
      downloadPdf(this.taxCode, id, { params });

      // dopo 5 secondi chiudiamo la modal
      if (this.hideTimeout) clearTimeout(this.hideTimeout);
      console.log('starting timeout');
      this.hideTimeout = setTimeout(() => this.$emit("input", false), 5000);
    },
    resetModalState() {
      this.isDownloadingReport = false;
      this.isDownloadingReportDigitallySigned = false;
    }
  }
};
</script>

<style lang="sass"></style>
