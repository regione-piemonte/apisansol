<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div>
    <!-- CODICE FISCALE -->
    <csi-input-tax-code
      required
      :value="taxCode"
      @input="$emit('update:taxCode', $event)"
      :error="$v.taxCode.$error"
      clearable>

      <div slot="error-label">
        <slot name="tax-code-error-label">
          <div v-if="!$v.taxCode.required">Campo obbligatorio</div>
          <div v-if="!$v.taxCode.numeric">Deve essere composto solo da numeri</div>
          <div v-if="!$v.taxCode.alphaNum">Deve essere composto solo da lettere e numeri</div>
          <div v-if="!$v.taxCode.taxCodeLength">Deve avere esattamente {{taxCodeTemporaryLength}} o {{taxCodeLength}}
            caratteri
          </div>
          <div v-else>
            <div v-if="!$v.taxCode.taxCodeCin">
              Il codice di controllo non è corretto, potrebbero esserci degli errori di battitura
            </div>
          </div>
        </slot>
      </div>

    </csi-input-tax-code>

    <!-- ASL -->
    <q-field class="q-my-md" required :error="$v.aslSelected.$error">
      <q-select
        :value="aslSelected"
        @input="$emit('update:aslSelected', $event)"
        :options="aslOptions"
        float-label="Seleziona azienda sanitaria"
        filter
      />

      <template slot="error-label">
        <slot name="asl-selected-error-label">
          <div v-if="!$v.aslSelected.required">Campo obbligatorio</div>
        </slot>
      </template>
    </q-field>

    <!-- SELEZIONE TIPOLOGIA -->
    <q-field v-if="canUseNre" class="q-my-md" required :error="$v.procedureSelected.$error">
      <q-select
        :value="procedureSelected"
        @input="$emit('update:procedureSelected', $event)"
        :options="procedureOptions"
        float-label="Cerca tramite"
        :disable="!canUseNre"
      />

      <template slot="error-label">
        <slot name="procedure-selected-error-label">
          <div v-if="!$v.procedureSelected.required">Campo obbligatorio</div>
        </slot>
      </template>
    </q-field>

    <!-- NUMERO -->
    <q-field class="q-my-md" required :error="$v.number.$error" count>
      <q-input
        type="text"
        :value="number"
        @input="$emit('update:number', $event)"
        clearable
        :float-label="NUMBER_LABELS[procedureSelected]"
        name="ticket-number"
        autocomplete="on"
        :after="ticketNumberActions"
        upper-case
      />

      <template slot="helper">
        <template v-if="mustReplaceCR">
          <transition appear appear-active-class="animated fast shake">
            <div class="q-body-1">
              Per questo ticket è necessario sostituire "CR" con "00"
            </div>
          </transition>
        </template>

        <template v-if="mustReplace01">
          <transition appear appear-active-class="animated fast shake">
            <div class="q-body-1">
              Sostituire S21301<strong>01</strong> con S21301<strong>11</strong>
            </div>
          </transition>
        </template>

        <template v-if="mustReplaceXX">
          <transition appear appear-active-class="animated fast shake">
            <div class="q-body-1">
              Per questo ticket è necessario sostituire "XX" con "06"
            </div>
          </transition>
        </template>

        <template v-if="!isReceiptSelected && isAslSelected">
          <a href="#" @click.prevent="showModal">Come trovo l'identificativo ticket/posizione debitoria?</a>
        </template>
      </template>

      <template slot="error-label">
        <slot name="number-error-label">
          <div v-if="!$v.number.required">Campo obbligatorio</div>
        </slot>

        <slot name="asl-match-error-label">
          <div v-if="!$v.number.aslMatch">
            Hai selezionato {{aslSelectedLabel}} ma stai inserendo l'identificativo di un ticket su {{nprAslLabel}}
          </div>
        </slot>
      </template>
    </q-field>


    <!-- MODALS -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <csi-health-payment-number-helper-modal v-model="isNumberHelperModalVisible" :asr-id="aslSelected"/>

    <template v-if="isBarcodeReaderModalVisible">
      <q-modal v-model="isBarcodeReaderModalVisible">
        <q-modal-layout footer-class="shadow-0">
          <q-toolbar slot="header">
            <q-toolbar-title>Scansiona codice a barre</q-toolbar-title>
            <q-btn round flat icon="close" v-close-overlay/>
          </q-toolbar>

          <csi-barcode-reader
            ref="barcodeReader"
            locate
            half-sample
            show-boxes
            @success="onSuccess"
          />

        </q-modal-layout>
      </q-modal>
    </template>

  </div>
</template>


