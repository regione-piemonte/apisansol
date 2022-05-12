<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="q-pa-md">
    <template v-if="!isLoading">
      <template v-if="!vaccinationUserInfo">
        <!-- NO ANAGRAFE VACCINALE -->
        <!-- ------------------------------------------------------------------------------------------------------- -->
        <template v-if="!isDelegationActive">
          <q-banner class="q-banner--info q-mt-lg">
            <div class="text-body1">
              Il tuo profilo non risulta censito nell'Anagrafe vaccinale. Ti
              consigliamo di recarti presso uno sportello per prenotare una
              vaccinazione.
            </div>
          </q-banner>
        </template>

        <!--  DELEGANTE NON CENSITO SU VACCINAZIONI -->
        <!-- ------------------------------------------------------------------------------------------------------- -->
        <template v-if="isDelegationActive && enrollmentCode !== '999'">
          <q-banner class="q-banner--info q-mt-lg">
            <div class="text-body1">
              Il profilo del tuo delegante non risulta censito nell'Anagrafe
              vaccinale. Ti consigliamo di recarti presso uno sportello per
              prenotare una vaccinazione.
            </div>
          </q-banner>
        </template>
      </template>
      <!--  UTENTE ESISTENTE -->
      <!-- ----------------------------------------------------------------------------------------------------------- -->
      <template v-else>
        <div class="q-mt-md">
          <!-- NO VACCINAZIONI -->
          <!-- ----------------------------------------------------------------------------------------------------- ---->
          <template
            v-if="immunizations.length === 0 && administrations.length === 0"
          >
            <q-banner class="q-banner--info">
              <div class="text-body1">
                Nessun vaccino effettuato disponibile
              </div>
            </q-banner>
          </template>

          <!-- LISTA SOMMINISTRAZIONI -->
          <!-- ----------------------------------------------------------------------------------------------------- -->
          <template v-if="administrations.length > 0">
            <!-- NO FSE -->
            <!-- --------------------------------------------------------------------------------------------------- -->
            <div v-if="!canDownloadVaccinationCertificate">
              <q-banner class="q-mt-md q-banner--warning">
                <template v-slot:avatar>
                  <q-icon name="warning" size="md" />
                </template>

                <div class="text-body1">
                  Per scaricare il certificato dei vaccini effettuati, occorre
                  avere aperto il Fascicolo Sanitario Elettronico.
                </div>
              </q-banner>
            </div>

            <div class="q-mt-md q-gutter-y-md">
              <vac-administered-list-item
                v-for="(administration, indexAd) in orderedAdministrations"
                :key="indexAd"
                :administered="administration"
                :reaction-list="reactionList"
                :vaccination-user-info="vaccinationUserInfo"
                :reaction-type-list="reactionTypeList"
              />
            </div>
          </template>
        </div>

        <!-- IMMUNIZZATE -->
        <!-- ----------------------------------------------------------------------------------------------------- -->
        <template v-if="immunizations.length > 0">
          <div class="q-mt-md q-gutter-y-md">
            <vac-immunized-list-item
              v-for="(immunized, indexI) in orderedImmunizations"
              :key="indexI"
              :immunized="immunized"
            />
          </div>
        </template>

        <!-- AZIONI -->
        <!-- --------------------------------------------------------------------------------------------------- -->
        <lms-buttons class="q-mt-lg">
          <template v-if="isCertificateDownloadable">
            <lms-button
              outline
              :loading="isDownloading"
              @click="downloadCertificate"
            >
              Certificato vaccini effettuati
            </lms-button>
          </template>

          <lms-button outline @click="goToAutocontribution">
            Aggiungi vaccino
          </lms-button>
        </lms-buttons>
      </template>
    </template>

    <!-- CARICAMENTO -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <lms-inner-loading :showing="isLoading" block />
  </div>
</template>

<script>
import { isMinor } from "../services/business-logic";
import {ENROLLMENT_CODE_MAP, IS_DEV, IS_PROD} from "../services/config";
import { apiErrorNotify } from "../services/utils";
import {
  downloadCertificatePdf,
  getAdministrationList,
  getEnrollmentInfo,
  getImmunizedList,
  getReactionList,
  getReactionTypeList,
  getVaccinationUserInfo
} from "../services/api";
import VacImmunizedListItem from "../components/VacImmunizedListItem";
import VacAdministeredListItem from "../components/VacAdministeredListItem";
import { SELFCONTRIBUTION } from "../router/routes";

