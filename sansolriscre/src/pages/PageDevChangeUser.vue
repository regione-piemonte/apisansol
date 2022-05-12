<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <lms-page padding>
    <lms-page-title @back="goHome">Cambio utente</lms-page-title>

    <q-form ref="form">
      <q-input
        label="Codice fiscale"
        type="text"
        v-model="cfModel"
        :rules="[notNull]"
      ></q-input>
      <q-input label="Nome utente" type="text" v-model="nameModel"></q-input>
      <q-input
        label="Cognome utente"
        type="text"
        v-model="lastNameModel"
      ></q-input>

      <lms-buttons class="q-mt-md">
        <lms-button :loading="loading" @click="changeUser">Conferma</lms-button>
      </lms-buttons>
    </q-form>
  </lms-page>
</template>

<script>
import { HOME } from "../router/routes";

export default {
  name: "PageDevChangeUser",

  data() {
    return {
      cfModel: "",
      nameModel: "",
      lastNameModel: "",
      loading: false
    };
  },
  computed: {
    notNull() {
      return v => !!v || "Campo obbligatorio";
    }
  },
  methods: {
    goHome() {
      this.$router.push(HOME);
    },
    async changeUser() {
      let isValid = await this.$refs.form.validate();
      if (!isValid) return;

      this.loading = true;
      let [hash, query] = window.location.hash.split("?");
      let urlParams = new URLSearchParams(query);
      urlParams.set("param", this.cfModel);
      urlParams.set("param", this.nameModel);
      urlParams.set("param", this.lastNameModel);

      let url = `${location.origin}${
        location.pathname
      }#/?${urlParams.toString()}`;
      window.location.assign(url);
      window.location.reload();
      this.loading = false;
    }
  }
};
</script>

<style scoped></style>
