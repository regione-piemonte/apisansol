<!--
 SPDX-License-Identifier: EUPL-1.2
 Copyright Regione Piemonte - 2023
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
  getUserInfo,
  getUsualPharmacies,
  getSuggestedAddress
} from "src/services/api";
import LmsLayoutFooter from "components/core/LmsLayoutFooter";
import LmsLayoutHeader from "components/core/LmsLayoutHeader";
import { date } from "quasar";
import LmsMaintenance from "components/core/LmsMaintenance";
import {apiErrorNotify, isEmpty, login} from "src/services/utils";
import {
  normalizeAddress,
  normalizeLoccsiCities,
  normalizeLoccsiRoads
} from "src/services/business-logic";
import {FSE_APP_CODE} from "src/services/config";


const { addToDate, subtractFromDate, isBetweenDates } = date;

export default {
  name: "TheGuardBootstrap",
  components: { LmsMaintenance, LmsLayoutHeader, LmsLayoutFooter },
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
    workingAppDelegatorList(){
      return this.$store.getters["getWorkingAppDelegatorList"];
    },
    userDomicile() {
      return this.$store.getters["getUserDomicile"];
    },
    userInfo() {
      return this.$store.getters["getUserInfo"];
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
    isUserMinor() {
      return this.$store.getters["isUserMinor"];
    }
  },
  async created() {
    this.isLoading = true;

    this.$store.dispatch("loadDeviceUuid");

    let configPromise = getConfig();
    let userPromise = getUser();

    // Prima di tutto carichiamo la configurazione generale di "La mia salute"
    // conterrà informazioni su tutte le applicazioni che compongono il portale, compresa questa che stiamo sviluppando
    // e conterrà informazioni relative a Firebase per l'integrazione delle notifiche push
    try {
      let { data: config } = await configPromise;
      await this.$store.dispatch("setConfig", { config });
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
      let userInfoPromise = getUserInfo(taxCode);

      try {
        let { data: userInfo } = await userInfoPromise;
        this.$store.dispatch("setUserInfo", { userInfo });
      } catch (e) {
        console.error(e);
      }

      //controllo che lutente non sia minorenne
      if (this.isUserMinor) {
        this.isLoading = false;
        return;
      }



      let contactsPromise = getNotifyContacts(taxCode);


      let params = { servizio: FSE_APP_CODE};
      let userEnrollmentInfoPromise = getEnrollmentInfo(taxCode, {params});
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

    // Se l'utente non è loggato e l'applicazione attuale non è configurata come "pubblica"
    // cioè accessibile anche da utenti anonimi => mandiamo l'utente alla pagina di login
    if (!this.user && !this.workingApp?.pubblico) {
      login("/api/bff/login");
      return;
    }

    // Se siamo in modalità delega => carichiamo anche i dati necessari del delegante
    let { d } = this.$route.query;
    let delegatorSelected = this.workingAppDelegatorList.find(
      // el => el.codice_fiscale_delega === d
      el => el.uuid === d
    );

    if (delegatorSelected) {

      await this.$store.dispatch("setDelegatorSelected", {
        delegatorSelected
      });

      let taxCode = delegatorSelected.codice_fiscale_delega;


      try {
        let params = { servizio: FSE_APP_CODE };
        let { data: enrollmentInfo } = await getEnrollmentInfo(taxCode, {params});
        await this.$store.dispatch("setDelegatorSelectedEnrollmentInfo", {
          enrollmentInfo
        });
      } catch (error) {
        console.error(error);
      }
    }


    if (this.userInfo) {
      let normalizedAddress = normalizeAddress(this.userDomicile?.indirizzo);
      let onSearchAddress = `${normalizedAddress} ${this.userDomicile?.desc_comune}`;
      let userAddress = null;
      try {
        let params = { indirizzo: onSearchAddress };
        let addressResponse = await getSuggestedAddress({ params });
        let addressObject = addressResponse.data;
        let address = null;
        if (!isEmpty(addressObject)) {
          addressObject = normalizeLoccsiRoads(addressObject);
          address = addressObject.filter(
            address =>
              address.comune === this.userDomicile.desc_comune?.toUpperCase()
          )[0];
          if (!address) {
            let cityQuery = { indirizzo: this.userDomicile?.desc_comune };
            let cityResponse = await getSuggestedAddress({
              _no5XXRedirect: true,
              params: cityQuery
            });
            let cityObject = cityResponse.data;
            if (!isEmpty(cityObject)) {
              cityObject = normalizeLoccsiCities(cityObject);
              address = cityObject.filter(
                address =>
                  address.indirizzo ===
                  this.userDomicile.desc_comune?.toUpperCase()
              )[0];
            }
          }
          if (address)
            userAddress = {
              label: address.indirizzo,
              value: address.id,
              coords: {
                lat: address.coordinate.coordinates[1],
                lon: address.coordinate.coordinates[0]
              }
            };
        }
        this.$store.dispatch("setUserAddress", { address: userAddress });
      } catch (e) {
        console.error(e);
      }
    }

    this.isLoading = false;
  }
};
</script>

<style scoped></style>
