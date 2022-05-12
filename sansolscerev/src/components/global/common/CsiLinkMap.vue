<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <a :href="href" class="csi-link" :target="target">
    <slot/>
    <q-icon :name="icon" class="q-ml-xs"/>
  </a>
</template>


<script>


  export default {
    name: 'CsiLinkMap',
    components: {},
    props: {
      address: {type: String, required: false, default: null},
      target: {type: String, required: false, default: '_self'},
      icon: {type: String, required: false, default: 'place'},
    },
    data() {
      return {}
    },
    computed: {
      href() {
        if (!this.address) return '';
        return `https://www.google.com/maps/search/?api=1&query=${this.address}`
      },
      isExternal() {
        return ['_blank'].includes(this.target)
      },
      classes() {
        let result = []
        return result
      }
    },
    created() {
    },
    methods: {},
  }
</script>


<style lang="stylus">
  @require '~variables'

  .csi-link
    color $primary
    text-decoration none

  .csi-link:visited
    color $primary
</style>
