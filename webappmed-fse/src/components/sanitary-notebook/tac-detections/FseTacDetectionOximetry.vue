<!--
 SPDX-License-Identifier: EUPL-1.2
 Copyright Regione Piemonte - 2023
-->

<template>
  <div>
    <!-- VISUALIZZAZIONE GRAFICO -->
    <!-- ----------------------------------------------------------------------------------------------------- -->
    <div v-if="visualization === VISUALIZATION_MAP.GRAPH">
      <q-card v-if="detectionListGroupedByMeasure">
        <q-card-section
          v-for="([measure, list], index) in detectionListGroupedByMeasure"
          :key="'weight--' + measure"
        >
          <div class="text-h6 text-bold">Ossimetria - {{ measure }}</div>

          <tac-detection-graph-line-single
            :detection-list="list"
            color="#f2cb05"
            class="q-mt-md"
          />

          <q-separator
            class="q-mt-xl q-mb-sm"
            v-if="index < detectionListGroupedByMeasure.length - 1"
          />
        </q-card-section>
      </q-card>
    </div>

    <!-- VISUALIZZAZIONE TABELLA -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <div v-if="visualization === VISUALIZATION_MAP.TABLE">
      <fse-tac-detection-list-table :detection-list="detectionList" />
    </div>
  </div>
</template>

<script>
import { VISUALIZATION_MAP } from "src/services/sanitary-notebook/config";
import FseTacDetectionListTable from "components/sanitary-notebook/tac-detections/FseTacDetectionListTable";
import { getDetectionEntryListByMeasure } from "src/services/sanitary-notebook/business-logic";
import TacDetectionGraphLineSingle from "components/sanitary-notebook/tac-detections/TacDetectionGraphLineSingle";

export default {
  name: "FseTacDetectionOximetry",
  components: { TacDetectionGraphLineSingle, FseTacDetectionListTable },
  props: {
    visualization: { type: Number, default: 1 },
    startDate: { type: [Date, String], default: null },
    endDate: { type: [Date, String], default: null },
  },
  data() {
    return {
      VISUALIZATION_MAP,
      detectionList: [],
    };
  },
  computed: {
    detectionListGroupedByMeasure() {
      return getDetectionEntryListByMeasure(this.detectionList);
    },
  },
  created() {},
};
</script>

<style scoped></style>
