<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<style lang="stylus">
  .csi-menu
    & .q-collapsible-sub-item
      padding: 0
</style>

<template>
  <div>

    <q-toolbar-title
      @click.native="$router.push($routes.GLOBAL.APP)"
      class="q-pa-md">
      <img
        src="statics/images/logo-la-mia-salute-blu.svg"
        alt="Salute Piemonte"
        class="vertical-middle csi-navigation-logo"
      />
    </q-toolbar-title>

    <q-list no-border class="no-padding csi-menu">
      <csi-navigation-item
        v-for="(item, index) in navigation"
        :key="index"
        :item="item"
        :level="0">
      </csi-navigation-item>
    </q-list>

  </div>
</template>

<script>
  import CsiNavigationItem from "components/global/common/CsiNavigationItem";

  /**
   * @vue-data {Object[]} navigation - La configurazione del menù
   * @requires {@link CsiNavigationItem}
   *
   * @description
   * Genera dinamicamente il menù di navigazione a partire da una [configurazione statica]{@tutorial 103-pages}.
   *
   * @todo
   * Gestire anche le autorizzazioni dell'utente: filtrare gli item mostrati nel menù in base
   * ai permessi associati all'utente loggato.
   *
   * @example
   * <csi-navigation></csi-navigation>
   *
   */
  export default {
    name: 'CsiNavigation',
    components: {CsiNavigationItem},
    props: {
      navigation: {type: Array, required: true}
    },
    data() {
      return {}
    }
  }
</script>


<style lang="stylus">
  .csi-navigation-logo
    height auto
    max-width 100%
</style>

