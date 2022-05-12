<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-dialog
    v-bind="attrs"
    v-on="listeners"
    :maximized="$q.screen.lt.sm"
    class="tac-detection-pressure-create-dialog"
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
            Inserisci pressione minima, massima e battiti per minuto
          </q-toolbar-title>

          <q-btn v-close-popup flat round dense icon="close" />
        </q-toolbar>

        <q-card-section>
          <div class="row q-col-gutter-md">
            <!-- PRESSIONE MINIMA -->
            <!-- --------------------------------------------------------------------------------------------------- -->
            <div class="col-12">
              <div class="row q-col-gutter-md">
                <div class="col">
                  <q-input
                    type="number"
                    v-model.number="pressMin"
                    label="Pressione diastolica (minima)"
                    clearable
                    :rules="[rulePressMin]"
                    no-error-icon
                    class="tac-input--text-right"
                  >
                    <template v-if="isPressMinSelfSelectable" #after>
                      <div class="text-body1 text-black text-bold self-end">
                        {{ pressMinSelfSelectableValue }}
                      </div>
                    </template>
                  </q-input>
                </div>

                <template v-if="!isPressMinSelfSelectable">
                  <div class="col-12 col-sm-6 col-md-4">
                    <q-select
                      v-model="pressMinMeasure"
                      :options="pressMinMeasureList"
                      label="Unità di misura"
                      option-value="unita_misura_codice"
                      option-label="unita_misura_codice"
                      emit-value
                      map-options
                      clearable
                      :rules="[rulePressMinMeasure]"
                      no-error-icon
                    />
                  </div>
                </template>
              </div>
            </div>

            <!-- PRESSIONE MASSIMA -->
            <!-- --------------------------------------------------------------------------------------------------- -->
            <div class="col-12">
              <div class="row q-col-gutter-md">
                <div class="col">
                  <q-input
                    type="number"
                    v-model.number="pressMax"
                    label="Pressione sistolica (massima)"
                    clearable
                    :rules="[rulePressMax]"
                    no-error-icon
                    class="tac-input--text-right"
                  >
                    <template v-if="isPressMaxSelfSelectable" #after>
                      <div class="text-body1 text-black text-bold self-end">
                        {{ pressMaxSelfSelectableValue }}
                      </div>
                    </template>
                  </q-input>
                </div>

                <template v-if="!isPressMaxSelfSelectable">
                  <div class="col-12 col-sm-6 col-md-4">
                    <q-select
                      v-model="pressMaxMeasure"
                      :options="pressMaxMeasureList"
                      label="Unità di misura"
                      option-value="unita_misura_codice"
                      option-label="unita_misura_codice"
                      emit-value
                      map-options
                      clearable
                      :rules="[rulePressMaxMeasure]"
                      no-error-icon
                    />
                  </div>
                </template>
              </div>
            </div>

            <!-- BATTITI AL MINUTO -->
            <!-- --------------------------------------------------------------------------------------------------- -->
            <div class="col-12">
              <div class="row q-col-gutter-md">
                <div class="col">
                  <q-input
                    type="number"
                    v-model.number="bpm"
                    label="Frequenza cardiaca"
                    clearable
                    :rules="[ruleBpm]"
                    no-error-icon
                    class="tac-input--text-right"
                  >
                    <template v-if="isBpmSelfSelectable" #after>
                      <div class="text-body1 text-black text-bold self-end">
                        {{ bpmSelfSelectableValue }}
                      </div>
                    </template>
                  </q-input>
                </div>

                <template v-if="!isBpmSelfSelectable">
                  <div class="col-12 col-sm-6 col-md-4">
                    <q-select
                      v-model="bpmMeasure"
                      :options="bpmMeasureList"
                      label="Unità di misura"
                      option-value="unita_misura_codice"
                      option-label="unita_misura_codice"
                      emit-value
                      map-options
                      clearable
                      :rules="[ruleBpmMeasure]"
                      no-error-icon
                    />
                  </div>
                </template>
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
  GROUP_CODE_MAP
} from "../services/config";
import TacDetectionModeSelect from "./TacDetectionModeSelect";
import { date } from "quasar";
import {
  getLastSelectedMeasure,
  setLastSelectedMeasure
} from "../services/business-logic";

