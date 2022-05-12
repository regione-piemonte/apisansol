<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<style scoped></style>


<template>
  <q-page padding>
    <form @submit.prevent="searchReceipt">

      <q-card class="bg-white">
        <q-card-main>
          <div class="q-body-1">
            Per recuperare la ricevuta di un pagamento è necessario fornire il codice fiscale del'intestatario del
            pagamento ed il numero di pratica
          </div>

          <template>
            <!-- CODICE FISCALE -->
            <!-- ----------------------------------------------------------------------------------------------------- -->
            <q-field class="q-my-md" required :error="$v.taxCode.$error">
              <q-input
                type="text"
                v-model="taxCode"
                clearable
                float-label="Codice fiscale intestatario"
                upper-case
                name="tax-code"
                autocomplete="on"
              />

              <div slot="error-label">
                <div v-if="!$v.taxCode.required">Campo obbligatorio</div>
                <div v-if="!$v.taxCode.alphaNum">Deve essere composto solo da lettere e numeri</div>
                <div v-if="!$v.taxCode.taxCodeLength">Deve avere esattamente 16 caratteri</div>
                <div v-else>
                  <div v-if="!$v.taxCode.taxCodeCin">
                    Il codice di controllo non è corretto, potrebbero esserci degli errori di battitura
                  </div>
                </div>
              </div>
            </q-field>

            <!-- ASL -->
            <!-- ----------------------------------------------------------------------------------------------------- -->
            <q-field class="q-my-md" required :error="$v.aslSelected.$error">
              <q-select
                v-model="aslSelected"
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

            <!-- NUMERO -->
            <!-- ----------------------------------------------------------------------------------------------------- -->
            <q-field
              class="q-my-md"
              :count="27"
              helper="Inserisci l'identificativo ticket/posizione debitoria di 27 cifre che hai ricevuto tramite email al momento del pagamento"
              required
              :error="$v.number.$error">
              <q-input
                type="text"
                v-model="number"
                clearable
                float-label="Identificativo ticket/posizione debitoria"
                maxlength="27"
                minlength="27"
                name="ticket-number"
                autocomplete="on"
              />

              <div slot="error-label">
                <div v-if="!$v.number.required">Campo obbligatorio</div>
                <div v-if="!$v.number.minLength || !$v.number.maxLength">Deve avere esattamente 27 caratteri</div>
              </div>
            </q-field>
          </template>

          <csi-recaptcha ref="recaptcha" @token-update="updateCaptchaToken" />
        </q-card-main>


        <csi-buttons class="q-pa-sm">
          <csi-button primary type="submit" label="Cerca" />
        </csi-buttons>
      </q-card>


      <!-- INTEGRAZIONE VECCHIO SERVIZIO -->
      <!-- ----------------------------------------------------------------------------------------------------------- -->
      <csi-search-receipt-integration
        :tax-code="taxCode"
        :number="number"
        :asl-id="aslSelected"
        :captcha="integrationCaptcha"
        ref="integration"
      />
    </form>

    <!-- MODALS -->
    <!-- --------------------------------------------------------------------------------------------------------- -->
    <q-modal
      v-model="isSearchingModalOpen"
      :content-css="{maxWidth: '800px', minWidth: '60vw'}"
    >

      <q-modal-layout class="bg-grey-2">

        <q-toolbar slot="header">
          <q-toolbar-title>
            Ricerca ricevuta
          </q-toolbar-title>
          <q-btn flat round icon="close" v-close-overlay></q-btn>
        </q-toolbar>

        <div v-if="!isSearchingReceipt" class="q-pa-md">

          <div v-if="!isReceiptFound">
            <q-alert color="negative">
              La ricevuta cercata non è presente nei nostri sistemi.
            </q-alert>
          </div>

          <div v-else>
            <q-alert color="positive">
              La ricevuta cercata è presente nei nostri sistemi.
            </q-alert>

            <csi-buttons class="q-mt-md">
              <csi-button primary label="Stampa" @click="downloadReceipt" />
            </csi-buttons>
          </div>

        </div>

        <csi-inner-loading :visible="isSearchingReceipt" block />
      </q-modal-layout>
    </q-modal>
  </q-page>
