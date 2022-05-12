<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div :id="`evento-${eventNumber}`">
    <div
      class="print-event-container q-pa-xl row justify-center"
    >
      <div
        class="column q-col-gutter-y-lg items-stretch fit print-page-container"
      >
        <div class="col-auto q-mb-lg">
          <div class="row items-center justify-center">
            <div class="col-12 text-center">
              <img
                width="250px"
                alt="Logo Salute Piemonte"
                class="print-event__logo-salute-piemonte"
                src="/statics/la-mia-salute/immagini/logo-la-mia-salute-blu.svg"
              />
            </div>

          </div>
        </div>
        <div class="col-auto text-center q-mb-md">
          <h1 class="text-h1 text-uppercase text-accent">PROVVEDIMENTO CONTUMACIALE</h1>
        </div>

        <div class="col q-mb-md">
          <q-card flat>
            <q-card-section class="column items-start q-col-gutter-y-xs q-px-none">
              <div>Tipo provvedimento: <strong>{{ eventType | empty }}</strong></div>
              <div>Numero: <strong>{{ eventNumber | empty }}</strong></div>
              <div>Autorità sanitaria: <strong>{{ eventAsl | empty }}</strong></div>
            </q-card-section>
            <q-card-section class="column items-start q-col-gutter-y-xs q-px-none">
              <div>Nome: <strong>{{ citizenName | empty }}</strong></div>
              <div>Cognome: <strong>{{ citizenSurname | empty }}</strong></div>
              <div>Codice Fiscale: <strong>{{ citizenTaxCode| empty }}</strong></div>
              <div>Data di nascita: <strong>{{ citizenBirthDay | date("DD/MM/YYYY") | empty }}</strong></div>
            </q-card-section>
            <q-card-section class="q-px-none" v-if="isEndOfQuarantine">
              <div>Valido per eventuale rientro a scuola/università</div>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-auto">
          <div class="row items-center justify-center">
            <div class="col-12 text-center" >
              <img
                style="width: 150px"
                alt="Logo Regione Piemonte"
                class="print-event__logo-regione"
                src="/statics/la-mia-salute/immagini/logo-regione-piemonte-positivo.svg"
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {EVENT_TYPE_CODE_MAP} from "src/services/config";

export default {
  name: "CovidPrintEvent",
  props: {
    event: {type: Object, default: null}
  },
  computed: {
    citizenCovid() {
      return this.$store.getters["getCitizen"];
    },
    eventNumber() {
      return this.event?.numeroProvvedimento;
    },
    eventType() {
      return this.event?.decodeTipoEvento?.descTipoEvento;
    },
    eventAsl() {
      return this.event?.aslProvvedimento;
    },
    citizenName() {
      return this.citizenCovid?.nome
    },
    citizenSurname() {
      return this.citizenCovid?.cognome ?? ''
    },
    citizenBirthDay() {
      return this.citizenCovid?.dataNascita
    },
    citizenTaxCode() {
      return this.citizenCovid?.codiceFiscale
    },
    eventTypeId() {
      return this.event?.decodeTipoEvento?.idTipoEvento || null;
    },
    isEndOfQuarantine(){
      return this.eventTypeId === EVENT_TYPE_CODE_MAP.END_OF_QUARANTINE
    },
  }
}
</script>

<style lang="sass">
.print-event-container
  display: none

.print-page
  .print-event-container
    display: block !important
    width: 100vw
    margin: 0 auto
    min-height: 100vh
    max-width: 800px

  .print-page-container
    min-height: 90vh


</style>
