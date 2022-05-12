<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="csi-doctor-search-form" >
      <q-item class="no-padding">
        <q-item-main>
          <q-field
            class="q-my-md"
            >
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
          <q-field class="q-my-md"
                    v-if="!isMap">
            <div class="row flex items-center justify-between">
              <q-search
                v-if="!isGeoLocation"
                :error="$v.userAddressField.$error"
                v-model="userAddressField"
                no-icon
                class="col-11"
                type="text"
                clearable
                float-label="Inserisci indirizzo o comune"
                @input="addressInput"
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
                         v-if="!isGeoLocationLoading"
                     class="csi-icon--md "
                     color="primary"
                       @click.native="getLocation()"
                  >
                     <q-tooltip>La tua posizione</q-tooltip>
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
              <div v-if="!$v.userAddressField.suggest">Indirizzo non valido. Seleziona uno tra quelli suggeriti.</div>

            </template>
          </q-field>

          <q-field class="q-my-md">
            <q-select
              :readonly="getDoctorType && !isFreeSearch"
              float-label="Tipo di medico"
              v-model="selectedDoctorType"
              :options="doctorTypeList"
              clearable=""
              :value-field="v => v.label"
            />
          </q-field>

          <div class="row gutter-x-lg q-my-md">
            <q-field class="q-mb-md col-xs-12 col-md-6">
              <q-select
                float-label="Sesso"
                v-model="selectedDoctorGender"
                :options="genderList"
                clearable=""
              />
            </q-field>
            <q-field class=" q-mb-md col-xs-12  col-md-6 q-pt-none">
              <div class="q-caption  q-py-sm">Distanza (km)</div>
              <div class="row">
<!--                <span class="col-1 text-left">0</span>-->
                <q-slider label class="col-11 q-ma-none" color="primary" v-model="distance" :min="0" :max="20"  />
                <span class="col-1 text-right">{{distance}}</span>
              </div>
            </q-field>
          </div>
        </q-item-main>
      </q-item>
      <div class="row justify-between q-my-sm gutter-x-md">
        <div class="col-8 text-negative"><p v-show="noFieldsFilled">È necessario inserire il nome del medico o un indirizzo valido</p></div>
        <div class="col-4" align="right">
          <q-btn outline color="primary" @click="filterDoctors" :loading="!searchFinished && isLoading" >Cerca</q-btn>
        </div>
      </div>
  </div>
 </template>


<script>
  import {deepClone, isEmpty, orderBy} from "@services/global/utils";
 import {getSuggestDoctors} from "@services/api/change-doctor";
 import {capitalize} from "@filters/cases";
 import {getSuggestedAddress} from "@services/api/cross";
  import {
     normalizeLoccsiCities,
    normalizeLoccsiPlaces,
    normalizeLoccsiRoads
  } from "@services/change-doctor/business-logic";
  import {notifyError} from "@services/api/utils";


 const DOCTOR_GENDER= [
   {label: 'Maschio', value: 'M'},
   {label: 'Femmina', value: 'F'},
 ];

 export default {
   name: 'CsiDoctorFilterSearchForm',
   components: {},
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
   data() {
     return {
       isLoading: false,
       distance: null,
       offset:0,
       lat:null,
       lon:null,
       doctorName:null,
       selectedDoctorType: '',
       genderList: DOCTOR_GENDER,
       selectedDoctorGender:null,
       addressField:'',
       city:'',
       userAddressField :'',
       userAddressObject: null,
       userAddressList:null,
       afterSearch:false,
       //liste di ricerca:
       doctorsListResults : null,
       doctorNameOptions:null,
       isFiltering: false,
       isDoctorsResults : false,
       areNoSuggestions:false,
       noFieldsFilled:false,
       fieldsErrors:false,
       isGeoLocation:false,
       isGeoLocationLoading:false
     }
   },
   props:{
     searchFinished: {type: Boolean, default: false},
     isFreeSearch:{type: Boolean, default: true},
     defaultFields:{type:Object, default:{}},
     isMap: {type: Boolean, required: false, default: false},
   },
   computed:{
     cf(){
       return this.$store.getters['changeDoctor/getTaxCode']
     },
     userAge(){
       return this.$store.getters['changeDoctor/getUserAge']
     },
     doctorTypeList(){
       const doctorTypes =  this.$store.getters['changeDoctor/getDoctorTypes'];
       let list = deepClone(doctorTypes);
       if(list){
         list = list.map(t => ({label: capitalize(t.descrizione), value: t.id}))
       }

       return list
     },

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
       if(this.userAddressField === '' || this.userAddressField === null) return true;
       else return false
     },


   },
   created() {
     this.setDefaultFields()

   },
   methods: {
     setDefaultFields(){
       let { indirizzo, lat, lon, distanza,  sesso, tipologia, dottore, geolocalizzazione} = this.defaultFields;
       let defaultDoctorType = null
       if(this.doctorTypeList && this.doctorTypeList.length>0 && this.userAge && !this.isFreeSearch){
         if(this.userAge < 6){
           defaultDoctorType =  this.doctorTypeList.find(t => t.value === this.$config.changeDoctor.doctorsType.PLS).value;
         }
         if(this.userAge > 16){
           defaultDoctorType =  this.doctorTypeList.find(t => t.value === this.$config.changeDoctor.doctorsType.MMG).value;
         }

       }


       this.lat = lat ? lat : null
       this.lon = lon ? lon : null
       this.userAddressField = indirizzo
       this.distance = distanza ? Number(distanza) : 2;
       this.doctorName = dottore ? dottore : null;
       this.selectedDoctorType = tipologia ? tipologia : defaultDoctorType;
       this.selectedDoctorGender = sesso ? sesso : null;
       this.isGeoLocation = geolocalizzazione;

       if(this.lat &&  this.lon)
         this.userAddressObject = {
           lat: this.lat,
           lon: this.lon
         };


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
       this.isLoading = true;
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
       this.$emit('set-filters', params);
       this.$emit('invalid-search', false);
     },
     setFilterQuery(){
       let params = null;
       let lat = (this.userAddressObject) ? this.userAddressObject.lat : null;
         let lon = (this.userAddressObject) ? this.userAddressObject.lon : null;
         params = {
           indirizzo: !isEmpty(this.userAddressField) ? this.userAddressField : null,
           comune:'',
           lat: lat,
           lon:lon,
           distanza: this.distance,
           sesso: this.selectedDoctorGender,
           tipologia: this.selectedDoctorType,
           dottore: this.doctorName,
         };
       return params
     },

     // suggest indirizzi
     async onUserAddressSearch(terms, done){
       this.noFieldsFilled =false;
       this.userAddressObject= null;
       let params= {indirizzo: terms};
       let addressResponse = await getSuggestedAddress( { _no5XXRedirect: true, params: params});
       let options = addressResponse.data;
       if(!isEmpty(options)) options = normalizeLoccsiPlaces(options);
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
       this.userAddressField = ""
       this.userAddressObject = null
     },

     addressInput(){
       if(this.userAddressField === "") this.userAddressObject = null;
       this.afterSearch = false;
       this.$v.userAddressField.$touch()
     },

     async getLocation(){
       // if(this.isGeoLocation){
       //   return
       // }

       console.log('isGeoLocation')
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


<style lang="stylus">
  @require '~variables'

    .distance-disabled
        opacity: 0.5

</style>
