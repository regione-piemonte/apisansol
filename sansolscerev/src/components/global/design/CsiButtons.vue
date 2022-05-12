<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="csi-buttons row group"
       :class="classes">
    <slot/>
  </div>
</template>


<script>
  export default {
    name: 'CsiButtons',
    components: {},
    props: {
      padding: {type: Boolean, required: false, default: false},
      left: {type: Boolean, required: false, default: false},
    },
    computed: {
      classes() {
        return {
          'q-pa-md': this.padding,
          'reverse': !this.left && this.$q.screen.gt.xs,
          'text-right': !this.left
        }
      }
    },
  }
</script>


<style lang="stylus">


</style>
