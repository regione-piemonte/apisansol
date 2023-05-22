<!--
 SPDX-License-Identifier: EUPL-1.2
 Copyright Regione Piemonte - 2023
-->

<template>
  <q-card
    v-on="listeners"
    v-bind="attrs"
    flat
  >
    <q-card-section class="no-padding">

      <div class="row items-center q-col-gutter-x-xl">
        <div class="col-12 col-md-4">
          <q-input
            v-model="name"
            label="Nome farmacia"
            bottom-slots
            @input="onInputName"
            clearable
          />
        </div>
        <div class="col-12 col-sm-6 col-md-4">
          <lms-address-form v-model="address" label="Vicino a"/>
        </div>
        <div class="col-12 col-sm-6 col-md-4">
          <q-field
            label="Distanza"
            stack-label
            borderless
          >
            <template v-slot:control>
              <q-slider
                v-model="distance"
                :min="0"
                :max="20"
                label
                :label-value="distance + ' km'"
                label-always
                style="margin-top: 20px"
              />
            </template>
          </q-field>
        </div>
      </div>

      <lms-buttons  class="q-py-md ">
        <lms-button v-if="!noButtons" @click="searchItems" :loading="loading">
          Cerca
        </lms-button>
        <lms-button v-else @click="searchItems"  :loading="loading">Applica
        </lms-button>
      </lms-buttons>
    </q-card-section>
    <q-card-section style="min-height: 60px" v-if="noFiltersErr">
      <q-banner class="q-banner--negative">
        <template v-slot:avatar>
          <q-icon name="warning" size="md"/>
        </template>
        <p class="text-body1 no-margin">È necessario inserire il nome della farmacia o un indirizzo valido</p>
      </q-banner>
    </q-card-section>
  </q-card>
</template>

<script>
import {DEFAULT_DISTANCE, GEOPOSITION_LABEL} from "src/services/config";
import {mapSuggestedAddresses, normalizeLoccsiPlaces} from "src/services/business-logic";

import {getSuggestedAddress} from "src/services/api";
import {apiErrorNotify, apiErrorNotifyDialog, isEmpty} from "src/services/utils";
import LmsAddressForm from "components/core/LmsAddressForm";

export default {
  name: "FarabPharmacySearchForm",
  components: {LmsAddressForm},
  props:{
    defaultFilters: {type:Object, required:false, default:null},
    resetFilters: {type:Object, required:false, default:null},
    noButtons:{type:Boolean, required:false, default:false},
    loading:{type:Boolean, required:false, default:false}
  },
  data(){
    return{
      name:'',
      address:'',
      isSearchFinished:false,
      pharmaciesList: [],
      distance: 0,
      suggestedAddressList: null,
      onSearchingAddress: false,
      isOpenFilter: true,
      gettingLocation: false,
      geoPositionLabel: GEOPOSITION_LABEL,
      noFiltersErr:false
    }
  },
  watch:{
    address:{
      handler(val,oldVal){
        this.distance = val?.coords ? DEFAULT_DISTANCE : 0
      }
    }
  },
  created() {
    if(this.defaultFilters?.name || this.defaultFilters?.address){
      this.name= this.defaultFilters?.name
      this.address= this.defaultFilters?.address
      this.distance= this.defaultFilters?.distance
    }else{
      if(this.userAddress) this.address = this.userAddress
      this.distance = this.address?.coords ? DEFAULT_DISTANCE : 0
    }
  },
  computed: {
    listeners() {
      const {...listeners} = this.$listeners;
      return listeners;
    },
    attrs() {
      // eslint-disable-next-line no-unused-vars
      const {...attrs} = this.$attrs;
      return attrs;
    },
    userAddress() {
      return this.$store.getters["getUserAddress"];
    },
    suggestedAddressOptions() {
      return mapSuggestedAddresses(this.suggestedAddressList)
    },
    isGeolocation(){
      return this.address?.isGeolocated
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


    cleanAddress() {
      this.address = null;
    },
    onInputName(){
      if(this.name)
       this.address = null;
    },
    searchItems(){
      if(!this.name && !this.address){
        this.noFiltersErr = true
        return
      }
      this.noFiltersErr =false

      let filters={
        address: this.address,
        name: this.name,
        distance: this.distance
      }
      this.$emit('search', filters)
     }
  }
}
</script>

<style scoped>

</style>
