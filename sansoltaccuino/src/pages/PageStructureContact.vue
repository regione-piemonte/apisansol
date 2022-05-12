<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <tac-page padding menu>
    <div class="row items-center q-col-gutter-x-md q-col-gutter-y-lg">
      <div class="col-auto">
        <q-icon
          name="img:/statics/la-mia-salute/icone/contatti-con-strutture.svg"
          size="md"
        />
      </div>

      <div class="col">
        <lms-page-title no-back>
          Contatti con le strutture
        </lms-page-title>
      </div>

      <template v-if="!isDelegationTacWeak">
        <div class="col-12 col-sm-auto">
          <lms-buttons>
            <lms-button
              icon="add_circle"
              label="Nuovo contatto"
              @click="onAddStructureContact"
            />
          </lms-buttons>
        </div>
      </template>
    </div>

    <!-- FILTRI -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <q-form greedy class="q-mt-xl" @submit="onFilter">
      <div class="row items-center q-col-gutter-x-lg q-col-gutter-y-xs">
        <div class="col-12 col-sm-auto">
          <q-input
            type="date"
            v-model="startDate_"
            label="Da"
            stack-label
            filled
            dense
            reactive-rules
            :rules="[ruleBeforeEndDate]"
            no-error-icon
          />
        </div>

        <div class="col-12 col-sm-auto">
          <q-input
            type="date"
            v-model="endDate_"
            label="A"
            stack-label
            filled
            dense
            reactive-rules
            :rules="[ruleAfterStartDate]"
            no-error-icon
          />
        </div>

        <div class="col-12 col-sm-auto">
          <lms-buttons>
            <lms-button type="submit" no-min-width outline>
              Applica
            </lms-button>
          </lms-buttons>
        </div>
      </div>
    </q-form>

    <!-- VISUALIZZAZIONE DATI -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <div class="q-mt-xl">
      <q-card class="relative-position">
        <q-toolbar>
          <q-toolbar-title>
            Dal {{ startDate | date }} al {{ endDate | date }}
          </q-toolbar-title>
        </q-toolbar>

        <!-- VISUALIZZAZIONE TABELLA -->
        <!-- ----------------------------------------------------------------------------------------------------- -->
        <q-table
          :columns="TABLE_COLS"
          :data="tableData"
          :pagination="tablePagination"
          flat
          dense
          :grid="$q.screen.lt.md"
          card-container-class="q-col-gutter-md q-px-md"
        >
          <template #body-cell-start-date="props">
            <q-td :props="props">
              {{ props.row.data_contatto_inizio | datetime }}
            </q-td>
          </template>

          <template #body-cell-end-date="props">
            <q-td :props="props">
              {{ props.row.data_contatto_fine | datetime }}
            </q-td>
          </template>

          <template #body-cell-delete="props">
            <q-td :props="props">
              <template v-if="!isDelegationTacWeak">
                <q-btn
                  round
                  flat
                  dense
                  icon="delete"
                  color="negative"
                  @click="onDelete(props.row)"
                />
              </template>
            </q-td>
          </template>

          <!-- GRID ITEM -->
          <!-- --------- -->
          <template #item="props">
            <div class="col-12 col-sm-6">
              <tac-table-grid-item-structure-contact
                :row="props.row"
                @delete="onDelete(props.row)"
              />
            </div>
          </template>
        </q-table>
      </q-card>

      <lms-inner-loading :showing="isLoading" />
    </div>

    <!-- DIALOGS -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <template v-if="isCreateDialogOpen">
      <tac-structure-contact-create-dialog
        v-model="isCreateDialogOpen"
        @created="loadStructureContactList"
      />
    </template>
  </tac-page>
</template>

<script>
import { date } from "quasar";
import {
  deleteBulkStructureContact,
  getStructureContactList
} from "../services/api";
import { apiErrorNotify, apiErrorNotifyDialog } from "../services/utils";
import TacStructureContactCreateDialog from "../components/TacStructureContactCreateDialog";
import { STRUCTURE_TYPE_CODE_MAP } from "../services/config";
import TacTableGridItemStructureContact from "../components/TacTableGridItemStructureContact";

const { formatDate, subtractFromDate, startOfDate, endOfDate } = date;

