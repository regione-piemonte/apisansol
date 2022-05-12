<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div>
    <q-banner class="bg-yellow-2" rounded v-if="activable">
      <div class="row q-pa-md q-col-gutter-xl" >
        <template v-if="$q.screen.gt.sm">
          <div class="col-auto">
            <q-icon name="warning" size="lg" />
          </div>
        </template>

        <div class="col text-body1">
          <p class="q-mb-md">
            Per utilizzare questo servizio devi avere il Fascicolo Sanitario aperto.
          </p>
          <p>
            Se apri il Fascicolo:
          </p>
          <ul>
            <li>avrai un unico punto di accesso alla tua storia clinica</li>
            <li>potrai consultare il tuo fascicolo ovunque ti trovi</li>
            <li>potrai far arrivare velocemente al tuo medico curante le informazioni che ti riguardano</li>
            <li>potrai essere seguito con maggiore continuità</li>
            <li>potrai evitare esami ripetuti o non necessari</li>
          </ul>
          <p class="no-margin">
            Il Fascicolo Sanitario Elettronico conterrà referti provenienti da ASR della Regione Piemonte e di
            altre regioni, oltre a referti provenienti da Aziende Private accreditate e altri documenti che tu
            stesso potrai inserire.
          </p>

          <!--        <div class="q-mt-md row q-col-gutter-md">-->
          <!--          <div class="col-auto">-->
          <!--            <q-checkbox-->
          <!--              v-model="doNotAskAgain"-->
          <!--              label="Non mostrarmi più questo messaggio"-->
          <!--              class="text-caption"-->
          <!--              dense-->
          <!--            />-->
          <!--          </div>-->

          <!--          <q-space />-->

          <!--          <div class="col-auto">-->
          <!--            <lms-button unelevated>-->
          <!--              Apri il fascicolo-->
          <!--            </lms-button>-->
          <!--          </div>-->
          <!--        </div>-->
          <lms-buttons class="q-mt-lg">
            <lms-button unelevated  @click="activateFse">
              Apri il fascicolo
            </lms-button>
          </lms-buttons>
        </div>
      </div>
    </q-banner>
    <q-banner class="h-banner h-banner--warning" rounded v-else>
      <div class="row q-pa-md q-col-gutter-xl" >
        <template v-if="$q.screen.gt.sm">
          <div class="col-auto">
            <q-icon name="warning" size="lg" />
          </div>
        </template>

        <div class="col text-body1">
          <p>
            Per visualizzare lista degli esami effettuati, occorre avere aperto il Fascicolo Sanitario Elettronico
          </p>
        </div>
      </div>
    </q-banner>
  </div>

</template>

<script>
export default {
  name: "CsiEnrollmentBanner",
  props: {
    activable: { type: Boolean, required: false, default: false }
  },
  data() {
    return {
      doNotAskAgain: false
    };
  },
  computed: {


  },
  methods:{
    activateFse() {
      const url = "/la-mia-salute/arruolamento/#/";
      window.location.assign(url);
    },
  }
};
</script>

<style lang="sass">
</style>
