<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="tac-group-list-item-temperature">
    <!-- CARICAMENTO -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <template v-if="isLoading">
      <tac-group-list-item-skeleton />
    </template>

    <!-- RILEVAZIONE CARICATA -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <template v-else>
      <tac-group-list-item
        title="Temperatura"
        icon="img:/statics/la-mia-salute/icone/termometro.svg"
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
          <template v-if="!detectionTemperature">
            Nessuna rilevazione negli ultimi 10 giorni
          </template>

          <!-- TESTO STATO PIENO -->
          <!-- ----------------------------------------------------------------------------------------------------- -->
          <template v-else>
            <div class="text-caption text-bold">
              {{ date | datetime }}
            </div>
            <!--            <div class="text-caption">-->
            <!--              {{ detectionModeLabel }}-->
            <!--            </div>-->

            <div>
              Temperatura
              <span class="text-bold">{{
                temperature | decimals | number
              }}</span>
              {{ temperatureMeasure }}
            </div>
          </template>
        </template>
      </tac-group-list-item>
    </template>

    <!-- DIALOGS -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <template v-if="isCreateDialogOpen">
      <tac-detection-temperature-create-dialog
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
import { DETECTION_TEMPERATURE } from "../router/routes";
import { apiErrorNotify, apiErrorNotifyDialog } from "../services/utils";
import TacDetectionTemperatureCreateDialog from "./TacDetectionTemperatureCreateDialog";
import TacGroupListItemSkeleton from "./TacGroupListItemSkeleton";
import { date } from "quasar";

const { subtractFromDate } = date;

const ENTITY_CODE = ENTITY_CODE_MAP.DETECTION;
const GROUP_CODE = GROUP_CODE_MAP.TEMPERATURE;

export default {
  name: "TacGroupListItemTemperature",
  components: {
    TacGroupListItemSkeleton,
    TacDetectionTemperatureCreateDialog,
    TacGroupListItem
  },
  props: {},
  data() {
    return {
      isLoading: false,
      isSaving: false,
      isCreateDialogOpen: false,
      lastDetection: null,
      detectionTemperature: null
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
      return this.detectionTemperature?.modalita?.descrizione_nazionale;
    },
    date() {
      return this.detectionTemperature?.data;
    },
    temperature() {
      return this.detectionTemperature?.valore_numerico;
    },
    temperatureMeasure() {
      return this.detectionTemperature?.unita_misura_codice;
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

        this.detectionTemperature = tempDetectionList?.lista?.[0];

        // let { data } = await getDetectionList(taxCode, notebookId, { params });
        // this.lastDetection = data[0];
      } catch (err) {
        let message =
          "Non è stato possibile caricare le informazioni sulla temperatura";
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
      this.$router.push(DETECTION_TEMPERATURE);
    }
  }
};
</script>

<style scoped lang="sass"></style>
