<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<style scoped="" lang="stylus"></style>

<template>
  <q-page padding>
    <csi-page-title title="Aiuto" @back="onBack" />
    <q-card class="q-mt-md">
      <q-card-main class="no-padding">
        <div class="row q-mx-md items-center">
          <div class="col-md-6 col-sm-12 col-lg-4 gt-sm">
            <img src="statics/images/banners/img_assistenza.svg" alt="Assistenza" class="responsive">
          </div>
          <div class="col-md-6 col-sm-12 col-lg-8 q-pa-lg">
            <p>Hai bisogno di aiuto?</p>
            <p>Scrivi a <a href="mailto:assistenza.salute@csi.it">assistenza.salute@csi.it</a> specificando:</p>
            <ul>
              <li>Nome e cognome</li>
              <li>Recapito telefonico</li>
              <li>Codice Fiscale</li>
              <li>Il problema che hai rilevato</li>
            </ul>
          </div>
        </div>
      </q-card-main>
      <q-card-main >
        <q-alert  color="info">
          <div class="text-weight-bold q-body-1">
            Attenzione! La casella offre solo supporto tecnico, perciò ti invitiamo a non utilizzarla per comunicare informazioni personali di tipo sanitario
          </div>
        </q-alert>
      </q-card-main>
    </q-card>

  </q-page>
</template>


<script>
  import CsiPageTitle from "../../components/global/common/CsiPageTitle";
  export default {
  name: 'PageHelpContacts',
    components: {CsiPageTitle},
    methods: {
      onBack(){
        this.$router.back()
      }
    }
  }

</script>
