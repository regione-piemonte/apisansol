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

        <q-alert v-if="hasError" color="negative" text-color="black" class="q-mb-md">
          <strong>{{errorStatus}}</strong>
          <br>
          <i>{{errorCode}}</i>
        </q-alert>

        <div class="row items-center justify-around">
          <div class="col-10 col-sm-8 col-md-6 col-lg-4">
            <img src="statics/images/banners/error-500.svg" alt="Icona errore 500" class="responsive">
          </div>
        </div>

        <div class="text-center">
          <h1 class="csi-h1 text-primary q-my-md">Ooops...</h1>
          <p>Servizio al momento non disponibile, ti consigliamo di riprovare più tardi</p>
          <p>
            <span>Se il problema persiste scrivi a </span>
            <a href="/la-mia-salute/assistenza/#/richieste/nuova">contatta l'assistenza</a>
<!--            <a :href="mailTo" class="text-weight-bold">{{mailAddress}}</a>-->
          </p>
        </div>

        <csi-buttons>
          <csi-button primary label="Torna alla home" @click="goToHome" />
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
    name: 'Error500',
    components: {CsiAppFooter, CsiAppHeader},
    props: {},
    data() {
      return {}
    },
    computed: {
      mailAddress() {
        return `assistenza.salute@csi.it`
      },
      mailTo() {
        let email = this.mailAddress
        let subject = `Errore 500 Salute Piemonte`
        let body = ``
        let mailto = `mailto:${email}?subject=${subject}&body=${body}`
        return encodeURI(mailto)
      },
      error() {
        return this.$route.params.error
      },
      hasError() {
        return !!this.error && this.error.response && this.error.response.data
      },
      errorStatus() {
        return this.error.response.data.status
      },
      errorCode() {
        return this.error.response.data.code
      }
    },
    created() {
    },
    methods: {
      goToHome() {
        this.$router.push(this.$routes.GLOBAL.APP, () => location.reload(true))
      }
    },
  }
</script>


<style scoped lang="stylus"></style>
