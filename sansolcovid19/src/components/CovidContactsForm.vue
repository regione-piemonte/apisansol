<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-form
    ref="form"
    greedy
    class="covid-contacts-form"
    @submit.prevent="onSave"
  >
    <template v-if="!noPhone">
      <!-- TELEFONO -->
      <!-- --------------------------------------------------------------------------------------------------------- -->
      <div class="row q-col-gutter-x-md">
        <div class="col-12 col-md-3">
          <q-select
            v-model="phonePrefix"
            :options="phonePrefixOptions"
            option-value="value"
            option-label="label"
            emit-value
            map-options
            label="Prefisso"
            required
            filter
            no-error-icon
            lazy-rules="ondemand"
            :rules="[(v) => $r.required(v) || 'Seleziona un prefisso']"
          />
        </div>

        <div class="col-12 col-md">
          <q-input
            v-model="phone"
            label="Telefono"
            type="tel"
            name="phone"
            autocomplete="tel"
            maxlength="15"
            required
            no-error-icon
            lazy-rules="ondemand"
            :rules="[
              (v) => $r.required(v) || 'Campo obbligatorio',
              (v) => $r.numeric(v) || 'Deve essere composto da soli numeri',
              (v) =>
                $r.maxLength(v, 15) || 'Non può essere più lungo di 15 numeri',
            ]"
          />
        </div>
      </div>

      <!-- TELEFONO CONFERMA -->
      <!-- ----------------------------------------------------------------------------------------------------------- -->
      <div class="row q-col-gutter-x-md">
        <div class="col-12 col-md-3">
          <q-select
            v-model="phonePrefixConfirm"
            :options="phonePrefixOptions"
            option-value="value"
            option-label="label"
            emit-value
            map-options
            label="Prefisso"
            filter
            required
            no-error-icon
            lazy-rules="ondemand"
            :rules="[
              (v) => $r.required(v) || 'Seleziona un prefisso',
              (v) => v === phonePrefix || 'I due prefissi devono coincidere',
            ]"
          />
        </div>

        <div class="col-12 col-md">
          <q-input
            v-model="phoneConfirm"
            label="Ripeti telefono"
            type="tel"
            name="phone-confirm"
            autocomplete="tel"
            maxlength="15"
            required
            no-error-icon
            lazy-rules="ondemand"
            :rules="[
              (v) => $r.required(v) || 'Campo obbligatorio',
              (v) => v === phone || 'I due numeri devono coincidere',
              (v) => $r.numeric(v) || 'Deve essere composto da soli numeri',
              (v) =>
                $r.maxLength(v, 15) || 'Non può essere più lungo di 15 numeri',
            ]"
          />
        </div>
      </div>
    </template>

    <template v-if="!noEmail">
      <!-- EMAIL -->
      <!-- ----------------------------------------------------------------------------------------------------------- -->
      <q-input
        v-model="email"
        label="Email"
        type="email"
        name="email"
        autocomplete="email"
        :required="!isSelectedPrefixItalian"
        no-error-icon
        lazy-rules="ondemand"
        :rules="[
          (v) => $r.required(v) || 'Campo obbligatorio',
          (v) => $r.email(v) || 'Inserisci un\'email valida',
        ]"
      />

      <!-- EMAIL CONFERMA -->
      <!-- ----------------------------------------------------------------------------------------------------------- -->
      <q-input
        v-model="emailConfirm"
        label="Ripeti email"
        type="email"
        name="email-confirm"
        autocomplete="email"
        :required="!isSelectedPrefixItalian"
        no-error-icon
        lazy-rules="ondemand"
        :rules="[
          (v) => $r.required(v) || 'Campo obbligatorio',
          (v) => $r.email(v) || 'Inserisci un\'email valida',
          (v) => v === email || 'Le due email devono coincidere',
        ]"
      />
    </template>

    <!-- INFOMRATIVA -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <div class="q-mt-xl">
      <q-toggle v-model="isPolicyAccepted">
        <div class="q-ml-sm">
          *Dichiaro di aver preso visione di quanto contenuto
          <a href="#" class="csi-link" @click.stop="showPolicy">
            nell'informativa sulla privacy
          </a>
        </div>
      </q-toggle>
    </div>

    <div class="q-mt-lg text-right">
      <lms-buttons>
        <lms-button type="submit" :loading="isSaving">Salva</lms-button>
      </lms-buttons>
    </div>

    <!-- MODAL -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <q-dialog
      v-model="isPolicyModalVisible"
      :maximized="$q.screen.lt.sm"
      content-css="width: 600px"
    >
      <q-card header-class="no-shadow">
        <q-toolbar slot="header" color="transparent" text-color="black">
          <q-toolbar-title>Informativa sulla privacy</q-toolbar-title>
          <q-btn flat round icon="close" v-close-overlay />
        </q-toolbar>

        <div class="q-pa-md">
          <lms-policy>
            <div>testo</div>
          </lms-policy>
        </div>
      </q-card>
    </q-dialog>
  </q-form>
</template>

<script>
import LmsPolicy from "./core/LmsPolicy";
import {
  getMobilePhonePrefixList,
  updateCitizenContacts,
} from "../services/api";
import { notifyError, notifySuccess } from "../services/utils";

