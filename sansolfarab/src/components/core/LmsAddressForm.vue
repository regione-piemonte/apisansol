<!--
 SPDX-License-Identifier: EUPL-1.2
 Copyright Regione Piemonte - 2023
-->

<template>
<div class="lms-address-form">
  <template v-if="!isGeolocation">
    <q-select
      v-bind="attrs"
      v-on="listeners"
      clearable
      use-input
      hide-selected
      fill-input
      no-error-icon
      hide-dropdown-icon
      bottom-slots
      input-debounce="300"
      :loading="onSearchingAddress"
      :options="suggestedAddressOptions"
      @filter="filterByAddress"
      @filter-abort="filterAbort"
      placeholder="Inserisci indirizzo, un comune o condividi la posizione"
      behavior="menu"
    >
      <template v-slot:append>
        <q-avatar class="cursor-pointer" @click="locateUser()">
          <q-icon name="gps_fixed" size="md" color="primary"/>
        </q-avatar>
      </template>
    </q-select>
  </template>
  <q-field
    v-else
    bottom-slots
    :value="geoPositionLabel"
    label="Inserisci indirizzo o località"
    stack-label
    clearable
    @clear="cleanAddress"
  >
    <template v-slot:control>
      <div class="self-center full-width no-outline" tabindex="0">{{ geoPositionLabel }}</div>
    </template>
  </q-field
  >
</div>
</template>

<script>
import {mapSuggestedAddresses, normalizeLoccsiPlaces} from "src/services/business-logic";
import {apiErrorNotify, apiErrorNotifyDialog, isEmpty, notifyError} from "src/services/utils";
import {getSuggestedAddress} from "src/services/api";
import {DEFAULT_DISTANCE, GEOPOSITION_LABEL} from "src/services/config";

export default {
name: "LmsAddressForm",
  props:{
    address:{type:Object, default:null}
  },
  data(){
    return{
      suggestedAddressList:[],
      onSearchingAddress:false,
      gettingLocation:false,
      geoPositionLabel: GEOPOSITION_LABEL,
      currentPosition: null
    }
  },
  computed:{
    listeners() {
      const { ...listeners } = this.$listeners;
      return listeners;
    },
    attrs() {
      const { ...attrs } = this.$attrs;
      return attrs;
    },
    isGeolocation(){
      return this.address?.isGeolocated
    },
    suggestedAddressOptions() {
      return mapSuggestedAddresses(this.suggestedAddressList)
    },
  },
  methods:{
    async filterByAddress(val, update, abort) {
      if (val.length < 2 || isEmpty(val)) {
        this.suggestedAddressList = []
        abort();
        return;
      }

      this.onSearchingAddress = true
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
            this.suggestedAddressList = addressList
            this.onSearchingAddress = false
          },
        );
      }
    },
   async setPosition(position){
     let currentPosition = position?.coords
     console.log("currentPosition", currentPosition)
     let address = {
       label: GEOPOSITION_LABEL,
       coords: {
         // lat: this.roundFloatCoords(currentPosition.lat),
         // lon: this.roundFloatCoords(currentPosition.lng)
         lat: currentPosition.latitude,
         lon: currentPosition.longitude
       },
       isGeolocated:true

     }
     console.log(address)
     this.$emit('input', address)
    },
    locateError(){
      notifyError("Non è stato possibile rilevare la posizione.")
    },
    async locateUser() {
      if (this.isGeolocation) {
        return
      }
      this.gettingLocation = true;
      try {
         // let currentPosition = await this.$getLocation({enableHighAccuracy: true});
        if(navigator && navigator.geolocation){
          await navigator.geolocation.getCurrentPosition(this.setPosition, this.locateError, {enableHighAccuracy :true});
        }

      } catch (e) {

        apiErrorNotifyDialog({
          error: e,
          message: "Non è stato possibile rilevare la posizione."
        });
      } finally {
        this.gettingLocation = false;
      }
    },
    roundFloatCoords(coord) {
      return Number.parseFloat(coord).toFixed(4)
    },
    cleanAddress() {
      this.$emit('input', null)
    },
    filterAbort(){
      this.onSearchingAddress = false
    },
    onInput(val){
      this.$emit('update:address', val)
    }
  }
}
</script>

<style scoped>

</style>
