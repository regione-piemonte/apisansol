<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <lms-page>
    <template v-if="!isLoading">
      <div class="q-mb-md q-mt-lg">I tuoi crediti sono disponibili sul tuo Borsellino elettronico e li puoi utlizzare per
        effettuare nuovi
        pagamenti attraverso il servizio <a class="lms-link cursor-pointer"> Pagamenti Sanitari</a>. Diversamente, per
        alcune ASR, puoi richiedere rimborso
        tramite voucher e/o bonifico.
      </div>

      <!--        FILTRI-->
      <q-card class="bg-transparent q-mt-md" flat>
        <q-card-section class="no-padding">
          <div class="row items-center q-col-gutter-lg">
            <div class="col-md-auto col-12 " v-if="$q.screen.gt.sm">
              <div class="self-center text-weight-bold">
                <q-icon name="filter_list" size="sm" class="q-mr-sm"/>
                Filtri
              </div>
            </div>
            <div class="col-12" v-else>
              <div class="row items-center justify-between">
                <div class="col-auto">
                  <q-btn flat text-color="black" icon="filter_list" label="Filtri" @click="openFilters"/>
                </div>
                <div class="col row justify-end items-center">
                  <div class="q-mr-md text-h4">Totale crediti:</div>
                  <div class="paid-text"><strong>€ {{ paidTotal | decimals }}</strong></div>
                </div>
              </div>
            </div>
            <q-slide-transition>
              <div class="col-md col-12" v-show="isOpenFilters">
                <div class="row items-center q-col-gutter-lg">
                  <div class="col-12 col-md-3">
                    <q-select
                      dense
                      label="Anno"
                      v-model="year"
                      :options="yearOptions"
                      @input="setFilters"
                      :behavior="$q.platform.is.ios === true ? 'dialog' : 'menu'"
                    />
                  </div>
                  <div class="col-12 col-md-3 q-mb-lg" v-if="$q.screen.lt.md">
                    <q-select
                      dense
                      label="Ordina per"
                      v-model="orderType"
                      use-input
                      fill-input
                      hide-selected
                      input-debounce="0"
                      :options="orderOptions"
                      @input="orderList"
                      @clear="orderList"
                      clearable
                      :behavior="$q.platform.is.ios === true ? 'dialog' : 'menu'"
                    >
                    </q-select>
                  </div>
                </div>
              </div>
            </q-slide-transition>

          </div>
        </q-card-section>
      </q-card>
      <div class=" row justify-end items-center q-mt-md" v-if="$q.screen.gt.sm">
        <div class="q-mr-md text-h4">Totale crediti:</div>
        <div class="paid-text"><strong>€ {{ paidTotal | decimals }}</strong></div>
      </div>

      <template v-if="!isLoadingTable">
        <template v-if="$q.screen.gt.md">
          <q-card class="q-pa-md q-mt-md" v-if="creditList.length > 0">
            <!--        TABELLA-->
            <q-table
              :grid="$q.screen.lt.lg"
              :data="creditList"
              :columns="columns"
              row-key="identificativo"
              flat
              hide-bottom
              dense
              :rows-per-page-options="[0]"
            >
              <template v-slot:body="props">
                <q-tr :props="props" :key="`m_${props.row.numero_pratica}`"
                      :class="{'refundable': props.row.rimborsabile}">
                  <q-td key="data" :props="props">
                    {{ props.row.data_pagamento | date }}
                  </q-td>

                  <q-td key="identificativo" :props="props">
                    {{ props.row.numero_pratica }}
                  </q-td>

                  <q-td key="tipologia" :props="props">
                    {{ props.row.motivo_pagamento | empty }}
                  </q-td>

                  <q-td key="scadenza" :props="props">
                    {{ endingYear | date }}
                  </q-td>

                  <q-td key="asl" :props="props">
                    {{ props.row.asr_descrizione | empty }}
                  </q-td>

                  <q-td key="importo" :props="props">
                    <strong>€ {{ props.row.importo_da_rimborsare | decimals }}</strong>
                  </q-td>
                  <q-td>
                  </q-td>
                </q-tr>

                <q-tr :props="props" :key="`e_${props.row.numero_pratica}`" v-show="props.row.rimborsabile">
                  <q-td colspan="12">
                    <div class="row  items-center justify-between q-col-gutter-x-md">
                      <div class="text-primary col-12 col-sm q-pb-md">{{ props.row.rimborsabile_messaggio }}</div>
                      <div class="col-12 col-sm-auto">
                        <lms-buttons class="q-pb-md ">
                          <lms-button no-min-width @click="goRefund(props.row)">RICHIEDI RIMBORSO</lms-button>
                        </lms-buttons>
                      </div>
                    </div>
                  </q-td>
                </q-tr>
              </template>
              <template v-slot:item="props">
                <q-card flat class="fit">
                  <q-card-section class="no-padding justify-between" horizontal>
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
                          <q-item-label> Tipologia</q-item-label>
                          <q-item-label><strong>{{ props.row.motivo_pagamento }}</strong></q-item-label>
                        </q-item-section>
                      </q-item>
                      <!--                        <q-item class="q-px-none">-->
                      <!--                          <q-item-section>-->
                      <!--                            <q-item-label>Scadenza</q-item-label>-->
                      <!--                            <q-item-label><strong>{{endingYear | date}}</strong></q-item-label>-->
                      <!--                          </q-item-section>-->
                      <!--                        </q-item>-->
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
                  <q-card-section class="no-padding" v-show="props.row.rimborsabile">
                    <div class="row q-pt-md items-center justify-between q-col-gutter-x-md">
                      <div class="text-primary col-12 col-sm q-pb-md">{{ props.row.rimborsabile_messaggio }}</div>
                      <div class="col-12 col-sm-auto">
                        <lms-buttons class="q-pb-md ">
                          <lms-button no-min-width @click="goRefund(props.row)">RICHIEDI RIMBORSO</lms-button>
                        </lms-buttons>
                      </div>
                    </div>
                  </q-card-section>
                  <q-separator spaced="12px"></q-separator>
                </q-card>
              </template>
            </q-table>
          </q-card>
          <template v-else>
            <q-banner class="q-mb-md h-banner h-banner--info">
              Non sono presenti crediti
            </q-banner>
          </template>
        </template>
        <div v-else>
          <template v-if="!isLoadingTable">
            <template v-if="creditList.length > 0">
              <q-card class="fit q-pa-md q-my-lg" v-for="credit in creditList" :key="credit.numero_pratica">
                <q-card-section class="no-padding justify-between" horizontal>
                  <q-card-section class="no-padding">
                    <q-item class="q-px-none">
                      <q-item-section>
                        <q-item-label>Data pagamento</q-item-label>
                        <q-item-label><strong>{{ credit.data_pagamento | date }}</strong></q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item class="q-px-none">
                      <q-item-section>
                        <q-item-label>Nr. identificativo spesa</q-item-label>
                        <q-item-label><strong>{{ credit.numero_pratica }}</strong></q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item class="q-px-none">
                      <q-item-section>
                        <q-item-label> Tipologia</q-item-label>
                        <q-item-label><strong>{{ credit.motivo_pagamento }}</strong></q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item class="q-px-none">
                      <q-item-section>
                        <q-item-label>Azienda sanitaria</q-item-label>
                        <q-item-label><strong>{{ credit.asr_descrizione }}</strong></q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-card-section>
                  <q-card-section class="no-padding text-right">
                    <q-item class="q-px-none">
                      <q-item-section>
                        <q-item-label>Importo</q-item-label>
                        <q-item-label class="text-h4">
                          <strong>€ {{ credit.importo_da_rimborsare | decimals }}</strong>
                        </q-item-label>

                      </q-item-section>
                    </q-item>
                  </q-card-section>
                </q-card-section>
                <q-card-section class="no-padding" v-show="credit.rimborsabile">
                  <div class="row q-pt-md items-center justify-between q-col-gutter-x-md">
                    <div class="text-primary col-12 col-sm q-pb-md">{{ credit.rimborsabile_messaggio }}</div>
                    <div class="col-12 col-sm-auto">
                      <lms-buttons class="q-pb-md ">
                        <lms-button no-min-width @click="goRefund(credit)">RICHIEDI RIMBORSO</lms-button>
                      </lms-buttons>
                    </div>
                  </div>
                </q-card-section>

              </q-card>
            </template>
            <template v-else>
              <q-banner class="q-mb-md h-banner h-banner--info">
                Non sono presenti crediti
              </q-banner>
            </template>
          </template>
        </div>
      </template>
      <div v-else>
        <lms-inner-loading :showing="isLoadingTable" block/>
      </div>

      <div class="full-width q-my-lg">
        <lms-buttons>
          <lms-button href="/la-mia-salute/#/pagamenti-sanitari" label="Effettua pagamento" type="a"></lms-button>
        </lms-buttons>
      </div>

    </template>

    <lms-inner-loading :showing="isLoading" block/>
  </lms-page>
