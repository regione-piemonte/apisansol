<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-dialog
    v-bind="attrs"
    v-on="listeners"
    maximized
    @before-show="onBeforeShow"
  >
    <q-card class="cod-document-list-dialog">
      <q-toolbar>
        <q-toolbar-title>
          Condividi documento sanitario
        </q-toolbar-title>

        <q-btn v-close-popup flat round icon="close"   aria-label="chiudi finestra"/>
      </q-toolbar>

      <q-card-section class="q-px-lg">
        <template v-if="canSeeDocumentFseList">
          <!-- FILTRI -->
          <!-- ------ -->
          <div class="q-mb-xs">
            <q-btn dense flat color="primary" @click="isFilterOpen = !isFilterOpen"  no-caps>
              <div class="text-bold text-primary">
                <q-icon class="q-mr-xs"  size="xs" name="fas fa-filter" />
                Filtri
              </div>
            </q-btn>

<!--            <div class="text-bold text-primary">-->
<!--              <q-icon class="q-mr-xs" name="fas fa-filter" />-->
<!--              Filtri-->
<!--            </div>-->
            <q-slide-transition>
              <div v-show="isFilterOpen" class="row q-col-gutter-lg" >
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
                  />

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
                  />

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

                  />

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
                  />


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
            </q-slide-transition>

          </div>

          <div class="q-my-lg">
            <q-separator />
          </div>


          <!-- LISTA ALTRI DOCUMENTI -->
          <!-- --------------------- -->

          <div class="q-mt-xl q-gutter-y-md">
              <template v-if="isLoadingDocumentList || isLoading">

                  <q-card v-for="i in 10" :key="'list-skeleton--' + i">
                    <cod-document-item-skeleton />
                  </q-card>

              </template>
            <template v-else-if="documentList.length <= 0">
              <lms-banner type="info">
                Non hai nessun documento. <br />
                Il Fascicolo verrà alimentato con i referti emessi successivamente alla
                data di apertura. <br />
                Per visualizzare i referti emessi in precedenza, occorre dare il
                consenso al recupero dei documenti pregressi modificando le impostazioni
                del tuo account. <br />
                È inoltre sempre possibile caricare personalmente i propri documenti.
              </lms-banner>
            </template>
          <template v-else>
            <q-card
              v-for="document in documentList"
              :key="'list--' + document.id_documento_ilec"
            >
              <cod-document-item
                :is-attached="isDocumentAttached(document.id_documento_ilec)"
                :document="document"
                actions
                associated-link
                @on-attachment="$emit('on-attachment', $event)"
                @remove-attachment="$emit('remove-attachment', $event)"
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

        <template v-else>
          <lms-banner type="info">
            Non puoi visualizzare la lista dei documenti
          </lms-banner>
        </template>
      </q-card-section>

    </q-card>
  </q-dialog>
</template>

<script>
import {
  APPLICATION_CODE,
  DOCUMENT_COUNTS_TYPE_MAP,
  TAG_TYPE_MAP
} from "src/services/config";
import {
  getCategoryList,
  getEpisodeTypeList,
  getExceptions, getTagList,
  searchDocumentCounts,
  searchDocumentList,
} from "src/services/api";
import {apiErrorNotifyDialog, isEmpty,  orderBy, uniqueElementsBy} from "src/services/utils";
import {date} from "quasar";
import LmsBanner from "components/core/LmsBanner";
import CodDocumentItemSkeleton from "components/loaders/CodDocumentItemSkeleton";
import CodDocumentItem from "components/CodDocumentItem";
import LmsSelectMultiple from "components/core/LmsSelectMultiple";
import LmsSelect from "components/core/LmsSelect";

const { subtractFromDate, formatDate } = date;

const NOW = formatDate(new Date(), "YYYY-MM-DD");
const VIEW_MAP = {
  LIST: "LIST",
  BODY: "BODY",
  EPISODE: "EPISODE"
};


