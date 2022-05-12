<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-dialog
    v-bind="attrs"
    v-on="listeners"
    :maximized="$q.screen.lt.md"
    class="fse-tag-associate-dialog"
    @show="onShow"
    @hide="onHide"
  >
    <q-card>
      <q-toolbar>
        <q-toolbar-title>
          Associa etichette
        </q-toolbar-title>

        <q-btn v-close-popup flat round icon="close" aria-label="chiudi finestra" />
      </q-toolbar>

      <!-- ETICHETTE PARTI DEL CORPO -->
      <!-- --------------------------------------------------------------------------------------------------------- -->
      <q-card-section>
        <div class="text-h6 text-bold">
          Etichette relative al corpo umano
        </div>

        <div class="row q-col-gutter-sm q-mt-sm ">
          <div
            v-for="tag in tagListFixed"
            :key="'f--' + tag.id"
            class="col-auto"
          >
            <fse-tag-chip
              :selected="isTagFixedSelected(tag)"
              clickable
              @click="onSelectFixed(tag)"
            >
              {{ tag.testo }}
            </fse-tag-chip>
          </div>
        </div>
      </q-card-section>

      <!-- ETICHETTE PERSONALI -->
      <!-- --------------------------------------------------------------------------------------------------------- -->
      <q-card-section>
        <div class="text-h6 text-bold">
          Etichette personali
        </div>

        <div class="row q-col-gutter-sm q-mt-xs">
          <div
            v-for="tag in tagListPersonal"
            :key="'p--' + tag.id"
            class="col-auto"
          >
            <fse-tag-chip
              :selected="isTagPersonalSelected(tag)"
              clickable
              @click="onSelectPersonal(tag)"
            >
              {{ tag.testo }}
            </fse-tag-chip>
          </div>
        </div>
      </q-card-section>

      <!-- AZIONI -->
      <!-- --------------------------------------------------------------------------------------------------------- -->
      <q-card-section>
        <div class="row items-center q-col-gutter-md">
          <div class="col-12 col-sm">
            <a href="#" class="lms-link" @click.prevent="onTagCreate">
              Nuova etichetta
            </a>
          </div>

          <div class="col-12 col-sm">
            <lms-buttons>
              <lms-button :loading="isSaving" @click="onAssociate">
                Salva
              </lms-button>
            </lms-buttons>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- DIALOGS -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <fse-tag-create-dialog
      v-model="isTagCreateDialogVisible"
      @created="onTagCreated"
    />
  </q-dialog>
</template>

<script>
import { associateTag } from "../services/api";
import {
  apiErrorNotifyDialog,
  notifySuccess,
  orderBy
} from "../services/utils";
import {
  DOCUMENT_CATEGORY_MAP,
  TAG_OPERATION_TYPE_CODE_MAP,
  TAG_TYPE_MAP
} from "../services/config";
import FseTagChip from "./FseTagChip";
import FseTagCreateDialog from "./FseTagCreateDialog";

