<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <lms-page padding>

    <template v-if="!isEnrollmentCodeBlocker">
      <!-- ALTRI DOCUMENTI -->
      <!-- ----------------------------------------------------------------------------------------------------------- -->
      <template v-if="canSeeDocumentFseList">
        <q-expansion-item
          class="q-mt-lg"
          default-opened
          header-class="q-pl-none"
        >
          <template #header>
            <q-item-section class="text-bold">
              <div class="row items-center">
                <div class="inline-block q-mr-sm">
                  Referti/Documenti da consultare
                </div>

                <!-- VISUALIZZAZIONE CONTEGGI PER EPISODIO -->
                <template v-if="viewSelected === VIEW_MAP.EPISODE">
                  <template v-if="episodeList && counts">
                    <q-chip color="blue-2" text-color="black">
                      {{ episodeList.length }} episodi su
                      {{ counts.numero_episodi }}
                    </q-chip>
                  </template>
                </template>

                <!-- VISUALIZZAZIONE CONTEGGI PER DOCUMENTO -->
                <template v-else>
                  <template v-if="documentList && counts">
                    <q-chip color="blue-2" text-color="black">
                      {{ documentList.length }} documenti su
                      {{ counts.numero_documenti_totali }}
                    </q-chip>
                  </template>
                </template>
              </div>


            </q-item-section>
          </template>

          <!-- FILTRI -->
          <!-- ------ -->
          <div class="q-mt-md">
            <div class="text-bold text-primary">
              <q-icon class="q-mr-xs" name="fas fa-filter" />
              Filtri
            </div>

            <div class="q-mt-xs row q-col-gutter-lg">
              <div class="col-12 col-md-3">

                <lms-select-multiple
                  v-model="filterDocumentCategoryCodeList"
                  :options="categoryList"
                  dense
                  label="Documenti"
                  option-label="descrizione"
                  option-value="codice"
                  id="select-document-category"
                  emit-value
                >
                </lms-select-multiple>

              </div>

              <div class="col-12 col-md-3">

                <lms-select-multiple
                  v-model="filterDocumentTypeCodeList"
                  :options="documentTypeList"
                  dense
                  label="Tipi di documento"
                  option-label="descrizione"
                  option-value="codice"
                  id="select-document-type"
                  emit-value
                >
                </lms-select-multiple>

              </div>

              <div class="col-12 col-md-3">

                <lms-select-multiple
                  v-model="filterTagCodeList"
                  :options="tagListOptions"
                  dense
                  label="Etichette"
                  option-label="testo"
                  option-value="codice"
                  id="select-tag-code"

                >
                </lms-select-multiple>



              </div>

              <div class="col-12 col-md-3">

                <lms-select
                  v-model="filterEpisodeTypeCode"
                  :loading="isLoadingEpisodeTypeList"
                  :options="episodeTypeList"
                  clearable
                  dense
                  emit-value
                  label="Episodio clinico"
                  map-options
                  option-label="descrizione"
                  option-value="codice"
                  id="select-episode-type"
                >

                </lms-select>

              </div>

              <div class="col-12 col-md-3">
                <q-input
                  v-model="filterStartDate"
                  dense
                  label="Da"
                  stack-label
                  type="date"
                />
              </div>

              <div class="col-12 col-md-3">
                <q-input
                  v-model="filterEndDate"
                  dense
                  label="A"
                  stack-label
                  type="date"
                />
              </div>

              <div class="col-12 col-md">
                <lms-buttons>
                  <lms-button
                    :loading="isLoadingDocumentList"
                    no-min-width
                    outline
                    @click="onDocumentListFilter"
                  >
                    Filtra
                  </lms-button>
                </lms-buttons>
              </div>
            </div>
          </div>

          <div class="q-my-lg">
            <q-separator />
          </div>

          <!-- VISUALIZZAZIONI + AZIONI -->
          <!-- ------------------------ -->
          <div
            :class="{ reverse: $q.screen.gt.xs }"
            class="row q-col-gutter-lg"
          >
            <div class="col-12 col-sm-auto">
              <lms-buttons class="q-gutter-x-md">
                <lms-button :to="DOCUMENT_CREATE" no-min-width>
                  Carica documento
                </lms-button>

                <lms-button :to="TAG_LIST" no-min-width outline>
                  Gestisci etichette
                </lms-button>
              </lms-buttons>
            </div>

            <div class="col-12 col-sm q-gutter-x-sm">
              <q-btn
                :color="viewSelected === VIEW_MAP.LIST ? 'primary' : null"
                flat
                icon="fas fa-list"
                round
                @click="viewSelected = VIEW_MAP.LIST"
              >
                <q-tooltip>
                  Visualizzazione per documenti
                </q-tooltip>
              </q-btn>

              <template v-if="$q.screen.gt.lg">
                <q-btn
                  :color="viewSelected === VIEW_MAP.BODY ? 'primary' : null"
                  flat
                  icon="fas fa-male"
                  round
                  @click="viewSelected = VIEW_MAP.BODY"
                >
                  <q-tooltip>
                    Visualizzazione per sede anatomica
                  </q-tooltip>
                </q-btn>
              </template>

              <q-btn
                :color="viewSelected === VIEW_MAP.EPISODE ? 'primary' : null"
                flat
                icon="far fa-folder-open"
                round
                @click="onEpisodeViewSelected"
              >
                <q-tooltip>
                  Visualizzazione per episodi
                </q-tooltip>
              </q-btn>
            </div>
          </div>

          <!-- LISTA ALTRI DOCUMENTI -->
          <!-- --------------------- -->
          <template v-if="viewSelected === VIEW_MAP.LIST">
            <template v-if="!isLoadingDocumentList && documentList.length <= 0">
              <fse-document-list-empty-banner class="q-mt-xl" />
            </template>

            <template v-else>
              <div class="q-mt-xl q-gutter-y-md">
                <template v-if="isLoadingDocumentList">
                  <q-card v-for="i in 10" :key="'list-skeleton--' + i">
                    <fse-document-item-skeleton />
                  </q-card>
                </template>

                <template v-else>
                  <q-card
                    v-for="document in documentList"
                    :key="'list--' + document.id_documento_ilec"
                  >
                    <fse-document-item
                      :document="document"
                      actions
                      associated-link
                      detail-link
                      more-actions
                      @removed="onDocumentRemoved(document)"
                      @tag-click="onDocumentFseTagClick(document, $event)"
                      @tag-associated="onTagsAssociated(document, $event)"
                      @visibility-changed="
                        onDocumentVisibilityChanged(document)
                      "
                      @exemption-visibility-changed="
                        onExemptionVisibilityChanged(document)
                      "
                      @image-booked="onImageBookedFse"
                    />
                  </q-card>

                  <template v-if="hasMoreDocuments">
                    <div class="q-mt-md text-center">
                      <q-btn
                        :loading="isLoadingDocumentListMore"
                        dense
                        flat
                        @click="loadDocumentListMore"
                      >
                        Carica altri documenti
                      </q-btn>
                    </div>
                  </template>
                </template>
              </div>
            </template>
          </template>

          <!-- LISTA ALTRI DOCUMENTI VISUALIZZAZIONE CORPO -->
          <!-- ------------------------------------------- -->
          <template
            v-else-if="viewSelected === VIEW_MAP.BODY && $q.screen.gt.lg"
          >
            <template v-if="!isLoadingDocumentList && documentList.length <= 0">
              <fse-document-list-empty-banner class="q-mt-xl" />
            </template>

            <template v-else>
              <div class="q-mt-xl row q-col-gutter-md">
                <div class="col-4">
                  <q-card class="fse-sticky q-py-md">
                    <fse-body
                      :tag-counts="countsTagFixed"
                      :tag-list="tagList"
                      @drop="onDrop"
                      @section-click="onBodySectionClick"
                    />
                  </q-card>
                </div>

                <div class="col q-gutter-y-md">
                  <template v-if="isLoadingDocumentList">
                    <q-card v-for="i in 10" :key="'list-skeleton--' + i">
                      <fse-document-item-skeleton />
                    </q-card>
                  </template>

                  <template v-else>
                    <q-card
                      v-for="document in documentList"
                      :key="'body-item--' + document.id_documento_ilec"
                    >
                      <fse-document-item
                        :document="document"
                        actions
                        associated-link
                        detail-link
                        draggable
                        more-actions
                        @dragstart="onDragStart($event, document)"
                        @removed="onDocumentRemoved(document)"
                        @tag-click="onDocumentFseTagClick(document, $event)"
                        @tag-associated="onTagsAssociated(document, $event)"
                        @visibility-changed="
                          onDocumentVisibilityChanged(document)
                        "
                        @image-booked="onImageBookedFse"
                      />
                    </q-card>

                    <template v-if="hasMoreDocuments">
                      <div class="q-mt-md text-center">
                        <q-btn
                          :loading="isLoadingDocumentListMore"
                          dense
                          flat
                          @click="loadDocumentListMore"
                        >
                          Carica altri documenti
                        </q-btn>
                      </div>
                    </template>
                  </template>
                </div>
              </div>
            </template>
          </template>

          <!-- LISTA ALTRI DOCUMENTI RAGGRUPPATI PER EPISODIO -->
          <!-- ---------------------------------------------- -->
          <template v-if="viewSelected === VIEW_MAP.EPISODE">
            <div class="q-mt-xl q-gutter-y-md">
              <template v-if="isLoadingEpisodeList">
                <lms-inner-loading :showing="true" block />
              </template>

              <template v-else-if="episodeList.length <= 0">
                <fse-document-list-empty-banner class="q-mt-xl" />
              </template>

              <template v-else>
                <q-card
                  v-for="episode in episodeList"
                  :key="'episode-container--' + episode.id_episodio"
                  flat
                >
                  <q-expansion-item
                    group="episode-list"
                    @before-show="loadEpisodeDocumentList(episode)"
                  >
                    <template #header>
                      <q-item-section>
                        {{ episode.id_episodio }}

                        <template
                          v-if="
                            episode.descrizione_unita_operativa_accettazione
                          "
                        >
                          {{ episode.descrizione_unita_operativa_accettazione }}
                          -
                        </template>

                        <template
                          v-if="episode.descrizione_struttura_accettazione"
                        >
                          {{ episode.descrizione_struttura_accettazione }}
                        </template>

                        <template v-if="episode.azienda_accettazione">
                          ({{ episode.azienda_accettazione.descrizione }}),
                        </template>

                        {{ episode.data_inizio | date }}
                      </q-item-section>
                    </template>

                    <div class="q-pa-md q-gutter-y-md no-margin">
                      <template v-if="isLoadingEpisodeDocumentList">
                        <lms-inner-loading :showing="true" block />
                      </template>

                      <template v-else>
                        <q-card
                          v-for="document in episodeDocumentList"
                          :key="
                            'episode-container-item--' +
                              document.id_documento_ilec
                          "
                        >
                          <fse-document-item
                            :document="document"
                            actions
                            associated-link
                            detail-link
                            more-actions
                            @removed="onDocumentRemoved(document)"
                            @tag-click="onDocumentFseTagClick(document, $event)"
                            @tag-associated="onTagsAssociated(document, $event)"
                            @visibility-changed="
                              onDocumentVisibilityChanged(document)
                            "
                            @image-booked="onImageBookedFse"
                          />
                        </q-card>
                      </template>
                    </div>
                  </q-expansion-item>
                </q-card>

                <template v-if="hasMoreEpisodes">
                  <div class="q-mt-md text-center">
                    <q-btn
                      :loading="isLoadingEpisodeListMore"
                      dense
                      flat
                      @click="loadEpisodeListMore"
                    >
                      Carica altri episodi
                    </q-btn>
                  </div>
                </template>
              </template>
            </div>
          </template>
        </q-expansion-item>
      </template>
    </template>
  </lms-page>
