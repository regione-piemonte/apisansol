<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-icon :name="icon" size="lg" />
</template>

<script>
import { EVENT_TYPE_CODE_MAP } from "../services/config";

const C = EVENT_TYPE_CODE_MAP;
const FALLBACK = { icon: "img:/statics/la-mia-salute/icone/casa-bianca.svg" };
const EVENT_MAP = {
  [C.HOME_ISOLATION]: { icon: "img:/statics/la-mia-salute/icone/casa-bianca.svg" },
  [C.HOSPITALIZED]: { icon: "img:/statics/la-mia-salute/icone/letto-ospedale.svg" },
  [C.TRANSFERRED_INTERNAL]: { icon: "img:/statics/la-mia-salute/icone/ospedale.svg" },
  [C.TRANSFERRED_ETERNAL]: { icon: "img:/statics/la-mia-salute/icone/strutture-sanitarie-multiple.svg" },
  [C.DEAD]: { icon: "img:/statics/la-mia-salute/icone/crocifisso.svg" },
  [C.DEAD_NO_COVID]: { icon: "img:/statics/la-mia-salute/icone/crocefisso.svg" },
  [C.HEALED]: { icon: "img:/statics/la-mia-salute/icone/faccia-felice.svg" },
  [C.TEST_WAITING]: { icon: "img:/statics/la-mia-salute/icone/tampone-in-attesa.svg" },
  [C.POST_HOSPITALIZATION]: { icon: "img:/statics/la-mia-salute/icone/letto-ospedale-ok.svg" },
  [C.HOME_ASSIGNMENT]: { icon: "img:/statics/la-mia-salute/icone/casa-blu.svg" },
  [C.REPORTED]: { icon: "img:/statics/la-mia-salute/icone/megafono.svg" },
  [C.IN_CHARGE]: { icon: "img:/statics/la-mia-salute/icone/kit-medico.svg" },
  [C.LEAVED]: { icon: "img:/statics/la-mia-salute/icone/faccia-felicissima.svg" },
  [C.MORE_INFO]: { icon: "img:/statics/la-mia-salute/icone/matita-attenzione.svg" },
  [C.ISOLATION]: { icon: "img:/statics/la-mia-salute/icone/casa-bianca.svg" },
  [C.HOME_ISOLATION_DISPOSED]: { icon: "img:/statics/la-mia-salute/icone/casa-bianca.svg" },
  [C.HOME_ASSIGNMENT_DISPOSED]: { icon: "img:/statics/la-mia-salute/icone/casa-blu.svg" },
  [C.END_OF_QUARANTINE]: { icon: "img:/statics/la-mia-salute/icone/faccia-felicissima.svg" },
};

export default {
  name: "CovidEventIcon",
  props: {
    typeCode: { type: [String, Number], required: false, default: null },
  },
  computed: {
    icon() {
      // return FALLBACK.icon;
      let code = parseInt(this.typeCode);
      let result = EVENT_MAP[code];
      if (!result) result = FALLBACK;
      return result.icon;
    },
  },
};
</script>

<style scoped lang="scss"></style>
