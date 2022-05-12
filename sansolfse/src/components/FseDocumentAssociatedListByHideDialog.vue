<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-dialog
    v-bind="attrs"
    v-on="listeners"
    class="fse-associate-list-by-hide-dialog"
  >
    <q-card style="max-width: 800px">
      <q-toolbar>
        <q-toolbar-title>
          <template v-if="isHiding">
            Oscurerai anche questi documenti
          </template>
          <template v-else>
            Renderai visibili anche questi documenti
          </template>
        </q-toolbar-title>

        <q-btn v-close-popup flat round icon="close"  aria-label="chiudi finestra" />
      </q-toolbar>

      <q-card-section class="q-gutter-y-md">
        <fse-document-item
          v-for="document in documentList"
          :key="'hide-association--' + document.id_documento_ilec"
          :document="document"
        />
      </q-card-section>

      <q-card-section>
        <lms-buttons>
          <lms-button :loading="isSaving" @click="onSave">
            Continua
          </lms-button>
        </lms-buttons>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>

export default {
  name: "FseDocumentAssociatedListByHideDialog",
  inheritAttrs: false,
  // Nel nostro caso abbiamo:
  // <fse-document-item>
  //    <fse-document-associated-list-by-nre-dialog>
  //        <fse-document-item>
  // Come possiamo notare fse-document-item è un componente ricorsivo ed in questi casi siamo costretti ad importarlo
  // dinamicamente
  components: { FseDocumentItem: () => import("./FseDocumentItem") },
  props: {
    isHiding: { type: Boolean, required: false, default: false },
    documentList: { type: Array, required: false, default: () => [] },
    isSaving: { type: Boolean, required: false, default: false }
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
    onSave() {
      this.$emit("save");
    }
  }
};
</script>

<style scoped lang="sass"></style>
