<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-input v-bind="attrs" v-on="listeners" class="lms-input-tax-code" :required="isRequired"  />
</template>

<script>

import {hasValidCin, hasValidLength, LENGTH, TAX_CODE_MASK, TEMPORARY_LENGTH} from "src/services/tax-code";

export default {
  name: "LmsInputTaxCode",
  inheritAttrs: false,
  props: {
    temporary: { type: Boolean, required: false, default: false },
    isRequired:{ type: Boolean, required: false, default: false },
  },
  data() {
    return {};
  },
  computed: {
    ruleRequired() {
      return v => this.$rules.required(v) || "Campo obbligatorio";
    },
    ruleLength() {
      let lengthList = [LENGTH];
      let mex = `Deve essere di ${LENGTH} caratteri`;

      if (this.temporary) {
        lengthList.push(TEMPORARY_LENGTH);
        mex = `Deve essere di ${TEMPORARY_LENGTH} o ${LENGTH} caratteri`;
      }

      return v => !v || this.$rules.lengthIn(v, lengthList) || mex;
    },
    ruleRegex() {
      // Se la lunghezza è quella di un CF normale => deve essere formato da caratteri alphanumerici
      return v =>
        (!!v || !this.$rules.length(LENGTH) ||
        this.$rules.alphaNum(v)) ||
        `Deve essere composto solo da numeri o lettere`;
    },
    ruleRegexTemporary() {
      // Se la lunghezza è quella di un CF temporaneo => deve essere formato da soli numeri
      return v => (!v ||
        !this.$rules.length(v, TEMPORARY_LENGTH) ||
        this.$rules.numeric(v)) ||
        `Deve essere composto solo da numeri`;
    },
    ruleTaxCodeCin() {
      return (v) => {
        return (!v || (!hasValidLength(v) || hasValidCin(v))) || "Il codice di controllo non è corretto, potrebbero esserci degli errori di battitura"
      }
    },
    defaultRules() {
      if(this.isRequired){
        return [
          this.ruleRequired,
          this.ruleLength,
          this.ruleRegex,
          this.ruleRegexTemporary
        ];
      }else {
        return [
          this.ruleLength,
          this.ruleRegex,
          this.ruleRegexTemporary
        ];
      }

    },
    attrs() {
      const { ...attrs } = this.$attrs;

      if (!("type" in attrs)) attrs.type = "text";
      if (!("label" in attrs)) attrs.label = "Codice fiscale";
      if (!("name" in attrs)) attrs.name = "tax-code";
      if (!("autocomplete" in attrs)) attrs.autocomplete = "on";
      if (!("noErrorIcon" in attrs)) attrs.noErrorIcon = true;
      if (!("counter" in attrs)) attrs.counter = true;
      attrs.maxlength = LENGTH;
      attrs.mask = TAX_CODE_MASK;
      attrs.unmaskedValue = true;

      attrs.rules = attrs.rules || [];
      attrs.rules = [attrs.rules, ...this.defaultRules];

      return attrs;
    },
    listeners() {
      const { ...listeners } = this.$listeners;
      return listeners;
    }
  },
  created() {},
  methods: {}
};
</script>

<style scoped lang="sass"></style>
