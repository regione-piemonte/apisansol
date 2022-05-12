<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-dialog
    v-bind="attrs"
    v-on="listeners"
    :maximized="$q.screen.lt.sm"
    full-width
    full-height
    class="paperino"
  >
    <q-card class="tac-policy-fse-dialog">
      <q-toolbar>
        <q-toolbar-title>
          Informativa consultazione
        </q-toolbar-title>

        <q-btn v-close-popup flat round dense icon="close" />
      </q-toolbar>

      <q-card-section>
        <lms-policy :src="lastPolicyVersionPdfUrl" iframe-styles="height: 80vh" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import LmsPolicy from "./core/LmsPolicy";
import { getLastFsePolicyUrl } from "../services/api";

export default {
  name: "TacPolicyFseDialog",
  inheritAttrs: false,
  components: { LmsPolicy },
  props: {},
  data() {
    return {};
  },
  computed: {
    listeners() {
      const { transition, ...listeners } = this.$listeners;
      return listeners;
    },
    attrs() {
      const { ...attrs } = this.$attrs;
      return attrs;
    },
    lastPolicyVersionPdfUrl() {
      let taxCode = this.$store.getters["getTaxCode"];
      return getLastFsePolicyUrl(taxCode);
    }
  },
  created() {},
  methods: {}
};
</script>

<style lang="scss">
.tac-policy-fse-dialog {
  // width: 800px;
  // max-width: 800px !important;
}
</style>
