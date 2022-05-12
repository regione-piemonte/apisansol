<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-page>

    <!--  <csi-page-title
        title="Preferenze di notifiche"
        @back="onBack"
        class="q-py-md">
      </csi-page-title> -->
    <template v-if="config.errorContacts">
      <q-alert type="warning" class="q-pa-md">
        Al momento non è possibile accedere al tuo profilo personale.
      </q-alert>
    </template>

    <template v-else>
      <div v-if="!userContacts" class="q-pa-md">
        <q-alert color="warning">
          Non hai ancora creato il tuo profilo personale.
          <br/>
          Componilo per avere un <strong>contatto unico con la PA piemontese</strong>
          e per ricevere <strong>notifiche</strong> dai servizi di <i>Salute Piemonte</i>
        </q-alert>

        <csi-buttons class="q-mt-md">
          <csi-button
            primary
            label="Componi il profilo personale"
            @click="$router.push($routes.GLOBAL.USER_CONTACTS_FLOW)"
          />
        </csi-buttons>
      </div>

      <div v-else>
        <csi-notification-preferences-list @update="onPreferencesUpdate"></csi-notification-preferences-list>

        <q-alert color="info" class="q-mt-lg">
          Il servizio consente di inserire i tuoi contatti e le preferenze per le notifiche,
          ed utilizza strumenti di tracciamento di terze parti per recapitarti i messaggi.
          <a :href="urlPrivacyPolicy" target="_blank" class="csi-link">Leggi l'informativa completa.</a>
        </q-alert>
        <csi-buttons class="q-ma-md">
          <csi-button
            primary
            label="Conferma"
            :disable="!services"
            :loading="isSavingPreferences"
            @click="savePreferences"
          />
        </csi-buttons>
      </div>
    </template>
  </q-page>
</template>

<script>
    import CsiNotificationPreferencesList from "components/global/user-profile/CsiNotificationPreferencesList";
    import {savePreferences} from "@services/api/preferences";
    import CsiPageTitle from "components/global/common/CsiPageTitle";
    import {mash} from "@services/global/utils";
    import {getResponseStatusCode} from "@services/api/utils";
    import {config} from "@plugins/config";
    import {urlPrivacyPolicy} from "../../../services/global/business-logic";


    export default {
        name: 'PageUserNotificationPreferences',
        components: {CsiPageTitle, CsiNotificationPreferencesList},
        data() {
            return {
                services: [],
                isSavingPreferences: false,
                hasSavingErrors: false,
                config: config,
            }
        },
        computed: {
            user() {
                return this.$store.getters['global/user']
            },
            userContacts() {
                console.log(this.user)
                return this.user.contacts

            },
          urlPrivacyPolicy(){
              return urlPrivacyPolicy()
          }
        },
        methods: {
            onBack() {
                this.$router.push(this.$routes.GLOBAL.USER_PROFILE);
            },
            onPreferencesUpdate(services) {
                this.services = services;
            },
            async savePreferences() {

                // Otteniamo una struttura dati del tipo
                // {
                //    nome_servizio_1: 'sms,push'
                //    nome_servizio_2: 'email',
                //    nome_servizio_2: '',
                // }
                let preferencesData = mash(this.services, s => [s.name, s.channels]);


                try {
                    this.isSavingPreferences = true;
                    let response = await savePreferences(this.user.cf, preferencesData);
                    this.$q.notify({
                        message: 'Preferenze salvate',
                        type: 'positive',
                        position: 'top',
                    });

                } catch (e) {
                    this.hasSavingErrors = true;
                    this.$q.notify({
                        message: `[${getResponseStatusCode(e)}] Errore durante il salvataggio delle preferenze`,
                        type: 'negative',
                        position: 'top',
                    });

                } finally {
                    this.isSavingPreferences = false;
                }
            }
        },
    }
</script>

<style>
</style>
