<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div>
    <div class="row justify-end items-start search-form-chips" v-if="$q.screen.lt.md && !hideChips">
      <div class="col">
        <lms-scroll-horizontal
          :scrollbar="isSomeFilter"
          draggable
          classes=" row no-wrap items-center reverse"
        >
          <div class="col-auto text-right">
            <q-chip clickable v-model="isName" @click="removeName" icon-right="cancel" text-color="white"
                    color="primary" class="full-height ">
              <span class="q-mr-md"> Nome: {{name}}</span>
            </q-chip>
          </div>
          <div class="col-auto text-right">
            <q-chip clickable v-model="isType" @click="removeType" icon-right="cancel" text-color="white"
                    color="primary" class="full-height">
              <span class="q-mr-md">{{typeLabel}}</span>
            </q-chip>
          </div>
          <div class="col-auto text-right">
            <q-chip clickable v-model="isAddress" @click="removeAddress" icon-right="cancel" text-color="white"
                    color="primary" class="full-height">
              <span class="q-mr-md">Vicino a: {{addressLabel}}</span>
            </q-chip>
          </div>
          <div class="col-auto text-right">
            <q-chip clickable v-model="isDistance" icon-right="cancel" @click="removeDistance" text-color="white"
                    color="primary" class="full-height">
              <span class="q-mr-md">{{distance}} km</span>
            </q-chip>
          </div>

        </lms-scroll-horizontal>
      </div>
      <div class="col-auto text-right">
        <q-btn no-caps :ripple="false" icon="filter_list" class="bg-white q-ml-sm q-my-xs" label="Filtri"
               @click="toggleFilter"/>
      </div>

    </div>
    <q-slide-transition>
      <q-card v-if="showFiltersForm" flat class="q-pb-md" :class="{'q-mt-md': $q.screen.lt.md}">
        <q-card-section>
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
          <lms-button @click="searchItems" :class="{'full-width' : $q.screen.lt.sm}" :loading="loading">Cerca
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
    </q-slide-transition>
  </div>
</template>
<script>
  import LmsHospitalForm from "../hospitals/LmsHospitalsForm";
  import LmsDoctorsForm from "../doctors/LmsDoctorsForm";
  import LmsPharmaciesForm from "../pharmacies/LmsPharmaciesForm";
  import LmsFacilitiesForm from "../health-facilities/LmsFacilitiesForm";
  import {apiErrorNotify, deepClone, isEmpty, orderBy} from "../../services/utils";
  import {getSuggestedAddress} from "../../services/api";
  import {SERVICES, DOCTOR_TYPES_LABEL} from "src/services/config";
  import {normalizeLoccsiPlaces} from "../../services/business-logic";
  import LmsCeliacStoresForm from "../celiac-disease-stores/LmsCeliacStoresForm";

  const GEOPOSITION_LABEL = "LA TUA POSIZIONE";
  const DEFAULT_DISTANCE = 5
  export default {
    name: "LmsSearchFormOld",
    components: {
      LmsCeliacStoresForm,
      LmsFacilitiesForm, LmsPharmaciesForm, LmsDoctorsForm, LmsHospitalForm
    },
    props: {
      showFilter: {type: Boolean, default: true},
      hideChips: {type: Boolean, default: false},
      defaultFilters: {type: Object, required: false, default: null},
      loading: {type: Boolean, default: false},
    },
    data() {
      return {
        filterSplitter: 60,
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

            this.name = newVal.name
            this.type = newVal.type
            this.address = newVal.address ?? this.userAddress
            if (this.type) this.typeLabel = this.type.label
            if (this.address) this.addressLabel = this.address.label
          }

        }
      },
      address: {
        immediate: true,
        handler(newVal, oldVal) {
          this.distance = isEmpty(newVal) ? 0 : DEFAULT_DISTANCE
        }
      },
      suggestedAddressOptions: {
        immediate: true,
        handler(newVal, oldVal) {
          console.log('lista indirizzi', newVal)
        }
      }
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
      showFiltersForm() {
        return this.isOpenFilter || this.$q.screen.gt.sm || !this.isSearched
      },
      noFieldsFilledMsg() {
        let msg = null
        if (this.service === this.servicesList.PHARMACIES)
          msg = 'della farmacia'
        if (this.service === this.servicesList.DOCTORS)
          msg = 'del medico'
        if (this.service === this.servicesList.HOSPITALS || this.service === this.servicesList.FACILITIES)
          msg = 'della struttura'
        if (this.service === this.servicesList.STORES)
          msg = 'del punto vendita'

        return msg ? `È necessario inserire il nome ${msg} o un indirizzo valido` : ''
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
        return (this.distance > 0)
      },
      suggestedAddressOptions() {
        let orderedAddresses = [];
        if (!isEmpty(this.suggestedAddressList)) {
          let addressList = deepClone(this.suggestedAddressList)
          let addresses = addressList.map(address => {
            return {
              label: address.indirizzo,
              value: address.id,
              coords: {
                lat: address.coordinate.coordinates[1],
                lon: address.coordinate.coordinates[0]
              },
              isGeolocated: false
            }
          });

          orderedAddresses = orderBy(addresses, ["label"]);
        }
        return Object.freeze(orderedAddresses);
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
      }
    },
    created() {
      if (this.$q.screen.lt.md && !this.hideChips) this.isOpenFilter = false
      if (!this.address) this.address = this.userAddress

    },
    mounted() {

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

        } catch (e) {
          console.log('e', e)
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
      },
      setAddressLabel(value) {
        this.addressLabel = value
      },
      setAddress(value) {
        if (!this.address?.coords)
          this.address = this.addressLabel
      },
      setDistance(value) {

      },
      searchItems() {
        if (this.isInValidFilters()) {
          console.log('invalid filters')
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
