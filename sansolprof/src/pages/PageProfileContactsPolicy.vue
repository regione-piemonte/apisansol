<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <lms-page padding class="account-page-profile-contacts-policy">
    <lms-page-title>
      Termini e condizioni d'uso
    </lms-page-title>

      <lms-policy
        :src="termsAndConditionsUrl"
        class="q-mt-md"
        iframe-classes="account-page-profile-contacts-policy__frame"
      />


  </lms-page>
</template>

<script>
import { httpAuth } from "../boot/http";
import LmsPolicy from "../components/core/LmsPolicy";
import AccountPolicySkeleton from "components/AccountPolicySkeleton";

export default {
  name: "PageProfileContactsPolicy",
  components: { LmsPolicy },
  props: {},
  data() {
    return {};
  },
  computed: {
    termsAndConditionsUrl() {
      let baseUrl = httpAuth.defaults.baseURL;
      return `${baseUrl}/notify-preferences/api/v1/terms`;
    }
  },
  created() {},
  methods: {}
};
</script>

<style lang="sass">
.account-page-profile-contacts-policy__frame
  min-height: 800px
</style>
