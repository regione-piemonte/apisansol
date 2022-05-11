<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <lms-page padding>
    <template v-if="!isLoading">
      <div class="row q-mt-md q-mr-sm">
        <lms-page-title>Richiedi Rimborso</lms-page-title>
      </div>

      <template v-if="!isRequestFeedback">
        <template v-if="isRefundable">
          <div class="row q-mt-xl">
            <div class="text-h4"><strong>Prestazione</strong></div>
          </div>
          <div class="row q-mt-md q-mr-sm">
            <q-card class="col-12 col-md-12 q-pa-md" id="ticket-service">
              <q-table
                :grid="$q.screen.lt.lg"
                :data="[ticket]"
                :columns="columns"
                wrap-cells
                row-key="identificativo"
                flat
                hide-bottom
                dense
                :rows-per-page-options="[0]"
              >
                <template v-slot:body-cell-data="props"
                >
                  <q-td :props="props">{{ props.value | date }}</q-td>
                </template>
                <template v-slot:body-cell-importo="props"
                >
                  <q-td :props="props"
                  ><strong>€ {{ props.value |decimals }}</strong></q-td
                  >

                </template>


                <template v-slot:item="props">
                  <q-card flat class="fit">
                    <q-card-section class="justify-between" horizontal>
                      <q-card-section class="no-padding">
                        <q-item class="q-px-none">
                          <q-item-section>
                            <q-item-label>Data pagamento</q-item-label>
                            <q-item-label><strong>{{ props.row.data_pagamento | date }}</strong></q-item-label>
                          </q-item-section>
                        </q-item>
                        <q-item class="q-px-none">
                          <q-item-section>
                            <q-item-label>Nr. identificativo spesa</q-item-label>
                            <q-item-label><strong>{{ props.row.numero_pratica }}</strong></q-item-label>
                          </q-item-section>
                        </q-item>
                        <q-item class="q-px-none">
                          <q-item-section>
                            <q-item-label>Nr. identificativo rimborso</q-item-label>
                            <q-item-label><strong>-</strong></q-item-label>
                          </q-item-section>
                        </q-item>
                        <q-item class="q-px-none">
                          <q-item-section>
                            <q-item-label> Tipologia</q-item-label>
                            <q-item-label><strong>{{ props.row.motivo_pagamento }}</strong></q-item-label>
                          </q-item-section>
                        </q-item>
                        <q-item class="q-px-none">
                          <q-item-section>
                            <q-item-label>Asl</q-item-label>
                            <q-item-label><strong>{{ props.row.asr_descrizione }}</strong></q-item-label>
                          </q-item-section>
                        </q-item>
                      </q-card-section>
                      <q-card-section class="no-padding text-right">
                        <q-item class="q-px-none">
                          <q-item-section>
                            <q-item-label>Importo</q-item-label>
                            <q-item-label class="text-h4">
                              <strong>€ {{ props.row.importo_da_rimborsare | decimals }}</strong>
                            </q-item-label>

                          </q-item-section>
                        </q-item>
                      </q-card-section>
                    </q-card-section>
                  </q-card>
                </template>
              </q-table>
            </q-card>
          </div>
          <div class="row q-mt-xl q-mb-md">
            <div class="text-h4"><strong>Scegli modalità di rimborso</strong></div>
          </div>
          <div class="row q-mt-d q-col-gutter-lg justify-between items-start">
            <div class="col-12 col-md-6" v-if="refundOptions.wire_transfer">
              <q-card
                class="q-pa-lg"
                :class="{ 'modcard--active': isIbanRefund}"
              >
                <q-card-section>
                  <div class="text-center q-mb-md">
                    <q-icon name="img:/statics/la-mia-salute/icone/iban.svg" size="80px"></q-icon>
                  </div>

                  <div class="text-h4 text-center text-h6"><strong>Bonifico</strong></div>
                  <div class="text-center q-my-sm">
                    <q-radio
                      keep-color
                      size="72px"
                      color="primary"
                      v-model="refundOption"
                      :val="REFOUND_METHOD_MAP.BONIFICO"
                    />
                  </div>
                  <div class="text-body1 text-center">
                    Riceverai l’accredito sull'IBAN da te indicato.
                  </div>
                  <div v-if="isIbanRefund" class="q-mt-md">
                    <q-input
                      outlined
                      type="text"
                      counter
                      v-model.trim="iban"
                      @input="onInputIban"
                      :maxlength="IBAN_LENGTH"
                      @keydown.space.prevent
                      label="IBAN"
                      no-error-icon
                      :rules="[
                        val => !!val || 'Inserisci un IBAN Valido',
                        val => isValidFormatIBAN(val) || 'Inserisci un IBAN Valido',
                        isValidIBANLength
                      ]"
                      lazy-rules
                    />
                  </div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-12 col-md-6" v-if="refundOptions.voucher">
              <q-card
                class="q-pa-lg"
                :class="{ 'modcard--active': isVoucherRefund}"
              >
                <q-card-section>
                  <div class="text-center q-mb-md">
                    <q-icon name="img:/statics/la-mia-salute/icone/contanti.svg" size="80px"></q-icon>
                  </div>
                  <div class="text-h4 text-center text-h6"><strong>Voucher</strong></div>
                  <div class="text-center q-my-sm">
                    <q-radio
                      keep-color
                      color="primary"
                      size="72px"
                      v-model="refundOption"
                      :val="REFOUND_METHOD_MAP.VOUCHER"
                    />
                  </div>
                  <div class="text-body1 text-center">
                    Presentandoti agli sportelli bancari convenzionati con il
                    voucher riceverai denaro contante.
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>
          <lms-buttons class="q-mt-xl q-px-md">
            <lms-button
              color="primary"
              @click="clickConfirmBtn"
              :disable="!refundOption"
            >
              CONFERMA
            </lms-button>
          </lms-buttons>
        </template>
        <template v-else>
          <div class="col-12 col-md-12 q-mt-xl">
            <q-banner class="h-banner h-banner--warning">Il ticket di rimborso non è stato trovato.</q-banner>
            <!--          <q-card flat bordered class="row col-12 col-md-12">-->
            <!--            <q-card-section class="successCard__error col-2">-->
            <!--            <div class="column col-2 justify-center">-->
            <!--              <q-icon name="highlight_off" class="material-icon md-light absolute-center" style="font-size: 48px;"/>-->
            <!--            </div>-->
            <!--            </q-card-section>-->
            <!--            <q-card-section class="col-10">-->
            <!--              <div class="relative-position">-->
            <!--                <div class="text-h4 bold text-weight-bold">Il ticket di rimborso non è stato trovato!</div>-->
            <!--              </div>-->
            <!--            </q-card-section>-->
            <!--          </q-card>-->
            <lms-buttons class="q-mt-xl q-px-md">
              <lms-button outline class="q-mt-md" :to="HOME">Torna alla home</lms-button>
            </lms-buttons>
          </div>
        </template>
      </template>
      <template v-else>
        <q-card class="q-mt-xl " v-if="!errorPage">
          <q-card-section horizontal class="q-pa-none row">
            <q-card-section class="successCard__icon col-2 bg-positive">
              <div class="column col-2 justify-center">
                <q-icon name="check_circle" color="white"
                        text-color="positive" class="material-icon md-light absolute-center" style="font-size: 48px;"/>
              </div>
            </q-card-section>
            <q-card-section class="col-10">
              <div class="relative-position" v-if="isVoucherRefund">
                <div class="text-h4 bold text-weight-bold">La tua richiesta di rimborso è stata correttamente salvata
                </div>
                <div class="text-subtitle1 q-mt-md">Vai nella sezione Rimborsi, stampa il voucher e presentati agli sportelli bancari convenzionati
                  per ricevere il denaro contante
                </div>
              </div>
              <div class="relative-position" v-if="isIbanRefund">
                <div class="text-h4 bold text-weight-bold">La tua richiesta di rimborso è stata correttamente salvata
                </div>
                <div class="text-subtitle1 q-mt-md">Riceverai il bonifico all'IBAN da te indicato.</div>
                <div class="text-subtitle2 q-mt-md">Troverai il riepilogo della tua scelta nella sezione "Rimborsi"
                </div>
              </div>
            </q-card-section>
          </q-card-section>

        </q-card>
        <div v-else>
          <q-banner class="h-banner h-banner--negative q-mt-xl q-mb-md">
            La richiesta non è andata a buon fine.
          </q-banner>
        </div>
        <lms-buttons class="q-mt-md q-px-md">
          <lms-button outline class="q-mt-md" :to="HOME">Torna alla home</lms-button>
        </lms-buttons>
      </template>
    </template>

    <!--    DIALOG DI CONFERMA-->
    <q-dialog v-model="openConfirmationDialog" :maximized="$q.screen.lt.sm">
      <q-card>
        <q-toolbar class="">
          <q-toolbar-title>Hai selezionato rimborso su {{ REFOUND_METHOD_MAP_LABELS[refundOption] }}.</q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup/>
        </q-toolbar>

        <q-card-section class="">
          Sei sicuro di voler confermare?<br>
          Selezionando un’opzione di rimborso non potrai cambiare la scelta effettuata.
        </q-card-section>

        <q-card-actions align="right">
          <lms-buttons padding>
            <lms-button :loading="isLoadingRequest" @click="postRefundRequest">Conferma</lms-button>
            <lms-button outline v-close-popup>Annulla</lms-button>
          </lms-buttons>
        </q-card-actions>
      </q-card>
    </q-dialog>


    <lms-inner-loading :showing="isLoading"/>

  </lms-page>
