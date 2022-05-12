<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-card>
    <q-card-title>{{title}}</q-card-title>
    <q-card-main>
      <csi-policy :src="policyUrl" />
      <q-field v-if="!noToggle" class="q-mt-md">
        <q-toggle
          :value="value"
          @change="onChange"
          :label="toggleLabel">
        </q-toggle>
      </q-field>
    </q-card-main>
  </q-card>
</template>

<script>
  import CsiPolicy from "components/global/common/CsiPolicy";

  export default {
    name: 'CsiCardPolicy',
    components: {CsiPolicy},
    props: {
      title: {
        type: String,
        required: false,
        default: 'Informativa violazioni di legge in caso di dichiarazioni mendaci'
      },
      policyUrl: {type: String, required: true},
      noToggle: {type: Boolean, required: false, default: false},
      value: {type: Boolean, required: () => !this.noToggle, default: false},
      toggleLabel: {
        type: String,
        required: false,
        default: `Dichiaro di aver preso visione e dell'informativa e di accettare le condizioni d'uso`
      }
    },
    data() {
      return {}
    },
    methods: {
      onChange(newVal) {
        this.$emit('input', newVal);
      }
    },
  }
</script>

<style>
</style>
