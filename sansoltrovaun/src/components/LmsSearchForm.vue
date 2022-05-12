<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-dialog ref="searchFormDialog" :value="value" :maximized="$q.screen.lt.md"
            @hide="$emit('close-dialog', false)">
  <q-card flat class="q-pb-md" style="min-width: 80%">
      <q-toolbar class="q-px-lg">
        <q-toolbar-title class="q-my-md"><strong>{{title}}</strong></q-toolbar-title>
        <q-btn flat round dense icon="close" v-close-popup/>
      </q-toolbar>
        <q-card-section class="q-pa-lg">
          <template v-if="service=== servicesList.HOSPITALS">
            <lms-hospital-form
              :default-filters="defaultFilters"
              @set-name="setName"
              @set-type="setType"
              :reset-filters="filters"
              @is-valid="validationName"
            />
          </template>
          <template v-if="service=== servicesList.DOCTORS">
            <lms-doctors-form
              :default-filters="defaultFilters"
              @set-name="setName"
              @set-type="setType"
              :reset-filters="filters"
              @is-valid="validationName"
            />
          </template>
          <template v-if="service=== servicesList.PHARMACIES">
            <lms-pharmacies-form
              :default-filters="defaultFilters"
              @set-name="setName"
              :reset-filters="filters"
              @is-valid="validationName"
            />
          </template>
          <template v-if="service=== servicesList.FACILITIES">
            <lms-facilities-form
              :default-filters="defaultFilters"
              @set-name="setName"
              @set-type="setType"
              :reset-filters="filters"
              @is-valid="validationName"
            />
          </template>
          <template v-if="service=== servicesList.STORES">
            <lms-celiac-stores-form
              :default-filters="defaultFilters"
              @set-name="setName"
              @set-type="setType"
              :reset-filters="filters"
              @is-valid="validationName"
            />
          </template>
          <div class="row items-center q-col-gutter-x-xl">
            <div class="col-12 col-sm-6">
              <template v-if="!isGeolocation">
                <q-select
                  v-model="address"
                  clearable
                  use-input
                  hide-selected
                  fill-input
                  no-error-icon
                  hide-dropdown-icon
                  bottom-slots
                  input-debounce="0"
                  label="Vicino a"
                  :loading="onSearchingAddress"
                  :options="suggestedAddressOptions"
                  @filter="filterByAddress"
                  @filter-abort="abortFilterByAddress"
                  @input-value="setAddressLabel"
                  @input="setAddress"
                  @blur="setAddress"
                  @clear="cleanAddress"
                  :error="!isValidAddress"
                  placeholder="Inserisci indirizzo, un comune o condividi la posizione"
                  error-message="Inserisci indirizzo dall'elenco o condividi la posizione"
                  :behavior="$q.platform.is.ios === true ? 'dialog' : 'menu'"
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
                  <div class="self-center full-width no-outline" tabindex="0">{{geoPositionLabel}}</div>
                </template>
              </q-field
              >
            </div>
            <div class="col-12 col-sm-6">
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
                    @input="setDistance"
                  />
                </template>
              </q-field>
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right" class="q-px-md q-py-none">
          <lms-button v-if="homepage" @click="searchItems" :class="{'full-width' : $q.screen.lt.sm}" :loading="loading">Cerca
          </lms-button>
          <lms-button v-else @click="searchItems" class="full-width" :loading="loading">Applica
          </lms-button>
        </q-card-actions>

        <q-card-section style="min-height: 60px" v-if="noFieldsFilled">
          <q-banner class="h-banner h-banner--negative">
            <template v-slot:avatar>
              <q-icon name="warning" size="md"/>
            </template>
            <p class="text-body1 no-margin">{{noFieldsFilledMsg}}</p>
          </q-banner>
        </q-card-section>
      </q-card>
  </q-dialog>
