<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-page padding style="min-height: 50vh">

    <!-- INTEGRAZIONE VECCHIO SERVIZIO -->
    <csi-search-ticket-asl-form-integration
      :tax-code="user.cf"
      :asl-id="aslSelectedValue"
      ref="integration"
    />

    <template v-if="isRedirecting || !aslSelectedValue">

      <q-card>
        <q-card-main>
          <p>Seleziona l'azienda sanitaria di tuo interesse</p>

          <q-field>
            <q-select
              :value="aslSelectedValue"
              :options="aslOptions"
              float-label="Azienda sanitaria"
              filter
              filter-placeholder="Cerca tra le aziende sanitarie ..."
              @input="onAslChange"
            />
          </q-field>
        </q-card-main>
      </q-card>
    </template>

    <template v-else>

      <template v-if="aslSelectedModel">
        <q-card>
          <q-card-main>
            <p>
              Elenco pagamenti per <span class="q-body-2">{{aslSelectedModel.descrizione}}</span>
            </p>

            <csi-buttons class="q-mt-md">
              <csi-button secondary label="Cambia" @click="goToAslSelection" />
            </csi-buttons>
          </q-card-main>
        </q-card>
      </template>

      <div class="q-mt-md">
        <div v-if="!isLoading">
          <div class="text-center">
            <csi-health-payments-count-badge :health-payments="healthPayments" />
          </div>

          <csi-ticket-list-item
            v-for="ticket in healthPayments"
            :key="ticket.uuid"
            :ticket="ticket"
            :holder="ticket.paziente"
            class="q-my-md ticket-list-item"
            @added-to-cart="showAddedToCartDialog"
          />


          <!-- MODALS -->
          <!-- ----------------------------------------------------------------------------------------------------------- -->
          <!-- MODAL DI AGGIUNTA AL CARRELLO -->
          <csi-payment-added-to-cart-modal
            v-model="isAddedToCartModalVisible"
            :payment="addedHealthPayment"
            @go-to-cart="goToCart"
          />
        </div>

        <!-- LOADING -->
        <!-- ----------------------------------------------------------------------------------------------------------- -->
        <csi-inner-loading :visible="isLoading" block />
      </div>
    </template>

    <div v-if="!activeDelegation" class="q-mt-lg row gutter-md">
      <div class="col-12 text-center">
        <csi-button link label="Paga per altri" @click="goToHealthPaymentsOther" />
      </div>
    </div>
  </q-page>
</template>


<script>
    import CsiTicketListItem from 'components/health-payments/CsiTicketListItem'
    import {getAsrTemp, getHealthPaymentsToPay} from '@services/api/health-payments'
    import CsiPaymentAddedToCartModal from 'components/health-payments/CsiPaymentAddedToCartModal'
    import CsiHealthPaymentsCountBadge from 'components/health-payments/CsiHealthPaymentsCountBadge'
    import {notifyError} from '@services/api/utils'
    import CsiSearchTicketAslFormIntegration from 'components/health-payments/CsiSearchTicketAslFormIntegration'

    export default {
        name: 'PageAuthYourHealthPayments',
        components: {
            CsiSearchTicketAslFormIntegration,
            CsiHealthPaymentsCountBadge,
            CsiPaymentAddedToCartModal,
            CsiTicketListItem
        },
        data() {
            return {
                isLoading: false,
                isRedirecting: false,
                aslList: [],
                aslSelectedValue: null,
                healthPayments: [],
                isAddedToCartModalVisible: false,
                addedHealthPayment: null,
            }
        },
        computed: {
            user() {
                return this.$store.getters['global/user']
            },
            PAYMENT_STATUSS() {
                return this.$config.healthPayments.paymentStatuss
            },
            aslOptions() {
                return this.aslList.map(a => ({label: a.descrizione, value: a.id}))
            },
            aslSelectedModel() {
                return this.aslList.find(a => a.id === this.aslSelectedValue)
            },
            activeDelegation() {
                return this.$store.getters['healthPayments/getActiveDelegation']
            },
        },
        async created() {
            this.isLoading = true

            let aslId = this.$route.query && this.$route.query.asl ? Number(this.$route.query.asl) : null
            this.aslSelectedValue = aslId
            this.isSelectingAsl = !aslId

            try {
                let response = await getAsrTemp({_no5XXRedirect: true})
                this.aslList = response.data
            } catch (e) {
                notifyError(e, 'Al momento non è possibile visualizzare la lista di ASL')
            }

            if (!this.isSelectingAsl) this.loadHealthPayments(aslId)

            this.isLoading = false
        },
        methods: {
            updateQueryString(aslId) {
                let {asl, ...query} = this.$route.query
                if (aslId) query = {...query, asl: aslId}
                this.$router.replace({...this.$route, query})
            },
            onAslChange(val) {
                this.aslSelectedValue = val
                this.updateQueryString(this.aslSelectedValue)
                this.loadHealthPayments(this.aslSelectedValue)
            },
            goToAslSelection() {
                this.aslSelectedValue = null
                this.updateQueryString(this.aslSelectedValue)
            },
            async loadHealthPayments(aslId) {

                if (!aslId) {
                    let color = 'warning'
                    let message = `Seleziona l'azienda sanitaria prima di continuare`
                    this.$q.notify({color, message})
                    return
                }


                let asl = this.aslSelectedModel
                if (asl && !asl.nuovo) {
                    this.isRedirecting = true
                    // $nextTick è necessario altrimenti non viene aggiornata la prop passata al componente
                    // di integrazione e di conseguenza non vengono passati i parametri corretti
                    this.$nextTick(() => {
                        // this.$refs.integration.submit()
                        let url = `${this.$config.global.oldServicesUrls.pagamento_ticket_autenticato}?idAsl=${aslId}`
                        window.location.assign(url)
                    })
                    return
                }


                let filter = {
                    id_asr: {eq: this.aslSelectedValue}
                }

                this.isLoading = true

                try {
                    let params = {filter}
                    let cf = this.$store.getters['healthPayments/getTaxCode']
                    let response = await getHealthPaymentsToPay(cf, {params, _no5XXRedirect: true})
                    this.healthPayments = response.data
                } catch (e) {
                    console.error(e)
                    notifyError(e, 'Non è stato possibile cercare i pagamenti sanitari')
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
            goToHealthPaymentsOther() {
                this.$router.push(this.$routes.HEALTH_PAYMENTS.AUTH_OTHER_HEALTH_PAYMENTS)
            },
        },
    }
</script>

<style></style>

