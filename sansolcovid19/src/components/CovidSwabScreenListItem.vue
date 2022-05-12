<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="covid-swab-list-item">
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md">
        <q-item class="q-body-1 items-start">
          <q-item-section side>
            <covid-swab-icon :result-status-code="resultCode" :swab-type="typeCode" />
          </q-item-section>

          <q-item-section>
            <div class="text-bold">
              <covid-swab-type-label :code="typeCode" />
            </div>

            <div>
              Esito
              <covid-swab-screen-result-label :code="resultCode" bold />
            </div>
          </q-item-section>
        </q-item>
      </div>

      <div class="col-12 col-md">
        <q-item class="q-body-1">
          <q-item-section>
            <div>
              Esito del
              <span class="text-bold">
                {{ resultDate | date }}
              </span>
            </div>
          </q-item-section>
        </q-item>
      </div>

      <div class="col-12 col-md"></div>

      <div class="col-12 col-md">
        <template v-if="isMolecular && isResultPositive && cun">
          <q-item class="q-body-1">
            <q-item-section>
              <div>CUN</div>

              <div>
                <span class="text-bold">
                  {{ cun }}
                </span>
              </div>

              <div class="q-mt-sm">
                <covid-cun-link />
              </div>
            </q-item-section>
          </q-item>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import CovidSwabIcon from "./CovidSwabIcon";
import CovidSwabTypeLabel from "./CovidSwabTypeLabel";
import CovidCunLink from "./CovidCunLink";
import CovidSwabScreenResultLabel from "./CovidSwabScreenResultLabel";

export default {
  name: "CovidSwabScreenListItem",
  components: {
    CovidSwabScreenResultLabel,
    CovidCunLink,
    CovidSwabTypeLabel,
    CovidSwabIcon,
  },
  props: {
    swab: { type: Object, required: false, default: () => null },
  },
  data() {
    return {};
  },
  computed: {
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
        this.$c.SWAB_TYPE_CODE_MAP.SEROLOGICAL,

      ];

      return !codes.includes(this.typeCode);
    },
  },
  created() {},
  methods: {},
};
</script>

<style scoped lang="scss"></style>
