<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <lms-page padding>
    <lms-page-title @back="onBack">Profilo personale</lms-page-title>

    <lms-stepper
      v-model="step"
      :contracted="$q.screen.lt.md"
      alternative-labels
      animated
      flat
      class="bg-transparent q-mt-md"
    >
      <!-- STEP 1 - Informativa -->
      <!-- --------------------------------------------------------------------------------------------------------- -->
      <q-step :name="STEP_MAP.INFORMATIVE" title="Informativa">
        <p class="text-h6">Termini e condizioni d'uso</p>

        <lms-policy :src="termsAndConditionsUrl" />

        <div class="q-mt-lg">
          <q-toggle
            v-model="areTermsAndConditionsAccepted"
            label="Dichiaro di aver letto l'informativa e di accettare le condizioni d'uso"
          />
        </div>

        <lms-buttons class="q-mt-md">
          <lms-button label="Avanti" @click="onStep1Next" />
        </lms-buttons>
      </q-step>

      <!-- STEP 2 - Contatti -->
      <!-- --------------------------------------------------------------------------------------------------------- -->
      <q-step :name="STEP_MAP.CONTACTS" title="Contatti">
        <q-banner class=" q-banner--info">
          <div class="text-body1">
            <p>
              Per ricevere notifiche via email o SMS devi inserire almeno un
              contatto.
            </p>
            <p>
              L'indirizzo email ed il numero di telefono saranno salvati nel tuo
              profilo personale e saranno validi come
              <strong>
                contatto unico per i servizi online delle PA piemontesi che
                prevedono l'invio di notifiche
              </strong>
            </p>
            <p class="q-mb-none">
              Se non inserisci i tuoi contatti puoi comunque scegliere di
              <strong>ricevere le notifiche push.</strong>
            </p>
          </div>
        </q-banner>
        <q-card flat class="q-mt-xl">
          <q-card-section>
            <q-list no-border separator >
              <account-email-item
                :email="email"
                required
                @email-verified="onEmailVerified"
              />

              <account-mobile-phone-item
                :mobile-phone="mobilePhone"
                @mobile-phone-verified="onMobilePhoneVerified"
              />
            </q-list>
          </q-card-section>
        </q-card>


        <lms-buttons class="q-mt-md">
          <lms-button label="Avanti" @click="onStep2Next" />
          <lms-button outline label="Indietro" @click="onStep2Back" />
        </lms-buttons>
      </q-step>

      <!-- STEP 3 - Notifiche -->
      <!-- --------------------------------------------------------------------------------------------------------- -->
      <q-step
        :name="STEP_MAP.PREFERENCES"
        title="Notifiche"
        class="step-no-padding"
      >
        <p class="text-h6">Preferenze di notifiche</p>

        <account-notification-preference-list
          :numberOfPhone="mobilePhone"
          flat
          @update="onPreferencesUpdate"
          @add-phone-number="onStep3Back"
        >
          <template v-slot:loading>
            <lms-inner-loading :showing="true" block />
          </template>
        </account-notification-preference-list>

        <lms-buttons class="q-mt-md">
          <lms-button
            label="Fine"
            :loading="isSavingContacts"
            @click="onStep3Next"
          />
          <lms-button outline label="Indietro" @click="onStep3Back" />
        </lms-buttons>
      </q-step>
    </lms-stepper>
  </lms-page>
</template>

<script>
import AccountNotificationPreferenceList from "src/components/AccountNotificationPreferenceList";
import { httpAuth } from "src/boot/http";
import md5 from "blueimp-md5";
import {
  getNotifyTerms,
  updateNotifyContacts,
  updateNotifyPreferences,
  updateNotifyTerms
} from "src/services/api";
import { PROFILE_CONTACTS_CREATE_SUCCESS } from "../router/routes";
import AccountEmailItem from "../components/AccountEmailItem";
import AccountMobilePhoneItem from "../components/AccountMobilePhoneItem";
import LmsPolicy from "../components/core/LmsPolicy";
import LmsStepper from "../components/core/LmsStepper";

