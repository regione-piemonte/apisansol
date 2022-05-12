<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-layout>
    <!-- APP HEADER -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <csi-app-header no-menu-button>
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

        <div class="absolute-center text-center full-width q-px-md">

          <div class="text-center">
            <!--            <q-spinner-grid color="secondary" :size="64"/>-->
            <img src="statics/images/logout-spinner.gif" align="A presto" class="responsive csi-logout-spinner"/>
          </div>

          <h1 class="csi-h1 text-primary q-mt-xl">Stai per essere disconnesso</h1>
        </div>


        <!-- IFRAME LIST -->
        <!-- ------------------------------------------------------------------------------------------------------- -->
        <iframe
          v-for="url in logoutUrlList"
          :key="url"
          :src="url"
          frameborder="0"
          height="0"
          width="0"
          @load="onLoad($event, url)"
          @error="onLog($event, url, 'onError')"
          @abort="onLog($event, url, 'onAbort')"
          @cancel="onLog($event, url, 'onCancel')"
          @change="onLog($event, url, 'onChange')"
          @ended="onLog($event, url, 'onEnded')"
          @loadstart="onLog($event, url, 'onLoadStart')"
          @stalled="onLog($event, url, 'onStalled')"
          @suspend="onLog($event, url, 'onSuspend')"
          @waiting="onLog($event, url, 'onWaiting')"
        />

      </q-page>
    </q-page-container>


    <!-- FOOTER -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <csi-app-footer no-rating no-help/>
  </q-layout>
</template>

<script>
  import CsiAppHeader from "components/global/common/CsiAppHeader";
  import CsiAppFooter from "components/global/common/CsiAppFooter";
  import {SessionStorage} from 'quasar'
  import {config} from '@plugins/config'


  // Questa URL chiude la sessione shibboleth sul VH di SANSOL
  const LOGOUT_SANSOL = config.global.logoutUrls.sansol;

  // Questa URL dovrebbe chiudere sia la sessione applicativa che quella shibboleth del VH di ISAN
  const LOGOUT_ISAN = config.global.logoutUrls.isan;

  // Questa URL dovrebbe chiudere la sessione shibboleth del VH di SECURE
  const LOGOUT_SECURE = config.global.logoutUrls.secure;

  // Questa URL dovrebbe chiudere la sessione shibboleth del VH di SCREENING
  const LOGOUT_SCREEN = config.global.logoutUrls.screen;

  // Questa URL dovrebbe chiudere la sessione applicativa del CUP ed anche quella shibboleth del VH del CUP
  const LOGOUT_CUP = config.global.logoutUrls.cup;

  export default {
    name: "PageLogout",
    components: {CsiAppFooter, CsiAppHeader},
    props: {},
    data() {
      return {
        logoutUrlList: [],
        loadedList: []
      }
    },
    computed: {},
    async created() {
      SessionStorage.clear();

      this.logoutUrlList = [LOGOUT_CUP];
      console.log("Logging out from CUP");
      await this.timeout(1000);

      // Aspettiamo un secondo per far scatenare il meccanismo di logout sul CUP
      // Dopodiché scateniamo il logout di tutte le altre sessioni
      this.logoutUrlList = [
        LOGOUT_SCREEN,
        LOGOUT_SECURE,
        LOGOUT_ISAN,
        LOGOUT_SANSOL
      ];
      console.log("Logging out from Other");
      await this.timeout(2000);

      // Dopo 2 secondi di attesa finalmente assumiamo che tutte i logout siano andati a buon fine
      // e ricarichiamo la home de Salute Piemonte
      window.location.hash = '';
      window.location.reload();
    },
    methods: {
      onLoad(event, url) {
        console.log('[IFrame] onLoad: ', {event, url})
        this.loadedList.push(url);
      },
      onLog(event, url, mex) {
        console.log('[IFrame] ', mex, ': ', {event, url})
        this.loadedList.push(url);
      },
      timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }
    }
  }
</script>

<style>
.csi-logout-spinner{
  transform: scale(0.7, 0.7);
}
</style>
