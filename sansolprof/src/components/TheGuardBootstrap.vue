<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="lms-the-guard-bootstrap">
    <!-- LOADING -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <template v-if="isLoading">
      <!-- IN PRODUZIONE LASCIAMO IL VECCHIO LOADER -->
      <!--      <template v-if="$config.global.isProduction">-->
      <!--        <csi-app-bootstrap-loader :visible="isLoading" no-transition/>-->
      <!--      </template>-->

      <!-- NEGLI ALTRI AMBIENTI TESTIAMO IL NUOVO LOADER -->
      <!--      <template v-else>-->
      <q-layout>
        <!-- APP HEADER -->
        <!-- ---------- -->
        <lms-layout-header menu />

        <!-- PAGE CONTAINER -->
        <!-- -------------- -->
        <q-page-container>
          <q-page
            padding
            class="flex flex-center"
            style="min-height: 0px; max-height: 200px"
          >
            <lms-inner-loading block :showing="true" />
          </q-page>
        </q-page-container>

        <!-- FOOTER -->
        <!-- ------ -->
        <lms-layout-footer no-rating no-help />
      </q-layout>
      <!--      </template>-->
    </template>

    <!-- MANUTENZIONE -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <template v-else-if="isInMaintenance">
      <q-layout>
        <!-- APP HEADER -->
        <!-- ---------- -->
        <lms-layout-header />

        <!-- PAGE CONTAINER -->
        <!-- -------------- -->
        <q-page-container>
          <lms-page padding style="min-height: 0px;">
            <lms-maintenance />
          </lms-page>
        </q-page-container>

        <!-- FOOTER -->
        <!-- ------ -->
        <lms-layout-footer no-rating no-help />
      </q-layout>
    </template>

    <!-- AVVIAMO L'APP -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <template v-else>
      <slot />
    </template>
  </div>
</template>

<script>
import {
  getConfig,
  getUser,
  getNotifyContacts,
  getDelegatorList,
  getEnrollmentInfo,
  getUserInfo
} from "src/services/api";
import LmsLayoutHeader from "components/core/LmsLayoutHeader";
import LmsMaintenance from "components/core/LmsMaintenance";
import LmsLayoutFooter from "components/core/LmsLayoutFooter";
import { date } from "quasar";
import {login} from "src/services/utils";
const { addToDate, subtractFromDate, isBetweenDates } = date;


export default {
  name: "TheGuardBootstrap",
  components: {LmsLayoutFooter, LmsMaintenance, LmsLayoutHeader },
  data() {
    return {
      isLoading: false
    };
  },
  computed: {
    user() {
      return this.$store.getters["getUser"];
    },
    workingApp() {
      return this.$store.getters["getWorkingApp"];
    },
    isInMaintenance() {
      // Se non riuscimo a trovare la configurazione => come fallback diciamo che non c'è manutenzione
      if (!this.workingApp) return false;

      let now = new Date();
      let startDate = this.workingApp?.manutenzione_data_inizio;
      let endDate = this.workingApp?.manutenzione_data_fine;

      // Se entrambe le date non sono popolate => non c'è manutenzione
      if (!startDate && !endDate) return false;

      startDate = startDate || subtractFromDate(now, { days: 1 });
      endDate = endDate || addToDate(now, { days: 1 });

      return isBetweenDates(now, startDate, endDate, {
        inclusiveFrom: true,
        inclusiveTo: true
      });
    }
  },
  async created() {
    this.isLoading = true;
    let configPromise = getConfig();
    let userPromise = getUser();

    // Prima di tutto carichiamo la configurazione generale di "La mia salute"
    // conterrà informazioni su tutte le applicazioni che compongono il portale, compresa questa che stiamo sviluppando
    // e conterrà informazioni relative a Firebase per l'integrazione delle notifiche push
    try {
      let { data: config } = await configPromise;
      this.$store.dispatch("setConfig", { config });
    } catch (e) {
      console.error(e);
    }

    // Se l'applicazione è in manutenzione => non facciamo altre chiamate inutili
    if (this.isInMaintenance) {
      this.isLoading = false;
      return;
    }

    try {
      // Poi carichiamo le informazioni dell'utente
      // Questo passaggio ci permette di sapere se l'utente è loggato o meno.
      // Se le API rispondono con un errore => l'utente non è loggato
      let { data: user } = await userPromise;
      this.$store.dispatch("setUser", { user });

      // Solo se l'utente è loggato carichiamo
      //  1. I contatti impostati sul notificatore
      //     Se questa chiamata fallisce significa che l'utente non ha
      //     ancora attivato il profilo del notificatore e quindi non può
      //     ricevere SMS, MAIL e Push
      //
      //  2. Informazioni più dettagliate sull'utente
      //     Se questa chiamata fallisce significa che l'utente non è un assistito piemontese
      //     e quindi alcune funzionalità potrebbero essere limitate
      //
      //  3. Informazioni relative all'apertura del FSE
      let taxCode = user.cf;
      let contactsPromise = getNotifyContacts(taxCode);
      let userInfoPromise = getUserInfo(taxCode);
      // let userEnrollmentInfoPromise = getEnrollmentInfo(taxCode);


      try {
        let { data: contacts } = await contactsPromise;
        this.$store.dispatch("setNotifyContacts", { contacts });
      } catch (e) {
        console.error(e);
        if (e.response.status !== 404)
          this.$store.dispatch("setErrorContacts");
      }

      try {
        let { data: userInfo } = await userInfoPromise;
        this.$store.dispatch("setUserInfo", { userInfo });
      } catch (e) {
        console.error(e);
      }

      // try {
      //   let { data: enrollmentInfo } = await userEnrollmentInfoPromise;
      //   this.$store.dispatch("setEnrollmentInfo", { enrollmentInfo });
      // } catch (e) {
      //   console.error(e);
      // }


    } catch (e) {
      console.error(e);
    }

    if (!this.user && !this.$route.meta?.public) {
      let loginUrl = "/api/bff/login";
      let landingUrl = window.location.pathname;
      login(loginUrl, landingUrl);
      return;
    }

    this.isLoading = false;
  }
};
</script>

<style scoped></style>
