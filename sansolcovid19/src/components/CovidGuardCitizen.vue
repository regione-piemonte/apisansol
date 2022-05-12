<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="covid-guard-citizen">
    <!-- NO CITTADINO IN PIATTAFORMA -->
    <!-- --------------------------- -->
    <template v-if="citizenError">
      <lms-page padding>
        <template v-if="mustShowCitizenErrorMessage">
          <q-banner rounded class="bg-orange-2 q-my-lg">
            Gentile utente, <br />
            al momento non sono disponibili informazioni a suo nome
            nell'infrastruttura regionale COVID-19. Qualora abbiate una
            prenotazione di un Tampone oppure è stato effettuato un Tampone da
            oltre 3 giorni, La invitiamo a prendere contatti con il Servizio
            Igiene e Sanità pubblica (SISP) della Vostra ASL di competenza.
          </q-banner>
        </template>

        <template v-else>
          <q-banner rounded class="bg-red-2 q-my-lg">
            <p>
              Servizio al momento non disponibile, ti consigliamo di riprovare
              più tardi
            </p>
            <p>
              <span
                >Se il problema persiste
                <a :href="assistanceUrl" class="lms-link"
                  >contatta l'assistenza</a
                >
              </span>
            </p>
          </q-banner>
        </template>
      </lms-page>
    </template>

    <!-- CITTADINO IN PIATTAFORMA CHE DEVE VALIDARE I CONTATTI -->
    <!-- ----------------------------------------------------- -->
    <template v-else-if="mustConfirmContacts">
      <lms-page padding>
        <q-banner rounded class="bg-blue-2 q-mt-md">
          <template v-if="!phoneNumber">
            La tua scheda paziente non è completa. <br />
            Inserisci o conferma i dati richiesti e premi "salva"
          </template>

          <template v-else>
            Completa la tua scheda paziente aggiungendo i contatti. <br />
            Puoi confermare i seguenti o indicarne altri a uso esclusivo della
            piattaforma Covid 19.
          </template>
        </q-banner>

        <q-card class="q-my-md">
          <q-card-section>
            <covid-contacts-form />
          </q-card-section>
        </q-card>
      </lms-page>
    </template>

    <!-- CITTADINO TROVATO IN PIATTAFORMA -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <template v-else>
      <slot />
    </template>
  </div>
</template>

<script>
import CovidContactsForm from "./CovidContactsForm";
import { appAssistanceForm } from "../services/urls";

export default {
  name: "CovidGuardCitizen",
  components: { CovidContactsForm },
  data() {
    return {};
  },
  computed: {
    user() {
      return this.$store.getters["getUser"];
    },
    isOtpLoginActive() {
      return this.$store.getters["isOtpLoginActive"];
    },
    citizen() {
      return this.$store.getters["getCitizen"];
    },
    citizenError() {
      return this.$store.getters["getCitizenError"];
    },
    mustConfirmContacts() {
      return this.$store.getters["mustConfirmContacts"];
    },
    mustShowCitizenErrorMessage() {
      return this.citizenError?.response?.status === 404;
    },
    citizenCovidPhoneNumber() {
      return this.$store.getters["covid/getCitizenPhoneNumber"];
    },
    citizenCovidPhoneNumberVerified() {
      return this.$store.getters["covid/getCitizenPhoneNumberVerified"];
    },
    userContactsPhoneNumber() {
      return this.user?.contacts?.phone;
    },
    phoneNumber() {
      return (
        this.citizenCovidPhoneNumberVerified ||
        this.citizenCovidPhoneNumber ||
        this.userContactsPhoneNumber ||
        null
      );
    },
    workingApp() {
      return this.$store.getters["getWorkingApp"];
    },
    assistanceUrl() {
      return appAssistanceForm(this.workingApp?.codice);
    },
  },
  created() {},
  methods: {},
};
</script>

<style lang="scss"></style>
