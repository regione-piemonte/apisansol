<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="tac-group-list-item-insulin">
    <!-- CARICAMENTO -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <template v-if="isLoading">
      <tac-group-list-item-skeleton />
    </template>

    <!-- RILEVAZIONE CARICATA -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <template v-else>
      <tac-group-list-item
        title="Insulina"
        icon="img:/statics/la-mia-salute/icone/siringa.svg"
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
          <template v-if="!detectionInsulin && !detectionInsulinFarm">
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

            <template v-if="detectionInsulin">
              <div>
                Insulina
                <span class="text-bold">{{ insulin | decimals | number }}</span>
                {{ insulinMeasure }}
              </div>
            </template>

            <template v-if="detectionInsulinFarm">
              <div class="q-mt-md">
                Farmaco <br />
                <span class="text-bold">{{ insulinFarm }}</span>
                <!--                {{ insulinFarmMeasure }}-->
              </div>
            </template>
          </template>
        </template>
      </tac-group-list-item>
    </template>

    <!-- DIALOGS -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <template v-if="isCreateDialogOpen">
      <tac-detection-insulin-create-dialog
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
import { DETECTION_INSULIN } from "../router/routes";
import { apiErrorNotify, apiErrorNotifyDialog } from "../services/utils";
import TacDetectionInsulinCreateDialog from "./TacDetectionInsulinCreateDialog";
import TacGroupListItemSkeleton from "./TacGroupListItemSkeleton";
import { date } from "quasar";

const { subtractFromDate } = date;

const ENTITY_CODE = ENTITY_CODE_MAP.DETECTION;
const GROUP_CODE = GROUP_CODE_MAP.INSULIN;

export default {
  name: "TacGroupListItemInsulin",
  components: {
    TacGroupListItemSkeleton,
    TacDetectionInsulinCreateDialog,
    TacGroupListItem
  },
  props: {},
  data() {
    return {
      isLoading: false,
      isSaving: false,
      isCreateDialogOpen: false,
      lastDetection: null,
      detectionInsulin: null,
      detectionInsulinFarm: null
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
      return this.detectionInsulin?.modalita?.descrizione_nazionale;
    },
    date() {
      return this.detectionInsulin?.data || this.detectionInsulinFarm?.data;
    },
    insulin() {
      return this.detectionInsulin?.valore_numerico;
    },
    insulinMeasure() {
      return this.detectionInsulin?.unita_misura_codice;
    },
    insulinFarm() {
      return this.detectionInsulinFarm?.valore_testuale;
    }
    // insulinFarmMeasure() {
    //   return this.detectionInsulinFarm?.unita_misura_codice;
    // }
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

        this.detectionInsulin = insulinDetectionList?.lista?.[0];
        this.detectionInsulinFarm = insulinFarmDetectionList?.lista?.[0];

        // let { data } = await getDetectionList(taxCode, notebookId, { params });
        // this.lastDetection = data[0];
      } catch (err) {
        let message =
          "Non è stato possibile caricare le informazioni sull'insulina";
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
      this.$router.push(DETECTION_INSULIN);
    }
  }
};
</script>

<style scoped lang="sass"></style>
