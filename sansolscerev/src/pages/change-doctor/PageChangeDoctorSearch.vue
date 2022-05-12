<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
    <q-page padding>
      <csi-page-title @back="goBack" title="Cerca un medico" class="q-mb-md"> </csi-page-title>
        <template v-if="doctorTypeList">

            <q-card class="bg-white csi-search-doctor q-my-lg">
              <q-card-main>
                <div class="row gutter-md">
                  <div class="col-md-6 col-xs-12 flex items-center justify-center">
                    <img src="statics/images/change-doctor/search-doctor.svg" alt="Cerca Medico" class="responsive">
                  </div>

                  <div class="col-md-6 col-xs-12">
                    <div class="full-height">

                        <h1 class="csi-h1">Cerca un medico</h1>
<!--                          <csi-doctor-search-form-->
<!--                            :search-finished="isSearchFinished"-->
<!--                            :is-homepage="true"-->
<!--                            @set-filters="searchDoctors"-->
<!--                            @invalid-search="isInvalidSearch"-->
<!--                           />-->

                      <div class="csi-doctor-search-form" >

                        <q-item class="no-padding">
                          <q-item-main>
                            <q-field class="q-my-md">
                              <q-search
                                :error="$v.doctorName.$error"
                                @input="$v.doctorName.$touch"
                                v-model="doctorName"
                                no-icon
                                type="text"
                                clearable
                                float-label="Inserisci nome medico">
                                <q-autocomplete
                                  :min-characters="2"
                                  :debounce="400"
                                  :max-results="100"
                                  @search="onDoctorNameSearch"
                                  @selected="onDoctorNameSelected"
                                  :value-field="v => v.label"
                                />
                              </q-search>
                              <template slot="error-label" >
                                <div v-if="!$v.doctorName.noSuggestions">Inserire un nome valido.</div>
                              </template>
                            </q-field>
                            <q-field class="q-my-md">
                              <div class="row flex items-center justify-between">
                                <q-search
                                  :error="$v.userAddressField.$error"
                                  v-model="userAddressField"
                                  no-icon
                                  type="text"
                                  clearable
                                  class="col-11"
                                  float-label="Inserisci indirizzo o comune"
                                  @input="addressInput"
                                  v-if="!isGeoLocation"
                                >
                                  <q-autocomplete
                                    :min-characters="2"
                                    :debounce="400"
                                    :max-results="100"
                                    @search="onUserAddressSearch"
                                    @selected="onUserAddressSelected"
                                    :value-field="v => v.label"
                                  />
                                </q-search>
                                <q-input
                                  v-else
                                  type="text"
                                  :error="$v.userAddressField.$error"
                                  v-model="userAddressField"
                                  class="col-11"
                                  readonly
                                  float-label="Inserisci indirizzo o comune"
                                  :after="[{icon: 'cancel', content:true, handler: cleanGeoPosition } ]"
                                />

                                <span class="q-pt-md  col-1 text-right cursor-pointer" >
                                   <q-icon name="my_location"
                                           class="csi-icon--md "
                                           color="primary"
                                          @click.native="getLocation()"
                                           v-if="!isGeoLocationLoading"
                                   >
                                     <q-tooltip>La tua posizione</q-tooltip>
<!--                                      <q-popover fit anchor="top left" self="bottom right"  v-if="!disableDistanceIcon">-->
<!--                                          <div class=" q-pa-md" style="min-width:250px">-->
<!--                                            <span class="q-caption  q-py-sm">Distanza (km)</span>-->
<!--                                            <div class="row">-->
<!--&lt;!&ndash;                                              <span class="col-1 text-left">0</span>&ndash;&gt;-->
<!--                                              <q-slider class="col-11 q-ma-none q-pr-sm" color="primary" v-model="distance" :min="0" :max="20"  label />-->
<!--                                              <span class="col-1 text-right">{{distance}}</span>-->
<!--                                            </div>-->
<!--                                          </div>-->
<!--                                      </q-popover>-->
                                    </q-icon>
                                  <q-spinner-mat
                                    v-else
                                    color="primary"
                                  >
                                    <q-tooltip>Ricerca della posizione in corso</q-tooltip>
                                  </q-spinner-mat>
                                 </span>

                              </div>

                              <template slot="error-label">
                                <div v-if="!$v.userAddressField.suggest">
                                  Indirizzo non valido. Seleziona uno tra quelli suggeriti.</div>
                              </template>
                            </q-field>

                            <q-field class="q-mb-md">
                              <q-select
                                float-label="Sesso"
                                v-model="selectedDoctorGender"
                                :options="genderList"
                                clearable=""
                              />
                            </q-field>


                            <q-field class="q-my-md">
                              <div class="flex items-center justify-start q-mb-md">
                                <span class="q-pr-lg q-my-sm">Mostra</span>
                                <q-btn-toggle
                                  no-caps
                                  size="md"
                                  text-color="primary"
                                  v-model="selectedDoctorType"
                                  toggle-color="primary"
                                  :options="doctorTypeList"
                                />
                              </div>


                            </q-field>

                          </q-item-main>
                        </q-item>
                        <div class="row justify-end q-my-sm">
                          <q-btn  color="primary" @click="filterDoctors" :loading="isSearching" >Cerca</q-btn>

                        </div>
                      </div>


                    </div>
                  </div>
                </div>
              </q-card-main>
            </q-card>

          <q-alert type="negative" class="q-my-md" v-if="noFieldsFilled">
            È necessario inserire il nome del medico o un indirizzo valido.
          </q-alert>
          <!--      LOADER-->
          <csi-inner-loading :visible="isLoading" block/>

          <div class="q-mt-xl text-right">
            <router-link :to="$routes.CHANGE_DOCTOR.POLICY"
                         class="text-italic  csi-link ">
              Privacy e condizioni d'uso
            </router-link>
          </div>

     </template>

      <csi-inner-loading :visible="!doctorTypeList" />

    </q-page>
