<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <lms-page v-bind="attrs" v-on="listeners" :padding="!menu && padding">
    <!-- NUOVA GESTIONE ARRUOLAMENTO -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
<!--    <template v-if="IS_NEW_ENROLLABLE_ACTIVE">-->
<!--      <div class="q-my-md">-->
<!--        <the-guard-enrollment2 :code="enrollmentCode" />-->

<!--        <template v-if="!isEnrollmentCodeBlocker">-->
<!--          <slot />-->
<!--        </template>-->
<!--      </div>-->
<!--    </template>-->

    <!-- VECCHIA GESTIONE ARRUOLAMENTO -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
<!--    <template v-else>-->
      <template v-if="menu">
        <div
          class="row q-col-gutter-x-xl"
          :class="{ 'no-margin': $q.screen.lt.lg }"
          style="min-height: inherit"
        >
          <!-- MENU A SINISTRA -->
          <!-- --------------------------------------------------------------------------------------------------------- -->
          <div class="gt-md col-md-3 col-lg-2">
            <tac-menu class="full-height bg-white" />
          </div>

          <!-- COLONNA PRINCIPALE -->
          <!-- --------------------------------------------------------------------------------------------------------- -->
          <div class="col-12 col-md" :class="{ 'q-pa-md': padding }">
            <slot />
          </div>
        </div>
      </template>

      <template v-else>
        <slot />
      </template>
<!--    </template>-->
  </lms-page>
</template>

<script>
import TacMenu from "./TacMenu";
import {IS_NEW_ENROLLABLE_ACTIVE} from "../services/config";

export default {
  name: "TacPage",
  components: { TacMenu },
  inheritAttrs: false,
  props: {
    menu: { type: Boolean, required: false, default: false },
    padding: { type: Boolean, required: false, default: false }
  },
  data() {
    return {
      IS_NEW_ENROLLABLE_ACTIVE
    };
  },
  computed: {
    activeUserEnrollmentInfo() {
      return this.$store.getters["getActiveUserEnrollmentInfo"];
    },
    listeners() {
      const { ...listeners } = this.$listeners;
      return listeners;
    },
    attrs() {
      const { ...attrs } = this.$attrs;
      return attrs;
    },
    enrollmentCode() {
      return this.activeUserEnrollmentInfo?.codice_risposta;
    },
    isEnrollmentCodeBlocker() {
      let BLOCK_CODE_LIST = [
        "000",
        "001",
        "002",
        "004",
        "005",
        "007",
        "010",
        "011",
        "012",
        "013",
        "015"
      ];

      return BLOCK_CODE_LIST.includes(this.enrollmentCode);
    }
  },
  created() {},
  methods: {}
};
</script>

<style scoped lang="sass"></style>
