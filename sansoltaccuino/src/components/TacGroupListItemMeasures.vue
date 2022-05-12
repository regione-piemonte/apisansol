<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="tac-group-list-item-measures">
    <!-- CARICAMENTO -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <template v-if="isLoading">
      <tac-group-list-item-skeleton />
    </template>

    <!-- RILEVAZIONE CARICATA -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <template v-else>
      <tac-group-list-item
        title="Altezza, peso e circonferenza vita"
        icon="img:/statics/la-mia-salute/icone/bilancia.svg"
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
              !detectionHeight && !detectionWeight && !detectionCircumference
            "
          >
            Nessuna rilevazione negli ultimi 10 giorni
          </template>

          <!-- TESTO STATO PIENO -->
          <!-- ----------------------------------------------------------------------------------------------------- -->
          <template v-else>
            <div class="q-gutter-y-lg">
              <template v-if="detectionHeight">
                <div>
                  <div class="text-caption">
                    <div class="text-bold">
                      {{ detectionHeight.data | datetime }}
                    </div>
                  </div>

                  <div>
                    Altezza
                    <span class="text-bold">{{
                      height | decimals | number
                    }}</span>
                    {{ heightMeasure }}
                  </div>
                </div>
              </template>

              <template v-if="detectionWeight">
                <div>
                  <div class="text-caption">
                    <div class="text-bold">
                      {{ detectionWeight.data | datetime }}
                    </div>
                  </div>

                  <div>
                    Peso
                    <span class="text-bold">{{
                      weight | decimals | number
                    }}</span>
                    {{ weightMeasure }}
                  </div>
                </div>
              </template>

              <template v-if="detectionCircumference">
                <div>
                  <div class="text-caption">
                    <div class="text-bold">
                      {{ detectionCircumference.data | datetime }}
                    </div>
                  </div>

                  <div>
                    Vita
                    <span class="text-bold">{{
                      circumference | decimals | number
                    }}</span>
                    {{ circumferenceMeasure }}
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
      <tac-detection-measures-create-dialog
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
import { DETECTION_MEASURES } from "../router/routes";
import { apiErrorNotify, apiErrorNotifyDialog } from "../services/utils";
import TacDetectionMeasuresCreateDialog from "./TacDetectionMeasuresCreateDialog";
import TacGroupListItemSkeleton from "./TacGroupListItemSkeleton";
import { date } from "quasar";

const { subtractFromDate } = date;

const ENTITY_CODE = ENTITY_CODE_MAP.DETECTION;
const GROUP_CODE = GROUP_CODE_MAP.WEIGHT;

export default {
  name: "TacGroupListItemMeasures",
  components: {
    TacGroupListItemSkeleton,
    TacDetectionMeasuresCreateDialog,
    TacGroupListItem
  },
  props: {},
  data() {
    return {
      isLoading: false,
      isSaving: false,
      isCreateDialogOpen: false,
      lastDetection: null,
      detectionHeight: null,
      detectionWeight: null,
      detectionCircumference: null
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
      return this.detectionHeight?.modalita?.descrizione_nazionale;
    },
    date() {
      return (
        this.detectionHeight?.data ||
        this.detectionWeight?.data ||
        this.detectionCircumference?.data
      );
    },
    height() {
      return this.detectionHeight?.valore_numerico;
    },
    heightMeasure() {
      return this.detectionHeight?.unita_misura_codice;
    },
    weight() {
      return this.detectionWeight?.valore_numerico;
    },
    weightMeasure() {
      return this.detectionWeight?.unita_misura_codice;
    },
    circumference() {
      return this.detectionCircumference?.valore_numerico;
    },
    circumferenceMeasure() {
      return this.detectionCircumference?.unita_misura_codice;
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

      let heightParams = { ...params, descrittore: DESCRIPTOR_CODE_MAP.HEIGHT };
      let heightPromise = getDetectionList(taxCode, notebookId, {
        params: heightParams
      });

      let weightParams = { ...params, descrittore: DESCRIPTOR_CODE_MAP.WEIGHT };
      let weightPromise = getDetectionList(taxCode, notebookId, {
        params: weightParams
      });

      let circumferenceParams = {
        ...params,
        descrittore: DESCRIPTOR_CODE_MAP.WAIST_CIRC
      };
      let circumferencePromise = getDetectionList(taxCode, notebookId, {
        params: circumferenceParams
      });

      this.isLoading = true;

      try {
        let { data: heightDetectionList } = await heightPromise;
        let { data: weightDetectionList } = await weightPromise;
        let { data: circumferenceDetectionList } = await circumferencePromise;

        this.detectionHeight = heightDetectionList?.lista?.[0];
        this.detectionWeight = weightDetectionList?.lista?.[0];
        this.detectionCircumference = circumferenceDetectionList?.lista?.[0];

        // let { data } = await getDetectionList(taxCode, notebookId, { params });
        // this.lastDetection = data[0];
      } catch (err) {
        let message =
          "Non è stato possibile caricare le informazioni su peso altezza e circonferenza vita";
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
      this.$router.push(DETECTION_MEASURES);
    }
  }
};
</script>

<style scoped lang="sass"></style>
