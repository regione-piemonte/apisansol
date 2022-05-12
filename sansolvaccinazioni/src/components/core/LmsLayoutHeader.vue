<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-header v-bind="attrs" v-on="listeners" class="lms-layout-header">
    <slot name="before" />

    <q-toolbar>
      <slot name="left">
        <template v-if="menu">
          <q-btn flat round dense icon="menu" @click="$emit('click-menu')"  aria-label="Menu" />
        </template>
      </slot>

      <a
        href="/la-mia-salute/"
        @click.prevent="onClickLogo"
        class="q-ml-md lms-layout-header__toolbar__title"
        aria-label="Torna alla homepage"
      >
        <img
          src="/statics/la-mia-salute/immagini/logo-la-mia-salute-bianco.svg"
          alt="Logo Salute Piemonte "
          class="full-width vertical-middle"
        />
      </a>

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
      //if (!("elevated" in attrs)) attrs.elevated = true;
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
  width: 100%
  max-width: 250px
  height: auto
</style>
