<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="rol-report-health-care-list-item">
    <strong> {{ healthCare.codice }} - {{ healthCare.descrizione }} </strong>

    <template v-if="quantity">
      <br />
      <span>Quantità:&nbsp;</span>
      <strong>{{ quantity }}</strong>
    </template>
  </div>
</template>

<script>
export default {
  name: "RolReportHealthCareListItem",
  components: {},
  props: {
    healthCare: { type: Object, required: true }
  },
  data() {
    return {};
  },
  computed: {
    quantity() {
      return (
        this.healthCare.valori_prestazione &&
        this.healthCare.valori_prestazione.quantita
      );
    }
  },
  created() {},
  methods: {}
};
</script>

<style lang="sass"></style>
