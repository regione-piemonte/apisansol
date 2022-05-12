<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="tac-group-list-item-drug">
    <!-- CARICAMENTO -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <template v-if="isLoading">
      <tac-group-list-item-skeleton />
    </template>

    <!-- RILEVAZIONE CARICATA -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <template v-else>
      <tac-group-list-item
        title="Farmaci"
        icon="img:/statics/la-mia-salute/icone/farmaci.svg"
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
          <template v-if="!lastDrug">
            Nessun farmaco annotato negli ultimi 10 giorni
          </template>

          <!-- TESTO STATO PIENO -->
          <!-- ----------------------------------------------------------------------------------------------------- -->
          <template v-else>
            <div class="text-caption text-bold">
              {{ date | datetime }}
            </div>

            <div class="q-mt-md">
              <div>Farmaco:</div>
              <div class="text-bold">
                {{ drug | empty }}
              </div>
            </div>

            <div class="q-mt-md">
              <div>Quantità:</div>
              <div class="text-bold">
                {{ amount | empty }}
              </div>
            </div>
          </template>
        </template>
      </tac-group-list-item>
    </template>

    <!-- DIALOGS -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <template v-if="isCreateDialogOpen">
      <tac-drug-create-dialog
        v-model="isCreateDialogOpen"
        @created="loadLastDrug"
      />
    </template>
  </div>
</template>

<script>
import TacGroupListItem from "./TacGroupListItem";
import { getPreference } from "../services/business-logic";
import { ENTITY_CODE_MAP } from "../services/config";
import { getDrugList, updatePreferenceList } from "../services/api";
import { DRUG } from "../router/routes";
import { apiErrorNotify, apiErrorNotifyDialog } from "../services/utils";
import TacGroupListItemSkeleton from "./TacGroupListItemSkeleton";
import TacDrugCreateDialog from "./TacDrugCreateDialog";
import { date } from "quasar";

const { subtractFromDate } = date;

const ENTITY_CODE = ENTITY_CODE_MAP.DRUGS;
const GROUP_CODE = null;

export default {
  name: "TacGroupListItemDrug",
  components: {
    TacDrugCreateDialog,
    TacGroupListItemSkeleton,
    TacGroupListItem
  },
  props: {},
  data() {
    return {
      isLoading: false,
      isSaving: false,
      isCreateDialogOpen: false,
      lastDrug: null
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
    drug() {
      return this.lastDrug?.farmaco;
    },
    amount() {
      return this.lastDrug?.quantita;
    },
    date() {
      return this.lastDrug?.data_creazione;
    }
  },
  created() {
    this.loadLastDrug();
  },
  methods: {
    async loadLastDrug() {
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
        let { data } = await getDrugList(taxCode, notebookId, { params });
        this.lastDrug = data[0];
      } catch (err) {
        let message =
          "Non è stato possibile caricare le informazioni sui farmaci";
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
      this.$router.push(DRUG);
    }
  }
};
</script>

<style scoped lang="sass"></style>
