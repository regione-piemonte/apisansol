<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-page class="q-pa-md">
    <!-- FILTRI -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <div class="row items-center gutter-x-md q-gutter-y-sm">
      <div class="col-12 col-md">
        <q-select
          v-model="filterServiceCode"
          :options="serviceListOptions"
          float-label="Servizio"
          clearable
        />
      </div>

      <div class="col-12 col-md">
        <q-select
          v-model="filterOperationTypeCode"
          :options="operationTypeListOptions"
          float-label="Operazione"
          clearable
        />
      </div>

      <div class="col-12 col-md">
        <q-select
          v-model="filterPeriodCode"
          :options="periodListOptions"
          float-label="Periodo"
          @input="onFilter"
        />
      </div>

      <div class="col-12 col-md">
        <q-select
          v-model="filterRoleCode"
          :options="roleListOptions"
          float-label="Ruolo"
          clearable
        />
      </div>

      <div class="col-12 col-md">
        <q-select
          v-model="filterNameCode"
          :options="nameListOptions"
          float-label="Cognome e nome"
          clearable
        />
      </div>
    </div>

    <!--    <div class="q-my-md">-->
    <!--      <q-select-->
    <!--        v-model="delegatorSelectedTaxCode"-->
    <!--        :options="delegatorListOptions"-->
    <!--        float-label="Delegante"-->
    <!--        clearable-->
    <!--        @input="onDelegatorSelected"-->
    <!--      />-->
    <!--    </div>-->

    <div class="q-my-md">
      <csi-buttons>
        <csi-button secondary @click="onPrint">
          Stampa PDF
        </csi-button>

        <json-c-s-v name="accessi.csv" :data="tableDataCsv" separator-excel>
          <csi-button secondary @click="onExported">
            Esporta
          </csi-button>
        </json-c-s-v>
      </csi-buttons>
    </div>

    <!-- TABELLA -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <q-table
      :columns="tableCols"
      :data="tableData"
      :pagination.sync="tablePagination"
      :loading="isLoadingAccessList"
      :grid="$q.screen.lt.lg"
      :hide-header="$q.screen.lt.lg"
      class="q-mt-lg csi-table-access-list"
      :class="{'bg-white': !$q.screen.lt.lg}"
    >

      <template slot="item" slot-scope="props">
        <div class="col-12 col-sm-6 q-pa-md self-stretch">
          <q-card class="full-height">
            <q-card-main>
              <div v-for="col in props.cols" :key="col.name" class="q-my-sm">
                <div class="text-caption text-bold">{{ col.label }}</div>
                <div>{{ col.value }}</div>
              </div>
            </q-card-main>
          </q-card>
        </div>
      </template>
    </q-table>
  </q-page>
</template>

