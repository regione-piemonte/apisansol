<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-page padding>
    <csi-page-title title="Privacy e condizioni d'uso" @back="onBack" />

    <div class="q-pa-md">
      <csi-policy :iframe-styles="{minHeight: '80vh'}">
        <template slot="text">
          <div class="policy-text" v-html="disclaimerText"></div>
        </template>
      </csi-policy>
    </div>

  </q-page>
</template>


<script>
  import CsiPolicy from "components/global/common/CsiPolicy";
  import CsiPageTitle from "components/global/common/CsiPageTitle";

  export default {
    name: 'PagePolicy',
    components: {CsiPageTitle, CsiPolicy},
    data() {
      return {}
    },
    computed: {
      disclaimerText() {
       let disclaimer =  this.$store.getters['changeDoctor/getDisclaimer']
        return disclaimer ? disclaimer.testo_privacy : ''
      }
    },
    methods: {
      onBack(){
        this.$router.go(-1);
      }
    },
  }
</script>


<style scoped lang="stylus"></style>
