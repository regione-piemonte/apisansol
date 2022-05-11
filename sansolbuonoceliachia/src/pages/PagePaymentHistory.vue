<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <lms-page padding>
    <lms-page-title class="q-mb-md">Storico movimenti</lms-page-title>

    <template v-if="!isLoading">
      <q-banner class="h-banner h-banner--info">
        <div class="text-body1">
          È possibile consultare i pagamenti effettuati a partire dal 1 gennaio 2020
        </div>
      </q-banner>
      <!--      FILTRI-->
      <q-card class="bg-transparent" flat>
        <q-card-section class="q-px-none">
          <template v-if="$q.screen.gt.sm" >
            <div class="row items-center q-col-gutter-lg">
              <div class="self-center text-weight-bold col-auto q-mb-sm">
                <q-icon name="filter_list" size="sm" class="q-mr-sm"/>
                Filtri
              </div>
              <div class="col-md col-12">
                <q-input
                  label="Da"
                  no-error-icon
                  v-model="startDate"
                  mask="##/##/####"
                  placeholder="gg/mm/aaaa"
                  clearable
                  @input="setInputDate"
                  :rules="[ruleValidDate, ruleMinDate]"
                >

                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy ref="startDateProxy" transition-show="scale" transition-hide="scale">
                        <q-date
                          v-model="startDate"
                          :mask="FORMAT"
                          minimal
                          :navigation-min-year-month="minDefaultStartDate"
                          :options="rangeStartDateOptions"
                          @input="setStartDateCalendar" />
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>

              </div>
              <div class="col-md col-12">
                <q-input
                  label="A"
                  no-error-icon
                  v-model="endDate"
                  mask="##/##/####"
                  placeholder="gg/mm/aaaa"
                  clearable
                  :rules="[ruleValidDate]"
                  @input="setInputDate"
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy ref="endDateProxy"  transition-show="scale" transition-hide="scale">
                        <q-date v-model="endDate" :mask="FORMAT" minimal  @input="setEndDateCalendar" />

                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>

              </div>
            </div>
          </template>
          <template v-else>
            <div class="row reverse" >
              <q-btn  flat text-color="black" icon="filter_list" label="Filtri"
                      @click="openFilters"/>
            </div>

            <q-slide-transition>
              <div class="col-md col-12" v-show="isOpenFilters">
                <div class="row items-center q-col-gutter-x-lg q-col-gutter-y-md q-mb-md">
                  <div class="col-md-6 col-12">
                    <q-input
                      label="Da"
                      no-error-icon
                      v-model="startDate"
                      mask="##/##/####"
                      placeholder="gg/mm/aaaa"
                      clearable
                      @input="setInputDate"
                      :rules="[ruleValidDate, ruleMinDate]"
                    >

                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy ref="startDateProxy" transition-show="scale" transition-hide="scale">
                            <q-date
                              v-model="startDate"
                              :mask="FORMAT"
                              minimal
                              :navigation-min-year-month="minDefaultStartDate"
                              :options="rangeStartDateOptions"
                              @input="setStartDateCalendar" />
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>

                  </div>
                  <div class="col-md-6 col-12">
                    <q-input
                      label="A"
                      no-error-icon
                      v-model="endDate"
                      mask="##/##/####"
                      placeholder="gg/mm/aaaa"
                      clearable
                      :rules="[ruleValidDate]"
                      @input="setInputDate"
                    >
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy ref="endDateProxy"  transition-show="scale" transition-hide="scale">
                            <q-date v-model="endDate" :mask="FORMAT" minimal  @input="setEndDateCalendar" />

                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>


                  </div>
                </div>
              </div>
            </q-slide-transition>
          </template>

        </q-card-section>
      </q-card>
      <div v-if="!isLoadingTable">
        <template v-if="movementList.length > 0">
          <q-card class="q-pa-md">
            <q-table :data.sync="movementList" :columns="columns" row-key="name" :grid="$q.screen.lt.sm"
                     :rows-per-page-options="[0]">
              <template v-slot:body-cell-data="props"
              >
                <q-td :props="props">{{ props.value | date }}</q-td>
              </template>
              <template v-slot:body-cell-descrizione="props"
              >
                <q-td :props="props">
                  <div>{{ props.value }}</div>
                  <div class="text-caption">{{props.row.struttura.indirizzo}} - {{props.row.struttura.comune}}</div>
                </q-td>
              </template>
              <template v-slot:body-cell-importo="props"
              >
                <q-td :props="props"><strong>€ {{ props.value}}</strong></q-td>
              </template>

              <template v-slot:item="props">
                <div class="row  fit">
                  <div class="col-12 q-pr-sm  ">
                    {{ props.row.data | date }}
                  </div>
                  <div class="col-8 ">
                    <div>{{ props.row.struttura.nome }}</div>
                    <div class="text-caption">{{props.row.struttura.indirizzo}} - {{props.row.struttura.comune}}</div>
                  </div>
                  <div class="col text-bold q-pl-sm text-right">
                    € {{ props.row.importo | decimals}}
                  </div>
                </div>
                <q-separator spaced="12px"></q-separator>

              </template>
              <template v-slot:bottom>
                <div class=" full-width text-center q-mt-md" v-if="!hideLoadMoreBtn">
                  <a @click="loadMore" class="cursor-pointer lms-link text-body1">
                    Carica altri
                  </a>
                </div>
                <div class=" full-width text-center q-mt-md" v-if="noMoreItems">
                  Non ci sono altri pagamenti da visualizzare.
                </div>
              </template>
            </q-table>
          </q-card>

          <lms-buttons class="q-mt-md">
            <lms-button @click="exportToCSV" outline> Esporta</lms-button>
          </lms-buttons>
        </template>
        <template v-else>
          <q-banner class="q-mb-md h-banner" v-if="!isEmpty(movementListErrorMessage)" :class="movementListErrorMessage.color">
            <div class="text-body1">
              {{movementListErrorMessage.message}}
            </div>
          </q-banner>
          <q-banner class="q-mb-md h-banner--info h-banner" v-else>
            <div class="text-body1" v-if="areFilters">
              Non ci sono movimenti per i filtri impostati
            </div>
            <div class="text-body1" v-else>
              Non sono presenti movimenti
            </div>
          </q-banner>
        </template>

      </div>
      <lms-inner-loading :showing="isLoadingTable" block/>
    </template>
    <lms-inner-loading :showing="isLoading" block/>
  </lms-page>
