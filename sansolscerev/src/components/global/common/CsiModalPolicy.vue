<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-modal :value="value"
           @input="onInput"
           :minimized="minimized"
           :maximized="maximized"
           :content-css="contentCss"
           ref="modal">

    <q-modal-layout header-class="no-shadow">
      <q-toolbar slot="header" color="transparent" text-color="black">
        <q-toolbar-title></q-toolbar-title>
        <q-btn flat round icon="close" v-close-overlay />
      </q-toolbar>

      <div class="q-pa-sm">
        <CsiPolicy :src="policy" :iframe-styles="{'height': '80vh'}" />
      </div>
    </q-modal-layout>
  </q-modal>
</template>

<script>
  import CsiPolicy from "components/global/common/CsiPolicy";

  export default {
    name: 'CsiModalPolicy',
    components: {CsiPolicy},
    props: {
      value: {required: false},
      policy: {type: String, required: true},
      minimized: {type: Boolean, required: false, default: false},
      maximized: {type: Boolean, required: false, default: false},
      contentCss: {
        type: Object,
        required: false,
        default: () => ({maxWidth: '800px'})
      }
    },
    data() {
      return {}
    },
    methods: {
      onInput(newVal) {
        this.$emit('input', newVal);
      },
      show() {
        return this.$refs.modal.show();
      },
      hide() {
        return this.$refs.modal.hide();
      },
      toggle() {
        return this.$refs.modal.toggle();
      }
    },
  }
</script>

<style>
</style>
