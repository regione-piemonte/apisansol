<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-page>
    <lms-filters-form :are-results="areResults" :default-filters="filterParams" :loading="isLoading"
                      @query-params="searchNewPharmacies"
                      @invalid-filters="invalidFilters"/>

    <template v-if="!isInvalidSearch">
      <div v-if="areResults" class="q-mt-lg">
        <lms-results :found-items-list="pharmaciesList" :are-more-elements="areMoreElements"
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
    import {apiErrorNotify, isEmpty} from "../services/utils";
    import {getPharmacies} from "../services/api";
    import {SEARCH_LIMIT} from "../services/config";
    import LmsFiltersForm from "../components/LmsFiltersForm";
    import {errorSearchLabel} from "../services/business-logic";
    export default {
      name: "PagePharmacies",
      components: {LmsFiltersForm, LmsResults},
      data(){
        return{
          SEARCH_LIMIT,
          openFilter:true,
          queryParams:null,
          pharmaciesList:[],
          filterParams:null,
          uploadNewElements:false,
          isNewSearch:true,
          offset:0,
          newQueryParams:null,
          isLoading:false,
          isLoadingMoreItems:false,
          userCoords: null,
          areMoreElements:false,
          searchParams:null,
          viewFullsizeMap:false,
          isInvalidSearch:false
        }
      },
      computed:{
        isFullsize(){
          return this.$q.screen.gt.sm
        },
        areResults(){
          return this.pharmaciesList.length>0
        },
        isFirstResearch(){
          return isEmpty(this.filterParams)
        },
        noFieldsFilledMsg() {
          return errorSearchLabel()
        },
      },
      created(){
        this.filterParams = this.$route?.params ?? null
        if(!isEmpty(this.filterParams))  this.searchNewPharmacies( this.filterParams )
      },
      methods:{

        setQueryParams(params){
          this.userCoords = params.address ? params.address.coords : null
          let lat = this.userCoords ? this.userCoords.lat : null;
          let lon = this.userCoords ? this.userCoords.lon : null;
          return {
            latitudine: lat,
            longitudine:lon,
            distanza:params.distance,
            dati_aggiuntivi_celiachia:false,
            s: !isEmpty(params.name) ? params.name : null,
            limit: SEARCH_LIMIT,
            offset: this.offset
          };
        },
        searchNewPharmacies(params){
          this.isNewSearch = true
          this.pharmaciesList = [];
          this.offset = 0;
          this.isLoading=true
          if(!params){
            this.isLoading = false
            return
          }
          this.isNewSearch = true
          this.filterParams=params
          this.searchPharmacies()
        },

        async searchPharmacies(){
          let queryParams = this.setQueryParams(this.filterParams);
          this.uploadNewElements = true;

          try{
            let pharmaciesListPromise = await getPharmacies( { _no5XXRedirect: true, params: queryParams});
            let pharmaciesResponse =  this.mapTypeList(pharmaciesListPromise.data);

            if(this.isNewSearch){
              this.pharmaciesList = pharmaciesResponse
            }else{
              this.pharmaciesList = this.pharmaciesList.concat(pharmaciesResponse)
            }

            if(pharmaciesResponse.length>0){
              let headers = pharmaciesListPromise.headers;
              let xPage = parseInt(headers['x-page']);
              let xTotalPages = parseInt(headers['x-total-pages']);
              if(xPage < xTotalPages){
                this.offset = this.offset + SEARCH_LIMIT;
              }
              this.areMoreElements = xTotalPages > xPage
            }
          }catch(e){
            apiErrorNotify({error: e, message: 'Non è stato possibile effettuare la ricerca.'})
          }finally {
            this.isLoading=false;
            this.isLoadingMoreItems=false
            this.uploadNewElements=false;
          }
        },
        mapTypeList(list){
          let mappedList = list.map(item =>{
            item.tipologia = 'Farmacia'
            return item
          })

          return mappedList
        },
        loadMoreResults(){
          this.isNewSearch=false
          this.isLoadingMoreItems = true
          this.searchPharmacies(this.filterParams);
        },

        fullsizeMap(val){
          this.viewFullsizeMap=val
        },
        invalidFilters(val) {
          this.isInvalidSearch = val
        },
      }
    }
</script>

<style scoped>

</style>
