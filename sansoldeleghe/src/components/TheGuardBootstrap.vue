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
    <!-- APP -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <template v-else>
      <slot />
    </template>
    <!--    <lms-inner-loading :showing="isLoading">-->
    <!--      <lms-app-bootstrap-spinner />-->
    <!--    </lms-inner-loading>-->
  </div>
</template>

<script>
import {
  getConfig,
  getUser,
  getNotifyContacts,
  getDelegatorList,
  getEnrollmentInfo,
  getUserInfo,
  getDelegablesApp
} from "src/services/api";
import LmsAppBootstrapSpinner from "src/components/core/LmsAppBootstrapSpinner";
import LmsLayoutHeader from "components/core/LmsLayoutHeader";
import LmsLayoutFooter from "components/core/LmsLayoutFooter";
import LmsMaintenance from "components/core/LmsMaintenance";
import { date } from "quasar";
const { addToDate, subtractFromDate, isBetweenDates } = date;
export default {
  name: "TheGuardBootstrap",
  components: { LmsMaintenance, LmsLayoutFooter, LmsLayoutHeader },
  data() {
    return {
      isLoading: false
    };
  },
  computed: {
    user() {
      return this.$store.getters["getUser"];
    },
    isUserMinorByTaxCode() {
      return this.$store.getters["isUserMinorByTaxCode"];
    },
    isUserMinor() {
      return this.$store.getters["isUserMinor"];
    },
    workingApp() {
      return this.$store.getters["getWorkingApp"];
    },
    isInMaintenance() {
      //Se non riusciamo ad ottenere la configurazione diamo per scontato che non ci sia la manutenzione
      if (!this.workingApp) return false;

      let now = new Date();
      let startDate = this.workingApp?.manutenzione_data_inizio;
      let endDate = this.workingApp?.manutenzione_data_fine;

      //Se sentrambe le date non sono popolate  non c'è manutenzione
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
    let delegationsPromise = getDelegablesApp();

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

      // Se l'utente sembra essere un minorenne in base al CF
      // => dobbiamo effettuare un controllo incrociato con i dati su AURA
      if (this.isUserMinorByTaxCode) {
        try {
          let { data: userInfo } = await getUserInfo(taxCode);
          await this.$store.dispatch("setUserInfo", { userInfo });
        } catch (e) {
          console.error(e);
        }
      }

      //controllo che lutente non sia minorenne
      if (this.isUserMinor) {
        this.isLoading = false;
        return;
      }

      let contactsPromise = getNotifyContacts(taxCode);

      // Le informazioni su AURA le carichiamo solo se non le abbiamo già richieste
      let userInfoPromise = null;
      if (!this.isUserMinorByTaxCode) userInfoPromise = getUserInfo(taxCode);

      let userEnrollmentInfoPromise = getEnrollmentInfo(taxCode);
      let delegatorListPromise = null;

      // Solo se l'applicazione su cui stiamo lavorando è segnata come "delegabile"
      // carichiamo l'elenco dei deleganti per permettere all'utente di operare
      // per conto di un suo delegante
      if (this.workingApp?.delegabile) {
        delegatorListPromise = getDelegatorList(taxCode);
      }

      try {
        let { data: contacts } = await contactsPromise;
        this.$store.dispatch("setNotifyContacts", { contacts });
      } catch (e) {
        console.error(e);
      }

      if (userInfoPromise) {
        try {
          let { data: userInfo } = await userInfoPromise;
          this.$store.dispatch("setUserInfo", { userInfo });
        } catch (e) {
          console.error(e);
        }
      }

      try {
        let { data: enrollmentInfo } = await userEnrollmentInfoPromise;
        this.$store.dispatch("setEnrollmentInfo", { enrollmentInfo });
      } catch (e) {
        console.error(e);
      }

      if (delegatorListPromise) {
        try {
          let { data: delegatorList } = await delegatorListPromise;
          this.$store.dispatch("setDelegatorList", { delegatorList });
        } catch (e) {
          console.error(e);
        }
      }
    } catch (e) {
      console.error(e);
    }

    //Carichiamo le app delegabili
    try {
      // Poi carichiamo le informazioni dell'utente
      // Questo passaggio ci permette di sapere se l'utente è loggato o meno.
      // Se le API rispondono con un errore => l'utente non è loggato
      let { data: delegations } = await delegationsPromise;
      let appList = delegations.map(d => {
        d.codice_servizio = d.deleghe_codice;
        return d;
      });
      this.$store.dispatch("setDelegableAppServices", { appList });
    } catch (e) {
      console.error(e);
    }

    this.isLoading = false;
  }
};
</script>

<style scoped></style>
