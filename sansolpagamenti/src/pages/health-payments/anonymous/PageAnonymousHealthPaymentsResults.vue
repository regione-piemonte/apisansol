<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<style scoped></style>


<template>

  <q-page padding>

    <div v-if="!isLoading">

      <div class="text-center">
        <csi-health-payments-count-badge :health-payments="tickets" />
      </div>

      <csi-ticket-list-item
        class="q-my-md"
        v-for="ticket in tickets"
        :key="ticket.uuid"
        :ticket="ticket"
        :holder="ticket.paziente"
        @added-to-cart="showAddedToCartDialog"
      />


      <!-- MODAL -->
      <!-- --------------------------------------------------------------------------------------------------------- -->
      <!-- MODAL DI AGGIUNTA AL CARRELLO -->
      <csi-payment-added-to-cart-modal
        v-model="isAddedToCartModalVisible"
        :payment="addedHealthPayment"
        @go-to-cart="goToCart"
      />
    </div>

    <!-- LOADING -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <csi-inner-loading :visible="isLoading" />
  </q-page>
</template>


<script>
  import CsiTicketListItem from 'components/health-payments/CsiTicketListItem';
  import {searchHealthPayments} from "@services/api/health-payments";
  import {getResponseStatusCode, is4XX, notifyError} from "@services/api/utils";
  import CsiPaymentAddedToCartModal from "components/health-payments/CsiPaymentAddedToCartModal";
  import CsiHealthPaymentsCountBadge from "components/health-payments/CsiHealthPaymentsCountBadge";

  export default {
    name: 'PageAnonymousHealthPaymentsResults',
    components: {CsiHealthPaymentsCountBadge, CsiPaymentAddedToCartModal, CsiTicketListItem},
    data() {
      return {
        tickets: [],
        isLoading: true,
        isAddedToCartModalVisible: false,
        addedHealthPayment: null
      }
    },
    async created() {
      let {query} = this.$route;
      this.searchHealthPayments(query.taxCode, query.asl, query.procedure, query.number, query.token)
    },
    methods: {
      async searchHealthPayments(cf, idAsl, type, number, token) {

        this.isLoading = true

        try {

          let toPay = true
          let response = await searchHealthPayments(cf, type, number, idAsl, toPay, token, {_no5XXRedirect: true})
          this.tickets = response.data
          if (!Array.isArray(this.tickets)) this.tickets = [this.tickets]

        } catch (e) {

          if (is4XX(e)) {
            let message = type === this.$config.healthPayments.procedureTypes.RICETTA ?
              `Il numero di ricetta elettronica inserito non è valido` :
              `Si è verificato un errore nella richiesta, il numero di pratica potrebbe non essere corretto`
            notifyError(e, message)
          } else {
            notifyError(e, 'Non è stato possibile cercare i pagamenti sanitari')
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
    }
  }

</script>
