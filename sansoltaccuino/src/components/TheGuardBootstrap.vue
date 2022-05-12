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
    </template>
    <!-- MANUTENZIONE -->
    <!-- ----------------------------------------------------------------------->
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
  getUserInfo,
  getNotebookDetail
} from "src/services/api";
import { WELCOME } from "../router/routes";
import { apiErrorNotifyDialog } from "../services/utils";
import { getEnrollmentConsent, createAudit } from "../services/api";
import LmsLayoutHeader from "./core/LmsLayoutHeader";
import LmsLayoutFooter from "./core/LmsLayoutFooter";
import LmsLayoutAppToolbar from "./core/LmsLayoutAppToolbar";
import { date } from "quasar";
import LmsMaintenance from "components/core/LmsMaintenance";

const { addToDate, subtractFromDate, isBetweenDates } = date;
export default {
  name: "TheGuardBootstrap",
  components: {
    LmsMaintenance,
    LmsLayoutFooter,
    LmsLayoutHeader
  },
  data() {
    return {
      isLoading: false
    };
  },
  computed: {
    user() {
      return this.$store.getters["getUser"];
    },
    userInfo() {
      return this.$store.getters["getUserInfo"];
    },
    enrollmentInfo() {
      return this.$store.getters["getEnrollmentInfo"];
    },
    isUserEnrolled() {
      return this.$store.getters["isUserEnrolled"];
    },
    workingApp() {
      return this.$store.getters["getWorkingApp"];
    },
    workingAppDelegatorList() {
      return this.$store.getters["getWorkingAppDelegatorList"];
    },
    notebook() {
      return this.$store.getters["getNotebook"];
    },
    delegatorSelected() {
      return this.$store.getters["getDelegatorSelected"];
    },
    isDelegatorSelectedEnrolled() {
      return this.$store.getters["isDelegatorSelectedEnrolled"];
    },
    delegatorSelectedEnrollmentInfo() {
      return this.$store.getters["getDelegatorSelectedEnrollmentInfo"];
    },
    workingAppName() {
      return this.workingApp?.descrizione;
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
    },
    isUserMinorByTaxCode() {
      return this.$store.getters["isUserMinorByTaxCode"];
    },
    isUserMinor() {
      return this.$store.getters["isUserMinor"];
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

      try {
        let { data: userInfo } = await getUserInfo(taxCode);
        this.$store.dispatch("setUserInfo", { userInfo });
      } catch (e) {
        console.error(e);
      }

      //controllo che lutente non sia minorenne - se è minorenne non continuo
      if (this.isUserMinor) {
        this.isLoading = false;
        return;
      }

      let contactsPromise = getNotifyContacts(taxCode);
      // let userInfoPromise = getUserInfo(taxCode);
      let userEnrollmentInfoPromise = getEnrollmentInfo(taxCode);
      let userEnrollmentConsentPromise = getEnrollmentConsent(taxCode);
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

      try {
        let { data: enrollmentInfo } = await userEnrollmentInfoPromise;
        this.$store.dispatch("setEnrollmentInfo", { enrollmentInfo });
      } catch (e) {
        console.error(e);
      }

      try {
        let { data: consent } = await userEnrollmentConsentPromise;
        await this.$store.dispatch("setEnrollmentConsent", { consent });
      } catch (error) {
        console.error(error);
      }

      if (delegatorListPromise) {
        try {
          let { data: delegatorList } = await delegatorListPromise;
          await this.$store.dispatch("setDelegatorList", { delegatorList });
          await this.$store.dispatch("setDelegatorListError", false);
        } catch (e) {
          console.error(e);
          if (e.response.status === 500)
            await this.$store.dispatch("setDelegatorListError", true);
        }
      }
    } catch (e) {
      console.error(e);
    }

    // Controlliamo se siamo in modalità delega
    // E se siamo in modalità delega => lo impostiamo
    let { d } = this.$route.query;
    let delegatorSelected = this.workingAppDelegatorList.find(
      // el => el.codice_fiscale_delega === d
      el => el.uuid === d
    );

    if (delegatorSelected) {
      let taxCode = delegatorSelected.codice_fiscale_delega;
      await this.$store.dispatch("setDelegatorSelected", {
        delegatorSelected
      });

      try {
        let params = {
          servizio: this.workingApp.deleghe_codice
        };

        let { data: enrollmentInfo } = await getEnrollmentInfo(taxCode, {
          params
        });
        await this.$store.dispatch("setDelegatorSelectedEnrollmentInfo", {
          enrollmentInfo
        });
      } catch (error) {
        console.error(error);
      }

      if (this.delegatorSelectedEnrollmentInfo?.risposta === false) {
        let params = { servizio: "FSETAC" };

        try {
          let { data: consent } = await getEnrollmentConsent(taxCode, {
            params
          });

          await this.$store.dispatch("setDelegatorSelectedEnrollmentConsent", {
            consent
          });
        } catch (error) {
          console.error(error);
        }
      }
    }

    // Le informazioni sul taccuino le chiediamo solo se
    //  - In modalità normale l'utente è piemontese ed ha il FSE aperto
    //  - In modalità delega il delegante ha il FSE aperto
    let isUserPiedmont = !!this.userInfo;
    let isUserEnrolled = !!this.isUserEnrolled;
    let isDelegatorSelected = !!this.delegatorSelected;
    let isDelegatorSelectedEnrolled = !!this.isDelegatorSelectedEnrolled;

    let mustRequestNotebook = isUserPiedmont && isUserEnrolled;
    // if (isDelegatorSelected) mustRequestNotebook = isDelegatorSelectedEnrolled;
    if (isDelegatorSelected) mustRequestNotebook = true;

    if (mustRequestNotebook) {
      let taxCode = this.$store.getters["getTaxCode"];
      let notebookPromise = getNotebookDetail(taxCode);
      let measureUnitConfigurationPromise = this.$store.dispatch(
        "loadMeasureUnitConfiguration"
      );

      try {
        let { data: notebook } = await notebookPromise;
        // notebook.note_generali = null;
        await this.$store.dispatch("setNotebook", { notebook });

        if (this.delegatorSelected) {
          await this.$store.dispatch("setIsDelegatorSelectedPiedmont", {
            isPiedmont: true
          });
        }

        // Se al primo caricamento vediamo che l'utente non ha le note generali impostate
        // => vuol dire che si tratte del primo accesso al servizio
        //    quindi lo mandiamo alla pagina di benvenuto
        //    dove può e DEVE inserire le note generali
        if (!this.notebook?.note_generali?.data_creazione) {
          this.$router.replace(WELCOME);
        }
      } catch (err) {
        let mustShowError = true;

        // Se siamo in modalità delega e l'API ci dice che l'utente non è piemontese =>
        // salviamo questa informazione nello store
        if (this.delegatorSelected) {
          let details = err?.response?.data?.detail ?? [];
          let isNotPiedmont = details.some(d => d.chiave === "UC_ERR_087");
          await this.$store.dispatch("setIsDelegatorSelectedPiedmont", {
            isPiedmont: !isNotPiedmont
          });

          let isHidden = details.some(d => d.chiave === "UC_ERR_012");
          await this.$store.dispatch("setIsNotebookHiddenToDelegator", {
            isHidden
          });

          let isClosed = details.some(d =>
            ["UC_ERR_011", "UC_ERR_091"].includes(d.chiave)
          );
          await this.$store.dispatch("setIsNotebookClosed", { isClosed });

          // Per gli errori gestiti non vogliamo mostrare la dialog di errore
          if (isNotPiedmont || isHidden || isClosed) mustShowError = false;
        }

        if (mustShowError) {
          let message =
            "Non è stato possibile caricare le informazioni sul taccuino";
          apiErrorNotifyDialog({ err, message });
        }
      }

      try {
        await measureUnitConfigurationPromise;
      } catch (err) {
        console.error(err);
      }
    }

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

    this.isLoading = false;
  }
};
</script>

<style lang="sass"></style>
