<!--
 SPDX-License-Identifier: EUPL-1.2
 Copyright Regione Piemonte - 2023
-->

<template>
  <div class="page-report-image-detail">
    <q-card flat>
      <q-card-section>
        <object
          id="htmlViewer"
          :credentials="credential"
          :accessionNumber="accessionNr"
          align="top"
          data="whtml/index.html"
          keyImagesOnly="true"
          serviceurl="url"
          style="height: 561px; width: 100%"
        >
          <param name="allowScriptAccess" value="sameDomain" />
        </object>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
export default {
  name: "PageReportImageDetail",
  data() {
    return {
      accessionNr: null,
      credential: "xxxxxxxxxxxxxxxx",
    };
  },
  computed: {
    patientTaxCode() {
      return this.$store.getters["getPatientTaxCode"];
    },
  },
  created() {
    let { accessionNr } = this.$route.params;
    this.accessionNr = accessionNr;
  },
};
</script>

<style scoped></style>
