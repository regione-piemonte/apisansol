<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="tac-group-list-item-pressure">
    <!-- CARICAMENTO -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <template v-if="isLoading">
      <tac-group-list-item-skeleton />
    </template>

    <!-- RILEVAZIONE CARICATA -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <template v-else>
      <tac-group-list-item
        title="Pressione e frequenza cardiaca"
        icon="img:/statics/la-mia-salute/icone/elettrocardiogramma.svg"
        addable
        graph
        :is-enabled="isEnabled"
        :is-updating="isSaving"
        @update:isEnabled="onIsEnabledUpdate"
        @add="onAdd"
        @graph="onGraphClick"
      >
        <template #text>
          <!-- TESTO STATO VUOTO -->
          <!-- ----------------------------------------------------------------------------------------------------- -->
          <template
            v-if="!detectionPressMin && !detectionPressMax && !detectionBpm"
          >
            Nessuna rilevazione negli ultimi 10 giorni
          </template>

          <!-- TESTO STATO PIENO -->
          <!-- ----------------------------------------------------------------------------------------------------- -->
          <template v-else>
            <div class="q-gutter-y-lg">
              <template v-if="detectionPressMin || detectionPressMax">
                <div>
                  <div class="text-caption">
                    <div class="text-bold">
                      <template v-if="detectionPressMin">
                        {{ detectionPressMin.data | datetime }}
                      </template>
                      <template v-else>
                        {{ detectionPressMax.data | datetime }}
                      </template>
                    </div>
                  </div>

                  <template v-if="detectionPressMin">
                    <div>
                      Min
                      <span class="text-bold">{{
                        pressMin | decimals | number
                      }}</span>
                      {{ pressMinMeasure }}
                    </div>
                  </template>

                  <template v-if="detectionPressMax">
                    <div>
                      Max
                      <span class="text-bold">{{
                        pressMax | decimals | number
                      }}</span>
                      {{ pressMaxMeasure }}
                    </div>
                  </template>
                </div>
              </template>

              <template v-if="detectionBpm">
                <div>
                  <div class="text-caption">
                    <div class="text-bold">
                      {{ detectionBpm.data | datetime }}
                    </div>
                  </div>

                  <div>
                    Frequenza
                    <span class="text-bold">{{ bpm | decimals | number }}</span>
                    {{ bpmMeasure }}
                  </div>
                </div>
              </template>
            </div>
          </template>
        </template>
      </tac-group-list-item>
    </template>

    <!-- DIALOGS -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <template v-if="isCreateDialogOpen">
      <tac-detection-pressure-create-dialog
        v-model="isCreateDialogOpen"
        @created="loadLastDetection"
      />
    </template>
  </div>
</template>

<script>
import TacGroupListItem from "./TacGroupListItem";
import { getPreference } from "../services/business-logic";
import {
  DESCRIPTOR_CODE_MAP,
  ENTITY_CODE_MAP,
  GROUP_CODE_MAP
} from "../services/config";
import { getDetectionList, updatePreferenceList } from "../services/api";
import { DETECTION_PRESSURE } from "../router/routes";
import { apiErrorNotify, apiErrorNotifyDialog } from "../services/utils";
import TacDetectionPressureCreateDialog from "./TacDetectionPressureCreateDialog";
import TacGroupListItemSkeleton from "./TacGroupListItemSkeleton";
import { date } from "quasar";

const { subtractFromDate } = date;

const ENTITY_CODE = ENTITY_CODE_MAP.DETECTION;
const GROUP_CODE = GROUP_CODE_MAP.PRESSURE;

export default {
  name: "TacGroupListItemPressure",
  components: {
    TacGroupListItemSkeleton,
    TacDetectionPressureCreateDialog,
    TacGroupListItem
  },
  props: {},
  data() {
    return {
      isLoading: false,
      isSaving: false,
      isCreateDialogOpen: false,
      lastDetection: null,
      detectionPressMin: null,
      detectionPressMax: null,
      detectionBpm: null
    };
  },
  computed: {
    user() {
      return this.$store.getters["getUser"];
    },
    notebook() {
      return this.$store.getters["getNotebook"];
    },
    preference() {
      return getPreference(this.notebook, ENTITY_CODE, GROUP_CODE);
    },
    isEnabled() {
      return this.preference?.visibile;
    },

    detectionModeLabel() {
      return this.detectionPressMin?.modalita?.descrizione_nazionale;
    },
    date() {
      return (
        this.detectionPressMin?.data ||
        this.detectionPressMax?.data ||
        this.detectionBpm?.data
      );
    },
    pressMin() {
      return this.detectionPressMin?.valore_numerico;
    },
    pressMinMeasure() {
      return this.detectionPressMin?.unita_misura_codice;
    },
    pressMax() {
      return this.detectionPressMax?.valore_numerico;
    },
    pressMaxMeasure() {
      return this.detectionPressMax?.unita_misura_codice;
    },
    bpm() {
      return this.detectionBpm?.valore_numerico;
    },
    bpmMeasure() {
      return this.detectionBpm?.unita_misura_codice;
    }
  },
  created() {
    this.loadLastDetection();
  },
  methods: {
    async loadLastDetection() {
      let taxCode = this.$store.getters["getTaxCode"];
      let notebookId = this.notebook?.id;
      let now = new Date();

      let params = {
        offset: 0,
        limit: 1,
        gruppo: GROUP_CODE,
        ordinamento: "DESC",
        da: subtractFromDate(now, { days: 10 }),
        a: now
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

        this.detectionPressMin = pressMinDetectionList?.lista?.[0];
        this.detectionPressMax = pressMaxDetectionList?.lista?.[0];
        this.detectionBpm = bpmDetectionList?.lista?.[0];

        // let { data } = await getDetectionList(taxCode, notebookId, { params });
        // this.lastDetection = data[0];
      } catch (err) {
        let message =
          "Non è stato possibile caricare le informazioni su pressione e frequenza cardiaca";
        apiErrorNotifyDialog({ err, message });
      }

      this.isLoading = false;
    },
    async onIsEnabledUpdate(newValue) {
      let taxCode = this.$store.getters["getTaxCode"];
      let notebookId = this.notebook?.id;
      let preferenceList = this.notebook?.preferenze ?? [];

      // Per ogni elemento della lista preferenze rimuoviamo gli elementi che non sono necessari
      // Per la preferenza relativa a questo blocco cambiamo anche lo stato della visibilità
      let payload = preferenceList.map(p => {
        let { entita, gruppo, ...result } = p;

        if (
          result.entita_codice === ENTITY_CODE &&
          result.gruppo_codice === GROUP_CODE
        ) {
          result.visibile = newValue;
        }

        return result;
      });

      this.isSaving = true;

      try {
        let { data } = await updatePreferenceList(taxCode, notebookId, payload);
        // Aggiorniamo le informazioni del taccuino nello store globale
        let notebook = { ...this.notebook, preferenze: data };
        this.$store.dispatch("setNotebook", { notebook });
      } catch (err) {
        let message = "Non è stato possibile aggiornare la preferenza";
        apiErrorNotifyDialog({ err, message });
      }

      this.isSaving = false;
    },
    onAdd() {
      this.isCreateDialogOpen = true;
    },
    onGraphClick() {
      this.$router.push(DETECTION_PRESSURE);
    }
  }
};
</script>

<style scoped lang="sass"></style>
