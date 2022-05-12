<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<style scoped></style>

<template>
  <q-item separator>
    <q-item-main>
      <q-item-tile class="q-body-2 text-primary">Identificativo ticket/posizione debitoria {{item.numero_pratica_regionale}}</q-item-tile>
      <q-item-tile class="q-body-1">{{item.paziente.nome}} {{item.paziente.cognome}} - {{item.asr.descrizione}}
      </q-item-tile>
      <q-item-tile class="q-body-2">{{item.da_pagare.valore | toFixed}} &euro;</q-item-tile>
      <!-- @TODO: questa data a cosa si riferisce? alla data di creazione del ticket? alla data di uno degli appuntamenti? alla data di aggiunta al carrello? -->
      <q-item-tile v-if="item.data_creazione" class="q-caption text-tertiary">
        {{item.data_creazione | format}}
      </q-item-tile>
    </q-item-main>

    <q-item-side right>
      <q-btn flat round wait-for-ripple icon="close" color="primary" @click="removeFromCart" />
    </q-item-side>
  </q-item>
</template>


<script>
  export default {
    name: 'CsiCartListItem',
    props: {
      item: {type: Object, required: true}
    },
    data() {
      return {}
    },
    methods: {
      removeFromCart() {
        this.$store.commit('healthPayments/removeFromCart', this.item);
      }
    }
  }
</script>
