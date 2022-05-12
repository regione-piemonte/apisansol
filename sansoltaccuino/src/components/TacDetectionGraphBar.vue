<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <the-graph-bar
    :chart-data="chartData"
    :options="chartOptions"
    :height="height"
    class="tac-detection-graph-bar"
  />
</template>

<script>
import { date } from "quasar";
import TheGraphBar from "./TheGraphBar";

const { formatDate } = date;

const DEFAULT_OPTIONS = {
  legend: { display: false },
  tooltips: { enabled: true },
  animation: { duration: 0 },
  hover: { animationDuration: 0 },
  responsiveAnimationDuration: 0,
  maintainAspectRatio: false,
  scales: {
    xAxes: [
      {
        gridLines: { drawOnChartArea: false }
      }
    ],
    yAxes: [
      {
        gridLines: { drawOnChartArea: false },
        ticks: { display: false }
      }
    ]
  },
  plugins: {
    datalabels: {
      color: "black",
      anchor: "center",
      align: "end",
      clamp: true,
      font: { weight: "bold" }
    }
  }
};

export default {
  name: "TacDetectionGraphBar",
  components: { TheGraphBar },
  props: {
    detectionList: { type: Array, required: false, default: () => [] },
    startDate: { type: String, required: false, default: null },
    endDate: { type: String, required: false, default: null },
    barColor: { type: String, required: false, default: "green" },
    height: { type: Number, required: false, default: 300 }
  },
  computed: {
    selectedIntervalDayListFormatted() {
      return this.detectionList.map(d => formatDate(d.data, "DD MMM YYYY HH:mm"));
    },
    chartData() {
      let data = this.detectionList;

      data = data.map(d => d?.valore_numerico ?? null);

      return {
        labels: this.selectedIntervalDayListFormatted,
        datasets: [{ data, backgroundColor: this.barColor }]
      };
    },
    chartOptions() {
      return DEFAULT_OPTIONS;
    }
  }
};
</script>

<style lang="sass"></style>
