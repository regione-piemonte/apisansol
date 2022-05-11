<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-page padding>
    <csi-page-title
      title="Modifica Consenso Effettuata"
      no-back
      class="q-mb-lg"
    />

    <div>
      <!-- NUOVA VERSIONE DA METTERE IN PRODUZIONE -->
<!--      <template v-if="($config.global.isDevelopment || $config.global.isTest) && consent">-->
        <q-alert type="positive">
          <p>
            Sono state effettuate e seguenti operazioni:
          </p>

          <ul>
            <li>Presa visione dell'informativa</li>
            <li>
              {{consent.consenso_consultazione ? 'Conferimento' : 'Diniego'}}
              del consenso alla consultazione
            </li>
            <li>
              {{consent.consenso_pregresso ? 'Conferimento' : 'Diniego'}}
              del consenso al recupero del pregresso
            </li>
          </ul>
        </q-alert>
<!--      </template>-->

<!--      <template v-else>-->
<!--        <q-alert type="positive">-->
<!--          <p>-->
<!--            La tua richiesta è stata presa in carico. Se hai attivato le notifiche riceverai conferma della-->
<!--            corretta ricezione da parte delle aziende-->
<!--          </p>-->
<!--        </q-alert>-->
<!--      </template>-->

      <div class="q-mt-lg">
        <csi-buttons>
          <csi-button :to="$routes.CONSENTS.HOME" secondary>
            Torna alla home
          </csi-button>
        </csi-buttons>
      </div>
    </div>
  </q-page>
</template>

<script>
  import CsiPageTitle from "components/global/common/CsiPageTitle";

  export default {
    name: 'PageConsentFseSuccess',
    components: {CsiPageTitle},
    props: {},
    data() {
      return {};
    },
    computed: {
      consent() {
        return this.$route.params && this.$route.params.consent
      }
    },
    created() {
    },
    methods: {},
  }
</script>

<style>
</style>
