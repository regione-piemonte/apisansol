<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <lms-page padding>
    <div v-if="!isLoading">
      <lms-page-title no-back class="q-mb-md"
        >Segnalazione reazione avversa</lms-page-title
      >

      <q-banner class="q-mb-md q-banner--positive">
        <div class="text-body1 ">
          La segnalazione per reazione avversa è stata inviata correttamente
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
  name: "PageVaccinationsEventSuccess",
  components: {},
  props: {
    id: { required: false }
  },
  data() {
    return {
      isLoading: false,
      appointment: null
    };
  },
  computed: {
    cf() {
      return this.$store.getters["getTaxCode"];
    }
  },
  methods: {
    goHome() {
      let name = HOME.name;
      this.$router.push({ name });
    }
  },
  async created() {}
};
</script>

<style></style>
