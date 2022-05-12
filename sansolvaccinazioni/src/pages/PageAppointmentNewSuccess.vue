<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <lms-page padding>
    <div v-if="!isLoading">
      <lms-page-title no-back class="q-mb-md"
        >Richiesta vaccinazione completata</lms-page-title
      >

      <q-banner class="q-mb-md q-banner--positive">
        <div class="text-body1 ">
          <div v-if="!agenda">
            <div>
              La richiesta di appuntamento è andata a buon fine. <br>
              L'appuntamento è stato prenotato alla data richiesta.
            </div>
          </div>
          <div v-else>
            La richiesta di appuntamento è stata inviata al Centro Vaccinale scelto. <br>
            Appena possibile un operatore fisserà l'appuntamento.
          </div>
        </div>
      </q-banner>

      <div class="q-pt-md">
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
  name: "PageAppointmentNewSuccess",
  components: {},
  props: {
    id: { required: false }
  },
  data() {
    return {
      //vaccinazione di prova da visualizzare quando la pagina viene ricaricata
      isLoading: false,
      appointment: null,
      citizen: null,
      agenda: null
    };
  },
  computed: {},
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
    let {agenda} = this.$route.params
    this.agenda = agenda

    this.isLoading = false;
  }
};
</script>

<style></style>
