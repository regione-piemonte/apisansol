<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="tac-guard-piedmont-user">
    <template v-if="isAuthorized">
      <slot />
    </template>

    <template v-else>
      <q-page padding>
        <div class="tac-guard-piedmont-user__container">
          <q-card class="q-my-xl">
            <q-card-section>
              <div class="row q-col-gutter-md">
                <div class="col-12 col-sm">
                  <img
                    src="images/no-piemonte-banner.svg"
                    alt="Immagine non piemontese"
                    class="responsive"
                  />
                </div>

                <div class="col-12 col-sm">
                  <div class="q-pa-md">
                    Servizio disponibile solo per i cittadini che hanno
                    l'assistenza sanitaria attiva in Piemonte
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
const ROUTE_WHITELIST = [ HELP_CONTACTS];

export default {
  name: "TacGuardPiedmontUser",
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
    isDelegatorSelectedPiedmont() {
      return this.$store.getters["isDelegatorSelectedPiedmont"];
    },
    isRouteFree() {
      return ROUTE_WHITELIST.some(r => r.name === this.$route.name);
    },
    isAuthorized() {
      if (this.delegatorSelected) {
        return this.isDelegatorSelectedPiedmont || this.isRouteFree;
      }

      return this.userInfo || this.isRouteFree;
    }
  },
  created() {},
  methods: {}
};
</script>

<style lang="scss">
.tac-guard-piedmont-user__container {
  margin-left: auto;
  margin-right: auto;
  max-width: 680px;
}
</style>
