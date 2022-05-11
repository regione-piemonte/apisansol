<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-dialog
    ref="modal"
    :value="value"
    :maximized="$q.screen.lt.md"
    class="rol-report-pay-modal"
    @input="$emit('input', $event)"
  >
    <q-card>
      <q-card-section>
        <p class="text-body1">
          Premendo <strong>"continua"</strong> verrai indirizzato al servizio
          Pagamento ticket in cui visualizzerai i tuoi ticket da pagare.
        </p>

        <p class="text-body1">
          Le tempistiche di registrazione del pagamento non sono immediate,
          potranno variare da pochi minuti a 24 ore in quanto dipendono dalle
          configurazioni delle Aziende sanitarie.
        </p>
      </q-card-section>

      <q-card-section>
        <lms-buttons class="q-mt-xl">
          <lms-button label="Continua" @click="onConfirm" />
          <lms-button v-close-popup outline label="Annulla" />
        </lms-buttons>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { getAsl } from "src/services/business-logic";

export default {
  name: "RolReportPayDialog",
  props: {
    value: { type: Boolean, required: false, default: false },
    report: { type: Object, required: true }
  },
  methods: {
    onConfirm() {
      let asr = getAsl(this.report);
      let url = "/la-mia-salute/#/pagamenti-sanitari";
      if (asr?.codice) url += `?asl=${asr.codice}`;
      window.location.assign(url);
      // chiudiamo la modal
      this.$emit("input", false);
    }
  }
};
</script>

<style lang="sass"></style>
