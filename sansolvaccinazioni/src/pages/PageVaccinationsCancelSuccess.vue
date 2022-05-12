<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <lms-page padding>
    <div v-if="!isLoading">
      <lms-page-title class="q-mb-md"> Annulla appuntamento </lms-page-title>

      <q-banner class="q-mb-md q-banner--positive">
        <div class="text-body1 ">
          <div v-if="agenda">
            L'appuntamento è stato annullato correttamente.
          </div>
          <div v-else>
            La richiesta di annullamento è stata inoltrata correttamente.
          </div>
        </div>
      </q-banner>

      <div class="q-pt-md ">
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
  name: "PageVaccinationsCancelSuccess",
  components: {},
  props: {
    id: { required: false }
  },
  data() {
    return {
      //vaccinazione di prova da visualizzare quando la pagina viene ricaricata
      isLoading: false,
      appointment: null,
      agenda: false
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
    let {agenda, appuntamento} = this.$route.params
    this.appointment = appuntamento;
    this.agenda = agenda;
    this.isLoading = false;
  }
};
</script>

<style></style>
