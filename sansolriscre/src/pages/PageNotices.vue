<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <lms-page padding>
    <div v-if="documentsOrderedList && documentsOrderedList.length > 0">
      <p>Di seguito le comunicazioni ricevute:</p>
    </div>
    <div class="q-mt-lg" v-if="!isLoading">
      <q-card
        :class="{ 'bg-transparent': $q.screen.lt.md }"
        :flat="$q.screen.lt.md"
        class="q-my-md card-docs-table"
        v-if="documentsOrderedList && documentsOrderedList.length > 0"
      >
        <q-card-section :class="{ 'no-padding': $q.screen.lt.md }">
          <q-table
            :grid="$q.screen.lt.md"
            :data="documentsOrderedList"
            :columns="colums"
            :pagination.sync="tablePagination"
            row-key="id"
            flat
            hide-pagination
            binary-state-sort
          >
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td key="date" :props="props">
                  {{ props.row.data_generazione | date }}
                </q-td>
                <q-td key="type" :props="props">
                  {{ props.row.tipologia_screening_descrizione }}
                </q-td>
                <q-td key="document" :props="props">
                  <a
                    href="#"
                    class="text-primary text-weight-bold"
                    @click.prevent="downloadDocument(props.row)"
                    >{{ props.row.file_nome }}</a
                  >
                </q-td>
              </q-tr>
            </template>

            <template v-slot:item="props">
              <div
                class="q-pa-md col-12 grid-style-transition"
                :style="props.selected ? 'transform: scale(0.95);' : ''"
              >
                <q-card
                  class="q-py-md"
                  :class="props.selected ? 'bg-grey-3' : ''"
                >
                  <q-card-section
                    v-for="col in props.cols"
                    :key="col.name"
                    class="text-body2 q-py-sm"
                  >
                    <div class="">{{ col.label }}</div>
                    <div class="" v-if="col.name === 'date'">
                      <strong> {{ props.row.data_generazione | date }}</strong>
                    </div>
                    <div class="" v-if="col.name === 'type'">
                      <strong>{{
                        props.row.tipologia_screening_descrizione
                      }}</strong>
                    </div>
                    <div class="" v-if="col.name === 'document'">
                      <a
                        href="#"
                        class="text-primary text-weight-bold"
                        @click.prevent="downloadDocument(props.row)"
                        >{{ props.row.file_nome }}</a
                      >
                    </div>
                  </q-card-section>
                </q-card>
              </div>
            </template>

            <template v-slot:bottom-row>
              <q-tr> </q-tr>
            </template>
          </q-table>
        </q-card-section>
      </q-card>

      <div v-if="documentsOrderedList && documentsOrderedList.length === 0">
        <q-banner class="h-banner h-banner--info">
          Nessuna comunicazione ricevuta.
        </q-banner>
      </div>
    </div>
    <lms-inner-loading block :showing="isLoading" />
  </lms-page>
</template>

<script>
import { orderBy } from "src/services/business-logic";
import { apiErrorNotify } from "src/services/utils";
import { getNoticesList } from "src/services/api";
import { getNoticesDocument } from "../services/api";

const COLUMN_DATE = {
  name: "date",
  label: "Data",
  field: "Data_generazione",
  align: "left",
  sortable: true
};
const COLUMN_TYPE = {
  name: "type",
  label: "Tipologia",
  field: "tipologia_screening_descrizione",
  align: "left",
  sortable: true
};
const COLUMN_DOCUMENT = {
  name: "document",
  label: "Documento",
  field: "file_nome",
  align: "left",
  sortable: true
};
const TABLE_PAGINATION = {
  rowsPerPage: 0
};

export default {
  name: "PageNotices",
  data() {
    return {
      isLoading: false,
      documentsList: null,
      colums: [COLUMN_DATE, COLUMN_TYPE, COLUMN_DOCUMENT],
      tablePagination: TABLE_PAGINATION
    };
  },
  computed: {
    cf() {
      return this.$store.getters["getTaxCode"];
    },
    userCodes() {
      return this.$store.getters["preventionScreening/getUserCodes"];
    },
    documentsOrderedList() {
      let orderedList = [];
      if (this.documentsList) {
        let docsList = this.documentsList;
        let docs = docsList.map(d => {
          d.data_generazione = new Date(d.data_generazione);
          return d;
        });

        orderedList = orderBy(docs, ["data_generazione"]);
      }

      return orderedList;
    }
  },
  created() {
    this.isLoading = true;
    this.getDocumentsList();
  },
  methods: {
    async getDocumentsList() {
      try {
        let documentResponse = await getNoticesList(this.cf, {
          params: this.userCodes
        });
        this.documentsList = documentResponse.data;
      } catch (e) {
        apiErrorNotify({
          error: e,
          message: "Impossibile reperire le comunicazioni."
        });
      }
        this.isLoading = false;
    },

    async downloadDocument(document) {
      try {
        let documentResponse = await getNoticesDocument(this.cf, document.id, {
          params: this.userCodes
        });
      } catch (e) {
        apiErrorNotify({
          error: e,
          message: "Impossibile reperire il documento."
        });
      }
    }
  }
};
</script>

<style lang="sass"></style>
