<!--
 SPDX-License-Identifier: EUPL-1.2
 Copyright Regione Piemonte - 2023
-->

<template>
  <q-header v-bind="attrs" v-on="listeners" class="lms-layout-header">
    <slot name="before" />

    <q-toolbar>
      <slot name="left">
        <template v-if="menu">
          <q-btn flat round dense icon="menu" @click="$emit('click-menu')" />
        </template>
      </slot>

      <q-img
        basic
        src="/statics/la-mia-salute/immagini/logo-la-mia-salute-bianco.svg"
        alt="Salute Piemonte"
        class="lms-layout-header__toolbar__title q-ml-md q-hoverable q-link cursor-pointer"
        @click="onClickLogo"
      />

      <q-space />

      <slot name="right" />
    </q-toolbar>

    <slot name="after" />
  </q-header>
</template>

<script>
export default {
  name: "LmsLayoutHeader",
  inheritAttrs: false,
  props: {
    menu: { type: Boolean, required: false, default: false }
  },
  computed: {
    listeners() {
      const { ...listeners } = this.$listeners;
      return listeners;
    },
    attrs() {
      const { ...attrs } = this.$attrs;
      if (!("reveal" in attrs)) attrs.reveal = true;
      if (!("elevated" in attrs)) attrs.elevated = true;
      return attrs;
    }
  },
  methods: {
    onClickLogo() {
      let eventName = "click-logo";
      let goTo = "/la-mia-salute/";

      if (eventName in this.$listeners) return this.$emit(eventName, goTo);

      window.location.assign(goTo);
    }
  }
};
</script>

<style lang="sass">
.lms-layout-header__title
  cursor: pointer

.lms-layout-header__toolbar__title
  max-width: 250px
</style>