const { formatDate, extractDate } = date;
const GROUP_CODE = GROUP_CODE_MAP.PRESSURE;

export default {
  name: "TacDetectionPressureCreateDialog",
  components: { TacDetectionModeSelect },
  inheritAttrs: false,
  props: {},
  data() {
    return {
      isSaving: false,
      pressMin: null,
      pressMinMeasure: null,
      pressMax: null,
      pressMaxMeasure: null,
      bpm: null,
      bpmMeasure: null,
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
    pressMinMeasureList() {
      return this.measureUnitConfig.filter(
        m => m.descrittore_codice === DESCRIPTOR_CODE_MAP.DIASTOLIC_PRESSURE
      );
    },
    pressMaxMeasureList() {
      return this.measureUnitConfig.filter(
        m => m.descrittore_codice === DESCRIPTOR_CODE_MAP.SYSTOLIC_PRESSURE
      );
    },
    bpmMeasureList() {
      return this.measureUnitConfig.filter(
        m => m.descrittore_codice === DESCRIPTOR_CODE_MAP.HEART_RATE
      );
    },
    isPressMinSelfSelectable() {
      return this.pressMinMeasureList.length === 1;
    },
    pressMinSelfSelectableValue() {
      return this.pressMinMeasureList[0]?.unita_misura_codice ?? null;
    },
    isPressMinSelfSelected() {
      return isNumber(this.pressMin) && this.isPressMinSelfSelectable;
    },
    isPressMaxSelfSelectable() {
      return this.pressMaxMeasureList.length === 1;
    },
    pressMaxSelfSelectableValue() {
      return this.pressMaxMeasureList[0]?.unita_misura_codice ?? null;
    },
    isPressMaxSelfSelected() {
      return isNumber(this.pressMax) && this.isPressMaxSelfSelectable;
    },
    isBpmSelfSelectable() {
      return this.bpmMeasureList.length === 1;
    },
    bpmSelfSelectableValue() {
      return this.bpmMeasureList[0]?.unita_misura_codice ?? null;
    },
    isBpmSelfSelected() {
      return isNumber(this.bpm) && this.isBpmSelfSelectable;
    },
    ruleRequired() {
      return v => !!v || "Campo obbligatorio";
    },
    rulePressMin() {
      return v => {
        // Prendiamo in considerazione il campo solo se è stata selezionata anche l'unità di misura
        if (this.pressMinMeasure) {
          if (!isNumber(v)) return "Campo obbligatorio";
        }

        return true;
      };
    },
    rulePressMinMeasure() {
      return v => {
        // Prendiamo in considerazione il campo solo se è stato inserito anche un valore
        if (isNumber(this.pressMin)) {
          if (!v) return "Campo obbligatorio";
        }

        return true;
      };
    },
    rulePressMax() {
      return v => {
        // Prendiamo in considerazione il campo solo se è stata selezionata anche l'unità di misura
        if (this.pressMaxMeasure) {
          if (!isNumber(v)) return "Campo obbligatorio";
        }

        return true;
      };
    },
    rulePressMaxMeasure() {
      return v => {
        // Prendiamo in considerazione il campo solo se è stato inserito anche un valore
        if (isNumber(this.pressMax)) {
          if (!v) return "Campo obbligatorio";
        }

        return true;
      };
    },
    ruleBpm() {
      return v => {
        // Prendiamo in considerazione il campo solo se è stata selezionata anche l'unità di misura
        if (this.bpmMeasure) {
          if (!isNumber(v)) return "Campo obbligatorio";
        }

        return true;
      };
    },
    ruleBpmMeasure() {
      return v => {
        // Prendiamo in considerazione il campo solo se è stato inserito anche un valore
        if (isNumber(this.bpm)) {
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
  watch: {
    pressMin: {
      immediate: false,
      handler(newValue, oldValue) {
        if (!this.isPressMinSelfSelectable) return;

        if (isNumber(newValue) && !isNumber(oldValue)) {
          this.pressMinMeasure = this.pressMinSelfSelectableValue;
          return;
        }

        if (!isNumber(newValue) && isNumber(oldValue)) {
          this.pressMinMeasure = null;
          return;
        }
      }
    },
    pressMax: {
      immediate: false,
      handler(newValue, oldValue) {
        if (!this.isPressMaxSelfSelectable) return;

        if (isNumber(newValue) && !isNumber(oldValue)) {
          this.pressMaxMeasure = this.pressMaxSelfSelectableValue;
          return;
        }

        if (!isNumber(newValue) && isNumber(oldValue)) {
          this.pressMaxMeasure = null;
          return;
        }
      }
    },
    bpm: {
      immediate: false,
      handler(newValue, oldValue) {
        if (!this.isBpmSelfSelectable) return;

        if (isNumber(newValue) && !isNumber(oldValue)) {
          this.bpmMeasure = this.bpmSelfSelectableValue;
          return;
        }

        if (!isNumber(newValue) && isNumber(oldValue)) {
          this.bpmMeasure = null;
          return;
        }
      }
    }
  },
  methods: {
    close() {
      this.$emit("input", false);
    },
    async onsubmit() {
      // Verifichiamo che almeno uno dei campi necessari sia stato precompilato
      let pressMin = this.pressMin && this.pressMinMeasure;
      let pressMax = this.pressMax && this.pressMaxMeasure;
      let bpm = this.bpm && this.bpmMeasure;

      if ((pressMin && !pressMax) || (!pressMin && pressMax)) {
        notifyError(
          "Pressione sistolica e diastolica devono essere compilate entrambe"
        );
        return;
      }

      if (!pressMin && !pressMax && !bpm) {
        notifyError(
          "Compila almeno Pressione sistolica e diastolica oppure la Frequenza cardiaca"
        );
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

      // Aggiungiamo Pressione minima solo se inserito dall'utente
      if (pressMin) {
        payload.lista.push({
          valore_numerico: this.pressMin,
          data: datetime,
          unita_misura_codice: this.pressMinMeasure,
          gruppo_codice: GROUP_CODE,
          descrittore_codice: DESCRIPTOR_CODE_MAP.DIASTOLIC_PRESSURE,
          modalita_codice: this.detectionModeCode
        });
      }

      // Aggiungiamo Pressione massima solo se inserito dall'utente
      if (pressMax) {
        payload.lista.push({
          valore_numerico: this.pressMax,
          data: datetime,
          unita_misura_codice: this.pressMaxMeasure,
          gruppo_codice: GROUP_CODE,
          descrittore_codice: DESCRIPTOR_CODE_MAP.SYSTOLIC_PRESSURE,
          modalita_codice: this.detectionModeCode
        });
      }

      // Aggiungiamo la Frequenza cardiaca solo se inserito dall'utente
      if (bpm) {
        payload.lista.push({
          valore_numerico: this.bpm,
          data: datetime,
          unita_misura_codice: this.bpmMeasure,
          gruppo_codice: GROUP_CODE,
          descrittore_codice: DESCRIPTOR_CODE_MAP.HEART_RATE,
          modalita_codice: this.detectionModeCode
        });
      }

      this.isSaving = true;

      try {
        let { data } = await createDetection(taxCode, notebookId, payload);

        // let map = DESCRIPTOR_CODE_MAP;
        // setLastSelectedMeasure(map.DIASTOLIC_PRESSURE, this.pressMinMeasure);
        // setLastSelectedMeasure(map.SYSTOLIC_PRESSURE, this.pressMaxMeasure);
        // setLastSelectedMeasure(map.HEART_RATE, this.bpmMeasure);

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