<script>
  import JsonCSV from 'vue-json-csv'
  import {date} from "quasar";
  import {getAccessList, getAccessOperationTypeList} from "@services/api/online-reports";
  import {notifyError} from "@services/api/utils";
  import {equalsIgnoreCase, groupBy, keyBy, orderBy, uniqueElementsBy} from "@services/global/utils";
  import {format} from "@filters/date";
  import {getDelegators} from "@services/api/delegations";
  import {isDelegationValid} from "@services/delegations/business-logic";
  import {getFseAccessServiceDecodeList} from "../../../services/api/bff";
  import {axiosInstance} from "../../../plugins/axios";
  import {createAudit} from "../../../services/api/online-reports";

  const {startOfDate, endOfDate, subtractFromDate} = date;

  const getFullName = (surname, name) => {
    return [surname, name]
      .filter(el => !!el)
      .join(" ")
      .trim();
  };

  export default {
    name: 'PageUserAccessList',
    components: {JsonCSV},
    data() {
      return {
        isLoadingAccessList: false,
        isLoadingOperationTypeList: false,
        isLoadingDelegatorList: false,
        isLoadingAccessServiceDecodeList: false,
        accessList: [],
        operationTypeList: [],
        periodList: [],
        delegatorList: [],
        accessServiceDecodeList: [],
        filterServiceCode: null,
        filterOperationTypeCode: null,
        filterPeriodCode: null,
        filterRoleCode: null,
        filterNameCode: null,
        delegatorSelectedTaxCode: null,
        tablePagination: {
          sortBy: "date",
          descending: true,
          page: 1,
          rowsPerPage: 25
        }
      }
    },
    computed: {
      user() {
        return this.$store.getters['global/user']
      },
      appList() {
        return this.$store.getters['global/getAppList']
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
          format: (val, row) => val ? format(val, 'DD MMM YYYY HH:mm') : '-',
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
            // if (this.$config.global.isDevelopment || this.$config.global.isTest) {
            //   // Nuova decodifica: dalla lista di decodifiche ad hoc
            //   let code = row.applicazione_verticale;
            //   let decode = this.accessServiceDecodeList.find(el => el.codice === code);
            //   return decode && decode.descrizione;
            // } else {
            //   // Vecchia decodifica: dal codice del tipo di operazione
            //   let code = row.tipo_accesso && row.tipo_accesso.codice;
            //   let operationType = this.operationTypeIndexedByServiceCode[code];
            //   return operationType && operationType.codice_verticale || code;
            // }
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
            // if (this.$config.global.isDevelopment || this.$config.global.isTest) {
            let code = el.applicazione_verticale;
            return code === this.filterServiceCode;
            // } else {
            //   let code = el.tipo_accesso && el.tipo_accesso.codice;
            //   let operationType = this.operationTypeIndexedByServiceCode[code];
            //   return operationType && operationType.codice_verticale === this.filterServiceCode;
            // }
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
      filterService() {
        return this.serviceListOptions.find(el => el.value === this.filterServiceCode);
      },
      filterOperationType() {
        return this.operationTypeListOptions.find(el => el.value === this.filterOperationTypeCode);
      },
      filterPeriod() {
        return this.periodList.find(p => p.codice === this.filterPeriodCode);
      },
      filterRole() {
        return this.roleListOptions.find(el => el.value === this.filterRoleCode);
      },
      // serviceList() {
      //   let result = this.accessList.map(a => a && a.tipo_accesso && a.tipo_accesso.codice);
      //   result = uniqueElementsBy(result, (a, b) => a === b);
      //   result.sort((a, b) => (a > b ? 1 : -1));
      //   // result = orderBy(result, ["descrizione"], ["asc"]);
      //   return result;
      // },
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
        // if (this.$config.global.isDevelopment || this.$config.global.isTest) {
        let result = this.accessList.map(el => ({label: this.getServiceLabel(el), value: el.applicazione_verticale}))
        result = uniqueElementsBy(result, (a, b) => a.label === b.label);
        result = result.filter(el => !!el.label);
        result = orderBy(result, ['label'], ['asc']);
        return result;
        // } else {
        //   let sorted = orderBy(this.operationTypeList, ['codice_verticale'], ['asc']);
        //   sorted = uniqueElementsBy(sorted, (a, b) => a.codice_verticale === b.codice_verticale);
        //   return sorted.map(el => ({label: el.codice_verticale, value: el.codice_verticale}))
        // }
      },
      operationTypeListOptions() {
        // Lavoriamo sulla descrizione perché ci sono più codici che corrispondono alla stessa descrizione
        // ed in realtà dobbiamo considerare i diversi codici come un codice solo
        let keys = Object.keys(this.operationTypeGroupedByDescription);
        keys = uniqueElementsBy(keys, (a, b) => a === b);
        keys.sort();

        // if (this.$config.global.isDevelopment || this.$config.global.isTest) {
        // Mostriamo solamente le operazioni visibili in tabella
        keys = keys.filter(k => {
          let typeList = this.operationTypeGroupedByDescription[k] || [];
          let codes = typeList.map(el => el.codice_servizio);
          return this.accessList.some(a => {
            let code = a.tipo_accesso && a.tipo_accesso.codice;
            return codes.includes(code);
          })
        });
        // }

        return keys.map(el => ({label: el, value: el}));

        // let sorted = orderBy(this.operationTypeList, ['descrizione_servizio'], ['asc']);
        // return sorted.map(el => ({label: el.descrizione_servizio, value: el.codice_servizio}))
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
      delegatorListOptions() {
        return this.delegatorList.map(el => ({
          label: `${el.nome_delega} ${el.cognome_delega}`,
          value: el.codice_fiscale_delega
        }))
      },
      tableDataCsv() {
        let result = this.tableData || [];

        result = result.map(el => {

          let fullName = getFullName(el.cognome_operatore, el.nome_operatore);
          let date = el.data_accesso;
          let description = el.descrizione;

          let serviceCode = el.tipo_accesso && el.tipo_accesso.codice;
          let operationType = this.operationTypeIndexedByServiceCode[serviceCode];
          serviceCode = operationType && operationType.codice_verticale || serviceCode;

          let operationCode = el.tipo_accesso && el.tipo_accesso.codice;
          operationType = this.operationTypeIndexedByServiceCode[operationCode];
          operationCode = operationType && operationType.descrizione_servizio || operationCode;

          return {
            'Cognome e nome': fullName || '',
            'Data e ora': date ? format(date, 'DD MMM YYYY HH:mm') : '',
            'Descrizione': description || '',
            'Servizio': serviceCode || '',
            'Operazione': operationCode || ''
          };
        });

        return result;
      },
    },
    created() {
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
      // this.loadDelegatorList();
      this.loadAccessServiceDecodeList()
    },
    methods: {
      async loadOperationTypeList() {
        this.isLoadingOperationTypeList = true;

        try {
          let {data} = await getAccessOperationTypeList({_no5XXRedirect: true});
          this.operationTypeList = data;
        } catch (error) {
          let message = "Non è stato possibile caricare l'elenco dei tipi di operazione";
          notifyError(error, message);
        }

        this.isLoadingOperationTypeList = true;
      },
      async loadAccessList() {
        let taxCode = this.user.cf;
        if (this.delegatorSelectedTaxCode) taxCode = this.delegatorSelectedTaxCode;

        let params = {
          data_inizio_ricerca: this.filterPeriod.startDate,
          data_fine_ricerca: this.filterPeriod.endDate
        };

        this.accessList = [];
        this.isLoadingAccessList = true;

        try {
          let {data} = await getAccessList(taxCode, {params});
          this.accessList = [...data.consultazioni, ...data.operazioni];
        } catch (error) {
          let message = "Non è stato possibile caricare l'elenco degli accessi";
          notifyError(error, message);
        }

        this.isLoadingAccessList = false;
      },
      async loadDelegatorList() {
        let taxCode = this.user && this.user.cf;
        this.isLoadingDelegatorList = true;

        try {
          let {data} = await getDelegators(taxCode, {_no5XXRedirect: true});
          this.delegatorList = data.filter(delegator => {
            return delegator.deleghe.some(delegation => {
              let isServiceDelegator = equalsIgnoreCase(delegation.codice_servizio, "FSEDOC");
              let isValid = isDelegationValid(delegation.stato_delega);
              return isServiceDelegator && isValid;
            })
          })
        } catch (error) {
          console.error(error);
        }

        this.isLoadingDelegatorList = false;
      },
      async loadAccessServiceDecodeList() {
        this.isLoadingAccessServiceDecodeList = true;

        try {
          let {data} = await getFseAccessServiceDecodeList({_no5XXRedirect: true});
          this.accessServiceDecodeList = data;
        } catch (error) {
          let message = "Non è stato possibile caricare l'elenco delle descrizioni dei servici";
          notifyError(error, message);
        }

        this.isLoadingAccessServiceDecodeList = true;
      },
      onFilter() {
        this.loadAccessList();
      },
      onDelegatorSelected() {
        this.loadAccessList();
      },
      onPrint() {
        let payload = this.tableData.map(el => {
          let service = null;
          // if (this.$config.global.isDevelopment || this.$config.global.isTest) {
          // Nuova decodifica: dalla lista di decodifiche ad hoc
          let code = el.applicazione_verticale;
          let decode = this.accessServiceDecodeList.find(el => el.codice === code);
          service = decode && decode.descrizione;
          // } else {
          //   // Vecchia decodifica: dal codice del tipo di operazione
          //   let code = el.tipo_accesso && el.tipo_accesso.codice;
          //   let operationType = this.operationTypeIndexedByServiceCode[code];
          //   service = operationType && operationType.codice_verticale || code;
          // }

          let operation = null;
          code = el.tipo_accesso && el.tipo_accesso.codice;
          let operationType = this.operationTypeIndexedByServiceCode[code];
          operation = operationType && operationType.descrizione_servizio || code;

          return {
            "utente": getFullName(el.cognome_operatore, el.nome_operatore) || '-',
            "data": el.data_accesso ? format(el.data_accesso, 'DD MMM YYYY HH:mm') : '-',
            "descrizione": el.descrizione || '-',
            "servizio": service || '-',
            "operazione": operation || '-'
          }
        })


        let form = document.createElement('form');
        form.id = 'form-temp';
        form.method = 'post';
        form.action = `${axiosInstance.defaults.baseURL}${this.$config.global.basePaths.onlineReports}/stampe/accessi`;

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
          let taxCode = this.user && this.user.cf;
          let payload = {
            codice_verticale: "PROFILO_UTENTE",
            codice_audit: "ACC_STAMPA",
            parametri: [
              {indice: "1", valore: this.filterService && this.filterService.label || 'Tutti'},
              {indice: "2", valore: this.filterOperationType && this.filterOperationType.label || 'Tutti'},
              {indice: "3", valore: this.filterPeriod && this.filterPeriod.descrizione || 'Tutti'},
              {indice: "4", valore: this.filterRole && this.filterRole.label || 'Tutti'},
              {indice: "5", valore: this.filterNameCode || 'Tutti'},
            ]
          };
          createAudit(taxCode, payload, {_no5XXRedirect: true});
        } catch (error) {
          console.error(error);
        }
      },
      onExported() {
        // aggiungiamo il log di audit
        try {
          let taxCode = this.user && this.user.cf;
          let payload = {
            codice_verticale: "PROFILO_UTENTE",
            codice_audit: "ACC_EXPORT",
            parametri: [
              {indice: "1", valore: this.filterService && this.filterService.label || 'Tutti'},
              {indice: "2", valore: this.filterOperationType && this.filterOperationType.label || 'Tutti'},
              {indice: "3", valore: this.filterPeriod && this.filterPeriod.descrizione || 'Tutti'},
              {indice: "4", valore: this.filterRole && this.filterRole.label || 'Tutti'},
              {indice: "5", valore: this.filterNameCode || 'Tutti'},
            ]
          };
          createAudit(taxCode, payload, {_no5XXRedirect: true});
        } catch (error) {
          console.error(error);
        }
      },
      getServiceLabel(accessItem) {
        // if (this.$config.global.isDevelopment || this.$config.global.isTest) {
          // Nuova decodifica: dalla lista di decodifiche ad hoc
          let code = accessItem.applicazione_verticale;
          let decode = this.accessServiceDecodeList.find(el => el.codice === code);
          return decode && decode.descrizione;
        // } else {
        //   // Vecchia decodifica: dal codice del tipo di operazione
        //   let code = accessItem.tipo_accesso && accessItem.tipo_accesso.codice;
        //   let operationType = this.operationTypeIndexedByServiceCode[code];
        //   return operationType && operationType.codice_verticale || code;
        // }
      }
    }
  }
</script>

<style lang="stylus">
  .table-col-max-width
    max-width: 200px
    white-space: normal !important

  .table-col-max-width--sm
    max-width: 120px
    white-space: normal !important

  .csi-table-access-list
    td
      word-break: break-word
</style>
