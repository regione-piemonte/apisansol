<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <lms-page class="lms-page-home" padding>
    <lms-page-title no-back v-if="isHomepage">Che cosa stai cercando?</lms-page-title>
    <template v-if="isDefaultData">
      <div class="row items-center  q-mt-md"
           v-if="isHomepage"
           :class="{'justify-center q-col-gutter-x-xl': $q.screen.gt.md, 'justify-between q-col-gutter-x-md':$q.screen.lt.lg }">

        <div v-for="(item,index) in menuItems" :key="index" class="col-12 col-md-auto q-pb-md">
          <q-responsive :ratio="cardRatio" class="cardClass" :class="{'cardClassMobile' : $q.screen.lt.md}">
            <q-card
              class="bg-white lms-trova-un-card home cursor-pointer q-pa-sm text-center"
              @click="openFilter(item)"
              :class="{'active' : item.id===activeService}"
            >
              <q-card-section :horizontal="$q.screen.lt.md" class="no-padding items-center full-height">
                <q-card-section class="no-padding" :class="{'q-mt-md':$q.screen.gt.sm }">
                  <q-icon :size="$q.screen.gt.sm ? 'xl' : 'md'"
                          :name="`img:/statics/la-mia-salute/icone/${item.icon}.svg`"/>
                </q-card-section>
                <q-card-section class="no-padding" :class="{'q-mt-md':$q.screen.gt.sm }">
                  <div class="text-subtitle2" :class="{'q-ml-md text-left' :$q.screen.lt.md}">
                    <strong>{{item.title}}</strong></div>
                </q-card-section>
              </q-card-section>

            </q-card>
          </q-responsive>

        </div>
        <lms-search-form :value="isOpenFilter" :title="serviceTitle" homepage  @query-params="goToResults" @close-dialog="closeSearchForm"/>

      </div>
      <div v-else >
        <lms-scroll-horizontal
          :controls="$q.screen.md"
          draggable
          :classes="scrollHorizontalAlignment"
          v-if="menuItems"
        >
          <div v-for="(item,index) in menuItems"
               :key="index"
               class="q-py-md "
               :class="$q.screen.gt.md ? 'q-px-md' : 'q-px-sm'"
               ref="scrollingServiceCard"
               @click="scrollToService(index)">
            <router-link :to="item.route.path">
              <q-responsive :ratio="responsiveRatio" style="width: 180px">
                <q-card
                  class="bg-white lms-trova-un-card q-pa-md"
                  :class="{'active' : item===activeService}"
                >
                  <q-card-section horizontal class="items-center full-height">
                    <q-card-section class="no-padding q-mr-md">
                      <q-icon size="md" :name="`img:/statics/la-mia-salute/icone/${item.icon}.svg`"/>
                    </q-card-section>
                    <q-card-section class="no-padding">
                      <div class="text-subtitle2"><strong>{{item.title}}</strong></div>
                    </q-card-section>
                  </q-card-section>
                </q-card>
              </q-responsive>
            </router-link>
          </div>

        </lms-scroll-horizontal>
      </div>
      <router-view v-if="isHomepage"></router-view>
      <keep-alive v-else>
        <router-view></router-view>
      </keep-alive>
    </template>
    <lms-inner-loading :showing="!isDefaultData"/>
  </lms-page>
</template>