</template>
<script>
  import LmsHospitalForm from "./hospitals/LmsHospitalsForm";
  import LmsDoctorsForm from "./doctors/LmsDoctorsForm";
  import LmsPharmaciesForm from "./pharmacies/LmsPharmaciesForm";
  import LmsFacilitiesForm from "./health-facilities/LmsFacilitiesForm";
  import {GEOPOSITION_LABEL, DEFAULT_DISTANCE, apiErrorNotify, deepClone, isEmpty, orderBy} from "../services/utils";
  import {getSuggestedAddress} from "../services/api";
  import {SERVICES, DOCTOR_TYPES_LABEL} from "src/services/config";
  import {errorSearchLabel, mapSuggestedAddresses, normalizeLoccsiPlaces} from "../services/business-logic";
  import LmsCeliacStoresForm from "./celiac-disease-stores/LmsCeliacStoresForm";


  export default {
    name: "LmsSearchForm",
    components: {
      LmsCeliacStoresForm,
      LmsFacilitiesForm, LmsPharmaciesForm, LmsDoctorsForm, LmsHospitalForm
    },
    props: {
      value:{type: Boolean, default: false},
      defaultFilters: {type: Object, required: false, default: null},
      loading: {type: Boolean, default: false},
      homepage: {type: Boolean, default: false},
      title:{type:String, default:''}
    },
    data() {
      return {
        GEOPOSITION_LABEL,
        DEFAULT_DISTANCE,
        servicesList: SERVICES,
        name: '',
        type: '',
        address: null,
        distance: 0,
        onSearchingName: false,
        suggestedNamesOptions: [],
        suggestedAddressList: null,
        onSearchingAddress: false,
        isSearchFinished: false,
        isFiltering: true,
        isOpenFilter: true,
        gettingLocation: false,
        geoPositionLabel: GEOPOSITION_LABEL,
        noFieldsFilled: false,
        isValidName: true,
        addressLabel: null,
        typeLabel: '',
        isSearched: false,
      }
    },
    watch: {
      defaultFilters: {
        immediate: true,
        handler(newVal, oldVal) {
          if (!isEmpty(newVal)) {
            let address = newVal.address ?? this.userAddress
            let distance = 0

            if(address){
              if(this.isFirstAccess){
                distance = newVal.distance > 0.5 ? newVal.distance : DEFAULT_DISTANCE

              }else{
                distance = newVal.distance > 0.5 ? newVal.distance : 0
              }
            }
            this.name = newVal.name
            this.type = newVal.type
            this.address = address
            this.distance = distance
            if (this.type) this.typeLabel = this.type.label
            if (!isEmpty(this.address?.coords)){
              this.addressLabel = this.address.label
            }
          }

        }
      },
    },
    computed: {
      isSomeFilter() {
        return this.isName || this.isType || this.isAddress || this.isDistance
      },
      isGeolocation(){
        return this.address?.isGeolocated
      },
      isName() {
        return !isEmpty(this.name)
      },
      service() {
        return this.$store.getters["getActiveService"];
      },

      noFieldsFilledMsg() {
       return errorSearchLabel()
      },
      userAddress() {
        return this.$store.getters["getUserAddress"];
      },
      isType() {
        return !isEmpty(this.type) && !isEmpty(this.type.value)
      },

      // addressLabel(){
      //   return this.isAddress ? this.address.label : ''
      // },
      isAddress() {
        return !isEmpty(this.address?.coords)
      },
      isDistance() {
        return (this.distance > 0.5)
      },
      suggestedAddressOptions() {


        return mapSuggestedAddresses(this.suggestedAddressList)
      },
      isValidAddress() {
        return isEmpty(this.address) || this.isAddress && !this.isSearchFinished
      },
      filters() {
        return {
          name: this.name,
          type: this.type,
          address: !isEmpty(this.address?.coords) ? this.address : null,
          distance: this.distance > 0 ? this.distance : 0.5
        }
      },
      isFirstAccess(){
        return this.$store.getters['isFirstAccess'] || this.homepage
      }
    },
    created() {
      if (this.$q.screen.lt.md && !this.hideChips) this.isOpenFilter = false
      if (!this.address && this.userAddress){
        this.address = this.userAddress
        if(this.isFirstAccess) this.distance = DEFAULT_DISTANCE
      }

    },

    methods: {
      isInValidFilters() {
        this.noFieldsFilled = !this.isName && isEmpty(this.address)
        return this.noFieldsFilled || !this.isValidName || !this.isValidAddress
      },
      setName(val) {
        this.name = val
      },
      validationName(val) {
        this.isValidName = val
      },
      setType(val) {
        this.type = val
        this.typeLabel = val?.label
      },

      toggleFilter() {
        this.isOpenFilter = !this.isOpenFilter
      },
      removeName() {
        this.name = ''
      },
      removeAddress() {
        this.cleanAddress()
      },
      removeType() {
        this.type = ''
      },
      removeDistance() {
        this.distance = 0
      },
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
      abortFilterByAddress() {
      },
      async locateUser() {
        if (this.isGeolocation) {
          return
        }
        this.gettingLocation = true;
        try {
          let currentPosition = await this.$getLocation({enableHighAccuracy: true});

          this.address = {
            label: GEOPOSITION_LABEL,
            coords: {
              lat: this.roundFloatCoords(currentPosition.lat),
              lon: this.roundFloatCoords(currentPosition.lng)
            },
            isGeolocated:true
          }
          this.addressLabel = GEOPOSITION_LABEL
          this.distance = DEFAULT_DISTANCE
        } catch (e) {

          apiErrorNotify({
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
        this.address = null;
        this.addressLabel = ''
        this.distance = 0
      },
      setAddressLabel(value) {
        this.addressLabel = value
      },
      setAddress(value) {

        if (!this.address?.coords){
          this.address = this.addressLabel
          this.distance = 0
        }else
          this.distance = DEFAULT_DISTANCE
      },
      setDistance(value) {

      },
      searchItems() {
        if (this.isInValidFilters()) {
          return
        }
        this.isSearched = true
        this.$store.dispatch('setUserAddress', {address: this.filters.address});
        this.$emit('query-params', this.filters)
      },
    },

  }
</script>

<style lang="sass">
  .search-form-chips
    .q-chip__icon
      opacity: 0.6
</style>
