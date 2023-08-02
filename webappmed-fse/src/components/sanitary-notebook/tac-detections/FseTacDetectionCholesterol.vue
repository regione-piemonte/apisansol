<!--
 SPDX-License-Identifier: EUPL-1.2
 Copyright Regione Piemonte - 2023
-->

<template>
  <div>
    <!-- VISUALIZZAZIONE GRAFICO -->
    <!-- ----------------------------------------------------------------------------------------------------- -->
    <div v-if="visualization === VISUALIZATION_MAP.GRAPH">
      <q-card>
        <q-card-section
          v-for="([measure, list], index) in detectionTotListGroupedByMeasure"
          :key="'weight--' + measure"
        >
          <div class="text-bold text-h6">TOT - {{ measure }}</div>

          <tac-detection-graph-line-single
            :detection-list="list"
            color="#00a120"
            class="q-mt-md"
          />

          <q-separator
            class="q-mt-xl q-mb-sm"
            v-if="index < detectionTotListGroupedByMeasure.length - 1"
          />
        </q-card-section>
        <q-separator inset spaced />
        <q-card-section
          v-for="([measure, list], index) in detectionHdlListGroupedByMeasure"
          :key="'hdl--' + measure"
        >
          <div class="text-bold text-h6">HDL - {{ measure }}</div>

          <tac-detection-graph-line-single
            :detection-list="list"
            color="#f2cb05"
            class="q-mt-md"
          />

          <q-separator
            class="q-mt-xl q-mb-sm"
            v-if="index < detectionHdlListGroupedByMeasure.length - 1"
          />
        </q-card-section>

        <q-separator inset spaced />

        <q-card-section
          v-for="([measure, list], index) in detectionLdlListGroupedByMeasure"
          :key="'ldl--' + measure"
        >
          <div class="text-bold text-h6">LDL - {{ measure }}</div>

          <tac-detection-graph-line-single
            :detection-list="list"
            color="#d68800"
            class="q-mt-md"
          />

          <q-separator
            class="q-mt-xl q-mb-sm"
            v-if="index < detectionLdlListGroupedByMeasure.length - 1"
          />
        </q-card-section>

        <q-separator inset spaced />

        <q-card-section
          v-for="(
            [measure, list], index
          ) in detectionTriglyceridesListGroupedByMeasure"
          :key="'triglycerides--' + measure"
        >
          <div class="text-bold text-h6">Trigliceridi - {{ measure }}</div>

          <tac-detection-graph-line-single
            :detection-list="list"
            color="#00a120"
            class="q-mt-md"
          />

          <q-separator
            class="q-mt-xl q-mb-sm"
            v-if="index < detectionTriglyceridesListGroupedByMeasure.length - 1"
          />
        </q-card-section>
      </q-card>
    </div>

    <!-- VISUALIZZAZIONE TABELLA -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <div
      v-if="visualization === VISUALIZATION_MAP.TABLE"
      class="column q-gutter-md"
    >
      <q-card>
        <q-expansion-item default-opened>
          <template #header>
            <q-item-section class="text-h6 text-bold"> TOT </q-item-section>
          </template>

          <fse-tac-detection-list-table :detection-list="detectionTotList" />
        </q-expansion-item>
      </q-card>

      <q-card>
        <q-expansion-item default-opened>
          <template #header>
            <q-item-section class="text-h6 text-bold"> HDL </q-item-section>
          </template>

          <fse-tac-detection-list-table :detection-list="detectionHdlList" />
        </q-expansion-item>
      </q-card>

      <q-card>
        <q-expansion-item default-opened>
          <template #header>
            <q-item-section class="text-h6 text-bold"> LDL </q-item-section>
          </template>

          <fse-tac-detection-list-table :detection-list="detectionLdlList" />
        </q-expansion-item>
      </q-card>

      <q-card>
        <q-expansion-item default-opened>
          <template #header>
            <q-item-section class="text-h6 text-bold">
              Trigliceridi
            </q-item-section>
          </template>

          <fse-tac-detection-list-table
            :detection-list="detectionTriglyceridesList"
          />
        </q-expansion-item>
      </q-card>
    </div>
  </div>
</template>

<script>
import { VISUALIZATION_MAP } from "src/services/sanitary-notebook/config";
import FseTacDetectionListTable from "components/sanitary-notebook/tac-detections/FseTacDetectionListTable";
import { getDetectionEntryListByMeasure } from "src/services/sanitary-notebook/business-logic";
import TacDetectionGraphLineSingle from "components/sanitary-notebook/tac-detections/TacDetectionGraphLineSingle";

export default {
  name: "FseTacDetectionCholesterol",
  components: { TacDetectionGraphLineSingle, FseTacDetectionListTable },
  props: {
    visualization: { type: Number, default: 1 },
    startDate: { type: [Date, String], default: null },
    endDate: { type: [Date, String], default: null },
  },
  data() {
    return {
      VISUALIZATION_MAP,
      detectionTotList: [],
      detectionHdlList: [],
      detectionLdlList: [],
      detectionTriglyceridesList: [],
    };
  },
  computed: {
    detectionTotListGroupedByMeasure() {
      return getDetectionEntryListByMeasure(this.detectionTotList);
    },
    detectionHdlListGroupedByMeasure() {
      return getDetectionEntryListByMeasure(this.detectionHdlList);
    },
    detectionLdlListGroupedByMeasure() {
      return getDetectionEntryListByMeasure(this.detectionLdlList);
    },
    detectionTriglyceridesListGroupedByMeasure() {
      return getDetectionEntryListByMeasure(this.detectionTriglyceridesList);
    },
  },
  created() {},
};
</script>

<style scoped></style>
