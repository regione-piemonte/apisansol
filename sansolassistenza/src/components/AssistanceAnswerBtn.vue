<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-btn v-bind="attrs" class="answer-button q-mx-sm" :class="classes" v-on="listeners" unelevated :ripple="false">
    <!-- Propaghiamo lo slot di default -->
    <slot />

    <!-- Propaghiamo i named slots -->
    <slot slot="loading" name="loading" />
  </q-btn>
</template>

<script>
export default {
  name: "AssistanceAnswerBtn",
  inheritAttrs: false,
  props: {
    noMinWidth: { type: Boolean, required: false, default: false }
  },
  computed: {
    listeners() {
      const { ...listeners } = this.$listeners;
      return listeners;
    },
    attrs() {
      // eslint-disable-next-line no-unused-vars
      const { ...attrs } = this.$attrs;
      attrs.color = attrs.color || "primary";
      return attrs;
    },
    classes() {
      return {
        "answer-button--min-width": !this.noMinWidth
      };
    }
  },
}
</script>

<style lang="sass">
.answer-button.disabled,
.answer-button[disabled]
  background-color: #c9cbcb !important
  color: #000 !important
  border: none
  box-shadow: none

.answer-button.q-btn--outline
  background-color: #ffffff !important

.answer-button.focus,
.answer-button:focus
  outline: 3px solid #f3c716

.answer-button--min-width
  min-width: 60px

</style>
