<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-page padding>

    <csi-page-title title="Paga per altri" class="q-mb-md" @back="onBack" />

    <!-- STATO INIZIALE -->
    <!-- Lo stato iniziale al momento è nascosto in produzione -->
    <!-- poiché le deleghe non sono ancora usabili in produzione -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
<!--    <template v-if="!$config.global.isProduction && !selectedDelegator">-->
    <template v-if="!selectedDelegator">
      <div class="row gutter-md">

        <!-- LISTA DELEGANTI -->
        <!-- --------------- -->
        <div class="col-12 col-lg">
          <q-card>
            <q-item>
              <q-item-main>
                <span class="q-card-title">Paga per chi ti ha delegato</span>
              </q-item-main>
              <q-item-side v-if="isLoadingDelegators" right>
                <q-spinner-mat color="primary" size="25" />
              </q-item-side>
            </q-item>

            <q-card-main class="q-pa-none">

              <div v-if="!isLoadingDelegators && !delegators.length" class="q-pa-md">
                Non hai deleghe attive per questo servizio
              </div>

              <template v-for="(delegator, index) in delegators">
                <csi-delegator-list-item
                  :delegator="delegator"
                  @click.native="setSelectedDelegator(delegator)"
                  class="q-pa-md cursor-pointer"
                />
                <q-card-separator v-if="index < delegators.length" />
              </template>
            </q-card-main>
          </q-card>
        </div>


        <!-- PAGA SENZA DELEGA -->
        <!-- ----------------- -->
        <div class="col-12 col-lg">
          <q-card class="bg-white">
            <q-card-title>Paga senza delega</q-card-title>
            <q-card-main>
              <span v-html="$t('HEALTH_PAYMENTS.FREE_PAYMENTS_EXPLANATION')"></span>
            </q-card-main>

            <csi-buttons class="q-pa-md">
              <csi-button primary label="Inserisci i dati e paga" @click="onNoDelegatorPayment" />
            </csi-buttons>
          </q-card>
        </div>

      </div>
    </template>


    <!-- STATO DI "PAGA SENZA DELEGA" -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <template v-else-if="selectedDelegator === NO_DELEGATORS_PAYMENT_VALUE">

      <!-- SELEZIONE DELEGANTE -->
      <!-- Al momento nascosta in produzione -->
      <!-- dal momento che le deleghe non sono attive in produzione -->
      <!-- ------------------- -->
<!--      <div v-if="!$config.global.isProduction">-->
      <div>
        <q-field>
          <q-select
            v-model=selectedDelegator
            :options="delegatorsOptions"
            float-label="Paga per"
            clearable
            filter
            autofocus-filter
          />
        </q-field>
      </div>

      <!-- FORM DI RICERCA DEL TICKET -->
      <!-- -------------------------- -->
      <template v-if="showSearchForm">
        <div class="q-mt-md">
          <form @submit.prevent="loadHealthPayments">
            <p>
              <q-alert color="info">
                <span v-html="$t('HEALTH_PAYMENTS.FREE_PAYMENTS_HELPER')"></span>
              </q-alert>
            </p>

            <q-card>
              <q-card-main>
                <csi-search-ticket-form
                  :tax-code.sync="taxCode"
                  :procedure-selected.sync="procedureSelected"
                  :number.sync="number"
                  :asl-selected.sync="aslSelected"
                  :asl-options="aslOptions"
                  :$v="$v"
                />
              </q-card-main>
            </q-card>

            <!-- INTEGRAZIONE -->
            <!-- ------------ -->
            <csi-search-ticket-form-integration
              :tax-code="taxCode"
              :number="number"
              :asl-id="aslSelected"
              captcha="1di09"
              ref="integration"
            />

            <csi-buttons class="q-mt-md">
              <csi-button primary type="submit" label="Cerca" :loading="isLoadingHealthPayments" />
            </csi-buttons>
          </form>
        </div>
      </template>

      <!-- RISULTATI DELLA RICERCA DEL TICKET -->
      <!-- ---------------------------------- -->
      <template v-else>
        <template v-if="!isLoadingHealthPayments">
          <div class="text-center q-mt-md">
            <csi-health-payments-count-badge :health-payments="healthPayments" />
          </div>

          <csi-ticket-list-item
            class="q-my-md"
            v-for="hp in healthPayments"
            :key="hp.uuid"
            :ticket="hp"
            :holder="hp.paziente"
            :cfForNotAuthenticate="taxCode"
            @added-to-cart="showAddedToCartDialog"
          />
        </template>

        <csi-inner-loading :visible="isLoadingHealthPayments" block />
      </template>
    </template>

    <!-- STATO DI "PAGA PER DELEGATO" -->
    <!-- Al momento è nascosto in produzione -->
    <!-- poiché le deleghe non sono ancora usabili in produzione -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
