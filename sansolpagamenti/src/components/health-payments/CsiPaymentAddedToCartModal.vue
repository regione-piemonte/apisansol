<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-modal
    :value="value"
    @input="$emit('input', $event)"
    content-classes="q-py-md"
    :content-css="{maxWidth: '800px'}"
  >

    <q-modal-layout footer-class="shadow-0">

      <div class="q-px-md">

        <div>
          <p class="csi-h5">
            Questo pagamento sanitario è stato aggiunto al carrello.
          </p>
        </div>

        <div class="q-mt-lg">
          <csi-ticket-list-item
            v-if="payment"
            :ticket="payment"
            :holder="payment.paziente"
            no-actions
            no-more-actions
            class="ticket-list-item"
          />
        </div>


        <div class="q-mt-lg">
          <csi-buttons>
            <csi-button primary label="Vai al carrello" @click="$emit('go-to-cart')" />
            <csi-button secondary label="Chiudi" v-close-overlay />
          </csi-buttons>
        </div>
      </div>
    </q-modal-layout>

  </q-modal>
</template>


<script>


  import CsiTicketListItem from "components/health-payments/CsiTicketListItem";
  export default {
    name: 'CsiPaymentAddedToCartModal',
    components: {CsiTicketListItem},
    props: {
      value: {type: Boolean, required: true},
      payment: {
        required: true,
        validator: prop => typeof prop === 'object' && !Array.isArray(prop)
      },
    },
    data() {
      return {}
    },
    computed: {},
    created() {
    },
    methods: {},
  }
</script>


<style scoped lang="stylus"></style>
