<!--
 SPDX-License-Identifier: EUPL-1.2
 Copyright Regione Piemonte - 2023
-->

<template>
  <lms-page padding>
    <!-- NUOVA GESTIONE ARRUOLAMENTO -->
    <!-- --------------------------------------------------------------------------------------------------------- -->
    <div class="q-my-lg">
      <the-guard-enrollment2 :code="enrollmentCode" />
    </div>

    <template v-if="!isEnrollmentCodeBlocker">

      <!-- FARMACIE OCCASIONALI -->
      <!-- --------------------------------------------------------------------------------------------------------- -->
      <!-- Il delegato non può operare sulle farmacie abituali del delegante -->
      <template v-if="!delegatorSelected">
        <div class="text-h3 text-bold q-mb-lg">
          Farmacia occasionale
        </div>

        <farab-home-occasional-pharmacy-box class="q-mb-xl"/>
      </template>

      <!-- FARMACIE ABITUALI  -->
      <!-- --------------------------------------------------------------------------------------------------------- -->
      <!-- Gli utenti non piemontesi non possono operare sulle farmacie abituali -->
      <template v-if="isUsualPharmacyVisible">
        <div class="row q-col-gutter-md items-center q-mb-lg">
          <div class="col-12 col-md text-h3 text-bold">
            Farmacie abituali
          </div>

          <template v-if="isUserLogged && usualPharmacyList.length > 0">
            <div class="col-12 col-md-auto">
              <lms-buttons>
                <lms-button :to="PHARMACY_SEARCH">
                  Aggiungi una farmacia
                </lms-button>
              </lms-buttons>
            </div>
          </template>
        </div>

        <!-- CARICAMENTO -->
        <!-- ----------- -->
        <template v-if="isLoadingPharmacyList">
          <div class="q-gutter-y-md no-margin">
            <q-card v-for="i in 3" :key="i">
              <farab-usual-pharmacy-item-skeleton/>
            </q-card>
          </div>
        </template>

        <!-- NO FARMACIE ABITUALI O UTENTE NON LOGGATO -->
        <!-- ----------------------------------------- -->
        <template v-else-if="!isUserLogged || usualPharmacyList.length <= 0">
          <q-card>
            <q-card-section>
              <div class="row q-col-gutter-x-xl">
                <div class="col-4 col-lg-3 gt-sm">
                  <q-img
                    class="q-pa-md"
                    src="images/farmacia-abituale-vuoto.svg"
                  />
                </div>

                <div class="col">
                  <p class="text-bold q-mb-sm">
                    Abilita una o più farmacie che frequenti abitualmente ad
                    accedere alle tue ricette
                  </p>

                  <!--                <p>-->
                  <!--                  Consenti alle farmacie che frequenti solitamente di accedere alle tue ricette non ancora utilizzate:-->
                  <!--                  in questo modo tu non avrai bisogno di portarle sempre con te.-->
                  <!--                </p>-->
                  <q-banner class="q-banner--info q-my-md">
                    <div class="text-body1">
                      Consenti alle farmacie che frequenti solitamente di accedere alle tue ricette non ancora utilizzate:
                      in questo modo tu non avrai bisogno di portarle sempre con te.
                    </div>
                  </q-banner>

                  <a class="lms-link row items-center" @click="isOpenLearnMoreDialog=true">
                    Scopri di più
                    <q-icon class="q-ml-xs" color="primary" name="o_info"/>
                  </a>

                  <lms-buttons class="q-mt-md">
                    <lms-button @click="enablePharmacy">
                      Abilita farmacie
                    </lms-button>
                  </lms-buttons>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </template>

        <!-- LISTA FARMACIE ABITUALI -->
        <!-- ----------------------- -->
        <template v-else>
          <div class="q-gutter-y-md no-margin">
            <q-card
              v-for="pharmacy in usualPharmacyListSorted"
              :key="pharmacy.id"
            >
              <farab-usual-pharmacy-item
                :pharmacy="pharmacy"
                @is-changed="onManagePharmacy"
              />
            </q-card>
          </div>
        </template>
      </template>

    </template>

    <!--    Onboarding Dialog-->
    <farab-onboarding-dialog
      :is-loading="isLoading"
      :value="showOnBoardingDialog"
      @close-onboarding-dialog="closeOnboardingTutorialDialog"/>

    <q-dialog v-model="isOpenLearnMoreDialog">
      <q-card>

        <div class="row items-start justify-between reverse q-px-md q-pt-sm">
          <q-btn v-close-popup class="col-auto" dense flat icon="close" round/>
        </div>

        <q-card-section>
          <p class="text-h6 text-weight-regular q-mb-lg">
            Ricorda che per usufruire di questo servizio è <strong>indispensabile aver espresso il consenso alla consultazione
            dei tuoi dati clinico-sanitari</strong>… Non l’hai ancora fatto?<br> <a
            class="lms-link" href="url">Provvedi subito!</a>
          </p>

          <lms-buttons class="q-mt-md">
            <lms-button @click="enablePharmacy">
              Abilita farmacie
            </lms-button>
          </lms-buttons>
        </q-card-section>




      </q-card>
    </q-dialog>

  </lms-page>
