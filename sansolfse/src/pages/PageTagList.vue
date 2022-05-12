<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <lms-page padding>
    <div class="row q-col-gutter-x-md">
      <div class="col">
        <lms-page-title @back="onBack">
          Gestisci etichette
        </lms-page-title>
      </div>

      <div class="col-auto">
        <lms-button @click="onTagCreate">Nuova etichetta</lms-button>
      </div>
    </div>

    <q-card class="q-mt-lg">
      <q-card-section>
        <div class="row q-col-gutter-md">
          <!-- ETICHETTE PERSONALI -->
          <!-- ----------------------------------------------------------------------------------------------------- -->
          <div class="col-12 col-md">
            <div class="text-h6 text-bold">
              Etichette personalizzate
            </div>

            <div class="q-mt-lg q-gutter-y-sm">
              <div
                v-for="tag in tagListPersonal"
                :key="tag.id"
                class="fse-list-item--table"
              >
                <div class="fse-list-item__section q-py-xs q-pr-md">
                  <fse-tag-chip>
                    {{ tag.testo }}
                  </fse-tag-chip>
                </div>

                <div class="fse-list-item__section">
                  <q-btn
                    flat
                    round
                    icon="fas fa-pen"
                    size="sm"
                    color="blue-10"
                    @click="onTagEdit(tag)"
                    :aria-label="'modifica etichetta ' + tag.testo"
                  />

                  <q-btn
                    flat
                    round
                    icon="fas fa-trash"
                    size="sm"
                    color="red-8"
                    @click="onTagRemove(tag)"
                    :aria-label="'rimuovi etichetta ' +  tag.testo"
                  />
                </div>
              </div>
            </div>
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

    <fse-tag-edit-dialog
      v-model="isTagEditDialogVisible"
      :tag="tagEditable"
      @edited="onTagEdited"
    />

    <fse-tag-remove-dialog
      v-model="isTagRemoveDialogVisible"
      :tag="tagRemovable"
      @removed="onTagRemoved"
    />
  </lms-page>
</template>

<script>
import { DOCUMENT_LIST } from "../router/routes";
import FseTagCreateDialog from "../components/FseTagCreateDialog";
import FseTagEditDialog from "../components/FseTagEditDialog";
import { orderBy } from "../services/utils";
import { TAG_TYPE_MAP } from "../services/config";
import FseTagRemoveDialog from "../components/FseTagRemoveDialog";
import FseTagChip from "../components/FseTagChip";

export default {
  name: "PageTagList",
  components: {
    FseTagChip,
    FseTagRemoveDialog,
    FseTagEditDialog,
    FseTagCreateDialog
  },
  data() {
    return {
      isTagCreateDialogVisible: false,
      isTagEditDialogVisible: false,
      isTagRemoveDialogVisible: false,
      tagEditable: null,
      tagRemovable: null
    };
  },
  computed: {
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
      let result = this.tagListSorted.filter(
        t => t.tipologia_etichetta === TAG_TYPE_MAP.PERSONAL
      );

      result = orderBy(result, ["testo"], ["asc"]);

      return result;
    }
  },
  async created() {},
  methods: {
    onBack() {
      this.$router.push(DOCUMENT_LIST);
    },
    onTagCreate() {
      this.isTagCreateDialogVisible = true;
    },
    onTagCreated(tag) {
      let tagList = [...this.tagList, tag];
      this.$store.dispatch("setTagList", { tagList });
    },
    onTagEdit(tag) {
      this.tagEditable = tag;
      this.isTagEditDialogVisible = true;
    },
    onTagEdited(tag) {
      let tagList = this.tagList.map(t =>
        t.id === tag.id && t.tipologia_etichetta === tag.tipologia_etichetta
          ? tag
          : t
      );

      this.$store.dispatch("setTagList", { tagList });
    },
    onTagRemove(tag) {
      this.tagRemovable = tag;
      this.isTagRemoveDialogVisible = true;
    },
    onTagRemoved(tag) {
      let tagList = this.tagList.filter(t => t.id !== tag?.id);
      this.$store.dispatch("setTagList", { tagList });
    }
  }
};
</script>

<style lang="scss">
.fse-list-item--table {
  display: table-row;

  .fse-list-item__section {
    display: table-cell;
  }
}
</style>
