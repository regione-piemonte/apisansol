<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<style scoped lang="stylus"></style>


<template>
  <div class="row items-center no-wrap">
    <slot name="back">
      <q-btn
        v-if="!noBack"
        flat
        round
        dense
        icon="arrow_back"
        class="q-mr-xs"
        @click="onBack"
      />
    </slot>
    <slot name="title">
      <div class="q-title">{{title}}</div>
    </slot>
  </div>
</template>


<script>
  export default {
    name: 'CsiPageTitle',
    props: {
      title: {type: String, default: ''},
      noBack: {type: Boolean, default: false},
    },
    data() {
      return {}
    },
    methods: {
      onBack(...args) {
        let eventName = 'back'
        if (eventName in this.$listeners) return this.$emit(eventName, ...args)

        console.debug(`default @${eventName}`)
        this.$router.back()
      }
    }
  }
</script>
