<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<style scoped></style>


<template>
  <q-page class="q-py-xl q-px-md">

    <q-card>
      <q-card-main>
        Per visualizzare i pagamenti già effettuati accedi al servizio
<!--        <router-link :to="$routes.FFE.DISPATCHER">-->
<!--          <strong>Fascicolo Finanziario</strong>-->
<!--        </router-link>-->
        <a href="/la-mia-salute/estratto-conto/#/">
          <strong>Estratto conto</strong>
        </a>
      </q-card-main>
    </q-card>


  </q-page>
</template>


<script>
  export default {
    name: "PageAuthPayedPayments",
    computed: {
      ffeUrl(){
        return 'url'
      }
    }
  }
</script>
