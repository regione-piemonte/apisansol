<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-page>
<!--    <lms-filters-form :are-results="areResults" :default-filters="filterParams" :loading="isLoading" @query-params="searchNewFacilities"-->
<!--                      @invalid-filters="invalidFilters"/>-->
<!--    <template v-if="!isInvalidSearch">-->
<!--      <div v-if="areResults" class="q-mt-lg">-->
<!--        <lms-results-new :found-items-list="healthFacilitiesList" :are-more-elements="areMoreElements"-->
<!--                         :user-coords="userCoords" :loading="isLoadingMoreItems" @show-more="loadMoreResults"-->
<!--                         @show-fullsize-map="fullsizeMap"/>-->
<!--      </div>-->
<!--      <div v-if="!areResults && !isLoading && !isFirstResearch" class="q-my-lg">-->
<!--        <q-banner class="bg-info">-->
<!--          Nessun risultato trovato.-->
<!--        </q-banner>-->
<!--      </div>-->
<!--    </template>-->

<!--    <div v-else class="q-my-lg">-->
<!--      <q-banner class="bg-red-3 ">-->
<!--        <template v-slot:avatar>-->
<!--          <q-icon name="warning" size="md"/>-->
<!--        </template>-->
<!--        <p class="text-body1 no-margin">È necessario inserire il nome della struttura o un indirizzo valido</p>-->
<!--      </q-banner>-->
<!--    </div>-->
<!--    <div class="row items-center justify-center q-mt-lg">-->
<!--      <lms-inner-loading :showing="isLoading" class="bg-transparent" block/>-->
<!--    </div>-->
  <lms-service-layout
    :service-types="facilitiesTypes"
    :found-items-list="healthFacilitiesList"
    :user-coords="userCoords"
    :are-more-elements="areMoreElements"
    :loading="isLoadingMoreItems"
    @show-more="loadMoreResults"
    @query-params="searchNewFacilities"
    @invalid-filters="invalidFilters"
  />

  </q-page>
</template>

<script>
  import LmsResults from "../components/LmsResults";
  import {SEARCH_LIMIT} from "../services/config";
  import {apiErrorNotify, isEmpty} from "../services/utils";
  import {getHealthFacilities, getHealthFacilitiesTypes, getHospitals, getHospitalsTypes} from "../services/api";
  import LmsFiltersForm from "../components/LmsFiltersForm";
  import LmsResultsNew from "../components/LmsResults";
  import {HEALTH_FACILITIES as HEALTH_FACILITIES_ROUTE} from "../router/routes";
  import LmsServiceLayout from "../components/old/LmsServiceLayout";

  export default {
    name: "TestNewDesign",
    components: {LmsServiceLayout},
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
        healthFacilitiesList: [],

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
        return this.healthFacilitiesList.length > 0
      },
      hospitalsTypes() {
        return this.$store.getters['getHospitalsTypes']
      },
      facilitiesTypes() {

        return this.$store.getters['getFacilitiesTypes']
      },
      isFirstResearch() {
        return isEmpty(this.filterParams)
      },

    },
    created() {
      this.filterParams = this.$route?.params ?? null
      if (!isEmpty(this.filterParams)) this.searchNewFacilities(this.filterParams)
      let facilitiesType = this.$store.getters["getFacilitiesTypes"];
      if (isEmpty(facilitiesType)) this.getFacilitiesType()

    },
    methods: {

      async getFacilitiesType() {
        let typeListResponse = await getHealthFacilitiesTypes();
        this.$store.dispatch('setFacilitiesTypes', {types: typeListResponse.data});
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
          tipologia_assistenza: !isEmpty(params.type) ? params.type.value : null,
          limit: SEARCH_LIMIT,
          offset: this.offset
        };
      },
      searchNewFacilities(params) {
        this.isNewSearch = true
        this.healthFacilitiesList = [];
        this.offset = 0;
        this.isLoading = true
        if (!params) {
          this.isLoading = false
          return
        }
        this.filterParams = params

        this.searchFacilities()

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
      async searchFacilities() {
        let queryParams = this.setQueryParams(this.filterParams);
        this.uploadNewElements = true;

        try {
          let facilitiesListPromise = await getHealthFacilities({_no5XXRedirect: true, params: queryParams});
          let facilitiesResponse = this.mapTypeList(facilitiesListPromise.data);

          if (this.isNewSearch) {
            this.healthFacilitiesList = facilitiesResponse
          } else {
            this.healthFacilitiesList = this.healthFacilitiesList.concat(facilitiesResponse)
          }

          if (facilitiesResponse.length > 0) {
            let headers = facilitiesListPromise.headers;
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
          let typeLabel = this.facilitiesTypes.find(type => item.tipo_assistenza_codice === type.codice)
          if (typeLabel) {
            item.tipologia = typeLabel.label
            return item
          }
          return null
        })


        return mappedList.filter(item => item)
      },
      loadMoreResults() {
        this.isNewSearch = false
        this.isLoadingMoreItems = true
        this.searchFacilities(this.filterParams);
      },

      fullsizeMap(val) {
        this.viewFullsizeMap = val
      },
      invalidFilters(val) {
        this.isInvalidSearch = val
      },
      showResultsOnMap(val) {
        this.$store.dispatch('setResultsOnMap', val)
      }
    }
  }
</script>

<style scoped>

</style>
