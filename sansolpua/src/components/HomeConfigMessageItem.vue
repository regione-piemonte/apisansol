<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-banner class="home-config-messages-item h-banner" :class="bannerColor">
<!--      <div class="home-config-messages-item__title">-->
<!--        {{title}}-->
<!--      </div>-->
      <div class="home-config-messages-item__body text-body1" v-html="body"></div>
  </q-banner>

</template>

<script>
const COLOR_FALLBACK = 'info';
const COLOR_MAP = {
  18: 'warning',
  19: 'info'
};

export default {
  name: "HomeConfigMessageItem",
  props: {
    message: {type: Object, required: false, default: null}
  },
  computed:{
    typeId() {
      return this.message?.tipo_di_messaggio?.id ?? null
    },
    title() {
      return  this.message?.title ?? ''
    },
    body() {
      return this.message?.body ?? ''
    },
    bannerColor(){
      let colorMap = COLOR_MAP[this.typeId]
      let color = colorMap || COLOR_FALLBACK
      return `h-banner--${color}`
    }
  }
}
</script>

<style lang="sass">
.home-config-messages-item__title
  font-weight: bold
  font-size: 16px
  margin-bottom: 16px

.home-config-messages-item__body
  font-size: 16px

.home-config-messages-item__body p:last-of-type
  margin-bottom: 0

</style>
