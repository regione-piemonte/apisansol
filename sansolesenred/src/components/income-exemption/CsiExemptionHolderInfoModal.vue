<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-modal :value="value" v-bind="$attrs" v-on="$listeners">
    <q-modal-layout class="bg-grey-2">
      <q-toolbar slot="header">
        <q-toolbar-title>
          Maggiori informazioni
        </q-toolbar-title>
        <q-btn flat round icon="close" v-close-overlay></q-btn>
      </q-toolbar>

      <div class="q-pa-md">
        <h1 class="csi-h3 q-mb-md">Titolare esenzioni per reddito</h1>
        <p>
          Il titolare di un'esenzione è la persona che detiene la condizione necessaria per ottenere un'esenzione a
          favore di un beneficiario (es: Titolare che detiene la condizione di Disoccupato
          per cui il beneficiario può ottenere l'esenzione XXX, oppure Titolare di pensione minima, ecc.)
        </p>
      </div>
    </q-modal-layout>
  </q-modal>
</template>


<script>
    export default {
        name: 'CsiExemptionHolderInfoModal',
        inheritAttrs: false,
        components: {},
        props: {
            value: {type: Boolean, required: false, default: false}
        },
        data() {
            return {}
        },
        computed: {},
        created() {
        },
        methods: {},
    }
</script>


<style scoped lang="stylus"></style>