<script>
  import {
    DOCTORS as DOCTORS_ROUTE,
    DOCTORS,
    HEALTH_FACILITIES as HEALTH_FACILITIES_ROUTE,
    HOSPITALS
  } from 'src/router/routes'
  import LmsSearchForm from "../components/LmsSearchForm";
  import {getCeliacStoresTypes, getDoctorsTypes, getHealthFacilitiesTypes, getHospitalsTypes} from "../services/api";
  import {SERVICES, PHARMACIES_TYPE} from "src/services/config";
  import {isEmpty, normalizeAddress, scrollHorizontalToElement} from "../services/utils";
  import {getSuggestedAddress} from "../services/api";
  import {normalizeLoccsiCities, normalizeLoccsiPlaces, normalizeLoccsiRoads} from "../services/business-logic";
  import {NAVIGATION} from "../boot/navigation";


  export default {
    name: "PageHome",
    components: {
      LmsSearchForm,
    },
    data() {
      return {
        DOCTORS,
        services: SERVICES,
        PHARMACIES_TYPE,
        menuItems: NAVIGATION,
        activeService: '',
        isOpenFilter: false,
        queryParams: null,
        isHomepage: true,
        HOSPITALS,
        areResults: true,
        activeServiceRoute: null,
        selectedCard: null,
        isSearchFinished: false,
        foundItemsList: [],
        searchParams: {},
        pageToShow: null,
        isName: false,
        isAddress: false,
        isDistance: false,
        isType: false,
        name: '',
        address: '',
        type: '',
        distance: '',
        hospitalTypes: null,
        doctorsTypes: null,
        facilitiesTypes: null,
        celiacStoresTypes:null,
        isTypeSearched: false,
        isAddressSearched:false,
      }
    },

    watch: {
      $route: {
        immediate: true,
        deep: true,
        handler(newVal, oldVal) {
          this.activeServiceRoute = newVal.name
          if (this.activeServiceRoute === 'home') {
            this.activeService = null
            this.$store.dispatch('setActiveService', {service: null});
            this.isHomepage = true
          } else {

            if (!oldVal && this.$q.screen.lt.md) this.$store.dispatch('setIfFirstAccess', true)
            this.isHomepage = false
            this.activeService = this.menuItems.find(item => item.route.name === this.activeServiceRoute)
            this.$store.dispatch('setActiveService', {service: this.activeService});

          }

        }
      }

    },
    created() {
      this.searchParams = this.$route.query
      if (this.activeService) {
        this.isSearchFinished = true

      }
      this.getDefaultFormsParams()
    },
    computed: {
    isDefaultData(){
      return this.isTypeSearched && this.isAddressSearched
    },
      cardRatio() {
        if (this.$q.screen.gt.sm)
          return 1
        else
          return 16 / 9
      },
      iconSize() {
        if (this.$q.screen.gt.sm)
          return 56
        else
          return 'md'
      },
      responsiveRatio() {
        if (this.$q.screen.lt.md) return 3
        return 2
      },
      userDomicile() {
        return this.$store.getters["getUserDomicile"];
      },
      scrollHorizontalAlignment(){
       let justify = ' justify-center'
        let classes= 'row no-wrap items-center'
        return this.$q.screen.gt.md ? classes + justify : classes

      },
      serviceTitle(){
          return this.activeService ? this.activeService.title : ''
      }
    },
    methods: {
      async getDefaultFormsParams() {
        let typeListDoctorsPromise = getDoctorsTypes();
        let typeListFacilitiesPromise = getHealthFacilitiesTypes();
        let typeListHospitalsPromise = getHospitalsTypes();
        let typeListStoresPromise = getCeliacStoresTypes();
        let typeListDoctorsResponse = await typeListDoctorsPromise;
        this.doctorsTypes = typeListDoctorsResponse.data
        this.$store.dispatch('setDoctorTypes', {types: this.doctorsTypes});
        let typeListFacilitiesResponse = await typeListFacilitiesPromise;
        this.facilitiesTypes = typeListFacilitiesResponse.data
        this.$store.dispatch('setFacilitiesTypes', {types: this.facilitiesTypes});
        let typeListHospitalsResponse = await typeListHospitalsPromise;
        this.hospitalTypes = typeListHospitalsResponse.data
        this.$store.dispatch('setHospitalsTypes', {types: this.hospitalTypes});
        let typeListStoresResponse = await typeListStoresPromise;
        let storesTypes = typeListStoresResponse.data
        if(!isEmpty(storesTypes)) {
          storesTypes.push(PHARMACIES_TYPE)
          this.celiacStoresTypes = storesTypes
        }
        this.$store.dispatch('setCeliacStoresTypes', {types: this.celiacStoresTypes});
        this.isTypeSearched = true
        if (this.userDomicile)
          this.searchUserAddress()
        else
          this.isAddressSearched = true
      },

      async searchUserAddress() {
        let normalizedAddress = normalizeAddress(this.userDomicile.indirizzo)
        let onSearchAddress = `${normalizedAddress} ${this.userDomicile.desc_comune}`
        let userAddress = null
        try {
          let params = {indirizzo: onSearchAddress};
          let addressResponse = await getSuggestedAddress({
            _no5XXRedirect: true,
            params: params
          });
          let addressObject = addressResponse.data;
          let address = null;
          if (!isEmpty(addressObject)) {
            addressObject = normalizeLoccsiRoads(addressObject);
            address = addressObject.filter(address => address.comune === this.userDomicile.desc_comune.toUpperCase())[0];
            if (!address) {
              let cityQuery = {indirizzo: this.userDomicile.desc_comune};
              let cityResponse = await getSuggestedAddress({_no5XXRedirect: true, params: cityQuery});
              let cityObject = cityResponse.data;
              if (!isEmpty(cityObject)) {
                cityObject = normalizeLoccsiCities(cityObject);
                address = cityObject.filter(address => address.indirizzo === this.userDomicile.desc_comune.toUpperCase())[0]
              }
            }
            if(address)
              userAddress =  {
                  label: address.indirizzo,
                  value: address.id,
                  coords: {
                    lat: address.coordinate.coordinates[1],
                    lon: address.coordinate.coordinates[0]
                  }
                }

          }
          this.$store.dispatch('setUserAddress', {address: userAddress});
        } catch (e) {

        }finally{
          this.isAddressSearched = true
        }

      },
      openFilter(service) {

        let isSameService = (this.activeService === service)
        this.activeService = service
        this.$store.dispatch('setActiveService', {service: this.activeService});
        this.isOpenFilter = true
      },
      goToResults(params) {
        this.isOpenFilter=false

        let route = {
          name: this.activeService.route.name,
          params: params,
        };
        this.$router.push(route);

      },
      scrollToService(index){
        let card = this.$refs.scrollingServiceCard[index]
        scrollHorizontalToElement(card)
      },
      closeSearchForm(val){

        this.isOpenFilter = val
      }
    }
  };
</script>
<style lang="sass">
  .lms-page-home
    min-height: 500px
    .cardClass
      width: 155px

    .cardClassMobile
      width: 100%
      max-height: 80px



</style>
