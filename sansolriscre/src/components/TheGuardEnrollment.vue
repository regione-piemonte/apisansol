<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="lms-the-guard-enrollment">
    <template v-if="isUserEnrolled || !isEnrollmentMandatory">
      <slot />
    </template>

    <!-- ARRUOLAMENTO OBBLIGATORIO -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <template v-else>
      <q-layout>
        <lms-layout-header />

        <q-page-container>
          <lms-page padding>
            <q-card>
              <q-card-section>
                <lms-enrollment-banner
                  :activable="isUserEnrollable"
                  @click-activate="onActivate"
                />
              </q-card-section>
            </q-card>
          </lms-page>
        </q-page-container>

        <lms-layout-footer />
      </q-layout>
    </template>

    <!-- ARRUOLAMENTO CONSIGLIATO -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <template
      v-if="
        !isUserEnrolled && isEnrollmentRecommended && !isEnrollmentMandatory
      "
    >
      <q-dialog v-model="isEnrollmentRecommendedModalVisible">
        <q-card style="width: 1000px; max-width: 80vw;">
          <q-card-section>
            <lms-enrollment-banner
              :activable="isUserEnrollable"
              closable
              @click-activate="onActivate"
              @click-close="onClose"
            />
          </q-card-section>
        </q-card>
      </q-dialog>
    </template>
  </div>
</template>

<script>
import LmsEnrollmentBanner from "./core/LmsEnrollmentBanner";
import LmsLayoutHeader from "./core/LmsLayoutHeader";
import LmsLayoutFooter from "./core/LmsLayoutFooter";
import {ENROLLMENT_CODES} from "src/services/config";

// const CODES = {
//   // Il soggetto  ha chiesto che non gli venisse più suggerito l’apertura del fascicolo.
//   DO_NOT_ASK_ME_AGAIN: "000",
//   // Il soggetto non è piemontese
//   NO_PIEDMONT: "001",
//   // Il soggetto non è maggiorenne
//   NO_ADULT: "002",
//   // Il soggetto ha un FSE con alimentazione a SI
//   FSE_APPROVED: "003",
//   // Il soggetto è piemontese, maggiorenne ma non ha un FSE
//   NO_FSE: "004",
//   // Il soggetto è piemontese, maggiorenne ma ha un FSE con alimentazione valorizzata a NO
//   FSE_NOT_APPROVED: "005",
//   UNKNOWN: "999"
// };

export default {
  name: "TheGuardEnrollment",
  components: { LmsLayoutFooter, LmsLayoutHeader, LmsEnrollmentBanner },
  data() {
    return {
      isEnrollmentRecommendedModalVisible: true
    };
  },
  computed: {
    user() {
      return this.$store.getters["getUser"];
    },

    enrollmentInfo() {
      return this.$store.getters["getEnrollmentInfo"];
    },
    appList() {
      return this.$store.getters["getAppList"];
    },
    app() {
      return this.appList?.find(a => a.codice === process.env.APP_CODE);
    },
    isEnrollmentRecommended() {
      return this.app?.arruolabile;
    },
    isEnrollmentMandatory() {
      return (
        this.isEnrollmentRecommended && this.app?.obbligatorio_arruolamento
      );
    },
    isUserEnrolled() {
      let code = this.enrollmentInfo?.codice_risposta;
      let codes = [ENROLLMENT_CODES.FSE_APPROVED, ENROLLMENT_CODES.FSE_NOT_APPROVED];
      return codes.includes(code);
    },
    isUserEnrollable() {
      return this.enrollmentInfo?.risposta;
    }
  },
  methods: {
    onActivate() {
      const url = "/la-mia-salute/arruolamento/#/";
      window.location.assign(url);
    },
    onClose() {
      this.isEnrollmentRecommendedModalVisible = false;
    }
  }
};
</script>

<style scoped></style>
