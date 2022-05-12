<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <lms-page padding>
    <template v-if="!isLoading">
      <div class="text-right" v-if="isCytologicalBookable || isMammographicBookable">
        <lms-buttons class="q-pt-sm q-pb-md">
          <lms-button @click="createNewAppointment">
            Prenota
          </lms-button>
        </lms-buttons>
      </div>

      <template v-if="isNotUser">
        <q-banner class="h-banner h-banner--warning q-mt-lg">
          <template v-if="errorMessage">
            {{ errorMessage }}
          </template>
          <template v-else>
            In questo momento non è possibile reperire i tuoi dati, ti invitiamo
            a riprovare più tardi. <br />
            Ci scusiamo per il disagio. Se il problema persiste ti suggeriamo di
            contattare l'assistenza.
          </template>
        </q-banner>
      </template>
      <template v-else>
        <q-tabs v-model="tab" active-color="primary" align="left" no-caps>
          <q-route-tab
            label="Appuntamenti"
            :to="UPCOMING_APPOINTMENTS"
            class="text-subtitle1 q-py-sm"
            name="appointments"
            v-if="isFemale"
          />

          <q-route-tab
            label="Esami effettuati"
            :to="TESTS_CARRIED_OUT"
            class="text-subtitle1 q-py-sm"
            name="tests"
          />

          <!-- @TODO: temporeneamente commentanto in attesa di servizi funzionanti -->
          <!--          <q-route-tab-->
          <!--            label="Comunicazioni"-->
          <!--            :to="NOTICES"-->
          <!--            class="text-subtitle1 q-py-sm"-->
          <!--            name="notices"-->
          <!--          />-->

          <q-route-tab
            label="Contatti"
            :to="CONTACTS"
            class="text-subtitle1 q-py-sm"
            name="contacts"
            v-if="isFemale"
          />

          <q-route-tab
            label="Mappa strutture"
            :to="MAP"
            class="text-subtitle1 q-py-sm"
            name="mapUnits"
            v-if="isFemale"
          />
        </q-tabs>
        <div>
          <keep-alive :include="keepAlive">
            <router-view></router-view>
          </keep-alive>
        </div>


        <div class="q-mt-md q-pa-md text-right">
          <router-link :to="POLICY" class="lms-link" v-if="showPolicy">
            Privacy e condizioni d'uso
          </router-link>
        </div>

      </template>

      <q-dialog v-model="chooseTypeDialog" :maximized="$q.screen.lt.md">
        <csi-choose-appointment-type-dialog
          :is-cytological="isCytologicalBookable"
          :is-mammographic="isMammographicBookable"
        />
      </q-dialog>
    </template>

    <lms-inner-loading :showing="isLoading" />
  </lms-page>
</template>
<script>
import { getEnrollmentInfo, getUserRiscreInfo } from "src/services/api";
import { apiErrorNotify } from "src/services/utils";

