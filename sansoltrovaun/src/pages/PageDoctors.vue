<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-page class="lms-page-doctors">
    <lms-filters-form :are-results="areResults" :default-filters="filterParams" :loading="isLoading"
                      @query-params="searchNewDoctors"
                      @invalid-filters="invalidFilters"/>

    <template v-if="!isInvalidSearch">
      <div v-if="areResults" class="q-mt-lg">
        <lms-results :found-items-list="doctorsList" :are-more-elements="areMoreElements"
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
  import LmsResults from "../components/LmsResults";
  import {doctorsOfficesListResults, getDoctorsTypes} from "../services/api";
  import {apiErrorNotify, deepClone, isEmpty} from "../services/utils";
  import {SERVICES, SEARCH_LIMIT} from "src/services/config";
  import {errorSearchLabel} from "../services/business-logic";
  import LmsFiltersForm from "../components/LmsFiltersForm";

  export default {
    name: "PageDoctors",
    components: {LmsFiltersForm, LmsResults},
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
      isFirstResearch(){
        return isEmpty(this.filterParams)
      },
      noFieldsFilledMsg() {
        return errorSearchLabel()
      },
    },
    created() {
      this.filterParams = this.$route?.params ?? null
      if(!isEmpty(this.filterParams)) this.searchNewDoctors(this.filterParams)
      let doctorsType = this.$store.getters["getDoctorTypes"];
      if (isEmpty(doctorsType)) this.getDoctorsType()
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
      //Funzione che consente di raggruppare gli ambulatori per ogni medico.
      async filterDoctorsOffices(officesResults) {
        // let availabilityParams=[];
        if (officesResults) {
          let newOfficeList = officesResults.map(office => {
            return {medico: office.medico, ambulatorio: office}
          });

          let officesByIdDoctor = newOfficeList.reduce((obj, offices) => {
            obj[offices.medico.id] = obj[offices.medico.id] || [];

            obj[offices.medico.id].push(offices.ambulatorio);
            return obj;
          }, {});

          let doctorsList = Object.keys(officesByIdDoctor).map(key => {
            let listItem = newOfficeList.find(office => office.medico.id.toString() === key);
            listItem = listItem.medico;
            listItem.ambulatori = officesByIdDoctor[key];
            return listItem;
          });

          if (this.isNewSearch || !this.doctorsList) {
            this.doctorsList = doctorsList
          } else {
            let newList = [this.doctorsList, doctorsList];
            this.doctorsList = [...new Set([].concat(...newList))];
          }

          this.isLoading = false;
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
    }
  }
</script>

<style lang="sass">
</style>
