<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <span class="covid-swab-result-label" :class="classes">
    <slot>
      {{ label | empty }}
    </slot>
  </span>
</template>

<script>
export default {
  name: "CovidSwabScreenResultLabel",
  props: {
    code: { type: String, required: false, default: null },
    bold: { type: Boolean, required: false, default: false },
  },
  computed: {
    code_() {
      return this.code || this.$c.SWAB_SCREEN_RESULT_STATUS_MAP.PENDING;
    },
    label() {
      return this.$c.SWAB_SCREEN_RESULT_STATUS_LABEL_MAP[this.code_];
    },
    classes() {
      let result = [];
      let statuss = this.$c.SWAB_SCREEN_RESULT_STATUS_MAP;

      if (this.code_ === statuss.PENDING) {
        result.push("text-info");
      } else if (this.code_ === statuss.POSITIVE) {
        result.push("bg-red-8");
        result.push("text-white");
      } else if (this.code_ === statuss.NEGATIVE) {
        result.push("bg-green-9");
        result.push("text-white");
      } else if (this.code_ === statuss.UNKNOWN) {
        result.push("bg-warning");
      }

      if (this.bold) result.push("text-weight-bold");

      return result;
    },
  },
};
</script>

<style scoped></style>
