<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <lms-page padding>

    <template v-if="isLoading">
      <lms-inner-loading :showing="isLoadingData"/>
    </template>
    <template v-else>
      <!--   FILTRI  ------------->
      <!-- -------------------------->
      <q-card class="bg-transparent " flat>
        <q-card-section class="no-padding">
          <div class="row items-center q-col-gutter-lg " >
            <div>
              <q-btn flat text-color="black" icon="filter_list" label="Filtri"
                     @click="openFilters"/>
            </div>

            <q-space/>
            <template v-if="!isLoadingData && $q.screen.gt.sm">
              <lms-buttons>
                <lms-button outline @click="onPrint">
                  Stampa PDF
                </lms-button>
                <lms-button outline @click="onExport">
                  Esporta
                </lms-button>

                <!--              <json-c-s-v name="accessi.csv" :data="tableDataCsv" separator-excel>-->
                <!--                <csi-button secondary @click="onExported">-->
                <!--                  Esporta-->
                <!--                </csi-button>-->
                <!--              </json-c-s-v>-->
              </lms-buttons>
            </template>
          </div>
            <q-slide-transition>
              <div v-show="isOpenFilters" class="q-py-md">
                <div class="row items-center q-col-gutter-x-lg q-col-gutter-y-md q-mb-md">
                  <div class="col-12 ">
                    <q-select
                      v-model="filterServiceCode"
                      :options="serviceListOptions"
                      emit-value
                      map-options
                      label="Servizio"
                      clearable
                      dense

                    />
                  </div>

                  <div class="col-12 ">
                    <q-select
                      v-model="filterOperationTypeCode"
                      :options="operationTypeListOptions"
                      label="Operazione"
                      emit-value
                      map-options
                      clearable
                      dense

                    />
                  </div>

                  <div class="col-12 ">
                    <q-select
                      v-model="filterPeriodCode"
                      :options="periodListOptions"
                      emit-value
                      map-options
                      label="Periodo"
                      dense
                      @input="filterByPeriod"

                    />
                  </div>

                  <div class="col-12">
                    <q-select
                      v-model="filterRoleCode"
                      :options="roleListOptions"
                      emit-value
                      map-options
                      label="Ruolo"
                      clearable
                      dense

                    />
                  </div>

                  <div class="col-12 ">
                    <q-select
                      v-model="filterNameCode"
                      :options="nameListOptions"
                      label="Cognome e nome"
                      clearable
                      dense

                    />
                  </div>
                </div>
              </div>
            </q-slide-transition>

          <div class="q-pt-lg" v-if="!isLoadingData && $q.screen.lt.md">
            <lms-buttons>
              <lms-button outline @click="onPrint">
                Stampa PDF
              </lms-button>
              <lms-button outline @click="onExport">
                Esporta
              </lms-button>

              <!--              <json-c-s-v name="accessi.csv" :data="tableDataCsv" separator-excel>-->
              <!--                <csi-button secondary @click="onExported">-->
              <!--                  Esporta-->
              <!--                </csi-button>-->
              <!--              </json-c-s-v>-->
            </lms-buttons>
          </div>
        </q-card-section>
      </q-card>

      <template v-if="!isLoadingData">
        <div class="q-mt-lg" v-if="accessList.length <= 0">
          <q-banner class=q-banner--info >
            <div class="text-body1">
              Nessun accesso trovato.
            </div>
          </q-banner>
        </div>


        <template v-else>



          <!-- TABELLA -->
          <!-- ----------------------------------------------------------------------------------------------------------- -->
          <q-table
            :columns="tableCols"
            :data="tableData"
            :pagination.sync="tablePagination"
            :loading="isLoadingAccessList"
            :grid="$q.screen.lt.lg"
            :hide-header="$q.screen.lt.lg"
            class="q-mt-lg lms-table-access-list"
            :class="{'bg-white': !$q.screen.lt.lg}"
            card-container-class="q-col-gutter-md"
          >
            <template slot="item" slot-scope="props">
              <div class="col-12 col-sm-6  self-stretch">
                <q-card class="full-height">
                  <q-card-section>
                    <div v-for="col in props.cols" :key="col.name" class="q-my-sm">
                      <div class="text-caption text-bold">{{ col.label }}</div>
                      <div>{{ col.value }}</div>
                    </div>
                  </q-card-section>
                </q-card>
              </div>
            </template>
          </q-table>
        </template>
      </template>
      <template v-else>
        <lms-access-list-skeleton :columns="tableCols"/>
      </template>
    </template>
  </lms-page>
