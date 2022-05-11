<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <lms-page >
    <template v-if="!isLoading">
      <!--        FILTRI-->
      <q-card class="bg-transparent q-mt-lg" flat>
        <q-card-section class="no-padding">
          <div class="row items-center q-col-gutter-lg">
            <div v-if="$q.screen.gt.sm" class="col-md-auto col-12 ">
              <div class="self-center text-weight-bold">
                <q-icon class="q-mr-sm" name="filter_list" size="sm"/>
                Filtri
              </div>
            </div>
            <div v-else class="col-12">
              <div class="row items-center justify-between">
                <div class="col-auto">
                  <q-btn flat text-color="black" icon="filter_list" label="Filtri"
                         @click="openFilters"/>
                </div>
                <div class="col row justify-end items-center">
                  <div class="text-h4">Totale rimborsi:</div>
                  <div class="q-ml-sm paid-text"><strong>€ {{ paidTotal | decimals }}</strong></div>
                </div>
              </div>
            </div>
            <q-slide-transition>
              <div v-show="isOpenFilters" class="col-md col-12">
                <div class="row items-center q-col-gutter-lg">
                  <div class="col-12 col-md-3">
                    <q-select
                      v-model="year"
                      :behavior="$q.platform.is.ios === true ? 'dialog' : 'menu'"
                      :options="yearOptions"
                      dense
                      label="Anno"
                      @input="setFilters"
                    />
                  </div>
                  <div class="col-12 col-md-3">
                    <q-select
                      v-model="type"
                      :behavior="$q.platform.is.ios === true ? 'dialog' : 'menu'"
                      :options="typeOptions"
                      clearable
                      dense
                      label="Tipologia"
                      @clear="setFilters"
                      @input="setFilters"
                    >
                    </q-select>
                  </div>
                  <div class="col-12 col-md-3">
                    <q-select
                      v-model="refundType"
                      :behavior="$q.platform.is.ios === true ? 'dialog' : 'menu'"
                      :options="refundTypeOptions"
                      clearable
                      dense
                      label="Modalità rimborso"
                      @clear="setFilters"
                      @input="setFilters"
                    >
                    </q-select>
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
      <div v-if="$q.screen.gt.sm" class=" row justify-end items-center q-mt-md">
        <div class="q-mr-md text-h4">Totale rimborsi:</div>
        <div class="paid-text"><strong>€ {{ paidTotal | decimals }}</strong></div>
      </div>

      <template v-if="!isLoadingTable">
        <template v-if="$q.screen.gt.md">
          <q-card class="q-pa-md q-mt-md" v-if="filteredRefundList.length > 0">
            <!--        TABELLA-->
            <q-table
              :columns="columns"
              :data="filteredRefundList"
              :grid="$q.screen.lt.lg"
              flat
              dense
              hide-bottom
              row-key="name"
              :rows-per-page-options="[0]"
            >

              <template v-slot:body="props">
                <q-tr :props="props"
                      :key="`m_${props.row.numero_pratica}`"
                      class="first-row"
                >
                  <q-td key="data" :props="props">
                    {{ props.row.data_rimborso | date }}
                  </q-td>

                  <q-td key="identificativo" :props="props">
                    {{ props.row.numero_pratica }}
                  </q-td>

                  <q-td key="idrimborso" :props="props">
                    {{ props.row.numero_rimborso }}
                  </q-td>
                  <q-td key="tipologia" :props="props">
                    {{ props.row.motivo_pagamento | empty }}
                  </q-td>

                  <q-td key="modalita" :props="props">
                    {{ props.row.rimborso_modalita_descrizione | empty }}
                  </q-td>


                  <q-td key="importo" :props="props">
                    <strong>€ {{ props.row.importo_rimborso | decimals }}</strong>
                  </q-td>
                  <q-td>

                  </q-td>

                </q-tr>
                <q-tr :props="props" :key="`e_${props.row.numero_pratica}`">
                  <q-td colspan="12" class="text-right">
                    <lms-refund-buttons class="q-py-sm" :refund="props.row"/>
                  </q-td>
                </q-tr>
              </template>
              <template v-slot:item="props">
                <div class="col-12 q-my-md">
                  <q-card class="fit">
                    <q-card-section class="no-padding justify-between" horizontal>
                      <q-card-section class="no-padding">
                        <q-item class="q-px-none">
                          <q-item-section>
                            <q-item-label>Data</q-item-label>
                            <q-item-label><strong>{{ props.row.data_rimborso | date }}</strong></q-item-label>
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
                            <q-item-label><strong>{{ props.row.numero_rimborso }}</strong></q-item-label>
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
                            <q-item-label>Modalità di rimborso</q-item-label>
                            <q-item-label><strong>{{ props.row.rimborso_modalita_descrizione }}</strong></q-item-label>
                          </q-item-section>
                        </q-item>
                      </q-card-section>
                      <q-card-section class="no-padding text-right">
                        <q-item class="q-px-none">
                          <q-item-section>
                            <q-item-label>Importo</q-item-label>
                            <q-item-label class="text-h4">
                              <strong>€ {{ props.row.importo_rimborsato | decimals }}</strong>
                            </q-item-label>
                          </q-item-section>
                        </q-item>
                      </q-card-section>

                    </q-card-section>
                    <q-card-actions align="right">
                      <lms-refund-buttons v-if="props" :refund="props.row"/>
                    </q-card-actions>
                    <q-separator spaced="12px"></q-separator>
                  </q-card>
                </div>
              </template>

            </q-table>
          </q-card>
          <template v-else>
            <q-banner class="q-my-md h-banner h-banner--info">
              Non ci sono rimborsi per i filtri impostati
            </q-banner>
          </template>
        </template>

        <div v-else>

          <template v-if="filteredRefundList.length > 0">
            <q-card class="fit q-pa-md q-my-lg" v-for="refund in filteredRefundList" :key="refund.numero_rimborso">
              <q-card-section class="no-padding justify-between" horizontal>
                <q-card-section class="no-padding">
                  <q-item class="q-px-none">
                    <q-item-section>
                      <q-item-label>Data</q-item-label>
                      <q-item-label><strong>{{ refund.data_rimborso | date }}</strong></q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item class="q-px-none">
                    <q-item-section>
                      <q-item-label>Nr. identificativo spesa</q-item-label>
                      <q-item-label><strong>{{ refund.numero_pratica }}</strong></q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item class="q-px-none">
                    <q-item-section>
                      <q-item-label>Nr. identificativo rimborso</q-item-label>
                      <q-item-label><strong>{{ refund.numero_rimborso }}</strong></q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item class="q-px-none">
                    <q-item-section>
                      <q-item-label> Tipologia</q-item-label>
                      <q-item-label><strong>{{ refund.motivo_pagamento }}</strong></q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item class="q-px-none">
                    <q-item-section>
                      <q-item-label>Modalità di rimborso</q-item-label>
                      <q-item-label><strong>{{ refund.rimborso_modalita_descrizione }}</strong></q-item-label>
                    </q-item-section>
                  </q-item>
                </q-card-section>
                <q-card-section class="no-padding text-right">
                  <q-item class="q-px-none">
                    <q-item-section>
                      <q-item-label>Importo</q-item-label>
                      <q-item-label class="text-h4">
                        <strong>€ {{ refund.importo_rimborsato | decimals }}</strong>
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-card-section>

              </q-card-section>
              <q-card-section class="q-py-sm q-px-none">
                <lms-refund-buttons
                  :refund="refund"
                />
              </q-card-section>


            </q-card>
          </template>
          <template v-else>
            <q-banner class="q-my-md h-banner h-banner--info">
              Non ci sono rimborsi per i filtri impostati
            </q-banner>
          </template>
        </div>
      </template>
      <div v-else>
        <lms-inner-loading :showing="isLoadingTable" block/>
      </div>
      <div class="full-width q-mt-lg q-mb-md">
        <lms-buttons>
          <lms-button href="/la-mia-salute/#/pagamenti-sanitari" label="Effettua pagamento" type="a"></lms-button>
        </lms-buttons>
      </div>
    </template>

    <lms-inner-loading :showing="isLoading" block/>
  </lms-page>