</template>


<script>
  import CsiSearchTicketForm from 'components/health-payments/CsiSearchTicketForm'
  import {getAsrTemp, getCaptchaTemp, getHealthPaymentsReceiptPdf} from '@services/api/health-payments'
  import {required, alphaNum, minLength, maxLength} from 'vuelidate/lib/validators'
  import {taxCodeCin, taxCodeLength} from '@validators/taxCode'
  import {is4XX, notifyError} from '@services/api/utils'
  import QSpinner from 'quasar-framework/src/components/spinner/QSpinner'
  import CsiSearchReceiptIntegration from 'components/health-payments/CsiSearchReceiptFormIntegration'
  import CsiRecaptcha from 'components/global/common/CsiRecaptcha'

  export default {
    name: 'PageAnonymousReceipt',
    components: {CsiRecaptcha, CsiSearchReceiptIntegration, QSpinner, CsiSearchTicketForm},
    data() {
      return {
        taxCode: '',
        number: '',
        isLoading: false,
        isSearchingModalOpen: false,
        isSearchingReceipt: false,
        isReceiptFound: false,
        aslSelected: null,
        aslList: [],
        captchaToken: null,
        integrationCaptcha: '',
      }
    },
    computed: {
      user() {
        return this.$store.getters['global/user']
      },
      aslOptions() {
        return this.aslList.map(a => ({label: a.descrizione, value: a.id, _model: a}))
      },
    },
    validations: {
      taxCode: {
        required,
        alphaNum,
        taxCodeLength,
        taxCodeCin,
      },
      number: {
        required,
        minLength: minLength(27),
        maxLength: maxLength(27),
      },
      aslSelected: {required},
    },
    async created() {
      let response = await getAsrTemp()
      this.aslList = response.data
    },
    methods: {
      updateCaptchaToken(token) {
        this.captchaToken = token
      },
      getReceiptFilters() {
        let filter = {}
        filter.numero_pratica_regionale = {eq: this.number}
        return filter
      },
      async searchReceipt() {

        // Prima di avviare la ricerca verifichiamo se la form è stata compilata bene
        this.$v.$touch()
        if (this.$v.$error) {
          return
        }

        // controlliamo che l'utente non sia un robot
        if (!this.captchaToken) {
          this.$q.notify({
            color: 'negative',
            message: 'Dimostra di non essere un robot',
          })
          return
        }

        let asl = this.aslList.find(a => a.id === this.aslSelected)
        if (!asl || !asl.nuovo) {
          try {
            let response = await getCaptchaTemp(this.captchaToken)
            this.integrationCaptcha = response.data.captcha
            this.$nextTick(() => {
              this.$refs.integration.submit()
            })
            return
          } catch (e) {
            notifyError(e, 'Al momento non è possibile cercare i pagamenti')
          }
        }

        let filter = this.getReceiptFilters()
        let params = {filter}
        let config = {params, _no5XXRedirect: true}
        this.isSearchingReceipt = true
        this.isSearchingModalOpen = true

        try {
          let response = await getHealthPaymentsReceiptPdf(this.taxCode, config, true)
          this.isReceiptFound = true
        } catch (e) {
          this.isReceiptFound = false
        }

        // Al termine della ricerca sul nuovo PTW effettuiamo il reset del captcha
        // indipendentemente dall'esito della ricerca
        this.$refs.recaptcha.reset();

        this.isSearchingReceipt = false
      },
      downloadReceipt() {

        let filter = this.getReceiptFilters()
        let params = {filter, xci_cd: 'attachment'}
        let config = {params}

        getHealthPaymentsReceiptPdf(this.taxCode, config)

        this.isSearchingModalOpen = false
      },
      goToSearchedTickets() {
        let name = this.$routes.HEALTH_PAYMENTS.ANONYMOUS_RECEIPT_RESULTS.name
        let query = {
          taxCode: this.taxCode,
          number: this.number
        }
        this.$router.push({name, query})
      }
    }
  }
</script>

