<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <tac-page padding menu>
    <div class="row items-center q-col-gutter-x-md q-col-gutter-y-lg">
      <div class="col-auto">
        <q-icon
          name="img:/statics/la-mia-salute/icone/termometro.svg"
          size="md"
        />
      </div>

      <div class="col">
        <lms-page-title no-back>
          Temperatura
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
                v-for="[
                  measure,
                  list
                ] in detectionTemperatureListGroupedByMeasure"
                :key="'temperature--' + measure"
              >
                <div class="text-bold">Temperatura - {{ measure }}</div>

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
        <q-tab-panel :name="VISUALIZATION_MAP.TABLE">
          <q-card>
            <tac-table-detection
              :detection-list="detectionTemperatureList"
              @delete="onDelete"
            />
          </q-card>
        </q-tab-panel>
      </q-tab-panels>

      <lms-inner-loading :showing="isLoading" />
    </div>

    <!-- DIALOGS -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <template v-if="isCreateDialogOpen">
      <tac-detection-temperature-create-dialog
        v-model="isCreateDialogOpen"
        @created="loadDetectionList"
      />
    </template>
  </tac-page>
</template>

<script>
import { date } from "quasar";
import { deleteBulkDetection, getDetectionList } from "../services/api";
import { apiErrorNotifyDialog } from "../services/utils";
import { DESCRIPTOR_CODE_MAP, GROUP_CODE_MAP } from "../services/config";
import TacDetectionTemperatureCreateDialog from "../components/TacDetectionTemperatureCreateDialog";
import TacTableDetection from "../components/TacTableDetection";
import { getDetectionEntryListByMeasure } from "../services/business-logic";
import TacDetectionGraphLineSingle from "../components/TacDetectionGraphLineSingle";

const { formatDate, subtractFromDate, startOfDate, endOfDate } = date;

const GROUP_CODE = GROUP_CODE_MAP.TEMPERATURE;
const VISUALIZATION_MAP = {
  GRAPH: 1,
  TABLE: 2
};

export default {
  name: "PageDetectionTemperature",
  components: {
    TacDetectionGraphLineSingle,
    TacTableDetection,
    TacDetectionTemperatureCreateDialog
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
      detectionTemperatureList: []
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
    detectionTemperatureListGroupedByMeasure() {
      return getDetectionEntryListByMeasure(this.detectionTemperatureList);
    },
    detectionList() {
      return [...this.detectionTemperatureList];
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

      let tempParams = {
        ...params,
        descrittore: DESCRIPTOR_CODE_MAP.TEMPERATURE
      };
      let tempPromise = getDetectionList(taxCode, notebookId, {
        params: tempParams
      });

      this.isLoading = true;

      try {
        let { data: tempDetectionList } = await tempPromise;

        this.detectionTemperatureList = tempDetectionList?.lista ?? [];

        // let { data } = await getDetectionList(taxCode, notebookId, { params });
        // this.detectionGroupList = data;
      } catch (err) {
        let message =
          "Non è stato possibile caricare le informazioni sulle temperature";
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
