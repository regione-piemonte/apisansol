<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-card :class="{ minWidthCard: $q.screen.gt.sm }">
    <q-toolbar class="bg-primary text-white">
      <q-toolbar-title>Nuovo indirizzo postale</q-toolbar-title>
      <q-btn flat round dense icon="close" v-close-popup />
    </q-toolbar>

    <q-card-section class="q-mt-md">
      <div class="row items-center q-col-gutter-lg">
        <div class="col-12 col-md-8">
          <q-select
            :disable="isChangedSuccess"
            ref="citySelect"
            v-model="city"
            clearable
            :loading="onSearchingCities"
            use-input
            hide-selected
            fill-input
            no-error-icon
            hide-dropdown-icon
            bottom-slots
            input-debounce="0"
            label="Comune"
            :options="suggestedCitiesOptions"
            @filter="filterByCity"
            @filter-abort="abortFilteredCity"
            :error="$v.city.$error"
            error-message="Inserisci un comune piemontese valido. Selezionane uno tra quelli suggeriti"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  Nessun comune piemontese trovato
                </q-item-section>
              </q-item>
            </template>
          </q-select>
<!--          <q-input-->
<!--            :disable="isChangedSuccess"-->
<!--            v-model="city"-->
<!--            type="text"-->
<!--            clearable-->
<!--            label="Comune"-->
<!--            bottom-slots-->
<!--            no-error-icon-->
<!--            :error="$v.city.$error"-->
<!--            error-message="Inserisci un comune valido"-->
<!--          />-->
        </div>

        <div class="col-12 col-md-4">
          <q-input
            :disable="isChangedSuccess  || !isCity"
            v-model="cap"
            type="text"
            mask="#####"
            clearable
            label="CAP"
            bottom-slots
            no-error-icon
            :error="$v.cap.$error"
            error-message="Inserisci un cap valido"
          />

        </div>

        <div class="col-12 col-md-8">

          <q-select
            :disable="isChangedSuccess || !isCity"
            ref="addressSelect"
            v-model="address"
            clearable
            :loading="onSearchingAddress"
            use-input
            hide-selected
            fill-input
            no-error-icon
            hide-dropdown-icon
            bottom-slots
            input-debounce="0"
            label="Indirizzo"
            :options="suggestedAddressOptions"
            @filter="filterByAddress"
            @filter-abort="abortFilteredAddress"
            :error="$v.address.$error"
            error-message="Inserisci un indirizzo valido. Selezionane uno tra quelli suggeriti"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  Nessun indirizzo trovato
                </q-item-section>
              </q-item>
            </template>
          </q-select>

        </div>
        <div class="col-12 col-md-4">
          <q-input
            :disable="isChangedSuccess  || !isCity"
            v-model="streetNumber"
            type="text"
            clearable
            bottom-slots
            label="Numero civico"
          />
        </div>
      </div>
    </q-card-section>
    <q-card-section v-show="isChangedSuccess">
      <q-banner  class="h-banner h-banner--info">
        Operazione eseguita con successo.
      </q-banner>
    </q-card-section>
    <q-card-actions align="right" class="q-pa-md q-mb-md">
      <lms-button
        v-if="!isChangedSuccess"
        :loading="isLoading"
        :block="$q.screen.lt.md"
        @click="saveNewAddress()"
        >Salva</lms-button
      >
      <lms-button
        v-else
        :block="$q.screen.lt.md"
        v-close-popup
        @click="closeDialog()"
        >OK</lms-button
      >
    </q-card-actions>
  </q-card>
</template>

<script>
import { required } from "vuelidate/lib/validators";
import {normalizeLoccsiCities, normalizeLoccsiRoads, orderBy} from "src/services/business-logic";
import { setNewUserAddress, getCities} from "src/services/api";
import {apiErrorNotify, isEmpty} from "src/services/utils";
import {capitalize} from "quasar/src/utils/format";
import {geocoding} from "../../services/api";

