<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-icon
    :name="icon"
    size="lg"
    v-bind="attrs"
    v-on="listeners"
    class="rol-report-type-icon"
  />
</template>

<script>
import { REPORT_TYPE_MAP } from "src/services/config";

const ICON_STETHOSCOPE = "img:/statics/la-mia-salute/icone/stetoscopio.svg";
const ICON_MICROSCOPE = "img:/statics/la-mia-salute/icone/microscopio.svg";
const ICON_RADIOGRAPHY = "img:/statics/la-mia-salute/icone/radiografia.svg";
const ICON_FALLBACK = ICON_STETHOSCOPE;

const TYPE_2_ICON = {
  [REPORT_TYPE_MAP.VERBAL]: ICON_FALLBACK,
  [REPORT_TYPE_MAP.TRIAGE]: ICON_FALLBACK,
  [REPORT_TYPE_MAP.REPORT]: ICON_MICROSCOPE,
  [REPORT_TYPE_MAP.HISTORY]: ICON_FALLBACK,
  [REPORT_TYPE_MAP.SDO]: ICON_FALLBACK,
  [REPORT_TYPE_MAP.DISCHARGE]: ICON_FALLBACK,
  [REPORT_TYPE_MAP.CYCLE_REPORT]: ICON_MICROSCOPE,
  [REPORT_TYPE_MAP.OPERATIVE_ACT]: ICON_FALLBACK,
  [REPORT_TYPE_MAP.LIS_REPORT]: ICON_MICROSCOPE,
  [REPORT_TYPE_MAP.RADIOLOGY_REPORT]: ICON_RADIOGRAPHY,
  [REPORT_TYPE_MAP.PATHOLOGICAL_ANATOMY_REPORT]: ICON_MICROSCOPE,
  [REPORT_TYPE_MAP.DISCHARGE_LETTER]: ICON_FALLBACK,
  [REPORT_TYPE_MAP.FIRST_AID_REPORT]: ICON_FALLBACK,
  [REPORT_TYPE_MAP.LAB_REPORT]: ICON_MICROSCOPE,
  [REPORT_TYPE_MAP.RADIOLOGY_REPORT_2]: ICON_RADIOGRAPHY,
  [REPORT_TYPE_MAP.PATHOLOGICAL_ANATOMY_REPORT_2]: ICON_MICROSCOPE,
  [REPORT_TYPE_MAP.SPECIALIZED_REPORT]: ICON_MICROSCOPE
};

export default {
  name: "RolReportTypeIcon",
  inheritAttrs: false,
  props: {
    type: { type: [String, Number], required: true }
  },
  computed: {
    attrs() {
      const { name, ...attrs } = this.$attrs;
      return attrs;
    },
    listeners() {
      const { ...listeners } = this.$listeners;
      return listeners;
    },
    icon() {
      let type = this.type?.toString() ?? null;
      return TYPE_2_ICON[type] ?? ICON_FALLBACK;
    }
  }
};
</script>

<style lang="sass"></style>