<!--    <template v-else-if="!$config.global.isProduction">-->
    <template v-else>

      <!-- SELEZIONE DELEGANTE -->
      <!-- ------------------- -->
      <div>
        <q-field>
          <q-select
            v-model=selectedDelegator
            :options="delegatorsOptions"
            float-label="Paga per"
            clearable
            filter
            autofocus-filter
          />
        </q-field>
      </div>


      <div class="q-mt-xl">
        <!-- SELEZIONE ASL -->
        <!-- ------------- -->
        <q-card>
          <q-card-main>
            <p>Seleziona l'azienda sanitaria di tuo interesse</p>

            <q-field>
              <q-select
                :value="delegatorAslSelected"
                :options="aslOptions"
                float-label="Azienda sanitaria"
                filter
                filter-placeholder="Cerca tra le aziende sanitarie ..."
                @input="onDelegatorAslSelected"
              />
            </q-field>
          </q-card-main>
        </q-card>

        <!-- ELENCO TICKET DELEGANTE -->
        <!-- ----------------------- -->
        <template v-if="delegatorAslSelected">
          <template v-if="!delegatorIsLoadingHealthPayments">
            <div class="text-center q-mt-md">
              <csi-health-payments-count-badge :health-payments="delegatorHealthPayments" />
            </div>

            <csi-ticket-list-item
              class="q-my-md"
              v-for="hp in delegatorHealthPayments"
              :key="hp.uuid"
              :ticket="hp"
              :holder="hp.paziente"
              @added-to-cart="showAddedToCartDialog"
            />
          </template>
        </template>

        <csi-inner-loading :visible="delegatorIsLoadingHealthPayments" block />
      </div>
    </template>


    <!-- MODAL DI AGGIUNTA AL CARRELLO -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <csi-payment-added-to-cart-modal
      v-model="isAddedToCartModalVisible"
      :payment="addedHealthPayment"
      @go-to-cart="goToCart"
    />
  </q-page>
</template>


