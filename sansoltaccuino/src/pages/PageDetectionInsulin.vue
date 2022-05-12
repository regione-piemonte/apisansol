<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <tac-page padding menu>
    <div class="row items-center q-col-gutter-x-md q-col-gutter-y-lg">
      <div class="col-auto">
        <q-icon name="img:/statics/la-mia-salute/icone/siringa.svg" size="md" />
      </div>

      <div class="col">
        <lms-page-title no-back>
          Insulina
        </lms-page-title>
      </div>

      <template v-if="!isDelegationTacWeak">
        <div class="col-12 col-sm-auto">
          <lms-buttons>
            <lms-button
              icon="add_circle"
              label="Nuova rilevazione"
              @click="onAddDetection"
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
      <q-toolbar>
        <q-toolbar-title>
          Andamento dal {{ startDate | date }} al {{ endDate | date }}
        </q-toolbar-title>

        <q-btn
          :flat="visualizationSelected !== VISUALIZATION_MAP.GRAPH"
          :outline="visualizationSelected === VISUALIZATION_MAP.GRAPH"
          color="primary"
          round
          icon="img:/statics/la-mia-salute/icone/istogrammi.svg"
          size="sm"
          class="q-mr-sm"
          @click="visualizationSelected = VISUALIZATION_MAP.GRAPH"
        />
        <q-btn
          :flat="visualizationSelected !== VISUALIZATION_MAP.TABLE"
          :outline="visualizationSelected === VISUALIZATION_MAP.TABLE"
          color="primary"
          round
          icon="grid_on"
          size="sm"
          @click="visualizationSelected = VISUALIZATION_MAP.TABLE"
        />
      </q-toolbar>

      <q-tab-panels v-model="visualizationSelected" class="bg-transparent">
        <!-- VISUALIZZAZIONE GRAFICO -->
        <!-- ----------------------------------------------------------------------------------------------------- -->
        <q-tab-panel :name="VISUALIZATION_MAP.GRAPH">
          <template v-if="!isLoading">
            <q-card>
              <q-card-section
                v-for="[measure, list] in detectionInsulinListGroupedByMeasure"
                :key="'insulin--' + measure"
              >
                <div class="text-bold">Insulina - {{ measure }}</div>

                <tac-detection-graph-line-single
                  :detection-list="list"
                  color="#f2cb05"
                  class="q-mt-md"
                />
              </q-card-section>

            </q-card>
          </template>
        </q-tab-panel>

        <!-- VISUALIZZAZIONE TABELLA -->
        <!-- ----------------------------------------------------------------------------------------------------- -->
        <q-tab-panel :name="VISUALIZATION_MAP.TABLE" class="q-gutter-y-lg">
          <q-card>
            <q-expansion-item default-opened>
              <template #header>
                <q-item-section class="text-h6">
                  Insulina
                </q-item-section>
              </template>

              <tac-table-detection-insulin
                :detection-insulin-list="detectionInsulinList"
                :detection-insulin-farm-list="detectionInsulinFarmList"
                @delete="onDeleteInsulin"
              />
            </q-expansion-item>
          </q-card>
        </q-tab-panel>
      </q-tab-panels>

      <lms-inner-loading :showing="isLoading" />
    </div>

    <!-- DIALOGS -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <template v-if="isCreateDialogOpen">
      <tac-detection-insulin-create-dialog
        v-model="isCreateDialogOpen"
        @created="loadDetectionList"
      />
    </template>
  </tac-page>
</template>

<script>
import { date } from "quasar";
import { deleteBulkDetection, getDetectionList } from "../services/api";
import { apiErrorNotifyDialog, groupBy } from "../services/utils";
import { DESCRIPTOR_CODE_MAP, GROUP_CODE_MAP } from "../services/config";
import TacDetectionInsulinCreateDialog from "../components/TacDetectionInsulinCreateDialog";
import { getDetectionEntryListByMeasure } from "../services/business-logic";
import TacDetectionGraphLineSingle from "../components/TacDetectionGraphLineSingle";
import TacTableDetectionInsulin from "../components/TacTableDetectionInsulin";

