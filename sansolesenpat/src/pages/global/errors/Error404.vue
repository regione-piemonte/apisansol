<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

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
        <div class="row items-center justify-around">
          <div class="col-5 col-sm-3 col-md-2 col-lg-2">
            <img src="statics/images/banners/error-404.svg" alt="Icona errore 404" class="responsive">
          </div>
        </div>

        <div class="text-center">
          <h1 class="csi-h1 text-primary q-my-md">Pagina non trovata</h1>
          <p>Torna indietro o utilizza il menù percontinuare la navigazione</p>

          <csi-buttons class="q-mt-lg">
            <csi-button primary label="Torna alla Home" @click="goToHome" />
          </csi-buttons>
        </div>
      </q-page>
    </q-page-container>


    <!-- FOOTER -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <csi-app-footer no-rating />

  </q-layout>
</template>


<script>
  import CsiAppFooter from "components/global/common/CsiAppFooter";
  import CsiAppHeader from "components/global/common/CsiAppHeader";

  export default {
    components: {CsiAppHeader, CsiAppFooter},
    methods: {
      goToHome(){
        this.$router.push(this.$routes.GLOBAL.APP)
      },
    },
  }
</script>