</template>

<script>
import {getFullName} from "src/services/business-logic";
import {date, exportFile, Screen} from "quasar";
import {apiErrorNotify, equalsIgnoreCase, groupBy, keyBy, orderBy, uniqueElementsBy} from "src/services/utils";
import {createAudit, getAccessList, getAccessOperationTypeList, getFseAccessServiceDecodeList} from "src/services/api";
import LmsAccessListSkeleton from "components/LmsAccessListSkeleton";
import {httpAuth} from "boot/http";

const {formatDate, subtractFromDate, addToDat, startOfDate, endOfDate} = date;

export default {
  name: "PageProfileAccessList",
  components: {LmsAccessListSkeleton},
  data() {
    return {
      Screen,
      isLoadingAccessList: false,
      isLoadingOperationTypeList: false,
      accessList: [],
      operationTypeList: [],
      periodList: [],
      filterServiceCode: null,
      filterOperationTypeCode: null,
      filterPeriodCode: null,
      filterRoleCode: null,
      filterNameCode: null,
      tablePagination: {
        sortBy: "date",
        descending: true,
        page: 1,
        rowsPerPage: 25
      },
      isOpenFilters: false,
      isLoading: false,
      isLoadingAccessServiceDecodeList:false,
      accessServiceDecodeList:[]
    }
  },
  watch: {
    Screen: {
      deep: true,
      immediate: true,
      handler(newval, oldval) {
        if (newval.gt.lg)
          this.isOpenFilters = true
      }
    }
  },
  computed: {
    user() {
      return this.$store.getters["getUser"];
    },
    tableCols() {
      let result = [];

      result.push({
        name: "name",
        label: "Cognome e nome",
        field: row => getFullName(row.cognome_operatore, row.nome_operatore),
        format: (val, row) => val || '-',
        align: "left",
        sortable: true,
        classes: "table-col-max-width--sm"
      });

      result.push({
        name: "date",
        label: "Data e ora",
        field: row => row.data_accesso,
        format: (val, row) => val ? formatDate(val, 'DD MMM YYYY HH:mm') : '-',
        align: "left",
        sortable: true,
        classes: "table-col-max-width--sm"
      });

      result.push({
        name: "type",
        label: "Descrizione",
        field: row => row.descrizione,
        format: (val, row) => val || '-',
        align: "left",
        sortable: true,
        classes: "table-col-max-width"
      });

      result.push({
        name: "service",
        label: "Servizio",
        // label: "Tipo Operazione",
        field: row => {
          return this.getServiceLabel(row);
        },
        format: (val, row) => val || '-',
        align: "left",
        sortable: true,
        classes: "table-col-max-width--sm"
      });

      result.push({
        name: "operation-type",
        label: "Operazione",
        // label: "Tipo operazione",
        // label: "Descrizione dell'operazione",
        // field: row => "Documenti clinico sanitari",
        field: row => {
          let code = row.tipo_accesso && row.tipo_accesso.codice;
          let operationType = this.operationTypeIndexedByServiceCode[code];
          return operationType && operationType.descrizione_servizio || code;
        },
        format: (val, row) => val || '-',
        align: "left",
        sortable: true,
        classes: "table-col-max-width--sm"
      });

      return result;
    },
    tableData() {
      let result = this.accessList;

      // Filtriamo per servizio
      if (this.filterServiceCode) {
        result = result.filter(el => {
          let code = el.applicazione_verticale;
          return code === this.filterServiceCode;
        });
      }

      // Filtriamo per tipo operazione
      if (this.filterOperationTypeCode) {
        result = result.filter(el => {
          let typeList = this.operationTypeGroupedByDescription[this.filterOperationTypeCode] || [];
          let codes = typeList.map(el => el.codice_servizio);
          let code = el.tipo_accesso && el.tipo_accesso.codice;
          return codes.includes(code);

          // let code = el.tipo_accesso && el.tipo_accesso.codice;
          //return code === this.filterOperationTypeCode;
        });
      }

      // Filtriamo per ruolo
      if (this.filterRoleCode) {
        result = result.filter(el => {
          let code = el.ruolo && el.ruolo.codice;
          return code === this.filterRoleCode;
        });
      }

      // Filtriamo per cognome e nome
      if (this.filterNameCode) {
        result = result.filter(el => {
          let fullName = getFullName(el.cognome_operatore, el.nome_operatore);
          return fullName === this.filterNameCode;
        });
      }

      return result;
    },
    filterPeriod() {
      return this.periodList.find(p => p.codice === this.filterPeriodCode);
    },
    filterService() {
      return this.serviceListOptions.find(el => el.value === this.filterServiceCode);
    },
    filterOperationType() {
      return this.operationTypeListOptions.find(el => el.value === this.filterOperationTypeCode);
    },
    filterRole() {
      return this.roleListOptions.find(el => el.value === this.filterRoleCode);
    },
    roleList() {
      let result = this.accessList.map(a => a.ruolo);
      result = uniqueElementsBy(result, (a, b) => a.codice === b.codice);
      result = orderBy(result, ["descrizione"], ["asc"]);
      return result;
    },
    nameList() {
      let result = this.accessList.map(el => {
        let fullName = getFullName(el.cognome_operatore, el.nome_operatore);
        return {codice: fullName, descrizione: fullName};
      });

      result = uniqueElementsBy(result, (a, b) => a.codice === b.codice);
      result = orderBy(result, ["descrizione"], ["asc"]);
      return result;
    },

    serviceListOptions() {
      let result = this.accessList.map(el => ({label: this.getServiceLabel(el), value: el.applicazione_verticale}))
      result = uniqueElementsBy(result, (a, b) => a.label === b.label);
      result = result.filter(el => !!el.label);
      result = orderBy(result, ['label'], ['asc']);
      return result;
    },
    operationTypeListOptions() {
      // Lavoriamo sulla descrizione perché ci sono più codici che corrispondono alla stessa descrizione
      // ed in realtà dobbiamo considerare i diversi codici come un codice solo
      let keys = Object.keys(this.operationTypeGroupedByDescription);
      keys = uniqueElementsBy(keys, (a, b) => a === b);
      keys.sort();

      // Mostriamo solamente le operazioni visibili in tabella
      keys = keys.filter(k => {
        let typeList = this.operationTypeGroupedByDescription[k] || [];
        let codes = typeList.map(el => el.codice_servizio);
        return this.accessList.some(a => {
          let code = a.tipo_accesso && a.tipo_accesso.codice;
          return codes.includes(code);
        })
      });


      return keys.map(el => ({label: el, value: el}));

    },
    periodListOptions() {
      return this.periodList.map(el => ({label: el.descrizione, value: el.codice}))
    },
    roleListOptions() {
      return this.roleList.map(el => ({label: el.descrizione, value: el.codice}))
    },
    nameListOptions() {
      return this.nameList.map(el => ({label: el.descrizione, value: el.codice}))
    },
    operationTypeGroupedByDescription() {
      return groupBy(this.operationTypeList, el => el.descrizione_servizio);
    },
    operationTypeIndexedByServiceCode() {
      return keyBy(this.operationTypeList, el => el.codice_servizio)
    },
    isLoadingData() {
      return this.isLoadingAccessList || this.isLoadingOperationTypeList
    },
    tableDataCsv() {
      let result = this.tableData ?? [];

      result = result.map(el => {

        let fullName = getFullName(el.cognome_operatore, el.nome_operatore);
        let date = el.data_accesso;
        let description = el.descrizione;

        let serviceCode = el.tipo_accesso && el.tipo_accesso.codice;
        let operationType = this.operationTypeIndexedByServiceCode[serviceCode];
        serviceCode = operationType?.codice_verticale ?? serviceCode;

        let operationCode = el.tipo_accesso && el.tipo_accesso.codice;
        operationType = this.operationTypeIndexedByServiceCode[operationCode];
        operationCode = operationType?.descrizione_servizio ?? operationCode;

        return {
          'Cognome e nome': fullName || '',
          'Data e ora': date ? formatDate(date, 'DD MMM YYYY HH:mm') : '',
          'Descrizione': description || '',
          'Servizio': serviceCode || '',
          'Operazione': operationCode || ''
        };
      });

      return result;
    },
  },
  created() {
    this.isLoading = true
    let now = new Date();

    // Ad oggi non abbiamo un servizio che ci dice quali servizi espongono le API degli accessi
    // Per il momento abbiamo un solo servizio
    // this.serviceList = [
    //   { codice: "001", descrizione: "Documenti clinico sanitari" }
    // ];

    // Dal momento che ne abbiamo solo uno => lo preselezioniamo
    // this.filterServiceCode = this.serviceList[0].codice;

    // impostiamo una lista di periodi
    this.periodList = [
      // {
      //   codice: "001",
      //   descrizione: "Oggi",
      //   startDate: startOfDate(now, "day"),
      //   endDate: endOfDate(now, "day")
      // },
      {
        codice: "002",
        descrizione: "Ultima settimana",
        startDate: startOfDate(subtractFromDate(now, {days: 7}), "day"),
        endDate: endOfDate(now, "day")
      },
      {
        codice: "003",
        descrizione: "Ultime 4 settimane",
        startDate: startOfDate(subtractFromDate(now, {days: 28}), "day"),
        endDate: endOfDate(now, "day")
      },
      {
        codice: "004",
        descrizione: "Ultimi 6 mesi",
        startDate: startOfDate(subtractFromDate(now, {month: 6}), "day"),
        endDate: endOfDate(now, "day")
      },
      {
        codice: "005",
        descrizione: "Ultimo anno",
        startDate: startOfDate(subtractFromDate(now, {year: 1}), "day"),
        endDate: endOfDate(now, "day")
      },
      {
        codice: "006",
        descrizione: "Ultimi 2 anni",
        startDate: startOfDate(subtractFromDate(now, {year: 2}), "day"),
        endDate: endOfDate(now, "day")
      }
    ];

    // Preselezioniamo il periodo "Oggi"
    this.filterPeriodCode = this.periodList[0].codice;

    this.loadAccessList();
    this.loadOperationTypeList();
    this.loadAccessServiceDecodeList()

  },
  methods: {
    async loadOperationTypeList() {
      this.isLoadingOperationTypeList = true;

      try {
        let {data} = await getAccessOperationTypeList();
        this.operationTypeList = data;
      } catch (error) {
        let message = "Non è stato possibile caricare l'elenco dei tipi di operazione";
        apiErrorNotify({error, message});
      }

      this.isLoadingOperationTypeList = false;
    },
    async loadAccessList() {
      let taxCode = this.user?.cf;

      let params = {
        data_inizio_ricerca: this.filterPeriod?.startDate,
        data_fine_ricerca: this.filterPeriod?.endDate
      };

      this.accessList = [];
      this.isLoadingAccessList = true;

      try {
        let {data} = await getAccessList(taxCode, {params});
        this.accessList = [...data.consultazioni, ...data.operazioni];
      } catch (error) {
        let message = "Non è stato possibile caricare l'elenco degli accessi";
        apiErrorNotify({error, message});
      }

      this.isLoadingAccessList = false;
      this.isLoading = false
    },
    getServiceLabel(accessItem) {

      let code = accessItem.applicazione_verticale;
      let decode = this.accessServiceDecodeList.find(el =>  equalsIgnoreCase(el.codice, code) );
      return decode && decode.descrizione;

    },
    filterByPeriod() {
      this.loadAccessList();
    },
    openFilters() {
      this.isOpenFilters = !this.isOpenFilters
    },
    async loadAccessServiceDecodeList() {
      this.isLoadingAccessServiceDecodeList = true;

      try {
        let {data} = await getFseAccessServiceDecodeList();
        this.accessServiceDecodeList = data;
      } catch (error) {
        let message = "Non è stato possibile caricare l'elenco delle descrizioni dei servici";
        apiErrorNotify({error, message});
      }

      this.isLoadingAccessServiceDecodeList = true;
    },
    onPrint() {
      let payload = this.tableData.map(el => {
        let service = null;

        // Nuova decodifica: dalla lista di decodifiche ad hoc
        let code = el.applicazione_verticale;
        let decode = this.accessServiceDecodeList.find(el => el.codice === code);
        service = decode && decode.descrizione;

        let operation = null;
        code = el.tipo_accesso && el.tipo_accesso.codice;
        let operationType = this.operationTypeIndexedByServiceCode[code];
        operation = operationType?.descrizione_servizio ?? code;

        return {
          "utente": getFullName(el.cognome_operatore, el.nome_operatore) ?? '-',
          "data": el.data_accesso ? formatDate(el.data_accesso, 'DD MMM YYYY HH:mm') : '-',
          "descrizione": el.descrizione ?? '-',
          "servizio": service ?? '-',
          "operazione": operation ?? '-'
        }
      })


      let form = document.createElement('form');
      form.id = 'form-temp';
      form.method = 'post';
      form.action =`${httpAuth.defaults.baseURL}/apisanfse/api/v1/stampe/accessi`;

      let hiddenField = document.createElement('input');
      hiddenField.type = 'hidden';
      hiddenField.name = 'payload';
      hiddenField.value = JSON.stringify(payload);

      form.append(hiddenField);
      document.body.appendChild(form);
      form.submit();

      setTimeout(() => {
        document.getElementById('form-temp').outerHTML = '';
      });

      // aggiungiamo il log di audit
      try {
        let taxCode = this.user.cf;
        let payload = {
          codice_verticale: "PROFILO_UTENTE",
          codice_audit: "ACC_STAMPA",
          parametri: [
            {indice: "1", valore: this.filterService?.label ?? 'Tutti'},
            {indice: "2", valore: this.filterOperationType?.label ?? 'Tutti'},
            {indice: "3", valore: this.filterPeriod?.descrizione ?? 'Tutti'},
            {indice: "4", valore: this.filterRole?.label ?? 'Tutti'},
            {indice: "5", valore: this.filterNameCode ?? 'Tutti'},
          ]
        };
        createAudit(taxCode, payload);
      } catch (error) {
        console.error(error);
      }
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
    onExport(){
      let exportColumns = this.tableCols

      const content = [exportColumns.map(col => this.wrapCsvValue(col.label)).join(';')].concat(
        this.tableData.map(row => exportColumns.map(col => this.wrapCsvValue(
          typeof col.field === 'function'
            ? col.field(row)
            : row[col.field === void 0 ? col.name : col.field],
          col.format
        )).join(';'))
      ).join('\r\n')

      const status = exportFile(
        'accessi.csv',
        content,
        'text/csv'
      )

      // aggiungiamo il log di audit
      try {
        let taxCode = this.user?.cf;
        let payload = {
          codice_verticale: "CODE",
          codice_audit: "CODE",
          parametri: [
            {indice: "1", valore: this.filterService?.label ?? 'Tutti'},
            {indice: "2", valore: this.filterOperationType?.label ?? 'Tutti'},
            {indice: "3", valore: this.filterPeriod?.descrizione ?? 'Tutti'},
            {indice: "4", valore: this.filterRole?.label ?? 'Tutti'},
            {indice: "5", valore: this.filterNameCode ?? 'Tutti'},
          ]
        };
        createAudit(taxCode, payload);
      } catch (error) {
        console.error(error);
      }

      if (status !== true) {

        this.$q.notify({
          message: 'Impossibile scaricare il file.',
          color: 'negative'
        })
      }



    }
  }
}
</script>

<style lang="sass">
.lms-table-access-list
  td
    word-break: break-word

</style>
