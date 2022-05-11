<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-dialog v-bind="attrs" v-on="listeners" :maximized="$q.screen.lt.sm">
    <q-card class="lms-privacy-policy-dialog" style="max-width: 800px">
      <q-toolbar>
        <q-toolbar-title>
          Privacy e condizioni d'uso
        </q-toolbar-title>

        <q-btn v-close-popup flat round dense icon="close"/>
      </q-toolbar>

      <q-card-section>
        <p>Tramite il servizio on line Assistenza è possibile inviare richieste di assistenza relative
          ai servizi pubblicati sul portale Salute Piemonte. </p>
        <p>
          Per inviare la richiesta è necessario compilare un form con i dati minimi necessari
          alla presa in carico e risoluzione della stessa.
        </p>
        <p>
          Tramite il servizio potrai
        </p>
        <ul>
          <li>se ti sei autenticato per inserire la richiesta, consultare le richieste inviate monitorandone
            la risoluzione e consultare le richieste concluse,
          </li>
          <li>se non ti sei autenticato ricevere gli aggiornamenti sulla richiesta tramite la mail che inserirai
            in fase di registrazione della stessa.
          </li>
        </ul>
        <p>Per leggere l'informativa completa clicca sui seguenti link</p>
        <ul>
          <li v-for="(policy,index) in policyServicesOrderedList" :key="index">
            <a :href="policy.url" target="_blank" class="lms-link">{{policy.label}}</a>
          </li>

        </ul>
        <p>Per tutti gli altri servizi è necessario far riferimento alle informative rese disponibili dalle ASL di
          competenza.</p>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>

import {orderBy} from "src/services/utils";

const POLICY_SERVICES_LIST = [
  {
    label: 'Servizio',
    url: 'url'
  },


]

export default {
  name: "LmsPrivacyPolicyDialog",
  components: {},
  inheritAttrs: false,
  data(){
    return{
      POLICY_SERVICES_LIST
    }
  },
  computed: {
    attrs() {
      const {...attrs} = this.$attrs;
      return attrs;
    },
    listeners() {
      const {...listeners} = this.$listeners;
      return listeners;
    },
    policyServicesOrderedList(){
      return orderBy(POLICY_SERVICES_LIST, ['label'])
    }
  },
}
</script>

<style scoped>

</style>