</template>

<script>
import {apiErrorNotify, deepClone, isEmpty, orderBy, uniqueElementsBy} from "../services/utils";
import {getPaidTicketList} from "../services/api";
import {date, Screen} from "quasar";
import {
  REFOUND_METHOD_MAP,
  REFOUND_METHOD_MAP_LABELS,
  TICKET_STATUS_MAP,
  TICKET_TYPES_MAP_LABELS
} from "../services/config";
import {getYearsOptions} from "src/services/business-logic";
import LmsRefundButtons from "components/LmsRefundButtons";

const {startOfDate, endOfDate, formatDate} = date;

const REFUND_TYPE_OPTIONS = [
  {
    label: REFOUND_METHOD_MAP_LABELS[REFOUND_METHOD_MAP.VOUCHER],
    value: REFOUND_METHOD_MAP.VOUCHER
  },
  {
    label: REFOUND_METHOD_MAP_LABELS[REFOUND_METHOD_MAP.BONIFICO],
    value: REFOUND_METHOD_MAP.BONIFICO
  }
]

export default {
  name: "PageRefundList",
  components: {LmsRefundButtons},
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
  data() {
    return {
      Screen,
      REFOUND_METHOD_MAP,
      refundDataList: [],
      filteredRefundList: [],
      isLoading: false,
      isLoadingTable: false,
      isLoadingPrinting: false,
      year: null,
      lastYearFiltered: new Date().getFullYear(),
      filterPressed: false,
      type: null,
      refundType: null,
      refundTypeOptions: REFUND_TYPE_OPTIONS,
      typeToFilter: null,
      yearOptions: [],
      typeOption: [],
      aslOptions: [],
      isOpenFilters: false,
      columns: [
        {
          name: "data",
          required: true,
          label: "Data",
          align: "left",
          field: row => row.data_rimborso,
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
          name: "idrimborso",
          required: true,
          label: "Nr. identificativo rimborso",
          align: "left",
          field: row => row.numero_rimborso,
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
          style: 'max-width: 170px',
          format: val => `${val}`,
          sortable: true,
          classes: "table-col-max-width"
        },
        {
          name: "modalita",
          required: true,
          label: "Modalità di rimborso",
          align: "left",
          field: row => row.rimborso_modalita_descrizione,
          format: val => `${val}`,
          sortable: true,
          classes: "table-col-max-width--sm"
        },
        {
          name: "importo",
          required: false,
          label: "Importo",
          align: "left",
          field: row => row.importo_rimborso,
          sortable: true,
          classes: "table-col-max-width--sm"
        },
        {
          name: "button",
          required: true,
          label: "",
          align: "left",
          classes: "table-col-max-width--sm"
        }
      ],
      orderType: '',
      orderOptions: [
        {
          label: 'Data',
          value: 'data_rimborso'
        },
        {
          label: 'Numero Identificativo spesa',
          value: 'numero_pratica'
        },
        {
          label: 'Numero Identificativo rimborso',
          value: 'numero_rimborso'
        },
        {
          label: 'Tipologia',
          value: 'motivo_pagamento'
        },
        {
          label: 'Modalità di rimborso',
          value: 'rimborso_modalita_descrizione'
        },
        {
          label: 'Importo',
          value: 'importo_rimborso'
        }
      ],

    };
  },
  computed: {
    cf() {
      return this.$store.getters["getTaxCode"];
    },

    aslList() {
      let options = [];
      let aslList = [];

      for (let i = 0; i < this.refundList.length; i++) {
        let refund = this.refundList[i]
        aslList.push({
          value: refund.asr_codice,
          label: refund.asr_descrizione
        });
      }

      let uniqueElements = uniqueElementsBy(aslList, (a, b) => a.value === b.value);
      options = orderBy(uniqueElements, ['label'])

      return options;
    },
    typeOptions() {
      let options = [];
      let typeList = [];
      for (let i = 0; i < this.refundList.length; i++) {
        let refund = this.refundList[i]
        typeList.push({
          value: refund.motivo_pagamento,
          label: refund.motivo_pagamento
        });
      }
      let uniqueElements = uniqueElementsBy(typeList, (a, b) => a.value === b.value);

      options = orderBy(uniqueElements, ['label'])
      return options;
    },
    refundList() {
      let refundList = []
      let filteredPaymentsList = this.refundDataList?.filter(r =>
        r.stato_pratica_codice === TICKET_STATUS_MAP.REFUNDED && r.rimborso_modalita_codice !== REFOUND_METHOD_MAP.BORSELLINO)

      for (let i = 0; i < filteredPaymentsList?.length; i++) {
        let refunds = filteredPaymentsList[i].ricevute_rimborso
        refunds?.forEach(refund => {
          let refundObj = deepClone(filteredPaymentsList[i])
          refundObj.id_rimborso = refund.id
          refundObj.data_rimborso = refund.data_rimborso
          refundObj.importo_rimborso = refund.importo_rimborso
          refundObj.rimborso_modalita_descrizione = REFOUND_METHOD_MAP_LABELS[filteredPaymentsList[i].rimborso_modalita_codice]
          refundObj.numero_rimborso= refund.numero_rimborso
          refundList.push(refundObj)
        })
      }
      return refundList
    },
    paidTotal() {
      let total = 0;

      this.filteredRefundList.forEach(
        refund => (total = total + refund.importo_rimborsato)
      );

      return total;
    },

  },
  async created() {
    this.isLoading = true;
    this.yearOptions = getYearsOptions()
    this.year = new Date().getFullYear()
    try {
      let today = new Date();
      let config = {};
      config.params = {
        anno_pagamento: formatDate(today, "YYYY")
      };

      let response = await getPaidTicketList(this.cf, config);
      this.refundDataList = response.data;
      this.filteredRefundList = this.refundList;
    } catch (e) {
      let message = "Non è stato possibile recuperare i rimborsi ricevuti";
      apiErrorNotify({e, message});
    }

    this.isLoading = false;
  },
  methods: {

    getTicketFromRefund(ticket) {
      let expenseItem = this.expenseList.find(expense => expense.numero_pratica === ticket.prenotazione.numero_pratica)
      let refunds = expenseItem?.ricevute_rimborso
      return refunds.find(refund => refund.data_rimborso === ticket.data_rimborso && refund.importo_rimborso === ticket.importo_rimborsato)
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
          this.refundDataList = response.data;
          this.filteredRefundList = this.refundList;
          // this.expenseList = response.data;
          // this.filteredExpenseList = this.receiptListFiltered;
        } catch (e) {
          let message = "Non è stato possibile ottenere la lista dei pagamenti";
          apiErrorNotify({e, message});
        }
      }

      if (this.refundType && this.type) {

        let refundListToFilter = [...this.refundList];
        this.filteredRefundList = refundListToFilter.filter(
          a =>
            a.rimborso_modalita_codice === this.refundType.value &&
            a.motivo_pagamento === this.type.value
        );
      } else if (this.refundType) {

        let refundListToFilter = [...this.refundList];
        this.filteredRefundList = refundListToFilter.filter(
          a => a.rimborso_modalita_codice === this.refundType.value
        );
      } else if (this.type) {

        let refundListToFilter = [...this.refundList];
        this.filteredExpenseList = refundListToFilter.filter(
          a => a.motivo_pagamento === this.type.value
        );
      } else {
        this.filteredRefundList = [...this.refundList];
      }
      this.isLoadingTable = false;
    },
    orderList() {
      let orderValue = this.orderType?.value ?? 'data_rimborso'
      let refundListToOrder = [...this.filteredRefundList];
      let orderedList = orderBy(refundListToOrder, [orderValue])

      this.filteredRefundList = orderedList
    },

  }

};
</script>
<style lang="sass">
tr
  height: 48px !important

.first-row td
  border-bottom: none

.table-col-max-width
  max-width: 300px
  white-space: normal !important

.table-col-max-width--sm
  max-width: 120px
  white-space: normal !important
</style>