export default {
  name: "CsiChangeAddressDialog",
  data() {
    return {
      isLoading: false,
      address: "",
      streetNumber: "",
      cap: "",
      city: "",
      onSearchingCities: false,
      onSearchingAddress:false,
      suggestedCities: null,
      suggestedAddress:null,
      isChangedSuccess: false
    };
  },

  validations: {
    address: { required },
    cap: { required },
    city: { required }
  },
  computed: {
    cf() {
      return this.$store.getters["getTaxCode"];
    },
    userCodes() {
      return this.$store.getters["preventionScreening/getUserCodes"];
    },
    suggestedCitiesOptions() {
      let orderedCities = [];
      if (this.suggestedCities) {
        let cities = this.suggestedCities;
        let citiesOptions = [];
        citiesOptions = cities.map(city => {
          let label = city.indirizzo;
          return {label, value: city.id, _model: city}
          // citiesOptions = cities.map(city => {
          //   let label = capitalize(city.desc);
          //   return {label, value: city.codice_istat, _model: city}
          // });


        });
        orderedCities = orderBy(citiesOptions, ['label']);
      }
        return Object.freeze(orderedCities)
      },
    isCity(){
      return !isEmpty(this.city)
    },
    suggestedAddressOptions(){
      let orderedAddress = [];
      if (this.suggestedAddress) {
        let addresses = this.suggestedAddress;
        let addressOptions = [];
        addressOptions = addresses.map(address => {
          let label = address.indirizzo.split(',')[0];
          return {label, value: address.id, _model: address}

        });
        orderedAddress = orderBy(addressOptions, ['label']);
      }
      return Object.freeze(orderedAddress)
    }
  },

  methods: {
    async saveNewAddress() {
      this.$v.$touch();
      if (this.$v.$error) {
        return;
      }

      let params = {
        codice_interno: this.userCodes.codice_interno,
        codice_interno_prefisso: this.userCodes.codice_interno_prefisso
      };
      this.newAddress = {
        cod_comune: this.city.value,
        cap: this.cap.toString(),
        indirizzo: this.address.label,
        civico: this.streetNumber ?? ''
      };
      this.isLoading = true;
      try {
        let addressResponse = await setNewUserAddress(
          this.cf,
          this.newAddress,
          { params: params }
        );
        this.isLoading = false;
        this.isChangedSuccess = true;
      } catch (e) {
        this.isLoading = false;
        apiErrorNotify({
          error: e,
          message: "Non è stato possibile salvare il nuovo indirizzo."
        });
      }
    },

    closeDialog() {
      this.$emit("update-address", { newAddress: this.newAddress });
    },

    async filterByCity(val, update, abort){

       if (val.length < 2 || isEmpty(val)) {
         this.suggestedCities = null
         abort()
         return
       }
      this.onSearchingCities = true
      update()
      let params = {indirizzo: val};
      let options = []
       try {
         let addressResponse = await geocoding({_no5XXRedirect: true, params: params});
         options  = normalizeLoccsiCities(addressResponse.data)
       }catch (e) {

       }finally {
         update(() => {
           this.suggestedCities = options
           this.onSearchingCities = false
         })
       }
     },

     abortFilteredCity(){

     },

   async  filterByAddress(val, update, abort){
      if (val.length < 2 || isEmpty(val)) {
        this.suggestedAddress = null
        abort()
        return
      }

      this.onSearchingAddress = true
      update()
      let city = this.city.label
      let params = {indirizzo: val + ' ' + city};
      let options = []
      try{
        let addressResponse = await geocoding({_no5XXRedirect: true, params: params});
        let addressList = normalizeLoccsiRoads(addressResponse.data)
        options = addressList.filter(a => a.comune === city);

      }catch (e) {

      }finally {
        update(() => {
          this.suggestedAddress = options
          this.onSearchingAddress = false
        })
      }

    },
    abortFilteredAddress(){

    },
  }
};
</script>

<style lang="sass">
.minWidthCard
  min-width: 700px
</style>
