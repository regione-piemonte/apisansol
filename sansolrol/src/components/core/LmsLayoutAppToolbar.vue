<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-toolbar class="lms-layout-app-toolbar">
    <slot name="left" />

    <q-toolbar-title
      class="lms-layout-app-toolbar__title"
      shrink
      @click.native="onClick"
    >
      <slot />
    </q-toolbar-title>

    <q-space />

    <slot name="right" />
  </q-toolbar>
</template>

<script>
export default {
  name: "LmsLayoutAppToolbar",
  methods: {
    onClick() {
      let eventName = "click-title";
      let url = window.location.origin + window.location.pathname;

      if (eventName in this.$listeners) return this.$emit(eventName, url);

      window.location.assign(url);
    }
  }
};
</script>

<style lang="sass">
.lms-layout-app-toolbar
  background-color: $secondary
  color: #FFF

.lms-layout-app-toolbar__title
  cursor: pointer
  padding-left: 56px
</style>
