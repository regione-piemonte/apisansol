<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-page padding>
    <csi-page-title title="Privacy e condizioni d'uso" @back="onBack" />

    <div class="q-pa-md" v-if="!isLoading">

      <csi-policy :iframe-styles="{minHeight: '80vh'}">
        <template slot="text">
          <div v-html="privacyDisclaimer"></div>
        </template>
      </csi-policy>
    </div>

    <!-- LOADER -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <q-inner-loading :visible="isLoading">
      <q-spinner-mat size="50px" color="primary"></q-spinner-mat>
    </q-inner-loading>
  </q-page>
</template>


<script>
import CsiPolicy from "components/global/common/CsiPolicy";
import CsiPageTitle from "components/global/common/CsiPageTitle";
import {getLastPolicyVersionPdfUrl} from "../../services/api/enrollment";
import {getDisclaimer} from "../../services/api/income-exemption";

export default {
  name: 'PagePolicy',
  components: {CsiPageTitle, CsiPolicy},
  data() {
    return {
      isLoading:false,
      disclaimer:null
    }
  },
  computed: {
    taxCode() {
      return this.$store.getters['consents/getTaxCode']
    },
    privacyDisclaimer() {
      return this.disclaimer ? this.disclaimer.testo_privacy : ''
    },
    informationDisclaimer() {
      return this.disclaimer ? this.disclaimer.testo_informativa : ''
    },
  },
  async created() {
    this.isLoading=true

    let disclaimerPromise = await getDisclaimer();
    this.disclaimer = disclaimerPromise.data;
    this.isLoading=false
  },
  methods: {
    onBack(){
      this.$router.go(-1);
    }
  },
}
</script>


<style scoped lang="stylus"></style>