export default {
  name: "PageVaccinationList",
  components: {
    VacAdministeredListItem,
    VacImmunizedListItem
  },
  data() {
    return {
      isDownloading: false,
      isLoading: false,
      reactionTypeList: [],
      reactionList: [],
      administrations: [],
      immunizations: [],
      vaccinationUserInfo: null
      // activeUserEnrollmentInfo: null,
      // enrollmentCode: null
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
      return this.$store.getters["getDelegatorSelected"];
    },
    activeDelegation() {
      return this.$store.getters["getDelegatorSelected"];
    },
    isDeclarationActive() {
      return (
        this.isDelegationActive &&
        isMinor(this.activeDelegation.data_nascita_delega)
      );
    },
    cf() {
      return this.$store.getters["getTaxCode"];
    },

    enrollmentInfo() {
      return this.$store.getters["getEnrollmentInfo"];
    },
    isCertificateDownloadable() {
      return this.administrations.length + this.immunizations.length > 0;
    },
    orderedAdministrations() {
      let result = [...this.administrations];

      result.sort(
        (a, b) =>
          new Date(a.data_appuntamento.toString()) -
          new Date(b.data_appuntamento.toString())
      );

      return result.reverse();
    },
    orderedImmunizations() {
      let result = [...this.immunizations];

      result.sort(
        (a, b) =>
          new Date(a.data_appuntamento.toString()) -
          new Date(b.data_appuntamento.toString())
      );

      return result.reverse();
    },
    activeUserEnrollmentInfo() {
      return this.$store.getters["getActiveUserEnrollmentInfo"];
    },
    enrollmentCode() {
      let code = this.activeUserEnrollmentInfo?.codice_risposta;
      if (this.isDelegationActive && !code) code = "999";
      return code;
    },
    canDownloadVaccinationCertificate() {
      let codes = ["003", "008", "012", "016"];
      return codes.includes(this.enrollmentCode);
    }
  },
  created() {},
  watch: {
    cf: {
      immediate: true,
      handler() {
        //riempio la home
        this.loadVaccinationsHome();
      }
    }
  },
  methods: {
    async loadVaccinationsHome() {
      let taxCode = this.cf;
      this.isLoading = true;
      this.administrations = [];
      this.immunizations = [];
      this.reactionTypeList = [];
      this.reactionList = [];
      this.vaccinationUserInfo = null;

      // await this.getDelegateEnrollment();
      let vaccinationUserInfo = getVaccinationUserInfo(taxCode);
      try {
        let { data } = await vaccinationUserInfo;
        this.vaccinationUserInfo = data;
        if (data && data.codice_fiscale) {
          this.vaccinationUserInfo = data;
        }
      } catch (error) {
        console.error(error);
      }

      if(!this.vaccinationUserInfo){
        this.isLoading = false;
        return
      }

      let immunizedListPromise = getImmunizedList(taxCode);
      let reactionListPromise = getReactionList(taxCode);
      let administrationList = getAdministrationList(taxCode);

      let reactionTypeList = getReactionTypeList(taxCode);

      try {
        let { data } = await immunizedListPromise;
        this.immunizations = data;
      } catch (error) {
        let message = "Non è stato possibile recuperare le immunizzate";
        apiErrorNotify({ error, message });
      }

      try {
        let { data } = await reactionTypeList;
        this.reactionTypeList = data;
      } catch (error) {
        let message =
          "Non è stato possibile recuperarei tipi di reazioni avverse";
        apiErrorNotify({ error, message });
      }

      try {
        let { data } = await reactionListPromise;
        this.reactionList = data;
      } catch (error) {
        let message =
          "Non è stato possibile recuperare le istanze reazione avversa";
        apiErrorNotify({ error, message });
      }

      try {
        let { data } = await administrationList;
        this.administrations = data;
      } catch (error) {
        let message =
          "Non è stato possibile recuperare le istanze reazione avversa";
        apiErrorNotify({ error, message });
      }


      this.isLoading = false;
    },
    // async getDelegateEnrollment() {
    //   if (!this.isDelegationActive) {
    //     this.activeUserEnrollmentInfo = this.enrollmentInfo;
    //     return;
    //   }
    //
    //   let taxCode = this.cf;
    //   let params = {
    //     servizio: this.workingApp.codice_servizio
    //   };
    //
    //   try {
    //     let { data } = await getEnrollmentInfo(taxCode, { params });
    //     this.enrollmentCode = data.codice_risposta;
    //     this.activeUserEnrollmentInfo = data;
    //   } catch (error) {
    //     console.error(error);
    //     this.enrollmentCode = "999";
    //   }
    // },
    onActivate() {
      window.location.assign("/la-mia-salute/arruolamento/");
    },
    downloadCertificate() {
      if (!this.canDownloadVaccinationCertificate) {
        let color = "negative";
        let message =
          "Per scaricare il certificato dei vaccini effettuati, occorre avere aperto il Fascicolo Sanitario Elettronico";
        this.$q.notify({ message, color });
        return;
      }

      let taxCode = this.cf;
      this.isDownloading = true;
      downloadCertificatePdf(taxCode);
      setTimeout(() => (this.isDownloading = false), 2000);
    },
    goToAutocontribution() {
      // DISABILITIAMO TEMPORANEAMENTE LA POSSIBILITA' DI INSERIRE UN VACCINO
      if (IS_PROD ) {
        this.$q.dialog({
          title: "",
          message: "L'inserimento di un nuovo vaccino è temporaneamente sospesa attraverso questo servizio. Ci scusiamo per il disagio"
        });

        return
      }
      let params = { citizen: this.vaccinationUserInfo };

      let name = SELFCONTRIBUTION.name;

      this.$router.push({ name, params });
    }
  }
};
</script>

<style lang="sass"></style>