<script>
  import {config} from '@plugins/config'
  import CsiInputTaxCode from 'components/global/forms/CsiInputTaxCode'
  import {LENGTH, TEMPORARY_LENGTH} from '@services/global/tax-code'
  import CsiHealthPaymentNumberHelperModal from 'components/health-payments/CsiHealthPaymentNumberHelperModal'
  import CsiBarcodeReader from "components/global/common/CsiBarcodeReader";

  const NUMBER_LABELS = {
    [config.healthPayments.procedureTypes.PRATICA]:
      'Identificativo ticket/posizione debitoria',
    [config.healthPayments.procedureTypes.RICETTA]: 'Numero ricetta'
  }

  const DEFAULT_VALIDATION = {
    taxCode: {},
    aslSelected: {},
    procedureSelected: {},
    number: {}
  }

  export default {
    name: 'CsiSearchTicketForm',
    components: {CsiBarcodeReader, CsiHealthPaymentNumberHelperModal, CsiInputTaxCode},
    props: {
      taxCode: {type: String, required: false, default: ''},
      // 'props' viene valutato prima di creare l'istanza del componente. Per questo motivo non abbiamo accesso a 'this'
      // e quindi importiamo lo store per usare uno dei suoi valori come default
      procedureSelected: {
        type: String,
        required: false,
        default: config.healthPayments.procedureTypes.PRATICA
      },
      number: {type: String, required: false, default: ''},
      aslSelected: {type: Number, required: false, default: null},
      aslOptions: {type: Array, required: false, default: () => []},
      $v: {type: Object, requierd: false, default: () => DEFAULT_VALIDATION}
    },
    data() {
      return {
          replaceMessage: '',
        NUMBER_LABELS,
        procedureOptions: [
          {
            label: 'Pratica',
            value: this.$config.healthPayments.procedureTypes.PRATICA
          },
          {
            label: 'Ricetta',
            value: this.$config.healthPayments.procedureTypes.RICETTA
          },
        ],
        isNumberHelperModalVisible: false,
        isBarcodeReaderModalVisible: false,
        isAslNew: false
      }
    },
    computed: {
      canUseNre() {
        let result = false

        if (this.isAslSelected && this.aslSelectedModel) {
          result = this.aslSelectedModel.nre_attivo;
        }

        //    if (!result) {
        //       this.$emit('update:procedureSelected', this.$config.healthPayments.procedureTypes.PRATICA)
        // }

        return result
      },
      taxCodeLength() {
        return LENGTH
      },
      taxCodeTemporaryLength() {
        return TEMPORARY_LENGTH
      },
      isAslSelected() {
        return this.aslSelected !== null
      },
      aslSelectedModel() {
        let result = this.aslOptions.find(a => a.value === this.aslSelected)
        if (result) {
          result = result._model
        }
        return result
      },
      aslSelectedLabel() {
        return this.aslSelectedModel && this.aslSelectedModel.descrizione || '';
      },
      isNumberNpr() {
        return this.number && this.number.length === 27
      },
      nprAslCode(){
        if (!this.isNumberNpr) return null;
        return this.number.substring(1, 4);
      },
      nprAslLabel() {
        if (!this.isNumberNpr) return '';
        let option = this.aslOptions.find(o => "" + o.value === this.nprAslCode);
        return option && option._model && option._model.descrizione || "";
      },
      isReceiptSelected() {
        return (
          this.procedureSelected ===
          this.$config.healthPayments.procedureTypes.RICETTA
        )
      },
      supportReceiptSelection() {
        let asl = this.aslOptions.find(a => a.value === this.aslSelected)
        if (!this.isAslSelected || !asl) return false
        return asl._model.nuovo
      },
      mustReplace01() {
        if ([213].includes(this.aslSelected)) {
          if (this.number === 'S2130101') {
            return true
          } else return false
        }
        return false
      },
      mustReplaceCR() {
        return (
          [207, 208, 209].includes(this.aslSelected) &&
          this.number
            .substring(6, 9)
            .toUpperCase()
            .includes('CR')
        )
      },
      mustReplaceXX() {
        let isAsr = [206].includes(this.aslSelected);
        // let hasXX = this.number.substring(6, 9).toUpperCase().includes('XX');
        let hasXX = this.number.substring(0, 2).toUpperCase().includes('XX');
        return isAsr && hasXX
      },
      ticketNumberActions() {
        let result = [];

        // if (!this.$config.global.isProduction) {
        result.push({
          icon: 'mdi-barcode-scan',
          condition: !this.isReceiptSelected,
          handler: this.showBarcodeModal
        })
        // }

        return result;
      }
    },
    watch: {
      aslSelected: {
        immediate: true,
        handler(newVal, oldVal) {
          if (!this.supportReceiptSelection) {
            this.$emit(
              'update:procedureSelected',
              this.$config.healthPayments.procedureTypes.PRATICA
            )
          }
        }
      }
    },
    methods: {
      showModal() {
        this.isNumberHelperModalVisible = true
      },
      showBarcodeModal() {
        this.isBarcodeReaderModalVisible = true
      },
      onSuccess(code) {
        this.isBarcodeReaderModalVisible = false;
        this.$emit('update:number', code)
      },
    }
  }
</script>

<style scoped>
</style>
