<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <lms-page padding class="covid-page-home-contacts">
    <!-- NO CONTATTI -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <template v-if="!citizenCovidPhoneNumber && !citizenCovidEmail">
      <q-banner rounded class="bg-info">
        Inserisci il tuo numero di telefono mobile e il tuo indirizzo mail come
        contatti per il servizio Covid 19
      </q-banner>

      <q-card class="q-mt-md">
        <q-card-section>
          <covid-contacts-form />
        </q-card-section>
      </q-card>
    </template>

    <!-- CONTATTI  -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <template v-else>
      <q-card class="q-mt-md">
        <q-card-section>
          <covid-contacts-form />
        </q-card-section>
      </q-card>
    </template>
  </lms-page>
</template>

<script>
import CovidContactsForm from "../components/CovidContactsForm";

export default {
  name: "PageHomeContacts",
  components: { CovidContactsForm },
  data() {
    return {};
  },
  computed: {
    citizenCovidEmail() {
      return this.$store.getters["getCitizenEmail"];
    },
    citizenCovidPhoneNumber() {
      return this.$store.getters["getCitizenPhoneNumber"];
    },
  },
  created() {},
  methods: {},
};
</script>

<style scoped lang="scss"></style>
