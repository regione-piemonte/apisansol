<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <lms-page padding>
    <lms-page-title no-back>
      Nuovo documento
    </lms-page-title>

    <div class="q-my-lg">
      <q-banner class="bg-green-3">
        <div class="row q-col-gutter-md">
          <div class="col-auto">
            <q-icon name="fas fa-check-circle" size="md" />
          </div>

          <div class="col">
            <div class="text-h5">
              Inserimento avvenuto con successo
            </div>
          </div>
        </div>
      </q-banner>
    </div>

    <lms-buttons>
      <lms-button :to="DOCUMENT_CREATE">
        Inserisci documento
      </lms-button>

      <lms-button outline :to="DOCUMENT_LIST">
        Torna alla home
      </lms-button>
    </lms-buttons>
  </lms-page>
</template>

<script>
import { DOCUMENT_CREATE, DOCUMENT_LIST } from "../router/routes";

export default {
  name: "PageDocumentCreateSuccess",
  props: {},
  data() {
    return {
      DOCUMENT_LIST,
      DOCUMENT_CREATE
    };
  },
  computed: {},
  created() {},
  methods: {}
};
</script>

<style scoped lang="sass"></style>
