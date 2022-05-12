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
          <lms-page padding style="min-height: 0px">
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
  // getUserInfo,
  getUserApplicationsList,
  getCmsMessageList,
} from "src/services/api";
import {
  getCitizenDetail,
  getEnrollmentConsent,
  getIsDocumentDownloadable,
} from "../services/api";
import { login } from "../services/utils";
import LmsLayoutHeader from "components/core/LmsLayoutHeader";
import LmsLayoutFooter from "components/core/LmsLayoutFooter";
import { date } from "quasar";
import LmsMaintenance from "./core/LmsMaintenance";

const { addToDate, subtractFromDate, isBetweenDates } = date;

export default {
  name: "TheGuardBootstrap",
  components: { LmsMaintenance, LmsLayoutFooter, LmsLayoutHeader },
  data() {
    return {
      isLoading: false,
    };
  },
  computed: {
    user() {
      return this.$store.getters["getUser"];
    },
    workingApp() {
      return this.$store.getters["getWorkingApp"];
    },
    workingAppDelegatorList() {
      return this.$store.getters["getWorkingAppDelegatorList"];
    },
    delegatorSelectedEnrollmentInfo() {
      return this.$store.getters["getDelegatorSelectedEnrollmentInfo"];
    },
    isOtpLoginActive() {
      return this.$store.getters["isOtpLoginActive"];
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
        inclusiveTo: true,
      });
    },
  },
  async created() {
    this.isLoading = true;
    await this.$store.dispatch("checkOtpSession");
    let configPromise = getConfig();
    let userPromise = getUser();
    let messageListPromise = getCmsMessageList();

    // Prima di tutto carichiamo la configurazione generale di "La mia salute"
    // conterrà informazioni su tutte le applicazioni che compongono il portale, compresa questa che stiamo sviluppando
    // e conterrà informazioni relative a Firebase per l'integrazione delle notifiche push
    try {
      let { data: config } = await configPromise;
      await this.$store.dispatch("setConfig", { config });
    } catch (e) {
      console.error(e);
    }

    // Il caricamento dei messaggi lo facciamo completamente in modo asincrono
    // così da non bloccare l'avanzamento della logica per questo tipo di informazione
    messageListPromise.then(({ data }) => {
      let messageList = data?.results ?? [];
      this.$store.dispatch("setCmsMessageList", { messageList });
    });

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
      await this.$store.dispatch("setUser", { user });

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
      // let userInfoPromise = getUserInfo(taxCode);
      // let userEnrollmentInfoPromise = getEnrollmentInfo(taxCode);
      // let userEnrollmentConsentPromise = getEnrollmentConsent(taxCode);
      let delegatorListPromise = null;
      let userApplicationPromise = getUserApplicationsList(taxCode);
      // Solo se l'applicazione su cui stiamo lavorando è segnata come "delegabile"
      // carichiamo l'elenco dei deleganti per permettere all'utente di operare
      // per conto di un suo delegante
      if (this.workingApp?.delegabile) {
        delegatorListPromise = getDelegatorList(taxCode);
      }

      try {
        let { data: contacts } = await contactsPromise;
        await this.$store.dispatch("setNotifyContacts", { contacts });
      } catch (e) {
        console.error(e);
      }



      if (delegatorListPromise) {
        try {
          let { data: delegatorList } = await delegatorListPromise;
          await this.$store.dispatch("setDelegatorList", { delegatorList });
          await this.$store.dispatch("setDelegatorListError", false);
        } catch (e) {
          console.error(e);
          if(e.response.status === 500)
            await this.$store.dispatch("setDelegatorListError", true);
        }
      }


      try {
        let {data: appList} = await userApplicationPromise;
        this.$store.dispatch("setUserApplicationsList", {appList});
      } catch (error) {
        console.error(error);
      }
    } catch (e) {
      console.error(e);
    }



    // Se l'utente non è loggato e l'applicazione attuale non è configurata come "pubblica"
    // cioè accessibile anche da utenti anonimi => mandiamo l'utente alla pagina di login
    if (!this.user && !this.workingApp?.pubblico) {
      login("/api/bff/login");
      return;
    }

    // Se siamo in modalità delega => carichiamo anche i dati necessari del delegante
    let { d } = this.$route.query;
    let delegatorSelected = this.workingAppDelegatorList.find(
      // (el) => el.codice_fiscale_delega === d
      (el) => el.uuid === d
    );

    if (delegatorSelected) {
      await this.$store.dispatch("setDelegatorSelected", {
        delegatorSelected,
      });

      let taxCode = delegatorSelected.codice_fiscale_delega;

      let params = {
        servizio: this.workingApp.deleghe_codice,
      };


    }

    // Se l'utente è loggato => carichiamo le sue informazioni
    if (this.user || this.isOtpLoginActive) {
      let taxCode = this.$store.getters["getTaxCode"];
      try {
        let { data: citizen } = await getCitizenDetail(taxCode);
        await this.$store.dispatch("setCitizen", { citizen });

        // if (this.$c.IS_DEV || this.$c.IS_TEST) {
        // Per il momento chiediamo queste informazioni solo per l'elenco "elencoTampone"
        let reportList = citizen?.elencoTampone || [];
        reportList = reportList.filter((el) => !!el.idDocumento && !!el.codCl);


      } catch (error) {
        console.error(error);
        await this.$store.dispatch("setCitizenError", { error });
      }


    }

    this.isLoading = false;
  },
};
</script>

<style scoped></style>
