<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-dialog
    v-bind="attrs"
    v-on="listeners"
    :maximized="$q.screen.lt.sm"
    class="tac-detection-cholesterol-create-dialog"
  >
    <q-card>
      <q-form
        greedy
        novalidate
        @submit="onsubmit"
        class="column"
        style="min-height: 100%"
      >
        <q-toolbar>
          <q-toolbar-title>
            Inserisci i valori di colesterolo
          </q-toolbar-title>

          <q-btn v-close-popup flat round dense icon="close" />
        </q-toolbar>

        <q-card-section>
          <div class="row q-col-gutter-md">
            <!-- TOT -->
            <!-- --------------------------------------------------------------------------------------------------- -->
            <div class="col-12">
              <div class="row q-col-gutter-md">
                <div class="col">
                  <q-input
                    type="number"
                    v-model.number="tot"
                    label="TOT"
                    clearable
                    :rules="[ruleTot]"
                    no-error-icon
                    class="tac-input--text-right"
                  />
                </div>

                <div class="col-12 col-sm-6 col-md-4">
                  <q-select
                    v-model="totMeasure"
                    :options="totMeasureList"
                    label="Unità di misura"
                    option-value="unita_misura_codice"
                    option-label="unita_misura_codice"
                    emit-value
                    map-options
                    clearable
                    :rules="[ruleTotMeasure]"
                    no-error-icon
                  />
                </div>
              </div>
            </div>

            <!-- HDL -->
            <!-- --------------------------------------------------------------------------------------------------- -->
            <div class="col-12">
              <div class="row q-col-gutter-md">
                <div class="col">
                  <q-input
                    type="number"
                    v-model.number="hdl"
                    label="HDL"
                    clearable
                    :rules="[ruleHdl]"
                    no-error-icon
                    class="tac-input--text-right"
                  />
                </div>

                <div class="col-12 col-sm-6 col-md-4">
                  <q-select
                    v-model="hdlMeasure"
                    :options="hdlMeasureList"
                    label="Unità di misura"
                    option-value="unita_misura_codice"
                    option-label="unita_misura_codice"
                    emit-value
                    map-options
                    clearable
                    :rules="[ruleHdlMeasure]"
                    no-error-icon
                  />
                </div>
              </div>
            </div>

            <!-- LDL -->
            <!-- --------------------------------------------------------------------------------------------------- -->
            <div class="col-12">
              <div class="row q-col-gutter-md">
                <div class="col">
                  <q-input
                    type="number"
                    v-model.number="ldl"
                    label="LDL"
                    clearable
                    :rules="[ruleLdl]"
                    no-error-icon
                    class="tac-input--text-right"
                  />
                </div>

                <div class="col-12 col-sm-6 col-md-4">
                  <q-select
                    v-model="ldlMeasure"
                    :options="ldlMeasureList"
                    label="Unità di misura"
                    option-value="unita_misura_codice"
                    option-label="unita_misura_codice"
                    emit-value
                    map-options
                    clearable
                    :rules="[ruleLdlMeasure]"
                    no-error-icon
                  />
                </div>
              </div>
            </div>

            <!-- TRIGLICERIDI -->
            <!-- --------------------------------------------------------------------------------------------------- -->
            <div class="col-12">
              <div class="row q-col-gutter-md">
                <div class="col">
                  <q-input
                    type="number"
                    v-model.number="triglycerides"
                    label="Trigliceridi"
                    clearable
                    :rules="[ruleTriglycerides]"
                    no-error-icon
                    class="tac-input--text-right"
                  />
                </div>

                <div class="col-12 col-sm-6 col-md-4">
                  <q-select
                    v-model="triglyceridesMeasure"
                    :options="triglyceridesMeasureList"
                    label="Unità di misura"
                    option-value="unita_misura_codice"
                    option-label="unita_misura_codice"
                    emit-value
                    map-options
                    clearable
                    :rules="[ruleTriglyceridesMeasure]"
                    no-error-icon
                  />
                </div>
              </div>
            </div>

            <!-- DATA RILEVAZIONE -->
            <!-- --------------------------------------------------------------------------------------------------- -->
            <div class="col-12">
              <div class="text-bold text-caption">
                Data rilevazione
              </div>
              <div class="row q-col-gutter-md">
                <div class="col-auto">
                  <q-input
                    type="date"
                    v-model="date"
                    label="Data"
                    required
                    :rules="[ruleRequired]"
                    no-error-icon
                  />
                </div>

                <div class="col-auto">
                  <q-input
                    type="time"
                    v-model="time"
                    label="Ora"
                    required
                    :rules="[ruleRequired]"
                    no-error-icon
                  />
                </div>
              </div>
            </div>

            <!-- MODALITA' RILEVAZIONE -->
            <!-- --------------------------------------------------------------------------------------------------- -->
            <div class="col-12">
              <tac-detection-mode-select
                v-model="detectionModeCode"
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
import { date } from "quasar";
import {
  apiErrorNotify,
  apiErrorNotifyDialog,
  isNumber,
  notifyError
} from "../services/utils";
import { createDetection } from "../services/api";
import {
  DESCRIPTOR_CODE_MAP,
  DETECTION_MODE_CODE_MAP,
  GROUP_CODE_MAP,
  UNIT_CODE_MAP
} from "../services/config";
import TacDetectionModeSelect from "./TacDetectionModeSelect";
import {
  getLastSelectedMeasure,
  setLastSelectedMeasure
} from "../services/business-logic";

