<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-dialog v-bind="attrs" v-on="listeners" :maximized="$q.screen.lt.md">
    <q-card style="width: 800px; max-width: 800px;">
      <q-card-section class="q-py-sm q-pr-none">
        <q-toolbar>
          <q-toolbar-title>
            Inserisci indirizzo
          </q-toolbar-title>

          <q-btn v-close-popup flat round dense icon="close" />
        </q-toolbar>
      </q-card-section>

      <q-card-section class="no-padding">
        <lms-stepper v-model="step" flat alternative-labels animated vertical>
          <!-- STEP INSERIMENTO INDIRIZZO -->
          <!-- ----------------------------------------------------------------------------------------------------- -->
          <q-step
            :name="STEP_MAP.ADDRESS"
            title="Indirizzo"
            :done="step > STEP_MAP.ADDRESS"
            done-color="green-8"
            :prefix="STEP_MAP.ADDRESS"
          >
            <q-form ref="form" greedy novalidate @submit="onSubmit">
              <q-select
                v-model="citySelected"
                :options="cityList"
                label="Comune"
                :option-label="getCityOptionLabel"
                option-value="desc"
                use-input
                hide-selected
                fill-input
                hide-dropdown-icon
                :input-debounce="400"
                bottom-slots
                hint="Digita almeno 2 caratteri per eseguire la ricerca"
                required
                no-error-icon
                :rules="[ruleRequired]"
                @filter="onCityFilter"
              />

              <q-input
                v-model="address"
                label="Indirizzo"
                required
                no-error-icon
                :rules="[ruleRequired]"
              />


              <q-input
                dense
                no-error-icon
                required
                bottom-slots
                mask="##/##/####"
                @input="onInputStartDate"
                placeholder="gg/mm/aaaa"
                label="Data inizio validità domicilio"
                v-model="startDate"
                :rules="[ruleRequired, ruleValidDate, ruleAfterToday]"
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="examDateProxy" v-model="showStartDateCalendar">
                      <q-date
                        :value="startDate"
                        minimal
                        :mask=FORMAT_DATE
                        @input="onInputStartDate"
                        :options="rangeStartDateOptions"
                        :navigation-min-year-month="minDefaultStartDate"
                      />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>

              <q-input
                dense
                no-error-icon
                required
                bottom-slots
                mask="##/##/####"
                @input="onInputEndDate"
                placeholder="gg/mm/aaaa"
                label="Data fine validità domicilio"
                v-model="endDate"
                :rules="[ruleRequired, ruleValidDate, ruleAfterToday]"
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="examDateProxy" v-model="showEndDateCalendar">
                      <q-date
                        :value="endDate"
                        minimal
                        :mask=FORMAT_DATE
                        @input="onInputEndDate"
                        :options="rangeEndDateOptions"
                        :navigation-min-year-month="minDefaultEndDate"
                      />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>


              <lms-buttons class="q-mt-md">
                <lms-button type="submit" label="Avanti" :loading="isSaving" />
              </lms-buttons>
            </q-form>
          </q-step>

          <!-- STEP FEEDBACK -->
          <!-- ----------------------------------------------------------------------------------------------------- -->
          <q-step :name="STEP_MAP.FEEDBACK" title="Fine"   :prefix="STEP_MAP.FEEDBACK">
            <q-banner  class="q-banner--positive q-mt-sm">
              <div class="text-body1">
                <p class="text-bold">
                  Verifica completata!
                </p>

                <p class="q-mb-none">
                  Il tuo indirizzo è stato salvato!
                </p>
              </div>
            </q-banner>

            <lms-buttons class="q-mt-md">
              <lms-button v-close-popup label="Fine" />
            </lms-buttons>
          </q-step>
        </lms-stepper>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { capitalCase } from "change-case";
import { date } from "quasar";
import { apiErrorNotify } from "../services/utils";
import {
  getCityList,
  getVaccinationUserAddressTemp,
  updateVaccinationUserDomicile
} from "../services/api";
import LmsStepper from "./core/LmsStepper";
import {FORMAT_DATE} from "src/services/config";

const { getDateDiff , extractDate, formatDate} = date;

const STEP_MAP = {
  ADDRESS: 1,
  FEEDBACK: 2
};

