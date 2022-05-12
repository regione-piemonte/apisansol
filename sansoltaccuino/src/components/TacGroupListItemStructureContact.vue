<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="tac-group-list-item-structure-contact">
    <!-- CARICAMENTO -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <template v-if="isLoading">
      <tac-group-list-item-skeleton />
    </template>

    <!-- RILEVAZIONE CARICATA -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <template v-else>
      <tac-group-list-item
        title="Contatti con le strutture"
        icon="img:/statics/la-mia-salute/icone/contatti-con-strutture.svg"
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
          <template v-if="!lastStructureContact">
            Nessun contatto con le strutture negli ultimi 10 giorni
          </template>

          <!-- TESTO STATO PIENO -->
          <!-- ----------------------------------------------------------------------------------------------------- -->
          <template v-else>
            <div class="text-caption text-bold">
              {{ date | datetime }}
            </div>

            <div class="q-mt-md">
              {{ structureName }}
            </div>
            <div class="q-mt-xs">
              In <span class="text-bold">{{ structureTypeLabel }}</span>
            </div>
            <div class="q-mt-xs">
              Per <span class="text-bold">{{ contactTypeLabel }}</span>
            </div>
          </template>
        </template>
      </tac-group-list-item>
    </template>

    <!-- DIALOGS -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <template v-if="isCreateDialogOpen">
      <tac-structure-contact-create-dialog
        v-model="isCreateDialogOpen"
        @created="loadLastStructureContact"
      />
    </template>
  </div>
</template>

<script>
import TacGroupListItem from "./TacGroupListItem";
import { getPreference } from "../services/business-logic";
import { ENTITY_CODE_MAP, STRUCTURE_TYPE_CODE_MAP } from "../services/config";
import { getStructureContactList, updatePreferenceList } from "../services/api";
import { STRUCTURE_CONTACT } from "../router/routes";
import { apiErrorNotify, apiErrorNotifyDialog } from "../services/utils";
import TacGroupListItemSkeleton from "./TacGroupListItemSkeleton";
import TacStructureContactCreateDialog from "./TacStructureContactCreateDialog";
import { date } from "quasar";

const { subtractFromDate } = date;

const ENTITY_CODE = ENTITY_CODE_MAP.STRUCTURE_CONTACT;
const GROUP_CODE = null;

export default {
  name: "TacGroupListItemStructureContact",
  components: {
    TacStructureContactCreateDialog,
    TacGroupListItemSkeleton,
    TacGroupListItem
  },
  props: {},
  data() {
    return {
      isLoading: false,
      isSaving: false,
      isCreateDialogOpen: false,
      lastStructureContact: null
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
    structureName() {
      return this.lastStructureContact?.denominazione;
    },
    structureTypeLabel() {
      return this.lastStructureContact?.struttura_tipo?.descrizione;
    },
    contactTypeLabel() {
      let typeCode = this.lastStructureContact?.struttura_tipo_codice;
      if (typeCode === STRUCTURE_TYPE_CODE_MAP.NO_CONVENTIONAL) {
        return this.lastStructureContact
          ?.medicina_non_convenzionale_tipo_contatto;
      }

      return this.lastStructureContact?.tipo_contatto?.descrizione;
    },
    date() {
      return this.lastStructureContact?.data_creazione;
    }
  },
  created() {
    this.loadLastStructureContact();
  },
  methods: {
    async loadLastStructureContact() {
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
        let { data } = await getStructureContactList(taxCode, notebookId, {
          params
        });
        this.lastStructureContact = data[0];
      } catch (err) {
        let message =
          "Non è stato possibile caricare le informazioni sui contatti con le strutture";
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
      this.$router.push(STRUCTURE_CONTACT);
    }
  }
};
</script>

<style scoped lang="sass"></style>