<script>
  import CsiDelegatorListItem from 'components/health-payments/CsiDelegatorListItem'
  import {getServiceDelegators} from '@services/api/delegations'
  import {
    getAsrTemp,
    getHealthPaymentsToPay,
    searchHealthPayments
  } from '@services/api/health-payments'
  import CsiTicketListItem from 'components/health-payments/CsiTicketListItem'
  import CsiSearchTicketForm from 'components/health-payments/CsiSearchTicketForm'
  import {is4XX, notifyError, notifyErrorCsi} from '@services/api/utils'
  import {isDelegationValid} from '@services/delegations/business-logic'
  import CsiPaymentAddedToCartModal from 'components/health-payments/CsiPaymentAddedToCartModal'
  import CsiHealthPaymentsCountBadge from 'components/health-payments/CsiHealthPaymentsCountBadge'
  import {required, alphaNum, numeric} from 'vuelidate/lib/validators'
  import {taxCodeCin, taxCodeLength, taxCodeTemporaryLength} from '@validators/taxCode'
  import CsiSearchTicketFormIntegration from 'components/health-payments/CsiSearchTicketFormIntegration'
  import CsiPageTitle from 'components/global/common/CsiPageTitle'

  const NO_DELEGATORS_PAYMENT_VALUE = '__no delegator__'
  const NO_DELEGATORS_PAYMENT_OPTION = {
    label: 'Senza delega',
    value: NO_DELEGATORS_PAYMENT_VALUE,
    _model: null,
  }

  export default {
    name: 'PageAuthHealthPaymentsOther',
    components: {
      CsiPageTitle,
      CsiSearchTicketFormIntegration,
      CsiHealthPaymentsCountBadge,
      CsiPaymentAddedToCartModal,
      CsiSearchTicketForm,
      CsiTicketListItem,
      CsiDelegatorListItem
    },
    data() {
      return {
        NO_DELEGATORS_PAYMENT_VALUE,

        isLoadingDelegators: false,
        delegators: [],
        // In produzione partiamo direttamente con la UI per la ricerca senza delegante
        // selectedDelegator: this.$config.global.isProduction ? NO_DELEGATORS_PAYMENT_VALUE : null,
        selectedDelegator: null,

        aslList: [],

        delegatorIsLoadingHealthPayments: false,
        delegatorHealthPayments: [],
        delegatorAslSelected: null,

        isLoadingHealthPayments: false,
        healthPayments: [],
        taxCode: '',
        procedureSelected: this.$config.healthPayments.procedureTypes.PRATICA,
        number: '',
        aslSelected: null,

        // indica se l'utente deve effettuare la ricerca tramite il form di ricerca libera
        mustSearch: true,
        isAddedToCartModalVisible: false,
        addedHealthPayment: null,
      }
    },
    computed: {
      user() {
        return this.$store.getters['global/user']
      },
      isDelegationActive() {
        return this.$store.getters['healthPayments/isDelegationActive']
      },
      serviceCode() {
        return this.$config.global.appServiceCodes.healthPayments
      },
      delegatorsOptions() {
        let result = this.delegators.map(d => {
          return {
            label: `${d.nome_delega} ${d.cognome_delega}`,
            value: d.codice_fiscale_delega,
            _model: d
          }
        })

        return [...result, NO_DELEGATORS_PAYMENT_OPTION]
      },
      aslOptions() {
        return this.aslList.map(a => ({label: a.descrizione, value: a.id, _model: a}))
      },
      showSearchForm() {
        return this.selectedDelegator === NO_DELEGATORS_PAYMENT_VALUE && this.mustSearch
      }
    },
    validations(){

      const aslMatch = (number = "") => {
        number = number || "";
        // Effettuiamo il controllo solo in caso di NPR
        if (number.length !== 27) return true;
        let asl = number.substring(1, 4);
        return asl === "" + this.aslSelected
      };

      return {
        taxCode: {
          required,
          // Deve fallire solo se la lunghezza è quella di un CF provvisorio e tutti i caratteri non sono numerici
          numeric: (taxCode = '') => !taxCodeTemporaryLength(taxCode) || numeric(taxCode),
          // Deve fallire solo se la lunghezza è quella di un CF normale ed i caratteri non sono alfanumerici
          alphaNum: (taxCode = '') => !taxCodeLength(taxCode) || alphaNum(taxCode),
          taxCodeLength: (taxCode = '') => taxCodeLength(taxCode) || taxCodeTemporaryLength(taxCode),
          // Deve fallire solo se la lunghezza è quella di un CF normale ed i CIN non corretto
          taxCodeCin: (taxCode = '') => !taxCodeLength(taxCode) || taxCodeCin(taxCode),
        },
        procedureSelected: {required},
        aslSelected: {required},
        number: {required, aslMatch},
      }
    },
    watch: {
      selectedDelegator: 'updateHealthPayments'
    },
    async created() {

      // Se l'utente sta lavorando i "modalità delega"
      // Allora non può accedere a questa route
      if (this.isDelegationActive) {
        this.$router.push(this.$routes.HEALTH_PAYMENTS.APP)
        return
      }

      this.isLoadingDelegators = true

      let delegatorsPromise = getServiceDelegators(this.user.cf, this.serviceCode, {_no5XXRedirect: true})
      // let asrPromise = getAsr()
      let asrPromise = getAsrTemp()

      try {
        let response = await delegatorsPromise
        this.delegators = response.data.filter(delegator => {
          return delegator.deleghe.some(delegation => {
            return delegation.codice_servizio === this.serviceCode && isDelegationValid(delegation.stato_delega)
          })
        })

      } catch (e) {
        // non siamo riusciti ad ottenere la lista dei deleganti => non facciamo nulla e facciamo finta che l'utente
        // non abbia deleganti
      }

      let response = await asrPromise
      this.aslList = response.data

      this.isLoadingDelegators = false
    },
    methods: {
      onBack() {
        // In produzione il back torna semplicemente alla lista dei pagamenti dal momento che
        // le deleghe non sono ancora attive in produzione
        // if (this.$config.global.isProduction) {
        if (true) {
          this.$router.push(this.$routes.HEALTH_PAYMENTS.AUTH_YOUR_HEALTH_PAYMENTS)
        } else {

          // Se siamo nella vista iniziale di "seleziona delega" => torniamo alla lista dei ticket
          if(!this.selectedDelegator){
            this.$router.push(this.$routes.HEALTH_PAYMENTS.AUTH_YOUR_HEALTH_PAYMENTS)
            return
          }

          // Se siamo nella vista di "risulati pagamento libero" => torniamo alla vista "form pagamento libero"
          if (this.selectedDelegator === NO_DELEGATORS_PAYMENT_VALUE && !this.mustSearch) {
            this.mustSearch = true
            return
          }

          // In tutti gli altri casi torniamo alla vista iniziale "seleziona delega"
          this.selectedDelegator = null
        }
      },

      // Prosegue verso la vista di ticket delegante
      setSelectedDelegator(delegator) {
        this.selectedDelegator = delegator.codice_fiscale_delega
        // this.$store.commit('healthPayments/setActiveDelegation', {delegator})
        // this.$router.push(this.$routes.HEALTH_PAYMENTS.APP)
      },

      // Prosegue verso la vista di ricerca ticket
      onNoDelegatorPayment() {
        this.selectedDelegator = NO_DELEGATORS_PAYMENT_VALUE
      },


      async onDelegatorAslSelected(aslId) {
        this.delegatorAslSelected = aslId
        let asl = this.aslList.find(a => a.id === aslId)
        let cf = this.selectedDelegator
        this.loadDelegatorHealthPayments(cf, asl)
      },

      // Permette di caricare i pagamenti sanitari di un delegante su una determinata asl
      async loadDelegatorHealthPayments(cf, asl) {

        if (!asl) {
          let color = 'warning'
          let message = `Seleziona l'azienda sanitaria prima di continuare`
          this.$q.notify({color, message})
          return
        }


        if (asl && !asl.nuovo) {
          this.isRedirecting = true
          // $nextTick è necessario altrimenti non viene aggiornata la prop passata al componente
          // di integrazione e di conseguenza non vengono passati i parametri corretti
          this.$nextTick(() => {
            // this.$refs.integration.submit()
            let url = `${this.$config.global.oldServicesUrls.pagamento_ticket_autenticato}?idAsl=${asl.id}`
            window.location.assign(url)
          })
          return
        }


        this.delegatorIsLoadingHealthPayments = true

        try {
          let filter = {id_asr: {eq: asl.id}}
          let params = {filter}
          let response = await getHealthPaymentsToPay(cf, {params, _no5XXRedirect: true})
          this.delegatorHealthPayments = response.data
        } catch (e) {
          console.error(e)
          notifyError(e, 'Non è stato possibile cercare i pagamenti sanitari')
        }

        this.delegatorIsLoadingHealthPayments = false
      },

      // Permette di cercare i ticket in seguito alla compilazione del form
      async loadHealthPayments() {

        this.$v.$touch()
        if (this.$v.$error) return

        let asl = this.aslList.find(a => a.id === this.aslSelected)
        if (asl && !asl.nuovo) {
          this.$refs.integration.submit()
          return
        }

        this.isLoadingHealthPayments = true

        try {
          let cf = this.taxCode
          let type = this.procedureSelected
          let number = this.number
          let toPay = true
          let response = await searchHealthPayments(cf, type, number, this.aslSelected, toPay, null, {_no5XXRedirect: true})
          this.healthPayments = response.data
          if (!Array.isArray(this.healthPayments)) this.healthPayments = [this.healthPayments]
          this.mustSearch = false
        } catch (e) {

          if (is4XX(e)) {
            let message = this.procedureSelected === this.$config.healthPayments.procedureTypes.RICETTA ?
              `Il numero di ricetta elettronica inserito non è valido` :
              `Si è verificato un errore nella richiesta, il numero di pratica potrebbe non essere corretto`

            // notifyError(e, message)
            notifyErrorCsi(e, message)
          } else {
            // notifyError(e, 'Non è stato possibile cercare i pagamenti sanitari')
            notifyErrorCsi(e, 'Non è stato possibile cercare i pagamenti sanitari')
          }
        }

        this.isLoadingHealthPayments = false
      },
      showAddedToCartDialog(healthPayment) {
        this.addedHealthPayment = healthPayment
        this.isAddedToCartModalVisible = true
      },
      goToCart() {
        this.$router.push(this.$routes.HEALTH_PAYMENTS.CART)
      },

      // Ogni volta che cambia il delegante resettiamo la situazione
      async updateHealthPayments() {
        // Resettiamo tutte le selezioni precedenti ed i dati caricati relative alle selezioni precedenti
        this.delegatorHealthPayments = []
        this.delegatorAslSelected = null

        this.healthPayments = []
        this.taxCode = ''
        this.number = ''
        this.aslSelected = null

        // La prossima volta che verrà selezionato il "pagamento libero" l'utente dovrà compilare il form
        this.mustSearch = true
      },
    },
  }
</script>

<style scoped></style>
