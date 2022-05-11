<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <lms-page padding>
    <lms-page-title>Assistenza</lms-page-title>
    <div class="q-py-lg">
      <q-card>
        <q-card-section>
          <div class="row q-col-gutter-lg">
            <div class="col-12 col-sm-6 col-lg-4">
              <q-img
                src="/statics/la-mia-salute/immagini/assistenza.svg"
                alt="Banner assistenza"
                basic
              />
            </div>

            <div class="col-12 col-sm-6 col-lg-8">
              <p>Hai bisogno di aiuto?</p>
              <p>
                Scrivi a
                <a href="mailto:assistenza.salute@csi.it"
                >assistenza.salute@csi.it</a
                >
                specificando:
              </p>
              <ul>
                <li>Nome e cognome</li>
                <li>Recapito telefonico</li>
                <li>Codice Fiscale</li>
                <li>Il problema che hai rilevato</li>
              </ul>
            </div>
          </div>
        </q-card-section>
      </q-card>
      <q-banner class="q-mt-lg q-banner--info" >
        Attenzione! La casella offre solo supporto tecnico, perciò ti invitiamo a non utilizzarla per comunicare informazioni personali di tipo sanitario
      </q-banner>
    </div>
  </lms-page>
</template>

<script>
export default {
  name: "PageHelpContacts",
  props: {},
  data() {
    return {};
  },
  computed: {},
  created() {},
  methods: {}
};
</script>

<style scoped lang="sass"></style>
