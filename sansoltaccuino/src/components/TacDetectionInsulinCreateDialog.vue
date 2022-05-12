<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-dialog
    v-bind="attrs"
    v-on="listeners"
    :maximized="$q.screen.lt.sm"
    class="tac-detection-insulin-create-dialog"
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
            Inserisci i valori di insulina
          </q-toolbar-title>

          <q-btn v-close-popup flat round dense icon="close" />
        </q-toolbar>

        <q-card-section>
          <!-- INSULINA -->
          <!-- ----------------------------------------------------------------------------------------------------- -->
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <div class="row q-col-gutter-md">
                <div class="col">
                  <q-input
                    type="number"
                    v-model.number="insulin"
                    label="Insulina"
                    required
                    :rules="[ruleRequired]"
                    no-error-icon
                    class="tac-input--text-right"
                  >
                    <template v-if="isInsulinSelfSelectable" #after>
                      <div class="text-body1 text-black text-bold self-end">
                        {{ insulinSelfSelectableValue }}
                      </div>
                    </template>
                  </q-input>
                </div>

                <template v-if="!isInsulinSelfSelectable">
                  <div class="col-12 col-sm-6 col-md-4">
                    <q-select
                      v-model="insulinMeasure"
                      :options="insulinMeasureList"
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

            <!-- INSULINA FARM -->
            <!-- --------------------------------------------------------------------------------------------------- -->
            <div class="col-12">
              <div class="row q-col-gutter-md">
                <div class="col">
                  <q-input
                    type="text"
                    v-model.trim="insulinFarm"
                    label="Farmaco"
                    required
                    :rules="[ruleRequired]"
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
import { apiErrorNotifyDialog, isNumber } from "../services/utils";
import { createDetection } from "../services/api";
import {
  DESCRIPTOR_CODE_MAP,
  DETECTION_MODE_CODE_MAP,
  GROUP_CODE_MAP
} from "../services/config";
import TacDetectionModeSelect from "./TacDetectionModeSelect";
import { date } from "quasar";

const { formatDate, extractDate } = date;
const GROUP_CODE = GROUP_CODE_MAP.INSULIN;

export default {
  name: "TacDetectionInsulinCreateDialog",
  components: { TacDetectionModeSelect },
  inheritAttrs: false,
  props: {},
  data() {
    return {
      isSaving: false,
      insulin: null,
      insulinMeasure: null,
      insulinFarm: "",
      // insulinFarmMeasure: null,
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
    insulinMeasureList() {
      return this.measureUnitConfig.filter(
        m => m.descrittore_codice === DESCRIPTOR_CODE_MAP.INSULIN
      );
    },
    // insulinFarmMeasureList() {
    //   return this.measureUnitConfig.filter(
    //     m => m.descrittore_codice === DESCRIPTOR_CODE_MAP.INSULIN_FARM
    //   );
    // },
    isInsulinSelfSelectable() {
      return this.insulinMeasureList.length === 1;
    },
    insulinSelfSelectableValue() {
      return this.insulinMeasureList[0]?.unita_misura_codice ?? null;
    },
    isInsulinSelfSelected() {
      return isNumber(this.insulin) && this.isInsulinSelfSelectable;
    },
    ruleRequired() {
      return v => !!v || "Campo obbligatorio";
    }
  },
  created() {
    let now = new Date();
    this.date = formatDate(now, "YYYY-MM-DD");
    this.time = formatDate(now, "HH:mm");



    if (this.insulinMeasureList?.length === 1) {
      this.insulinMeasure = this.insulinMeasureList[0]?.unita_misura_codice;
    }


  },
  watch: {
    insulin: {
      immediate: false,
      handler(newValue, oldValue) {
        if (!this.isInsulinSelfSelectable) return;

        if (isNumber(newValue) && !isNumber(oldValue)) {
          this.insulinMeasure = this.insulinSelfSelectableValue;
          return;
        }

        if (!isNumber(newValue) && isNumber(oldValue)) {
          this.insulinMeasure = null;
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
        lista: []
      };

      // Aggiungiamo Insulina solo se inserito dall'utente
      // if (insulin) {
      payload.lista.push({
        valore_numerico: this.insulin,
        data: datetime,
        unita_misura_codice: this.insulinMeasure,
        gruppo_codice: GROUP_CODE,
        descrittore_codice: DESCRIPTOR_CODE_MAP.INSULIN,
        modalita_codice: this.detectionModeCode
      });
      // }

      // Aggiungiamo Insulina FARM solo se inserito dall'utente
      // if (insulinFarm) {
      payload.lista.push({
        data: datetime,
        valore_testuale: this.insulinFarm,
        // valore_numerico: this.insulinFarm,
        // unita_misura_codice: this.insulinFarmMeasure,
        gruppo_codice: GROUP_CODE,
        descrittore_codice: DESCRIPTOR_CODE_MAP.INSULIN_FARM,
        modalita_codice: this.detectionModeCode
      });
      // }

      this.isSaving = true;

      try {
        let { data } = await createDetection(taxCode, notebookId, payload);

        // let map = DESCRIPTOR_CODE_MAP;
        // setLastSelectedMeasure(map.INSULIN, this.insulinMeasure);
        // setLastSelectedMeasure(map.INSULIN_FARM, this.insulinFarmMeasure);

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
