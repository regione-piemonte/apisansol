<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<style scoped lang="stylus"></style>


<template>
  <q-page padding>

    <csi-page-title
      title="Termini e condizioni d'uso"
      @back="onBack">
    </csi-page-title>

    <csi-policy :src="termsAndConditionsUrl" class="q-mt-md" />

  </q-page>
</template>


<script>
  import CsiPolicy from "components/global/common/CsiPolicy";
  import CsiPageTitle from "components/global/common/CsiPageTitle";
  import {config} from "@plugins/config";

  export default {
    name: 'PageTermsAndConditions',
    components: {CsiPageTitle, CsiPolicy},
    data(){
      return {
      }
    },
    computed: {
      termsAndConditionsUrl() {
        return config.global.envs.API_BASE_URL + config.global.basePaths.preferences + '/terms'
      }
    },
    methods: {
      onBack(){
        this.$router.push(this.$routes.GLOBAL.USER_PROFILE);
      }
    }
  }
</script>
