<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-page padding style="min-height: 50vh">
    <div class="q-mt-md">
      <div v-if="!isLoading">
        <div class="text-center">
          <csi-health-payments-count-badge :health-payments="healthPayments"/>
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

        <!-- MODAL RICERCA PER ASL -->
        <csi-search-ticket-asl-modal v-model="isAslModalVisible"/>
      </div>

      <!-- LOADING -->
      <!-- ----------------------------------------------------------------------------------------------------------- -->
      <csi-inner-loading :visible="isLoading" block/>
    </div>

    <div class="q-mt-lg row gutter-xs">
      <div class="col-12 text-center">
        <csi-button link label="Non trovi il pagamento?" @click="showAslModal"/>
      </div>

      <template v-if="!activeDelegation">
        <div class="col-12 text-center">
          <csi-button link label="Paga per altri" @click="goToHealthPaymentsOther"/>
        </div>
      </template>
    </div>
  </q-page>
</template>


<script>
  import CsiTicketListItem from 'components/health-payments/CsiTicketListItem'
  import {getHealthPaymentsToPay} from '@services/api/health-payments'
  import CsiPaymentAddedToCartModal from 'components/health-payments/CsiPaymentAddedToCartModal'
  import CsiHealthPaymentsCountBadge from 'components/health-payments/CsiHealthPaymentsCountBadge'
  import {notifyError} from '@services/api/utils'
  import CsiSearchTicketAslFormIntegration from 'components/health-payments/CsiSearchTicketAslFormIntegration'
  import CsiSearchTicketAslModal from "components/health-payments/CsiSearchTicketAslModal";

  export default {
    name: 'PageAuthYourHealthPayments',
    components: {
      CsiSearchTicketAslModal,
      CsiSearchTicketAslFormIntegration,
      CsiHealthPaymentsCountBadge,
      CsiPaymentAddedToCartModal,
      CsiTicketListItem
    },
    data() {
      return {
        isLoading: false,
        healthPayments: [],
        addedHealthPayment: null,
        isAddedToCartModalVisible: false,
        isAslModalVisible: false,
      }
    },
    computed: {
      user() {
        return this.$store.getters['global/user']
      },
      activeDelegation() {
        return this.$store.getters['healthPayments/getActiveDelegation']
      },
      taxCode() {
        return this.$store.getters['healthPayments/getTaxCode']
      }
    },
    async created() {
      this.loadHealthPayments()
    },
    methods: {
      async loadHealthPayments() {
        this.isLoading = true

        try {
          let response = await getHealthPaymentsToPay(this.taxCode, {_no5XXRedirect: true})
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
      showAslModal() {
        this.isAslModalVisible = true
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

