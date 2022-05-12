<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<style lang="stylus">
  .stepper-no-padding .q-stepper-step-inner
    padding 0

  .step-no-padding .q-stepper-step-inner
    padding 0

  .stepper-no-shadow,
  .stepper-no-shadow .q-stepper-header
    box-shadow none
</style>


<template>
  <q-page>

    <csi-page-title
      title="Profilo personale"
      @back="onBack"
      class="q-pa-md">
    </csi-page-title>


    <csi-stepper
      ref="contactsFlowStepper"
      contractable
      alternative-labels
      class="stepper-no-shadow">

      <!-- STEP 1 - Informativa -->
      <!-- --------------------------------------------------------------------------------------------------------- -->
      <q-step default title="Informativa">

        <p class="q-title">Termini e condizioni d'uso</p>

        <csi-policy :src="termsAndConditionsUrl" />

        <div class="q-mt-lg">
          <q-field>
            <q-toggle
              v-model="areTermsAndConditionsAccepted"
              label="Dichiaro di aver letto l'informativa e di accettare le condizioni d'uso">
            </q-toggle>
          </q-field>
        </div>

        <csi-buttons class="q-mt-md">
          <csi-button primary label="Avanti" @click="checkStep1()" />
        </csi-buttons>
      </q-step>

      <!-- STEP 2 - Contatti -->
      <!-- --------------------------------------------------------------------------------------------------------- -->
      <q-step title="Contatti">

        <p class="q-title">Contatti</p>

        <q-alert color="info">
          <div class="q-body-1">
            <p>Per ricevere notifiche via email o SMS devi inserire almeno un contatto.</p>
            <p>
              L'indirizzo email ed il numero di telefono saranno salvati nel tuo profilo personale e saranno
              validi come
              <strong>
                contatto unico per i servizi online delle PA piemontesi che prevedono
                l'invio di notifiche
              </strong>
            </p>
            <p>
              Se non inserisci i tuoi contatti puoi comunque scegliere di
              <strong>ricevere le notifiche push.</strong>
            </p>
          </div>
        </q-alert>


        <q-list no-border separator sparse link class="q-mt-md">
          <csi-contact-email-item
            :email="email"
            required
            @email-verified="onEmailVerified">
          </csi-contact-email-item>

          <csi-contact-mobile-phone-item
            :mobile-phone="mobilePhone"
            @mobile-phone-verified="onMobilePhoneVerified">
          </csi-contact-mobile-phone-item>
        </q-list>

        <csi-buttons class="q-mt-md">
          <csi-button primary label="Avanti" @click="checkStep2()" />
          <csi-button secondary label="Indietro" @click="$refs.contactsFlowStepper.previous()" />
        </csi-buttons>
      </q-step>

      <!-- STEP 3 - Notifiche -->
      <!-- --------------------------------------------------------------------------------------------------------- -->
      <q-step title="Notifiche" class="step-no-padding">
        <p class="q-title q-px-md">Preferenze di notifiche</p>
        <csi-notification-preferences-list @update="onPreferencesUpdate" :numberOfPhone="mobilePhone" />

        <csi-buttons class="q-mt-md">
          <csi-button primary label="Fine" :loading="isSavingContacts" @click="saveContacts" />
          <csi-button secondary label="Indietro" @click="$refs.contactsFlowStepper.previous()" />
        </csi-buttons>
      </q-step>
    </csi-stepper>

  </q-page>
</template>

<script>
  import CsiNotificationPreferencesList from "components/global/user-profile/CsiNotificationPreferencesList";
  import CsiPolicy from "components/global/common/CsiPolicy";
  import {savePreferences, saveUserContacts, getTerms, setTerms} from "@services/api/preferences";
  import CsiContactEmailItem from "components/global/user-profile/CsiContactEmailItem";
  import CsiContactMobilePhoneItem from "components/global/user-profile/CsiContactMobilePhoneItem";
  import {defaultTo, isNil, mash} from "@services/global/utils";
  import CsiPageTitle from "components/global/common/CsiPageTitle";
  import {config} from "@plugins/config";
  import md5 from "blueimp-md5";

  export default {
    name: 'PageUserContactsFlow',
    components: {
      CsiPageTitle,
      CsiContactMobilePhoneItem,
      CsiContactEmailItem,
      CsiPolicy,
      CsiNotificationPreferencesList,
    },
    data() {
      return {
        areTermsAndConditionsAccepted: false,
        email: undefined,
        mobilePhone: undefined,
        isEmailModalOpen: false,
        isSmsModalOpen: false,
        services: [],
        isSavingContacts: false,
      };
    },
    computed: {
      termsAndConditionsUrl() {
        return config.global.envs.API_BASE_URL + config.global.basePaths.preferences + '/terms'
      },
      user() {
        return this.$store.getters['global/user']
      },
      userContacts() {
        return this.user.contacts
      },
      assistanceService(){
        let {assistenza} = this.$route.query;
        return assistenza
      }
    },
    created() {
      this.$root.$on('back', () => {
          this.$refs.contactsFlowStepper.previous()
        }
      )
    },
    methods: {
      setUserContacts(contacts) {
        this.$store.commit('global/setUserContacts', contacts)
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
      async checkStep1() {

        if (!this.areTermsAndConditionsAccepted) {
          this.$q.notify({
            type: 'negative',
            message: `Non puoi andare avanti senza accettare l'informativa`
          });
          return
        }

        this.$refs.contactsFlowStepper.next()
      },
      checkStep2() {
        if (!this.email) {
          this.$q.notify({
            type: 'negative',
            message: `Inserisci l'email per proseguire`
          });
          return
        }
        this.$refs.contactsFlowStepper.next()
      },
      async saveContacts() {
        let data = defaultTo(this.userContacts, {});
        if (!isNil(this.email)) data.email = this.email;
        if (!isNil(this.mobilePhone)) {
          data.phone = this.mobilePhone;
          data.sms = this.mobilePhone;
        }

        // Otteniamo una struttura dati del tipo
        // {
        //    nome_servizio_1: 'sms,push'
        //    nome_servizio_2: 'email',
        //    nome_servizio_2: '',
        // }
        let preferencesData = mash(this.services, s => [s.name, s.channels]);
        this.isSavingContacts = true;

        let terms = await getTerms()
        let setTermsPromise

        // Avviamo tutte le richieste in parallelo
        if (!isNil(terms.data)) {
          let hash = md5(terms.data)
          // Registro approvazione dei termini
          // setTermsPromise = setTerms(this.user.cf, {hash})
          await setTerms(this.user.cf, {hash})
        }

        let preferencesPromise = savePreferences(this.user.cf, preferencesData)
        let contactsPromise = saveUserContacts(this.user.cf, data)

        // Aspettiamo la risoluzione di tutte le richieste
        // @NOTE: inserire qui un try-catch per gestire eventuali errori HTTP
        // if (setTermsPromise) await setTermsPromise
        let preferencesResponse = await preferencesPromise
        let saveContactsResponse = await contactsPromise

        // @todo: la risposta è malformata. Infatti ottengo `push: "{}"` anzichè `push: {}`
        let newUserContacts = saveContactsResponse.data;
        this.setUserContacts(newUserContacts);

        this.isSavingContacts = false;

        let route= {
          name:this.$routes.GLOBAL.USER_CONTACTS_FLOW_SUCCESS.name,
          params: {assistanceService:this.assistanceService}
        }
        this.$router.push(route);
      }
    },
  }
</script>
