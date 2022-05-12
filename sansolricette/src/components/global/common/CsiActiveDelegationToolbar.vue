<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-toolbar color="lime-14" text-color="dark" class="csi-active-delegation-toolbar">
    <q-toolbar-title>
      <div class="white-space-default">
        Stai utilizzando il servizio per conto di <strong>{{fullName | startCase}}</strong>
      </div>
      <!--<span slot="subtitle">Delega attiva</span>-->
    </q-toolbar-title>

    <template v-if="!noClose">
      <q-btn @click="$emit('unset')" flat round dense icon="close" />
    </template>
  </q-toolbar>
</template>


<script>
  export default {
    name: "CsiActiveDelegationToolbar",
    props: {
      fullName: {type: String, required: true},
      noClose: {type: Boolean, required: false, default: false}
    }
  }
</script>


<style scoped lang="stylus">
  .white-space-default
    white-space normal
</style>
