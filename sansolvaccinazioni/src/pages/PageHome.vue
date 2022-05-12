<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <lms-page padding>

    <!-- NUOVA GESTIONE ARRUOLAMENTO -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <template v-if="IS_NEW_ENROLLABLE_ACTIVE">
      <div class="q-my-md">
        <the-guard-enrollment2 :code="enrollmentCode" />
      </div>
    </template>


    <q-tabs
      active-color="primary"
      indicator-color="primary"
      align="left"
      no-caps
    >
      <q-route-tab :to="APPOINTMENT_LIST" label="Appuntamenti"/>
      <q-route-tab :to="VACCINATION_LIST" label="Vaccini effettuati"/>
      <q-route-tab :to="USER_CONTACTS" label="Contatti"/>
      <q-route-tab :to="VACCINATION_CENTER_LIST" label="Centri vaccinali"/>
      <q-route-tab :to="VACCINATION_CALENDAR" label="Calendario vaccinale"/>
    </q-tabs>

    <keep-alive :include="keepAlive">
      <router-view/>
    </keep-alive>

    <div class="q-mt-md q-pa-md text-right">
      <router-link :to="INFORMATIVE" class="lms-link">
        Privacy e condizioni d'uso
      </router-link>
    </div>


    <lms-customer-satisfaction-widget v-if="isWidgetVisibile" />

  </lms-page>
</template>

<script>
import {
  APPOINTMENT_LIST,
  VACCINATION_LIST,
  USER_CONTACTS,
  VACCINATION_CENTER_LIST,
  VACCINATION_CALENDAR,
  INFORMATIVE
} from "../router/routes";
import PageAppointmentList from "./PageAppointmentList";
import PageVaccinationList from "./PageVaccinationList";
import PageUserContacts from "./PageUserContacts";
import PageVaccinationCenterList from "./PageVaccinationCenterList";
import PageVaccinationCalendar from "./PageVaccinationCalendar";
import TheGuardEnrollment2 from "components/TheGuardEnrollment2";
import {IS_NEW_ENROLLABLE_ACTIVE} from "src/services/config";
import LmsCustomerSatisfactionWidget from "components/LmsCustomerSatisfactionWidget";


export default {
  name: "PageHome",
  components: {LmsCustomerSatisfactionWidget, TheGuardEnrollment2},
  data() {
    return {
      keepAlive: [
        PageAppointmentList.name,
        PageVaccinationList.name,
        PageUserContacts.name,
        PageVaccinationCenterList.name,
        PageVaccinationCalendar.name,
      ],

      APPOINTMENT_LIST,
      VACCINATION_LIST,
      USER_CONTACTS,
      VACCINATION_CENTER_LIST,
      VACCINATION_CALENDAR,
      INFORMATIVE,
      IS_NEW_ENROLLABLE_ACTIVE
    };
  },
  computed: {
    workingApp() {
      return this.$store.getters["getWorkingApp"];
    },
    user() {
      return this.$store.getters["getUser"];
    },
    isCustomerWidgetVisibile(){
      return this.workingApp?.soddisfazione_cliente_visibile
    },
    customerSatisfactionUrl(){
      return this.workingApp?.soddisfazione_cliente_url
    },
    taxCode() {
      return this.$store.getters["getTaxCode"]
    },
    enrollmentCode() {
      return this.activeUserEnrollmentInfo?.codice_risposta;
    },
    activeUserEnrollmentInfo() {
      return this.$store.getters["getActiveUserEnrollmentInfo"];
    },
    userAppInfo(){
      return this.$store.getters["userAppInfo"];
    },
    isDelegationActive() {
      return this.$store.getters["isDelegationActive"];
    },
    isWidgetVisibile(){
      let isUserSeen= this.userAppInfo?.soddisfazione_cliente_visualizzato
      return this.workingApp?.soddisfazione_cliente_visibile && !isUserSeen
    }
  },
  created() {
  },
  methods: {
    goToInformative() {
      this.$router.push(INFORMATIVE);
    }
  }
};
</script>
