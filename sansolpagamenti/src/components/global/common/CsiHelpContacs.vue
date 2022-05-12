<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<style scoped lang="stylus"></style>

<template>
  <q-page>
    <q-card>
      <q-card-main class="no-padding">
        <div class="row q-ma-md">
          <div class="col-md-6 col-sm-12 q-mt-md">
            <p>Hai bisogno di aiuto?</p>
            <p>Scrivi alla casella di posta <a href="mailto:assistenza.salute@csi.it">assistenza.salute@csi.it</a> specificando:</p>
            <ul>
              <li>Codice Fiscale</li>
              <li>Cognome</li>
              <li>Nome</li>
              <li>Recapito telefonico</li>
              <li>Descrizione del problema</li>
              <li>Servizio on line utilizzato</li>
            </ul>
          </div>
          <div class="col-md-6 col-sm-12 ">
            <img src="statics/images/banners/img_assistenza.svg" alt="Assistenza" class="responsive">
          </div>
        </div>
      </q-card-main>
    </q-card>

  </q-page>
</template>


<script>
  import CsiPageTitle from "components/global/common/CsiPageTitle";

  export default {
    name: 'PageContactsHelp',
    components: {CsiPageTitle},
    data(){
      return {
      }
    },
    computed: {
    },
    methods: {
      onBack(){
        this.$router.go(-1)
      }
    }
  }
</script>
