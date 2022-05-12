<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-dialog
    :maximized="$q.screen.lt.sm"
    v-bind="attrs"
    v-on="listeners"
  >
    <q-card class="lms-delegation-info-dialog q-pa-md text-h6" >
      <q-card-section class="row items-center no-padding">
        <h1 class="text-h1">{{title}}</h1>
        <q-space/>
        <q-btn icon="close" flat round dense v-close-popup/>
      </q-card-section>
      <q-card-section>
        <slot />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: "LmsDelegationInfoDialog",
  props:{
    title:{type:String, default:''}
  },
  computed:{
    attrs() {
      const { ...attrs } = this.$attrs;
      return attrs;
    },
    listeners() {
      const { ...listeners } = this.$listeners;
      return listeners;
    },
  }
}
</script>

<style scoped>

</style>