const { formatDate, subtractFromDate, startOfDate, endOfDate } = date;

const GROUP_CODE = GROUP_CODE_MAP.INSULIN;
const VISUALIZATION_MAP = {
  GRAPH: 1,
  TABLE: 2
};

export default {
  name: "PageDetectionInsulin",
  components: {
    TacTableDetectionInsulin,
    TacDetectionGraphLineSingle,
    TacDetectionInsulinCreateDialog
  },
  data() {
    return {
      VISUALIZATION_MAP,
      GROUP_CODE,
      DESCRIPTOR_CODE_MAP,
      visualizationSelected: VISUALIZATION_MAP.GRAPH,
      isLoading: false,
      isCreateDialogOpen: false,
      startDate: null,
      endDate: null,
      startDate_: null,
      endDate_: null,
      detectionInsulinList: [],
      detectionInsulinFarmList: []
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
    detectionInsulinListGroupedByMeasure() {
      return getDetectionEntryListByMeasure(this.detectionInsulinList);
    },
    detectionInsulinFarmListGroupedByMeasure() {
      return groupBy(this.detectionInsulinFarmList, d => d.unita_misura_codice);
    },
    detectionList() {
      return [...this.detectionInsulinList, ...this.detectionInsulinFarmList];
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

    this.loadDetectionList();
  },
  methods: {
    onAddDetection() {
      this.isCreateDialogOpen = true;
    },
    onFilter() {
      this.updateStartDate(this.startDate_);
      this.updateEndDate(this.endDate_);
      this.loadDetectionList();
    },
    updateStartDate(date) {
      this.startDate = date;
      this.startDate_ = date;
    },
    updateEndDate(date) {
      this.endDate = date;
      this.endDate_ = date;
    },
    async loadDetectionList() {
      let taxCode = this.$store.getters["getTaxCode"];
      let notebookId = this.notebook?.id;

      let params = {
        gruppo: GROUP_CODE,
        ordinamento: "DESC",
        da: startOfDate(this.startDate, "day"),
        a: endOfDate(this.endDate, "day")
      };

      let insulinParams = {
        ...params,
        descrittore: DESCRIPTOR_CODE_MAP.INSULIN
      };
      let insulinPromise = getDetectionList(taxCode, notebookId, {
        params: insulinParams
      });

      let insulinFarmParams = {
        ...params,
        descrittore: DESCRIPTOR_CODE_MAP.INSULIN_FARM
      };
      let insulinFarmPromise = getDetectionList(taxCode, notebookId, {
        params: insulinFarmParams
      });

      this.isLoading = true;

      try {
        let { data: insulinDetectionList } = await insulinPromise;
        let { data: insulinFarmDetectionList } = await insulinFarmPromise;

        this.detectionInsulinList = insulinDetectionList?.lista ?? [];
        this.detectionInsulinFarmList = insulinFarmDetectionList?.lista ?? [];

        // let { data } = await getDetectionList(taxCode, notebookId, { params });
        // this.detectionGroupList = data;
      } catch (err) {
        let message =
          "Non è stato possibile caricare le informazioni sull'insulina";
        apiErrorNotifyDialog({ err, message });
      }

      this.isLoading = false;
    },
    onDeleteInsulin(row) {
      this.$q
        .dialog({
          title: "Conferma",
          message: "Stai per rimuovere una rilevazione, vuoi procedere?",
          ok: { label: "Sì, rimuovi", color: "negative", outline: true },
          cancel: { label: "No, annulla", outline: true },
          persistent: true,
          focus: "none"
        })
        .onOk(async () => {
          let taxCode = this.$store.getters["getTaxCode"];
          let notebookId = this.notebook?.id;
          let payload = [row?.insulin?.id, row?.insulinFarm?.id];

          try {
            let { data } = await deleteBulkDetection(
              taxCode,
              notebookId,
              payload
            );

            this.loadDetectionList();
          } catch (err) {
            let message = "Non è stato possibile rimuovere la rilevazione";
            apiErrorNotifyDialog({ err, message });
          }
        });
    }
  }
};
</script>
