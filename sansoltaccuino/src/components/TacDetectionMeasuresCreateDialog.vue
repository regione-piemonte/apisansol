<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-dialog
    v-bind="attrs"
    v-on="listeners"
    :maximized="$q.screen.lt.sm"
    class="tac-detection-measures-create-dialog"
  >
    <q-card style="max-width: 800px">
      <q-form
        novalidate
        greedy
        @submit="onsubmit"
        class="column"
        style="min-height: 100%"
      >
        <q-toolbar>
          <q-toolbar-title>
            Inserisci la tua altezza, peso e circonferenza vita
          </q-toolbar-title>

          <q-btn v-close-popup flat round dense icon="close" />
        </q-toolbar>

        <q-card-section>
          <div class="row q-col-gutter-md">
            <!-- ALTEZZA -->
            <!-- --------------------------------------------------------------------------------------------------- -->
            <div class="col-12">
              <div class="row q-col-gutter-md">
                <div class="col">
                  <q-input
                    type="number"
                    v-model.number="height"
                    label="Altezza"
                    :min="HEIGHT_MIN"
                    :max="HEIGHT_MAX"
                    :step="HEIGHT_STEP"
                    :rules="[ruleHeight]"
                    no-error-icon
                    clearable
                    class="tac-input--text-right"
                  >
                    <template v-if="isHeightSelfSelectable" #after>
                      <div class="text-body1 text-black text-bold self-end">
                        {{ heightSelfSelectableValue }}
                      </div>
                    </template>
                  </q-input>
                </div>

                <template v-if="!isHeightSelfSelectable">
                  <div class="col-12 col-sm-6 col-md-4">
                    <q-select
                      v-model="heightMeasure"
                      :options="heightMeasureList"
                      label="Unità di misura"
                      option-value="unita_misura_codice"
                      option-label="unita_misura_codice"
                      emit-value
                      map-options
                      :rules="[ruleHeightMeasure]"
                      no-error-icon
                    />
                  </div>
                </template>
              </div>
            </div>

            <!-- PESO -->
            <!-- --------------------------------------------------------------------------------------------------- -->
            <div class="col-12">
              <div class="row q-col-gutter-md">
                <div class="col">
                  <q-input
                    type="number"
                    v-model.number="weight"
                    label="Peso"
                    :min="WEIGHT_MIN"
                    :max="WEIGHT_MAX"
                    :step="WEIGHT_STEP"
                    :rules="[ruleWeight]"
                    no-error-icon
                    clearable
                    class="tac-input--text-right"
                  >
                    <template v-if="isWeightSelfSelectable" #after>
                      <div class="text-body1 text-black text-bold self-end">
                        {{ weightSelfSelectableValue }}
                      </div>
                    </template>
                  </q-input>
                </div>

                <template v-if="!isWeightSelfSelectable">
                  <div class="col-12 col-sm-6 col-md-4">
                    <q-select
                      v-model="weightMeasure"
                      :options="weightMeasureList"
                      label="Unità di misura"
                      option-value="unita_misura_codice"
                      option-label="unita_misura_codice"
                      emit-value
                      map-options
                      :rules="[ruleWeightMeasure]"
                      no-error-icon
                    />
                  </div>
                </template>
              </div>
            </div>

            <!-- CIRCONFERENZA -->
            <!-- --------------------------------------------------------------------------------------------------- -->
            <div class="col-12">
              <div class="row q-col-gutter-md">
                <div class="col">
                  <q-input
                    type="number"
                    v-model.number="circumference"
                    label="Circonferenza vita"
                    :min="CIRCUMFERENCE_MIN"
                    :max="CIRCUMFERENCE_MAX"
                    :step="CIRCUMFERENCE_STEP"
                    :rules="[ruleCircumference]"
                    no-error-icon
                    clearable
                    class="tac-input--text-right"
                  >
                    <template v-if="isCircumferenceSelfSelectable" #after>
                      <div class="text-body1 text-black text-bold self-end">
                        {{ circumferenceSelfSelectableValue }}
                      </div>
                    </template>
                  </q-input>
                </div>

                <template v-if="!isCircumferenceSelfSelectable">
                  <div class="col-12 col-sm-6 col-md-4">
                    <q-select
                      v-model="circumferenceMeasure"
                      :options="circumferenceMeasureList"
                      label="Unità di misura"
                      option-value="unita_misura_codice"
                      option-label="unita_misura_codice"
                      emit-value
                      map-options
                      :rules="[ruleCircumferenceMeasure]"
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
import { apiErrorNotifyDialog, isNumber, notifyError } from "../services/utils";
import { createDetection } from "../services/api";
import {
  DESCRIPTOR_CODE_MAP,
  DETECTION_MODE_CODE_MAP,
  GROUP_CODE_MAP
} from "../services/config";
import TacDetectionModeSelect from "./TacDetectionModeSelect";
import { date } from "quasar";

