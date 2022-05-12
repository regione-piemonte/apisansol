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
          <div class="col-10 col-sm-8 col-md-6 col-lg-4">
            <img src="statics/images/banners/maintenance.svg" alt="Manutenzione" class="responsive">
          </div>
        </div>

        <div class="text-center">
          <h1 class="csi-h1 text-primary q-my-md">Servizio non disponibile</h1>
          <p>
            Servizio al momento non disponibile a causa di un intervento di manutenzione.
            Ti consigliamo di riprovare più tardi
            Ci scusiamo per il disagio.
          </p>

          <template v-if="!noActions">
            <div class="row justify-center">
              <csi-buttons class="q-mt-lg">
                <csi-button primary label="Torna alla Home" @click="goToHome"/>
              </csi-buttons>
            </div>
          </template>
        </div>
      </q-page>
    </q-page-container>


    <!-- FOOTER -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <csi-app-footer no-rating/>
  </q-layout>
</template>


<script>
  import CsiAppFooter from "components/global/common/CsiAppFooter";
  import CsiAppHeader from "components/global/common/CsiAppHeader";

  export default {
    components: {CsiAppHeader, CsiAppFooter},
    props: {
      noActions: {type: Boolean, required: false, default: false}
    },
    methods: {
      goToHome() {
        this.$router.push(this.$routes.GLOBAL.APP)
      },
    },
  }
</script>
