<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <span class="covid-swab-type-label">
    <slot>
      {{ label | empty }}
    </slot>
  </span>
</template>

<script>
export default {
  name: "CovidSwabTypeLabel",
  props: {
    code: { type: String, required: false, default: null },
  },
  computed: {
    label() {
      if (this.code === this.$c.SWAB_TYPE_CODE_MAP.FAST_A) {
        return "Tampone rapido";
      }

      if (this.code === this.$c.SWAB_TYPE_CODE_MAP.FAST_B) {
        return "Tampone rapido";
      }

      if (this.code === this.$c.SWAB_TYPE_CODE_MAP.SEROLOGICAL) {
        return "Test sierologico";
      }

      if (this.code === this.$c.SWAB_TYPE_CODE_MAP.SALIVARY) {
        return "Tampone salivare";
      }

      return "Tampone molecolare";
    },
  },
};
</script>

<style scoped></style>
