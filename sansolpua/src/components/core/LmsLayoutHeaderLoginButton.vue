<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<!--<template>-->
<!--  <q-btn-->
<!--    v-bind="attrs"-->
<!--    v-on="listeners"-->
<!--    :class="classes"-->
<!--    class="lms-header-login-button"-->
<!--    @click="onClick"-->
<!--  >-->
<!--    Accedi-->
<!--  </q-btn>-->
<!--</template>-->

<script>
export default {
  name: "LmsLayoutHeaderLoginButton",
  props: {
    minWidth: { type: Boolean, required: false, default: false }
  },
  inheritAttrs: false,
  computed: {
    attrs() {
      const { ...attrs } = this.$attrs;
      if (!("flat" in attrs)) attrs.flat = true;
      if (!("dense" in attrs)) attrs.dense = true;
      return attrs;
    },
    listeners() {
      const { click, ...listeners } = this.$listeners;
      return listeners;
    },
    classes() {
      return {
        "header-login-button--min-width": this.minWidth
      };
    }
  },
  methods: {
    onClick() {
      let eventName = "click";
      let landingUrl = encodeURIComponent(window.location.pathname);
      let url = "/api/bff/login?landingUrl=" + landingUrl;

      if (eventName in this.$listeners) return this.$emit(eventName, url);

      window.location.assign(url);
    }
  }
};
</script>
<style lang="sass">
.header-login-button--min-width
  min-width: 200px
@media (max-width: $breakpoint-sm-max)
  .header-login-button--min-width
    min-width: 100%

</style>
