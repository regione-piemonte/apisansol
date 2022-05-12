<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-dialog
    v-bind="attrs"
    v-on="listeners"
    class="fse-tag-create-dialog"
    @hide="onHide"
  >
    <q-card>
      <q-toolbar>
        <q-toolbar-title>
          Nuova etichetta
        </q-toolbar-title>

        <q-btn v-close-popup flat round icon="close"   aria-label="chiudi finestra"/>
      </q-toolbar>

      <q-card-section>
        Inserisci una nuova etichetta
      </q-card-section>

      <q-form greedy novalidate autofocus @submit.prevent="onSave">
        <q-card-section>
          <q-input
            type="text"
            v-model="name"
            label="Nome etichetta"
            outlined
            required
            :rules="[v => !!v || 'Campo obbligatorio']"
            no-error-icon
          />
        </q-card-section>

        <q-card-section>
          <lms-buttons>
            <lms-button type="submit" :loading="isSaving">Crea</lms-button>
            <lms-button v-close-popup outline>Annulla</lms-button>
          </lms-buttons>
        </q-card-section>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script>
import { createTag } from "../services/api";
import {apiErrorNotifyDialog, notifySuccess} from "../services/utils";

export default {
  name: "FseTagCreateDialog",
  props: {},
  data() {
    return {
      isSaving: false,
      name: ""
    };
  },
  computed: {
    attrs() {
      const { ...attrs } = this.$attrs;
      return attrs;
    },
    listeners() {
      const { ...listeners } = this.$listeners;
      return listeners;
    },
    user() {
      return this.$store.getters["getUser"];
    }
  },
  created() {},
  methods: {
    onHide() {
      this.name = "";
    },
    async onSave() {
      let taxCode = this.$store.getters["getTaxCode"];

      let payload = {
        testo_etichetta: this.name
      };

      this.isSaving = true;

      try {
        let { data } = await createTag(taxCode, payload);
        this.$emit("input", false);
        this.$emit("created", data);
        notifySuccess("Etichetta create");
      } catch (error) {
        let message = "Non è stato possibile creare l'etichetta";
        apiErrorNotifyDialog({ error, message });
      }

      this.isSaving = false;
    }
  }
};
</script>

<style scoped lang="sass"></style>
