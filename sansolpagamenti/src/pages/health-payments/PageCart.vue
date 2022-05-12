<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-page padding>

    <div class="row items-center q-mb-md">
      <div class="col">
        <csi-page-title @back="onBack">
          <template slot="title">
            <h1 class="csi-h2">
              Carrello
              <span v-if="hasHealthPayments">({{healthPayments.length}})</span>
            </h1>
          </template>
        </csi-page-title>
      </div>

      <div v-if="hasHealthPayments" class="col-auto">
        <q-btn @click="$router.push($routes.HEALTH_PAYMENTS.PAYMENT)" color="primary">Procedi</q-btn>
      </div>
    </div>


    <!-- STATO VUOTO -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <!-- @NOTE: per qualche strano motivo v-if sembra non funzionare. Come se non intercettasse il cambio di stato di hasHealthPayments -->
    <q-card v-show="!hasHealthPayments">
      <q-card-main>
        <p>
          Non sono presenti pagamenti nel carrello, se vuoi aggiungerne qualcuno vai alla lista dei pagamenti
        </p>

        <csi-buttons>
          <csi-button priamry label="Vai" @click="goToHealthPaymentList" />
        </csi-buttons>
      </q-card-main>
    </q-card>


    <!-- STATO PIENO -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <csi-transition-fade-out-right
      tag="div"
      leave-active-class="full-width"
      is-group
      class="csi-group-card"
    >
      <csi-ticket-list-item
        v-for="ticket in healthPayments"
        :key="ticket.numero_pratica_regionale"
        :ticket="ticket"
        :holder="ticket.paziente"
        class="csi-transition-property-all csi-transition-duration-1000"
      >
        <csi-buttons slot="actions" class="q-pa-md">
          <csi-button secondary label="Rimuovi" color="negative" @click="onRemoveFromCart(ticket)" />
        </csi-buttons>
      </csi-ticket-list-item>
    </csi-transition-fade-out-right>


    <!-- MODALS -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <csi-cart-ticket-remove-modal
      v-model="isRemoveFromCartModalVisible"
      :ticket="ticketToRemove"
      @confirm="removeFromCart"
    />

  </q-page>
</template>


<script>
  import CsiTicketListItem from "components/health-payments/CsiTicketListItem";
  import {isEmpty} from "@services/global/utils";
  import CsiCartTicketRemoveModal from "components/health-payments/CsiCartTicketRemoveModal";
  import CsiPageTitle from "components/global/common/CsiPageTitle";
  import CsiTransitionFadeOutRight from "components/global/transitions/CsiTransitionFadeOutRight";

  export default {
    name: "PageCart",
    components: {CsiTransitionFadeOutRight, CsiPageTitle, CsiCartTicketRemoveModal, CsiTicketListItem},
    data() {
      return {
        ticketToRemove: null,
        isRemoveFromCartModalVisible: false,
      }
    },
    computed: {
      isUserLogged() {
        return this.$store.getters['global/isUserLogged']
      },
      healthPayments() {
        return this.$store.getters['healthPayments/cartItems']
      },
      hasHealthPayments() {
        return !this.$store.getters['healthPayments/isCartEmpty']
      }
    },
    methods: {
      isEmpty,
      onBack() {
        this.$router.back()
      },
      goToHealthPaymentList() {
        let route = this.isUserLogged ?
          this.$routes.HEALTH_PAYMENTS.AUTH_HEALTH_PAYMENTS :
          this.$routes.HEALTH_PAYMENTS.ANONYMOUS_HEALTH_PAYMENTS;

        this.$router.push(route);
      },
      onRemoveFromCart(ticket) {
        this.isRemoveFromCartModalVisible = true
        this.ticketToRemove = ticket
      },
      removeFromCart(ticket) {
        this.$store.commit('healthPayments/removeFromCart', ticket);
      }
    }
  }
</script>


<style scoped lang="stylus">

  .csi-transition-property-all
    transition-property all

  .csi-transition-duration-1000
    transition-duration 1000ms

</style>
