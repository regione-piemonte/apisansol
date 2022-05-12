<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<!--
 Questo componente è una versione alternativa del classico menù.
 In particolare, questo menù viene costruito a partire dai dati esposti dalle API del BFF e non più
 dalla configurazione salvata nel front-end.

 Si è reso necessario aggiungere questo nuovo componente per avere uniformità di comportamento con gli applicativi
 spacchettati
 -->

<template>
  <div class="csi-navigation-2">
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
      <csi-navigation-item2
        v-for="app in appListVisible"
        :key="app.id"
        :app="app"
      />
    </q-list>

  </div>
</template>

<script>
  import CsiNavigationItem2 from "components/global/common/CsiNavigationItem2";

  export default {
    name: 'CsiNavigation2',
    components: {CsiNavigationItem2},
    data() {
      return {}
    },
    computed: {
      appList() {
        return this.$store.getters['global/getAppList']
      },
      appListVisible() {
        let isMobile = this.$q.platform.is.mobile;

        let result = this.appList.filter(a => {
          if (isMobile) return a.visibile_menu_mobile;
          return a.visibile_menu_desktop;
        });

        return result;
      }
    }
  }
</script>


<style lang="stylus">
  .csi-navigation-2 .csi-navigation-logo
    height auto
    max-width 100%

  .csi-navigation-2 .csi-menu
    & .q-collapsible-sub-item
      padding: 0
</style>

