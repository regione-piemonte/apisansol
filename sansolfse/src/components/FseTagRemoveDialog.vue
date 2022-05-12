<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-dialog v-bind="attrs" v-on="listeners" class="fse-tag-remove-dialog">
    <q-card>
      <q-toolbar>
        <q-toolbar-title>
          Rimuovi etichetta
        </q-toolbar-title>

        <q-btn v-close-popup flat round icon="close"   aria-label="chiudi finestra"/>
      </q-toolbar>

      <q-card-section>
        Vuoi davvero rimuovere l'etichetta <span class="text-bold">{{ tagName }}</span>?
      </q-card-section>

      <q-card-section>
        <lms-buttons>
          <lms-button :loading="isRemoving" @click="onRemove">
            Rimuovi
          </lms-button>
          <lms-button v-close-popup outline>Annulla</lms-button>
        </lms-buttons>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { deleteTag } from "../services/api";
import {apiErrorNotifyDialog, notifySuccess} from "../services/utils";

export default {
  name: "FseTagRemoveDialog",
  props: {
    tag: { type: Object, required: false, default: () => null }
  },
  data() {
    return {
      isRemoving: false
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
      return this.tag?.testo ?? "";
    }
  },
  created() {},
  methods: {
    async onRemove() {
      let taxCode = this.$store.getters["getTaxCode"];
      let tagId = this.tag?.id;

      this.isRemoving = true;

      try {
        await deleteTag(taxCode, tagId);
        this.$emit("input", false);
        this.$emit("removed", this.tag);
        notifySuccess("Etichetta rimossa");
      } catch (error) {
        let message = "Non è stato possibile rimuovere l'etichetta";
        apiErrorNotifyDialog({ error, message });
      }

      this.isRemoving = false;
    }
  }
};
</script>

<style scoped lang="sass"></style>
