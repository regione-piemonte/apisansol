<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="tac-group-list-item-oxymetry">
    <!-- CARICAMENTO -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <template v-if="isLoading">
      <tac-group-list-item-skeleton />
    </template>

    <!-- RILEVAZIONE CARICATA -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <template v-else>
      <tac-group-list-item
        title="Ossimetria"
        icon="img:/statics/la-mia-salute/icone/vertebre.svg"
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
          <template v-if="!detectionOxymetry">
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
              <span class="text-bold">{{ oxymetry | decimals | number }}</span>
              {{ oxymetryMeasure }}
            </div>
          </template>
        </template>
      </tac-group-list-item>
    </template>

    <!-- DIALOGS -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <template v-if="isCreateDialogOpen">
      <tac-detection-oxymetry-create-dialog
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
import { DETECTION_OXYMETRY } from "../router/routes";
import { apiErrorNotify, apiErrorNotifyDialog } from "../services/utils";
import TacDetectionOxymetryCreateDialog from "./TacDetectionOxymetryCreateDialog";
import TacGroupListItemSkeleton from "./TacGroupListItemSkeleton";
import { date } from "quasar";

const { subtractFromDate } = date;

const ENTITY_CODE = ENTITY_CODE_MAP.DETECTION;
const GROUP_CODE = GROUP_CODE_MAP.OXYMETRY;

export default {
  name: "TacGroupListItemOxymetry",
  components: {
    TacGroupListItemSkeleton,
    TacDetectionOxymetryCreateDialog,
    TacGroupListItem
  },
  props: {},
  data() {
    return {
      isLoading: false,
      isSaving: false,
      isCreateDialogOpen: false,
      lastDetection: null,
      detectionOxymetry: null
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
    // detectionList() {
    //   return this.lastDetection?.lista ?? [];
    // },
    // detectionOxymetry() {
    //   return this.detectionList.find(
    //     d => d.descrittore_codice === DESCRIPTOR_CODE_MAP.OXYMETRY
    //   );
    // },
    detectionModeLabel() {
      return this.detectionOxymetry?.modalita?.descrizione_nazionale;
    },
    date() {
      return this.detectionOxymetry?.data;
    },
    oxymetry() {
      return this.detectionOxymetry?.valore_numerico;
    },
    oxymetryMeasure() {
      return this.detectionOxymetry?.unita_misura_codice;
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

      let oxymetryParams = {
        ...params,
        descrittore: DESCRIPTOR_CODE_MAP.OXYMETRY
      };
      let oxymetryPromise = getDetectionList(taxCode, notebookId, {
        params: oxymetryParams
      });

      this.isLoading = true;

      try {
        let { data: oxymetryDetectionList } = await oxymetryPromise;

        this.detectionOxymetry = oxymetryDetectionList?.lista?.[0];

        // let { data } = await getDetectionList(taxCode, notebookId, { params });
        // this.lastDetection = data[0];
      } catch (err) {
        let message =
          "Non è stato possibile caricare le informazioni sull'ossimetria";
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
      this.$router.push(DETECTION_OXYMETRY);
    }
  }
};
</script>

<style scoped lang="sass"></style>
