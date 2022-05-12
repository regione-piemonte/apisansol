<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-page class="window-height flex flex-center q-pa-md">
    <div>
      <q-alert type="positive">
        Hai inserito correttamente i tuoi contatti ed hai attivato il servizio di notifica.
      </q-alert>

      <csi-buttons class="q-mt-md">
        <!--<csi-button secondary label="Torna a [titolo servizio]" />-->
        <csi-button  v-if="assistanceService" primary label="Torna alla pagina di assistenza" @click="goToAssistance"/>
        <csi-button v-else priamry label="Vai al profilo personale" @click="$router.push($routes.GLOBAL.USER_PROFILE)" />

      </csi-buttons>
    </div>
  </q-page>
</template>

<script>

  export default {
    name: 'PageUserContactsFlowSuccess',
    data() {
      return {};
    },
    computed:{
      assistanceService(){
        let {assistanceService} = this.$route.params;
        return assistanceService
      }

    },
    methods:{
      goToAssistance(){
        let url = `assistenza/#/richieste/nuova/${this.assistanceService}`
        window.location.assign(url)
      }
    }
  }
</script>

<style>
</style>