import {
  UPCOMING_APPOINTMENTS,
  TESTS_CARRIED_OUT,
  NOTICES,
  CONTACTS,
  MAP, POLICY
} from "src/router/routes";
import PageUpcomingAppointments from "./PageUpcomingAppointments";
import PageTestsCarriedOut from "./PageExaminationsCarriedOut";
import PageNotices from "./PageNotices";
import PageContacts from "./PageContacts";
import CsiChooseAppointmentTypeDialog from "../components/preventionScreening/CsiChooseAppointmentTypeDialog";
import { appointmentAllowedOperations, getSex } from "../services/api";
import { APPOINTMENT_TYPES } from "src/services/config";
import { getBookableScreenings } from "src/store/prevention-screening/getters";
export default {
  name: "PageHome",
  components: { CsiChooseAppointmentTypeDialog },
  data() {
    return {
      POLICY,
      UPCOMING_APPOINTMENTS,
      TESTS_CARRIED_OUT,
      NOTICES,
      CONTACTS,
      MAP,
      isLoading: false,
      tab: "",
      keepAlive: [
        PageUpcomingAppointments.name,
        PageTestsCarriedOut.name,
        PageNotices.name,
        PageContacts.name
      ],
      chooseTypeDialog: false,
      APPOINTMENT_TYPES,
      sex: null,
      isFemale: false,
      userCodes: null,
      isBookable: null,
      isBookableMammographic: false,
      isBookableCytological: false,
      isNotUser: false,
      errorMessage: ""
    };
  },
  created() {
    this.isLoading = true;
  },
  computed: {
    cf() {
      return this.$store.getters["getTaxCode"];
    },
    userInfo() {
      return this.$store.getters["preventionScreening/getUserRiscreInfo"];
    },
    bookableInfo() {
      return this.$store.getters["preventionScreening/getBookableScreenings"];
    },
    allowedOperations(){
      return this.$store.getters["preventionScreening/getAllowedOperations"]
    },
    isCytologicalBookable(){
      return this.allowedOperations && this.allowedOperations[APPOINTMENT_TYPES.CV]?.prenotabile
    },
    isMammographicBookable(){
      return this.allowedOperations && this.allowedOperations[APPOINTMENT_TYPES.MX]?.prenotabile
    },

    isActiveDelegation() {
      return this.$store.getters["isDelegationActive"];
    },
    showPolicy(){
      return this.$route.meta?.showPolicy
    }
  },
  watch: {
    cf: {
      immediate: true,
      deep: true,
      async handler() {
        console.log(this.cf);
        // if (this.isActiveDelegation) {
        //   try {
        //     // await this.reload();
        //   } catch (e) {}
        // }
        await this.getUserGender();
      }
    }
  },
  methods: {

    async getUserGender() {
      this.$store.dispatch("preventionScreening/resetAllowedOperations" );
      this.isNotUser = false;
      console.log("getUserGender");
      try {
        let sexResponse = await getSex(this.cf);
        this.$store.dispatch(
          "preventionScreening/setUserSex",
          sexResponse.data
        );
        this.sex = sexResponse.data?.sesso;
        this.userCodes = {
          codice_interno: sexResponse.data?.codice_interno,
          codice_interno_prefisso: sexResponse.data?.codice_interno_prefisso
        };

        if (this.sex === "F") {
          this.isFemale = true;
          this.tab = "appointments";
          this.$router.replace(UPCOMING_APPOINTMENTS);
          this.getDefaultData();
        } else {
          this.tab = "tests";

          this.$router.replace(TESTS_CARRIED_OUT);
          this.isLoading = false;
        }
      } catch (e) {
        this.errorMessage = e.response?.data?.title;
        apiErrorNotify({
          error: e,
          message: "Impossibile caricare i dati del cittadino."
        });
        this.isNotUser = true;
        this.isLoading = false;
      }
    },
    async getDefaultData() {
      let params= {
        type: null,
        isBookable: false
      }
      await this.getUserInfo();

    },
    async getUserInfo() {
      this.isLoading = true;

      try {
        let userDataResponse = await getUserRiscreInfo(this.cf, {});
        let userInfo = userDataResponse.data;
        this.$store.dispatch("preventionScreening/setUserInfo", userInfo);
      } catch (e) {
        this.errorMessage = e.response?.data?.title;
        apiErrorNotify({
          error: e,
          message: "Impossibile caricare i dati del cittadino."
        });
      } finally {
        this.isLoading = false;
      }
    },
    async operationsAllowed(appointmentType) {
      try {
        let operationsResponse = await appointmentAllowedOperations(
          this.cf,
          appointmentType,
          { params: this.userCodes }
        );
        let operations = {
          type: appointmentType,
          obj: operationsResponse.data
        };

        this.$store.dispatch(
          "preventionScreening/setAllowedOperations",
          operations
        );
      } catch (e) {
        this.errorMessage = e.response?.data?.title;
        apiErrorNotify({
          error: e,
          message: "Impossibile reperire i dati."
        });
      }
    },
    createNewAppointment() {
      this.chooseTypeDialog = true;
    }
  }
};
</script>
<style lang="sass"></style>
