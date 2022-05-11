<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <lms-page padding>
    <lms-page-title>
      Dettaglio referto
    </lms-page-title>

    <template v-if="isLoading || !report">
      <rol-report-list-item-skeleton :item="report" detail class="q-mt-md" />
    </template>

    <template v-if="report">
      <rol-report-list-item
        :item="report"
        detail
        class="q-mt-md"
        @download="onDownload(report)"
        @image-request="onImageRequest(report)"
        @image-download="onImageDownload(report)"
        @pay="onPay(report)"
      />
    </template>

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
import { getReportDetail } from "src/services/api";
import { getTypeCode, getTypeLabel } from "src/services/business-logic";
import { apiErrorNotify } from "src/services/utils";
import RolReportDownloadDialog from "src/components/RolReportDownloadDialog";
import RolReportImageDownloadDialog from "src/components/RolReportImageDownloadDialog";
import RolReportPayDialog from "src/components/RolReportPayDialog";
import RolReportImageRequestDialog from "src/components/RolReportImageRequestDialog";
import RolReportListItem from "src/components/RolReportListItem";
import RolReportListItemSkeleton from "../components/RolReportListItemSkeleton";

export default {
  name: "PageReport",
  components: {
    RolReportListItemSkeleton,
    RolReportListItem,
    RolReportImageRequestDialog,
    RolReportPayDialog,
    RolReportImageDownloadDialog,
    RolReportDownloadDialog
  },
  data() {
    return {
      isLoading: false,
      isDownloadModalVisible: false,
      isImageRequestModalVisible: false,
      isImageDownloadModalVisible: false,
      isPayModalVisible: false,
      report: null,
      reportImageId: null,
      reportImagePackageId: null,
      reportToDownload: null
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
    reportTypeCode() {
      if (!this.report) return "";
      return getTypeCode(this.report);
    },
    reportTypeLabel() {
      if (!this.reportTypeCode) return "";
      return getTypeLabel(this.reportTypeCode);
    }
  },
  async created() {
    let { report } = this.$route.params;

    if (report) {
      this.report = report;
    } else {
      this.loadReport();
    }
  },
  methods: {
    async loadReport() {
      this.isLoading = true;

      try {
        let { id } = this.$route.params;
        let taxCode = this.taxCode;
        let { data } = await getReportDetail(taxCode, id);
        this.report = data;
      } catch (error) {
        let message = "Non è stato possibile caricare il referto";
        let canTryAgain = true;
        let onTryAgain = this.loadReport;
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
    }
  }
};
</script>

<style lang="sass"></style>
