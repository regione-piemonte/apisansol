<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <lms-page class="lms-page-rating" padding>
    <lms-page-title class="q-mb-md">
      Valuta il servizio {{ workingAppName | empty }}
    </lms-page-title>

    <lms-policy v-if="link" :src="link" :iframe-styles="{ height: '780px' }" />
  </lms-page>
</template>

<script>
import LmsPolicy from "../components/core/LmsPolicy";
import {isEmpty} from "src/services/utils";

export default {
  name: "PageServiceRating",
  components: { LmsPolicy },
  data() {
    return {

    };
  },
  computed: {
    link(){
      return this.isCustomerServiceWidget && this.customerSatisfactionUrl ? this.customerSatisfactionUrl :  "url"
    },
    isCustomerServiceWidget(){
      return this.$route.query?.cs
    },
    customerSatisfactionUrl() {
      return this.workingApp?.soddisfazione_cliente_url ??  ''

    },
    workingApp() {
      return this.$store.getters["getWorkingApp"];
    },
    workingAppName() {
      return this.workingApp?.descrizione;
    }
  }
};
</script>

<style scoped></style>
