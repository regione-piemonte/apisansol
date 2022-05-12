<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-icon :name="icon" size="lg"/>
</template>

<script>
export default {
  name: "CovidSwabIcon",
  props: {
    resultStatusCode: {
      type: [String, Number],
      required: false,
      default: null,
    },
    swabType: {
      type: String,
      required: false,
      default: null,
    }
  },
  computed: {

    icon() {

      let result = "img:/statics/la-mia-salute/icone/tampone.svg";
      //cambia in base al tipo di tampone

      switch (this.swabType) {
        case this.$c.SWAB_TYPE_CODE_MAP.FAST_A:
          result = "img:/statics/la-mia-salute/icone/tampone-rapido.svg";
          break;
        case this.$c.SWAB_TYPE_CODE_MAP.FAST_B:
          result = "img:/statics/la-mia-salute/icone/tampone-rapido.svg";
          break;
        case this.$c.SWAB_TYPE_CODE_MAP.SEROLOGICAL:
          result = "img:/statics/la-mia-salute/icone/tampone-sierologico.svg";
          break;
        case this.$c.SWAB_TYPE_CODE_MAP.SALIVARY:
          result = "img:/statics/la-mia-salute/icone/tampone-salivare.svg";
          break;
        default:
          let code = parseInt(this.resultStatusCode);


          if ([this.$c.SWAB_RESULT_STATUS_MAP.PENDING].includes(code)) {
            result = "img:/statics/la-mia-salute/icone/tampone-in-attesa.svg";
          }

          if ([this.$c.SWAB_RESULT_STATUS_MAP.POSITIVE].includes(code)) {
            result = "img:/statics/la-mia-salute/icone/tampone-positivo.svg";
          }

          if ([this.$c.SWAB_RESULT_STATUS_MAP.NEGATIVE].includes(code)) {
            result = "img:/statics/la-mia-salute/icone/tampone-negativo.svg";
          }

          break;
      }

      return result;

    },
  },
};
</script>

<style lang="scss" scoped></style>
