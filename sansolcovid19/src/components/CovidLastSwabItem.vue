<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="covid-last-swab-item row q-col-gutter-x-sm">
    <div class="col-auto">
      <covid-swab-icon :result-status-code="swabLastResultStatusCode" :swab-type="swabLastTypeCode" />
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
            <covid-swab-type-label :code="swabLastTypeCode" />
          </div>

          <div class="q-caption">
            Richiesto il
            <span class="text-bold">
              {{ swabLast.dataInserimentoRichiesta | date | empty }}
            </span>
          </div>

          <template v-if="swabLast.hotspotDispeffId">
            <div class="q-mt-md q-body-1">
              Appuntamento il: <br />
              <span class="q-caption text-bold">
                {{ swabLast.hotspotDispeffFasciaDa | date }}
                {{ swabLast.hotspotDispeffFascia }}
              </span>
            </div>

            <div class="q-mt-sm q-body-1">
              Presso: <br />
              <span class="q-caption">
                {{ swabLast.hotspotDesc }}
              </span>
            </div>
          </template>

          <div class="q-mt-md q-body-1">
            Esito:
            <covid-swab-result-label :code="swabLastResultStatusCode" bold />
          </div>

          <template v-if="swabLast.risTampone">
            <div class="q-caption text-bold">
              {{ swabLast.dataTest | date }}
            </div>
          </template>

          <!-- CUN -->
          <!-- --- -->
          <template
            v-if="
              swabLastIsMolecular && swabLastIsResultPositive && swabLastCun
            "
          >
            <div class="q-mt-md q-body-1">CUN: {{ swabLastCun }}</div>

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
import CovidCunLink from "./CovidCunLink";
import CovidSwabTypeLabel from "./CovidSwabTypeLabel";
import CovidSwabResultLabel from "./CovidSwabResultLabel";
import {HOME_SWAB_LIST} from "../router/routes";

export default {
  name: "CovidLastSwabItem",
  components: {
    CovidSwabResultLabel,
    CovidSwabTypeLabel,
    CovidCunLink,
    CovidSwabIcon,
  },
  props: {
    swabLast: { type: Object, required: false, default: () => null },
    showAll: { type: Boolean, required: false, default: false },
  },
  data() {
    return {
      HOME_SWAB_LIST
    };
  },
  computed: {
    swabLastTypeCode() {
      return (
        this.swabLast &&
        this.swabLast.testTipo &&
        this.swabLast.testTipo.testTipoCod
      );
    },
    swabLastResultStatusCode() {
      return (
        this.swabLast &&
        this.swabLast.risTampone &&
        this.swabLast.risTampone.idRisTamp
      );
    },
    swabLastIsResultPositive() {
      return (
        this.swabLastResultStatusCode ===
        this.$c.SWAB_RESULT_STATUS_MAP.POSITIVE
      );
    },
    swabLastCun() {
      return this.swabLast && this.swabLast.cun;
    },
    swabLastIsMolecular() {
      let codes = [
        this.$c.SWAB_TYPE_CODE_MAP.FAST_A,
        this.$c.SWAB_TYPE_CODE_MAP.FAST_B,
        this.$c.SWAB_TYPE_CODE_MAP.SEROLOGICAL,
      ];

      return !codes.includes(this.swabLastTypeCode);
    },
  },
  created() {},
  methods: {},
};
</script>

<style scoped lang="scss"></style>
