<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-dialog v-bind="attrs" v-on="listeners" class="fse-document-pay-dialog">
    <q-card style="max-width: 800px">
      <q-toolbar>
        <q-toolbar-title>
          Pagamento del documento
        </q-toolbar-title>

        <q-btn v-close-popup flat round icon="close"  aria-label="chiudi finestra" />
      </q-toolbar>

      <q-card-section class="q-gutter-y-md">
        <p>
          Premendo continua verrai indirizzato al servizio Pagamento ticket in
          cui visualizzerai i tuoi ticket da pagare.
        </p>
        <p>
          Le tempistiche di registrazione del pagamento non sono immediate,
          potranno variare da pochi minuti a 24 ore in quanto dipendono dalle
          configurazioni delle Aziende sanitarie
        </p>
      </q-card-section>

      <q-card-section>
        <lms-buttons>
          <lms-button color="primary" @click="onConfirm">
            Continua
          </lms-button>
          <lms-button v-close-popup color="primary" outline>
            Annulla
          </lms-button>
        </lms-buttons>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { httpAuth } from "../boot/http";

export default {
  name: "FseDocumentPayDialog",
  inheritAttrs: false,
  props: {
    document: { type: Object, required: false, default: () => null }
  },
  data() {
    return {};
  },
  computed: {
    attrs() {
      const { ...attrs } = this.$attrs;
      return attrs;
    },
    listeners() {
      const { ...listeners } = this.$listeners;
      return listeners;
    }
  },
  created() {},
  methods: {
    onConfirm() {
      // @TODO: cosa fare quando l'utente conferma di voler effettuare il pagamento?
      //        Dobbiamo controllare di avere tutti i dati

      // @TODO: prendere la url dinamicamente dall'API GET /applicazioni
      let url = `/la-mia-salute/#/pagamenti-sanitari/paga-per-te`;
      let asl = this.document?.azienda ?? null;

      if (asl) {
        let params = { asl };
        url = httpAuth.getUri({ url, params });
        window.location.assign(url);
      }

      this.$emit("input", false);
    }
  }
};
</script>

<style lang="scss"></style>
