<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <tac-page padding menu>
    <div class="row items-center q-col-gutter-x-md q-col-gutter-y-lg">
      <div class="col-auto">
        <q-icon
          name="img:/statics/la-mia-salute/icone/colesterolo.svg"
          size="md"
        />
      </div>

      <div class="col">
        <lms-page-title no-back>
          Colesterolo
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
                v-for="[measure, list] in detectionTotListGroupedByMeasure"
                :key="'tot--' + measure"
              >
                <div class="text-bold">TOT - {{ measure }}</div>

                <tac-detection-graph-line-single
                  :detection-list="list"
                  color="#00a120"
                  class="q-mt-md"
                />
              </q-card-section>

              <q-separator inset spaced />

              <q-card-section
                v-for="[measure, list] in detectionHdlListGroupedByMeasure"
                :key="'hdl--' + measure"
              >
                <div class="text-bold">HDL - {{ measure }}</div>

                <tac-detection-graph-line-single
                  :detection-list="list"
                  color="#f2cb05"
                  class="q-mt-md"
                />
              </q-card-section>

              <q-separator inset spaced />

              <q-card-section
                v-for="[measure, list] in detectionLdlListGroupedByMeasure"
                :key="'ldl--' + measure"
              >
                <div class="text-bold">LDL - {{ measure }}</div>

                <tac-detection-graph-line-single
                  :detection-list="list"
                  color="#d68800"
                  class="q-mt-md"
                />
              </q-card-section>

              <q-separator inset spaced />

              <q-card-section
                v-for="[
                  measure,
                  list
                ] in detectionTriglyceridesListGroupedByMeasure"
                :key="'triglycerides--' + measure"
              >
                <div class="text-bold">Trigliceridi - {{ measure }}</div>

                <tac-detection-graph-line-single
                  :detection-list="list"
                  color="#00a120"
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
                  TOT
                </q-item-section>
              </template>

              <tac-table-detection
                :detection-list="detectionTotList"
                @delete="onDelete"
              />
            </q-expansion-item>
          </q-card>

          <q-card>
            <q-expansion-item default-opened>
              <template #header>
                <q-item-section class="text-h6">
                  HDL
                </q-item-section>
              </template>

              <tac-table-detection
                :detection-list="detectionHdlList"
                @delete="onDelete"
              />
            </q-expansion-item>
          </q-card>

          <q-card>
            <q-expansion-item default-opened>
              <template #header>
                <q-item-section class="text-h6">
                  LDL
                </q-item-section>
              </template>

              <tac-table-detection
                :detection-list="detectionLdlList"
                @delete="onDelete"
              />
            </q-expansion-item>
          </q-card>

          <q-card>
            <q-expansion-item default-opened>
              <template #header>
                <q-item-section class="text-h6">
                  Trigliceridi
                </q-item-section>
              </template>

              <tac-table-detection
                :detection-list="detectionTriglyceridesList"
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
      <tac-detection-cholesterol-create-dialog
        v-model="isCreateDialogOpen"
        @created="loadDetectionList"
      />
    </template>
  </tac-page>
</template>

<script>
import { date } from "quasar";
import { deleteBulkDetection, getDetectionList } from "../services/api";
import { apiErrorNotifyDialog, orderBy } from "../services/utils";
import { DESCRIPTOR_CODE_MAP, GROUP_CODE_MAP } from "../services/config";
import TacDetectionCholesterolCreateDialog from "../components/TacDetectionCholesterolCreateDialog";
import TacTableDetection from "../components/TacTableDetection";
import {
  getDetectionDatasetPointList,
  getDetectionEntryListByMeasure
} from "../services/business-logic";
import TacDetectionGraphLineSingle from "../components/TacDetectionGraphLineSingle";

const { formatDate, subtractFromDate, startOfDate, endOfDate } = date;

const GROUP_CODE = GROUP_CODE_MAP.CHOLESTEROL;
const VISUALIZATION_MAP = {
  GRAPH: 1,
  TABLE: 2
};

export default {
  name: "PageDetectionCholesterol",
  components: {
    TacDetectionGraphLineSingle,
    TacTableDetection,
    TacDetectionCholesterolCreateDialog
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
      detectionHdlList: [],
      detectionLdlList: [],
      detectionTriglyceridesList: [],
      detectionTotList: []
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
    detectionHdlListGroupedByMeasure() {
      return getDetectionEntryListByMeasure(this.detectionHdlList);
    },
    detectionLdlListGroupedByMeasure() {
      return getDetectionEntryListByMeasure(this.detectionLdlList);
    },
    detectionTriglyceridesListGroupedByMeasure() {
      return getDetectionEntryListByMeasure(this.detectionTriglyceridesList);
    },
    detectionTotListGroupedByMeasure() {
      return getDetectionEntryListByMeasure(this.detectionTotList);
    },
    detectionList() {
      return [
        ...this.detectionHdlList,
        ...this.detectionLdlList,
        ...this.detectionTriglyceridesList,
        ...this.detectionTotList
      ];
    },
    // Elenco di dataset + label raggruppati per unità di misura
    chartDataMapTriglycerides() {
      let result = [];

      this.detectionTriglyceridesListGroupedByMeasure.forEach(([key, list]) => {
        let labelList = orderBy(list, ["data"], ["asc"]);
        labelList = labelList.map(d => formatDate(d.data, "DD MMM HH:mm"));
        labelList = [...new Set(labelList)];

        let datasetList = [
          {
            label: `Trigliceridi - ${key}`,
            data: getDetectionDatasetPointList(list),
            backgroundColor: "#d68800",
            borderColor: "#d68800",
            lineTension: 0,
            fill: false,
            spanGaps: true
          }
        ];

        result.push([key, { labelList, datasetList }]);
      });

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

      let hdlParams = {
        ...params,
        descrittore: DESCRIPTOR_CODE_MAP.CHOLESTEROL_HDL
      };
      let hdlPromise = getDetectionList(taxCode, notebookId, {
        params: hdlParams
      });

      let ldlParams = {
        ...params,
        descrittore: DESCRIPTOR_CODE_MAP.CHOLESTEROL_LDL
      };
      let ldlPromise = getDetectionList(taxCode, notebookId, {
        params: ldlParams
      });

      let triglyceridesParams = {
        ...params,
        descrittore: DESCRIPTOR_CODE_MAP.TRIGLYCERIDES
      };
      let triglyceridesPromise = getDetectionList(taxCode, notebookId, {
        params: triglyceridesParams
      });

      let totParams = {
        ...params,
        descrittore: DESCRIPTOR_CODE_MAP.CHOLESTEROL_TOT
      };
      let totPromise = getDetectionList(taxCode, notebookId, {
        params: totParams
      });

      this.isLoading = true;

      try {
        let { data: hdlDetectionList } = await hdlPromise;
        let { data: ldlDetectionList } = await ldlPromise;
        let { data: triglyceridesDetectionList } = await triglyceridesPromise;
        let { data: totDetectionList } = await totPromise;

        this.detectionHdlList = hdlDetectionList?.lista ?? [];
        this.detectionLdlList = ldlDetectionList?.lista ?? [];
        this.detectionTriglyceridesList =
          triglyceridesDetectionList?.lista ?? [];
        this.detectionTotList = totDetectionList?.lista ?? [];

        // let { data } = await getDetectionList(taxCode, notebookId, { params });
        // this.detectionGroupList = data;
      } catch (err) {
        let message =
          "Non è stato possibile caricare le informazioni sul colesterolo";
        apiErrorNotifyDialog({ err, message });
      }

      this.isLoading = false;
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
