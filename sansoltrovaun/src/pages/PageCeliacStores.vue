<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-page>

    <lms-filters-form :are-results="areResults" :default-filters="filterParams" :loading="isLoading"
                      @query-params="searchNewCeliacStores"
                      @invalid-filters="invalidFilters"/>

    <template v-if="!isInvalidSearch">
      <div v-if="areResults" class="q-mt-lg">
        <lms-results :found-items-list="storesList" :are-more-elements="areMoreElements"
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
    import {getCeliacStores, getCeliacStoresTypes, getHospitals, getPharmacies} from "../services/api";
    import {SEARCH_LIMIT, PHARMACIES_TYPE} from "../services/config";
    import LmsFiltersForm from "../components/LmsFiltersForm";
    import {errorSearchLabel} from "../services/business-logic";
    const LIMIT = Math.floor(  SEARCH_LIMIT / 2   )
    export default {
      name: "PageCeliacStores",
      components: {LmsFiltersForm, LmsResults},
      data(){
        return{
          openFilter:true,
          PHARMACIES_TYPE,
          queryParams:null,
          storesList:[],
          celiacList:[],
          pharmaciesList:[],
          filterParams:null,
          uploadNewElements:false,
          isNewSearch:true,
          storeOffset:0,
          pharmacyOffset:0,
          newQueryParams:null,
          isLoading:false,
          isLoadingMoreItems:false,
          userCoords: null,
          areMoreStores:false,
          areMorePharmacies:false,
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
          return this.storesList.length>0
        },
        celiacStoresTypes(){
          return this.$store.getters['getCeliacStoresTypes']
        },
        isFirstResearch(){
          return isEmpty(this.filterParams)
        },
        isPharmacyType(){
          return this.filterParams?.type?.value === PHARMACIES_TYPE.codice
        },
        isNoType(){
          return isEmpty(this.filterParams?.type)
        },
        areMoreElements(){
          return this.areMoreStores || this.areMorePharmacies
        },
        noFieldsFilledMsg() {
          return errorSearchLabel()
        },

      },
      created() {
        this.filterParams = this.$route?.params ?? null
        if(!isEmpty(this.filterParams)) this.searchNewCeliacStores(this.filterParams)
        if(isEmpty(this.celiacStoresTypes)) this.getCeliacStoresTypes()
      },
      methods:{
        searchNewCeliacStores(params){
          this.isNewSearch = true
          this.areMoreStores=false
          this.areMorePharmacies=false
          this.storesList = [];
          this.storeOffset = 0;
          this.pharmacyOffset = 0;
          this.isLoading=true
          if(!params){
            this.isLoading = false
            return
          }
          this.isNewSearch = true
          this.filterParams=params
          this.searchStores()
        },
        async getCeliacStoresTypes(){
          let typeListStoresResponse = await getCeliacStoresTypes()
          let storesTypes = typeListStoresResponse.data
          if(!isEmpty(storesTypes)) this.celiacStoresTypes = storesTypes.push(PHARMACIES_TYPE)
          this.$store.dispatch('setCeliacStoresTypes', {types: this.celiacStoresTypes});
        },

        loadMoreResults(){
          this.isNewSearch=false
          this.isLoadingMoreItems = true

          this.searchStores();
        },
        fullsizeMap(val){
          this.viewFullsizeMap=val
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
            tipologia:!isEmpty(params.type) ? params.type.value : null,
            limit: LIMIT,
            offset: this.storeOffset
          };
        },
        setPharmaciesQueryParams(params){
          this.userCoords = params.address ? params.address.coords : null
          let lat = this.userCoords ? this.userCoords.lat : null;
          let lon = this.userCoords ? this.userCoords.lon : null;
          return {
            latitudine: lat,
            longitudine:lon,
            distanza:params.distance,
            dati_aggiuntivi_celiachia:true,
            s: !isEmpty(params.name) ? params.name : null,
            tipologia:!isEmpty(params.type) ? params.type.value : null,
            limit: LIMIT,
            offset: this.pharmacyOffset
          };
        },

        mapTypeList(list){
          let mappedList = list.map(item =>{
            let typeLabel = this.celiacStoresTypes.find(type => item.tipo_codice === type.codice )
            if(typeLabel){
              item.tipologia = typeLabel.descrizione
              return item
            }
            return null
          })
          return mappedList
        },
        async searchPharmacies(searchMore){

            let queryParams = this.setPharmaciesQueryParams(this.filterParams);
            let pharmaciesPromise = await getPharmacies({_no5XXRedirect: true, params: queryParams})
            let pharmaciesResponse = pharmaciesPromise.data
            let mappedList = pharmaciesResponse.map(pharmacy => {
              pharmacy.tipologia = PHARMACIES_TYPE.descrizione
              pharmacy.tipo_codice = PHARMACIES_TYPE.codice
              return pharmacy
            })
            if(searchMore){
              this.pharmaciesList.concat(mappedList)
            }else{
              this.pharmaciesList = mappedList
            }

            let headers = pharmaciesPromise.headers;

            let xPage = parseInt(headers['x-page']);
            let xTotalPages = parseInt(headers['x-total-pages']);
            if(xPage < xTotalPages){
              this.pharmacyOffset = this.pharmacyOffset + LIMIT;
            }

            this.areMorePharmacies = xTotalPages > xPage
            //mostrare almeno 5 farmacie se ce ne sono altre
            if( this.pharmaciesList.length<6 && this.areMorePharmacies){
              this.searchPharmacies(true)
            }
          },
        async searchCeliacStores(){
              let queryParams = this.setQueryParams(this.filterParams);
              let celiacStoresResponse = await getCeliacStores({_no5XXRedirect: true, params: queryParams})
              this.celiacList = this.mapTypeList(celiacStoresResponse.data)
              if (this.celiacList.length > 0) {
                let headers = celiacStoresResponse.headers;
                let xPage = parseInt(headers['x-page']);
                let xTotalPages = parseInt(headers['x-total-pages']);
                if (xPage < xTotalPages) {
                  this.storeOffset = this.storeOffset + LIMIT;
                }
                this.areMoreStores = xTotalPages > xPage
            }
        },
        async searchStores(){
          this.uploadNewElements = true;
          this.celiacList =[]
          this.pharmaciesList =[]
          try{
            if(!this.isPharmacyType) {
              if(this.isNewSearch || this.areMoreStores)
                await  this.searchCeliacStores()
            }
            if(this.isPharmacyType || this.isNoType){
              if(this.isNewSearch || this.areMorePharmacies)
                await this.searchPharmacies()
            }
          }catch (e) {

          }finally{
            let newList =  []
            if(!isEmpty(this.celiacList) )
              newList = this.celiacList
            if(!isEmpty(this.pharmaciesList))
              newList = newList.concat(this.pharmaciesList)


            if(this.isNewSearch){
              this.storesList = newList
            }else{
              this.storesList = this.storesList.concat(newList)
            }

            this.isLoading=false;
            this.isLoadingMoreItems=false
            this.uploadNewElements=false;
          }

        },
        invalidFilters(val) {
          this.isInvalidSearch = val
        },



      }
    }
</script>

<style scoped>

</style>
