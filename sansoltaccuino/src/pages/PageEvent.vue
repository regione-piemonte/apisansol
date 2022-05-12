<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <tac-page padding menu>
    <div class="row items-center q-col-gutter-x-md q-col-gutter-y-lg">
      <div class="col-auto">
        <q-icon
          name="img:/statics/la-mia-salute/icone/calendario.svg"
          size="md"
        />
      </div>

      <div class="col">
        <lms-page-title no-back>
          Eventi
        </lms-page-title>
      </div>

      <template v-if="!isDelegationTacWeak">
        <div class="col-12 col-sm-auto">
          <lms-buttons>
            <lms-button
              icon="add_circle"
              label="Nuovo evento"
              @click="onAddEvent"
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
          <template #body-cell-date="props">
            <q-td :props="props">
              {{ props.row.data | datetime }}
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
              <tac-table-grid-item-event
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
      <tac-event-create-dialog
        v-model="isCreateDialogOpen"
        @created="loadEventList"
      />
    </template>
  </tac-page>
</template>

<script>
import { date } from "quasar";
import { deleteEvent, getEventList } from "../services/api";
import { apiErrorNotify, apiErrorNotifyDialog } from "../services/utils";
import TacEventCreateDialog from "../components/TacEventCreateDialog";
import TacTableGridItemEvent from "../components/TacTableGridItemEvent";

const { formatDate, subtractFromDate, startOfDate, endOfDate } = date;

const TABLE_COLS = [
  {
    name: "date",
    label: "Data",
    field: row => row.data,
    align: "left",
    sortable: true
  },
  {
    name: "description",
    label: "Descrizione",
    field: row => row.descrizione,
    align: "left",
    sortable: false
  },
  {
    name: "delete",
    label: "",
    field: row => row.temperature,
    align: "center",
    sortable: false
  }
];

export default {
  name: "PageEvent",
  components: {
    TacTableGridItemEvent,
    TacEventCreateDialog
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
      eventList: [],
      tablePagination: {
        sortBy: "date",
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
      return this.eventList;
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

    this.loadEventList();
  },
  methods: {
    onAddEvent() {
      this.isCreateDialogOpen = true;
    },
    onFilter() {
      this.updateStartDate(this.startDate_);
      this.updateEndDate(this.endDate_);
      this.loadEventList();
    },
    updateStartDate(date) {
      this.startDate = date;
      this.startDate_ = date;
    },
    updateEndDate(date) {
      this.endDate = date;
      this.endDate_ = date;
    },
    async loadEventList() {
      let taxCode = this.$store.getters["getTaxCode"];
      let notebookId = this.notebook?.id;

      let params = {
        da: startOfDate(this.startDate, "day"),
        a: endOfDate(this.endDate, "day")
      };

      this.isLoading = true;

      try {
        let { data } = await getEventList(taxCode, notebookId, { params });
        this.eventList = data;
      } catch (err) {
        let message =
          "Non è stato possibile caricare le informazioni sugli eventi";
        apiErrorNotifyDialog({ err, message });
      }

      this.isLoading = false;
    },
    onDelete(row) {
      this.$q
        .dialog({
          title: "Conferma",
          message: "Stai per rimuovere un evento annotato, vuoi procedere?",
          ok: { label: "Sì, rimuovi", color: "negative", outline: true },
          cancel: { label: "No, annulla", outline: true },
          persistent: true,
          focus: "none"
        })
        .onOk(async () => {
          let taxCode = this.$store.getters["getTaxCode"];
          let notebookId = this.notebook?.id;
          let eventId = row.id;

          try {
            let { data } = await deleteEvent(taxCode, notebookId, eventId);
            this.loadEventList();
          } catch (err) {
            let message =
              "Non è stato possibile rimuovere l'evento selezionato";
            apiErrorNotifyDialog({ err, message });
          }
        });
    }
  }
};
</script>
