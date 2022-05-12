<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="tac-group-list-item-cholesterol">
    <!-- CARICAMENTO -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <template v-if="isLoading">
      <tac-group-list-item-skeleton />
    </template>

    <!-- RILEVAZIONE CARICATA -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <template v-else>
      <tac-group-list-item
        title="Colesterolo"
        icon="img:/statics/la-mia-salute/icone/colesterolo.svg"
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
            v-if="
              !detectionHdl &&
                !detectionLdl &&
                !detectionTriglycerides &&
                !detectionTot
            "
          >
            Nessuna rilevazione presente negli ultimi 10 giorni
          </template>

          <!-- TESTO STATO PIENO -->
          <!-- ----------------------------------------------------------------------------------------------------- -->
          <template v-else>
            <div class="q-gutter-y-lg">
              <template v-if="detectionTot">
                <div>
                  <div class="text-caption">
                    <div class="text-bold">
                      {{ detectionTot.data | datetime }}
                    </div>
                  </div>

                  <div>
                    TOT
                    <span class="text-bold">{{ tot | decimals | number }}</span>
                    {{ totMeasure }}
                  </div>
                </div>
              </template>

              <template v-if="detectionHdl">
                <div>
                  <div class="text-caption">
                    <div class="text-bold">
                      {{ detectionHdl.data | datetime }}
                    </div>
                  </div>

                  <div>
                    HDL
                    <span class="text-bold">{{ hdl | decimals | number }}</span>
                    {{ hdlMeasure }}
                  </div>
                </div>
              </template>

              <template v-if="detectionLdl">
                <div>
                  <div class="text-caption">
                    <div class="text-bold">
                      {{ detectionLdl.data | datetime }}
                    </div>
                  </div>

                  <div>
                    LDL
                    <span class="text-bold">{{ ldl | decimals | number }}</span>
                    {{ ldlMeasure }}
                  </div>
                </div>
              </template>

              <template v-if="detectionTriglycerides">
                <div>
                  <div class="text-caption">
                    <div class="text-bold">
                      {{ detectionTriglycerides.data | datetime }}
                    </div>
                  </div>

                  <div>
                    Trigliceridi
                    <span class="text-bold">{{
                      triglycerides | decimals | number
                    }}</span>
                    {{ triglyceridesMeasure }}
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
      <tac-detection-cholesterol-create-dialog
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
import { DETECTION_CHOLESTEROL } from "../router/routes";
import { apiErrorNotify, apiErrorNotifyDialog } from "../services/utils";
import TacDetectionCholesterolCreateDialog from "./TacDetectionCholesterolCreateDialog";
import TacGroupListItemSkeleton from "./TacGroupListItemSkeleton";
import { date } from "quasar";

const { subtractFromDate } = date;

const ENTITY_CODE = ENTITY_CODE_MAP.DETECTION;
const GROUP_CODE = GROUP_CODE_MAP.CHOLESTEROL;

export default {
  name: "TacGroupListItemCholesterol",
  components: {
    TacGroupListItemSkeleton,
    TacDetectionCholesterolCreateDialog,
    TacGroupListItem
  },
  props: {},
  data() {
    return {
      isLoading: false,
      isSaving: false,
      isCreateDialogOpen: false,
      lastDetection: null,
      detectionHdl: null,
      detectionLdl: null,
      detectionTriglycerides: null,
      detectionTot: null
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
      return this.detectionHdl?.modalita?.descrizione_nazionale;
    },
    date() {
      return (
        this.detectionHdl?.data ||
        this.detectionLdl?.data ||
        this.detectionTriglycerides?.data ||
        this.detectionTot?.data
      );
    },
    hdl() {
      return this.detectionHdl?.valore_numerico;
    },
    hdlMeasure() {
      return this.detectionHdl?.unita_misura_codice;
    },
    ldl() {
      return this.detectionLdl?.valore_numerico;
    },
    ldlMeasure() {
      return this.detectionLdl?.unita_misura_codice;
    },
    triglycerides() {
      return this.detectionTriglycerides?.valore_numerico;
    },
    triglyceridesMeasure() {
      return this.detectionTriglycerides?.unita_misura_codice;
    },
    tot() {
      return this.detectionTot?.valore_numerico;
    },
    totMeasure() {
      return this.detectionTot?.unita_misura_codice;
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

        this.detectionHdl = hdlDetectionList?.lista?.[0];
        this.detectionLdl = ldlDetectionList?.lista?.[0];
        this.detectionTriglycerides = triglyceridesDetectionList?.lista?.[0];
        this.detectionTot = totDetectionList?.lista?.[0];

        // let { data } = await getDetectionList(taxCode, notebookId, { params });
        // this.lastDetection = data[0];
      } catch (err) {
        let message =
          "Non è stato possibile caricare le informazioni sul colesterolo";
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
      this.$router.push(DETECTION_CHOLESTEROL);
    }
  }
};
</script>

<style scoped lang="sass"></style>
