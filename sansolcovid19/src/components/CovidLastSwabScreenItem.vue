<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="covid-last-swab-item row q-col-gutter-x-sm">
    <div class="col-auto">
      <covid-swab-icon :result-status-code="resultCode" :swab-type="typeCode" />
    </div>

    <div class="col full-height column">
      <div class="col">
        <div class="text-bold">Ultimo tampone</div>

        <!-- NO TAMPONI -->
        <!-- ---------- -->
        <template v-if="!swabLast">
          <div class="q-mt-md">Nessun tampone disponibile</div>
        </template>

        <template v-else>
          <div class="q-mt-md q-body-1 text-bold text-primary">
            <covid-swab-type-label :code="typeCode" />
          </div>

          <div class="q-mt-md q-body-1">
            Esito:
            <covid-swab-screen-result-label :code="resultCode" bold />
          </div>

          <template v-if="swabLast.risTampone">
            <div class="q-caption text-bold">
              {{ resultDate | date }}
            </div>
          </template>

          <!-- CUN -->
          <!-- --- -->
          <template v-if="isMolecular && isResultPositive && cun">
            <div class="q-mt-md q-body-1">CUN: {{ cun }}</div>

            <div class="q-mt-sm">
              <covid-cun-link />
            </div>
          </template>
        </template>
      </div>

      <template v-if="showAll">
        <div class="col-auto q-mt-lg text-right">
          <router-link :to="HOME_SWAB_LIST" class="lms-link">
            Vedi tutti
          </router-link>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import CovidSwabIcon from "./CovidSwabIcon";
import CovidSwabTypeLabel from "./CovidSwabTypeLabel";
import CovidCunLink from "./CovidCunLink";
import CovidSwabScreenResultLabel from "./CovidSwabScreenResultLabel";
import { HOME_SWAB_LIST } from "../router/routes";

export default {
  name: "CovidLastSwabScreenItem",
  components: {
    CovidSwabScreenResultLabel,
    CovidCunLink,
    CovidSwabTypeLabel,
    CovidSwabIcon,
  },
  props: {
    swabLast: { type: Object, required: false, default: () => null },
    showAll: { type: Boolean, required: false, default: false },
  },
  data() {
    return { HOME_SWAB_LIST };
  },
  computed: {
    swab() {
      return this.swabLast;
    },
    id() {
      return this.swab?.testId;
    },
    typeCode() {
      return this.swab?.testTipo?.testTipoCod;
    },
    resultDate() {
      return this.swab?.testDataEsecuzione;
    },
    resultCode() {
      return this.swab?.testEsito?.testEsitoCod;
    },
    isResultPositive() {
      return this.resultCode === this.$c.SWAB_SCREEN_RESULT_STATUS_MAP.POSITIVE;
    },
    cun() {
      return this.swab?.cun;
    },
    isMolecular() {
      let codes = [
        this.$c.SWAB_TYPE_CODE_MAP.FAST_A,
        this.$c.SWAB_TYPE_CODE_MAP.FAST_B,
        this.$c.SWAB_TYPE_CODE_MAP.SEROLOGICAL
      ];

      return !codes.includes(this.typeCode);
    },
  },
  created() {},
  methods: {},
};
</script>

<style scoped lang="scss"></style>
