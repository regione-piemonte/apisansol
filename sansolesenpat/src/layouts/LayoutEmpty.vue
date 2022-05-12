<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-layout>
    <q-page-container>
      <router-view></router-view>
    </q-page-container>
  </q-layout>
</template>

<script>
  /**
   * @description
   * Il layout da utilizzare per quelle pagine che sono considerate "fuori dal progetto" o che comunque non
   * rispecchiano il layout classico delle pagine del progetto.
   *
   * In questo modo è possibile lasciare alle singole pagine creare il proprio layout.
   */
  export default {
    name: 'LayoutEmpty',
    data() {
      return {}
    }
  }
</script>

<style>
</style>
