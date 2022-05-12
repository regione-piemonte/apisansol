<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="lms-the-guard-login-required">
    <template v-if="isAuthorized">
      <slot />
    </template>
  </div>
</template>

<script>
import { login } from "../services/utils";

export default {
  name: "TheGuardLoginRequired",
  data() {
    return {
      isAuthorized: false
    };
  },
  computed: {
    user() {
      return this.$store.getters["getUser"];
    },
    workingApp() {
      return this.$store.getters["getWorkingApp"];
    }
  },
  created() {
    // Se l'app è configurata come "pubblica"
    // oppure se l'utente è loggato
    // => permettiamo all'utente di accedere all'app
    if (this.workingApp?.pubblico || this.user) {
      this.isAuthorized = true;
      return;
    }

    // Altrimenti scateniamo il login
    let loginUrl = "/api/bff/login";
    let landingUrl = window.location.pathname;
    login(loginUrl, landingUrl);
  }
};
</script>

<style scoped></style>
