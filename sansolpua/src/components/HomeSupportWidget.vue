<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="home-support-widget">
    <template v-if="$q.screen.gt.md">
      <div class="absolute-bottom home-support-widget--background"></div>
      <div
        class="row justify-end q-pr-xl absolute-bottom-right"
      >
        <div
          class="col-md-4 col-lg-8 text-h5 text-primary"
        >
          <p class=" q-mt-none q-mb-sm">
            <strong>Hai bisogno di aiuto?</strong>
          </p>
          <p><strong>Siamo qui per te!</strong></p>
        </div>
        <div class="col-12">

        </div>
        <div class="row items-start content-end">
          <div class="col-6 " :class="{ 'q-mt-xl': $q.screen.lt.md }">
            <div class="q-mt-md">
              <q-btn color="primary" unelevated @click="showAssistanceDialog">
                Assistenza
              </q-btn>
            </div>
          </div>
          <div class="col-6 text-center self-end">
            <img
              alt="assistenza"
              class="full-width"
              style="max-width: 400px"
              src="avatar-assistenza.svg"
            />
          </div>
        </div>

      </div>
    </template>

    <template v-else>
      <div class="row justify-end items-end absolute-bottom home-support-widget--background">
        <div class="col-12 text-center">
          <div class="text-h5 text-primary">
            <p class=" q-mt-none q-mb-sm">
              <strong>Hai bisogno di aiuto?</strong>
            </p>
            <p><strong>Siamo qui per te!</strong></p>
          </div>
          <div class="q-mt-md">
            <q-btn color="primary" unelevated @click="showAssistanceDialog">
              Assistenza
            </q-btn>
          </div>
        </div>
        <div class="col-12 text-center q-pt-md">
          <img
            src="avatar-assistenza.svg"
            alt="assistenza"
            style="max-height: 150px; vertical-align: middle"
          />
        </div>
      </div>
    </template>


    <!--    <div class="text-h5 text-primary text-bold">-->
    <!--      Hai bisogno di aiuto? <br>-->
    <!--      Siamo qui per te-->
    <!--    </div>-->
    <!--    <div class="q-mt-md">-->
    <!--      <q-btn color="primary" unelevated @click="showAssistanceDialog">-->
    <!--        Assistenza-->
    <!--      </q-btn>-->
    <!--    </div>-->

    <!--    DIALOG ASSISTENZA-->
    <q-dialog
      v-model="assistanceDialog"
      :full-width="$q.screen.lt.sm"
      :full-height="$q.screen.lt.sm"
    >
      <q-card class="q-pa-sm">
        <q-card-section class="row items-center ">
          <h2 class="details-info-title q-ma-none">Assistenza</h2>
          <q-space/>
          <q-btn icon="close" flat round dense v-close-popup/>
        </q-card-section>
        <q-card-section
          class="details-info-description  row items-stretch justify-center"
        >
          <q-btn class="col-12 col-md q-ma-sm" color="primary" type="a" :href="urls.assistanceNewRequest()">
            Invia nuova richiesta
          </q-btn>
          <q-btn class="col-12 col-md q-ma-sm" color="primary" type="a" :href="urls.assistanceRequestList()">
            Visualizza le tue richieste
          </q-btn>
        </q-card-section>
        <!--        <q-card-section-->
        <!--          class="details-info-description"-->
        <!--        >-->

        <!--          <p>Hai bisogno di aiuto?</p>-->
        <!--          <p>Scrivi alla casella di posta <a class="lms-link" href="mailto:assistenza.salute@csi.it">assistenza.salute@csi.it</a> specificando:</p>-->
        <!--          <ul>-->
        <!--            <li>Codice Fiscale</li>-->
        <!--            <li>Cognome</li>-->
        <!--            <li>Nome</li>-->
        <!--            <li>Recapito telefonico</li>-->
        <!--            <li>Descrizione del problema</li>-->
        <!--            <li>Servizio on line utilizzato</li>-->
        <!--          </ul>-->

        <!--          <q-banner class="h-banner h-banner&#45;&#45;info q-mt-md">-->
        <!--            <p class="q-ma-xs text-body1"><strong>Attenzione! La casella offre solo supporto tecnico, perciò ti invitiamo a non utilizzarla-->
        <!--              per comunicare informazioni personali di tipo sanitario</strong></p>-->
        <!--          </q-banner>-->


        <!--        </q-card-section>-->
      </q-card>
    </q-dialog>


  </div>
</template>

<script>
import * as urls from "src/services/urls";
export default {
  name: "HomeSupportWidget",
  props: {},
  data() {
    return {
      urls,
      assistanceDialog: false
    };
  },
  computed: {},
  created() {
  },
  methods: {
    showAssistanceDialog() {
      this.assistanceDialog = true
    }

  }
};
</script>

<style lang="sass">
.home-support-widget
  min-height: 250px

  img
    margin-bottom: -6px
    max-width: 100%

  .home-support-widget--background
    background: url(../../public/blob-basso-destra.svg) top 0 right -25% / 720px no-repeat

    min-height: 250px

@media (max-width: $breakpoint-md-max)
  .home-support-widget
    min-height: 300px
  .home-support-widget--background
    background: url(../../public/blob-basso-destra.svg) top 0 left 50% / 500px no-repeat !important

</style>
