<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="csi-app-guard-update-mandatory">
    <template v-if="isAppUpdateMandatory">
      <csi-app-updating-loader />
    </template>


    <template v-else>
      <slot />
    </template>
  </div>
</template>


<script>
  import CsiAppUpdatingLoader from "components/global/common/CsiAppUpdatingLoader";

  export default {
    name: 'CsiAppGuardUpdateMandatory',
    components: {CsiAppUpdatingLoader},
    props: {},
    data() {
      return {}
    },
    computed: {
      isAppUpdateMandatory() {
        return this.$store.getters['global/isAppUpdateMandatory']
      }
    },
    created() {
    },
    methods: {},
  }
</script>


<style scoped lang="stylus"></style>
