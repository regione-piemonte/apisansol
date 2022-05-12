<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<style scoped></style>


<template>
  <div>
    <!-- COGNOME -->
    <q-field class="q-my-sm" required :error="$v.surname.$error">
      <q-input
        type="text"
        :value="surname"
        @input="$emit('update:surname', $event)"
        clearable
        float-label="Cognome"
        name="family-name"
        autocomplete="family-name"
      />

      <div slot="error-label">
        <slot name="surname-error-label">
          <div v-if="!$v.surname.required">Campo obbligatorio</div>
        </slot>
      </div>
    </q-field>

    <!-- NOME -->
    <q-field class="q-my-sm" required :error="$v.name.$error">
      <q-input
        type="text"
        :value="name"
        @input="$emit('update:name', $event)"
        clearable
        float-label="Nome"
        name="given-name"
        autocomplete="given-name"
      />

      <div slot="error-label">
        <slot name="name-error-label">
          <div v-if="!$v.name.required">Campo obbligatorio</div>
        </slot>
      </div>
    </q-field>

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
          <div v-if="!$v.taxCode.taxCodeLength">Deve avere esattamente {{taxCodeTemporaryLength}} o {{taxCodeLength}} caratteri</div>
          <div v-else>
            <div v-if="!$v.taxCode.taxCodeCin">
              Il codice di controllo non è corretto, potrebbero esserci degli errori di battitura
            </div>
            <div v-if="!$v.taxCode.taxCodeName">Il nome impostato non corrisponde</div>
            <div v-if="!$v.taxCode.taxCodeSurname">Il cognome impostato non corrisponde</div>
          </div>
        </slot>
      </div>

    </csi-input-tax-code>
  </div>
</template>


<script>
  import CsiInputTaxCode from "components/global/forms/CsiInputTaxCode";
  import {LENGTH, TEMPORARY_LENGTH} from '@services/global/tax-code'

  const DEFAULT_VALIDATION = {
    surname: {},
    name: {},
    taxCode: {}
  }

  export default {
    name: "CsiPaymentPersonForm",
    components: {CsiInputTaxCode},
    props: {
      surname: {type: String, required: false, default: ''},
      name: {type: String, required: false, default: ''},
      taxCode: {type: String, required: false, default: ''},
      $v: {type: Object, required: false, default: () => (DEFAULT_VALIDATION)},
    },
    computed: {
      taxCodeLength() {
        return LENGTH
      },
        taxCodeTemporaryLength(){
          return TEMPORARY_LENGTH
        }
    },
  }
</script>
