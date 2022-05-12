<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<style scoped>
  .vue-barcode-element{
    max-width: 100%;
  }

</style>


<template>

    <svg v-if="valid"
         @click="$emit('click', $event)"
         ref="barcodeSvg"
         class="vue-barcode-element">
    </svg>

    <div v-else>
      <slot></slot>
    </div>
</template>


<script>
  import * as JsBarcode from 'jsbarcode';

  export default {
    name: "CsiBarcode",
    props: {
      value: [String, Number],
      format: [String],
      width: [String, Number],
      height: [String, Number],
      text: [String, Number],
      fontOptions: [String],
      font: [String],
      textAlign: [String],
      textPosition: [String],
      textMargin: [String, Number],
      fontSize: [String, Number],
      background: [String],
      lineColor: [String],
      margin: [String, Number],
      marginTop: [String, Number],
      marginBottom: [String, Number],
      marginLeft: [String, Number],
      marginRight: [String, Number],
      displayValue: {
        type: [String, Boolean],
        default: true
      }
    },
    data() {
      return {
        valid: true
      };
    },
    computed: {
      settings() {
        return {
          format: this.format,
          height: this.height,
          width: this.width,
          text: this.text,
          fontOptions: this.fontOptions,
          font: this.font,
          textAlign: this.textAlign,
          textPosition: this.textPosition,
          textMargin: this.textMargin,
          fontSize: this.fontSize,
          background: this.background,
          lineColor: this.lineColor,
          margin: this.margin,
          marginTop: this.marginTop,
          marginBottom: this.marginBottom,
          marginLeft: this.marginLeft,
          marginRight: this.marginRight,
          valid: (valid) => {
            this.valid = valid;
          },
          displayValue: this.displayValue
        };
      },
      validSettings() {
        let settings = this.settings;

        for (let prop in settings) {
          if (settings.hasOwnProperty(prop) && settings[prop] === undefined) {
            delete settings[prop];
          }
        }

        return settings;
      }
    },
    mounted() {
      this.$watch('$props', this.render, {deep: true, immediate: true});
    },
    methods: {
      render() {
        let el = this.$refs.barcodeSvg;
        JsBarcode(el, this.value, this.validSettings);

        // Rimuoviamo la larghezza e l'altezza dal momento che vogliamo che l'SVG scali
        //el.removeAttribute('width');
        //el.removeAttribute('height');
      }
    }
  }
</script>
