<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <lms-page padding>
    <lms-page-title>
      Privacy e condizioni d'uso
    </lms-page-title>

    <lms-policy :src="url" class="q-mt-md" />
  </lms-page>
</template>

<script>
import LmsPolicy from "../components/core/LmsPolicy";

export default {
  name: "PageInformative",
  components: { LmsPolicy },
  data() {
    return {};
  },
  computed: {
    url() {
      return "vaccinations.html";
    }
  },
  methods: {}
};
</script>

<style lang="sass"></style>
