<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>

  <!-- Nel caso in cui vogliamo che lo spinner occupi del contenuto -->
  <div v-if="block">
    <div v-if="attrs.visible" class="q-pa-lg text-center">
      <q-spinner-mat size="50px" color="primary" />
    </div>
  </div>

  <!-- Nel caso in cui vogliamo che lo spinner vada in overlay -->
  <q-inner-loading v-else v-bind="attrs" v-on="listeners" class="bg-transparent">
    <slot>
      <q-spinner-mat size="50px" color="primary" />
    </slot>
  </q-inner-loading>
</template>


<script>
  export default {
    name: 'CsiInnerLoading',
    inheritAttrs: false,
    props: {
      block: {type: Boolean, required: false, default: false}
    },
    computed: {
      listeners() {
        const {...listeners} = this.$listeners;
        return listeners;
      },
      attrs() {
        const {block, ...attrs} = this.$attrs;
        return attrs;
      },
    },
  }
</script>


<style scoped lang="stylus"></style>
