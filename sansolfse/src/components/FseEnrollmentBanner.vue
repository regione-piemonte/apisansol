<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-banner class="bg-yellow-2" rounded>
    <div class="row q-pa-md q-col-gutter-xl">
      <template v-if="$q.screen.gt.sm">
        <div class="col-auto">
          <q-icon name="fas fa-exclamation-triangle" size="md" />
        </div>
      </template>

      <div class="col text-body1">
        <p>
          Non hai ancora aperto il Fascicolo Sanitario Elettronico
        </p>

        <p class="q-mb-none">Se apri il Fascicolo:</p>

        <ul>
          <li>avrai un unico punto di accesso alla tua storia clinica</li>
          <li>potrai consultare il tuo fascicolo ovunque ti trovi</li>
          <li>
            potrai far arrivare velocemente al tuo medico curante le
            informazioni che ti riguardano
          </li>
          <li>potrai essere seguito con maggiore continuità</li>
          <li>potrai evitare esami ripetuti o non necessari.</li>
        </ul>

        <p class="q-mt-md q-mb-none">
          Il Fascicolo Sanitario Elettronico conterrà referti provenienti da ASR
          della Regione Piemonte e di altre regioni, oltre a referti provenienti
          da Aziende Private accreditate e altri documenti che tu stesso potrai
          inserire.
        </p>

        <div class="q-mt-md row q-col-gutter-md">
          <!--          <div class="col-auto">-->
          <!--            <q-checkbox-->
          <!--              v-model="doNotAskAgain"-->
          <!--              label="Non mostrarmi più questo messaggio"-->
          <!--              class="text-caption"-->
          <!--              dense-->
          <!--            />-->
          <!--          </div>-->

          <q-space />

          <div class="col-auto">
            <lms-buttons>
              <lms-button unelevated type="a" :href="enrollmentUrl">
                Apri il fascicolo
              </lms-button>

              <lms-button outline @click="onClose">
                Chiudi
              </lms-button>
            </lms-buttons>
          </div>
        </div>
      </div>
    </div>
  </q-banner>
</template>

<script>
import { saveDoNotAskMeAgain } from "../services/api";

export default {
  name: "FseEnrollmentBanner",
  props: {},
  data() {
    return {
      doNotAskAgain: false
    };
  },
  computed: {
    user() {
      return this.$store.getters["getUser"];
    },
    delegatorSelected() {
      return this.$store.getters["getDelegatorSelected"];
    },
    enrollmentUrl() {
      let serviceCode = "FSEDOC";
      if (this.delegatorSelected) {
        let taxCode = this.delegatorSelected.codice_fiscale_delega;

        return `/la-mia-salute/arruolamento/#/?d=${taxCode}&servizio=${serviceCode}`;
      }

      return  `/la-mia-salute/arruolamento/#/?servizio=${serviceCode}`;
    }
  },
  created() {},
  methods: {
    onClose() {
      let taxCode = this.$store.getters["getTaxCode"];

      // Proviamo a salvare la preferenza
      if (this.doNotAskAgain) {
        saveDoNotAskMeAgain(taxCode);
      }

      this.$emit("close");
    }
  }
};
</script>

<style scoped lang="sass"></style>
