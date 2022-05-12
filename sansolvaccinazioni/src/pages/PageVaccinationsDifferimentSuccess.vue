<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <lms-page padding>
    <div v-if="!isLoading">
      <lms-page-title no-back class="q-mb-md"
        >Differimento</lms-page-title
      >

      <q-banner class="q-mb-md q-banner--positive">
        <div class="text-body1 ">
          Hai inoltrato correttamente la richiesta per lo spostamento della
          vaccinazione
        </div>
      </q-banner>

      <div class="q-pt-md q-pr-sm">
        <lms-buttons>
          <lms-button outline @click="goHome" >
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
import { getVaccinationUserInfo } from "../services/api";

export default {
  name: "VaccinationsDifferimentSuccess",
  components: {},
  props: {
    id: { required: false }
  },
  data() {
    return {
      //vaccinazione di prova da visualizzare quando la pagina viene ricaricata
      isLoading: false,
      appointment: null,
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
      this.appointment = this.$route.params.appuntamento;

    let cittadinoPromise = await getVaccinationUserInfo(this.cf);
    this.citizen = cittadinoPromise.data;
    this.email = this.citizen.contatti_vaccinazioni.email;
    this.telefono = this.citizen.contatti_vaccinazioni.telefono;

    this.isLoading = false;
  }
};
</script>

<style></style>