</template>

<script>
import FseRolItem from "../components/FseRolItem";
import FseDocumentItem from "../components/FseDocumentItem";
import {
  apiErrorNotifyDialog,
  notifySuccess,
  orderBy,
  uniqueElementsBy
} from "../services/utils";
import {
  associateTag,
  getEpisodeDocumentList,
  getEpisodeTypeList,
  getExceptions,
  searchDocumentCounts,
  searchDocumentList,
  searchEpisodeList
} from "../services/api";
import { DOCUMENT_CREATE, TAG_LIST } from "../router/routes";
import { date } from "quasar";
import {
  APP_CODE_MAP,
  DOCUMENT_CATEGORY_MAP,
  DOCUMENT_COUNTS_TYPE_MAP,
  TAG_FIXED_ID_LIST_OTHER,
  TAG_OPERATION_TYPE_CODE_MAP,
  TAG_TYPE_MAP
} from "../services/config";
import FseDocumentItemSkeleton from "../components/FseDocumentItemSkeleton";
import FseDocumentListEmptyBanner from "../components/FseDocumentListEmptyBanner";
import FseRolItemSkeleton from "../components/FseRolItemSkeleton";
import FseRolListEmptyBanner from "../components/FseRolListEmptyBanner";
import FseMessageList from "../components/FseMessageList";
import { isPersonalFse } from "../services/business-logic";
import FseBody from "../components/FseBody";
import TheGuardEnrollment2 from "../components/TheGuardEnrollment2";
import LmsSelect from "components/core/LmsSelect";
import LmsSelectMultiple from "components/core/LmsSelectMultiple";

