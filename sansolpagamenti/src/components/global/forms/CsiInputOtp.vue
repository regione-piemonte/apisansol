<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<style scoped lang="stylus"></style>


<template>
  <q-field
    :required="required"
    :warning="true"
    :error="error"
    :count="5">
    <q-input
      :value="confirmCode"
      @input="onInput"
      type="text"
      float-label="Codice di conferma"
      :maxlength="5">
    </q-input>


    <!-- Esponiamo gli slot di default di QField all'esterno -->
    <slot slot="helper" name="helper"></slot>
    <slot slot="warning-label" name="warning-label">Il codice scadrà tra {{countdownMixin_expiration}}</slot>
    <slot slot="error-label" name="error-label"></slot>

  </q-field>
</template>


<script>

  import {countdownMixin} from "@mixins/countdownMixin";

  export default {
    name: 'CsiInputOtp',
    mixins: [countdownMixin],
    props: {
      value: {required: true},
      expirationDate: {type: String, default: new Date().toISOString()},
      required: {type: Boolean, default: false},
      error: {type: Boolean, default: false},
    },
    data() {
      return {
        confirmCode: this.value,
      }
    },
    computed: {
      isOtpExpired() {
        return this.countdownMixin_isStarted && this.countdownMixin_isExpired;
      },
    },
    methods: {
      onInput(newValue) {
        this.confirmCode = newValue;
        this.$emit('input', newValue);
      },
    },
    watch: {
      isOtpExpired: {
        immediate: true,
        handler(newValue, oldValue) {
          newValue ? this.$emit('expired') : this.$emit('unexpired');
        }
      }
    },
    mounted() {
      let to = this.expirationDate;
      this.countdownMixin_start(to);
    }
  }
</script>