</template>

<script>
import {apiErrorNotify, errorHasResponse, isEmpty, isStatusIn, orderBy} from "../services/utils";
  import {getMovementList} from "../services/api";
import {date, exportFile, Screen} from "quasar";


  const {startOfDate, endOfDate, formatDate, extractDate, getDateDiff} = date;
  const FORMAT = 'DD/MM/YYYY'

  export default {
    name: "PagePaymentHistory",

    data() {
      return {
        FORMAT,
        Screen,
        isLoading: false,
        isLoadingTable: false,
        year: new Date().getFullYear(),
        startDate: '',
        endDate: '',
        loadMoreDate: null,
        yearOption: [],
        month: null,
        monthOption: [
          {label: "Gennaio", value: 0},
          {label: "Febbraio", value: 1},
          {label: "Marzo", value: 2},
          {label: "Aprile", value: 3},
          {label: "Maggio", value: 4},
          {label: "Giugno", value: 5},
          {label: "Luglio", value: 6},
          {label: "Agosto", value: 7},
          {label: "Settembre", value: 8},
          {label: "Ottobre", value: 9},
          {label: "Novembre", value: 10},
          {label: "Dicembre", value: 11}
        ],
        movementList: [],
        columns: [
          {
            name: "data",
            required: true,
            label: "Data",
            align: "left",
            field: row => row.data,
            sortable: true
          },
          {
            name: "descrizione",
            required: true,
            label: "Descrizione",
            align: "left",
            field: row => row.struttura.nome,
            format: val => `${val}`,
            sortable: true
          },
          {
            name: "importo",
            required: true,
            label: "Importo",
            align: "left",
            field: row => row.importo,
            format: val => `${val.toFixed(2)}`,
            sortable: true
          }
        ],
        isOpenFilters: false,
        noMoreItems:false,
        movementListErrorMessage:{},
        minStartDate: new Date(2020,0,1), // Data minima a 1/1/2020
        minDefaultStartDate:''
      };
    },

    computed: {
      cf() {
        return this.$store.getters["getTaxCode"];
      },
      areFilters(){
        return this.startDate && this.endDate
      },
      hideLoadMoreBtn(){
        return this.areFilters || this.noMoreItems
      },
      ruleValidDate(){
        return v => this.isValidDate(v) || "Inserire una data valida"
      },
      ruleMinDate(){
        return v =>
          this.isValidMinDate(v) ||
          `La data minima di inizio è ${formatDate(this.minStartDate, FORMAT)}`
      },
      areValidFilters(){
        let isValidStartDate =  this.startDate && this.isValidDate(this.startDate) && this.isValidMinDate(this.startDate)
        let isValidEndDate = this.endDate && this.isValidDate(this.endDate)
        let datesDifference=   getDateDiff(extractDate(this.startDate, FORMAT),extractDate(this.endDate, FORMAT) )<=0

        return isValidStartDate && isValidEndDate && datesDifference
      },
      isValidStartDate(){
        return this.startDate && this.isValidDate(this.startDate) && this.isValidMinDate(this.startDate)
      },
      isValidEndDate(){
        return this.endDate && this.isValidDate(this.endDate)
      }
    },
    created() {
      this.isLoading = true;
    this.minDefaultStartDate = formatDate(this.minStartDate, 'YYYY/MM')
      // for (let i = 1970; i < this.year + 1; i++) {
      //   this.yearOption.push(i);
      // }
      this.getDefaultList()

    },
    methods: {
      isEmpty,
      async getDefaultList(){
        this.movementListErrorMessage= {}
        try {
          let config = {};
          let endDate = new Date();
          let startDate = date.subtractFromDate(endDate, {month: 12});

          config.params = {
            da: formatDate(startDate, "YYYY-MM-DD"),
            a: formatDate(endDate, "YYYY-MM-DD")
          };
          let response = await getMovementList(this.cf, config);
          let list = response.data
          this.movementList = orderBy(list, ['data'], ['desc']);
          this.loadMoreDate = startDate;
        } catch (e) {

          this.movementListErrorMessage= {
            color: 'h-banner--negative',
            message: "Non è stato possibile recuperare i movimenti"
          }
          if(errorHasResponse(e)){
            if(isStatusIn(e.response, 404, 404) ) {
              let apiMsg = e?.response?.data?.title
              if(apiMsg)
                this.movementListErrorMessage={
                  color : 'h-banner--info',
                  message: apiMsg
                }
            }
          }
        }
       this.isLoading = false;
      this.isLoadingTable =false;
      },
      async loadMore() {
        this.movementListErrorMessage = {}
        this.isLoadingTable = true
        try {
          let startDate = date.subtractFromDate(this.loadMoreDate, {month: 12});
          let endDate = date.subtractFromDate(this.loadMoreDate, {days: 1});
          let config = {};
          config.params = {
            da: formatDate(startDate, "YYYY-MM-DD"),
            a: formatDate(endDate, "YYYY-MM-DD")
          };

          let response = await getMovementList(this.cf, config);
          let list = response.data
          if(!list || list?.length<=0) this.noMoreItems = true
          let orderedList = list ? orderBy(list, ['data'], ['desc']) : [];
          this.movementList = this.movementList.concat(orderedList)

          this.loadMoreDate = date.subtractFromDate(startDate, {days: 1});
        } catch (e) {
          this.movementListErrorMessage= {
            color: 'h-banner--negative',
            message: "Non è stato possibile recuperare i movimenti"
          }
          if(errorHasResponse(e)){
            if(isStatusIn(e.response, 404, 404) ) {
              let apiMsg = e?.response?.data?.title
              if(apiMsg)
                this.movementListErrorMessage={
                  color : 'h-banner--info',
                  message: apiMsg
                }
            }
          }
        }
        this.isLoadingTable = false;
      },
      async clearFilters(){
        if (this.startDate || this.endDate) return
        this.isLoadingTable = true;
        this.movementList = [];
        this.getDefaultList()
      },
      async filter() {
        this.movementListErrorMessage = {}
        this.noMoreItems=false
        this.isLoadingTable = true;
        this.movementList = [];
        let startDate = extractDate(this.startDate, FORMAT)
        let endDate = extractDate(this.endDate, FORMAT)
        try {
          let config = {};
          config.params = {
            da: formatDate( startDate, "YYYY-MM-DD"),
            a: formatDate( endDate, "YYYY-MM-DD")
          };

          let response = await getMovementList(this.cf, config);
          this.movementList = response.data;
          this.loadMoreDate = date.subtractFromDate(endDate, {days: 1});
        } catch (e) {


          this.movementListErrorMessage= {
            color: 'h-banner--negative',
            message: "Non è stato possibile recuperare i movimenti"
          }
          if(errorHasResponse(e)){
            if(isStatusIn(e.response, 404, 404) ) {
              let apiMsg = e?.response?.data?.title
              if(apiMsg)
                this.movementListErrorMessage={
                  color : 'h-banner--info',
                  message: apiMsg
                }
            }
          }
        }
        this.isLoadingTable = false;

      },

      openFilters() {
        this.isOpenFilters = !this.isOpenFilters
      },
      filtersValidation(){
        let getDatesDiff = getDateDiff(extractDate(this.startDate, FORMAT),extractDate(this.endDate, FORMAT) )<=0
        return this.isValidStartDate && this.isValidEndDate && getDatesDiff
      },
      setInputDate(value){
        if(this.areValidFilters) {
          this.filter()
        }
      },

      setStartDateCalendar(value, reason, details){
        if(reason === 'day' && this.areValidFilters) {
          this.$refs.startDateProxy.hide()
          this.filter()
        }

      },
      setEndDateCalendar(value, reason, details){
        if(reason === 'day' && this.areValidFilters) {
          this.$refs.endDateProxy.hide()
          this.filter()
        }

      },
      rangeStartDateOptions(calendarDate, format = 'YYYY/MM/DD') {
        let selectedDate = extractDate(calendarDate, format)
        return getDateDiff(selectedDate, this.minStartDate, 'days') >= 0
      },
      isValidDate(date){
        return !date || /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/.test(date)
      },
      isValidMinDate(date){
        return getDateDiff(extractDate(date, FORMAT), this.minStartDate, 'days') >= 0
      },
      wrapCsvValue (val, formatFn) {
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
        exportToCSV(){
        // naive encoding to csv format

        let exportColumns =   [
            {
              name: "data",
              label: "Data",
              align: "left",
              field: row => row.data,
              format: val => date.formatDate(val, 'DD/MM/YYYY'),
            },
            {
              name: "descrizione",
              required: true,
              label: "Struttura",
              align: "left",
              field: row => row.struttura.nome,
              format: val => `${val}`
            },
          {
            name: "indirizzo",
            required: true,
            label: "Indirizzo struttura",
            align: "left",
            field: row => row.struttura.indirizzo + ' - ' + row.struttura.comune,
            format: val => `${val}`
          },
            {
              name: "importo",
              required: true,
              label: "Importo",
              align: "left",
              field: row => row.importo,
              format: val => `${val}`,

            }
          ]


          const content = [ exportColumns.map(col => this.wrapCsvValue(col.label)).join(';') ].concat(
          this.movementList.map(row => exportColumns.map(col => this.wrapCsvValue(
            typeof col.field === 'function'
              ? col.field(row)
              : row[col.field === void 0 ? col.name : col.field],
            col.format
          )).join(';'))
        ).join('\r\n')

        const status = exportFile(
          'storico-movimenti.csv',
          content,
          'text/csv'
        )

        if (status !== true) {

          this.$q.notify({
            message: 'Impossibile scaricare il file.',
            color: 'negative'
          })
        }
      }


    }
  };
</script>
