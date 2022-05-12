<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<!--
Dal momento che un delegato debole non può creare un taccuino per il suo delegante,
questo componente serve ad informare il cittadino che il suo delegante non ha un taccuino.
-->

<template>
  <div class="tac-guard-notebook-closed">
    <template v-if="isAuthorized">
      <slot />
    </template>

    <template v-else>
      <q-page padding>
        <div class="tac-guard-notebook-closed__container">
          <q-card class="q-my-xl">
            <q-card-section>
              <div class="row q-col-gutter-md">
                <div class="col-12 col-sm">
                  <img
                    src="images/no-piemonte-banner.svg"
                    alt="Immagine nessun taccuno"
                    class="responsive"
                  />
                </div>

                <div class="col-12 col-sm">
                  <div class="q-pa-md">
                    Non hai ancora creato un taccuino.
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </q-page>
    </template>
  </div>
</template>

<script>
import {  HELP_CONTACTS } from "../router/routes";

// Su quali route l'utente non piemontese può comunque navigare?
const ROUTE_WHITELIST = [HELP_CONTACTS];

export default {
  name: "TacGuardNotebookClosed",
  props: {},
  data() {
    return {};
  },
  computed: {
    userInfo() {
      return this.$store.getters["getUserInfo"];
    },
    delegatorSelected() {
      return this.$store.getters["getDelegatorSelected"];
    },
    isNotebookClosed() {
      return this.$store.getters["isNotebookClosed"];
    },
    isRouteFree() {
      return ROUTE_WHITELIST.some(r => r.name === this.$route.name);
    },
    isAuthorized() {
      if (this.delegatorSelected) {
        return !this.isNotebookClosed || this.isRouteFree;
      }

      return true;
    }
  },
  created() {},
  methods: {}
};
</script>

<style lang="scss">
.tac-guard-notebook-closed__container {
  margin-left: auto;
  margin-right: auto;
  max-width: 680px;
}
</style>
