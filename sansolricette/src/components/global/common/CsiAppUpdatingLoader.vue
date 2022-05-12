<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="csi-app-updating-loader flex flex-center fullscreen">
    <div>
      <csi-inner-loading :visible="true" block />
      <div class="q-mt-sm">
        <slot name="text">
          Aggiornamento in corso ...
        </slot>
      </div>
    </div>
  </div>
</template>


<script>
  export default {
    name: 'CsiAppUpdatingLoader',
    components: {},
    props: {},
    data() {
      return {}
    },
    computed: {},
    created() {
    },
    methods: {},
  }
</script>


<style scoped lang="stylus"></style>
