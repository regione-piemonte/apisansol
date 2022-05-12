<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="csi-app-bootstrap">
    <template v-if="!isLoading">
      <slot/>
    </template>

    <!-- LOADING -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <template v-else>
      <!-- IN PRODUZIONE LASCIAMO IL VECCHIO LOADER -->
      <!--      <template v-if="$config.global.isProduction">-->
      <!--        <csi-app-bootstrap-loader :visible="isLoading" no-transition/>-->
      <!--      </template>-->

      <!-- NEGLI ALTRI AMBIENTI TESTIAMO IL NUOVO LOADER -->
      <!--      <template v-else>-->
      <q-layout>
        <!-- APP HEADER -->
        <!-- ---------- -->
        <csi-app-header/>

        <!-- PAGE CONTAINER -->
        <!-- -------------- -->
        <q-page-container>
          <q-page padding class="flex flex-center">
            <csi-inner-loading block :visible="true"/>
          </q-page>
        </q-page-container>


        <!-- FOOTER -->
        <!-- ------ -->
        <csi-app-footer no-rating no-help/>
      </q-layout>
      <!--      </template>-->
    </template>
  </div>
</template>


<script>
  import {isNil, isEmpty} from "@services/global/utils";
  import {canAccessRoute, ensureLogin} from "@router/hooks";
  import {login} from "@services/global/session";
  import CsiAppBootstrapLoader from "components/global/common/CsiAppBootstrapLoader";
  import {getAppList, getMessageList} from "@services/api/bff";
  import CsiAppHeader from "components/global/common/CsiAppHeader";
  import CsiAppFooter from "components/global/common/CsiAppFooter";

  export default {
    name: 'CsiAppBootstrap',
    components: {CsiAppFooter, CsiAppHeader, CsiAppBootstrapLoader},
    props: {},
    data() {
      return {
        isLoading: true,
        configuration: null,
      }
    },
    computed: {
      isAppUpdateMandatory() {
        return this.$store.getters['global/isAppUpdateMandatory']
      }
    },
    methods: {},
    async created() {

      console.debug('App config static:', this.$config);
      this.isLoading = true
      this.configuration = await this.$store.dispatch('global/loadAppConfig')
      console.debug('App config dynamic:', this.configuration);

      try {
        let {data} = await getAppList();
        await this.$store.dispatch('global/setAppList', {appList: data});
      } catch (err) {
        console.error(err);
      }

      // Se non riusciamo a scaricare la configurazione dell'app non possiamo capire se la versione attuale
      // dell'app è supportata oppure se i servizi sono in manutenzione ecc.
      // Per questo motivo siamo costretti a redirigere nella pagina di errore di bootstrap
      if (isNil(this.configuration)) {
        this.$router.push(this.$routes.ERRORS.ERROR_BOOTSTRAP);
        this.isLoading = false
        return
      }

      // Se l'update dell'app è obbligatorio => è inutile richiedere altri dati al server
      if (this.isAppUpdateMandatory) {
        this.isLoading = false
        return
      }


      let servicesPromise = this.$store.dispatch('global/loadAppServices');
      let userPromise = this.$store.dispatch('global/loadUser');
      let messageListPromise = getMessageList({_no5XXRedirect: true});

      let services = await servicesPromise;
      let user = await userPromise;

      try {
        messageListPromise.then((response) => {
          let messageList = response.data && response.data.results || [];
          this.$store.commit('global/setMessageList', messageList);
        })

        // let response = await messageListPromise;
        // let messageList = response.data && response.data.results || [];
        // this.$store.commit('global/setMessageList', messageList);
      } catch (err) {

      }

      if (isNil(services) || isEmpty(services)) {
        this.$router.push(this.$routes.ERRORS.ERROR_BOOTSTRAP);
        this.isLoading = false
        return
      }

      // @NOTE: aspettiamo la fine del loading iniziale prima di aggiungere il controllo della navigazione
      // delle route. In questo modo non viene invocato quando non abbiamo tutti i dati restituendo falsi negativi
      this.$router.beforeEach(ensureLogin)
      // this.$router.beforeResolve(ensureLogin)

      // if (this.$config.global.isDevelopment || this.$config.global.isTest) {
      //   this.$router.beforeEach(mockUser);
      // }

      // Dopo aver impostato gli hook del router
      // effettuiamo manualmente il primo controllo

      // aspettiamo che il router sia pronto prima di ottenere la route dall'URL
      // altrimenti potrebbe non ottenere la route corretta
      this.$router.onReady(() => {
        console.debug('[FirstAccess] Router ready')
        console.debug('[FirstAccess] Router:', this.$router)
        console.debug('[FirstAccess] Route:', this.$route)
        console.debug('[FirstAccess] matched:', this.$router.getMatchedComponents())
        console.debug('[FirstAccess] current:', this.$router.history.current)

        // Impostiamo la route corrente perchè c'è un bug in Vue Router
        // @see https://github.com/vuejs/vue-router/issues/2385
        let resolved = this.$router.resolve(window.location, this.$router.history.current)
        // let resolved = this.$router.resolve(window.location)
        let route = resolved.route
        console.debug('[FirstAccess] resolved:', resolved)
        console.debug('[FirstAccess] routeResolved:', route)
        console.debug('-------------------------')

        let canAccess = canAccessRoute(route)

        if (!canAccess) {
          if (!this.$store.getters['global/isUserLogged']) {
            console.debug('[FirstAccess] The route is not public and the user is not logged => redirect to login...')
            login()
            return
          } else {
            console.debug('[FirstAccess] The route is not public and the user is logged => redirect to home...')
            this.$router.push(this.$routes.GLOBAL.APP)
          }
        }

        this.isLoading = false;
      })

      // Evitiamo di spaccare completamente l'app
      // In questo modo è sempre possibile aggiornarla
      setTimeout(() => {
        this.isLoading = false
      }, 5000)
    }
  }
</script>


<style scoped lang="stylus"></style>