const STEP_MAP = {
  INFORMATIVE: 1,
  CONTACTS: 2,
  PREFERENCES: 3
};

export default {
  name: "PageProfileContactsCreate",
  components: {
    LmsStepper,
    LmsPolicy,
    AccountMobilePhoneItem,
    AccountEmailItem,
    AccountNotificationPreferenceList
  },
  data() {
    return {
      STEP_MAP,
      step: STEP_MAP.INFORMATIVE,
      areTermsAndConditionsAccepted: false,
      email: undefined,
      mobilePhone: undefined,
      isEmailModalOpen: false,
      isSmsModalOpen: false,
      services: [],
      isSavingContacts: false
    };
  },
  computed: {
    termsAndConditionsUrl() {
      let baseUrl = httpAuth.defaults.baseURL;
      return `${baseUrl}/notify-preferences/api/v1/terms`;
    },
    user() {
      return this.$store.getters["getUser"];
    },
    userContacts() {
      return this.user.contacts;
    }
  },
  created() {},
  methods: {
    setUserContacts(contacts) {
      this.$store.dispatch("setNotifyContacts", { contacts });
    },
    onBack() {
      this.$router.back();
    },
    onEmailVerified(newEmail) {
      this.email = newEmail;
    },
    onMobilePhoneVerified(newMobilePhone) {
      this.mobilePhone = newMobilePhone;
    },
    onPreferencesUpdate(services) {
      this.services = services;
    },
    onStep1Next() {
      if (!this.areTermsAndConditionsAccepted) {
        let color = "negative";
        let message = `Non puoi andare avanti senza accettare l'informativa`;
        this.$q.notify({ color, message });
        return;
      }

      this.step += 1;
    },
    onStep2Back() {
      this.step -= 1;
    },
    onStep2Next() {
      if (!this.email) {
        let color = "negative";
        let message = `Inserisci l'email per proseguire`;
        this.$q.notify({ color, message });
        return;
      }

      this.step += 1;
    },
    onStep3Back() {
      this.step -= 1;
    },
    async onStep3Next() {
      let data = this.userContacts || {};
      if (this.email) data.email = this.email;
      if (this.mobilePhone) {
        data.phone = this.mobilePhone;
        data.sms = this.mobilePhone;
      }

      // Otteniamo una struttura dati del tipo
      // {
      //    nome_servizio_1: 'sms,push'
      //    nome_servizio_2: 'email',
      //    nome_servizio_2: '',
      // }
      let preferencesData = this.services.reduce((out, s) => {
        out[s.name] = s.channels;
        return out;
      }, {});

      this.isSavingContacts = true;
      let terms = await getNotifyTerms();
      let setTermsPromise;

      // Avviamo tutte le richieste in parallelo
      if (terms.data) {
        let hash = md5(terms.data);
        // Registro approvazione dei termini
        setTermsPromise = updateNotifyTerms(this.user.cf, { hash });
      }

      let preferencesPromise = updateNotifyPreferences(
        this.user.cf,
        preferencesData
      );
      let contactsPromise = updateNotifyContacts(this.user.cf, data);

      // Aspettiamo la risoluzione di tutte le richieste
      // @NOTE: inserire qui un try-catch per gestire eventuali errori HTTP
      if (setTermsPromise) await setTermsPromise;
      let preferencesResponse = await preferencesPromise;
      let saveContactsResponse = await contactsPromise;

      // @todo: la risposta è malformata. Infatti ottengo `push: "{}"` anzichè `push: {}`
      let newUserContacts = saveContactsResponse.data;
      this.setUserContacts(newUserContacts);

      this.isSavingContacts = false;
      this.$router.push(PROFILE_CONTACTS_CREATE_SUCCESS);
    }
  }
};
</script>

<style scoped></style>
