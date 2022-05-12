<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<style scoped lang="stylus"></style>


<template>
  <q-field
    :required="required"
    :warning="warning"
    :error="error"
    :count="TAX_CODE_LENGTH"
    >
    <q-input
      :value="value"
      @input="onInput"
      type="text"
      float-label="Codice fiscale"
      :maxlength="TAX_CODE_LENGTH"
      :clearable="clearable"
      upper-case
      name="tax-code"
      autocomplete="on"
    />

    <!-- Esponiamo gli slot di default di QField all'esterno -->
    <slot slot="helper" name="helper"></slot>
    <slot slot="warning-label" name="warning-label"></slot>
    <slot slot="error-label" name="error-label"></slot>
  </q-field>
</template>


<script>
  import {LENGTH} from "@services/global/tax-code";

  export default {
    name: 'CsiInputTaxCode',
    props: {
      value: {required: true},
      required: {type: Boolean, default: false},
      warning: {type: Boolean, default: false},
      error: {type: Boolean, default: false},
      clearable: {type: Boolean, required: false, default: false}
    },
    data() {
      return {
        TAX_CODE_LENGTH: LENGTH,
      }
    },
    methods: {
      onInput(newValue) {
        this.$emit('input', newValue);
      }
    },
  }
</script>
