<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-dialog
    v-bind="attrs"
    v-on="listeners"
    class="fse-tag-edit-dialog"
    @before-show="onBeforeShow"
    @hide="onHide"
  >
    <q-card>
      <q-toolbar>
        <q-toolbar-title>
          Modifica etichetta
        </q-toolbar-title>

        <q-btn v-close-popup flat round icon="close"   aria-label="chiudi finestra"/>
      </q-toolbar>

      <q-card-section>
        Stai modificando l'etichetta
        <span class="text-bold">{{ tagName }}</span>
      </q-card-section>

      <q-form greedy novalidate autofocus @submit.prevent="onEdit">
        <q-card-section>
          <q-input
            type="text"
            v-model="name"
            label="Nuovo nome etichetta"
            outlined
            required
            :rules="[v => !!v || 'Campo obbligatorio']"
            no-error-icon
          />
        </q-card-section>

        <q-card-section>
          <lms-buttons>
            <lms-button type="submit" :loading="isEditing">Modifica</lms-button>
            <lms-button v-close-popup outline>Annulla</lms-button>
          </lms-buttons>
        </q-card-section>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script>
import { editTag } from "../services/api";
import {apiErrorNotifyDialog, notifySuccess} from "../services/utils";

export default {
  name: "FseTagEditDialog",
  props: {
    tag: { type: Object, required: false, default: null }
  },
  data() {
    return {
      isEditing: false,
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
    },
    tagName() {
      return this.tag?.testo;
    }
  },
  created() {},
  methods: {
    onBeforeShow() {
      this.name = this.tagName ?? "";
    },
    onHide() {
      this.name = "";
    },
    async onEdit() {
      let taxCode = this.$store.getters["getTaxCode"];
      let tagId = this.tag?.id;

      let payload = {
        testo_etichetta: this.name
      };

      this.isEditing = true;

      try {
        let { data } = await editTag(taxCode, tagId, payload);
        this.$emit("input", false);
        this.$emit("edited", { ...this.tag, testo: this.name });
        notifySuccess("Etichetta modificata");
      } catch (error) {
        let message = "Non è stato possibile modificata l'etichetta";
        apiErrorNotifyDialog({ error, message });
      }

      this.isEditing = false;
    }
  }
};
</script>

<style scoped lang="sass"></style>