export default {
  name: "CodDocumentListDialog",
  components: {LmsSelect, LmsSelectMultiple, CodDocumentItem, CodDocumentItemSkeleton, LmsBanner},
  props:{
    attachmentList:{type: Array, default:() => []}
  },
  data(){
    return {
      VIEW_MAP,
      isLoading:false,
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
      documentCreatorList: [],
      filterDocumentCategoryCodeList: [],
      filterDocumentTypeCodeList: [],
      filterTagCodeList: [],
      filterEndDate: NOW,
      filterEpisodeTypeCode: null,
      filterStartDate: "",
      rolList: [],
      documentList: [],
      isFilterOpen:true,
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
  computed:{
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
    taxCode() {
      return this.$store.getters["getTaxCode"];
    },
    isEnrolled() {
      return this.$store.getters["isEnrolled"];
    },
    tagList() {
      return this.$store.getters["getTagList"];
    },
    categoryList() {
      return this.$store.getters["getCategoryList"];
    },

    episodeTypeList(){
      return this.$store.getters["getEpisodeTypeList"];
    },
    canSeeDocumentFseList() {
      return this.$store.getters["canSeeDocumentFseList"];
    },
    savedDocumentsList(){
      return this.$store.getters["getDocumentsList"]
    },
    documentTypeList() {
      let categoryList = this.categoryList;

      if (this.filterDocumentCategoryCodeList?.length) {
        categoryList = categoryList.filter(c =>
          this.filterDocumentCategoryCodeList.includes(c.codice)
        );
      }

      let result = categoryList?.flatMap(c => c.tipi_documento);
      result = uniqueElementsBy(result, (a, b) => a.codice === b.codice);
      result = orderBy(result, ["descrizione"]);
      return result;
    },
    tagListOptions(){
      return this.tagList?.map(tag =>{
        tag.codice= [tag.id, tag.tipologia_etichetta].join("--");
        return tag
      })
    },
  },

  async created() {

  },
  methods: {
    async onBeforeShow(){

      this.isLoading = true
      let now = new Date();

      await this.getFiltersList()

      if (!this.filterStartDate) {
        // let startDate = subtractFromDate(now, { month: 1 });
        let startDate = subtractFromDate(now, { month: 6 });
        startDate = formatDate(startDate, "YYYY-MM-DD");
        this.filterStartDate = startDate;
      }
      if(!isEmpty(this.savedDocumentsList)) {
        this.isLoading=false
        return
      }

      if (this.canSeeDocumentFseList && this.isEnrolled) {
        await this.loadDocumentListReload();
        await this.loadCounts();
      }

      this.isLoading=false
    },
    async getFiltersList(){
      let tagPromise = null
      let categoriesPromise = null
      let episodesPromise = null
      let exceptionInfoPromise = null
      if(isEmpty(this.tagList) ) {
        tagPromise = getTagList(this.taxCode)
      }
      if(isEmpty(this.categoryList)){
        let params = { codice_app_verticale: APPLICATION_CODE };
        categoriesPromise = getCategoryList(this.taxCode, { params });
      }
      if(isEmpty(this.episodeTypeList)){
        episodesPromise = getEpisodeTypeList();
      }
      if(isEmpty(this.exemptionInfo)){
        let params = { servizio: APPLICATION_CODE };
        exceptionInfoPromise =  getExceptions(this.taxCode, {params});
      }

      if(tagPromise){
        try {
          let { data: tagList} = await tagPromise;
          await this.$store.dispatch("setTagList", { tagList });
        } catch (error) {
          let message =
            "Non è stato possibile caricare l'elenco delle etichette";
          apiErrorNotifyDialog({ error, message });

        }
      }

      if(categoriesPromise){
        try {
          let { data: categoryList} = await categoriesPromise;
          await this.$store.dispatch("setCategoryList", { categoryList });
        } catch (error) {
          let message =
            "Non è stato possibile caricare l'elenco delle categorie";
          apiErrorNotifyDialog({ error, message });

        }
      }

      if(episodesPromise){
        try {
          let { data: episodeTypeList} = await episodesPromise;
          await this.$store.dispatch("setEpisodeTypeList", { episodeTypeList });
        } catch (error) {
          let message =
            "Non è stato possibile caricare l'elenco delle tipologie di episodio";
          apiErrorNotifyDialog({ error, message });

        }
      }

      if(exceptionInfoPromise){
        try {
          let { data: exemptionInfo } = await exceptionInfoPromise
          await this.$store.dispatch("setExemptionInfo", { exemptionInfo });
        } catch (error) {
          let message =
            "Non è stato possibile caricare le informazioni delle esenzioni per patologie";
          apiErrorNotifyDialog({ error, message });
        }
      }

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
      // let filterTag = this.filterTagCodeList;
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
        //area: "BLU",
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

        this.$store.dispatch('setDocumentList', {documents: this.documentList})
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
    onDocumentListFilter() {
      this.loadDocumentListReload();
      this.loadCounts();
    },
    isDocumentAttached(id){
      return this.attachmentList?.find(attachment => attachment.id_documento_ilec === id)
    }

  }
}
</script>

<style lang="sass">
.cod-document-list-dialog
  background-color: $lms-background-color

</style>