const TABLE_COLS = [
  {
    name: "start-date",
    label: "Data inizio",
    field: row => row.data_contatto_inizio,
    align: "left",
    sortable: true
  },
  {
    name: "end-date",
    label: "Data fine",
    field: row => row.data_contatto_fine,
    align: "left",
    sortable: true
  },
  {
    name: "structure-type",
    label: "Tipo di struttura",
    field: row => {
      return row.struttura_tipo?.descrizione;
    },
    align: "left",
    sortable: true
  },
  {
    name: "description",
    label: "Nome struttura",
    field: row => row.denominazione,
    align: "left",
    sortable: true
  },
  {
    name: "motivation",
    label: "Motivazione",
    field: row => row.motivazione,
    align: "left",
    sortable: false
  },
  {
    name: "contact-type",
    label: "Tipo di contatto",
    field: row => {
      let typeCode = row.struttura_tipo_codice;
      if (typeCode === STRUCTURE_TYPE_CODE_MAP.NO_CONVENTIONAL) {
        return row.medicina_non_convenzionale_tipo_contatto;
      }

      return row.tipo_contatto?.descrizione;
    },
    align: "left",
    sortable: true
  },
  {
    name: "delete",
    label: "",
    field: row => row.id,
    align: "center",
    sortable: false
  }
];

export default {
  name: "PageStructureContact",
  components: {
    TacTableGridItemStructureContact,
    TacStructureContactCreateDialog
  },
  data() {
    return {
      TABLE_COLS,
      isLoading: false,
      isCreateDialogOpen: false,
      startDate: null,
      endDate: null,
      startDate_: null,
      endDate_: null,
      structureContactList: [],
      tablePagination: {
        sortBy: "start-date",
        descending: true,
        page: 1,
        rowsPerPage: 100
      }
    };
  },
  computed: {
    user() {
      return this.$store.getters["getUser"];
    },
    notebook() {
      return this.$store.getters["getNotebook"];
    },
    isDelegationTacWeak() {
      return this.$store.getters["isDelegationTacWeak"];
    },
    tableData() {
      return this.structureContactList;
    },
    ruleBeforeEndDate() {
      return v =>
        v < this.endDate_ ||
        "La data di inizio non può essere maggiore della data di fine";
    },
    ruleAfterStartDate() {
      return v =>
        v > this.startDate_ ||
        "La data di fine non può essere inferiore alla data di inizio";
    }
  },
  created() {
    let now = new Date();
    this.endDate_ = formatDate(now, "YYYY-MM-DD");
    this.startDate_ = formatDate(
      subtractFromDate(now, { month: 1 }),
      "YYYY-MM-DD"
    );

    this.updateStartDate(this.startDate_);
    this.updateEndDate(this.endDate_);

    this.loadStructureContactList();
  },
  methods: {
    onAddStructureContact() {
      this.isCreateDialogOpen = true;
    },
    onFilter() {
      this.updateStartDate(this.startDate_);
      this.updateEndDate(this.endDate_);
      this.loadStructureContactList();
    },
    updateStartDate(date) {
      this.startDate = date;
      this.startDate_ = date;
    },
    updateEndDate(date) {
      this.endDate = date;
      this.endDate_ = date;
    },
    async loadStructureContactList() {
      let taxCode = this.$store.getters["getTaxCode"];
      let notebookId = this.notebook?.id;

      let params = {
        da: startOfDate(this.startDate, "day"),
        a: endOfDate(this.endDate, "day")
      };

      this.isLoading = true;

      try {
        let { data } = await getStructureContactList(taxCode, notebookId, {
          params
        });
        this.structureContactList = data;
      } catch (err) {
        let message =
          "Non è stato possibile caricare le informazioni sui contatti con le strutture";
        apiErrorNotifyDialog({ err, message });
      }

      this.isLoading = false;
    },
    onDelete(row) {
      this.$q
        .dialog({
          title: "Conferma",
          message:
            "Stai per rimuovere un contatto con una struttura, vuoi procedere?",
          ok: { label: "Sì, rimuovi", color: "negative", outline: true },
          cancel: { label: "No, annulla", outline: true },
          persistent: true,
          focus: "none"
        })
        .onOk(async () => {
          let taxCode = this.$store.getters["getTaxCode"];
          let notebookId = this.notebook?.id;
          let payload = [row.id];

          try {
            let { data } = await deleteBulkStructureContact(
              taxCode,
              notebookId,
              payload
            );
            this.loadStructureContactList();
          } catch (err) {
            let message =
              "Non è stato possibile rimuovere il contatto con struttura selezionato";
            apiErrorNotifyDialog({ err, message });
          }
        });
    }
  }
};
</script>
