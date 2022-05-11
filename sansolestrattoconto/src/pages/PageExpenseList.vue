<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <lms-page >
    <!--        FILTRI-->
    <q-card class="bg-transparent q-mt-lg" flat>
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
                <div class="text-h4">Totale spese:</div>
                <div class="q-ml-sm paid-text"><strong>€ {{ paidTotal | decimals }}</strong></div>
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
                <div class="col-12 col-md-3">
                  <q-select
                    dense
                    v-model="type"
                    label="Tipologia"
                    :options="typeOptions"
                    @input="setFilters"
                    @clear="setFilters"
                    clearable
                    :behavior="$q.platform.is.ios === true ? 'dialog' : 'menu'"
                  >
                  </q-select>
                </div>
                <div class="col-12 col-md-3">
                  <q-select
                    dense
                    label="Azienda sanitaria"
                    v-model="asl"
                    use-input
                    fill-input
                    hide-selected
                    input-debounce="0"
                    :options="aslOptions"
                    @filter="filterByAsl"
                    @input="setFilters"
                    @clear="setFilters"
                    clearable
                    :behavior="$q.platform.is.ios === true ? 'dialog' : 'menu'"
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
    <template v-if="!isLoading">
      <div class=" row justify-end items-center q-mt-md" v-if="$q.screen.gt.sm">
        <div class="q-mr-md text-h4">Totale spese:</div>
        <div class="paid-text"><strong>€ {{ paidTotal | decimals }}</strong></div>
      </div>


      <!--        TABELLA-->
      <template v-if="!isLoadingTable">
        <template v-if="$q.screen.gt.md">
          <q-card class="q-pa-md q-mt-md" v-if="filteredExpenseList.length > 0">
            <q-table
              :data="filteredExpenseList"
              :columns="columns"
              row-key="identificativo"
              hide-pagination
              hide-bottom
              wrap-cells
              flat
              dense
              :grid="$q.screen.lt.lg"
              :rows-per-page-options="[0]"
            >

              <template v-slot:body="props">
                <q-tr :props="props" :class="{'first-row' : props.row.rimborsi_utilizzati_importo>0}">
                  <q-td key="data" :props="props">
                    {{ props.row.data_pagamento | date }}
                  </q-td>

                  <q-td key="identificativo" :props="props">
                    {{ props.row.numero_pratica }}
                  </q-td>

                  <q-td key="tipologia" :props="props" auto-width>
                    {{ props.row.motivo_pagamento | empty }}
                  </q-td>


                  <q-td key="asl" :props="props">
                    {{ props.row.asr_descrizione }}
                  </q-td>

                  <q-td key="importo" :props="props">
                    <strong>€ {{ props.row.importo_pagamento | decimals }}</strong>
                  </q-td>
                  <q-td key="button" :props="props">
                    <lms-buttons>
                      <lms-button no-min-width outline @click="onPrint(props.row)">
                        Ricevuta
                      </lms-button
                      >
                    </lms-buttons>

                  </q-td>
                </q-tr>
                <q-tr :props="props"
                      :key="`e_${props.row.numero_identificativo}`"
                      v-show="props.row.rimborsi_utilizzati_importo>0">
                  <q-td colspan="12">
                    <div class="text-active q-pb-sm text-right">
                      € {{ props.row.rimborsi_utilizzati_importo | decimals }} pagati con borsellino
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
                          <q-item-label>Data</q-item-label>
                          <q-item-label><strong>{{ props.row.data_pagamento | date }}</strong></q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-item class="q-px-none">
                        <q-item-section>
                          <q-item-label>Nr. identificativo spesa</q-item-label>
                          <q-item-label><strong>{{ props.row.id_pagamento }}</strong></q-item-label>
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
                          <q-item-label class="text-caption" v-if="props.row.ricevute_multiple">
                            <i>Importo in ricevuta</i>
                          </q-item-label>
                          <q-item-label class="text-h4" v-else>
                            <strong>€ {{ props.row.importo_pagamento | decimals }}</strong>
                          </q-item-label>

                        </q-item-section>
                      </q-item>
                    </q-card-section>

                  </q-card-section>
                  <q-card-actions align="right">
                    <div v-if="props">
                      <lms-button no-min-width outline @click="onPrint(props.row)">
                        Ricevuta
                      </lms-button
                      >
                    </div>
                  </q-card-actions>
                  <q-separator spaced="12px"></q-separator>
                </q-card>

              </template>

            </q-table>
          </q-card>
          <q-banner v-else class="q-my-md h-banner h-banner--info">
            Non ci sono pagamenti per i filtri impostati
          </q-banner>

        </template>
        <div v-else>
          <template v-if="filteredExpenseList.length > 0">
            <q-card class="fit q-pa-md q-my-lg" v-for="expense in filteredExpenseList" :key="expense.id_pagamento">
              <q-card-section class="no-padding justify-between" horizontal>
                <q-card-section class="no-padding">
                  <q-item class="q-px-none">
                    <q-item-section>
                      <q-item-label>Data</q-item-label>
                      <q-item-label><strong>{{ expense.data_pagamento | date }}</strong></q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item class="q-px-none">
                    <q-item-section>
                      <q-item-label>Nr. identificativo spesa</q-item-label>
                      <q-item-label><strong>{{ expense.numero_pratica }}</strong></q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item class="q-px-none">
                    <q-item-section>
                      <q-item-label> Tipologia</q-item-label>
                      <q-item-label><strong>{{ expense.motivo_pagamento }}</strong></q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item class="q-px-none">
                    <q-item-section>
                      <q-item-label>Azienda sanitaria</q-item-label>
                      <q-item-label><strong>{{ expense.asr_descrizione }}</strong></q-item-label>
                    </q-item-section>
                  </q-item>
                </q-card-section>
                <q-card-section class="no-padding text-right">
                  <q-item class="q-px-none">
                    <q-item-section>
                      <q-item-label>Importo</q-item-label>
                      <q-item-label class="text-h4">
                        <strong>€ {{ expense.importo_pagamento | decimals }}</strong>
                      </q-item-label>

                    </q-item-section>
                  </q-item>
                </q-card-section>

              </q-card-section>
              <q-card-section class="no-padding ">
                <div class="row items-center justify-between q-col-gutter-x-md">
                  <div class="text-active col" v-if="expense.rimborsi_utilizzati_importo>0">
                    € {{ expense.rimborsi_utilizzati_importo | decimals }} pagati con borsellino
                  </div>
                  <q-space/>
                  <div class="col-auto">
                    <lms-button no-min-width outline @click="onPrint(expense)">
                      Ricevuta
                    </lms-button
                    >
                  </div>

                </div>
              </q-card-section>

            </q-card>
          </template>
          <template v-else>
            <q-banner class="q-my-md h-banner h-banner--info">
              Non ci sono pagamenti per i filtri impostati
            </q-banner>
          </template>
        </div>
      </template>
      <div v-else>
        <lms-inner-loading :showing="isLoadingTable" block/>
      </div>

      <div class="row justify-between items-center q-col-gutter-lg q-mb-lg q-mt-xs">

        <div class="col-12 col-md-4" :class="{'text-center' : $q.screen.lt.sm}">
          <a
            href="url"
            class="lms-link"
            target="_blank"
          >
            Non trovi tutte le tue spese?
          </a>
        </div>
        <div class="col-12 col-md-8">

          <lms-buttons>
            <lms-button href="/la-mia-salute/#/pagamenti-sanitari" label="Effettua pagamento" type="a"></lms-button>
            <lms-button outline @click="exportToCSV">
              Esporta
            </lms-button
            >
          </lms-buttons>


        </div>

      </div>
    </template>
    <lms-inner-loading :showing="isLoading" block/>

  </lms-page>
