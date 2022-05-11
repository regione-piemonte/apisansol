<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
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

</style>
