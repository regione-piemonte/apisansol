<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <lms-page padding>
    <!-- FILTRI -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <div class="row items-center q-col-gutter-md">
      <div class="col-12 col-md">
        <q-select
          v-model="filterServiceCode"
          :options="serviceList"
          label="Servizio"
          option-value="codice"
          option-label="descrizione"
          emit-value
          map-options
          outlined
        />
      </div>

      <div class="col-12 col-md">
        <q-select
          v-model="filterPeriodCode"
          :options="periodList"
          label="Periodo"
          option-value="codice"
          option-label="descrizione"
          emit-value
          map-options
          outlined
          @input="onFilter"
        />
      </div>

      <div class="col-12 col-md">
        <q-select
          v-model="filterRoleCode"
          :options="roleList"
          label="Ruolo"
          option-value="codice"
          option-label="descrizione"
          emit-value
          map-options
          outlined
          clearable
        />
      </div>

      <div class="col-12 col-md">
        <q-select
          v-model="filterNameCode"
          :options="nameList"
          label="Cognome e nome"
          option-value="codice"
          option-label="descrizione"
          emit-value
          map-options
          outlined
          clearable
        />
      </div>
    </div>

    <!-- TABELLA -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <q-table
      :columns="tableCols"
      :data="tableData"
      :pagination.sync="tablePagination"
      :loading="isLoadingAccessList"
      class="q-mt-lg"
    >
      <template #loading>
        <q-inner-loading showing color="primary" />
      </template>
    </q-table>
  </lms-page>
</template>

<script>
import { date } from "quasar";
import { empty, datetime } from "../boot/filters";
import {
  apiErrorNotifyDialog,
  orderBy,
  uniqueElementsBy
} from "../services/utils";
import { getAccessList } from "../services/api";

const { subtractFromDate, startOfDate, endOfDate } = date;

const LABEL_MAP = {
  // PAZ_ACCESSI2: "Accessi",
  // GET_DETT_DOC: "Dettaglio",
};

const getFullName = (surname, name) => {
  return [surname, name]
    .filter(el => !!el)
    .join(" ")
    .trim();
};

export default {
  name: "PageAccessList",
  props: {},
  data() {
    return {
      isLoadingAccessList: false,
      accessList: [],
      periodList: [],
      filterServiceCode: null,
      filterPeriodCode: null,
      filterRoleCode: null,
      filterNameCode: null,
      tablePagination: {
        sortBy: "date",
        descending: true,
        page: 1,
        rowsPerPage: 25
      }
    };
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
        format: (val, row) => empty(val),
        align: "left",
        sortable: true
      });

      result.push({
        name: "date",
        label: "Data e ora",
        field: row => row.data_accesso,
        format: (val, row) => empty(datetime(val)),
        align: "left",
        sortable: true
      });

      result.push({
        name: "type",
        label: "Tipo di operazione",
        field: row => row.descrizione,
        format: (val, row) => empty(val),
        align: "left",
        sortable: true,
        classes: "table-col-max-width"
      });

      result.push({
        name: "service",
        label: "Servizio",
        // field: row => "Documenti clinico sanitari",
        field: row => {
          let code = row.tipo_accesso?.codice;
          return LABEL_MAP[code] ?? code;
        },
        format: (val, row) => empty(val),
        align: "left",
        sortable: true
      });

      return result;
    },
    tableData() {
      let result = this.accessList;

      // Filtriamo per cognome e nome solo se richiesto
      if (this.filterNameCode) {
        result = result.filter(el => {
          let fullName = getFullName(el.cognome_operatore, el.nome_operatore);
          return fullName === this.filterNameCode;
        });
      }

      // Filtriamo per ruolo solo se richiesto
      if (this.filterRoleCode) {
        result = result.filter(el => {
          return el.ruolo?.codice === this.filterRoleCode;
        });
      }

      // Filtriamo per servizio
      if (this.filterServiceCode) {
        result = result.filter(el => {
          return el.tipo_accesso?.codice === this.filterServiceCode;
        });
      }

      return result;
    },
    filterPeriod() {
      return this.periodList.find(p => p.codice === this.filterPeriodCode);
    },
    serviceList() {
      let result = this.accessList.map(a => a?.tipo_accesso?.codice);
      result = uniqueElementsBy(result, (a, b) => a === b);
      result.sort((a, b) => (a > b ? 1 : -1));
      // result = orderBy(result, ["descrizione"], ["asc"]);
      return result;
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
        return { codice: fullName, descrizione: fullName };
      });

      result = uniqueElementsBy(result, (a, b) => a.codice === b.codice);
      result = orderBy(result, ["descrizione"], ["asc"]);
      return result;
    }
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
      {
        codice: "001",
        descrizione: "Oggi",
        startDate: startOfDate(now, "day"),
        endDate: endOfDate(now, "day")
      },
      {
        codice: "002",
        descrizione: "Ultima settimana",
        startDate: startOfDate(subtractFromDate(now, { days: 7 }), "day"),
        endDate: endOfDate(now, "day")
      },
      {
        codice: "003",
        descrizione: "Ultime 4 settimane",
        startDate: startOfDate(subtractFromDate(now, { days: 28 }), "day"),
        endDate: endOfDate(now, "day")
      },
      {
        codice: "004",
        descrizione: "Ultimi 6 mesi",
        startDate: startOfDate(subtractFromDate(now, { month: 6 }), "day"),
        endDate: endOfDate(now, "day")
      },
      {
        codice: "005",
        descrizione: "Ultimo anno",
        startDate: startOfDate(subtractFromDate(now, { year: 1 }), "day"),
        endDate: endOfDate(now, "day")
      },
      {
        codice: "006",
        descrizione: "Ultimi 2 anni",
        startDate: startOfDate(subtractFromDate(now, { year: 2 }), "day"),
        endDate: endOfDate(now, "day")
      }
    ];

    // Preselezioniamo il periodo "Oggi"
    this.filterPeriodCode = this.periodList[1].codice;

    this.loadAccessList();
  },
  methods: {
    async loadAccessList() {
      let taxCode = this.$store.getters["getTaxCode"];

      let params = {
        data_inizio_ricerca: this.filterPeriod.startDate,
        data_fine_ricerca: this.filterPeriod.endDate
      };

      this.accessList = [];
      this.isLoadingAccessList = true;

      try {
        let { data } = await getAccessList(taxCode, { params });
        this.accessList = [...data.consultazioni, ...data.operazioni];
      } catch (error) {
        let message = "Non è stato possibile caricare l'elenco degli accessi";
        apiErrorNotifyDialog({ error, message });
      }

      this.isLoadingAccessList = false;
    },
    onFilter() {
      this.loadAccessList();
    }
  }
};
</script>

<style lang="scss">
.table-col-max-width {
  max-width: 200px;
  white-space: normal !important;
}
</style>