export default {
  name: "VacAddressDialog",
  inheritAttrs: false,
  components: { LmsStepper },
  data() {
    return {
      FORMAT_DATE,
      STEP_MAP,
      step: STEP_MAP.ADDRESS,
      isSaving: false,
      cityList: [],
      citySelected: null,
      address: null,
      startDate: null,
      endDate: null,
      showStartDateCalendar:false,
      showEndDateCalendar:false,
      minDefaultStartDate:null,

    };
  },
  computed: {
    user() {
      return this.$store.getters["getUser"];
    },
    cf() {
      return this.$store.getters["getTaxCode"];
    },
    attrs() {
      const { ...attrs } = this.$attrs;
      return attrs;
    },
    listeners() {
      const { ...listeners } = this.$listeners;
      return listeners;
    },
    ruleRequired() {
      return v => !!v || "Campo obbligatorio";
    },
    ruleValidDate() {
      return v => /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/.test(v) || "Inserire una data valida";
    },
    ruleAfterToday() {
      let today = new Date();
      return v =>
        getDateDiff(extractDate(v, FORMAT_DATE), today, 'days') >= 0 ||
        "La data inizio validità deve essere maggiore della data odierna";

    },
    ruleAfterStartDate() {
      return v => {
        let startDate = extractDate(this.startDate, FORMAT_DATE)
        let endDate = extractDate(v, FORMAT_DATE)
        let isValid = getDateDiff(startDate, endDate, "days") < 0;
        let message =
          "La data di fine validità deve essere maggiore della data di inizio";
        return isValid || message;
      };
    },
    minDefaultEndDate() {
      return this.startDate ? formatDate(this.startDate, 'YYYY/MM') : this.minDefaultStartDate
    }
  },
  created() {
    this.minDefaultStartDate = formatDate(new Date(), 'YYYY/MM')
  },
  methods: {
    onStepNext() {
      this.step += 1;
    },
    rangeStartDateOptions(calendarDate, format = 'YYYY/MM/DD') {
      let selectedDate = extractDate(calendarDate, format)
      return getDateDiff(selectedDate, new Date(), 'days') >= 0
    },
    rangeEndDateOptions(calendarDate, format = 'YYYY/MM/DD') {
      let selectedDate = extractDate(calendarDate, format)
      let minDate=  this.startDate ? extractDate(this.startDate, FORMAT_DATE) : new Date()
      return  getDateDiff(selectedDate, minDate, 'days') >= 0
    },
    onInputStartDate(val) {
      this.showStartDateCalendar = false
      this.startDate = val
    },
    onInputEndDate(val) {
      this.showEndDateCalendar = false
      this.endDate = val
    },
    getCityOptionLabel(city) {
      return capitalCase(city.desc);
    },
    async onCityFilter(needle, update, abort) {
      needle = needle || "";
      needle = needle.trim().toUpperCase();

      if (needle.length < 2) {
        abort();
        return;
      }

      let limit = 50;
      let filter = {
        desc: { si: needle }
      };

      let params = { filter, limit };

      try {
        let citiesResponse = await getCityList({ params });
        this.cityList = citiesResponse.data;
        update();
      } catch (error) {
        let message = "Non è stato possibile caricare l'elenco dei comuni";
        apiErrorNotify({ error, message });
        abort();
      }
    },
    async onSubmit() {
      let isValid = await this.$refs.form.validate();
      if (!isValid) return;

      let taxCode = this.cf;
      let payload = {
        indirizzo_temporaneo: this.address,
        comune: this.citySelected?.codice_istat ?? null,
        cap: this.citySelected?.codice_cap ?? null,
        data_inizio: this.startDate,
        data_fine: this.endDate,
        telefono: "",
        mail: ""
      };

      this.isSaving = true;

      try {
        await updateVaccinationUserDomicile(taxCode, payload);
      } catch (error) {
        let message = "Non è stato possibile modificare l'indirizzo";
        apiErrorNotify({ error, message });
        this.isSaving = false;
        return;
      }

      try {
        let { data } = await getVaccinationUserAddressTemp(taxCode);
        this.$emit("confirmed", data);
      } catch (error) {
        let color = "warning";
        let message =
          "La modifica è andata a buon fine ma potresti continuare a vedere il tuo vecchio indirizzo. Prova ad aggiornare la pagina";
        apiErrorNotify({ error, message, color });
      }

      this.isSaving = false;
      this.onStepNext();
    }
  }
};
</script>

<style lang="sass"></style>
