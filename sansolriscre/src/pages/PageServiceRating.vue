<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <lms-page class="lms-page-rating" padding>
    <lms-page-title class="q-mb-md">Valuta il servizio {{workingAppName | empty}}</lms-page-title>
    <lms-policy v-if="link" :src="link" :iframe-styles="{height: '780px'}"/>
  </lms-page>
</template>

<script>
  import LmsPolicy from "../components/core/LmsPolicy";

  export default {
    name: "PageServiceRating",
    components: {LmsPolicy},
    data() {
      return {
        link: 'url'
      }
    },
    computed:{
      workingApp() {
        return this.$store.getters["getWorkingApp"];
      },
      workingAppName() {
        return this.workingApp?.descrizione;
      },
    }
  }
</script>

<style scoped>

</style>
