<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-modal
    :value="value"
    @input="$emit('input', $event)"
    :content-css="{maxWidth: '800px'}"
    ref="modal">

    <q-modal-layout v-if="ticket">

      <!-- MODAL BODY -->
      <!-- --------------------------------------------------------------------------------------------------------- -->
      <div class="q-pa-md">

        <h1 class="csi-h2 q-mb-md">
          Rimuovi pagamento
        </h1>

        <p>
          Vuoi rimuovere questo pagamento dal carrello?
        </p>

        <csi-ticket-list-item :ticket="ticket" :holder="ticket.paziente" no-actions no-more-actions />

        <csi-buttons class="q-mt-lg">
          <csi-button v-close-overlay primary label="Sì, rimuovi" color="negative" @click="$emit('confirm', ticket)" />
          <csi-button v-close-overlay secondary label="No, annulla" @click="$emit('cancel', ticket)" />
        </csi-buttons>
      </div>
    </q-modal-layout>
  </q-modal>
</template>


<script>
  import CsiTicketListItem from "components/health-payments/CsiTicketListItem";
  export default {
    name: 'CsiCartTicketRemoveModal',
    components: {CsiTicketListItem},
    props: {
      value: {type: Boolean, required: false, default: false},
      // come tipi accettiamo "Object" o null
      ticket: {required: true, validator: prop => typeof prop === 'object'}
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
