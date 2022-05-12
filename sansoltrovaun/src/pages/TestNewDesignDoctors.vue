<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-page>
    <lms-filters-form :are-results="areResults" :default-filters="filterParams" :loading="isLoading" @query-params="searchNewDoctors"
                      @invalid-filters="invalidFilters"/>
    <template v-if="!isInvalidSearch">
      <div v-if="areResults" class="q-mt-lg">
        <lms-results-new :found-items-list="doctorsList" :are-more-elements="areMoreElements"
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
        <p class="text-body1 no-margin">È necessario inserire il nome della struttura o un indirizzo valido</p>
      </q-banner>
    </div>
    <div class="row items-center justify-center q-mt-lg">
      <lms-inner-loading :showing="isLoading" class="bg-transparent" block/>
    </div>


  </q-page>
</template>

<script>
  import LmsResults from "../components/LmsResults";
  import {SEARCH_LIMIT} from "../services/config";
  import {apiErrorNotify, isEmpty} from "../services/utils";
  import {
    doctorsOfficesListResults,
    getDoctorsTypes,
    getHealthFacilities,
    getHealthFacilitiesTypes,
    getHospitals,
    getHospitalsTypes
  } from "../services/api";
  import LmsFiltersForm from "../components/LmsFiltersForm";
  import LmsResultsNew from "../components/LmsResults";
  import {HEALTH_FACILITIES as HEALTH_FACILITIES_ROUTE} from "../router/routes";

  export default {
    name: "TestNewDesignDoctors",
    components: {LmsResultsNew, LmsFiltersForm},
    data() {
      return {
        SEARCH_LIMIT,
        openFilter: true,
        queryParams: null,
        doctorsList: [],
        officesList: [],
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
        return this.doctorsList.length > 0
      },
      doctorsTypes() {
        return this.$store.getters['getDoctorTypes']
      },
      isFirstResearch() {
        return isEmpty(this.filterParams)
      },

    },
    created() {
      this.filterParams = this.$route?.params ?? null
      if (!isEmpty(this.filterParams)) this.searchNewDoctors(this.filterParams)
      let doctorsTypes = this.$store.getters["doctorsTypes"];
      if (isEmpty(doctorsTypes)) this.getDoctorsType()

    },
    methods: {

      async getDoctorsType() {
        let typeListResponse = await getDoctorsTypes();
        this.$store.dispatch('setDoctorTypes', {types: typeListResponse.data});
      },
      setQueryParams(params) {
        this.userCoords = params.address ? params.address.coords : null
        let lat = this.userCoords ? this.userCoords.lat : null;
        let lon = this.userCoords ? this.userCoords.lon : null;
        return {
          latitudine: lat,
          longitudine: lon,
          distanza: params.distance,
          nome_medico: !isEmpty(params.name) ? params.name : null,
          tipologia: !isEmpty(params.type) ? params.type.value : null,
          limit: SEARCH_LIMIT,
          disponibilita:false,
          offset: this.offset
        };
      },
      searchNewDoctors(params) {
        this.isNewSearch = true
        this.doctorsList = [];
        this.offset = 0;
        this.isLoading = true
        if (!params) {
          this.isLoading = false
          return
        }
        this.filterParams = params
        this.searchDoctors()
      },

      async searchDoctors() {
        let queryParams = this.setQueryParams(this.filterParams);
        this.uploadNewElements = true;

        try {
          let officesListPromise = await doctorsOfficesListResults({_no5XXRedirect: true, params: queryParams});
          let officesResponse = this.mapOfficesResults(officesListPromise.data);

          if (this.isNewSearch) {
            this.doctorsList = officesResponse
          } else {
            this.doctorsList = this.doctorsList.concat(officesResponse)
          }

          if (officesResponse.length > 0) {
            let headers = officesListPromise.headers;
            let xPage = parseInt(headers['x-page']);
            let xTotalPages = parseInt(headers['x-total-pages']);
            if (xPage < xTotalPages) {
              this.offset = this.offset + SEARCH_LIMIT;
            }
            this.areMoreElements = xTotalPages > xPage
            //  this.filterDoctorsOffices(officesResponse);
          }
        } catch (e) {
          apiErrorNotify({error: e, message: 'Non è stato possibile effettuare la ricerca.'})
        } finally {
          this.isLoading = false;
          this.isLoadingMoreItems = false
          this.uploadNewElements = false;
        }
      },
      mapOfficesResults(officesResults) {
        if (officesResults) {
          let newOfficeList = officesResults.map(office => {
            office.nome_medico = office.medico?.nome + ' ' + office.medico?.cognome
            office.geo = office.coordinate
            office.tipologia = office.medico?.tipologia?.descrizione
            delete office['coordinate'];
            return office
          })
          return newOfficeList
        }

      },
      loadMoreResults() {
        this.isNewSearch = false
        this.isLoadingMoreItems = true
        this.searchDoctors(this.filterParams);
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
