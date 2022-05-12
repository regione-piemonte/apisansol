<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<style scoped></style>


<template>
  <q-page padding>
    <!-- ERRORE TRASAZIONE -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <div v-if="isError">
      <q-alert color="negative">
        <div v-html="$t('HEALTH_PAYMENTS.MDP.KO', {transactionId})"></div>
      </q-alert>

      <csi-buttons class="q-mt-lg">
        <csi-button primary label="Torna alla lista pagamenti" @click="goToServiceHome"/>
      </csi-buttons>
    </div>

    <!-- SUCCESSO TRANSAZIONE -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <div v-if="isSuccess">

      <template v-if="!isLoading">
        <q-alert color="positive">
          <div v-html="$t('HEALTH_PAYMENTS.MDP.OK')"></div>
          <p v-if="!isLoading">Importo totale: <strong>{{healthPaymentsPayedTotal.toFixed(2)}}</strong> &euro;</p>
        </q-alert>

        <div class="q-mt-lg">
          <csi-ticket-list-item
            v-for="ticket in healthPayments"
            :key="ticket.uuid"
            :ticket="ticket"
            :holder="ticket.paziente"
            :no-actions="isPspPayment"
            show-as-payed
            class="q-my-md"
          />
        </div>

        <csi-buttons class="q-mt-md">
          <csi-button
            v-if="isPspPayment"
            primary
            label="Stampa mandato di pagamento"
            :loading="isDownloading"
            @click="downloadFacsimileReceipt"
          />
          <csi-button secondary label="Torna alla lista pagamenti" @click="goToServiceHome"/>
        </csi-buttons>
      </template>


      <!-- LOADING -->
      <!-- ----------------------------------------------------------------------------------------------------------- -->
      <csi-inner-loading :visible="isLoading"/>
    </div>
  </q-page>
</template>


<script>
  import {
    getHealthPaymentsFacsimileReceiptPdf,
    postReceipt,
    updateTransactionDeliveryStatus
  } from "@services/api/health-payments";
  import {isEmpty} from "@services/global/utils";
  import CsiTicketListItem from "components/health-payments/CsiTicketListItem";
  import {notifyErrorCsi} from "@services/api/utils";

  export default {
    name: "PageMdpLandingPage",
    components: {CsiTicketListItem},
    data() {
      return {
        facsimileReceiptId: null,
        healthPayments: [],
        isLoading: true,
        isDownloading: false,
        isPspPayment: false,
      }
    },
    computed: {
      transactionId() {
        return this.$route.query.transactionId
      },
      status() {
        return this.$route.query.status
      },
      hasInvalidQueryString() {
        return !this.transactionId || !this.status
      },
      isSuccess() {
        return this.status === 'success'
      },
      isError() {
        return this.status === 'error'
      },
      // consideriamo i pagamenti come spontanei nel momento in cui almeno uno di questi non abbia
      // il campo "numero_pratica_regionale" impostato
      isFreePayment() {
        return this.healthPayments.some(h => isEmpty(h.numero_pratica_regionale))
      },
      healthPaymentsPayedTotal() {
        return this.healthPayments.reduce((acc, val, index) => {
          return val.pagato ? acc + val.pagato.valore : acc
        }, 0)
      }
    },
    created() {
      // stabiliamo se è un pagamento PSP o meno andando a guardare nel session storage
      this.isPspPayment = this.$q.sessionStorage.has('healthPayments.isPspPayment') && this.$q.sessionStorage.get.item('healthPayments.isPspPayment')

      if (this.isSuccess) this.onSuccess();
      else if (this.isError) this.onError();

      // @TODO: cosa fare se si tratta del feedback di successo del pagamento spontaneo?
    },
    methods: {
      goToServiceHome() {
        this.$router.push(this.$routes.HEALTH_PAYMENTS.APP)
      },
      async onSuccess() {
        console.debug('Feedback successo MDP');
        this.isLoading = true;

        // Prima di tutto ripuliamo il carrello
        this.$store.dispatch('healthPayments/clearCart');

        // Poi proviamo a dire al back-end che il pagamento è avvenuto con successo
        try {
          let response = await postReceipt(this.transactionId, null, {_no5XXRedirect: true});
          this.facsimileReceiptId = response.data.id_mandato_pagamento;
          this.healthPayments = response.data.pagamenti;
        } catch (error) {
          // @TODO: gestire errore chiamata ricevuta
          let message = 'Non è stato possibile ottenere la lista dei pagamenti effettuati'
          notifyErrorCsi(error, message);
        }

        this.isLoading = false
      },
      async onError() {
        try {
          let id = this.transactionId;
          let payload = {stato_erogazione: this.$config.healthPayments.deliveryStatuss.TO_BE_DISPENSED};
          let httpConfig = {_no5XXRedirect: true};
          let {data} = await updateTransactionDeliveryStatus(id, payload, httpConfig);
        } catch (error) {
          let message = "Non è stato possibile ripristinare i rimborsi. Se durante il pagamento hai utilizzato dei rimborsi, quest'ultimi saranno nuovamente disponibili tra qualche minuto";
          notifyErrorCsi(error, message);
        }
      },
      async downloadFacsimileReceipt() {
        this.isDownloading = true;

        let config = {_no5XXRedirect: true,};
        config.params = {xci_cd: 'attachment'};
        getHealthPaymentsFacsimileReceiptPdf(this.facsimileReceiptId, config);

        this.isDownloading = false
      }
    }
  }
</script>
