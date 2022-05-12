<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
<lms-page padding>
  <lms-page-title>Privacy e condizioni d'uso</lms-page-title>
  <lms-policy :src="policyUrl" class="q-mt-md"/>
</lms-page>
</template>

<script>
import LmsPolicy from "components/core/LmsPolicy";
export default {
  name: "PagePolicy",
  components: {LmsPolicy},

  created() {

  },
  computed: {
    policyUrl() {
      return 'files/delegations-adults.html'
    }
  },
}
</script>

<style scoped>

</style>
