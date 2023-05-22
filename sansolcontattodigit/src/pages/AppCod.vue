<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <lms-page padding>
    <template v-if="isLoading">
      <lms-inner-loading :showing="true" block/>
    </template>

    <template v-else-if="isEnrollmentCodeBlocker">
      <div class="q-my-md">
        <the-guard-enrollment2 :code="enrollmentCode"/>
      </div>
    </template>
    <template v-else>
      <router-view/>
    </template>

  </lms-page>

</template>

<script>
import TheGuardEnrollment2 from "components/TheGuardEnrollment2";
import {APP, CONVERSATION_DETAIL, CONVERSATION_LIST} from "src/router/routes";
import {getPatientEnablingInfo} from "src/services/api";
import store from "src/store";
import {USER_ENABLING_MAP} from "src/services/config";
import {hasEnrollmentWarning} from "src/services/business-logic";
import LmsBanner from "components/core/LmsBanner";

export default {
  name: "AppCod",
  components: { TheGuardEnrollment2},
  data() {
    return {
      isLoading: false
    }
  },
  computed: {
    userInfo() {
      return this.$store.getters["getUserInfo"];
    },
    enrollmentCode() {
      return this.$store.getters["getEnrollmentCode"];
    },
    taxCode() {
      return this.$store.getters["getTaxCode"]
    },
    hasDoctor() {
      let code = this.userInfo?.info_san?.tipo_movimento;
      let codes = ["S"];
      return codes.includes(code);
    },
    isNotDoctorFound() {
      return this.$store.getters["isNotDoctor"];
    },
    userDoctor() {
      return this.$store.getters["getUserDoctor"];
    },
    isConversationDetailPage() {
      return this.$route.name === CONVERSATION_DETAIL.name
    },
    isEnrollmentCodeBlocker() {

      let BLOCK_CODE_LIST = [
        "001",
        "002",
        "018",
        "000",
        "004",
        "005",
        "007",
        "010",
        "011",
        "015",
        "994",
        "995",
        "996",
        "997",
        "998",
        "999"
      ];

      return BLOCK_CODE_LIST.includes(this.enrollmentCode);
    },
    isUserNotEnabled() {
      let enablingInfo = this.$store.getters["getUserEnablingInfo"]
      return enablingInfo === USER_ENABLING_MAP.NONE
    },
  },
  created() {
    if (this.isEnrollmentCodeBlocker) return
    this.handleNavigation(this.$route)

  },
  methods: {
    async handleNavigation(to, from, next) {
      this.isLoading = true

      await this.$store.dispatch('setUserDoctor', this.taxCode);

      //Verifichiamo se l'utente non è stato bloccato
      if (this.userDoctor) {
        console.log('this.userDoctor', this.userDoctor)
        let params = {
          cf_medico: this.userDoctor?.codice_fiscale
        }
        try {
          let response = await getPatientEnablingInfo(this.taxCode, {params})
          let info = response.data
          this.$store.dispatch('setUserEnablingInfo', {info})
        } catch (e) {

        }
      }


      this.isLoading = false

      console.log("_______to.name", to.name)
      // Quando la route target è proprio la home
      // => significa che l'utente ha cliccato sul box di "deleghe" oppure
      //    è arrivato da qualche URL che punta direttamente al servizio
      //
      // In questo caso gestiamo dove redirigere l'utente


      // Infine carichiamo le informazioni relative all'utente attualmente attivo (loggato o delegante)
      if (to.name === APP.name || this.isEnrollmentCodeBlocker) {
        let route = CONVERSATION_LIST
        console.log('pushing:', route.name)
        next ? next(route) : this.$router.push(route)

      } else if (next) {
        next()
      }
    }
  }

}
</script>

<style scoped>

</style>
