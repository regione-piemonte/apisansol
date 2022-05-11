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
      <!-- ----------------------------------------------------------------------------------------------------------- -->
      <template v-if="!notifyContacts">
        <q-banner  class="q-banner--warning q-mb-md">
          <div class="text-body1">
            Non hai ancora creato il tuo profilo personale.
            <br />
            Componilo per avere un
            <strong>contatto unico con la PA piemontese</strong> e per ricevere
            <strong>notifiche</strong> dai servizi di <i>Salute Piemonte</i>
          </div>
        </q-banner>

        <lms-buttons>
          <lms-button
            label="Componi il profilo personale"
           :to="PROFILE_CONTACTS_CREATE"
          />
        </lms-buttons>
      </template>

      <!-- UTENTE CON CONTATTI -->
      <!-- ----------------------------------------------------------------------------------------------------------- -->
      <template v-else>
        <q-card>
          <q-card-section class="q-pb-none">
            <q-list separator>
              <account-email-item
                :email="notifyContacts.email"
                required
                @email-verified="onEmailVerified"
              />

              <account-mobile-phone-item
                :mobile-phone="notifyContacts.sms"
                @mobile-phone-verified="onMobilePhoneVerified"
              />

              <q-item clickable :to="PROFILE_CONTACTS_POLICY" class="q-item-profile">
                <q-item-section side>
                  <q-icon name="description" color="secondary" size="md" />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-subtitle1">Termini e condizioni d'uso</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-icon name="keyboard_arrow_right" color="primary" />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>

          <q-card-actions align="right" class="q-pa-md">
            <lms-buttons>
              <lms-button
                outline
                label="Elimina contatti"
                color="negative"
                @click="confirmDeleteContacts"
              />
            </lms-buttons>
          </q-card-actions>
        </q-card>

        <!-- DIALOGS -->
        <!-- ----------------------------------------------------------------------------------------------------------- -->
        <q-dialog v-model="isContactsRemoveDialogVisible">
          <q-card>
            <q-card-section class="text-body1">
              Eliminando tutti i tuoi contatti non potrai ricevere notifiche via
              e-mail e via SMS.
            </q-card-section>

            <q-card-section>
              <lms-buttons>
                <lms-button
                  unelevated
                  color="negative"
                  label="Elimina tutti i contatti"
                  :loading="isRemovingContacts"
                  @click="deleteContacts"
                />
                <lms-button v-close-popup outline label="Torna indietro" />
              </lms-buttons>
            </q-card-section>
          </q-card>
        </q-dialog>
      </template>
    </template>





  </lms-page>
</template>

<script>
import {
  PROFILE_CONTACTS_CREATE,
  PROFILE_CONTACTS_POLICY
} from "src/router/routes";
import { deleteNotifyUser, updateNotifyContacts } from "src/services/api";
import { extend } from "quasar";
import { apiErrorNotify } from "../services/utils";
import AccountEmailItem from "../components/AccountEmailItem";
import AccountMobilePhoneItem from "../components/AccountMobilePhoneItem";

export default {
  name: "PageProfileContacts",
  components: {
    AccountMobilePhoneItem,
    AccountEmailItem
  },
  props: {},
  data() {
    return {
      PROFILE_CONTACTS_CREATE,
      PROFILE_CONTACTS_POLICY,
      isEmailModalOpen: false,
      isSmsModalOpen: false,
      isContactsRemoveDialogVisible: false,
      isRemovingContacts: false
    };
  },
  computed: {
    user() {
      return this.$store.getters["getUser"];
    },
    userInfo() {
      return this.$store.getters["getUserInfo"];
    },
    notifyContacts() {
      return this.$store.getters["getNotifyContacts"];
    },
    errorContacts(){
      return this.$store.getters["getErrorContacts"];
    }
  },
  created() {},
  methods: {
    async updateNotifyContacts(data) {
      let { data: contacts } = await updateNotifyContacts(this.user.cf, data);
      this.$store.dispatch("setNotifyContacts", { contacts });
    },
    async onEmailVerified(newEmail) {
      let data = extend(true, {}, this.notifyContacts);
      data.email = newEmail;
      await this.updateNotifyContacts(data);
    },
    async onMobilePhoneVerified(newMobilePhone) {
      let data = extend(true, {}, this.notifyContacts);
      data.sms = newMobilePhone;
      data.phone = newMobilePhone;
      this.updateNotifyContacts(data);
    },
    confirmDeleteContacts() {
      this.isContactsRemoveDialogVisible = true;
    },
    async deleteContacts() {
      this.isRemovingContacts = true;

      try {
        await deleteNotifyUser(this.user.cf);
        this.$store.dispatch("setNotifyContacts", { contacts: null });
      } catch (error) {
        let message = "Non è stato possibile eliminare i contatti";
        apiErrorNotify({ error, message });
      }

      this.isRemovingContacts = false;
    },
    onCreateNotifyUser() {
      this.$router.push(PROFILE_CONTACTS_CREATE);
    }
  }
};
</script>

<style lang="sass"></style>
