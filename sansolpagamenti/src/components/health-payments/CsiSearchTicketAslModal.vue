<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-modal
    :value="value"
    @input="$emit('input', $event)"
    @show="loadAsr"
    :content-css="{minWidth: '60vw'}"
  >

    <q-modal-layout>
      <q-toolbar slot="header">
        <q-toolbar-title>Cerca per ASL</q-toolbar-title>
        <q-btn flat round icon="close" v-close-overlay/>
      </q-toolbar>

      <q-stepper ref="stepper" class="shadow-0">
        <!-- STEP DI RICERCA -->
        <!-- ------------------------------------------------------------------------------------------------------- -->
        <q-step title="Cerca" class="q-body-1 full-width">
          <p>
            Presso quale Azienda Sanitaria hai effettuato la prenotazione?
          </p>

          <div>
            <q-field>
              <q-select
                v-model="selectedAsrValue"
                :options="asrsSelectOptions"
                float-label="Azienda Sanitaria"
                clearable
                filter
                autofocus-filter
                filter-placeholder="Cerca tra le Aziende Sanitarie"
              />
            </q-field>
          </div>

          <!-- INTEGRAZIONE VECCHIO SERVIZIO -->
          <csi-search-ticket-asl-form-integration
            :asl-id="selectedAsrValue"
            :tax-code="taxCode"
            ref="integration"
          />

          <csi-buttons class="q-mt-lg">
            <csi-button primary label="Continua" :loading="isSearchingAsrTickets" @click="searchAsrTickets"/>
          </csi-buttons>
        </q-step>

        <!-- STEP DI VISUALIZZAZIONE -->
        <!-- ------------------------------------------------------------------------------------------------------- -->
        <q-step title="pagamento">
          <template v-if="selectedAsr">
            <template v-if="!asrTickets || asrTickets.length <= 0">
              <q-alert color="info" class="q-body-1">
                Nessun pagamento trovato per l'Azienda Sanitaria
                <span class="q-body-2">{{selectedAsr.descrizione}}</span>
              </q-alert>

              <csi-buttons class="q-mt-lg">
                <csi-button secondary label="Cerca di nuovo" @click="$refs.stepper.previous()"/>
              </csi-buttons>
            </template>

            <template v-else>
              <div class="text-center">
                <csi-health-payments-count-badge :health-payments="asrTickets"/>
              </div>

              <csi-ticket-list-item
                v-for="ticket in asrTickets"
                :key="ticket.uuid"
                :ticket="ticket"
                :holder="ticket.paziente"
                class="q-mt-md"
              />
            </template>
          </template>
        </q-step>
      </q-stepper>
    </q-modal-layout>
  </q-modal>
</template>


<script>
  import CsiSearchTicketAslFormIntegration from "components/health-payments/CsiSearchTicketAslFormIntegration";
  import CsiTicketListItem from "components/health-payments/CsiTicketListItem";
  import {getAsrTemp, getHealthPaymentsToPay} from "@services/api/health-payments";
  import {notifyError, notifyErrorCsi} from "@services/api/utils";
  import {isNil} from "@services/global/utils";
  import CsiHealthPaymentsCountBadge from "components/health-payments/CsiHealthPaymentsCountBadge";

  export default {
    name: 'CsiSearchTicketAslModal',
    components: {CsiHealthPaymentsCountBadge, CsiTicketListItem, CsiSearchTicketAslFormIntegration},
    props: {
      value: {type: Boolean, required: false, default: false},
    },
    data() {
      return {
        areAsrsLoaded: false,
        asrs: [],
        selectedAsrValue: null,
        asrTickets: [],
        isSearchingAsrTickets: false,
      }
    },
    computed: {
      user() {
        return this.$store.getters['global/user']
      },
      taxCode() {
        return this.$store.getters['healthPayments/getTaxCode']
      },
      asrsSelectOptions: function () {
        return this.asrs.map(asr => ({label: asr.descrizione, value: asr.id}));
      },
      selectedAsr() {
        if (isNil(this.selectedAsrValue)) return undefined;
        return this.asrs.find(asr => asr.id === this.selectedAsrValue);
      },
    },
    created() {
    },
    methods: {
      async loadAsr() {
        if (!this.areAsrsLoaded) {
          // let response = await getAsr();
          let response = await getAsrTemp();
          this.asrs = response.data;
          this.areAsrsLoaded = true;
        }
      },
      async searchAsrTickets() {

        if (!this.selectedAsrValue) {
          this.$q.notify({
            color: 'warning',
            message: `Seleziona l'azienda sanitaria prima di continuare`
          })
          return
        }


        let asl = this.asrs.find(a => a.id === this.selectedAsrValue)
        if (asl && !asl.nuovo) {
          this.$refs.integration.submit()
          return
        }


        let filter = {
          id_asr: {eq: this.selectedAsrValue}
        }

        this.isSearchingAsrTickets = true

        try {
          let params = {filter}
          let response = await getHealthPaymentsToPay(this.taxCode, {params, _no5XXRedirect: true})
          this.asrTickets = response.data
          this.$refs.stepper.next()
        } catch (e) {
          console.error(e)
          notifyErrorCsi(e, 'Non è stato possibile cercare i pagamenti sanitari');
          // notifyError(e, 'Non è stato possibile cercare i pagamenti sanitari')
        }

        this.isSearchingAsrTickets = false
      }
    },
  }
</script>


<style scoped lang="stylus"></style>
