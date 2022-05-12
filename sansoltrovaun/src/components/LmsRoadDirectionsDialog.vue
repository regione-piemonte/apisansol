<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-dialog ref="roadDirectionsDialog"  :value="value" :maximized="$q.screen.lt.md"  @hide="$emit('close-dialog', false)">
    <q-card class="no-scroll"  :class="{ 'minWidthCard' : $q.screen.gt.sm }">
      <q-toolbar>
        <q-toolbar-title class="q-ma-md"><strong>Indicazioni stradali</strong></q-toolbar-title>
        <q-btn flat round dense icon="close" v-close-popup />
      </q-toolbar>
      <q-card-section class="q-pt-none">
        <div>
          <q-select
            v-model="departure"
            clearable
            :loading="onSearchingDeparture"
            use-input
            hide-selected
            fill-input
            no-error-icon
            hide-dropdown-icon
            bottom-slots
            input-debounce="0"
            label="Partenza"
            :options="suggestedDepartureOptions"
            @filter="filterByAddress"
            @filter-abort="abortFilterByAddress"
            @clear="cleanAddress"
            :behavior="$q.platform.is.ios === true ? 'dialog' : 'menu'"
            :error="$v.departure.$error"
            error-message="Inserisci indirizzo dall'elenco o condividi la posizione"
          >
            <template v-slot:append>
              <q-avatar class="cursor-pointer" @click="locateUser(true)">
                <q-icon name="gps_fixed" size="md" color="primary"/>
              </q-avatar>
            </template>
          </q-select>

        </div>

        <div>
          <q-field label="Arrivo" stack-label>
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="0">{{arrivalAddress.label}}</div>
            </template>
          </q-field>
        </div>
      </q-card-section>
      <q-card-actions align="right" class="q-ma-md">
        <lms-buttons>
          <lms-button @click="goToRoadDirections">Scopri su Google Maps</lms-button>
        </lms-buttons>
      </q-card-actions>
    </q-card>

  </q-dialog>
</template>

<script>
  import {apiErrorNotify, deepClone, isEmpty, orderBy} from "../services/utils";
  import {getSuggestedAddress} from "../services/api";
  import {mapSuggestedAddresses, normalizeLoccsiPlaces} from "../services/business-logic";
  import {openURL} from "quasar";
  const GEOPOSITION_LABEL = "LA TUA POSIZIONE";
  export default {
        name: "LmsRoadDirectionsDialog",
        props:{
            value:{type:Boolean, required: true, default:false},
            arrivalAddress:{type:Object, default:null}
        },
      validations: {
        departure:{}
      },
      data(){
          return{
            departure:null,
            departureLabel:'',
            arrival:null,
            onSearchingDeparture:false,
            suggestedDepartureList:[],
            gettingLocation:false,
          }
      },
    created() {
      this.getDefaultDeparture()
    },
    computed:{
          userAddress(){
            return this.$store.getters["getUserAddress"];
          },
      isGeolocation(){
        return this.departure?.isGeolocated
      },
      suggestedDepartureOptions() {
         return mapSuggestedAddresses(this.suggestedDepartureList)
        },
      },
    methods:{
          getDefaultDeparture(){
            if(this.userAddress){
              this.departure =this.userAddress
            }else{
              this.locateUser()
            }

          },
      async filterByAddress(val, update, abort){

        if (val.length < 2 || isEmpty(val)) {
          this.suggestedDepartureList = []
          abort();
          return;
        }
        this.onSearchingDeparture = true;
        update()
        let addressList = []
        try {
          let params = {indirizzo: val};
          let addressResponse = await getSuggestedAddress({
            _no5XXRedirect: true,
            params: params
          });
          addressList = normalizeLoccsiPlaces(addressResponse.data);
        } catch (e) {

        } finally {
          update(() => {
            this.suggestedDepartureList = addressList
            this.onSearchingDeparture = false;
            },
          );
        }

      },
      abortFilterByAddress() {
      },
      async locateUser(isGettingLocation = false) {
        if(this.isGeolocation){
          return
        }
        this.gettingLocation = true;
        try{
          let currentPosition = await this.$getLocation({enableHighAccuracy: true});

          this.departure = {
            label: GEOPOSITION_LABEL,
            coords:{
              lat: currentPosition.lat,
              lon: currentPosition.lng
            },
            isGeolocated:true
          }
          this.departureLabel= GEOPOSITION_LABEL
          this.gettingLocation = false;

        }catch(e){
          if(isGettingLocation){
            apiErrorNotify({
              error: e,
              message: "Non è stato possibile rilevare la posizione."
            });
          }
          // console.log('e', e)

        }
      },
      roundFloatCoords(coord){
        return Number.parseFloat(coord).toFixed(4)
      },
      cleanAddress() {
        this.departure = '';
      },

      goToRoadDirections(){
        let origin= this.isGeolocation ? `${this.departure.coords.lat},${this.departure.coords.lon}` : encodeURI(this.departure.label)
        let  destination= encodeURI(this.arrivalAddress.address)
        let url =`https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`
        openURL(url)
      }
    }
    }
</script>

<style scoped>

</style>
