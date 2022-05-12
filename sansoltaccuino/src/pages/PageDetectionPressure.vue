<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <tac-page padding menu>
    <div class="row items-center q-col-gutter-x-md q-col-gutter-y-lg">
      <div class="col-auto">
        <q-icon
          name="img:/statics/la-mia-salute/icone/elettrocardiogramma.svg"
          size="md"
        />
      </div>

      <div class="col">
        <lms-page-title no-back>
          Pressione e frequenza cardiaca
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
        <q-tab-panel :name="VISUALIZATION_MAP.GRAPH" class="q-gutter-y-lg">
          <template v-if="!isLoading">
            <q-card>
              <q-card-section>
                <div class="text-h6">
                  Pressione
                </div>

                <tac-detection-graph-line
                  :label-list="chartLabelListPress"
                  :dataset-list="chartDatasetListPress"
                  :height="300"
                  legend
                />
              </q-card-section>
            </q-card>

            <q-card>
              <q-card-section
                v-for="(data, measure) in chartDataMapBpm"
                :key="'bpm--' + measure"
              >
                <div class="text-h6">Frequenza cardiaca - {{ measure }}</div>

                <tac-detection-graph-line
                  :label-list="data.labelList"
                  :dataset-list="data.datasetList"
                  :height="300"
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
                  Pressione
                </q-item-section>
              </template>

              <tac-table-detection-pressure
                :detection-press-min-list="detectionPressMinList"
                :detection-press-max-list="detectionPressMaxList"
                @delete="onDeletePress"
              />
            </q-expansion-item>
          </q-card>

          <q-card>
            <q-expansion-item default-opened>
              <template #header>
                <q-item-section class="text-h6">
                  Frequenza cardiaca
                </q-item-section>
              </template>

              <tac-table-detection
                :detection-list="detectionBpmList"
                @delete="onDelete"
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
      <tac-detection-pressure-create-dialog
        v-model="isCreateDialogOpen"
        @created="loadDetectionList"
      />
    </template>
  </tac-page>
</template>

<script>
import { date } from "quasar";
import { deleteBulkDetection, getDetectionList } from "../services/api";
import { apiErrorNotifyDialog, groupBy, orderBy } from "../services/utils";
import { DESCRIPTOR_CODE_MAP, GROUP_CODE_MAP } from "../services/config";
import TacDetectionPressureCreateDialog from "../components/TacDetectionPressureCreateDialog";
import TacTableDetection from "../components/TacTableDetection";
import TacDetectionGraphLine from "../components/TacDetectionGraphLine";
import TacTableDetectionPressure from "../components/TacTableDetectionPressure";
import { getDetectionDatasetPointList } from "../services/business-logic";

const { formatDate, subtractFromDate, startOfDate, endOfDate } = date;

const GROUP_CODE = GROUP_CODE_MAP.PRESSURE;
const VISUALIZATION_MAP = {
  GRAPH: 1,
  TABLE: 2
};

export default {
  name: "PageDetectionPressure",
  components: {
    TacTableDetectionPressure,
    TacDetectionGraphLine,
    TacTableDetection,
    TacDetectionPressureCreateDialog
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
      detectionPressMinList: [],
      detectionPressMaxList: [],
      detectionBpmList: []
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
    detectionPressMinListGroupedByMeasure() {
      return groupBy(this.detectionPressMinList, d => d.unita_misura_codice);
    },
    detectionPressMaxListGroupedByMeasure() {
      return groupBy(this.detectionPressMaxList, d => d.unita_misura_codice);
    },
    detectionBpmListGroupedByMeasure() {
      return groupBy(this.detectionBpmList, d => d.unita_misura_codice);
    },
    chartLabelListPress() {
      let list = [...this.detectionPressMinList, ...this.detectionPressMaxList];
      let result = orderBy(list, ["data"], ["asc"]);
      result = result.map(d => formatDate(d.data, "DD MMM YYYY HH:mm"));
      return [...new Set(result)];
    },
    chartDatasetListPress() {
      let result = [];

      Object.entries(this.detectionPressMinListGroupedByMeasure).forEach(
        ([key, list]) => {
          result.push({
            label: `Pressione diastolica (minima) - ${key}`,
            data: getDetectionDatasetPointList(list),
            backgroundColor: "#f2cb05",
            borderColor: "#f2cb05",
            lineTension: 0,
            fill: false,
            spanGaps: true
          });
        }
      );

      Object.entries(this.detectionPressMaxListGroupedByMeasure).forEach(
        ([key, list]) => {
          result.push({
            label: `Pressione sistolica (massima) - ${key}`,
            data: getDetectionDatasetPointList(list),
            backgroundColor: "#d68800",
            borderColor: "#d68800",
            lineTension: 0,
            fill: false,
            spanGaps: true
          });
        }
      );

      return result;
    },
    // Elenco di dataset + label raggruppati per unità di misura
    chartDataMapBpm() {
      let result = {};

      Object.entries(this.detectionBpmListGroupedByMeasure).forEach(
        ([key, list]) => {
          let labelList = orderBy(list, ["data"], ["asc"]);
          labelList = labelList.map(d => formatDate(d.data, "DD MMM YYYY HH:mm"));
          labelList = [...new Set(labelList)];

          let datasetList = [
            {
              label: `Frequenza cardiaca - ${key}`,
              data: getDetectionDatasetPointList(list),
              backgroundColor: "#00a120",
              borderColor: "#00a120",
              lineTension: 0,
              fill: false,
              spanGaps: true
            }
          ];

          result[key] = {
            labelList,
            datasetList
          };
        }
      );

      return result;
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

      let pressMinParams = {
        ...params,
        descrittore: DESCRIPTOR_CODE_MAP.DIASTOLIC_PRESSURE
      };
      let pressMinPromise = getDetectionList(taxCode, notebookId, {
        params: pressMinParams
      });

      let pressMaxParams = {
        ...params,
        descrittore: DESCRIPTOR_CODE_MAP.SYSTOLIC_PRESSURE
      };
      let pressMaxPromise = getDetectionList(taxCode, notebookId, {
        params: pressMaxParams
      });

      let bpmParams = {
        ...params,
        descrittore: DESCRIPTOR_CODE_MAP.HEART_RATE
      };
      let bpmPromise = getDetectionList(taxCode, notebookId, {
        params: bpmParams
      });

      this.isLoading = true;

      try {
        let { data: pressMinDetectionList } = await pressMinPromise;
        let { data: pressMaxDetectionList } = await pressMaxPromise;
        let { data: bpmDetectionList } = await bpmPromise;

        this.detectionPressMinList = pressMinDetectionList?.lista ?? [];
        this.detectionPressMaxList = pressMaxDetectionList?.lista ?? [];
        this.detectionBpmList = bpmDetectionList?.lista ?? [];

        // let { data } = await getDetectionList(taxCode, notebookId, { params });
        // this.detectionGroupList = data;
      } catch (err) {
        let message =
          "Non è stato possibile caricare le informazioni su pressione e frequenza cardiaca";
        apiErrorNotifyDialog({ err, message });
      }

      this.isLoading = false;
    },
    onDeletePress(row) {
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
          let payload = [row?.min?.id, row?.max?.id];

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
    },
    onDelete(row) {
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
          let payload = [row?.id];

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
