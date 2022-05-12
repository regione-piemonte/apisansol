<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-page>

    <template v-if="config.errorContacts">
      <q-alert type="warning" class="q-pa-md">
        Al momento non è possibile accedere al tuo profilo personale.
      </q-alert>
    </template>
    <template v-else>
      <!-- SE L'UTENTE NON HA FORNITO I CONTATTI LO INVITIAMO AD INSERIRLI -->

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
        <!-- CHI SEI -->

        <q-list no-border separator sparse link class="q-px-sm q-mt-md">

          <csi-contact-email-item
            :email="userContacts.email"
            @email-verified="onEmailVerified">
          </csi-contact-email-item>

          <csi-contact-mobile-phone-item
            :mobile-phone="userContacts.sms"
            @mobile-phone-verified="onMobilePhoneVerified">
          </csi-contact-mobile-phone-item>


          <q-item @click.native="$router.push($routes.GLOBAL.POLICY)">
            <q-item-side icon="description" color="secondary"></q-item-side>
            <q-item-main>
              <q-item-tile label>Termini e condizioni d'uso</q-item-tile>
            </q-item-main>
            <q-item-side right icon="keyboard_arrow_right" color="primary"></q-item-side>
          </q-item>

        </q-list>

        <csi-buttons class="q-pa-md">
          <csi-button secondary label="Elimina contatti" color="negative" @click="confirmDeleteContacts"/>
        </csi-buttons>

      </div>
    </template>
  </q-page>
</template>

<script>
    import CsiContactEmailItem from "components/global/user-profile/CsiContactEmailItem";
    import CsiContactMobilePhoneItem from "components/global/user-profile/CsiContactMobilePhoneItem";
    import {deleteUser, saveUserContacts} from "@services/api/preferences";
    import {deepClone} from "@services/global/utils";
    import {getResponseStatusCode} from "@services/api/utils";
    import {config} from "@plugins/config";

    export default {
        name: 'PageUserProfile',
        components: {CsiContactMobilePhoneItem, CsiContactEmailItem},
        data() {
            return {
                isEmailModalOpen: false,
                isSmsModalOpen: false,
                config: config
            }
        },
        computed: {
            user() {
                return this.$store.getters['global/user']
            },
            userContacts() {
                console.log(this.user)
                return this.user.contacts

            }
        },
        methods: {
            async saveUserContacts(data) {
                let response = await saveUserContacts(this.user.cf, data);
                this.$store.commit('global/setUserContacts', response.data);
            },
            async onEmailVerified(newEmail) {
                let data = deepClone(this.userContacts);
                data.email = newEmail;
                this.saveUserContacts(data);
            },
            async onMobilePhoneVerified(newMobilePhone) {
                let data = deepClone(this.userContacts);
                data.sms = newMobilePhone;
                data.phone = newMobilePhone;
                this.saveUserContacts(data);
            },
            async confirmDeleteContacts() {
                let config = {
                    title: 'Elimina contatti',
                    message: 'Eliminando tutti i tuoi contatti non potrai ricevere notifiche via e-mail e via sms',
                    color: 'negative',
                    ok: 'Elimina tutti i contatti',
                    cancel: 'Torna indietro'
                };

                await this.$q.dialog(config);
                try {
                    let deleteResponse = await deleteUser(this.user.cf);
                    this.$store.commit('global/deleteUserContacts')
                } catch (e) {
                    this.$q.notify({
                        message: `[${getResponseStatusCode(e)}] Non è stato possibile eliminare i contatti`,
                        type: 'negative',
                        position: 'top'
                    });
                }
            },
        }
    }
</script>

<style>
</style>