const { formatDate, extractDate } = date;
const GROUP_CODE = GROUP_CODE_MAP.WEIGHT;

const HEIGHT_MIN = 0;
const HEIGHT_MAX = 9999;
const HEIGHT_STEP = 0.1;

const WEIGHT_MIN = 0;
const WEIGHT_MAX = 9999;
const WEIGHT_STEP = 0.1;

const CIRCUMFERENCE_MIN = 0;
const CIRCUMFERENCE_MAX = 9999;
const CIRCUMFERENCE_STEP = 0.1;

export default {
  name: "TacDetectionMeasuresCreateDialog",
  components: { TacDetectionModeSelect },
  inheritAttrs: false,
  props: {},
  data() {
    return {
      HEIGHT_MIN,
      HEIGHT_MAX,
      HEIGHT_STEP,
      WEIGHT_MIN,
      WEIGHT_MAX,
      WEIGHT_STEP,
      CIRCUMFERENCE_MIN,
      CIRCUMFERENCE_MAX,
      CIRCUMFERENCE_STEP,
      isSaving: false,
      height: null,
      heightMeasure: null,
      weight: null,
      weightMeasure: null,
      circumference: null,
      circumferenceMeasure: null,
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
    heightMeasureList() {
      return this.measureUnitConfig.filter(
        m => m.descrittore_codice === DESCRIPTOR_CODE_MAP.HEIGHT
      );
    },
    weightMeasureList() {
      return this.measureUnitConfig.filter(
        m => m.descrittore_codice === DESCRIPTOR_CODE_MAP.WEIGHT
      );
    },
    circumferenceMeasureList() {
      return this.measureUnitConfig.filter(
        m => m.descrittore_codice === DESCRIPTOR_CODE_MAP.WAIST_CIRC
      );
    },
    isHeightSelfSelectable() {
      return this.heightMeasureList.length === 1;
    },
    heightSelfSelectableValue() {
      return this.heightMeasureList[0]?.unita_misura_codice ?? null;
    },
    isHeightSelfSelected() {
      return isNumber(this.height) && this.isHeightSelfSelectable;
    },
    isWeightSelfSelectable() {
      return this.weightMeasureList.length === 1;
    },
    weightSelfSelectableValue() {
      return this.weightMeasureList[0]?.unita_misura_codice ?? null;
    },
    isWeightSelfSelected() {
      return isNumber(this.weight) && this.isWeightSelfSelectable;
    },
    isCircumferenceSelfSelectable() {
      return this.circumferenceMeasureList.length === 1;
    },
    circumferenceSelfSelectableValue() {
      return this.circumferenceMeasureList[0]?.unita_misura_codice ?? null;
    },
    isCircumferenceSelfSelected() {
      return isNumber(this.circumference) && this.isCircumferenceSelfSelectable;
    },
    ruleRequired() {
      return v => !!v || "Campo obbligatorio";
    },
    ruleHeight() {
      return v => {
        // Prendiamo in considerazione il campo solo se è stata selezionata anche l'unità di misura
        if (this.heightMeasure) {
          if (!isNumber(v)) return "Campo obbligatorio";

          if (!(v >= HEIGHT_MIN && v <= HEIGHT_MAX)) {
            return `Deve essere compreso tra ${HEIGHT_MIN} e ${HEIGHT_MAX}`;
          }
        }

        return true;
      };
    },
    ruleHeightMeasure() {
      return v => {
        // Prendiamo in considerazione il campo solo se è stato inserito anche un valore
        if (isNumber(this.height)) {
          if (!v) return "Campo obbligatorio";
        }

        return true;
      };
    },
    ruleWeight() {
      return v => {
        // Prendiamo in considerazione il campo solo se è stata selezionata anche l'unità di misura
        if (this.weightMeasure) {
          if (!isNumber(v)) return "Campo obbligatorio";

          if (!(v >= WEIGHT_MIN && v <= WEIGHT_MAX)) {
            return `Deve essere compreso tra ${WEIGHT_MIN} e ${WEIGHT_MAX}`;
          }
        }

        return true;
      };
    },
    ruleWeightMeasure() {
      return v => {
        // Prendiamo in considerazione il campo solo se è stato inserito anche un valore
        if (isNumber(this.weight)) {
          if (!v) return "Campo obbligatorio";
        }

        return true;
      };
    },
    ruleCircumference() {
      return v => {
        // Prendiamo in considerazione il campo solo se è stata selezionata anche l'unità di misura
        if (this.circumferenceMeasure) {
          if (!isNumber(v)) return "Campo obbligatorio";

          if (!(v >= CIRCUMFERENCE_MIN && v <= CIRCUMFERENCE_MAX)) {
            return `Deve essere compreso tra ${CIRCUMFERENCE_MIN} e ${CIRCUMFERENCE_MAX}`;
          }
        }

        return true;
      };
    },
    ruleCircumferenceMeasure() {
      return v => {
        // Prendiamo in considerazione il campo solo se è stato inserito anche un valore
        if (isNumber(this.circumference)) {
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
    height: {
      immediate: false,
      handler(newValue, oldValue) {
        if (!this.isHeightSelfSelectable) return;

        if (isNumber(newValue) && !isNumber(oldValue)) {
          this.heightMeasure = this.heightSelfSelectableValue;
          return;
        }

        if (!isNumber(newValue) && isNumber(oldValue)) {
          this.heightMeasure = null;
          return;
        }
      }
    },
    weight: {
      immediate: false,
      handler(newValue, oldValue) {
        if (!this.isWeightSelfSelectable) return;

        if (isNumber(newValue) && !isNumber(oldValue)) {
          this.weightMeasure = this.weightSelfSelectableValue;
          return;
        }

        if (!isNumber(newValue) && isNumber(oldValue)) {
          this.weightMeasure = null;
          return;
        }
      }
    },
    circumference: {
      immediate: false,
      handler(newValue, oldValue) {
        if (!this.isCircumferenceSelfSelectable) return;

        if (isNumber(newValue) && !isNumber(oldValue)) {
          this.circumferenceMeasure = this.circumferenceSelfSelectableValue;
          return;
        }

        if (!isNumber(newValue) && isNumber(oldValue)) {
          this.circumferenceMeasure = null;
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
      let height = this.height && this.heightMeasure;
      let weight = this.weight && this.weightMeasure;
      let circumference = this.circumference && this.circumferenceMeasure;
      if (!height && !weight && !circumference) {
        notifyError(
          "Compila almeno una tra Altezza, Peso e Circonferenza vita"
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

      // Aggiungiamo Altezza solo se inserito dall'utente
      if (height) {
        payload.lista.push({
          valore_numerico: this.height,
          data: datetime,
          unita_misura_codice: this.heightMeasure,
          gruppo_codice: GROUP_CODE,
          descrittore_codice: DESCRIPTOR_CODE_MAP.HEIGHT,
          modalita_codice: this.detectionModeCode
        });
      }

      // Aggiungiamo Peso solo se inserito dall'utente
      if (weight) {
        payload.lista.push({
          valore_numerico: this.weight,
          data: datetime,
          unita_misura_codice: this.weightMeasure,
          gruppo_codice: GROUP_CODE,
          descrittore_codice: DESCRIPTOR_CODE_MAP.WEIGHT,
          modalita_codice: this.detectionModeCode
        });
      }

      // Aggiungiamo Circonferenza solo se inserito dall'utente
      if (circumference) {
        payload.lista.push({
          valore_numerico: this.circumference,
          data: datetime,
          unita_misura_codice: this.circumferenceMeasure,
          gruppo_codice: GROUP_CODE,
          descrittore_codice: DESCRIPTOR_CODE_MAP.WAIST_CIRC,
          modalita_codice: this.detectionModeCode
        });
      }

      this.isSaving = true;

      try {
        let { data } = await createDetection(taxCode, notebookId, payload);

        // let map = DESCRIPTOR_CODE_MAP;
        // setLastSelectedMeasure(map.HEIGHT, this.heightMeasure);
        // setLastSelectedMeasure(map.WEIGHT, this.weightMeasure);
        // setLastSelectedMeasure(map.WAIST_CIRC, this.circumferenceMeasure);

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
