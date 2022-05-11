<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-page padding>
    <csi-page-title title="Informativa sulla privacy" @back="onBack"/>

    <div class="q-pa-md">
      <csi-policy :iframe-styles="{minHeight: '80vh'}" :src="policyUrl">
        <!--        <template slot="text">-->
        <!--          <div class="policy-text" v-html="policyUrl"></div>-->
        <!--        </template>-->
      </csi-policy>
    </div>

  </q-page>
</template>

<script>
import CsiPageTitle from "../../components/global/common/CsiPageTitle";
import {getLastPolicyVersionPdfUrl} from "../../services/api/enrollment";
import CsiPolicy from "../../components/global/common/CsiPolicy";

export default {
  name: "PageConsentFsePolicy",
  components: {CsiPolicy, CsiPageTitle},
  data() {
    return{
      policyUrl: null
    }
  },
  computed: {
    taxCode() {
      return this.$store.getters['consents/getTaxCode']
    },
  },
  created() {
    this.policyUrl=getLastPolicyVersionPdfUrl(this.taxCode);

  },
  methods: {
    onBack() {
      this.$router.go(-1);
    }
  },
}
</script>

<style scoped>

</style>