</template>

<script>


import CsiDoctorItem from "components/change-doctor/CsiDoctorItem";
import CsiCardItem from "components/global/common/CsiCardItem";
  import CsiRevokeAssistanceModal from "components/change-doctor/CsiRevokeAssistanceModal";
  import CsiMonitoringModal from "components/change-doctor/CsiMonitoringModal";

import CsiPageTitle from "components/global/common/CsiPageTitle";
import {getSuggestDoctors} from "@services/api/change-doctor";
import {getSuggestedAddress} from "@services/api/cross";
import {capitalize} from "@filters/cases";
import {deepClone, isEmpty, orderBy} from "@services/global/utils";
import {notifyError} from "@services/api/utils";
import {normalizeLoccsiPlaces} from "@services/change-doctor/business-logic";
const DOCTOR_GENDER= [
  {label: 'Maschio', value: 'M'},
  {label: 'Femmina', value: 'F'},
];

export default {
  name: 'PageChangeDoctorSearch',
  components: {CsiMonitoringModal, CsiRevokeAssistanceModal, CsiDoctorItem, CsiCardItem, CsiPageTitle},
  data() {
    return {
      name: '',
      place: '',
      isLoading: false,
      isSearching: false,
      invalidSearch: false,
      noFieldsFilled:false,
      areNoSuggestions:false,
      distance: 2,
      doctorName:null,
      selectedDoctorType: null,
      genderList: DOCTOR_GENDER,
      selectedDoctorGender:null,
      userAddressField :'',
      userAddressObject: null,
      userAddressList:null,
      afterSearch:false,
      //liste di ricerca:
      doctorsListResults : null,
      doctorNameOptions:null,
      isFiltering: false,
      isDoctorsResults : false,
      isGeoLocation: false,
      isGeoLocationLoading:false
    }
  },
  computed: {
    user() {
      return this.$store.getters['global/user']
    },
    userInfo(){
      return this.$store.getters['changeDoctor/getUserInfo']
    },
    doctorTypeList(){
      const doctorTypes =  this.$store.getters['changeDoctor/getDoctorTypes'];
      let list = deepClone(doctorTypes);
      if(list){
        let allTypes= [{descrizione: "Tutti", id: ''}];
        list.map(m => {
          if(m.id === this.$config.changeDoctor.doctorsType.PLS) m.descrizione = this.$config.changeDoctor.doctorsTypeLabel.PLS;
          if(m.id === this.$config.changeDoctor.doctorsType.MMG) m.descrizione = this.$config.changeDoctor.doctorsTypeLabel.MMG
        });
        list = allTypes.concat(list);
        list = list.map(t => ({label: capitalize(t.descrizione), value: t.id}))
      }
      return list
    },
    // isUserLogged() {
    //   return this.$store.getters['global/isUserLogged']
    // },
    userAddressOptions(){
      let orderedAddresses = [];
      if(this.userAddressList){
        let addresses = this.userAddressList;
        let addressOptions = addresses.map(a => {
          let label = a.indirizzo;
          return {label, value: a.id}
        });
        orderedAddresses = orderBy(addressOptions, ['label']);
      }

      return orderedAddresses
    },
    disableDistanceIcon(){
      if(navigator.geolocation)
        return false;
      else
       return true
      // return (this.userAddressField === '' || this.userAddressField === null)
    },
  },
  created() {
    if(!this.userInfo)  this.$router.replace(this.$routes.CHANGE_DOCTOR.HOME);
  },
  validations(){
    return{
      doctorName: {
        noSuggestions: v=>  !(this.areNoSuggestions && !!v),
        noFields :v=>   !this.noFieldsFilled
      },
      userAddressField:{
        suggest: v=>  !(!!v && this.userAddressObject === null && this.afterSearch),
        noFields : v=>  !this.noFieldsFilled
      },
    }
  },
  methods: {
    goBack(){
      this.$router.go(-1)
    },
    //suggest nome medico
    async onDoctorNameSearch(terms, done) {
      this.noFieldsFilled =false;
      let params= {s : terms};
      let namesResponse = await getSuggestDoctors({ _no5XXRedirect: true, params: params});
      let options = namesResponse.data.map(s => ({label: s, value: s}));
      if(options.length===0)
        this.areNoSuggestions = true;
      else
        this.areNoSuggestions = false;

      done(options)
    },
    onDoctorNameSelected(item, keyboard) {
      this.doctorName = item.label
    },

    addressInput(){
      if(this.userAddressField === "") this.userAddressObject = null;
      this.afterSearch = false;
      this.$v.userAddressField.$touch()
    },

    async onUserAddressSearch(terms, done){
      this.noFieldsFilled =false;
      this.userAddressObject= null;
      let params= {indirizzo: terms};
      let addressResponse = await getSuggestedAddress({ _no5XXRedirect: true, params: params});
      let options = addressResponse.data;
      if(!isEmpty(options)) options  = normalizeLoccsiPlaces(options);
      this.userAddressList = options;
      this.afterSearch = true;
      let result = this.userAddressOptions;
      // Autoselezione in caso di un singolo risultato che fa match esatto con quanto scritto dall'utente
      if (result.length === 1) {
        let item = result[0];
        if (terms.toUpperCase() === item.label.toUpperCase()) {
          this.onUserAddressSelected(item);
          done([])
        }
      }
      done(result)
    },
    onUserAddressSelected(item, keyboard) {
     let selectedAddress = this.userAddressList.find(a => a.id === item.value);
      this.userAddressObject = {
        lat: selectedAddress.coordinate.coordinates[1],
        lon: selectedAddress.coordinate.coordinates[0]
      };
      this.userAddressField= item.label
    },

    filterDoctors(){
      if(isEmpty(this.doctorName) && isEmpty(this.userAddressObject)){
        this.noFieldsFilled =true;
        return
      }
      if(this.$v.$invalid){
        return
      }
      this.noFieldsFilled =false;
      this.isSearching = true;
      this.doctorsListResults = null;
      this.isDoctorsResults = false;
      // if(!this.userAddressObject){
      //   if(this.userAddressField && this.userAddressField.length>0){
      //     this.isLoading = false;
      //     this.$emit('invalid-search', false);
      //     return
      //   }
      // }
      let params = this.setFilterQuery();
      this.isSearching = false;
      let route = {
        name: this.$routes.CHANGE_DOCTOR.SEARCH_DOCTOR_RESULTS.name,
        params:params

      };
      this.$router.push(route)
    },

    setFilterQuery(){
      let params = null;
      let lat = (this.userAddressObject) ? this.userAddressObject.lat : null;
      let lon = (this.userAddressObject) ? this.userAddressObject.lon : null;
      params = {
        indirizzo: this.userAddressField!=="" ? this.userAddressField : null,
        lat: lat,
        lon:lon,
        distanza: this.distance,
        sesso: this.selectedDoctorGender,
        tipologia: this.selectedDoctorType,
        dottore: this.doctorName,
        geolocalizzazione: this.isGeoLocation,
        isFreeSearch:true
      };


      return params
    },
    async getLocation(){
      if(this.isGeoLocation){
        return
      }
      try{
        this.isGeoLocationLoading = true;
        const coords = await this.$getLocation({
          enableHighAccuracy: true
        });

        this.userAddressField = "La mia posizione";
        this.isGeoLocation = true;
        this.userAddressObject = {
          lat: this.roundFloatCoords(coords.lat),
          lon: this.roundFloatCoords(coords.lng)
        };
        this.isGeoLocationLoading = false
      }catch(e){
        this.isGeoLocationLoading = false;
       notifyError(e, "Non è stato possibile rilevare la posizione.")
      }
    },
    roundFloatCoords(coord){
      return Number.parseFloat(coord).toFixed(4)
    },
    cleanGeoPosition(){
      this.userAddressField = '';
      this.userAddressObject = null;
      this.isGeoLocation = false
    },


  }

}
</script>
<style scoped lang="stylus">
  @require '~variables'
    .distance-disabled
       opacity: 0.5
    .csi-search-doctor
        .doctor-types
            .non-selectable
              .q-focus-helper
                  background : $primary
</style>
