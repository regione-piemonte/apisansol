<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<!--
Un'estensione della q-chip di quasar che permette di definire uno sile univoco per la variante "selected" della chip
-->

<template>
  <q-chip
    v-bind="attrs"
    v-on="listeners"
    :selected="false"
    :color="selected ? 'primary' : 'blue-1'"
    :text-color="selected ? 'white' : 'black'"
    class="fse-tag-chip"
  >
    <slot />
  </q-chip>
</template>

<script>
export default {
  name: "FseTagChip",
  inheritAttrs: false,
  props: {
    selected: { type: Boolean, required: false, default: false }
  },
  data() {
    return {};
  },
  computed: {
    attrs() {
      const { ...attrs } = this.$attrs;
      return attrs;
    },
    listeners() {
      const { ...listeners } = this.$listeners;
      return listeners;
    }
  },
  created() {},
  methods: {}
};
</script>

<style scoped lang="sass"></style>
