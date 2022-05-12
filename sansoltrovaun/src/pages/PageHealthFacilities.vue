<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-page>
    <lms-filters-form :are-results="areResults" :default-filters="filterParams" :loading="isLoading"
                      @query-params="searchNewFacilities"
                      @invalid-filters="invalidFilters"/>

    <template v-if="!isInvalidSearch">
      <div v-if="areResults" class="q-mt-lg">
        <lms-results :found-items-list="healthFacilitiesList" :are-more-elements="areMoreElements"
                     :user-coords="userCoords" :loading="isLoadingMoreItems" @show-more="loadMoreResults"
                     @show-fullsize-map="fullsizeMap"/>

      </div>
      <div v-if="!areResults && !isLoading && !isFirstResearch" class="q-my-lg">
        <q-banner class="h-banner h-banner--info ">
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
    import {SERVICES} from "../services/config";
    import {apiErrorNotify, isEmpty} from "../services/utils";
    import {
      getHealthFacilities,
      getHealthFacilitiesTypes
    } from "../services/api";
    import {SEARCH_LIMIT} from "src/services/config";
    import {errorSearchLabel} from "../services/business-logic";
    import LmsFiltersForm from "../components/LmsFiltersForm";

    export default {
        name: "PageHealthFacilities",
      components: {LmsFiltersForm, LmsResults},
      data(){
        return{
          SEARCH_LIMIT,
          openFilter:true,
          queryParams:null,
          healthFacilitiesList:[],
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
      validations: {
        name: {},
        address:{}
      },
      computed:{
        isFullsize(){
          return this.$q.screen.gt.sm
        },
        areResults(){
          return this.healthFacilitiesList.length>0
        },
        facilitiesTypes(){
          return this.$store.getters['getFacilitiesTypes']
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
        if(!isEmpty(this.filterParams)) this.searchNewFacilities( this.filterParams )
        let facilitiesType = this.$store.getters["getFacilitiesTypes"];
        if(isEmpty(facilitiesType)) this.getFacilitiesType()
      },
      methods:{

        async getFacilitiesType(){
          let typeListResponse = await getHealthFacilitiesTypes();
          this.$store.dispatch('setFacilitiesTypes', {types: typeListResponse.data});
        },

        setQueryParams(params){
          this.userCoords = params.address ? params.address.coords : null
          let lat = this.userCoords ? this.userCoords.lat : null;
          let lon = this.userCoords ? this.userCoords.lon : null;
          return {
            latitudine: lat,
            longitudine:lon,
            distanza:params.distance,
            s: !isEmpty(params.name) ? params.name : null,
            tipologia_assistenza:!isEmpty(params.type) ? params.type.value : null,
            limit: SEARCH_LIMIT,
            offset: this.offset
          };
        },
        searchNewFacilities(params){
          this.isNewSearch = true
          this.healthFacilitiesList = [];
          this.offset = 0;
          this.isLoading=true
          if(!params){
            this.isLoading = false
            return
          }
          this.isNewSearch = true
          this.filterParams=params
          this.searchFacilities()
        },

        async searchFacilities(){
          let queryParams = this.setQueryParams(this.filterParams);
          this.uploadNewElements = true;

          try{
            let facilitiesListPromise = await getHealthFacilities( { _no5XXRedirect: true, params: queryParams});
            let facilitiesResponse = this.mapTypeList(facilitiesListPromise.data);

            if(this.isNewSearch){
              this.healthFacilitiesList = facilitiesResponse
            }else{
              this.healthFacilitiesList = this.healthFacilitiesList.concat(facilitiesResponse)
            }

            if(facilitiesResponse.length>0){
              let headers = facilitiesListPromise.headers;
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
            let typeLabel = this.facilitiesTypes.find(type => item.tipo_assistenza_codice === type.codice )
            if(typeLabel){
              item.tipologia = typeLabel.label
              return item
            }
            return null
          })


          return mappedList.filter(item => item)
        },

        loadMoreResults(){
          this.isNewSearch=false
          this.isLoadingMoreItems = true
          this.searchFacilities(this.filterParams);
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
