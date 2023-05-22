<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-dialog
    v-bind="attrs"
    v-on="listeners"
    class="fse-associate-list-by-episode-dialog"
  >
    <q-card style="max-width: 800px">
      <q-toolbar>
        <q-toolbar-title>
          Documenti associati per episodio
        </q-toolbar-title>

        <q-btn v-close-popup flat round icon="close"  aria-label="chiudi finestra" />
      </q-toolbar>

      <q-card-section class="q-gutter-y-md">
        <cod-document-item
          v-for="document in documentList"
          :key="'episode-association--' + document.id_documento_ilec"
          :document="document"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>

import CodDocumentItem from "components/CodDocumentItem";
export default {
  name: "CodDocumentAssociatedListByEpisodeDialog",
  inheritAttrs: false,
  // Come possiamo notare fse-document-item è un componente ricorsivo ed in questi casi siamo costretti ad importarlo
  // dinamicamente
  components: {CodDocumentItem: () => import("./CodDocumentItem") },
  props: {
    documentList: { type: Array, required: false, default: () => [] }
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
  methods: {}
};
</script>

<style scoped lang="sass"></style>