export default {
  name: "CovidContactsForm",
  components: { LmsPolicy },
  props: {
    noPhone: { type: Boolean, required: false, default: false },
    noEmail: { type: Boolean, required: false, default: false },
  },
  data() {
    return {
      isSaving: false,
      isPolicyModalVisible: false,
      isPolicyAccepted: false,
      isLoadingPhonePrefixList: false,
      phonePrefixList: [],
      phonePrefix: "",
      phonePrefixConfirm: "",
      phone: "",
      phoneConfirm: "",
      email: "",
      emailConfirm: "",
    };
  },
  computed: {
    user() {
      return this.$store.getters["user"];
    },
    taxCode() {
      return this.$store.getters["getTaxCode"];
    },
    citizenCovid() {
      return this.$store.getters["getCitizen"];
    },
    citizenCovidEmail() {
      return this.$store.getters["getCitizenEmail"];
    },
    citizenCovidPhoneNumber() {
      return this.$store.getters["getCitizenPhoneNumber"];
    },
    citizenCovidPhoneNumberVerified() {
      return this.$store.getters["getCitizenPhoneNumberVerified"];
    },
    citizenCovidPhoneNumberVerifiedPrefix() {
      return this.$store.getters["getCitizenPhoneNumberPrefixVerified"];
    },
    userContactsEmail() {
      return this.user?.contacts?.email;
    },
    userContactsPhoneNumber() {
      return this.user?.contacts?.phone;
    },
    phonePrefixListSorted() {
      let result = [...this.phonePrefixList];

      result.sort((a, b) => {
        if (this.isPrefixItalian(a)) return -1;
        return 1;
      });

      return result;
    },
    phonePrefixOptions() {
      return this.phonePrefixListSorted.map((el) => {
        return {
          label: `(${el.prefix}) ${el.countryName}`,
          value: el.countryCode,
          _model: el,
        };
      });
    },
    prefixSelectedModel() {
      return this.phonePrefixList.find(
        (el) => el.countryCode === this.phonePrefix
      );
    },
    isSelectedPrefixItalian() {
      return (
        this.prefixSelectedModel &&
        this.isPrefixItalian(this.prefixSelectedModel)
      );
    },
  },
  created() {
    let phoneNumber =
      this.citizenCovidPhoneNumberVerified ||
      this.citizenCovidPhoneNumber ||
      this.userContactsPhoneNumber ||
      "";
    let email = this.citizenCovidEmail || this.userContactsEmail || "";

    this.phone = phoneNumber;
    this.email = email;

    this.phoneConfirm = phoneNumber;
    this.emailConfirm = email;

    let prefix = this.citizenCovidPhoneNumberVerifiedPrefix;
    // Se il numero di telefono preselezionato è quello validato della piattaforma COVID
    // ed abbiamo anche il prefisso => lo preimpostiamo
    if (prefix && phoneNumber && phoneNumber === this.citizenCovidPhoneNumber) {
      this.phonePrefix = prefix.countryCode;
      this.phonePrefixConfirm = prefix.countryCode;

      // Inoltre dobbiamo rimuovere il prefisso dal numero di telefono
      this.phone = this.phone.replace(prefix.prefix, "");
      this.phoneConfirm = this.phoneConfirm.replace(prefix.prefix, "");
    }

    this.loadPhonePrefixList();
  },
  methods: {
    async loadPhonePrefixList() {
      this.isLoadingPhonePrefixList = true;

      try {
        let { data } = await getMobilePhonePrefixList();
        this.phonePrefixList = data;
      } catch (error) {
        notifyError(
          error,
          "Non è stato possibile caricare l'elenco dei prefissi."
        );
      }

      this.isLoadingPhonePrefixList = false;
    },
    isPrefixItalian(prefix) {
      return prefix.prefix === "+39";
      // return prefix.countryCode === 'IT'
    },
    showPolicy() {
      this.isPolicyModalVisible = true;
    },
    async onSave() {
      let isValid = await this.$refs.form.validate();
      if (!isValid) return;

      if (!this.isPolicyAccepted) {
        this.$q.notify({
          color: "negative",
          message: "Non hai dichiarato di aver preso visione dell'informativa",
        });
        return;
      }

      // this.$emit('save', {phone: this.phone, email: this.email})

      let taxCode = this.taxCode;
      let id = this.citizenCovid?.idSoggetto;
      let payload = {
        telefonoRecapito: this.phone,
        email: this.email,
        contattoValidato: true,
      };

      if (!this.noPhone) {
        let prefix = this.prefixSelectedModel;
        payload.telefonoRecapito = prefix.prefix + this.phone;
      }

      this.isSaving = true;

      try {
        let { data } = await updateCitizenContacts(taxCode, id, payload);
        await this.$store.dispatch("setCitizen", { citizen: data });
        this.$emit("saved");
        notifySuccess("Contatti aggiornati");
      } catch (err) {
        let message = "Non è stato possibile salvare i contatti.";

        let status = err.response && err.response.status;
        if (status && status < 500) {
          message = err.response.data.title;
        }

        notifyError(err, message);
      }

      this.isSaving = false;
    },
  },
};
</script>

<style scoped lang="scss"></style>