</template>

<script>
import {apiErrorNotify, deepClone, isEmpty, orderBy} from "../services/utils";
import {downloadReceipt, getPaidTicketList, getRefundsList} from "../services/api";
import {date, Screen} from "quasar";
import {
  REFOUND_METHOD_MAP,
  TICKET_STATUS_MAP,
  TICKET_TYPES_MAP_CODES,
  TICKET_TYPES_MAP_LABELS
} from "../services/config";
import {REFUND_CREDIT} from "../router/routes";
import {getYearsOptions} from "src/services/business-logic";

const {startOfDate, endOfDate, formatDate} = date;

export default {
  name: "PageCreditList",
  data() {
    return {
      Screen,
      paymentsList: [],
      isLoading: false,
      isLoadingTable: false,
      showRefundBtn: [],
      year: null,
      isOpenFilters: false,
      yearOptions: [],
      columns: [
        {
          name: "data",
          required: true,
          label: "Data pagamento",
          align: "left",
          field: row => row.data_pagamento,
          format: val => `${val}`,
          sortable: true,
          classes: "table-col-max-width--sm"
        },
        {
          name: "identificativo",
          required: true,
          label: "Nr. identificativo spesa",
          align: "left",
          field: row => row.numero_pratica,
          format: val => `${val}`,
          sortable: true,
          classes: "table-col-max-width"
        },
        {
          name: "tipologia",
          required: true,
          label: "Tipologia",
          align: "left",
          field: row => row.motivo_pagamento,
          style: 'max-width: 150px',
          format: val => `${val}`,
          sortable: true,
          classes: "table-col-max-width"
        },
        // {
        //   name: "scadenza",
        //   required: true,
        //   label: "Scadenza",
        //   align: "left",
        //   field: row => row.id,
        //   format: val => `${this.endingYear}`,
        //   sortable: true
        // },
        {
          name: "asl",
          required: true,
          label: "Azienda sanitaria",
          align: "left",
          field: row => row.asr_descrizione,
          style: 'max-width: 200px',
          format: val => `${val}`,
          sortable: true,
          classes: "table-col-max-width"
        },
        {
          name: "importo",
          required: false,
          label: "Importo",
          align: "left",
          field: row => row.importo_da_rimborsare,
          sortable: true,
          classes: "table-col-max-width--sm"
        },
        {
          name: "btn",
          required: false,
          label: "",
          align: "center",
          classes: "table-col-max-width--sm"
        }
      ],
      orderType: '',
      orderOptions: [
        {
          label: 'Data pagamento',
          value: 'data_pagamento'
        },
        {
          label: 'Numero Identificativo spesa',
          value: 'numero_pratica'
        },
        {
          label: 'Tipologia',
          value: 'motivo_pagamento'
        },
        {
          label: 'Azienda sanitaria',
          value: 'asr_descrizione'
        },
        {
          label: 'Importo',
          value: 'importo_da_rimborsare'
        }
      ],
      filteredCreditList: []
    };
  },
  watch: {
    Screen: {
      deep: true,
      immediate: true,
      handler(newval, oldval) {
        if (newval.gt.sm)
          this.isOpenFilters = true
      }
    }
  },
  computed: {
    cf() {
      return this.$store.getters["getTaxCode"];
    },
    endingYear() {
      return date.endOfDate(new Date(), "year");
    },
    creditList() {
      let creditList = [];

      let filteredPaymentsList = this.paymentsList?.filter(a => a.stato_pratica_codice === TICKET_STATUS_MAP.CREDIT &&
      a.rimborso_modalita_codice === REFOUND_METHOD_MAP.BORSELLINO);
      if (filteredPaymentsList) {
        creditList = filteredPaymentsList.map(item => {
          let refundMethods = this.getRefundTypeOptions(item)
          let refundMsg = this.getRefundMethodMessage(refundMethods)
          let payment = item.ricevute_pagamento[0]
          item.data_pagamento = payment?.data_pagamento
          item.rimborsabile = refundMethods.voucher || refundMethods.wire_transfer
          item.rimborsabile_messaggio = refundMsg
          item.lista_rimborsi = refundMethods
          return item
        })
      }
      return creditList;
    },

    paidTotal() {
      let total = 0;
      this.creditList.forEach(
        expense => (total = total + expense.importo_da_rimborsare)
      );

      return total;
    },
    refoundMethods() {
      return this.$store.getters['getPaymentTypes']
    }
  },
  created: async function () {
    this.isLoading = true;
    this.yearOptions = getYearsOptions()
    this.year = new Date().getFullYear()
    try {
      let today = new Date();
      let config = {};
      config.params = {
        anno_pagamento: date.formatDate(today, "YYYY")
      };

      let response = await getPaidTicketList(this.cf, config);
      this.paymentsList = response.data;
    } catch (e) {
      let message = "Non è stato possibile recuperare i crediti";
      apiErrorNotify({e, message});
    }
    this.isLoading = false;
  },
  methods: {
    getRefundTypeOptions(credit) {
      let refundList = {
        voucher: false,
        wire_transfer: false
      }

      let refundMethods = this.refoundMethods?.filter(method =>
        method.id_asr.toString() === credit.asr_id.toString() &&
        method.codice_servizio === credit.servizio_codice &&
        method.codice_versamento === credit.versamento_codice &&
        TICKET_TYPES_MAP_CODES[credit.motivo_pagamento] === method.motivo_pagamento)

      if (refundMethods.length > 0) {
        let isVoucher = !isEmpty(refundMethods.find(r => r.modalita_erogazione === REFOUND_METHOD_MAP.VOUCHER))
        let isWireTransfer = !isEmpty(refundMethods.find(r =>
          r.modalita_erogazione === REFOUND_METHOD_MAP.BONIFICO &&
          (!r.importo_bin_bonifico || r.importo_bin_bonifico?.valore <= credit.importo_da_rimborsare)
          ))
        refundList.voucher = isVoucher
        refundList.wire_transfer = isWireTransfer
      }

      return refundList
    },
    getRefundMethodMessage(refundMethod) {
      let msg = ''
      if (refundMethod.wire_transfer && refundMethod.voucher) {
        msg = 'ricevendo un bonifico o tramite voucher';
      } else if (refundMethod.wire_transfer) {
        msg = 'ricevendo un bonifico';
      } else if (refundMethod.voucher) {
        msg = 'tramite voucher';
      }

      return msg ? `Questo credito può essere rimborsato ${msg}` : ''
    },
    goRefund(refund) {
      let name = REFUND_CREDIT.name;
      let params = {
        item: refund,
        id: refund.numero_pratica
      };
      this.$router.push({
        name,
        params
      });
    },
    getAsrLabel(id) {
      let asrList = this.$store.getters['getAsrList']
      let asr = asrList.find(asr => asr.id?.toString() === id)
      return asr ? asr.descrizione : ''
    },
    openFilters() {
      this.isOpenFilters = !this.isOpenFilters
    },
    async setFilters(val) {
      this.isLoadingTable = true;
      if (this.lastYearFiltered !== this.year) {
        this.lastYearFiltered = this.year;
        try {
          let today = new Date();
          today.setFullYear(this.year);
          let config = {};
          config.params = {
            anno_pagamento: this.year
          };

          let response = await getPaidTicketList(this.cf, config);
          this.paymentsList = response.data;

        } catch (e) {
          let message = "Non è stato possibile ottenere la lista dei pagamenti";
          apiErrorNotify({e, message});
        }
      }

      this.isLoadingTable = false;
    },
    orderList() {
      let orderValue = this.orderType?.value ?? 'data_pagamento'
      let creditListToOrder = [...this.paymentsList];
      let orderedList = orderBy(creditListToOrder, [orderValue])

      this.paymentsList = orderedList
    },
  }
};
</script>
<style lang="sass">
tr
  height: 48px !important

.refundable td
  border-bottom: none

.table-col-max-width
  max-width: 300px
  white-space: normal !important

.table-col-max-width--sm
  max-width: 120px
  white-space: normal !important
</style>
