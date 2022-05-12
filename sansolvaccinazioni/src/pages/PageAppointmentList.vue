<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="q-pa-md">
    <template v-if="!isLoading">
      <!-- DELEGANTE CHIAMATA ARRUOLAMENTO FALLITA -->
      <!-- --------------------------------------------------------------------------------------------------------- -->
      <template v-if="isDelegationActive && enrollmentCode === ENROLLMENT_CODE_MAP.UNKNOWN">
        <q-banner class="q-banner--negative q-mt-lg">
          <div class="text-body1">
            Non è stato possibile recuperare le informazioni del delegante. Non potrai stampare il certificato dei
            vaccini effettuati. Ti invitiamo a riprovare più tardi
          </div>
        </q-banner>
      </template>



      <template v-if="!vaccinationUserInfo">
        <!-- NO ANAGRAFE VACCINALE -->
        <!-- --------------------------------------------------------------------------------------------------------- -->
        <template v-if="!isDelegationActive">
          <q-banner class="q-banner--info q-mt-lg">
            <div class="text-body1">
              Il tuo profilo non risulta censito nell'Anagrafe vaccinale. Ti consigliamo di recarti presso uno sportello
              per prenotare una vaccinazione.
            </div>
          </q-banner>
        </template>

        <!-- DELEGANTE NO ANAGRAFE VACCINALE -->
        <!-- --------------------------------------------------------------------------------------------------------- -->
        <template v-if="isDelegationActive && enrollmentCode !== ENROLLMENT_CODE_MAP.UNKNOWN">
          <q-banner class="q-banner--info q-mt-lg">
            <div class="text-body1">
              Il profilo del tuo delegante non risulta censito nell'Anagrafe vaccinale.
              Ti consigliamo di recarti presso uno sportello per prenotare una vaccinazione.
            </div>
          </q-banner>
        </template>

      </template>

      <!-- CITTADINO ESISTENTE -->
      <!-- --------------------------------------------------------------------------------------------------------- -->
      <template v-else>
        <!-- NO ASL COMPETENZA -->
        <!-- ------------------------------------------------------------------------------------------------------- -->
        <template v-if="noAsl">
          <q-banner class="q-banner--negative q-mt-lg">
            <div class="text-body1">
              Non risulti avere un Asl di riferimento, ti preghiamo di recarti ad uno sportello per procedere con le
              richieste di vaccinazione
            </div>
          </q-banner>
        </template>
        <!-- NASCONDIAMO IL BOTTONE IN PRODUZIONE -->
        <!-- ------------------------------------ -->
        <template v-if="!IS_PROD">
          <lms-buttons>
            <lms-button v-if="canRequestVaccine" @click="goToOtherVaccines" outline>
              Richiedi un altro vaccino
            </lms-button>
          </lms-buttons>
        </template>

        <!-- SPAZIO PER RIMPIAZZARE IL BOTTONE -->
        <template v-else>
          <div class="q-pt-md"></div>
        </template>

        <!-- LISTA APPUNTAMENTI -->
        <!-- ----------------------------------------------------------------------------------------------------- -->
        <template v-if="appointmentList.length <= 0">
          <q-banner class="q-banner--info q-mt-lg">
            <div class="text-body1">
              Nessun appuntamento disponibile
            </div>
          </q-banner>
        </template>

        <template v-else>
          <!-- LISTA APPUNTAMENTI -->
          <!-- --------------------------------------------------------------------------------------------------- -->
          <div class="q-mt-md q-gutter-y-md">
            <vac-appointment-list-item
              v-for="appointment in appointmentListSorted"
              :key="appointment.id"
              :appointment="appointment"
              :appointment-request-list="appointmentRequestList"
              :vaccination-user-info="vaccinationUserInfo"
            />
          </div>
        </template>

        <!-- LISTA NUOVI APPUNTAMENTI RICHIESTI -->
        <!-- ----------------------------------------------------------------------------------------------------- -->
        <template v-if="appointmentRequestNewList.length > 0">
          <div class="q-mt-xl text-h5">
            Nuovi appuntamenti richiesti
          </div>

          <div class="q-mt-md q-gutter-y-md">
            <vac-appointment-request-new-list-item
              v-for="appointmentRequest in appointmentRequestListSorted"
              :key="appointmentRequest.id_istanza"
              :appointment-request="appointmentRequest"
            />
          </div>
        </template>

        <!-- CONVOCAZIONI -->
        <!-- --------------------------------------------------------------------------------------------------- -->
        <template v-if="convocationList.length > 0">
          <div class="q-mt-xl text-h5">
            Prossimi vaccini
          </div>

          <div class="q-mt-md q-gutter-y-md">
            <vac-convocation-list-item
              v-for="convocation in convocationListSorted"
              :key="convocation.id_convocazione"
              :convocation="convocation"
              :appointment-request-list="appointmentRequestOmissionList"
              :vaccination-user-info="vaccinationUserInfo"
            />
          </div>
        </template>
      </template>
    </template>

    <lms-inner-loading :showing="isLoading" block />
  </div>

