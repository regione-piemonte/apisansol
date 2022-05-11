<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <span class="rol-report-amount-label">
    <template v-if="amount === null">
      (importo sconosciuto)
    </template>
    <template v-else> {{ amount | number }} &euro; </template>
  </span>
</template>

<script>
export default {
  name: "RolReportAmountLabel",
  props: {
    amount: { Type: [String, Number], required: false, default: null }
  }
};
</script>

<style lang="sass"></style>
