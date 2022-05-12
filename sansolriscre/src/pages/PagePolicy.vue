<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <lms-page padding>
    <lms-page-title>
      Privacy e condizioni d'uso
    </lms-page-title>

    <lms-policy :src="url" class="q-mt-md"/>
  </lms-page>
</template>

<script>
import LmsPolicy from "components/core/LmsPolicy";

export default {
  name: "PagePolicy",
  components: {LmsPolicy},
  data() {
    return {};
  },
  computed: {
    isFse(){
      return this.$route.query?.fse
    },
    url() {
      return this.isFse ? "https://www.salutepiemonte.it/cms/sites/default/files/documentazione/informativa_allegato_FSE_settembre_2020.pdf"
        : "files/privacy-policy.html"
    }
  },
  methods: {}
}
</script>

<style scoped>

</style>
