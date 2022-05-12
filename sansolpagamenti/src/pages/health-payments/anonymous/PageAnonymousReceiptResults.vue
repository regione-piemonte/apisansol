<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<style scoped></style>

<template>
  <q-page padding>

    <!--    <div v-if="!isLoading">-->
    <!--      <div v-if="tickets.length <= 0" class="text-center q-body-2 text-faded">-->
    <!--        Nessuna ricevuta trovata.-->
    <!--      </div>-->

    <!--      <div v-else>-->
    <!--        <div class="q-body-1">-->
    <!--          <span v-if="tickets.length === 1">1 ricevuta trovata</span>-->
    <!--          <span v-if="tickets.length > 1">{{tickets.length}} ricevute trovate</span>-->
    <!--        </div>-->

    <!--        <csi-ticket-list-item-->
    <!--          class="q-my-md"-->
    <!--          v-for="ticket in tickets"-->
    <!--          :key="ticket.uuid"-->
    <!--          :ticket="ticket"-->
    <!--        />-->
    <!--      </div>-->
    <!--    </div>-->

    <q-inner-loading :visible="isLoading">
      <q-spinner-mat size="50px" color="primary"></q-spinner-mat>
    </q-inner-loading>
  </q-page>
</template>


<script>
  import CsiTicketListItem from 'components/health-payments/CsiTicketListItem';
  // import {getRicevutePagamentiSanitari} from "@services/api/health-payments";


  export default {
    name: 'PageAnonymousReceiptResults',
    components: {CsiTicketListItem},
    data() {
      return {
        tickets: [],
        isLoading: true,
      }
    },
    async created() {
      let {query} = this.$route;
      let taxCode = query.taxCode;
      let filter = {}
      if (query.number) filter.numero_pratica_regionale = {eq: query.number}

      let params = {filter};
      this.isLoading = true;

      try{
        // let response = await getRicevutePagamentiSanitari(taxCode, {params: params});
      } catch (e) {

      }
      this.isLoading = false;
      // this.tickets = response.data;
    }
  }
</script>

