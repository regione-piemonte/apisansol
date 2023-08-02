<!--
 SPDX-License-Identifier: EUPL-1.2
 Copyright Regione Piemonte - 2023
-->

<template>
  <csi-page padding>
    <csi-banner type="info" class="q-mb-lg">
      Come previsto dalla normativa, le eventuali esenzioni a maggior tutela non
      vengono mostrate
    </csi-banner>

    <div class="row items-stretch q-col-gutter-md">
      <template v-if="isLoadingExemptionList">
        <div
          v-for="i in 6"
          :key="'list-skeleton--' + i"
          class="col-lg-4 col-md-6 col-12"
        >
          <q-card class="fit">
            <fse-exemption-item-skeleton />
          </q-card>
        </div>
      </template>

      <template v-else-if="exemptionList.length > 0">
        <div
          v-for="(exemption, index) in exemptionList"
          :key="'exemption-container-item--' + index"
          class="col-xl-4 col-md-6 col-12"
        >
          <fse-exemption-item :exemption="exemption" />
        </div>
      </template>

      <div v-else class="q-ma-sm">
        <csi-banner type="info"> Il paziente non ha esenzioni </csi-banner>
      </div>
    </div>
  </csi-page>
</template>

<script>
import FseExemptionItem from "components/exemptions/FseExemptionItem";

import { getExemptionsList } from "src/services/api";
import { apiErrorNotify } from "src/services/utils";
import { PERIOD_LIST_FILTER } from "src/services/global/config";
import { date } from "quasar";
import {
  DOCUMENT_CATEGORY_MAP,
  DOCUMENT_TYPE_EXEMPTION_LIST,
} from "src/services/documents/config";
import FseExemptionItemSkeleton from "components/exemptions/FseExemptionItemSkeleton";

import { getDocumentFseTypeList } from "src/services/documents/business-logic";

const { startOfDate, endOfDate, formatDate } = date;

export default {
  name: "PageExemptions",
  components: {
    FseExemptionItemSkeleton,
    FseExemptionItem,
  },
  data() {
    return {
      isLoadingExemptionList: false,
      isLoadingDocumentList: false,
      isLoadingMoreDocumentList: false,
      exemptionList: [],
      documentList: [],
      offset: 0,
      filterPeriodCode: null,
      endDate: null,
      startDate: null,
      filterParams: null,
      isFirstLoading: true,
      documentListCount: Number.MAX_SAFE_INTEGER,
    };
  },
  computed: {
    patientTaxCode() {
      let patient = this.$store.getters["getActivePatient"];
      return patient?.codice_fiscale;
    },
    categoryList() {
      let categories = this.$store.getters["getDocumentCategoriesList"];
      return categories?.filter(
        (c) => c.codice_categoria === DOCUMENT_CATEGORY_MAP.FSE
      );
    },
    documentTypeList() {
      return getDocumentFseTypeList(DOCUMENT_TYPE_EXEMPTION_LIST);
    },
    hasMoreDocuments() {
      return this.documentList?.length < this.documentListCount;
    },
  },
  created() {
    let period = PERIOD_LIST_FILTER.find((p) => p.codice === "005");
    this.filterPeriodCode = period.codice;

    this.loadExemptionList();
  },
  methods: {
    async loadExemptionList() {
      this.isLoadingExemptionList = true;
      this.isLoadingExemptionList = true;
      try {
        let { data: exemptions } = await getExemptionsList(this.patientTaxCode);
        this.exemptionList = exemptions;
      } catch (error) {
        let message =
          "Non è stato possibile recuperare la lista delle esenzioni.";
        apiErrorNotify({ error, message });
      }

      this.isLoadingExemptionList = false;
    },
  },
};
</script>

<style scoped></style>
