<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<style scoped></style>


<template>
  <q-layout>

    <!-- APP HEADER -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <csi-app-header no-menu-button @logo-click="$router.push($routes.GLOBAL.APP)">
      <template slot="after-toolbar">
        <portal-target name="layout-app-toolbar-after">
          <!--
          This component can be located anwhere in your App.
          The slot content of the above portal component will be rendered here.
          -->
        </portal-target>
      </template>
    </csi-app-header>


    <!-- PAGE CONTAINER -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <q-page-container>
      <q-page padding>
        <q-alert color="negative">
          <span v-html="$t('GLOBAL.ERRORS.BOOTSTRAP')"></span>
        </q-alert>

        <csi-buttons class="q-mt-lg">
          <csi-button primary label="Torna alla home" @click="$router.push($routes.GLOBAL.APP)" />
          <csi-button secondary label="Indietro" @click="$router.back()" />
        </csi-buttons>
      </q-page>
    </q-page-container>


    <!-- FOOTER -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <csi-app-footer no-rating />
  </q-layout>
</template>


<script>
  import CsiAppHeader from "components/global/common/CsiAppHeader";
  import CsiAppFooter from "components/global/common/CsiAppFooter";

  export default {
    name: "ErrorBootstrap",
    components: {CsiAppFooter, CsiAppHeader}
  }
</script>
