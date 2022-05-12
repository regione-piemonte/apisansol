<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<style lang="stylus">

  input
    margin-left 4px

</style>


<template>
  <q-field
    :required="required"
    :warning="warning"
    :error="error">
    <q-input
      :value="mobilePhone"
      @input="onInput"
      type="tel"
      float-label="Telefono mobile"
      prefix="+39"
      maxlength="10"
    >
    </q-input>

    <!-- Esponiamo gli slot di default di QField all'esterno -->
    <slot slot="helper" name="helper"></slot>
    <slot slot="warning-label" name="warning-label"></slot>
    <slot slot="error-label" name="error-label"></slot>
  </q-field>
</template>


<script>
  import {mobilePhoneStripPrefix, PREFIX_ITALY} from "@filters/strings";

  export default {
    name: 'CsiInputMobilePhone',
    props: {
      value: {required: true},
      required: {type: Boolean, default: false},
      warning: {type: Boolean, default: false},
      error: {type: Boolean, default: false},
    },
    computed: {
      mobilePhone() {
        return mobilePhoneStripPrefix(this.value)
      }
    },
    methods: {
      onInput(newValue) {
        // Se il prefisso non è presente => lo aggiungiamo al numero di telefono
        if (!newValue.startsWith(PREFIX_ITALY)) newValue = `${PREFIX_ITALY}${newValue}`
        this.$emit('input', newValue);
      },
    },
  }
</script>
