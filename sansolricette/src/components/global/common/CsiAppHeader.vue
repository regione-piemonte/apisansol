<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-layout-header reveal>

    <slot name="before-toolbar"/>

    <!-- BARRA UTENTE MOCKATO -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <template v-if="isUserMockBarVisible">
      <csi-user-mock-bar />
    </template>

    <!-- MAIN TOOLBAR -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <q-toolbar>
      <slot name="toolbar-left">
        <q-btn v-if="!noMenuButton" flat round dense icon="menu" @click="$emit('menu-click')"/>
      </slot>

      <q-toolbar-title @click.native="$emit('logo-click')" class="cursor-pointer">
        <img
          src="statics/images/logo-la-mia-salute.svg"
          alt="Salute Piemonte"
          class="vertical-middle csi-app-logo"
        >
        <!--<span slot="subtitle">Sottotitolo</span>-->
      </q-toolbar-title>


      <slot name="toolbar-right"/>
    </q-toolbar>


    <slot name="after-toolbar"/>
  </q-layout-header>
</template>


<script>
  import CsiUserMockBar from "components/dev/CsiUserMockBar";

  export default {
    name: 'CsiAppHeader',
    components: {CsiUserMockBar},
    props: {
      noMenuButton: {type: Boolean, required: false, default: false}
    },
    data() {
      return {}
    },
    computed: {
      isUserMockBarVisible() {
        return this.$config.global.isDevelopment || this.$config.global.isTest
      }
    },
    created() {
    },
    methods: {},
  }
</script>


<style scoped lang="stylus">

</style>
