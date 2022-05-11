<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-inner-loading :visible="visible" class="csi-app-bootstrap-loader">

    <template v-if="noTransition">
      <img :src="imgUrl" alt="Icona Salute Piemonte" class="responsive block csi-app-bootstrap-loader__img">
      <q-spinner-dots size="56px" color="faded" class="q-mt-md block"/>
    </template>

    <template v-else>
      <transition enter-active-class="animated fadeInDown" appear>
        <img
          :src="imgUrl"
          alt="Icona Salute Piemonte"
          class="responsive block csi-app-bootstrap-loader__img"
          style="animation-duration: 2s"
        >
      </transition>
      <transition enter-active-class="animated fadeInUp" appear>
        <q-spinner-dots size="56px" color="faded" class="q-mt-md block" style="animation-delay: 700ms"/>
      </transition>
    </template>

  </q-inner-loading>
</template>


<script>
  export default {
    name: 'CsiAppBootstrapLoader',
    components: {},
    props: {
      visible: {type: Boolean, required: true},
      noTransition: {type: Boolean, required: false, default: false}
    },
    data() {
      return {}
    },
    computed: {
      imgUrl() {
        return 'statics/bootstrap-logo.svg'
      }
    },
    created() {
    },
    methods: {},
  }
</script>


<style lang="stylus">
  .csi-app-bootstrap-loader__img
    max-width 204px !important
</style>
