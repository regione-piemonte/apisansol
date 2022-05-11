<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <lms-page padding>
    <lms-page-title no-back>
      Profilo attivato
    </lms-page-title>

    <q-banner class="q-mt-lg q-banner--positive">
      Hai inserito correttamente i tuoi contatti ed hai attivato il servizio di
      notifica.
    </q-banner>

    <lms-buttons class="q-mt-md">
      <lms-button :to="PROFILE_CONTACTS" label="Vai al profilo personale" />
    </lms-buttons>
  </lms-page>
</template>

<script>
import { PROFILE_CONTACTS } from "src/router/routes";

export default {
  name: "PageProfileContactsCreateSuccess",
  data() {
    return {
      PROFILE_CONTACTS
    };
  },
  computed: {},
  created() {},
  methods: {}
};
</script>

<style scoped></style>
