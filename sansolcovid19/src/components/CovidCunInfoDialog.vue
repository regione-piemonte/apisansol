<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-dialog
    :value="value"
    :maximized="$q.screen.lt.sm"
    @input="$emit('input', $event)"
    content-css="width: 680px"
  >
    <q-card>
      <q-toolbar color="transparent" text-color="black">
        <q-toolbar-title class="q-px-none">Cos'è il CUN?</q-toolbar-title>
        <q-btn v-close-popup flat round dense icon="close" />
      </q-toolbar>

      <div class="q-pa-md">
        <p>
          È un codice che inizia con le lettere CUN seguite da un trattino "-" e
          da 10 caratteri alfanumerici (es. CUN-1A2B3C4D5E).<br />
          Il CUN viene comunicato a tutti coloro che effettuano il tampone
          molecolare. <br />
          Il CUN è associato all'esito dell’esame e permette di garantire il
          diritto alla privacy dei cittadini.
        </p>

        <p>
          <strong>In caso di positività</strong> è importante conservare questo
          codice e comunicarlo il prima possibile al
          <strong>
            Call Center Immuni
            <a href="tel" class="lms-link">tel</a>.
          </strong>
          <br />
          In questo modo le persone con cui sei entrato in contatto, e che
          potrebbero essere state esposte al rischio di contagio, riceveranno
          automaticamente l’avviso sulla loro App Immuni.
        </p>

        <p>
          <strong>Cosa bisogna fare?</strong><br />
          Contatta il Call Center Immuni
          <a href="tel" class="lms-link">tel</a>: un
          operatore ti aiuterà nella procedura di comunicazione della tua
          positività. <br />
          Prima di chiamare assicurati di avere a portata di mano anche la
          tessera sanitaria e di ricordare l'eventuale data di inizio dei
          sintomi. <br />
        </p>

        <div class="q-pa-sm bg-orange-3 round-borders">
          <strong>Attenzione</strong>: <br />
          la segnalazione può essere fatta solo dai cittadini con l’App Immuni
          installata prima di risultare positivi al tampone molecolare.
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: "CovidCunInfoDialog",
  props: {
    value: { type: Boolean, required: false, default: false },
  },
  data() {
    return {};
  },
  computed: {},
  created() {},
  methods: {},
};
</script>

<style scoped lang="scss"></style>
