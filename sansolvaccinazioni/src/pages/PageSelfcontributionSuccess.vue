<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <lms-page padding>
    <div>
      <lms-page-title no-back class="q-mb-md"
        >Comunicazione vaccinazioni pregresse</lms-page-title
      >

      <q-banner class="q-mb-md q-banner--positive">
        <div class="text-body1 ">
          Hai caricato correttamente il file desiderato
        </div>
      </q-banner>

      <div class="q-pt-md ">
        <lms-buttons>
          <lms-button @click="onBack" >
            Carica un altro file
          </lms-button>
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
      isLoading: false
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
  async created() {}
};
</script>

<style></style>
