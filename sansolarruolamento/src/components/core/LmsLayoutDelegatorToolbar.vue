<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-bar class="lms-layout-delegator-toolbar">
    <div class="white-space-default">
      <slot>
        Stai utilizzando il servizio per conto di
        <span class="text-bold"> {{ lastName }} {{ firstName }} </span>
      </slot>
    </div>

    <q-space/>
    <template v-if="!noClose">
      <q-btn dense flat icon="close" round @click="$emit('close')"/>
    </template>

  </q-bar>
</template>

<script>
export default {
  name: "LmsLayoutDelegatorToolbar",
  props: {
    firstName: {type: String, required: false, default: ""},
    lastName: {type: String, required: false, default: ""},
    noClose: {type: Boolean, required: false, default: false}
  }
};
</script>

<style lang="sass">
.lms-layout-delegator-toolbar
  min-height: 32px
  height: auto
  background-color: $lime-14
  color: #000
</style>
