<!--
 SPDX-License-Identifier: EUPL-1.2
 Copyright Regione Piemonte - 2023
-->

<template>
  <div class="lms-card-item-bar" :class="classes">
    <slot />
  </div>
</template>

<script>
const TYPES = ["positive", "negative", "info"];

export default {
  name: "LmsCardItemBar",
  component: {},
  props: {
    type: {
      type: String,
      required: false,
      default: null,
      validator: v => TYPES.includes(v)
    }
  },
  data() {
    return {};
  },
  computed: {
    classes() {
      let result = [];
      if (this.type) result.push(`lms-card-item-bar--${this.type}`);
      return result;
    }
  }
};
</script>

<style lang="sass">
.lms-card-item-bar
  padding: 8px 16px

.lms-card-item-bar--negative
  background-color: $red-2
  color: black

.lms-card-item-bar--info
  background-color: $blue-2
  color: black

.lms-card-item-bar--positive
  background-color: $green-2
  color: black

.lms-card-item-bar--warning
  background-color: $orange-2
  color: black

.lms-card-item-bar--neutral
  background-color: $grey-2
  color: black
</style>
