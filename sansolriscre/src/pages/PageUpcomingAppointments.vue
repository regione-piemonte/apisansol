<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <lms-page padding>
    <div >
      <p>
        Di seguito vengono visualizzati i dettagli degli inviti che hai
        ricevuto.
      </p>
      <!--  <p>Per gli appuntamenti di <strong>screening citologico (pap-test) puoi modificare data, ora e luogo della convocazione.</strong><br>

      Per lo <strong>screening mammografico puoi modificare solo la data e l’ora dell’appuntamento.</strong></p> -->
    </div>
    <div class="q-mt-lg" style="min-height: 300px">
      <template v-if="userInfo && isFemale">
        <!-- APPUNTAMENTO CITOLOGICO -->
        <csi-appointment-card  :appointment-type="APPOINTMENT_TYPES.CV" @is-loading="isCitoLoadingStatus"  />
        <!-- APPUNTAMENTO MAMMOGRAFICO -->
        <csi-appointment-card  :appointment-type="APPOINTMENT_TYPES.MX" @is-loading="isMammLoadingStatus" />
      </template>
      <lms-inner-loading block :showing="isLoading" />
    </div>

  </lms-page>
</template>

<script>
import { date } from "quasar";
import {
  appointmentAllowedOperations,
  getAppointmentDetails,
  getCytologicalAppointment,
  getMammographicAppointment,
  getOperatingUnitDetail
} from "src/services/api";

import { NEW_APPOINTMENT_DATE, NEW_APPOINTMENT_PLACE } from "src/router/routes";

import { apiErrorNotify, isEmpty } from "src/services/utils";
import { downloadICalendar } from "src/services/api";
import {capitalCase} from "capital-case";
import {appointmentOperations, isAppointmentBookable} from "../services/api";
import CsiAppointmentCard from "../components/preventionScreening/CsiAppointmentCard";
import {toBase64} from "../services/utils";
import {APPOINTMENT_TYPES} from "src/services/config"
export default {
  name: "PageUpcomingAppointments",
  components: {
    CsiAppointmentCard,
  },
  data() {
    return {
      NEW_APPOINTMENT_DATE,
      NEW_APPOINTMENT_PLACE,
      isCitoLoading: false,
      isMammLoading: false,
      appointments: null,
      citoAppointment: null,
      mammoAppointment: null,
      isBookableCytological:false,
      isBookableMammographic: false,
      APPOINTMENT_TYPES,
    };
  },
  computed: {

    cf() {
      return this.$store.getters["getTaxCode"];
    },
    userInfo() {
      return this.$store.getters["preventionScreening/getUserRiscreInfo"];
    },
    userCodes() {
      return this.$store.getters["preventionScreening/getUserCodes"];
    },
    isFemale() {
      return this.$store.getters["preventionScreening/isFemale"];
    },
    isCytological() {
      return !isEmpty(this.citoAppointment);
    },
    allowedOperations(){
      return this.$store.getters["preventionScreening/getAllowedOperations"]
    },
    cytologicalAllowedOperations(){
      return this.allowedOperations[APPOINTMENT_TYPES.CV]
    },
    mammographicAllowedOperations(){
      return this.allowedOperations[APPOINTMENT_TYPES.MX]
    },
    isMammographic() {
      return !isEmpty(this.mammoAppointment);
    },

    isLoading(){
     return this.isCitoLoading || this.isMammLoading
    }

  },
  async created() {


  },
  methods: {
    async getCytologicalAppointment(httpconfig){
      this.isCitoLoading = true;
      try{
        let cytologicalResponse= await getCytologicalAppointment(this.cf, httpconfig);
        let appointment = cytologicalResponse.data
        if(!isEmpty(appointment)){
          let cytologicalDetailResponse = await getAppointmentDetails(this.cf, APPOINTMENT_TYPES.CV, httpconfig);
          appointment.detail =  cytologicalDetailResponse.data
          this.citoAppointment = appointment
        }else{
          this.citoAppointment = null
        }
      }catch (error) {
        console.log(error.response)
          apiErrorNotify({error, message: error.response?.statusMessage});
      }finally{
        this.isCitoLoading = false;
      }
    },
    async getMammographicAppointment(httpconfig){
      this.isMammLoading = false;
      try{
        let mammographicResponse= await getMammographicAppointment(this.cf, httpconfig);
        let appointment = mammographicResponse.data
        if(!isEmpty(appointment)){
          let mammographicDetailResponse = await getAppointmentDetails(this.cf, APPOINTMENT_TYPES.MAMM, httpconfig);
          appointment.detail = mammographicDetailResponse.data
          this.mammoAppointment = appointment
        }else{
          this.mammoAppointment=null
        }
      }catch (error) {
        console.log(error.response)
        apiErrorNotify({error, message: error.response?.statusMessage});
      }finally{
        this.isMammLoading = false;
      }
    },
    async operationsAllowed(appointmentType){

      try{
        let operationsResponse = await appointmentAllowedOperations(
          this.cf,
          appointmentType,
          { params: this.userCodes }
        );
        let operations= {
          type: appointmentType,
          obj: operationsResponse.data
        }
        this.$store.dispatch("preventionScreening/setAllowedOperations", operations );

      }catch (e) {
        apiErrorNotify({
          error: e,
          message: "Impossibile reperire i dati."
        });
      }
    },
    isCitoLoadingStatus(value){
      this.isCitoLoading = value
    },
    isMammLoadingStatus(value){
      this.isMammLoading = value
    }

}
};
</script>

<style lang="sass">
.minWidthCard
  width: 80%
  height: 80%
</style>
