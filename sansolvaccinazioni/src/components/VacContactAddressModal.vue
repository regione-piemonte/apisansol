<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-card footer-class="shadow-0" style="width: 800px; max-width: 800px;">
    <q-card-section class="no-padding">
      <q-toolbar>
        <q-toolbar-title>
          Inserisci indirizzo
        </q-toolbar-title>

        <q-btn v-close-popup flat round dense icon="close" />
      </q-toolbar>
    </q-card-section>

    <q-card-section class="no-padding">
      <lms-stepper
        v-model="step"
        ref="contactAddressStepper"
        vertical
        class="shadow-0"
      >
        <!-- STEP 1 - Inserimento indirizzo -->
        <q-step
          default
          title="Indirizzo"
          :name="STEP_MAP.ADDRESS"
          :done="step > STEP_MAP.ADDRESS"
          done-color="green-8"
        >
          <q-form ref="form" greedy @submit.prevent="">
            <q-select
              v-model="citySelected"
              :options="citiesOptions"
              required
              @input="onCitySelected"
              label="Comune "
              use-input
              @filter="onCitySearch"
              :rules="[ruleRequired]"
            >
            </q-select>

            <q-input
              v-model="address"
              required
              label=" Indirizzo"
              :rules="[ruleRequired]"
            >
            </q-input>

            <q-input
              type="date"
              v-model="startDate"
              required
              label=" Data inizio validità domicilio"
              stack-label
              :rules="[ruleRequired, ruleAfterToday]"
            >
            </q-input>

            <q-input
              type="date"
              v-model="endDate"
              required
              label=" Data fine validità domicilio"
              stack-label
              :rules="[ruleRequired, ruleAfterStartDate]"
            >
            </q-input>
          </q-form>

          <lms-buttons class="q-mt-md">
            <lms-button
              :loading="isSaving"
              primary
              label="Avanti"
              @click="confirm"
            />
          </lms-buttons>
        </q-step>

        <!-- STEP 2 - Feedback -->
        <q-step
          title="Fine"
          :name="STEP_MAP.CONFIRM"
          :done="step > STEP_MAP.CONFIRM"
          done-color="green-8"
        >
          <q-banner rounded class="bg-positive q-mt-md q-pa-md">
            <div class="text-h3 text-weight-bold">
              Verifica completata!
            </div>
            <div class="q-mt-sm text-weight-medium">
              Il tuo indirizzo è stato salvato!
            </div>
          </q-banner>

          <lms-buttons class="q-mt-md">
            <lms-button primary label="Fine" v-close-popup />
          </lms-buttons>
        </q-step>
      </lms-stepper>
    </q-card-section>
  </q-card>
</template>

<script>
import { date } from "quasar";
import LmsStepper from "./core/LmsStepper";
import {
  getCities,
  getVaccinationUserAddressTemp,
  updateVaccinationUserDomicile
} from "../services/api";
import { apiErrorNotify } from "../services/utils";
const { getDateDiff } = date;

const STEP_MAP = {
  ADDRESS: 1,
  CONFIRM: 2
};

export default {
  name: "vacContactAddressModal",
  components: { LmsStepper },
  data() {
    return {
      verifyError: false,
      cities: [],
      comune: null,
      citySelected: null,
      cityModel: null,
      istat: null,
      CAP: null,
      address: null,
      startDate: null,
      endDate: null,
      cityErr: false,
      addressErr: false,
      startDateErr: false,
      endDateErr: false,
      startDateErrMessage: "",
      endDateErrMessage: "",
      isSaving: false,
      STEP_MAP,
      step: STEP_MAP.ADDRESS
    };
  },
  computed: {
    ruleAfterToday() {
      return v => {
        let now = new Date();
        let isValid = getDateDiff(v, now, "days") >= 0;
        let message =
          "La data inizio validità deve essere maggiore della data odierna";
        return isValid || message;
      };
    },
    ruleAfterStartDate() {
      return v => {
        let isValid = getDateDiff(this.startDate, this.endDate, "days") < 0;
        let message =
          "La data di fine validità deve essere maggiore della data di inizio";
        return isValid || message;
      };
    },
    ruleRequired() {
      return v => !!v || "Campo obbligatorio";
    },
    citiesOptions() {
      return this.cities.map(a => ({
        label: a.desc,
        value: a.desc,
        istat: a.codice_istat,
        cap: a.codice_cap
      }));
    },
    cf() {
      return this.$store.getters["getTaxCode"];
    },
    user() {
      return this.$store.getters["getUser"];
    }
  },
  async created() {},
  methods: {
    // filterFn (val, update, abort) {
    //     update(() => {
    //         const needle = val.toLocaleLowerCase()
    //         this.options = this.cities.filter(v => v.toLocaleLowerCase().indexOf(needle) > -1)
    //     })
    // },

    async confirm() {
      let isValid = await this.$refs.form.validate();
      if (!isValid) return;

      this.isSaving = true;
      let payload = {
        indirizzo_temporaneo: this.address,
        comune: this.istat,
        cap: this.CAP,
        data_inizio: this.startDate,
        data_fine: this.endDate,
        telefono: "",
        mail: ""
      };
      try {
        let response = await updateVaccinationUserDomicile(this.cf, payload);

        let { data } = await getVaccinationUserAddressTemp(this.cf);

        this.$emit("confirmed", data);
        this.isSaving = false;

        this.$refs.contactAddressStepper.next();
      } catch (e) {
        let message = "Non è stato possibile modificare l'indirizzo";
        apiErrorNotify({ error, message });
      }
    },

    onCitySelected(item) {
      this.istat = item.istat;
      this.CAP = item.cap;
    },
    async onCitySearch(terms, done) {
      let limit = 50;
      let filter = {
        desc: { si: terms }
        // data_validita: {eq: this.birthDate},
      };

      let params = { filter, limit };
      let citiesPromise = getCities({ params });
      let citiesResponse = await citiesPromise;
      this.cities = citiesResponse.data;

      done(this.citiesOptions);
    }
  }
};
</script>

<style></style>