</template>

<script>
import {apiErrorNotify, deepClone, orderBy, uniqueElements, uniqueElementsBy} from "../services/utils";
import {downloadReceipt, getPaidTicketList} from "../services/api";
import {date, exportFile, Screen} from "quasar";
import {TICKET_STATUS_MAP, TICKET_TYPES_MAP_LABELS} from "../services/config";
import {getYearsOptions} from "src/services/business-logic";

const {startOfDate, endOfDate, formatDate} = date;

export default {
  name: "PageExpenseList",

  data() {
    return {
      Screen,
      expenseList: [],
      filteredExpenseList: [],
      isLoading: false,
      isLoadingTable: false,
      year: null,
      lastYearFiltered: new Date().getFullYear(),
      filterPressed: false,
      type: null,
      asl: null,
      aslToFilter: null,
      typeToFilter: null,
      yearOptions: [],
      aslOptions: [],
      typeOption: [],
      aslOption: [],
      columns: [
        {
          name: "data",
          required: true,
          label: "Data",
          align: "left",
          field: row => row.data_pagamento,
          sortable: true
        },
        {
          name: "identificativo",
          required: true,
          label: "Nr. identificativo spesa",
          align: "left",
          field: row => row.numero_pratica,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "tipologia",
          required: true,
          label: "Tipologia",
          align: "left",
          field: row => row.motivo_pagamento,
          format: val => `${val}`,
          style: 'min-width: 150px',
          class: 'wrap',
          sortable: true
        },
        {
          name: "asl",
          required: true,
          label: "Azienda sanitaria",
          align: "left",
          field: row => row.asr_descrizione,
          style: 'max-width: 150px',
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "importo",
          required: false,
          label: "Importo",
          align: "left",
          field: row => row.importo_pagamento,
          sortable: true
        },
        {
          name: "button",
          required: true,
          label: "",
          align: "right"
        }
      ],
      yearsList: [],
      isOpenFilters: false,
      ticketList: [],
      orderType: '',
      orderOptions: [
        {
          label: 'Data',
          value: 'data_pagamento'
        },
        {
          label: 'Nr. identificativo spesa',
          value: 'id_pagamento'
        },
        {
          label: 'Tipologia',
          value: 'motivo_pagamento'
        },
        {
          label: 'Azienda Sanitaria',
          value: 'asr_descrizione'
        },
        {
          label: 'Importo',
          value: 'importo_pagamento'
        }
      ]

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

    aslList() {
      let options = [];
      let aslList = [];

      for (let i = 0; i < this.receiptListFiltered.length; i++) {
        let expense = this.receiptListFiltered[i]
        aslList.push({
          value: expense.asr_id,
          label: expense.asr_descrizione
        });
      }

      let uniqueElements = uniqueElementsBy(aslList, (a, b) => a.value === b.value);
      options = orderBy(uniqueElements, ['label'])

      return options;
    },
    typeOptions() {
      let options = [];
      let typeList = [];
      for (let i = 0; i < this.receiptListFiltered.length; i++) {
        let expense = this.receiptListFiltered[i]
        if (expense.ricevute_pagamento.length > 0) {
          typeList.push({
            value: expense.motivo_pagamento,
            label: expense.motivo_pagamento
          });
        }
      }
      let uniqueElements = uniqueElementsBy(typeList, (a, b) => a.value === b.value);

      options = orderBy(uniqueElements, ['label'])
      return options;
    },
    recieptList() {
      let receiptList = [];
      for (let i = 0; i < this.expenseList.length; i++) {
        let payment = this.expenseList[i].ricevute_pagamento[0]
        let usedRefundsList = this.expenseList[i].rimborsi_utilizzati
        let usedRefundsAmount = 0
        if (usedRefundsList) {
          for (let i = 0; i < usedRefundsList.length; i++) {
            usedRefundsAmount += usedRefundsList[i].importo
          }
        }

        let objToPush = {...this.expenseList[i]};
        objToPush.id_pagamento = payment?.id
        objToPush.data_pagamento = payment?.data_pagamento
        objToPush.pagamento_rt_id = payment?.rt_id
        objToPush.pagamento_esito_id = payment?.esito_id
        // objToPush.motivo_pagamento_descrizione = TICKET_TYPES_MAP_LABELS[this.expenseList[i].motivo_pagamento]
        objToPush.rimborsi_utilizzati_importo = usedRefundsAmount
        receiptList.push(objToPush);

      }
      receiptList = orderBy(receiptList, ['data_pagamento'], ['desc'])
      return receiptList;
    },
    receiptListFiltered() {
      let receiptListFiltered = [];

      receiptListFiltered = this.recieptList.filter(
        r =>
          [TICKET_STATUS_MAP.TOTALLY_PAID, TICKET_STATUS_MAP.PARTIALLY_PAID].includes(
            r.stato_pratica_codice
          )
      );
      return receiptListFiltered;
    },
    paidTotal() {
      let total = 0;
      this.filteredExpenseList.forEach(
        expense => (total = total + expense.importo_pagamento)
      );

      return total;
    },

  },
  async created() {
    this.isLoading = true;
    this.year = new Date().getFullYear()
    this.yearOptions = getYearsOptions()

    try {
      let today = new Date();
      let config = {};
      config.params = {
        anno_pagamento: formatDate(today, "YYYY")
      };

      let response = await getPaidTicketList(this.cf, config);
      this.expenseList = response.data;
      this.filteredExpenseList = this.receiptListFiltered;
    } catch (e) {
      let message = "Non è stato possibile recuperare i ticket pagati";
      apiErrorNotify({e, message});
    }
    this.isLoading = false;
  },
  methods: {
    async onPrint(item) {
      let params = {
        id_asr: item.asr_id
      }
      try {
        let response = await downloadReceipt(
          this.cf,
          item.numero_pratica,
          item.id_pagamento, {params}
        );
      } catch (e) {

        let message = "Non è stato possibile scaricare la ricevuta";
        apiErrorNotify({e, message});
      }
    },
    filterByAsl(val, update, abort) {
      this.aslOptions = this.aslList
      if (val === '') {
        update(() => {
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.aslOptions = this.aslList.filter(v =>
          v.label.toLowerCase().indexOf(needle) > -1
        )
      })

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
          this.expenseList = response.data;
          this.filteredExpenseList = this.receiptListFiltered;
        } catch (e) {
          let message = "Non è stato possibile ottenere la lista dei pagamenti";
          apiErrorNotify({e, message});
        }
      }

      if (this.asl && this.type) {

        let expenseListToFilter = [...this.receiptListFiltered];
        this.filteredExpenseList = expenseListToFilter.filter(
          a =>
            a.asr_id === this.asl.value &&
            a.motivo_pagamento === this.type.value
        );
      } else if (this.asl) {

        let expenseListToFilter = [...this.receiptListFiltered];
        this.filteredExpenseList = expenseListToFilter.filter(
          a => a.asr_id === this.asl.value
        );
      } else if (this.type) {

        let expenseListToFilter = [...this.receiptListFiltered];
        this.filteredExpenseList = expenseListToFilter.filter(
          a => a.motivo_pagamento === this.type.value
        );
      } else {
        this.filteredExpenseList = [...this.receiptListFiltered];
      }
      this.isLoadingTable = false;
    },
    openFilters() {
      this.isOpenFilters = !this.isOpenFilters
    },
    wrapCsvValue(val, formatFn) {
      let formatted = formatFn !== void 0
        ? formatFn(val)
        : val

      formatted = formatted === void 0 || formatted === null
        ? ''
        : String(formatted)

      formatted = formatted.split('"').join('""')
        /**
         * Excel accepts \n and \r in strings, but some other CSV parsers do not
         * Uncomment the next two lines to escape new lines
         */
        .split('\n').join('\\n')
        .split('\r').join('\\r')

      return `"${formatted}"`
    },
    exportToCSV() {
      // naive encoding to csv format
      let exportColumns = [
        {
          name: "data",
          required: true,
          label: "Data",
          align: "left",
          field: row => row.data_pagamento,
          format: val => formatDate(val, 'DD/MM/YYYY'),
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
          name: "tipologia",
          required: true,
          label: "Tipologia",
          align: "left",
          field: row => row.motivo_pagamento,
          format: val => `${val}`
        },
        {
          name: "asl",
          required: true,
          label: "Azienda sanitaria",
          align: "left",
          field: row => row.asr_descrizione,
          format: val => `${val}`
        },
        {
          name: "importo",
          required: false,
          label: "Importo",
          align: "left",
          field: row => row.importo_pagamento,
          format: val => val.toFixed(2)
        }
      ]

      const content = [exportColumns.map(col => this.wrapCsvValue(col.label)).join(';')].concat(
        this.filteredExpenseList.map(row => exportColumns.map(col => this.wrapCsvValue(
          typeof col.field === 'function'
            ? col.field(row)
            : row[col.field === void 0 ? col.name : col.field],
          col.format
        )).join(';'))
      ).join('\r\n')

      const status = exportFile(
        'lista-pagamenti.csv',
        content,
        'text/csv'
      )

      if (status !== true) {

        this.$q.notify({
          message: 'Impossibile scaricare il file.',
          color: 'negative'
        })
      }
    },
    orderList() {
      let orderValue = this.orderType?.value ?? 'data_pagamento'
      let expenseListToOrder = [...this.receiptListFiltered];
      let orderedList = orderBy(expenseListToOrder, [orderValue])
      this.filteredExpenseList = orderedList
    }
  }
};
</script>
<style lang="sass">
.paid-text
  font-size: 1.75rem

.q-table tbody td
  font-size: 0.875rem !important

.q-table tbody td:before
  background: none !important

.first-row td
  border-bottom: none
</style>