export default {
  name: "FseTagAssociateDialog",
  inheritAttrs: false,
  components: { FseTagCreateDialog, FseTagChip },
  props: {
    document: { type: Object, required: false, default: () => null }
  },
  data() {
    return {
      isSaving: false,
      isTagCreateDialogVisible: false,
      tagFixedSelectedCode: null,
      tagPersonalListSelectedCode: []
    };
  },
  computed: {
    attrs() {
      const { ...attrs } = this.$attrs;
      return attrs;
    },
    listeners() {
      const { ...listeners } = this.$listeners;
      return listeners;
    },
    user() {
      return this.$store.getters["getUser"];
    },
    tagList() {
      return this.$store.getters["getTagList"];
    },
    tagListSorted() {
      return orderBy(this.tagList, ["testo"]);
    },
    tagListFixed() {
      return this.tagListSorted.filter(
        t => t.tipologia_etichetta === TAG_TYPE_MAP.FIXED
      );
    },
    tagListPersonal() {
      return this.tagListSorted.filter(
        t => t.tipologia_etichetta === TAG_TYPE_MAP.PERSONAL
      );
    },
    tagFixedSelected() {
      return this.tagListFixed.find(t => this.isTagFixedSelected(t));
    },
    tagPersonalListSelected() {
      return this.tagListPersonal.filter(t => this.isTagPersonalSelected(t));
    },
    documentTagFixedCode() {
      return this.document?.etichetta_anatomica?.id;
    },
    documentTagPersonalListCode() {
      let tagPersonalList = this.document?.etichette_personali ?? [];
      return tagPersonalList.map(t => t.id);
    },
    isPersonal() {
      return this.document?.categoria === DOCUMENT_CATEGORY_MAP.PERSONAL;
    }
  },
  created() {},
  methods: {
    // All'apertura della modale preimpostiamo le etichette selezionate
    // sul documento
    onShow() {
      this.tagFixedSelectedCode = this.documentTagFixedCode;
      this.tagPersonalListSelectedCode = this.documentTagPersonalListCode;
    },
    // Alla chiusura della modale resettiamo tutte le etichette
    onHide() {
      this.tagFixedSelectedCode = null;
      this.tagPersonalListSelectedCode = [];
    },
    onTagCreate() {
      this.isTagCreateDialogVisible = true;
    },
    onTagCreated(tag) {
      let tagList = [...this.tagList, tag];
      this.$store.dispatch("setTagList", { tagList });
    },
    isTagFixedSelected(tag) {
      return tag.id === this.tagFixedSelectedCode;
    },
    onSelectFixed(tag) {
      let isSelected = this.isTagFixedSelected(tag);
      this.tagFixedSelectedCode = isSelected ? null : tag.id;
    },
    isTagPersonalSelected(tag) {
      return this.tagPersonalListSelectedCode.includes(tag.id);
    },
    onSelectPersonal(tag) {
      let isSelected = this.isTagPersonalSelected(tag);

      if (isSelected) {
        this.tagPersonalListSelectedCode = this.tagPersonalListSelectedCode.filter(
          c => c !== tag.id
        );
      } else {
        this.tagPersonalListSelectedCode = [
          ...this.tagPersonalListSelectedCode,
          tag.id
        ];
      }
    },
    async onAssociate() {
      let taxCode = this.$store.getters["getTaxCode"];
      let documentId = this.document?.id_documento_ilec;

      let payloadDelete = {
        categoria: this.document?.categoria,
        id_tag_fisso: this.documentTagFixedCode,
        lista_id_etichette: this.documentTagPersonalListCode,
        tipo_operazione: TAG_OPERATION_TYPE_CODE_MAP.REMOVE
      };

      let payloadCreate = {
        categoria: this.document?.categoria,
        id_tag_fisso: this.tagFixedSelectedCode,
        lista_id_etichette: this.tagPersonalListSelectedCode,
        tipo_operazione: TAG_OPERATION_TYPE_CODE_MAP.ADD
      };

      // Indica se è necessario disassociare le vecchie etichette
      let mustDelete =
        payloadDelete.id_tag_fisso ||
        payloadDelete.lista_id_etichette.length > 0;

      // Indica se è necessario associare delle nuove etichette
      let mustCrete =
        payloadCreate.id_tag_fisso ||
        payloadCreate.lista_id_etichette.length > 0;

      // I documenti personali, cioè quelli caricati in maniera autonoma,
      // non richiedono il codice cl nel payload
      if (!this.isPersonal) {
        payloadDelete.codice_cl = this.document?.codice_cl;
        payloadCreate.codice_cl = this.document?.codice_cl;
      }

      this.isSaving = true;

      // Prima disassociamo tutte le attuali etichette
      // Poi associamo le nuove etichette selezionate

      // Eseguiamo la cancellazione delle etichette attuali solo se il documento ha almeno
      // un'etichetta associata
      if (mustDelete) {
        try {
          let { data } = await associateTag(taxCode, documentId, payloadDelete);
        } catch (error) {
          let message = "Non è stato possibile aggiornare le etichette";
          apiErrorNotifyDialog({ error, message });
          this.isSaving = false;
          return;
        }
      }

      // Eseguiamo l'associazione delle nuove etichette solo se l'utente ha selezionato
      // almeno un'etichetta
      if (mustCrete) {
        try {
          let { data } = await associateTag(taxCode, documentId, payloadCreate);
        } catch (error) {
          let message = "Non è stato possibile aggiornare le etichette";
          apiErrorNotifyDialog({ error, message });
          this.isSaving = false;
          return;
        }
      }

      this.$emit("input", false);
      this.$emit("associated", {
        tagFixed: this.tagFixedSelected,
        tagPersonalList: this.tagPersonalListSelected
      });
      notifySuccess("Etichette modificate");

      this.isSaving = false;
    }
  }
};
</script>

<style scoped lang="sass"></style>
