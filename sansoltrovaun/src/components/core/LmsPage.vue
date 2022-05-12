<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-page v-bind="attrs" v-on="listeners" class="lms-page">
    <slot />
  </q-page>
</template>

<script>
export default {
  name: "LmsPage",
  inheritAttrs: false,
  computed: {
    listeners() {
      const { ...listeners } = this.$listeners;
      return listeners;
    },
    attrs() {
      const { ...attrs } = this.$attrs;
      return attrs;
    }
  }
};
</script>

<style lang="sass">
// Impostiamo una larghezza massima alle pagine
@media (min-width: $breakpoint-sm)
  .lms-page
    max-width: 100%
    margin: auto


@media (min-width: $breakpoint-lg)
  .lms-page
    max-width: 1440px //$breakpoint-md
    margin: auto
</style>
