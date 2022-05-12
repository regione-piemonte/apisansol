<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <lms-page padding>
    <div v-if="!isLoading">
      <lms-page-title no-back class="q-mb-md"
        >Annulla appuntamento</lms-page-title
      >

      <q-banner class="q-mb-md q-banner--positive">
        <div class="text-body1 ">
          Hai inoltrato correttamente la richiesta di revoca per l'appuntamento
        </div>
      </q-banner>

      <div class="q-pt-md q-pr-sm">
        <lms-buttons>
          <lms-button @click="goHome" outline>
            Torna alla home
          </lms-button>
        </lms-buttons>
      </div>
    </div>

    <lms-inner-loading :showing="isLoading" block />
  </lms-page>
</template>

<script>
import { HOME } from "../router/routes";

export default {
  name: "PageVaccinationsOmissionSuccess",
  components: {},
  props: {
    id: { required: false }
  },
  data() {
    return {
      //vaccinazione di prova da visualizzare quando la pagina viene ricaricata
      isLoading: false,
      appuntamento: null,
      citizen: null
    };
  },
  computed: {
    cf() {
      return this.$store.getters["getTaxCode"];
    }
  },
  methods: {
    onBack() {
      this.$router.go(-1);
    },
    goHome() {
      let name = HOME.name;

      this.$router.push({ name });
    }
  },
  async created() {
    this.isLoading = true;

    if (this.$route.params.appuntamento)
      this.appuntamento = this.$route.params.appuntamento;

    this.isLoading = false;
  }
};
</script>

<style></style>
