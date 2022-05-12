<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-card :class="{ minWidthContactsCard: $q.screen.gt.sm }">
    <q-toolbar class="bg-primary text-white">
      <q-toolbar-title>Nuovo {{ type }}</q-toolbar-title>
      <q-btn flat round dense icon="close" v-close-popup />
    </q-toolbar>

    <q-card-section v-if="isEmail" class="q-mt-md">
      <div class="row items-center q-col-gutter-lg">
        <div class="col-12 ">
          <q-input
            v-model="email"
            type="email"
            clearable
            label="Inserisci la tua email"
            bottom-slots
            no-error-icon
            :error="$v.email.$error"
            error-message="Inserisci un'email valida"
          />
        </div>
        <div class="col-12">
          <q-input
            v-model="verifyEmail"
            type="email"
            clearable
            label="Ripeti email"
            bottom-slots
            no-error-icon
            :error="$v.verifyEmail.$error"
            error-message="Deve essere uguale all'email"
          />
        </div>
      </div>
    </q-card-section>

    <q-card-section v-if="isLandingPhone" class="q-mt-md">
      <div class="row items-center q-col-gutter-lg">
        <div class="col-12">
          <q-input
            v-model="landingPhone"
            type="tel"
            clearable
            label="Inserisci tuo n. di telefono"
            bottom-slots
            no-error-icon
            prefix="+39"
            :error="$v.landingPhone.$error"
          >
            <template v-slot:error>
              <div v-if="!$v.landingPhone.required">
                Inserisce un numero di telefono valido
              </div>
              <div v-if="!$v.landingPhone.integer">
                Non sono ammesse lettere
              </div>
            </template>
          </q-input>
        </div>
      </div>
    </q-card-section>

    <q-card-section v-if="isMobilePhone" class="q-mt-md">
      <div class="row items-center q-col-gutter-lg">
        <div class="col-12">
          <q-input
            v-model="mobilePhone"
            type="tel"
            clearable
            label="Inserisci tuo n. di cellulare"
            bottom-slots
            no-error-icon
            prefix="+39"
            :error="$v.mobilePhone.$error"
          >
            <template v-slot:error>
              <div v-if="!$v.landingPhone.required">
                Inserisce un numero di telefono valido
              </div>
              <div v-if="!$v.landingPhone.integer">
                Non sono ammesse lettere
              </div>
            </template>
          </q-input>
        </div>
      </div>
    </q-card-section>

    <q-card-section v-show="isChangedSuccess">
      <q-banner  class="h-banner--info h-banner">
        Operazione eseguita con successo.
      </q-banner>
    </q-card-section>

    <q-card-actions align="right" class="q-pa-md q-mb-md">
      <lms-button
        v-if="!isChangedSuccess"
        :loading="isLoading"
        :block="$q.screen.lt.md"
        @click="saveNewContact()"
        >Salva</lms-button
      >
      <lms-button
        v-else
        :block="$q.screen.lt.md"
        v-close-popup
        @click="closeDialog()"
        >OK</lms-button
      >
    </q-card-actions>
  </q-card>
</template>

<script>
import { required, email, integer } from "vuelidate/lib/validators";

import { setNewUserContacts } from "src/services/api";
import { apiErrorNotify } from "src/services/utils";
import {CONTACTS_TYPES} from "src/services/config";

export default {
  name: "CsiChangeContactsDialog",
  props: {
    type: { type: String, required:true,  default: '' },
    currentEmail: { type: String, default: null },
    currentLandingPhone: { type: String,  default: null },
    currentMobilePhone: { type: String, default: null }
  },
  computed: {
    cf() {
      return this.$store.getters["getTaxCode"];
    },
    userCodes() {
      return this.$store.getters["preventionScreening/getUserCodes"];
    }
  },
  validations() {
    return {
      email: {
        required: v => !!v || !this.isEmail,
        email
      },
      verifyEmail: {
        sameEmail: v => v === this.email || !this.isEmail
      },
      landingPhone: {
        required: v => !!v || !this.isLandingPhone,
        integer
      },
      mobilePhone: {
        required: v => !!v || !this.isMobilePhone,
        integer
      }
    };
  },
  data() {
    return {
      isEmail: false,
      isLandingPhone: false,
      isMobilePhone: false,
      isLoading: false,
      email: this.currentEmail,
      verifyEmail: null,
      landingPhone: this.currentLandingPhone,
      mobilePhone: this.currentMobilePhone,
      verifyError: false,
      CONTACTS_TYPES,
      newContacts: {},
      isChangedSuccess: false
    };
  },
  created() {
    if (this.type === this.CONTACTS_TYPES.EMAIL) this.isEmail = true;
    if (this.type === this.CONTACTS_TYPES.LANDLINE_PHONE)
      this.isLandingPhone = true;
    if (this.type === this.CONTACTS_TYPES.MOBILE_PHONE) this.isMobilePhone = true;
  },

  methods: {
    async saveNewContact(contact) {
      this.$v.$touch();
      if (this.$v.$error) {
        return;
      }

      let params = {
        codice_interno: this.userCodes.codice_interno,
        codice_interno_prefisso: this.userCodes.codice_interno_prefisso
      };
      this.newContacts = {
        email: this.email,
        telefono_1: this.landingPhone,
        telefono_2: this.mobilePhone
      };
      this.isLoading = true;
      try {
        let contactsResponse = await setNewUserContacts(
          this.cf,
          this.newContacts,
          { params: params }
        );
        this.isLoading = false;
        this.isChangedSuccess = true;
      } catch (e) {
        this.isLoading = false;
        apiErrorNotify({
          error: e,
          message: "Non è stato possibile salvare i nuovi contatti."
        });
      }
    },

    closeDialog() {
      this.$emit("update-contacts", {
        newContact: this.newContacts,
        type: this.type
      });
    }
  }
};
</script>

<style lang="sass">
.minWidthContactsCard
  min-width: 700px

</style>
