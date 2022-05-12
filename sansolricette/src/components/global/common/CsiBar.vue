<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="csi-bar q-py-sm q-px-md" :class="classes">
    <slot />
  </div>
</template>


<script>
  export default {
    name: 'CsiBar',
    components: {},
    props: {
      bgColor: {type: String, required: false, default: 'info'},
      textColor: {type: String, required: false, default: 'black'},
    },
    data() {
      return {}
    },
    computed: {
      classes(){

        let result = []

        result.push(`bg-${this.bgColor}`)
        result.push(`text-${this.textColor}`)

        return result
      }
    },
    created() {
    },
    methods: {},
  }
</script>


<style scoped lang="stylus"></style>