const { formatDate, extractDate } = date;
const GROUP_CODE = GROUP_CODE_MAP.CHOLESTEROL;

export default {
  name: "TacDetectionCholesterolCreateDialog",
  components: { TacDetectionModeSelect },
  inheritAttrs: false,
  props: {},
  data() {
    return {
      isSaving: false,
      hdl: null,
      hdlMeasure: null,
      ldl: null,
      ldlMeasure: null,
      triglycerides: null,
      triglyceridesMeasure: null,
      tot: null,
      totMeasure: null,
      date: null,
      time: null,
      detectionModeCode: DETECTION_MODE_CODE_MAP.AUT
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
    measureUnitConfig() {
      return this.$store.getters["getMeasureUnitConfiguration"];
    },
    hdlMeasureList() {
      return this.measureUnitConfig.filter(
        m => m.descrittore_codice === DESCRIPTOR_CODE_MAP.CHOLESTEROL_HDL
      );
    },
    ldlMeasureList() {
      return this.measureUnitConfig.filter(
        m => m.descrittore_codice === DESCRIPTOR_CODE_MAP.CHOLESTEROL_LDL
      );
    },
    triglyceridesMeasureList() {
      return this.measureUnitConfig.filter(
        m => m.descrittore_codice === DESCRIPTOR_CODE_MAP.TRIGLYCERIDES
      );
    },
    totMeasureList() {
      return this.measureUnitConfig.filter(
        m => m.descrittore_codice === DESCRIPTOR_CODE_MAP.CHOLESTEROL_TOT
      );
    },
    ruleRequired() {
      return v => !!v || "Campo obbligatorio";
    },
    ruleTot() {
      return v => {
        // Prendiamo in considerazione il campo solo se è stata selezionata anche l'unità di misura
        if (this.totMeasure) {
          if (!isNumber(v)) return "Campo obbligatorio";
        }

        return true;
      };
    },
    ruleTotMeasure() {
      return v => {
        // Prendiamo in considerazione il campo solo se è stato inserito anche un valore
        if (isNumber(this.tot)) {
          if (!v) return "Campo obbligatorio";
        }

        return true;
      };
    },
    ruleHdl() {
      return v => {
        // Prendiamo in considerazione il campo solo se è stata selezionata anche l'unità di misura
        if (this.hdlMeasure) {
          if (!isNumber(v)) return "Campo obbligatorio";
        }

        return true;
      };
    },
    ruleHdlMeasure() {
      return v => {
        // Prendiamo in considerazione il campo solo se è stato inserito anche un valore
        if (isNumber(this.hdl)) {
          if (!v) return "Campo obbligatorio";
        }

        return true;
      };
    },
    ruleLdl() {
      return v => {
        // Prendiamo in considerazione il campo solo se è stata selezionata anche l'unità di misura
        if (this.ldlMeasure) {
          if (!isNumber(v)) return "Campo obbligatorio";
        }

        return true;
      };
    },
    ruleLdlMeasure() {
      return v => {
        // Prendiamo in considerazione il campo solo se è stato inserito anche un valore
        if (isNumber(this.ldl)) {
          if (!v) return "Campo obbligatorio";
        }

        return true;
      };
    },
    ruleTriglycerides() {
      return v => {
        // Prendiamo in considerazione il campo solo se è stata selezionata anche l'unità di misura
        if (this.triglyceridesMeasure) {
          if (!isNumber(v)) return "Campo obbligatorio";
        }

        return true;
      };
    },
    ruleTriglyceridesMeasure() {
      return v => {
        // Prendiamo in considerazione il campo solo se è stato inserito anche un valore
        if (isNumber(this.triglycerides)) {
          if (!v) return "Campo obbligatorio";
        }

        return true;
      };
    }
  },
  created() {
    let now = new Date();
    this.date = formatDate(now, "YYYY-MM-DD");
    this.time = formatDate(now, "HH:mm");


  },
  methods: {
    close() {
      this.$emit("input", false);
    },
    async onsubmit() {
      // Verifichiamo che almeno uno dei campi necessari sia stato precompilato
      let hdl = this.hdl && this.hdlMeasure;
      let ldl = this.ldl && this.ldlMeasure;
      let triglycerides = this.triglycerides && this.triglyceridesMeasure;
      let tot = this.tot && this.totMeasure;
      if (!hdl && !ldl && !triglycerides && !tot) {
        notifyError("Compila almeno una tra HDL, LDL, Trigliceridi e TOT");
        return;
      }

      let taxCode = this.$store.getters["getTaxCode"];
      let notebookId = this.notebook?.id;
      let datetime = extractDate(
        `${this.date} ${this.time}`,
        "YYYY-MM-DD HH:mm"
      );

      let payload = {
        // gruppo_codice: GROUP_CODE,
        lista: []
      };

      // Aggiungiamo HDL solo se inserito dall'utente
      if (hdl) {
        payload.lista.push({
          valore_numerico: this.hdl,
          data: datetime,
          unita_misura_codice: this.hdlMeasure,
          gruppo_codice: GROUP_CODE,
          descrittore_codice: DESCRIPTOR_CODE_MAP.CHOLESTEROL_HDL,
          modalita_codice: this.detectionModeCode
        });
      }

      // Aggiungiamo LDL solo se inserito dall'utente
      if (ldl) {
        payload.lista.push({
          valore_numerico: this.ldl,
          data: datetime,
          unita_misura_codice: this.ldlMeasure,
          gruppo_codice: GROUP_CODE,
          descrittore_codice: DESCRIPTOR_CODE_MAP.CHOLESTEROL_LDL,
          modalita_codice: this.detectionModeCode
        });
      }

      // Aggiungiamo trigliceridi solo se inserito dall'utente
      if (triglycerides) {
        payload.lista.push({
          valore_numerico: this.triglycerides,
          data: datetime,
          unita_misura_codice: this.triglyceridesMeasure,
          gruppo_codice: GROUP_CODE,
          descrittore_codice: DESCRIPTOR_CODE_MAP.TRIGLYCERIDES,
          modalita_codice: this.detectionModeCode
        });
      }

      // Aggiungiamo TOT solo se inserito dall'utente
      if (tot) {
        payload.lista.push({
          valore_numerico: this.tot,
          data: datetime,
          unita_misura_codice: this.totMeasure,
          gruppo_codice: GROUP_CODE,
          descrittore_codice: DESCRIPTOR_CODE_MAP.CHOLESTEROL_TOT,
          modalita_codice: this.detectionModeCode
        });
      }

      this.isSaving = true;

      try {
        let { data } = await createDetection(taxCode, notebookId, payload);


        this.$emit("created", data);
        this.close();
      } catch (err) {
        let message = "Non è stato possibile aggiungere la rilevazione";
        apiErrorNotifyDialog({ err, message });
      }

      this.isSaving = false;
    }
  }
};
</script>

<style lang="sass"></style>