</template>

<script>
import { capitalCase } from "change-case";
import { apiErrorNotify } from "../services/utils";
import {
  getAdministrationList,
  getAppointmentList,
  getAppointmentUpdateRequestList,
  getConvocationList,
  getEnrollmentInfo,
  getImmunizedList,
  getSelfContributionRequestList,
  getVaccinationUserInfo
} from "../services/api";
import VacAppointmentListItem from "../components/VacAppointmentListItem";
import VacConvocationListItem from "../components/VacConvocationListItem";
import VacAppointmentRequestNewListItem from "../components/VacAppointmentRequestNewListItem";
import { APPOINTMENT_NEW } from "../router/routes";
import {ENROLLMENT_CODE_MAP, IS_PROD} from "src/services/config";

export default {
  name: "PageAppointmentsList",
  components: {
    VacAppointmentRequestNewListItem,
    VacConvocationListItem,
    VacAppointmentListItem
  },
  data() {
    return {
      ENROLLMENT_CODE_MAP,
      IS_PROD,
      isLoading: false,
      isDownloading: false,
      isAsrSupported: true,
      asrUnsupportedLabel: null,
      vaccinationUserInfo: null,
      convocationList: [],
      appointmentList: [],
      appointmentRequestList: [],
      appointmentRequestNewList: [],
      appointmentRequestUpdateList: [],
      appointmentRequestDeleteList: [],
      appointmentRequestDefermentList: [],
      appointmentRequestOmissionList: [],
      administrationList: [],
      immunizedList: [],

    };
  },
  computed: {
    workingApp() {
      return this.$store.getters["getWorkingApp"];
    },
    user() {
      return this.$store.getters["getUser"];
    },
    isDelegationActive() {
      return this.$store.getters["isDelegationActive"];
    },
    cf() {
      return this.$store.getters["getTaxCode"];
    },

    enrollmentInfo() {
      return this.$store.getters["getActiveUserEnrollmentInfo"];
    },
    enrollmentCode(){
      return this.enrollmentInfo?.codice_risposta ?? ENROLLMENT_CODE_MAP.UNKNOWN
    },
    noAsl(){
      return !this.vaccinationUserInfo?.asl
    },

    canRequestVaccine() {
      let hasVaccine =
        this.administrationList.length + this.immunizedList.length > 0;
      return this.vaccinationUserInfo || hasVaccine;
    },
    convocationListSorted() {
      let result = [...this.convocationList];

      result.sort(
        (a, b) =>
          new Date(a.data_convocazione.toString()) -
          new Date(b.data_convocazione.toString())
      );

      return result;
    },
    appointmentListSorted() {
      let result = [...this.appointmentList];

      result.sort(
        (a, b) =>
          new Date(a.data_appuntamento.toString()) -
          new Date(b.data_appuntamento.toString())
      );

      return result;
    },
    appointmentRequestListSorted() {
      let result = [...this.appointmentRequestNewList];
      result.sort((a, b) => a.id_istanza - b.id_istanza);
      return result.reverse();
    }
  },
  created() {
    this.loadVaccinationsHome();
  },
  watch: {
    cf: {
      handler() {
        this.appointmentList = [];
        this.convocationList = [];
        this.administrationList = [];
        this.immunizedList = [];
        this.vaccinationUserInfo = null;
        //riempio la home
        this.loadVaccinationsHome();
      }
    }
  },
  methods: {
    async loadVaccinationsHome() {
      this.isLoading = true;
      this.isAsrSupported = true;
      let taxCode = this.cf;
      let cittadinoPromise = getVaccinationUserInfo(taxCode);


      try {
        let { data } = await cittadinoPromise;
        this.vaccinationUserInfo = data;
        if (this.vaccinationUserInfo?.codice_fiscale === "") {
          this.vaccinationUserInfo = null;
        }
      } catch (error) {
        let message = "Non è stato possibile recuperare i dati dell utente";
        apiErrorNotify({ error, message });
      }


      //Se non è su sirva non facciamo più le altre chiamate
      if(!this.vaccinationUserInfo) {
        if (
          this.user &&
          this.user.profile &&
          this.user.profile.info_san &&
          this.user.profile.info_san.asl_assistenza
        ) {
          if (
            this.user.profile.info_san.asl_assistenza === "010203" ||
            // this.user.profile.info_san.asl_assistenza === "010209" ||
            this.user.profile.info_san.asl_assistenza === "010210"
          )
            this.isAsrSupported = false;
          if (this.user.profile.info_san.asl_assistenza === "010203") {
            this.asrUnsupportedLabel =
              "ASL TO3 (Distretti Pinerolo, Val Susa-Val Sangone, Area Metropolitana Nord-Centro-Sud)";
          }
          // if (this.user.profile.info_san.asl_assistenza === "010209") {
          //   this.asrUnsupportedLabel = "ASL VCO (Verbano Cusio Ossola)";
          // }
          if (this.user.profile.info_san.asl_assistenza === "010210") {
            this.asrUnsupportedLabel =
              "ASL CN1 (Cuneo, Borgo S.Dalmazzo-Dronero, Mondovì, Ceva, Savigliano-Fossano, Saluzzo)";
          }
        }
        this.stopLoading()
        return
      }


      // await this.getDelegateEnrollment();
      //
      let immunizationsPromise = getImmunizedList(taxCode);
      let appointmentsPromise = getAppointmentList(taxCode);
      let propositionsPromise = getConvocationList(taxCode);
      let istanzeNewAppointmentPromise = getAppointmentUpdateRequestList(
        taxCode,
        "PRENOTAZIONE"
      );

      let istanzeMovedAppointmentPromise = getAppointmentUpdateRequestList(
        taxCode,
        "SPOSTAMENTO"
      );

      let istanzeRevokedAppointmentPromise = getAppointmentUpdateRequestList(
        taxCode,
        "REVOCA"
      );

      let istanzeDifferimentAppointmentPromise = getSelfContributionRequestList(
        taxCode,
        "DIFFERIMENTO"
      );

      let istanzeOmissionAppointmentPromise = getSelfContributionRequestList(
        taxCode,
        "OMISSIONE"
      );

      let ministrationsPromise = getAdministrationList(taxCode);


      try {
        let { data } = await immunizationsPromise;
        this.immunizedList = data;
      } catch (error) {
        let message =
          "Non è stato possibile caricare l'elenco delle vaccinazioni immunizzate";
        apiErrorNotify({ error, message });
      }

      try {
        let { data } = await appointmentsPromise;
        this.appointmentList = data;
      } catch (error) {
        let message = "Non è stato possibile recuperare gli appuntamenti";
        apiErrorNotify({ error, message });
      }

      try {
        let { data } = await propositionsPromise;
        // controllo che proposta non sia già appuntamento per non duplicarla
        this.convocationList = data.filter(a => !a.data_appuntamento);
      } catch (error) {
        let message = "Non è stato possibile recuperare le convocazioni";
        apiErrorNotify({ error, message });
      }

      //ISTANZE: nuovo appuntamento
      try {
        let { data } = await istanzeNewAppointmentPromise;
        //non mostro quelle accettate perchè son diventate appuntamenti / convocazioni
        //TO DO: salvare i codici stato e relativa descrizione nel config per non ripeterli
        this.appointmentRequestNewList = data.filter(a => a.id_stato !== "11");

        // @TODO: utilizzare un filtro
        // this.appointmentRequestNewList.forEach(instance => {
        //   instance.vaccini.forEach(vaccine => {
        //     vaccine.descrizione = capitalCase(vaccine.descrizione);
        //   });
        // });
      } catch (error) {
        let message =
          "Non è stato possibile recuperare le istanze per nuovi appuntamenti";
        apiErrorNotify({ error, message });
      }

      //ISTANZE: spostamento
      try {
        let { data } = await istanzeMovedAppointmentPromise;
        this.appointmentRequestUpdateList = data.map(obj => ({
          ...obj,
          tipo: "SPOSTAMENTO"
        }));
      } catch (error) {
        let message =
          "Non è stato possibile recuperare le istanze per gli spostamenti";
        apiErrorNotify({ error, message });
      }

      //ISTANZE: revoca
      try {
        let { data } = await istanzeRevokedAppointmentPromise;
        this.appointmentRequestDeleteList = data.map(obj => ({
          ...obj,
          tipo: "REVOCA"
        }));
      } catch (error) {
        let message = "Non è stato possibile recuperare le istanze di revoca";
        apiErrorNotify({ error, message });
      }

      //ISTANZE: differimento
      try {
        let { data } = await istanzeDifferimentAppointmentPromise;
        this.appointmentRequestDefermentList = data.map(obj => ({
          ...obj,
          tipo: "DIFFERIMENTO"
        }));
      } catch (error) {
        this.appointmentRequestDefermentList = [];
        let message =
          "Non è stato possibile recuperare le istanze di differimento";
        apiErrorNotify({ error, message });
      }

      //ISTANZE: omissione
      try {
        let { data } = await istanzeOmissionAppointmentPromise;
        this.appointmentRequestOmissionList = data.map(obj => ({
          ...obj,
          tipo: "OMISSIONE"
        }));
      } catch (error) {
        this.appointmentRequestOmissionList = [];
        let message =
          "Non è stato possibile recuperare le richieste di annullamento";
        apiErrorNotify({ error, message });
      }

      let appointmentRequestList = [];

      if (this.appointmentRequestUpdateList) {
        appointmentRequestList = this.appointmentRequestUpdateList;
      }

      if (this.appointmentRequestDeleteList) {
        appointmentRequestList = appointmentRequestList.concat(
          this.appointmentRequestDeleteList
        );
      }

      if (this.appointmentRequestDefermentList) {
        appointmentRequestList = appointmentRequestList.concat(
          this.appointmentRequestDefermentList
        );
      }

      if (this.appointmentRequestOmissionList) {
        appointmentRequestList = appointmentRequestList.concat(
          this.appointmentRequestOmissionList
        );
      }

      this.appointmentRequestList = appointmentRequestList;

      try {
        let { data } = await ministrationsPromise;
        this.administrationList = data;
      } catch (error) {
        let message = "Non è stato possibile recuperare le somministrazioni";
        apiErrorNotify({ error, message });
      }


      //CONTROLLO SE CITTADINO è IN UNA DELLE 3 ASL NON ATTIVE SU VACC
      if (this.vaccinationUserInfo?.asl) {
        if (
          this.vaccinationUserInfo.asl.codice === "010203" ||
          // this.vaccinationUserInfo.asl.codice === "010209" ||
          this.vaccinationUserInfo.asl.codice === "010210"
        ) {
          this.isAsrSupported = false;
          if (this.vaccinationUserInfo.asl.codice === "010203") {
            this.asrUnsupportedLabel =
              "ASL TO3 (Distretti Pinerolo, Val Susa-Val Sangone, Area Metropolitana Nord-Centro-Sud)";
          }
          // if (this.vaccinationUserInfo.asl.codice === "010209") {
          //   this.asrUnsupportedLabel = "ASL VCO (Verbano Cusio Ossola)";
          // }
          if (this.vaccinationUserInfo.asl.codice === "010210") {
            this.asrUnsupportedLabel =
              "ASL CN1 (Cuneo, Borgo S.Dalmazzo-Dronero, Mondovì, Ceva, Savigliano-Fossano, Saluzzo)";
          }
        }
      }


      setTimeout(this.stopLoading, 3000);
    },

    //controlla stato fse per delegante
    async getDelegateEnrollment() {
      if (this.isDelegationActive) {
        let taxCode = this.cf;
        let params = {
          servizio: this.workingApp.codice_servizio
        };

        try {
          let { data } = await getEnrollmentInfo(taxCode, { params });
          this.enrollmentCode = data.codice_risposta;
        } catch (error) {
          this.enrollmentCode = "999";
          console.error(error);
        }
      }
    },
    stopLoading() {
      this.isLoading = false;
    },
    goToOtherVaccines() {
      let name = APPOINTMENT_NEW.name;
      let params = { cittadino: this.vaccinationUserInfo };
      this.$router.push({ name, params });
    },
    onActivate() {
      window.location.assign("/la-mia-salute/arruolamento/");
    }
  }
};
</script>

<style lang="sass"></style>
