<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="csi-prescription-preformance-item ">
    <template v-if="isPharmaceutical">

      <!--modifica fatta per evitare NC -->
      <div class="q-pl-md">
        <div v-if="performance.descrizione_aic!=='NC'&& performance.descrizione_aic!==''" class="text-weight-bold">
          {{performance.descrizione_aic}}
        </div>
        <div v-else class="text-weight-bold">{{performance.descrizione_gruppo_equivalenza}}</div>

        <div>Quantità: <strong> {{ performance.quantita }}</strong></div>
      </div>
    </template>

    <template v-else>
      <div class="text-weight-bold q-pl-md">{{performance.descrizione_catalogo_regionale}}</div>

      <div class="q-pl-md">
        <div>Quantità: <strong> {{ performance.quantita }}</strong></div>
        <div v-if="this.detail===true">
          <div v-if="performance.tipo_accesso==='1'">Tipo di accesso: <strong>Primo accesso </strong></div>
          <div v-else-if="performance.tipo_accesso==='0'">Tipo di accesso: <strong>Altra tipologia di accesso </strong>
          </div>
        </div>
      </div>
    </template>

    <div class="no-margin bg-grey-3 q-pb-xs" v-if="this.detail===true">

    </div>

  </div>
</template>


<script>
    export default {
        name: 'CsiPrescriptionPerformanceItem',
        components: {},
        props: {
            performance: {type: Object, required: true},
            isPharmaceutical: {type: Boolean, required: false, default: false},
            detail: {type: Boolean, required: false},
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
