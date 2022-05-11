<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <lms-page padding>

    <template v-if="errorContacts">
      <q-banner  class="q-banner--warning q-mb-md">
        <div class="text-body1">
          Al momento non è possibile accedere al tuo profilo personale.
        </div>
      </q-banner>
    </template>

    <template v-else>
      <!-- UTENTE SENZA CONTATTI -->
      <!-- --------------------------------------------------------------------------------------------------------- -->
      <div v-if="!userContacts" >
        <q-banner class="q-banner--warning q-mb-md" >
          <div class="text-body1">
            Non hai ancora creato il tuo profilo personale.
            <br />
            Componilo per avere un
            <strong>contatto unico con la PA piemontese</strong> e per ricevere
            <strong>notifiche</strong> dai servizi di <i>Salute Piemonte</i>
          </div>
        </q-banner>

        <lms-buttons >
          <lms-button
            primary
            label="Componi il profilo personale"
           :to="PROFILE_CONTACTS_CREATE"
          />
        </lms-buttons>
      </div>

      <!-- UTENTE CON CONTATTI -->
      <!-- --------------------------------------------------------------------------------------------------------- -->
      <template v-else>
        <account-notification-preference-list
          class="q-px-md"
          @loading="manageLoading"

          @update="onPreferencesUpdate"
          @add-phone-number="onAddPhoneNumber"
        >
          <template v-slot:loading>
            <account-notification-preferences-skeleton />
          </template>
        </account-notification-preference-list>

        <div class=" q-pt-lg q-px-md">
          <q-banner class="q-banner--info" >
            <div class="text-body1">
              Il servizio consente di inserire i tuoi contatti e le preferenze per le notifiche,
              ed utilizza strumenti di tracciamento di terze parti per recapitarti i messaggi.
              <a :href="urls.privacyPolicy()" target="_blank" class="lms-link">Leggi l'informativa completa.</a>
            </div>
          </q-banner>
        </div>




        <lms-buttons v-if="!isLoading" class="q-ma-md">
          <lms-button
            label="Conferma"
            :disable="!services"
            :loading="isSavingPreferences"
            @click="savePreferences"
          />
        </lms-buttons>
      </template>
    </template>


    <!-- LOADING -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
<!--    //<lms-inner-loading :showing="isLoading" />-->
  </lms-page>
</template>

<script>
import AccountNotificationPreferenceList from "src/components/AccountNotificationPreferenceList";
import { updateNotifyPreferences } from "src/services/api";
import { PROFILE_CONTACTS, PROFILE_CONTACTS_CREATE } from "../router/routes";
import { apiErrorNotify } from "../services/utils";
import AccountNotificationPreferencesSkeleton from "components/AccountNotificationPreferencesSkeleton";
import * as urls from "src/services/urls";
export default {
  name: "PageProfilePreferences",
  components: {AccountNotificationPreferencesSkeleton, AccountNotificationPreferenceList },
  props: {},
  data() {
    return {
      urls,
      PROFILE_CONTACTS_CREATE,
      services: [],
      isLoading: false,
      isSavingPreferences: false,
      hasSavingErrors: false
    };
  },
  computed: {
    user() {
      return this.$store.getters["getUser"];
    },
    userContacts() {
      return this.$store.getters["getNotifyContacts"];
    },
    errorContacts(){
      return this.$store.getters["getErrorContacts"];
    }
  },
  created() {},
  methods: {
    manageLoading(value) {
      this.isLoading = value;
    },

    onPreferencesUpdate(services) {
      this.services = services;
    },
    onAddPhoneNumber() {
      this.$router.push(PROFILE_CONTACTS);
    },
    async savePreferences() {
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

      this.isSavingPreferences = true;

      try {
        await updateNotifyPreferences(this.user.cf, preferencesData);

        this.$q.notify({
          message: "Preferenze salvate",
          color: "positive",
          textColor: "black",
          classes: "text-center",
          position: "bottom"
        });
      } catch (error) {
        this.hasSavingErrors = true;
        let message = "Errore durante il salvataggio delle preferenze";
        apiErrorNotify({ error, message });
      }

      this.isSavingPreferences = false;
    },
    onCreateNotifyUser() {
      this.$router.push(PROFILE_CONTACTS_CREATE);
    }
  }
};
</script>

<style scoped lang="sass"></style>
