<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <the-graph-line
    :chart-data="chartData"
    :options="chartOptions"
    :height="height"
    class="tac-detection-graph-line-single"
  />
</template>

<script>
import TheGraphLine from "./TheGraphLine";
import { orderBy } from "../services/utils";
import { getDetectionDatasetPointList } from "../services/business-logic";
import { date } from "quasar";

const { formatDate } = date;

export default {
  name: "TacDetectionGraphLineSingle",
  components: { TheGraphLine },
  props: {
    detectionList: { type: Array, required: false, default: () => [] },
    height: { type: Number, required: false, default: 300 },
    color: { type: String, required: false, default: "green" }
  },
  computed: {
    chartData() {
      let labelList = orderBy(this.detectionList, ["data"], ["asc"]);
      labelList = labelList.map(d => formatDate(d.data, "DD MMM YYYY HH:mm"));
      labelList = [...new Set(labelList)];

      let datasetList = [
        {
          // label: `Trigliceridi - ${key}`,
          data: getDetectionDatasetPointList(this.detectionList),
          backgroundColor: this.color,
          borderColor: this.color,
          lineTension: 0,
          fill: false,
          spanGaps: true
        }
      ];

      return {
        labels: labelList,
        datasets: datasetList
      };
    },
    chartOptions() {
      let result = {
        legend: { display: false },
        tooltips: { enabled: true },
        animation: { duration: 0 },
        hover: { animationDuration: 0 },
        responsiveAnimationDuration: 0,
        maintainAspectRatio: false

      };

      if (this.legend) {
        result.legend = {
          display: true,
          position: "top",
          align: "center",
          labels: { usePointStyle: true, padding: 16 }
        };
      }

      return result;
    }
  }
};
</script>

<style lang="sass"></style>
