<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <lms-page padding class="rol-page-report-list">
    <template v-if="isLoading">
      <div class="q-mt-md q-mb-lg">
        <q-skeleton type="QChip" width="200px" class="q-mx-auto" />
      </div>

      <div class="q-gutter-y-md no-margin">
        <rol-report-list-item-skeleton v-for="i in 3" :key="i" />
      </div>
    </template>

    <div v-if="!isLoading && user">
      <!-- CONTO REFERTI -->
      <!-- --------------------------------------------------------------------------------------------------------- -->
      <div class="row items-center justify-center q-mt-md q-mb-lg">
        <div class="col-auto">
          <q-chip color="info" text-color="black" class="text-bold">
            <template v-if="reportList.length <= 0">
              Nessun referto disponibile
            </template>

            <template v-else-if="reportList.length === 1">
              Hai 1 referto disponibile
            </template>

            <template v-else>
              Hai {{ reportList.length }} referti disponibili
            </template>
          </q-chip>
        </div>
      </div>

      <!-- STATO VUOTO -->
      <!-- --------------------------------------------------------------------------------------------------------- -->
      <div v-if="reportList.length <= 0">
        <q-card>
          <q-card-section>
            <div class="row q-col-gutter-y-sm">
              <div class="col-12 col-sm col-lg-5 q-px-lg">
                <q-img
                  src="/statics/la-mia-salute/immagini/rol-no-referti.svg"
                  alt="Immagine banner"
                  basic
                />
              </div>

              <div class="col-s12 col-sm">
                <p class="text-body1">
                  Questo servizio permette ad un cittadino maggiorenne di
                  scaricare i propri referti, o quelli dei soggetti deleganti,
                  evitando di recarsi personalmente presso la struttura
                  sanitaria per il ritiro obbligatorio del referto cartaceo.
                  <br />
                  Questa modalità di ritiro è in progressiva estensione in tutto
                  il territorio piemontese. <br />
                  Per poter scaricare il referto è necessario aver pagato il
                  ticket (se non esente).
                </p>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- LISTA -->
      <!-- --------------------------------------------------------------------------------------------------------- -->
      <div class="q-gutter-y-md no-margin">
        <rol-report-list-item
          v-for="(report, index) in reportList"
          :key="index"
          :item="report"
          @detail="goToDetail(report)"
          @download="onDownload(report)"
          @image-request="onImageRequest(report)"
          @image-download="onImageDownload(report)"
          @pay="onPay(report)"
        />
      </div>
    </div>

    <!-- MODALS -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <!-- DOWNLOAD MODAL -->
    <!-- -------------- -->
    <template v-if="reportToDownload">
      <rol-report-download-dialog
        v-model="isDownloadModalVisible"
        :report="reportToDownload"
      />
    </template>

    <!-- IMAGE REQUEST MODAL -->
    <!-- ------------------- -->
    <rol-report-image-request-dialog
      v-model="isImageRequestModalVisible"
      :report-id="reportImageId"
    />

    <!-- IMAGE DOWNLOAD MODAL -->
    <!-- -------------------- -->
    <template v-if="isImageDownloadModalVisible">
      <rol-report-image-download-dialog
        v-model="isImageDownloadModalVisible"
        :report-id="reportImageId"
        :package-id="reportImagePackageId"
      />
    </template>

    <!-- PAY MODAL -->
    <!-- --------- -->
    <template v-if="isPayModalVisible">
      <rol-report-pay-dialog
        v-model="isPayModalVisible"
        :report="reportToDownload"
      />
    </template>
  </lms-page>
</template>

<script>
import { apiErrorNotify } from "../services/utils";
import { ANONYMOUS, REPORT_DETAIL } from "../router/routes";
import { getReportList } from "../services/api";
import RolReportListItem from "../components/RolReportListItem";
import RolReportImageDownloadDialog from "../components/RolReportImageDownloadDialog";
import RolReportDownloadDialog from "../components/RolReportDownloadDialog";
import RolReportImageRequestDialog from "../components/RolReportImageRequestDialog";
import RolReportPayDialog from "../components/RolReportPayDialog";
import RolReportListItemSkeleton from "../components/RolReportListItemSkeleton";

export default {
  name: "PageReportList",
  components: {
    RolReportListItemSkeleton,
    RolReportPayDialog,
    RolReportImageRequestDialog,
    RolReportDownloadDialog,
    RolReportImageDownloadDialog,
    RolReportListItem
  },
  data() {
    return {
      isLoading: false,
      isDownloadModalVisible: false,
      isImageRequestModalVisible: false,
      isImageDownloadModalVisible: false,
      isPayModalVisible: false,
      reportList: [],
      reportToDownload: null,
      reportImageId: null,
      reportImagePackageId: null
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
        return this.delegatorSelected?.codice_fiscale_delega;
      }

      return this.user?.cf ?? null;
    }
  },
  watch: {
    taxCode: {
      immediate: true,
      handler() {
        if (!this.user) return;
        this.loadReportList();
      }
    }
  },
  created() {
    if (!this.user) {
      this.$router.replace(ANONYMOUS);
    }
  },
  methods: {
    async loadReportList() {
      this.isLoading = true;
      this.reportList = [];

      try {
        let { data } = await getReportList(this.taxCode);
        this.reportList = data;
      } catch (error) {
        let message = "Non è stato possibile caricare l'elenco dei referti";
        let canTryAgain = true;
        let onTryAgain = this.loadReportList;
        apiErrorNotify({ error, message, canTryAgain, onTryAgain });
      }

      this.isLoading = false;
    },
    onDownload(report) {
      this.reportToDownload = report;
      this.isDownloadModalVisible = true;
    },
    onImageRequest(report) {
      this.reportImageId = report.id_referto;
      this.isImageRequestModalVisible = true;
    },
    onImageDownload(report) {
      this.reportImageId = report.id_referto;
      this.reportImagePackageId = report.id_pacchetto;
      this.isImageDownloadModalVisible = true;
    },
    onPay(report) {
      this.reportToDownload = report;
      this.isPayModalVisible = true;
    },
    goToDetail(report) {
      let name = REPORT_DETAIL.name;
      let params = { id: report.id_referto, report };
      this.$router.push({ name, params });
    }
  }
};
</script>

<style lang="sass"></style>
