<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<style scoped></style>

<template>
  <q-page padding>
    <form @submit.prevent="goToSearchedTickets" v-if="!isAslLoading">

      <p>
        <q-alert color="info">
          <span v-html="$t('HEALTH_PAYMENTS.FREE_PAYMENTS_HELPER')"></span>
        </q-alert>
      </p>

      <q-card class="bg-white">

        <q-card-main>

          <csi-search-ticket-form
            :tax-code.sync="taxCode"
            :procedure-selected.sync="procedureSelected"
            :number.sync="number"
            :asl-selected.sync="aslSelected"
            :asl-options="aslOptions"
            :$v="$v"
          />

          <csi-recaptcha ref="recaptcha" @token-update="updateCaptchaToken"/>

        </q-card-main>

        <csi-buttons class="q-pa-sm">
          <csi-button primary type="submit" label="Cerca"/>
        </csi-buttons>

      </q-card>


      <!-- INTEGRAZIONE CON VECCHIO SERVIZIO -->
      <!-- ----------------------------------------------------------------------------------------------------------- -->
      <csi-search-ticket-form-integration
        :tax-code="taxCode"
        :number="number"
        :asl-id="aslSelected"
        :captcha="integrationCaptcha"
        ref="integration"
      />
    </form>

    <div ref="results" class="q-mt-xl q-mb-xl">
      <template v-if="!isLoading && isPaymentSearchSuccess">

        <div class="text-center q-mb-lg">
          <csi-health-payments-count-badge :health-payments="tickets"/>
        </div>

        <csi-ticket-list-item
          class="q-my-md"
          v-for="ticket in tickets"
          :key="ticket.uuid"
          :ticket="ticket"
          :holder="ticket.paziente"
          :cfForNotAuthenticate="taxCode"
          @added-to-cart="showAddedToCartDialog"
        />

      </template>
    </div>

    <csi-inner-loading :visible="isLoading || isAslLoading"/>

  </q-page>
</template>


<script>
  import CsiSearchTicketForm from 'components/health-payments/CsiSearchTicketForm'
  import CsiTicketListItem from 'components/health-payments/CsiTicketListItem'
  import CsiHealthPaymentsCountBadge from "components/health-payments/CsiHealthPaymentsCountBadge"
  import CsiPaymentAddedToCartModal from "components/health-payments/CsiPaymentAddedToCartModal"
  import {getAsrTemp, getCaptchaTemp, searchHealthPayments} from '@services/api/health-payments'
  import {required, alphaNum, numeric} from 'vuelidate/lib/validators'
  import {taxCodeCin, taxCodeLength, taxCodeTemporaryLength} from '@validators/taxCode'
  import CsiSearchTicketFormIntegration from 'components/health-payments/CsiSearchTicketFormIntegration'
  import CsiRecaptcha from 'components/global/common/CsiRecaptcha'
  import {is4XX, notifyError, notifyErrorCsi} from '@services/api/utils'
  import {scrollToElement} from "@services/global/utils";
  import CsiInnerLoading from 'components/global/common/CsiInnerLoading'


  export default {
    name: 'PageAnonymousHealthPayments',
    components: {
      CsiRecaptcha, CsiSearchTicketFormIntegration, CsiSearchTicketForm, CsiTicketListItem,
      CsiHealthPaymentsCountBadge, CsiPaymentAddedToCartModal, CsiInnerLoading
    },
    data() {
      return {
        taxCode: '',
        number: '',
        prescriptionNumber: '',
        procedureSelected: this.$config.healthPayments.procedureTypes.PRATICA,
        aslSelected: null,
        aslList: [],
        captchaToken: null,
        integrationCaptcha: '',
        tickets: [],
        isLoading: false,
        isAslLoading: false,
        isAddedToCartModalVisible: false,
        addedHealthPayment: null,
        isPaymentSearchSuccess: false
      }
    },
    computed: {
      aslOptions() {
        return this.aslList.map(a => ({label: a.descrizione, value: a.id, _model: a}))
      }
    },
    validations() {

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
    async created() {
      this.isAslLoading = true;
      let response = await getAsrTemp()
      this.aslList = response.data;
      this.getFormValues();
      this.isAslLoading = false;
    },
    methods: {
      updateCaptchaToken(token) {
        this.captchaToken = token
      },
      async goToSearchedTickets() {
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

          return
        }

        let query = {
          taxCode: this.taxCode,
          procedure: this.procedureSelected,
          asl: this.aslSelected,
          number: this.number
        }

        try {
          this.searchHealthPayments(query, this.captchaToken)
        } catch (err) {
          //
        }

        // Al termine della ricerca sul nuovo PTW effettuiamo il reset del captcha
        // indipendentemente dall'esito della ricerca
        this.$refs.recaptcha.reset()
      },

      async searchHealthPayments(query, token) {
        this.isLoading = true
        this.$router.replace({path: this.$router.history.current.fullPath, query: query})
        try {
          let toPay = true
          let response = await searchHealthPayments(query.taxCode, query.procedure, query.number, query.asl, toPay, token, {_no5XXRedirect: true})
          this.tickets = response.data

          if (!Array.isArray(this.tickets)) this.tickets = [this.tickets]

          this.isPaymentSearchSuccess = true
          scrollToElement(this.$refs["results"])
        } catch (e) {

          if (is4XX(e)) {

            let message = query.procedure === this.$config.healthPayments.procedureTypes.RICETTA ?
              `Il numero di ricetta elettronica inserito non è valido` :
              `Si è verificato un errore nella richiesta, il numero di pratica potrebbe non essere corretto`

            // notifyError(e, message)
            notifyErrorCsi(e, message)
          } else {
            // notifyError(e, 'Non è stato possibile cercare i pagamenti sanitari')
            notifyErrorCsi(e, 'Non è stato possibile cercare i pagamenti sanitari')
          }
        }

        this.isLoading = false
      },

      showAddedToCartDialog(healthPayment) {
        this.addedHealthPayment = healthPayment
        this.isAddedToCartModalVisible = true
      },
      goToCart() {
        this.$router.push(this.$routes.HEALTH_PAYMENTS.CART)
      },

      getFormValues() {
        if (Object.keys(this.$route.query).length !== 0) {
          this.taxCode = this.$route.query.taxCode;
          this.aslSelected = parseInt(this.$route.query.asl);
          this.number = this.$route.query.number;
          this.procedureSelected = this.$route.query.procedure;
          //Se i dati ci sono allineo anche la pagina :
          window.scrollTo(0, 0);
        }
      }
    }
  }
</script>
