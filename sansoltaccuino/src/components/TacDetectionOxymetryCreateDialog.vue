<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-dialog
    v-bind="attrs"
    v-on="listeners"
    :maximized="$q.screen.lt.sm"
    class="tac-detection-oxymetry-create-dialog"
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
            Inserisci l'ossimetria rilevata
          </q-toolbar-title>

          <q-btn v-close-popup flat round dense icon="close" />
        </q-toolbar>

        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <div class="row q-col-gutter-md">
                <div class="col">
                  <q-input
                    type="number"
                    v-model.number="oxymetry"
                    label="Ossimetria"
                    required
                    :rules="[ruleRequired]"
                    no-error-icon
                    class="tac-input--text-right"
                  >
                    <template v-if="isOxymetrySelfSelectable" #after>
                      <div class="text-body1 text-black text-bold self-end">
                        {{ oxymetrySelfSelectableValue }}
                      </div>
                    </template>
                  </q-input>
                </div>

                <template v-if="!isOxymetrySelfSelectable">
                  <div class="col-12 col-sm-6 col-md-4">
                    <q-select
                      v-model="oxymetryMeasure"
                      :options="oxymetryMeasureList"
                      label="Unità di misura"
                      option-value="unita_misura_codice"
                      option-label="unita_misura_codice"
                      emit-value
                      map-options
                      required
                      :rules="[ruleRequired]"
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
  import {apiErrorNotify, apiErrorNotifyDialog, isNumber} from "../services/utils";
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
const GROUP_CODE = GROUP_CODE_MAP.OXYMETRY;

export default {
  name: "TacDetectionOxymetryCreateDialog",
  components: { TacDetectionModeSelect },
  inheritAttrs: false,
  props: {},
  data() {
    return {
      isSaving: false,
      oxymetry: null,
      oxymetryMeasure: null,
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
    oxymetryMeasureList() {
      return this.measureUnitConfig.filter(
        m => m.descrittore_codice === DESCRIPTOR_CODE_MAP.OXYMETRY
      );
    },
    isOxymetrySelfSelectable() {
      return this.oxymetryMeasureList.length === 1;
    },
    oxymetrySelfSelectableValue() {
      return this.oxymetryMeasureList[0]?.unita_misura_codice ?? null;
    },
    isOxymetrySelfSelected() {
      return isNumber(this.oxymetry) && this.isOxymetrySelfSelectable;
    },
    ruleRequired() {
      return v => !!v || "Campo obbligatorio";
    }
  },
  created() {
    let now = new Date();
    this.date = formatDate(now, "YYYY-MM-DD");
    this.time = formatDate(now, "HH:mm");


    if (this.oxymetryMeasureList?.length === 1) {
      this.oxymetryMeasure = this.oxymetryMeasureList[0]?.unita_misura_codice;
    }
  },
  watch: {
    oxymetry: {
      immediate: false,
      handler(newValue, oldValue) {
        if (!this.isOxymetrySelfSelectable) return;

        if (isNumber(newValue) && !isNumber(oldValue)) {
          this.oxymetryMeasure = this.oxymetrySelfSelectableValue;
          return;
        }

        if (!isNumber(newValue) && isNumber(oldValue)) {
          this.oxymetryMeasure = null;
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
      let taxCode = this.$store.getters["getTaxCode"];
      let notebookId = this.notebook?.id;
      let datetime = extractDate(
        `${this.date} ${this.time}`,
        "YYYY-MM-DD HH:mm"
      );

      let payload = {
        // gruppo_codice: GROUP_CODE,
        lista: [
          {
            valore_numerico: this.oxymetry,
            data: datetime,
            unita_misura_codice: this.oxymetryMeasure,
            gruppo_codice: GROUP_CODE,
            descrittore_codice: DESCRIPTOR_CODE_MAP.OXYMETRY,
            modalita_codice: this.detectionModeCode
          }
        ]
      };

      this.isSaving = true;

      try {
        let { data } = await createDetection(taxCode, notebookId, payload);

        // let map = DESCRIPTOR_CODE_MAP;
        // setLastSelectedMeasure(map.OXYMETRY, this.oxymetryMeasure);

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