</template>
<script>
import {getPaidTicketList, getRefundsList, newRefundPost} from "../services/api";
import {isValidIBANNumber, apiErrorNotify, isEmpty} from "../services/utils";
import {TICKET_STATUS_MAP, REFOUND_METHOD_MAP, REFOUND_METHOD_MAP_LABELS} from "../services/config";
import {HOME, REFUND_CREDIT_FEEDBACK} from "../router/routes";
import {date} from "quasar";

const IBAN_LENGTH= 27
export default {
  name: "PageRefundCredit",
  data() {
    return {
      isLoading: false,
      refundOption: null,
      ticket: null,
      IBAN_LENGTH,
      REFOUND_METHOD_MAP,
      REFOUND_METHOD_MAP_LABELS,
      iban: null,
      ticketId: null,
      isIbanValid: false,
      isLoadingRequest: false,
      successPage: null,
      errorPage: false,
      openConfirmationDialog: false,
      HOME,
      isRequestFeedback: false,
      isVoucherPrinting:false,
      columns: [
        {
          name: "data",
          required: true,
          label: "Data pagamento",
          align: "left",
          field: row => row.data_pagamento,
          format: val => `${val}`,
        },
        {
          name: "identificativo",
          required: true,
          label: "Nr. identificativo spesa",
          align: "left",
          field: row => row.numero_pratica,
          format: val => `${val}`,
        },
        {
          name: "idrimborso",
          required: true,
          label: "Nr. identificativo rimborso",
          align: "left",
          field: row => null ?? '-',
          format: val => `${val}`,
        },
        {
          name: "tipologia",
          required: true,
          label: "Tipologia",
          align: "left",
          field: row => row.motivo_pagamento,
          style: 'max-width: 150px',
          format: val => `${val}`,
        },
        {
          name: "asl",
          required: true,
          label: "Azienda sanitaria",
          align: "left",
          field: row => row.asr_descrizione,
          style: 'max-width: 200px',
          format: val => `${val}`,
        },
        {
          name: "importo",
          required: false,
          label: "Importo",
          align: "left",
          field: row => row.importo_da_rimborsare,
        },

      ]
    };
  },
  computed: {
    isRefundable() {
      return this.ticket?.rimborsabile
    },
    refundOptions() {
      return this.ticket?.lista_rimborsi
    },

    cf() {
      return this.$store.getters["getTaxCode"];
    },

    isValidIban() {
      return !isEmpty(this.iban) && isValidIBANNumber(this.iban) || !this.isIbanRefund
    },

    isIbanRefund() {
      return this.refundOption === REFOUND_METHOD_MAP.BONIFICO
    },
    isVoucherRefund() {
      return this.refundOption === REFOUND_METHOD_MAP.VOUCHER
    },


  },

  async created() {
    let {item, id} = this.$route.params;
    this.isLoading = true;
    this.ticketId = id
    this.ticket = item;
    this.isLoading = false;
    if (!this.ticket) this.$router.back()

  },
  methods: {
    clickConfirmBtn() {
      if (!this.isValidIban || !this.refundOption) return
      this.openConfirmationDialog = true
    },
    async postRefundRequest() {
      this.isLoadingRequest = true
      let payload = {
        rimborso_modalita_codice: this.refundOption,
        iban: this.isIbanRefund ? this.iban : null
      };
      try {
        await newRefundPost(this.cf, this.ticketId, payload);
        this.successPage = this.refundOption;
      } catch (e) {
        let message = "Non è stato effettuare il rimborso. Riprova più tardi";
        apiErrorNotify({e, message});
        this.errorPage = true
      }
      this.isLoadingRequest = false
      this.openConfirmationDialog = false
      this.isRequestFeedback = true
    },
    onInputIban(v) {
      let nospaces = v.replace(/[\s\/]/g, '')
      this.iban = nospaces.toUpperCase()
    },
    isValidFormatIBAN(iban) {
      return isValidIBANNumber(iban)
    },
    isValidIBANLength(iban) {
      return (v) => v?.length === IBAN_LENGTH|| `L'IBAN deve contenere ${IBAN_LENGTH} caratteri`
    },
    async printVoucher(){
      this.isVoucherPrinting = true
      let ticketId = this.ticket.numero_pratica
      let params = {
        modalita_rimborso: this.ticket.rimborso_modalita_codice,
        stampabile:true,
        codice_asr: this.ticket.asr_id
      }
      try{
        await this.onPrint(ticketId,params)
        this.isVoucherPrinting = false
      }catch (error) {
        let message="Non è stato possibile scaricare il documento"
        apiErrorNotify({error, message})
      }

    }
  }
};
</script>
<style lang="scss">

#ticket-service {
  .q-table tbody td {
    font-size: 0.875rem !important
  }

  .q-table tbody td:before {
    background: none !important
  }

  .first-row td {
    border-bottom: none
  }
}


</style>
