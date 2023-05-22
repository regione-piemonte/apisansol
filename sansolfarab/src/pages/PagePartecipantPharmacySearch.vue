<!--
 SPDX-License-Identifier: EUPL-1.2
 Copyright Regione Piemonte - 2023
-->

<template>
  <lms-page padding>
    <lms-page-title class="q-mb-lg">
      Farmacia abituale
    </lms-page-title>

    <q-card>
      <q-card-section>
        <div class="text-h3 text-bold q-mb-md">
          Cerca la farmacia
        </div>

        <farab-pharmacy-search-form
          :loading="isLoading"
          @search="searchPharmacies"
        />
      </q-card-section>
    </q-card>
  </lms-page>
</template>

<script>
import { PHARMACY_SEARCH_RESULTS } from "src/router/routes";
import FarabPharmacySearchForm from "src/components/FarabPharmacySearchForm";

export default {
  name: "PagePartecipantPharmacySearch",
  data() {
    return {
      offset: 0,
      isLoading: false
    };
  },
  components: { FarabPharmacySearchForm },
  methods: {
    searchPharmacies(params) {
      // let coords = params?.address?.coords
      // let lat = coords?.lat
      // let lon = coords?.lon
      //
      // let query= {
      //   latitudine: lat,
      //   longitudine: lon,
      //   distanza: params?.distance,
      //   nome: params?.name,
      //   indirizzo: params?.address?.label
      // }
      let route = {
        name: PHARMACY_SEARCH_RESULTS.name,
        // query: query,
        params: params
      };
      this.$router.replace(route);
    }
  }
};
</script>

<style lang="sass"></style>
