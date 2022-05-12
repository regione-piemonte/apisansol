<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <lms-page padding>
    <lms-page-title> Privacy e condizioni d'uso </lms-page-title>

    <div class="q-pa-md">
      <lms-policy :iframe-styles="{ minHeight: '80vh' }">
        <div>testo</div>
      </lms-policy>
    </div>
  </lms-page>
</template>

<script>
import LmsPolicy from "../components/core/LmsPolicy";

export default {
  name: "PageHome",
  components: { LmsPolicy },
  props: {},
  data() {
    return {};
  },
  computed: {},
  created() {},
  methods: {},
};
</script>

<style scoped lang="scss"></style>
