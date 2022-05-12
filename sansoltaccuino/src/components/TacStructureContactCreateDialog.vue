<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-dialog
    v-bind="attrs"
    v-on="listeners"
    :maximized="$q.screen.lt.sm"
    class="tac-structure-contact-create-dialog"
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
            Inserisci un contatto con una struttura
          </q-toolbar-title>

          <q-btn v-close-popup flat round dense icon="close" />
        </q-toolbar>

        <q-card-section>
          <div class="row q-col-gutter-lg">
            <!-- TIPO STRUTTURA -->
            <!-- --------------------------------------------------------------------------------------------------- -->
            <div class="col-12">
              <div>Tipo di struttura</div>
              <div class="q-gutter-sm">
                <q-radio
                  v-model="structureType"
                  :val="STRUCTURE_TYPE_CODE_MAP.ASR"
                  label="Struttura sanitaria"
                />
                <q-radio
                  v-model="structureType"
                  :val="STRUCTURE_TYPE_CODE_MAP.NO_CONVENTIONAL"
                  label="Medicina non convenzionale"
                />
              </div>
            </div>

            <!-- --------------------------------------------------------------------------------------------------- -->
            <!-- CASO: STRUTTURA SANITARIA -->
            <!-- --------------------------------------------------------------------------------------------------- -->
            <template v-if="structureType === STRUCTURE_TYPE_CODE_MAP.ASR">
              <!-- DESCRIZIONE -->
              <!-- --------------------------------------------------------------------------------------------------- -->
              <div class="col-12">
                <q-input
                  type="textarea"
                  v-model="structureName"
                  label="Nome struttura"
                  required
                  counter
                  maxlength="256"
                  filled
                  dense
                  :rules="[ruleRequired]"
                  no-error-icon
                />
              </div>

              <!-- TIPO CONTATTO -->
              <!-- --------------------------------------------------------------------------------------------------- -->
              <div class="col-12">
                <q-select
                  v-model="contactType"
                  :options="contactTypeList"
                  option-value="codice"
                  option-label="descrizione"
                  emit-value
                  map-options
                  label="Tipo contatto"
                  :loading="isLoadingContactTypeList"
                  required
                  :rules="[ruleRequired]"
                  no-error-icon
                />
              </div>

              <!-- MOTIVAZIONE -->
              <!-- --------------------------------------------------------------------------------------------------- -->
              <div class="col-12">
                <q-input
                  type="textarea"
                  v-model="motivation"
                  label="Motivazione"
                  required
                  counter
                  maxlength="128"
                  filled
                  dense
                  :rules="[ruleRequired]"
                  no-error-icon
                />
              </div>
            </template>

            <!-- --------------------------------------------------------------------------------------------------- -->
            <!-- CASO: MEDICINA NON CONVENZIONALE -->
            <!-- --------------------------------------------------------------------------------------------------- -->
            <template
              v-if="structureType === STRUCTURE_TYPE_CODE_MAP.NO_CONVENTIONAL"
            >
              <!-- DESCRIZIONE -->
              <!-- --------------------------------------------------------------------------------------------------- -->
              <div class="col-12">
                <q-input
                  type="textarea"
                  v-model="structureName"
                  label="Nome struttura"
                  required
                  counter
                  maxlength="256"
                  filled
                  dense
                  :rules="[ruleRequired]"
                  no-error-icon
                />
              </div>

              <!-- TIPO CONTATTO -->
              <!-- --------------------------------------------------------------------------------------------------- -->
              <div class="col-12">
                <q-input
                  type="textarea"
                  v-model="contactTypeNoConventional"
                  label="TIpo contatto"
                  required
                  counter
                  maxlength="128"
                  filled
                  dense
                  :rules="[ruleRequired]"
                  no-error-icon
                />
              </div>
            </template>

            <!-- DATA INIZIO CONTATTO -->
            <!-- --------------------------------------------------------------------------------------------------- -->
            <div class="col-12 col-md-6">
              <div class="text-bold text-caption">
                Inizio contatto
              </div>
              <div class="row q-col-gutter-md">
                <div class="col-auto">
                  <q-input
                    type="date"
                    v-model="startDate"
                    label="Data"
                    required
                    stack-label
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
                    required
                    stack-label
                    :rules="[ruleRequired, beforeEndTime]"
                    reactive-rules
                    no-error-icon
                  />
                </div>
              </div>
            </div>

            <!-- DATA FINE CONTATTO -->
            <!-- --------------------------------------------------------------------------------------------------- -->
            <div class="col-12 col-md-6">
              <div class="text-bold text-caption">
                Fine contatto
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
import { createStructureContact, getContactTypeList } from "../services/api";
import { date } from "quasar";
import { STRUCTURE_TYPE_CODE_MAP } from "../services/config";

const { formatDate, extractDate } = date;

export default {
  name: "TacStructureContactCreateDialog",
  inheritAttrs: false,
  props: {},
  data() {
    return {
      STRUCTURE_TYPE_CODE_MAP,
      isLoadingContactTypeList: false,
      contactTypeList: [],
      isSaving: false,
      structureType: STRUCTURE_TYPE_CODE_MAP.ASR,
      structureName: "",
      contactType: null,
      contactTypeNoConventional: "",
      motivation: "",
      startDate: null,
      startTime: null,
      endDate: null,
      endTime: null
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

    this.loadContactTypeList();
  },
  methods: {
    close() {
      this.$emit("input", false);
    },
    async loadContactTypeList() {
      this.isLoadingContactTypeList = true;

      try {
        let { data } = await getContactTypeList();
        this.contactTypeList = data;
      } catch (err) {
        let message =
          "Non è stato possibile caricare la lista dei tipi di contatto";
        apiErrorNotifyDialog({ err, message });
      }

      this.isLoadingContactTypeList = false;
    },
    async onsubmit() {
      let taxCode = this.$store.getters["getTaxCode"];
      let notebookId = this.notebook?.id;
      let startDatetime = extractDate(
        `${this.startDate} ${this.startTime}`,
        "YYYY-MM-DD HH:mm"
      );

      let payload = {
        denominazione: this.structureName,
        motivazione: this.motivation,
        data_contatto_inizio: startDatetime,
        medicina_non_convenzionale_tipo_contatto: this
          .contactTypeNoConventional,
        tipo_contatto_codice: this.contactType,
        struttura_tipo_codice: this.structureType
      };

      // Aggiungiamo la data di fine solo se è stata selezionata dall'utente
      if (this.endDate && this.endTime) {
        payload.data_contatto_fine = extractDate(
          `${this.endDate} ${this.endTime}`,
          "YYYY-MM-DD HH:mm"
        );
      }

      this.isSaving = true;

      try {
        let { data } = await createStructureContact(
          taxCode,
          notebookId,
          payload
        );
        this.$emit("created", data);
        this.close();
      } catch (err) {
        let message =
          "Non è stato possibile aggiungere l'annotazione del contatto con struttura";
        apiErrorNotifyDialog({ err, message });
      }

      this.isSaving = false;
    }
  }
};
</script>

<style lang="sass"></style>
