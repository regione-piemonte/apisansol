<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<style scoped></style>


<template>
  <q-datetime
    :value="value"
    @input="onInput"
    :first-day-of-week="1"
    format="DD MMM YYYY"
    :min="min"
    :max="max"
    v-bind="attrs"
    v-on="listeners"
  />
</template>


<script>
  import isBefore from 'date-fns/is_before';
  import isAfter from 'date-fns/is_after';
  import {modelValidator} from "quasar-framework/src/components/datetime/datetime-props";
  import {isNil} from "@services/global/utils";

  export default {
    name: "CsiInputDatetime",
    inheritAttrs: false,
    props: {
      value: {validator: modelValidator},
      firstDayOfWeek: {type: Number, required: false, default: 1},
      format: {type: String, required: false, default: 'DD MMM YYYY'},
      min: {required: false, validator: modelValidator, default: null},
      max: {required: false, validator: modelValidator, default: null}
    },
    computed: {
      attrs() {
        let {firstDayOfWeek, format, min, max, ...attrs} = this.$attrs;
        return attrs;
      },
      listeners() {
        let {input, ...listeners} = this.$listeners;
        return listeners;
      },
    },
    watch: {
      min: {
        immediate: true,
        handler(newValue, oldValue) {
          if (isNil(newValue) || isNil(this.value) || !isBefore(this.value, newValue)) return;
          // Il minimo e la data sono impostati e la data viene prima del minimo
          // => c'è un errore ed impostiamo la data al minimo
          this.$emit('invalid-value')
          this.onInput(newValue)
        }
      },
      max: {
        immediate: true,
        handler(newValue, oldValue) {
          if (isNil(newValue) || isNil(this.value) || !isAfter(this.value, newValue)) return;
          // Il massimo e la data sono impostati e la data viene dopo il massimo
          // => c'è un errore ed impostiamo la data al massimo
          this.$emit('invalid-value')
          this.onInput(newValue)
        }
      },
    },
    methods: {
      onInput(value){
        this.$emit('input', value)
        this.$emit('change', value)
      }
    }
  }
</script>
