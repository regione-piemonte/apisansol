<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <lms-page>
    <!-- TABS -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <q-tabs align="left" no-caps active-color="primary">
      <q-route-tab label="La tua situazione" :to="HOME_MY_SITUATION" />
      <q-route-tab label="Tamponi" :to="HOME_SWAB_LIST" />
      <q-route-tab label="Provvedimenti ed eventi" :to="HOME_EVENT_LIST" />
      <q-route-tab label="Telefono ed email" :to="HOME_CONTACTS" />
    </q-tabs>

    <!-- PAGINA INTERNA -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <router-view />

    <!-- INFORMATIVA PRIVACY -->
    <!-- ------------------- -->
    <div class="q-mt-xl text-right">
      <router-link :to="POLICY" class="lms-link">
        Privacy e condizioni d'uso
      </router-link>
    </div>

    <lms-customer-satisfaction-widget v-if="isWidgetVisibile"/>
  </lms-page>
</template>

<script>
import {
  HOME_CONTACTS,
  HOME_EVENT_LIST,
  HOME_MY_SITUATION,
  HOME_SWAB_LIST,
  POLICY,
} from "../router/routes";
import LmsCustomerSatisfactionWidget from "components/LmsCustomerSatisfactionWidget";
import {store} from "src/store";

export default {
  name: "PageHome",
  components: {LmsCustomerSatisfactionWidget},
  props: {},
  data() {
    return {
      POLICY,
      HOME_MY_SITUATION,
      HOME_SWAB_LIST,
      HOME_EVENT_LIST,
      HOME_CONTACTS,
    };
  },
  computed: {
    isDelegationActive(){
      return this.$store.getters["isDelegationActive"];
    },
    workingApp() {
      return this.$store.getters["getWorkingApp"];
    },
    userAppInfo(){
      return this.$store.getters["userAppInfo"];
    },
    isWidgetVisibile(){
      let isUserSeen= this.userAppInfo?.soddisfazione_cliente_visualizzato
      return this.workingApp?.soddisfazione_cliente_visibile && !isUserSeen
    }
  },
  created() {},
  methods: {},
};
</script>

<style scoped lang="scss"></style>
