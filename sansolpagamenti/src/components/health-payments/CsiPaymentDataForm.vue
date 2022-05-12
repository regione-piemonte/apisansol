<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<style scoped></style>


<template>
  <div>
    <q-field class="q-my-sm" required :error="$v.asrSelected.$error">
      <!-- ASR -->
      <q-select
        :value="asrSelected"
        @input="onAsrSelected"
        :options="asrOptions"
        float-label="Azienda sanitaria"
        filter
        autofocus-filter
        filter-placeholder="Cerca tra le Aziende Sanitarie"
      />

<!--      <template slot="helper">-->
<!--        Al momento è possibile effettuare altri pagamento solo per l'Azienda Sanitaria Ospedaliera "Mauriziano"-->
<!--      </template>-->

      <template slot="error-label">
        <slot name="asr-selected-error-label">
          <div v-if="!$v.asrSelected.required">Campo obbligatorio</div>
        </slot>
      </template>
    </q-field>

    <!-- CAUSALE -->
    <q-field class="q-my-sm" required :error="$v.reasonSelected.$error">
      <q-select
        :value="reasonSelected"
        @input="onReasonSelected"
        :options="reasonOptions"
        :disable="!asrSelected"
        clearable
        float-label="Causale"
        filter
        autofocus-filter
        filter-placeholder="Cerca tra le causali"
      />

      <template slot="error-label">
        <slot name="reason-selected-error-label">
          <div v-if="!$v.reasonSelected.required">Campo obbligatorio</div>
        </slot>
      </template>
    </q-field>

    <!-- IMPORTO DA PAGARE -->
    <q-field class="q-my-sm" required :error="$v.toPay.$error">
      <q-input
        :value="toPay"
        @input="$emit('update:toPay', $event)"
        clearable
        type="number"
        :decimals="2"
        prefix="€"
        float-label="Importo da pagare"
        min="0.00"
      />

      <template slot="helper">
        <div>Euro nel formato 00,00</div>
      </template>

      <template slot="error-label">
        <slot name="to-pay-error-label">
          <div v-if="!$v.toPay.required">Campo obbligatorio</div>
        </slot>
      </template>
    </q-field>
  </div>
</template>


<script>
  import {getAsr} from "@services/api/health-payments";


  const DEFAULT_VALIDATION = {
    asrSelected: {},
    reasonSelected: {},
    toPay: {}
  }

  export default {
    name: "CsiPaymentDataForm",
    props: {
      asrSelected: {type: [String, Number], required: false, default: null},
      reasonSelected: {type: [String, Number], required: false, default: null},
      toPay: {type: [String, Number], required: false, default: 0},
      $v: {type: Object, required: false, default: () => DEFAULT_VALIDATION}
    },
    data() {
      return {
        asrs: []
      }
    },
    computed: {
      asrOptions() {
        return this.asrs.map(asr => {
          return {label: asr.descrizione, value: asr.id, _model: asr};
        });
      },
      reasons() {
        if (!this.asrSelected) return [];
        let asr = this.getAsr(this.asrSelected);
        return asr.causali_versamento;
      },
      reasonOptions() {
        return this.reasons.map(c => {
          // return {label: c.descrizione, value: c.codice_versamento, _model: c};
          return {label: c.descrizione, value: c.id, _model: c};
        });
      },
    },
    async created() {
      let response = await getAsr();
      this.asrs = response.data;
      //
      // // In produzione al momento supportiamo solo l'AS Mauriziano
      // if (this.$config.global.isProduction) {
      //   this.asrs = response.data.filter(a => a.id === 908);
      //   // Dal momento che supportiamo solo un'AS la preselezioniamo
      //   this.onAsrSelected(this.asrOptions[0] && this.asrOptions[0].value);
      // }
    },
    methods: {
      getAsr(asrId) {
        return this.asrs.find(asr => asr.id === asrId);
      },
      onAsrSelected(asrId) {
        this.$emit('update:asrSelected', asrId);
        this.$nextTick(() => {
          // Rimuoviamo la causale di pagamento selezionata solamente se questa non è supportata dalla nuova
          // ASL selezionata dall'utente
          // let reason = this.reasons.find(r => r.codice_versamento === this.reasonSelected);
          let reason = this.reasons.find(r => r.id === this.reasonSelected);
          if (!reason) this.$emit('update:reasonSelected', null);
        });
      },
      onReasonSelected(reasonId){
        let reasonSelectedModel = this.reasons.find(el => el.id === reasonId);
        this.$emit('update:reasonSelected', reasonId, reasonSelectedModel)
      }
    }
  }
</script>
