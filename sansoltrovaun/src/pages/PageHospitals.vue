<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-page>
    <lms-filters-form :are-results="areResults" :default-filters="filterParams" :loading="isLoading"
                      @query-params="searchNewHospitals"
                      @invalid-filters="invalidFilters"/>

    <template v-if="!isInvalidSearch">
      <div v-if="areResults" class="q-mt-lg">
        <lms-results :found-items-list="hospitalsList" :are-more-elements="areMoreElements"
                     :user-coords="userCoords" :loading="isLoadingMoreItems" @show-more="loadMoreResults"
                     @show-fullsize-map="fullsizeMap"/>

      </div>
      <div v-if="!areResults && !isLoading && !isFirstResearch" class="q-my-lg">
        <q-banner class="h-banner h-banner--info">
          Nessun risultato trovato.
        </q-banner>
      </div>
    </template>

    <div v-else class="q-my-lg">
      <q-banner class="h-banner h-banner--negative">
        <template v-slot:avatar>
          <q-icon name="warning" size="md"/>
        </template>
        <p class="text-body1 no-margin">{{noFieldsFilledMsg}}</p>
      </q-banner>
    </div>


    <div class="row items-center justify-center q-mt-lg">
      <lms-inner-loading :showing="isLoading" class="bg-transparent" block/>
    </div>

  </q-page>
</template>

<script>
  import {apiErrorNotify, isEmpty} from "../services/utils";
  import { getHospitals, getHospitalsTypes} from "../services/api";
  import LmsResults from "../components/LmsResults";
  import {SEARCH_LIMIT} from "../services/config";
  import LmsFiltersForm from "../components/LmsFiltersForm";
  import {errorSearchLabel} from "../services/business-logic";

  export default {
    name: "PageHospitals",
    components: {LmsFiltersForm, LmsResults},
    data() {
      return {
        SEARCH_LIMIT,
        openFilter: true,
        queryParams: null,
        hospitalsList: [],
        filterParams: null,
        uploadNewElements: false,
        isNewSearch: true,
        offset: 0,
        newQueryParams: null,
        isLoading: false,
        isLoadingMoreItems: false,
        userCoords: null,
        areMoreElements: false,
        searchParams: null,
        viewFullsizeMap: false,
        isInvalidSearch: false,
      }
    },
    validations: {
      name: {},
      address: {}
    },
    computed: {
      isFullsize() {
        return this.$q.screen.gt.sm
      },
      areResults() {
        return this.hospitalsList.length > 0
      },
      hospitalsTypes() {
        return this.$store.getters['getHospitalsTypes']
      },
      isFirstResearch() {
        return isEmpty(this.filterParams)
      },
      noFieldsFilledMsg() {
        return errorSearchLabel()
      },
    },
    created() {
      this.filterParams = this.$route?.params ?? null
      if (!isEmpty(this.filterParams)) this.searchNewHospitals(this.filterParams)
      let hospitalsType = this.$store.getters["getHospitalsTypes"];
      if (isEmpty(hospitalsType)) this.getHospitalsTypes()
    },
    methods: {
      async getHospitalsTypes() {
        let typeListResponse = await getHospitalsTypes();
        this.$store.dispatch('setHospitalsTypes', {types: typeListResponse.data});
      },

      setQueryParams(params) {
        this.userCoords = params.address ? params.address.coords : null
        let lat = this.userCoords ? this.userCoords.lat : null;
        let lon = this.userCoords ? this.userCoords.lon : null;
        return {
          latitudine: lat,
          longitudine: lon,
          distanza: params.distance,
          s: !isEmpty(params.name) ? params.name : null,
          tipologia: !isEmpty(params.type) ? params.type.value : null,
          limit: SEARCH_LIMIT,
          offset: this.offset
        };
      },
      searchNewHospitals(params) {
        this.isNewSearch = true
        this.hospitalsList = [];
        this.offset = 0;
        this.isLoading = true
        if (!params) {
          this.isLoading = false
          return
        }
        this.isNewSearch = true
        this.filterParams = params
        this.searchHospitals()
      },

      async searchHospitals() {
        let queryParams = this.setQueryParams(this.filterParams);

        this.uploadNewElements = true;

        try {
          let hospitalsListPromise = await getHospitals({_no5XXRedirect: true, params: queryParams});
          let hospitalsResponse = this.mapTypeList(hospitalsListPromise.data);

          if (this.isNewSearch) {
            this.hospitalsList = hospitalsResponse
          } else {
            this.hospitalsList = this.hospitalsList.concat(hospitalsResponse)
          }

          if (hospitalsResponse.length > 0) {
            let headers = hospitalsListPromise.headers;
            let xPage = parseInt(headers['x-page']);
            let xTotalPages = parseInt(headers['x-total-pages']);
            if (xPage < xTotalPages) {
              this.offset = this.offset + SEARCH_LIMIT;
            }
            this.areMoreElements = xTotalPages > xPage
          }
        } catch (e) {
          apiErrorNotify({error: e, message: 'Non è stato possibile effettuare la ricerca.'})
        } finally {
          this.isLoading = false;
          this.isLoadingMoreItems = false
          this.uploadNewElements = false;
        }
      },
      mapTypeList(list) {
        let mappedList = list.map(item => {
          let typeLabel = this.hospitalsTypes.find(type => item.tipo_codice === type.codice)
          if (typeLabel) {
            item.tipologia = typeLabel.descrizione
            return item
          }
          return null
        })
        return mappedList
      },

      loadMoreResults() {
        this.isNewSearch = false
        this.isLoadingMoreItems = true
        this.searchHospitals(this.filterParams);
      },

      fullsizeMap(val) {
        this.viewFullsizeMap = val
      },

      invalidFilters(val) {
        this.isInvalidSearch = val
      },

    }
  }
</script>

<style scoped>

</style>
