<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-dialog
    v-bind="attrs"
    v-on="listeners"
    :maximized="$q.screen.lt.sm"
    class="tac-pain-create-dialog"
  >
    <q-card>
      <q-form
        novalidate
        greedy
        @submit="onsubmit"
        class="column"
        style="min-height: 100%"
      >
        <q-toolbar>
          <q-toolbar-title>
            Annota dolore
          </q-toolbar-title>

          <q-btn v-close-popup flat round dense icon="close" />
        </q-toolbar>

        <q-card-section>
          <div class="row q-col-gutter-lg">
            <!-- DATA INIZIO DOLORE -->
            <!-- --------------------------------------------------------------------------------------------------- -->
            <div class="col-12 col-md-6">
              <div class="text-bold text-caption">
                Data inizio dolore
              </div>
              <div class="row q-col-gutter-md">
                <div class="col-auto">
                  <q-input
                    type="date"
                    v-model="startDate"
                    label="Data"
                    stack-label
                    required
                    :rules="[ruleRequired, beforeOrSameEndDate]"
                    reactive-rules
                    no-error-icon
                  />
                </div>

                <div class="col-auto">
                  <q-input
                    type="time"
                    v-model="startTime"
                    label="Ora"
                    stack-label
                    required
                    :rules="[ruleRequired, beforeEndTime]"
                    reactive-rules
                    no-error-icon
                  />
                </div>
              </div>
            </div>

            <!-- DATA INIZIO DOLORE -->
            <!-- --------------------------------------------------------------------------------------------------- -->
            <div class="col-12 col-md-6">
              <div class="text-bold text-caption">
                Data fine dolore
              </div>
              <div class="row q-col-gutter-md">
                <div class="col-auto">
                  <q-input
                    type="date"
                    v-model="endDate"
                    label="Data"
                    stack-label
                  />
                </div>

                <div class="col-auto">
                  <q-input
                    type="time"
                    v-model="endTime"
                    label="Ora"
                    stack-label
                  />
                </div>
              </div>
            </div>

            <!-- INTENSITA' DOLORE -->
            <!-- --------------------------------------------------------------------------------------------------- -->
            <div class="col-12">
              <q-select
                v-model="intensity"
                :options="intensityList"
                option-value="codice"
                option-label="descrizione"
                emit-value
                map-options
                label="Intensità dolore"
                required
                :loading="isLoadingIntensityList"
                :rules="[ruleRequired]"
                no-error-icon
              />
            </div>

            <!-- DESCRIZIONE -->
            <!-- --------------------------------------------------------------------------------------------------- -->
            <div class="col-12">
              <q-input
                type="textarea"
                v-model="description"
                label="Descrizione"
                required
                maxlength="256"
                dense
                counter
                filled
                :rules="[ruleRequired]"
                no-error-icon
              />
            </div>

            <!-- AREA INTERESSATA -->
            <!-- --------------------------------------------------------------------------------------------------- -->
            <div class="col-12">
              <q-input
                type="textarea"
                v-model="area"
                label="Area anatomica interessata"
                required
                maxlength="128"
                dense
                counter
                filled
                :rules="[ruleRequired]"
                no-error-icon
              />
            </div>
          </div>
        </q-card-section>

        <q-space />

        <q-card-section>
          <lms-buttons>
            <lms-button type="submit" :loading="isSaving">
              Salva
            </lms-button>
          </lms-buttons>
        </q-card-section>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script>
import { apiErrorNotify, apiErrorNotifyDialog } from "../services/utils";
import { createPain, getPainIntensityList } from "../services/api";
import { date } from "quasar";

const { formatDate, extractDate } = date;

export default {
  name: "TacPainCreateDialog",
  inheritAttrs: false,
  props: {},
  data() {
    return {
      isLoadingIntensityList: false,
      intensityList: [],
      isSaving: false,
      temperature: 0,
      startDate: null,
      startTime: null,
      endDate: null,
      endTime: null,
      description: "",
      area: null,
      intensity: null
    };
  },
  computed: {
    listeners() {
      const { transition, ...listeners } = this.$listeners;
      return listeners;
    },
    attrs() {
      const { ...attrs } = this.$attrs;
      return attrs;
    },
    user() {
      return this.$store.getters["getUser"];
    },
    notebook() {
      return this.$store.getters["getNotebook"];
    },
    ruleRequired() {
      return v => !!v || "Campo obbligatorio";
    },
    beforeOrSameEndDate() {
      return v =>
        !this.endDate ||
        v <= this.endDate ||
        "Non può essere dopo la data di fine";
    },
    beforeEndTime() {
      return v =>
        !this.endDate ||
        !this.endTime ||
        this.startDate < this.endDate ||
        v < this.endTime ||
        "Non può essere dopo la data di fine";
    }
  },
  created() {
    let now = new Date();
    this.startDate = formatDate(now, "YYYY-MM-DD");
    this.startTime = formatDate(now, "HH:mm");

    this.loadIntensityList();
  },
  methods: {
    close() {
      this.$emit("input", false);
    },
    async loadIntensityList() {
      this.isLoadingIntensityList = true;

      try {
        let { data } = await getPainIntensityList();
        this.intensityList = data;
      } catch (err) {
        let message =
          "Non è stato possibile caricare la lista delle intensità di dolore";
        apiErrorNotifyDialog({ err, message });
      }

      this.isLoadingIntensityList = false;
    },
    async onsubmit() {
      let taxCode = this.$store.getters["getTaxCode"];
      let notebookId = this.notebook?.id;
      let startDatetime = extractDate(
        `${this.startDate} ${this.startTime}`,
        "YYYY-MM-DD HH:mm"
      );

      let payload = {
        descrizione: this.description,
        area_interessata: this.area,
        data_inizio: startDatetime,
        intensita_valore: this.intensity?.valore
      };

      // Aggiungiamo la data di fine solo se è stata selezionata dall'utente
      if (this.endDate && this.endTime) {
        payload.data_fine = extractDate(
          `${this.endDate} ${this.endTime}`,
          "YYYY-MM-DD HH:mm"
        );
      }

      this.isSaving = true;

      try {
        let { data } = await createPain(taxCode, notebookId, payload);
        this.$emit("created", data);
        this.close();
      } catch (err) {
        let message = "Non è stato possibile aggiungere il dolore";
        apiErrorNotifyDialog({ err, message });
      }

      this.isSaving = false;
    }
  }
};
</script>

<style lang="sass"></style>
