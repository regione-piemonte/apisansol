<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <lms-page class="page-tests-carried-out" padding>
    <div class="q-mt-lg" v-if="!isLoading">
      <!-- NUOVA GESTIONE ARRUOLAMENTO -->
      <!-- ----------------------------------------------------------------------------------------------------------- -->
      <template v-if="IS_NEW_ENROLLABLE_ACTIVE">
        <div class="q-my-md">
          <the-guard-enrollment2 :code="enrollmentCode" />

          <!-- @NOTA: il codice è duplicato nella sezione vecchio arruolamento -->
          <template v-if="!isEnrollmentCodeBlocker">
            <div v-if="screeningsList.length > 0">
              <div v-for="(screening, index) in screeningsList" :key="index">
                <csi-examination-item
                  :examination="screening"
                  @hide-examination="hideExamination"
                />
              </div>
            </div>
            <template v-else>
              <q-banner class="h-banner h-banner--info">
                Non hai nessun esame effettuato.
              </q-banner>
            </template>
          </template>
        </div>
      </template>

      <!-- VECCHIA GESTIONE ARRUOLAMENTO -->
      <!-- ----------------------------- -->
      <template v-else>
        <!--      <div v-if="!isUserEnrolled && !isConsent" class="no-fse q-my-lg">-->
        <div v-if="!isUserEnrolled" class="no-fse q-my-lg">
          <csi-enrollment-banner :activable="isUserEnrollable" />
        </div>
        <template v-else>
          <div v-if="screeningsList.length > 0">
            <div v-for="(screening, index) in screeningsList" :key="index">
              <csi-examination-item
                :examination="screening"
                @hide-examination="hideExamination"
              />
            </div>
          </div>
          <template v-else>
            <q-banner class="h-banner h-banner--info">
              Non hai nessun esame effettuato.
            </q-banner>
          </template>
        </template>
      </template>

      <div class="q-mt-md q-pa-md text-right">
        <router-link :to="policyUrl" class="lms-link" >
          Privacy e condizioni d'uso
        </router-link>
      </div>
    </div>
    <lms-inner-loading block :showing="isLoading" />
  </lms-page>
</template>

<script>
import {
  APPOINTMENT_TYPES_LABEL,
  ENROLLMENT_CODES,
  FSE_SERVICE_CODE,
  IS_NEW_ENROLLABLE_ACTIVE
} from "src/services/config";
import {
  createAudit,
  getScreeningCarriedOut,
  hideShowExamination
} from "src/services/api";
import CsiEnrollmentBanner from "components/preventionScreening/CsiEnrollmenBanner";
import CsiExaminationItem from "components/preventionScreening/CsiExaminationItem";
import { apiErrorNotify } from "src/services/utils";
import { date } from "quasar";
import TheGuardEnrollment2 from "../components/TheGuardEnrollment2";
import {POLICY} from "src/router/routes";

export default {
  name: "PageExaminationsCarriedOut",
  components: {
    TheGuardEnrollment2,
    CsiExaminationItem,
    CsiEnrollmentBanner
  },
  data() {
    return {
      IS_NEW_ENROLLABLE_ACTIVE,
      isLoading: false,
      screenings: []
      // isConsent:false,
    };
  },
  computed: {
    cf() {
      return this.$store.getters["getTaxCode"];
    },
    enrollmentInfo() {
      return this.$store.getters["getEnrollmentInfo"];
    },
    activeUserEnrollmentInfo() {
      return this.$store.getters["getActiveUserEnrollmentInfo"];
    },
    isUserEnrolled() {
      let code = this.activeUserEnrollmentInfo?.codice_risposta;
      let codes = [
        ENROLLMENT_CODES.FSE_APPROVED,
        ENROLLMENT_CODES.FSE_NOT_APPROVED,
        ENROLLMENT_CODES.FSE_NOT_CONSENT,
        ENROLLMENT_CODES.FSE_NOT_CONSENT_DO_NOT_ASK
      ];
      return codes.includes(code);
    },
    isUserEnrollable() {
      return this.enrollmentInfo?.risposta;
    },
    workingApp() {
      let app = this.$store.getters["getWorkingApp"];
      return app?.codice;
    },
    screeningsList() {
      let list = [];
      if (this.screenings) {
        for (let i = 0; i < this.screenings.length; i++) {
          let screening = this.screenings[i];
          let type = screening.tipo;
          let pacient = screening.paziente;
          let exams = screening.esami;
          for (let j = 0; j < exams.length; j++) {
            exams[j].tipo_screening = type;
            exams[j].paziente = pacient;
            list.push(exams[j]);
          }
        }
      }
      return list;
    },
    // isDelegationActive(){
    //   return this.$store.getters["isDelegationActive"];
    // }
    enrollmentCode() {
      return this.activeUserEnrollmentInfo?.codice_risposta;
    },
    isEnrollmentCodeBlocker() {
      let BLOCK_CODE_LIST = [
        "000",
        "001",
        "002",
        "004",
        "005",
        "007",
        "010",
        "011",
        "012",
        "013",
        "015"
      ];

      return BLOCK_CODE_LIST.includes(this.enrollmentCode);
    },
    policyUrl(){
      let route= {
        name: POLICY.name,
        query: {fse: true}
      }

      return route
    }
  },
  created() {
    console.log(this.workingApp);
    this.getScreeningsList();

    // Scateniamo la setAudit
    // Serve a tracciare l'accesso del cittadino sia per sè che per conto di un delegante
    // Ci basta posizionare qui la chiamata perché quando si seleziona/deseleziona un delegante
    // la pagina viene ricaricata
    try {
      let taxCode = this.$store.getters["getTaxCode"];
      createAudit(taxCode);
    } catch (error) {
      console.error(error);
    }
  },
  methods: {
    async getScreeningsList() {
      if (!this.isUserEnrolled) {
        //
        // if(this.isDelegationActive)
        //  await this.getConsents()
        // else
        return;
      }
      this.isLoading = true;
      this.screenings = [];

      let params = {
        servizio: FSE_SERVICE_CODE
      };

      try {
        let response = await getScreeningCarriedOut(this.cf, { params });
        let screeningInfo = response.data;
        if (screeningInfo) {
          this.screenings = screeningInfo;
        }
      } catch (e) {
        apiErrorNotify({
          error: e,
          message: `Non è stato possibile reperire l'elenco gli esami effettuati.`
        });
      } finally {
        this.isLoading = false;
      }
    },


    async hideExamination(examination, hide) {
      let examDate = date.formatDate(examination.data, "YYYY-MM-DD");
      let httconfig = {
        oscuramento: [
          {
            fonte_oscuramento: "WA",
            id_documento: null,
            codice_cl: null,
            tipo_screening: examination.tipo_screening?.codice,
            data_esame: examDate,
            tipo_esame: examination.tipo_esame?.codice,
            tipo_di_dato: {
              codice: "SCR",
              descrizione: "EVENTO_SCREENING",
              riferimento: null
            },
            oscurato: hide
          }
        ]
      };
      let params = {
        servizio: FSE_SERVICE_CODE
      };
      try {
        let response = await hideShowExamination(this.cf, httconfig, {
          params
        });
        await this.getScreeningsList();
      } catch (e) {
        let msg = hide
          ? "Non è stato possibile mostrare la vista esame"
          : "Non è stato possibile oscurare la vista esame";
        apiErrorNotify({ error: e, message: msg });
      }
    }
  }
};
</script>

<style scoped></style>