</template>

<script>
import {
  getUsualPharmacies,
  setTutorialStatus,
} from "src/services/api";
import {apiErrorNotifyDialog, login} from "src/services/utils";
import {PHARMACY_SEARCH} from "src/router/routes";
import FarabHomeOccasionalPharmacyBox from "components/FarabHomeOccasionalPharmacyBox";
import FarabUsualPharmacyItem from "src/components/FarabUsualPharmacyItem";
import FarabUsualPharmacyItemSkeleton from "src/components/FarabUsualPharmacyItemSkeleton";
import FarabOnboardingDialog from "components/FarabOnboardingDialog";
import TheGuardEnrollment2 from "components/TheGuardEnrollment2";

export default {
  name: "PageHome",
  components: {
    TheGuardEnrollment2,
    FarabOnboardingDialog,
    FarabHomeOccasionalPharmacyBox,
    FarabUsualPharmacyItemSkeleton,
    FarabUsualPharmacyItem
  },
  data() {
    return {
      isLoading: false,
      PHARMACY_SEARCH,
      isLoadingPharmacyList: false,
      authorizedPharmacy: false,
      isCertifyingDevice: false,
      showOnBoardingDialog: false,
      isOpenLearnMoreDialog:false
    };
  },
  computed: {
    user() {
      return this.$store.getters["getUser"];
    },
    isUserLogged() {
      return this.$store.getters["isUserLogged"];
    },
    workingApp() {
      return this.$store.getters["getWorkingApp"];
    },
    userInfo() {
      return this.$store.getters["getUserInfo"];
    },
    taxCode() {
      return this.$store.getters["getTaxCode"];
    },
    delegatorSelected() {
      return this.$store.getters["getDelegatorSelected"];
    },
    deviceUuid() {
      return this.$store.getters["getDeviceUuid"];
    },
    usualPharmacyList() {
      return this.$store.getters["getUsualPharmacyList"];
    },
    usualPharmacyListSorted() {
      let result = [...this.usualPharmacyList];

      result.sort((a, b) => {
        return a?.farmacia?.descrizione >= b?.farmacia?.descrizione ? 1 : -1;
      });

      return result;
    },
    isUsualPharmacyVisible() {
      let isUserLogged = this.isUserLogged;
      let isUserPiedmont = this.userInfo;

      // L'utente non loggato vede sempre il box delle farmacie abituali
      if (!isUserLogged) return true;

      // Se c'è il delegante selezionato => può vedere perché i deleganti sono sempre piemontesi
      if (this.delegatorSelected) return true;

      // Altrimenti l'utente è loggato, non ha selezionato il delegante
      // => vede il box solo se è piemontese
      return isUserPiedmont;
    },

    isTutorialSeen() {
      return this.user?.info?.tutorial_farab_visualizzato;
    },
    enrollmentCode() {
      return this.activeUserEnrollmentInfo?.codice_risposta;
    },
    activeUserEnrollmentInfo() {
      return this.$store.getters["getActiveUserEnrollmentInfo"];
    },
    isEnrollmentCodeBlocker() {
       const  BLOCK_CODE_LIST = [
        "000",
        "004",
        "005",
        "007",
        "010",
        "011",
        "015"
      ];
      return BLOCK_CODE_LIST.includes(this.enrollmentCode);
    },
  },

   created() {
    if (this.user && !this.isTutorialSeen) this.showOnBoardingDialog = true;
    if (this.isUsualPharmacyVisible && this.isUserLogged) {
      this.getUsualPharmacyList();
    }
  },
  methods: {
    async getUsualPharmacyList() {
      this.isLoadingPharmacyList = true;

      try {
        let {data} = await getUsualPharmacies(this.taxCode);
        await this.$store.dispatch("setUsualPharmacyList", {
          usualPharmacyList: data
        });
      } catch (error) {
        let message = "Non è stato possibile recuperare le farmacie abituali";
        apiErrorNotifyDialog({error, message});
      }

      this.isLoadingPharmacyList = false;
    },
    enablePharmacy() {
      if (this.isUserLogged) {
        this.$router.push(PHARMACY_SEARCH);
      } else {
        let loginUrl = "/api/bff/login";
        let landingUrl = `${window.location.pathname}#/`;
        login(loginUrl, landingUrl);
      }
    },
    onManagePharmacy(isChanged) {
      if (isChanged) {
        this.getUsualPharmacyList();
      }
    },
    async closeOnboardingTutorialDialog(value) {


      this.isLoading = true;
      try {
        let userID = this.user?.info?.id;
        let payload = {
          tutorial_farab_visualizzato: true
        };

        let response = await setTutorialStatus(userID, payload);
        this.$store.dispatch("setUserStatus", response.data);
      } catch (e) {
        // apiErrorNotify({ error, message });
      } finally {
        this.isLoading = false;
        this.showOnBoardingDialog = value;
      }


    }
  }
};
</script>

<style lang="sass"></style>
