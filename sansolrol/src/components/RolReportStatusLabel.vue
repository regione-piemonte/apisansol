<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <span class="rol-report-status-label" :class="classes">
    <slot :label="label">
      {{ label }}
    </slot>
  </span>
</template>

<script>
import {
  canPay as _canPay,
  getPaymentStatusLabel,
  hasRefund as _hasRefund
} from "src/services/business-logic";

export default {
  name: "RolReportStatusLabel",
  props: {
    report: { type: Object, required: false, default: null },
    bold: { type: Boolean, required: false, default: false }
  },
  computed: {
    delegatorSelected() {
      return this.$store.getters["getDelegatorSelected"];
    },
    label() {
      return getPaymentStatusLabel(this.report);
    },
    canPay() {
      return _canPay(this.report) && !this.delegatorSelected;
    },
    hasRefund() {
      return _hasRefund(this.report);
    },
    classes() {
      let result = [];

      if (this.canPay) result.push("text-negative");
      if (this.hasRefund) result.push("text-green-9");
      if (this.bold) result.push("text-weight-bold");

      return result;
    }
  }
};
</script>

<style lang="sass"></style>
