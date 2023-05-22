<!--
 SPDX-License-Identifier: EUPL-1.2
 Copyright Regione Piemonte - 2023
-->

<template>
  <q-dialog
    v-bind="attrs"
    v-on="listeners"
    :maximized="$q.screen.lt.md"
    @hide="onHide"
  >
    <q-card style="width: 800px; max-width: 800px;">
      <q-card-section class="q-py-sm q-pr-none">
        <q-toolbar>
          <q-toolbar-title>
            <span v-if="isEditing">Modifica validità</span>
            <span v-else>Aggiungi farmacia</span>
          </q-toolbar-title>
          <q-btn v-close-popup flat round dense icon="close" />
        </q-toolbar>
      </q-card-section>

      <q-card-section v-if="!isSuccess">
        <q-form greedy ref="form" @submit="setValidity">
          <div class="row items-center q-col-gutter-lg">
            <!-- DATA INIZIO -->
            <!-- ----------- -->
            <lms-input-date
              @input="onInputMinDate"
              v-model="startDate"
              label="Data inizio"
              :min-date="startMinDate"
              include-min-date
              required
              :disable="isActivePharmacy"
              class="col-12 col-sm-6"
            />

            <!-- DATA FINE -->
            <!-- --------- -->
            <lms-input-date
              v-model="endDate"
              label="Data fine"
              :min-date="endMinDate"
              include-min-date
              required
              class="col-12 col-sm-6"
            />
          </div>
          <lms-buttons padding>
            <lms-button type="submit" label="Conferma" :loading="isLoading" />
          </lms-buttons>
        </q-form>
      </q-card-section>
      <q-card-section v-else>
        <q-banner class="q-mb-lg q-banner--positive">
          <div class="text-body1">
            <span v-if="isEditing">
              Il periodo di validità è stato cambiato con successo.</span
            >
            <span v-else>
              La farmacia {{ pharmacyName }} è stata selezionata con
              successo.</span
            >
          </div>
        </q-banner>

        <lms-buttons>
          <lms-button
            v-if="isEditing"
            outline
            v-close-popup
            label="Chiudi"
          />
          <lms-button
            v-else
            outline
            v-close-popup
            label="Vai alla Home"
          />
        </lms-buttons>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { CHANGE_OPERATIONS_MAP, FORMAT_DATE } from "src/services/config";
import { changeUsualPharmacy } from "src/services/api";
import { HOME } from "src/router/routes";
import { apiErrorNotify, apiErrorNotifyDialog } from "src/services/utils";
import { date } from "quasar";
import LmsInputDate from "components/core/LmsInputDate";

let {
  formatDate,
  getDateDiff,
  extractDate,
  getMaxDate,
  endOfDate,
  adjustDate,
  isBetweenDates,
  addToDate,
  startOfDate,
} = date;

export default {
  name: "FarabUsualPharmacyValidityDialog",
  components: { LmsInputDate },
  props: {
    pharmacy: { type: Object, required: true, default: null },
    isEditing: { type: Boolean, required: false, default: false },
    isExpired:{ type: Boolean, required: false, default: false }
  },
  data() {
    return {
      HOME,
      startDate: null,
      endDate: null,
      showStartDateCalendar: false,
      showEndDateCalendar: false,
      isLoading: false,
      isSuccess: false,
      updatedPharmacy: null
    };
  },
  created() {
    let startDate = null;
    let endDate = null;

    if (!this.isEditing) {
      // Fase di inserimento
      startDate = new Date();
      endDate = null;
    } else if (!this.isExpired) {
      // Fase di modifica non scaduta
      startDate = this.pharmacy?.data_validita_inizio;
      endDate = this.pharmacy?.data_validita_fine;
    } else {
      // Fase di modifica scaduta
      startDate = new Date();
      endDate = null;
    }

    if (startDate) this.startDate = formatDate(startDate, FORMAT_DATE);
    this.endDate = endDate ? formatDate(endDate, FORMAT_DATE) : this.defaultEndDate

  },
  computed: {
    attrs() {
      const { ...attrs } = this.$attrs;
      return attrs;
    },
    listeners() {
      const { ...listeners } = this.$listeners;
      return listeners;
    },
    taxCode() {
      return this.$store.getters["getTaxCode"];
    },
    startMinDate() {
      // In fase di modifica di una framacia abituale valida
      // => la data minima di inizio è quella attualmente impostata
      if (this.isEditing && !this.isExpired) {
        return this.pharmacy?.data_validita_inizio;
      }

      // In caso di inserimento o di farmacia abituale scaduta
      // => la data minima di inserimento è "adesso"
      let now = new Date();
      return formatDate(now, FORMAT_DATE);
    },
    endMinDate() {
      let now = new Date();
      let startDate = extractDate(this.startDate, FORMAT_DATE);
      let date = getMaxDate(now, startDate);
      return formatDate(date, FORMAT_DATE);
    },
    defaultEndDate(){
      if(!this.startDate) return null
      let startDate = extractDate(this.startDate, FORMAT_DATE);
      let date = addToDate(startDate, { year: 1 });
      return formatDate(date, FORMAT_DATE);
    },
    pharmacyName() {
      return this.isEditing
        ? this.pharmacy?.farmacia?.descrizione
        : this.pharmacy?.descrizione;
    },

    isStartDateDisabled() {
      return this.isEditing && !this.isExpired;
    },

    isActivePharmacy(){
      return this.isEditing && !this.isExpired;
    },
    pharmacyCode(){
      if(this.isEditing && this.isExpired)
        return this.pharmacy?.farmacia?.codice
      else
        return this.pharmacy?.codice
    },

  },
  methods: {
    async usualPharmacyManagement(params) {
      this.isSuccess = false;
      this.isLoading = true;

      try {
        let { data } = await changeUsualPharmacy(this.taxCode, params);
        this.updatedPharmacy = data;
        this.isSuccess = true;
      } catch (error) {
        let message =
          "Non è stato possibile modificare il periodo di validità.";
        apiErrorNotifyDialog({ error, message });
        this.isSuccess = false;
      }

      this.isLoading = false;
    },
    setValidity() {
      let now = new Date();
      let params = null;

      // Nella data di fine prendiamo sempre tutto il giorno
      // quindi impostiamo l'orario a fine giornata (23:59:59)
      let endDate = extractDate(this.endDate, FORMAT_DATE);
      endDate = endOfDate(endDate, "day");

      if (this.isActivePharmacy) {
        params = {
          azione: CHANGE_OPERATIONS_MAP.MODIFY,
          farmacia_abituale_id: this.pharmacy.id,
          data_validita_fine: endDate
        };
      } else {
        // Nella data di inizio inseriamo l'orario corrente solo se in data odierna
        let startDate = extractDate(this.startDate, FORMAT_DATE);
        let isFutureDate = getDateDiff(now,  startDate) <0

        if(isFutureDate){
          startDate = startOfDate(startDate, 'day');
        }else{
          startDate = adjustDate(startDate, {
            hours: now.getHours(),
            minutes: now.getMinutes(),
            seconds: now.getSeconds(),
            milliseconds: now.getMilliseconds()
          });
        }

        params = {
          azione: CHANGE_OPERATIONS_MAP.CREATE,
          farmacia_codice: this.pharmacyCode,
          data_validita_inizio: startDate,
          data_validita_fine: endDate
        };
      }

      this.usualPharmacyManagement(params);
    },
    onInputMinDate(value){
      this.endDate = this.defaultEndDate
    },
    onHide() {
      console.log("onhide");
      this.$emit("is-changed", this.isSuccess);
      this.isSuccess = false;
    }

  }
};
</script>

<style scoped></style>
