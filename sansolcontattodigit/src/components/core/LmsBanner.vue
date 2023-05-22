<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-banner v-bind="attrs" v-on="listeners" :class="classes" class="lms-banner">
    <div class="row items-center q-pa-xs">
      <div v-if="icon" class="col-auto q-pr-md">
        <q-icon :name="icon" size="md"/>
      </div>
      <div class="text-body1 col">
        <slot/>
      </div>

    </div>


  </q-banner>
</template>

<script>

const VALID_TYPES = ['info', 'warning', 'positive', 'negative']
export default {
  name: "LmsBanner",
  props: {
    type: {type: String, default: ''},
    icon: {type: String, default: null}
  },
  computed: {
    attrs() {
      const {...attrs} = this.$attrs;
      return attrs;
    },
    listeners() {
      const {...listeners} = this.$listeners;
      return listeners;
    },
    classes() {
      let result = [];
      if (this.type) result.push(`lms-banner--${this.type}`);
      return result
    }
  }
}
</script>

<style lang="sass">
.lms-banner
  border-left-width: 8px
  border-left-style: solid
  border-left-color: transparent

.lms-banner
  &.lms-banner--info
    background-color: $blue-2
    border-left-color: $blue-4

  &.lms-banner--warning
    background-color: $orange-2
    border-left-color: $orange-5

  &.lms-banner--positive
    background-color: $green-3
    border-left-color: $green-6

  &.lms-banner--negative
    background-color: $red-3
    border-left-color: $red-6


</style>