const { subtractFromDate, formatDate } = date;
const NOW = formatDate(new Date(), "YYYY-MM-DD");
const VIEW_MAP = {
  LIST: "LIST",
  BODY: "BODY",
  EPISODE: "EPISODE"
};

export default {
  name: "PageTestFilters",
  components: {
    LmsSelectMultiple,
    LmsSelect,
    FseBody,
    FseDocumentListEmptyBanner,
    FseDocumentItemSkeleton,
    FseDocumentItem,

  },
  data() {
    return {
      TAG_LIST,
      DOCUMENT_CREATE,
      VIEW_MAP,
      viewSelected: VIEW_MAP.LIST,
      isLoadingRolList: false,
      isLoadingDocumentList: false,
      isLoadingDocumentListMore: false,
      isLoadingCounts: false,
      isLoadingEpisodeList: false,
      isLoadingEpisodeListMore: false,
      isEnrollmentBannerClosed: false,
      isLoadingEpisodeTypeList: false,
      isLoadingEpisodeDocumentList: false,
      episodeTypeList: [],
      documentCreatorList: [],
      filterDocumentCategoryCodeList: [],
      filterDocumentTypeCodeList: [],
      filterTagCodeList: [],
      filterEndDate: NOW,
      filterEpisodeTypeCode: null,
      filterStartDate: "",
      rolList: [],
      documentList: [],
      counts: null,
      episodeList: [],
      episodeDocumentList: [],
      documentListOffset: 0,
      documentListLimit: 10,
      hasMoreDocuments: true,
      episodeListOffset: 0,
      episodeListLimit: 10,
      hasMoreEpisodes: true,
      exemptionInfo: null
    };
  },
  computed: {
    user() {
      return this.$store.getters["getUser"];
    },
    taxCode() {
      return this.$store.getters["getTaxCode"];
    },
    isEnrolled() {
      return this.$store.getters["isEnrolled"];
    },
    isEnrollable() {
      return this.$store.getters["isEnrollable"];
    },
    enrollmentInfo() {
      return this.$store.getters["getEnrollmentInfo"];
    },
    enrollmentConsent() {
      return this.$store.getters["getEnrollmentConsent"];
    },
    activeUserEnrollmentInfo() {
      return this.$store.getters["getActiveUserEnrollmentInfo"];
    },
    tagList() {
      return this.$store.getters["getTagList"];
    },
    categoryList() {
      return this.$store.getters["getCategoryList"];
    },
    canSeeDocumentRolList() {
      return this.$store.getters["canSeeDocumentRolList"];
    },
    canSeeDocumentFseList() {
      return this.$store.getters["canSeeDocumentFseList"];
    },
    tagListFixed() {
      return this.tagList.filter(
        t => t.tipologia_etichetta === TAG_TYPE_MAP.FIXED
      );
    },
    tagListOptions(){
      return this.tagList?.map(tag =>{
        tag.codice= [tag.id, tag.tipologia_etichetta].join("--");
        return tag
      })


    },
    hasEnrollmentConsentData() {
      return !!this.enrollmentConsent;
    },
    isEnrollmentConsentConsultationEnabled() {
      return !!this.enrollmentConsent?.consenso_consultazione;
    },
    documentTypeList() {
      let categoryList = this.categoryList;

      if (this.filterDocumentCategoryCodeList?.length) {
        categoryList = categoryList.filter(c =>
          this.filterDocumentCategoryCodeList.includes(c.codice)
        );
      }

      let result = categoryList.flatMap(c => c.tipi_documento);
      result = uniqueElementsBy(result, (a, b) => a.codice === b.codice);
      result = orderBy(result, ["descrizione"]);
      return result;
    },
    countsTagFixed() {
      let list = this.counts?.etichette_numero_documenti ?? [];
      return list.filter(
        el => el.etichetta?.tipologia_etichetta === TAG_TYPE_MAP.FIXED
      );
    },
    countsTagFixedOther() {
      let list = this.counts?.etichette_numero_documenti ?? [];
      return list.filter(el =>
        TAG_FIXED_ID_LIST_OTHER.includes(el.etichetta?.id)
      );
    },
    isPiedmontUser() {
      return this.$store.getters["isPiedmontUser"];
    },
    enrollmentCode() {
      return this.activeUserEnrollmentInfo?.codice_risposta;
    },
    isEnrollmentCodeBlocker() {
      let BLOCK_CODE_LIST = [
        "000",
        "001",
        "002",
        "004",
        "005",
        "007",
        "010",
        "011",
        "012",
        "013",
        "015"
      ];

      return BLOCK_CODE_LIST.includes(this.enrollmentCode);
    }
  },
  url: {
    filterStartDate: { param: "sd", noHistory: true },
    filterEndDate: { param: "ed", noHistory: true },
    filterDocumentCategoryCodeList: { param: "c", noHistory: true },
    filterDocumentTypeCodeList: { param: "t", noHistory: true },
    filterTagCodeList: { param: "e", noHistory: true }
  },
  async created() {
    let now = new Date();

    if (!this.filterStartDate) {
      // let startDate = subtractFromDate(now, { month: 1 });
      let startDate = subtractFromDate(now, { month: 6 });
      startDate = formatDate(startDate, "YYYY-MM-DD");
      this.filterStartDate = startDate;
    }

    // if (!this.filterEndDate) {
    //   let endDate = now;
    //   endDate = formatDate(endDate, "YYYY-MM-DD");
    //   this.filterEndDate = endDate;
    // }

    // this.loadRolList();

    if (this.canSeeDocumentFseList && this.isEnrolled) {
      await this.loadDocumentListReload();
      this.loadCounts();
    }

    this.loadEpisodeTypeList();
    this.getExemptionInfo();
  },
  methods: {
    async getExemptionInfo() {
      let params = { servizio: APP_CODE_MAP.PATHOLOGY_EXCEPTION };
      try {
        let { data: exemptionInfo } = await getExceptions(this.taxCode, {
          params
        });
        this.$store.dispatch("setExemptionInfo", { exemptionInfo });
      } catch (error) {
        let message =
          "Non è stato possibile caricare le informazioni delle esenzioni per patologie";
        apiErrorNotifyDialog({ error, message });
      }
    },
    getTagListOptionValue(tag) {
      return [tag.id, tag.tipologia_etichetta].join("--");
    },
    async loadEpisodeTypeList() {
      this.isLoadingEpisodeTypeList = true;

      try {
        let { data } = await getEpisodeTypeList();
        this.episodeTypeList = orderBy(data, ["descrizione"]);
      } catch (error) {
        let message =
          "Non è stato possibile caricare l'elenco delle tipologie di episodio";
        apiErrorNotifyDialog({ error, message });
      }

      this.isLoadingEpisodeTypeList = false;
    },
    async loadRolList() {
      let taxCode = this.$store.getters["getTaxCode"];
      let payload = { area: "ROSSA" };

      this.isLoadingRolList = true;

      try {
        let { data } = await searchDocumentList(taxCode, payload);
        this.rolList = data?.documento_area_rossa;
        this.rolList.sort((a, b) => {
          return a.data_emisione >= b.data_emisione ? -1 : 1;
        });
      } catch (error) {
        let message = "Non è stato possibile caricare l'elenco dei referti";
        apiErrorNotifyDialog({ error, message });
      }

      this.isLoadingRolList = false;
    },
    async loadDocumentListReload() {
      this.documentList = [];
      this.documentListOffset = 0;

      this.isLoadingDocumentList = true;

      try {
        await this.loadDocumentList();
      } catch (e) {}

      this.isLoadingDocumentList = false;
    },
    async loadDocumentListMore() {
      this.documentListOffset += this.documentListLimit;

      this.isLoadingDocumentListMore = true;

      try {
        await this.loadDocumentList();
      } catch (e) {}

      this.isLoadingDocumentListMore = false;
    },
    async loadDocumentList() {
      let taxCode = this.$store.getters["getTaxCode"];
      let filterCategory = this.filterDocumentCategoryCodeList;
      let filterType = this.filterDocumentTypeCodeList;
      let filterTag = this.filterTagCodeList?.map(tag =>{
        delete tag?.codice
        return tag
      })

      let typePairList = [];

      this.categoryList.forEach(c => {
        // Se l'utente non ha selezionato categorie => le prendiamo tutte
        // Altrimenti prendiamo solo le categorie selezionate
        if (filterCategory.length > 0 && !filterCategory.includes(c.codice)) {
          return;
        }

        c.tipi_documento.forEach(t => {
          // Se l'utente non ha selezionato tipologie => le prendiamo tutte
          // Altrimenti prendiamo solo le tipologie selezionate
          if (filterType.length > 0 && !filterType.includes(t.codice)) {
            return;
          }

          typePairList.push({ categoria: c.codice, tipologia: t.codice });
        });
      });

      let payload = {
        filtro_docs: {
          categoria_tipologia: typePairList,
          data_inizio: this.filterStartDate,
          data_fine: this.filterEndDate
        }
      };

      // Filtriamo per tipo episodio se selezionato
      if (this.filterEpisodeTypeCode) {
        payload.filtro_docs.tipo_episodio = this.filterEpisodeTypeCode;
      }

      // Calcoliamo i filtri per tag
      let tagFixedList = filterTag.filter(
        t => t.tipologia_etichetta === TAG_TYPE_MAP.FIXED
      );

      let tagPersonalList = filterTag.filter(
        t => t.tipologia_etichetta === TAG_TYPE_MAP.PERSONAL
      );

      if (tagFixedList.length > 0) {
        payload.filtro_docs.etichetta_anatomica = tagFixedList;
      }

      if (tagPersonalList.length > 0) {
        payload.filtro_docs.etichette_personali = tagPersonalList;
      }

      let params = {
        offset: this.documentListOffset,
        limit: this.documentListLimit
      };

      // this.isLoadingDocumentList = true;

      try {
        let { data } = await searchDocumentList(taxCode, payload, { params });
        this.documentList = [...this.documentList, ...data.documenti];
        this.documentList.sort((a, b) => {
          return a.metadati?.data_validazione >= b.metadati?.data_validazione
            ? -1
            : 1;
        });

        // Continuiamo a mostrare il bottone "carica altri" finché le API rispondono con qualche dato
        this.hasMoreDocuments = data.documenti.length >= params.limit;
      } catch (error) {
        let message = "Non è stato possibile caricare l'elenco dei referti";
        apiErrorNotifyDialog({ error, message });
      }

      // this.isLoadingDocumentList = false;
    },
    async loadCounts() {
      let taxCode = this.$store.getters["getTaxCode"];
      let filterCategory = this.filterDocumentCategoryCodeList;
      let filterType = this.filterDocumentTypeCodeList;
      let typePairList = [];

      this.categoryList.forEach(c => {
        // Se l'utente non ha selezionato categorie => le prendiamo tutte
        // Altrimenti prendiamo solo le categorie selezionate
        if (filterCategory.length > 0 && !filterCategory.includes(c.codice)) {
          return;
        }

        c.tipi_documento.forEach(t => {
          // Se l'utente non ha selezionato tipologie => le prendiamo tutte
          // Altrimenti prendiamo solo le tipologie selezionate
          if (filterType.length > 0 && !filterType.includes(t.codice)) {
            return;
          }

          typePairList.push({ categoria: c.codice, tipologia: t.codice });
        });
      });

      let payload = {
        categoria_tipologia: typePairList,
        tipo_conteggio: [
          DOCUMENT_COUNTS_TYPE_MAP.FSE,
          DOCUMENT_COUNTS_TYPE_MAP.EPISODE,
          DOCUMENT_COUNTS_TYPE_MAP.TAG
        ]
      };

      this.isLoadingCounts = true;

      try {
        let { data } = await searchDocumentCounts(taxCode, payload);
        this.counts = data;
      } catch (error) {
        let message =
          "Non è stato possibile caricare il conteggio dei documenti";
        apiErrorNotifyDialog({ error, message });
      }

      this.isLoadingCounts = false;
    },
    async loadEpisodeListReload() {
      this.episodeList = [];
      this.episodeListOffset = 0;

      this.isLoadingEpisodeList = true;

      try {
        await this.loadEpisodeList();
      } catch (e) {}

      this.isLoadingEpisodeList = false;
    },
    async loadEpisodeListMore() {
      this.episodeListOffset += this.episodeListLimit;

      this.isLoadingEpisodeListMore = true;

      try {
        await this.loadEpisodeList();
      } catch (e) {}

      this.isLoadingEpisodeListMore = false;
    },
    async loadEpisodeList() {
      let taxCode = this.$store.getters["getTaxCode"];
      let filterCategory = this.filterDocumentCategoryCodeList;
      let filterType = this.filterDocumentTypeCodeList;
      let filterTag = this.filterTagCodeList;
      let typePairList = [];

      this.categoryList.forEach(c => {
        // Il BE non accetta la categoria "PERSONALE" in input
        if (c.codice === DOCUMENT_CATEGORY_MAP.PERSONAL) return;

        // Se l'utente non ha selezionato categorie => le prendiamo tutte
        // Altrimenti prendiamo solo le categorie selezionate
        if (filterCategory.length > 0 && !filterCategory.includes(c.codice)) {
          return;
        }

        c.tipi_documento.forEach(t => {
          // Se l'utente non ha selezionato tipologie => le prendiamo tutte
          // Altrimenti prendiamo solo le tipologie selezionate
          if (filterType.length > 0 && !filterType.includes(t.codice)) {
            return;
          }

          typePairList.push({ categoria: c.codice, tipologia: t.codice });
        });
      });

      // Se non ci sono coppie (tipologia, categoria) valide
      // => diciamo semplicemente che non ci sono risultati
      if (typePairList.length <= 0) {
        this.episodeList = [];
        return;
      }

      let payload = {
        filtro_episodi: {
          categoria_tipologia: typePairList,
          data_inizio: this.filterStartDate,
          data_fine: this.filterEndDate
        }
      };

      // Filtriamo per tipo episodio se selezionato
      if (this.filterEpisodeTypeCode) {
        payload.filtro_episodi.tipo_episodio = this.filterEpisodeTypeCode;
      }

      // Calcoliamo i filtri per tag
      let tagFixedList = filterTag.filter(
        t => t.tipologia_etichetta === TAG_TYPE_MAP.FIXED
      );

      let tagPersonalList = filterTag.filter(
        t => t.tipologia_etichetta === TAG_TYPE_MAP.PERSONAL
      );

      if (tagFixedList.length > 0) {
        payload.filtro_episodi.etichetta_anatomica = tagFixedList;
      }

      if (tagPersonalList.length > 0) {
        payload.filtro_episodi.etichette_personali = tagPersonalList;
      }

      let params = {
        offset: this.episodeListOffset,
        limit: this.episodeListLimit
      };

      // this.isLoadingEpisodeList = true;

      try {
        let { data } = await searchEpisodeList(taxCode, payload, { params });
        this.episodeList = [...this.episodeList, ...data];
        // Continuiamo a mostrare il bottone "carica altri" finché le API rispondono con qualche dato
        this.hasMoreEpisodes = data.length >= params.limit;
      } catch (error) {
        let message = "Non è stato possibile caricare l'elenco degli episodi";
        apiErrorNotifyDialog({ error, message });
      }

      // this.isLoadingEpisodeList = false;
    },
    async loadEpisodeDocumentList(episode) {
      let taxCode = this.$store.getters["getTaxCode"];
      let episodeId = episode?.id_episodio;
      let params = {
        componente_locale: episode?.codice_cl
      };

      this.episodeDocumentList = [];
      this.isLoadingEpisodeDocumentList = true;

      try {
        let { data } = await getEpisodeDocumentList(taxCode, episodeId, {
          params
        });
        this.episodeDocumentList = data;
      } catch (error) {
        let message =
          "Non è stato possibile caricare l'elenco dei documenti di questo episodio";
        apiErrorNotifyDialog({ error, message });
      }

      this.isLoadingEpisodeDocumentList = false;
    },
    onEpisodeViewSelected() {
      this.viewSelected = VIEW_MAP.EPISODE;
      this.loadEpisodeListReload();
    },
    onDocumentListFilter() {
      if ([VIEW_MAP.LIST, VIEW_MAP.BODY].includes(this.viewSelected)) {
        this.loadDocumentListReload();
      } else if ([VIEW_MAP.EPISODE].includes(this.viewSelected)) {
        this.loadEpisodeListReload();
      }

      this.loadCounts();
    },
    onEnrollmentBannerClose() {
      this.isEnrollmentBannerClosed = true;
    },
    onDocumentFseTagClick(document, tag) {
      this.filterTagCodeList = [tag];
      this.loadDocumentListReload();
    },
    onTagsAssociated(document, tags) {
      document.etichetta_anatomica = tags.tagFixed;
      document.etichette_personali = tags.tagPersonalList;
      this.loadCounts();
    },
    onDocumentRemoved(document) {
      this.documentList = this.documentList.filter(
        d => d.id_documento_ilec !== document.id_documento_ilec
      );
    },
    onDocumentVisibilityChanged(document) {
      this.loadDocumentListReload();
    },
    onExemptionVisibilityChanged(document) {
      this.getExemptionInfo();
      this.loadDocumentListReload();
    },
    onImageBookedFse() {
      this.loadDocumentListReload();
    },
    onDocumentRolWithDrawn() {
      // Nel momento in cui il cittadino ritira il referto dobbiamo ricaricare:
      //    1) L'elenco dei referti ROL (perché non ne fa più parte il documento appena ritirato)
      //    2) L'elenco dei referti FSE (perché si aggiunge il documento appena ritirato)
      //    3) Il conteggio dei documenti FSE (perché si è aggiunto il documento appena ritirato)
      this.loadRolList();
      this.loadDocumentListReload();
      this.loadCounts();
    },
    onBodySectionClick(event, sectionType, tagListSection) {
      this.filterTagCodeList = tagListSection;
      this.loadDocumentListReload();
    },
    onDragStart(event, i) {
      this.draggingDocument = i;
      // event.dataTransfer.setData("__el", JSON.stringify(i));
      // event.dataTransfer.dropEffect = "copy";
      event.dataTransfer.dropEffect = "link";
    },
    async onDrop(event, tag) {
      let document = this.draggingDocument;
      // let document = event.dataTransfer.getData("__el");
      // document = JSON.parse(document);
      console.log(document, tag);

      let taxCode = this.$store.getters["getTaxCode"];
      let documentId = document?.id_documento_ilec;

      let payloadDelete = {
        categoria: document?.categoria ?? null,
        id_tag_fisso: document?.etichetta_anatomica?.id ?? null,
        tipo_operazione: TAG_OPERATION_TYPE_CODE_MAP.REMOVE
      };

      let payloadCreate = {
        categoria: document?.categoria ?? null,
        id_tag_fisso: tag.id,
        tipo_operazione: TAG_OPERATION_TYPE_CODE_MAP.ADD
      };

      // Indica se è necessario disassociare le vecchie etichette
      let mustDelete = payloadDelete.id_tag_fisso;

      // Indica se è necessario associare delle nuove etichette
      let mustCrete = payloadCreate.id_tag_fisso;

      // I documenti personali, cioè quelli caricati in maniera autonoma,
      // non richiedono il codice cl nel payload
      if (!isPersonalFse(document)) {
        payloadDelete.codice_cl = document?.codice_cl;
        payloadCreate.codice_cl = document?.codice_cl;
      }

      this.isAssociatingTag = true;

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
          this.isAssociatingTag = false;
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
          this.isAssociatingTag = false;
          return;
        }
      }

      document.etichetta_anatomica = tag;
      notifySuccess("Etichetta associata");
      this.loadCounts();

      this.isAssociatingTag = false;
    }
  }
};
</script>

<style lang="scss">
.fse-sticky {
  position: -webkit-sticky; /* Safari */
  position: sticky;
  top: 0;
}
</style>
