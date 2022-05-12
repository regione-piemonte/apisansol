<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-dialog ref="dialog" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-toolbar>
        <q-toolbar-title>
          Momentaneamente sospeso
        </q-toolbar-title>
      </q-toolbar>
      <q-card-section>
        <p>
          Nel corso della Fase 2 dell'emergenza relativa al virus COVID-19 per
          richiedere un appuntamento o per spostare un appuntamento già fissato
          è necessario contattare il Centro di Screening della propria ASL.
        </p>
        <p>
          Il servizio on line di prenotazione appuntamenti per gli esami di
          screening oncologici, pertanto, resterà sospeso fino a nuova
          disposizione.
        </p>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn v-close-popup flat color="primary">Ok</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: "HomeAppInMaintenanceDialogScreening",
  props: {},
  data() {
    return {};
  },
  computed: {},
  created() {},
  methods: {
    // following method is REQUIRED
    // (don't change its name --> "show")
    show() {
      this.$refs.dialog.show();
    },

    // following method is REQUIRED
    // (don't change its name --> "hide")
    hide() {
      this.$refs.dialog.hide();
    },

    onDialogHide() {
      // required to be emitted
      // when QDialog emits "hide" event
      this.$emit("hide");
    },

    onOKClick() {
      // on OK, it is REQUIRED to
      // emit "ok" event (with optional payload)
      // before hiding the QDialog
      this.$emit("ok");
      // or with payload: this.$emit('ok', { ... })

      // then hiding dialog
      this.hide();
    },

    onCancelClick() {
      // we just need to hide dialog
      this.hide();
    }
  }
};
</script>

<style scoped lang="sass"></style>
