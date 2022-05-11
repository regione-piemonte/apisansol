<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <lms-page padding>
<!--    <q-btn color="secondary" style="width:200px;" :to="{name: 'contactFormChoose'}" label="Vai alla form" />-->
  </lms-page>
</template>

<script>
import {NEW_REQUEST_CHOOSE, REQUESTS} from "src/router/routes";

export default {
  name: "PageHome",
  computed:{
    isUserLogged(){
      return this.$store.getters["isUserLogged"];
    }
  },

  created() {
    if(this.isUserLogged)
      this.$router.replace(REQUESTS)
    else
      this.$router.replace(NEW_REQUEST_CHOOSE)
  }
};
</script>
