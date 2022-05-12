<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="tac-guard-enrollment">
    <template v-if="isAuthorized">
      <slot />
    </template>

    <template v-else>
      <q-page padding>
        <div class="tac-guard-enrollment__container">
          <q-card class="q-my-xl">
            <q-card-section>
              <lms-enrollment-banner
                :activable="isEnrollable"
                @click-activate="onActivate"
              />
            </q-card-section>
          </q-card>
        </div>
      </q-page>
    </template>
  </div>
</template>

<script>
import {  HELP_CONTACTS } from "../router/routes";
import LmsEnrollmentBanner from "./core/LmsEnrollmentBanner";
import { getEnrollmentUrl } from "../services/urls";

// Su quali route l'utente non piemontese può comunque navigare?
const ROUTE_WHITELIST = [HELP_CONTACTS];

export default {
  name: "TacGuardEnrollment",
  components: { LmsEnrollmentBanner },
  props: {},
  data() {
    return {};
  },
  computed: {
    workingApp() {
      return this.$store.getters["getWorkingApp"];
    },
    enrollmentInfo() {
      return this.$store.getters["getEnrollmentInfo"];
    },
    isUserEnrolled() {
      return this.$store.getters["isUserEnrolled"];
    },
    isUserEnrollable() {
      return this.$store.getters["isUserEnrollable"];
    },
    delegatorSelected() {
      return this.$store.getters["getDelegatorSelected"];
    },
    delegatorSelectedEnrollmentInfo() {
      return this.$store.getters["getDelegatorSelectedEnrollmentInfo"];
    },
    isDelegatorSelectedEnrolled() {
      return this.$store.getters["isDelegatorSelectedEnrolled"];
    },
    isDelegatorSelectedEnrollable() {
      return this.$store.getters["isDelegatorSelectedEnrollable"];
    },
    isRouteFree() {
      return ROUTE_WHITELIST.some(r => r.name === this.$route.name);
    },
    isEnrolled() {
      return this.delegatorSelected
        ? this.isDelegatorSelectedEnrolled
        : this.isUserEnrolled;
    },
    isEnrollable() {
      return this.delegatorSelected
        ? this.isDelegatorSelectedEnrollable
        : this.isUserEnrollable;
    },
    isAuthorized() {
      return this.isEnrolled || this.isRouteFree;
    }
  },
  created() {},
  methods: {
    onActivate() {
      let url = getEnrollmentUrl();

      url += `?url_ritorno=${encodeURIComponent(window.location.href)}`;
      if (this.delegatorSelected) {
        url += `&d=${this.delegatorSelected?.codice_fiscale_delega}&servizio=${this.workingApp?.codice_servizio}`;
      }

      window.location.assign(url);
    }
  }
};
</script>

<style lang="scss">
.tac-guard-enrollment__container {
  margin-left: auto;
  margin-right: auto;
  max-width: 680px;
}
</style>
