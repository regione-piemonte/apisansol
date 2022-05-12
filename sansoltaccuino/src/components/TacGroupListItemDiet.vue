<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="tac-group-list-item-diet">
    <!-- CARICAMENTO -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <template v-if="isLoading">
      <tac-group-list-item-skeleton />
    </template>

    <!-- RILEVAZIONE CARICATA -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <template v-else>
      <tac-group-list-item
        title="Dieta"
        icon="img:/statics/la-mia-salute/icone/dieta.svg"
        addable
        graph
        is-highlighted
        :is-enabled="isEnabled"
        :is-updating="isSaving"
        @update:isEnabled="onIsEnabledUpdate"
        @add="onAdd"
        @graph="onGraphClick"
      >
        <template #text>
          <!-- TESTO STATO VUOTO -->
          <!-- ----------------------------------------------------------------------------------------------------- -->
          <template v-if="!lastDiet">
            Nessuna dieta annotata negli ultimi 10 giorni
          </template>

          <!-- TESTO STATO PIENO -->
          <!-- ----------------------------------------------------------------------------------------------------- -->
          <template v-else>
            <div class="text-caption text-bold">
              {{ date | datetime }}
            </div>

            <template v-if="breakfastKcal">
              <div class="q-mt-md">
                Colazione
                <span class="text-bold">{{ breakfastKcal }}</span> Kcal
                <div class="text-caption">
                  {{ breakfastDescription | empty }}
                </div>
              </div>
            </template>

            <template v-if="lunchKcal">
              <div class="q-mt-md">
                Pranzo <span class="text-bold">{{ lunchKcal }}</span> Kcal
                <div class="text-caption">
                  {{ lunchDescription | empty }}
                </div>
              </div>
            </template>

            <template v-if="dinnerKcal">
              <div class="q-mt-md">
                Cena <span class="text-bold">{{ dinnerKcal }}</span> Kcal
                <div class="text-caption">
                  {{ dinnerDescription | empty }}
                </div>
              </div>
            </template>

            <template v-if="snacksKcal">
              <div class="q-mt-md">
                Spuntini <span class="text-bold">{{ snacksKcal }}</span> Kcal
                <div class="text-caption">
                  {{ snacksDescription | empty }}
                </div>
              </div>
            </template>
          </template>
        </template>
      </tac-group-list-item>
    </template>

    <!-- DIALOGS -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <template v-if="isCreateDialogOpen">
      <tac-diet-create-dialog
        v-model="isCreateDialogOpen"
        @created="loadLastDiet"
      />
    </template>
  </div>
</template>

<script>
import { date } from "quasar";
import TacGroupListItem from "./TacGroupListItem";
import { getPreference } from "../services/business-logic";
import { ENTITY_CODE_MAP } from "../services/config";
import { getDietList, updatePreferenceList } from "../services/api";
import { DIET } from "../router/routes";
import { apiErrorNotify, apiErrorNotifyDialog } from "../services/utils";
import TacGroupListItemSkeleton from "./TacGroupListItemSkeleton";
import TacDietCreateDialog from "./TacDietCreateDialog";

const { subtractFromDate } = date;
const ENTITY_CODE = ENTITY_CODE_MAP.DIET;
const GROUP_CODE = null;

export default {
  name: "TacGroupListItemDiet",
  components: {
    TacDietCreateDialog,
    TacGroupListItemSkeleton,
    TacGroupListItem
  },
  props: {},
  data() {
    return {
      isLoading: false,
      isSaving: false,
      isCreateDialogOpen: false,
      lastDiet: null
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
    breakfastKcal() {
      return this.lastDiet?.colazione_calorie;
    },
    breakfastDescription() {
      return this.lastDiet?.colazione_descrizione;
    },
    lunchKcal() {
      return this.lastDiet?.pranzo_calorie;
    },
    lunchDescription() {
      return this.lastDiet?.pranzo_descrizione;
    },
    dinnerKcal() {
      return this.lastDiet?.cena_calorie;
    },
    dinnerDescription() {
      return this.lastDiet?.cena_descrizione;
    },
    snacksKcal() {
      return this.lastDiet?.spuntini_calorie;
    },
    snacksDescription() {
      return this.lastDiet?.spuntini_descrizione;
    },
    date() {
      return this.lastDiet?.data;
    }
  },
  created() {
    this.loadLastDiet();
  },
  methods: {
    async loadLastDiet() {
      let taxCode = this.$store.getters["getTaxCode"];
      let notebookId = this.notebook?.id;
      let now = new Date();

      let params = {
        offset: 0,
        limit: 1,
        ordinamento: "DESC",
        da: subtractFromDate(now, { days: 10 }),
        a: now
      };

      this.isLoading = true;

      try {
        let { data } = await getDietList(taxCode, notebookId, { params });
        this.lastDiet = data[0];
      } catch (err) {
        let message =
          "Non è stato possibile caricare le informazioni sulla dieta";
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
      this.$router.push(DIET);
    }
  }
};
</script>

<style scoped lang="sass"></style>
