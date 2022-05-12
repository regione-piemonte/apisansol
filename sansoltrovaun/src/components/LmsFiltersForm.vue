<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="relative-position lms-filter-form-container q-mt-xs">
    <div v-if="$q.screen.gt.sm" class="row items-start justify-center search-filters-form full-width q-col-gutter-md q-pr-md"
         ref="container">
      <!-- NOME -->
      <div class="col-12 col-md-4 relative-position">
        <q-card class="filter-card filter-label" :class="{'active' : isName }">
          <q-card-section @click="toggleNameFilter" @keyup.enter="toggleNameFilter" class="q-py-none"
                          tabindex="0">
            <q-field dense class="field-filter-label" v-model="name" :label="nameFormLabel"
                     float-label clearable @clear="removeName">
              <template v-slot:control>
                <div class="self-center full-width no-outline row justify-between items-center">
                  <div class="col-10 field-filter-label__text">{{name}}</div>
                </div>
              </template>
              <template v-if="!isName" v-slot:append>
                <q-icon name="arrow_drop_down" class="cursor-pointer"/>
              </template>
            </q-field>
          </q-card-section>
        </q-card>
        <div class="filter-form-input-container" v-if="showFilterName">
          <q-card class="filter-card">
            <q-card-section class="q-py-sm">
              <template v-if="service === SERVICES.DOCTORS">
                <q-select
                  dense
                  autofocus
                  v-model="newName"
                  clearable
                  use-input
                  hide-selected
                  fill-input
                  no-error-icon
                  hide-dropdown-icon
                  bottom-slots
                  input-debounce="0"
                  :label="nameFormLabel"
                  :loading="onSearchingName"
                  :options="suggestedNamesOptions"
                  @filter="filterByName"
                  @filter-abort="abortFilterByName"
                  @input-value="onInputName"
                  :error="!nameValidation"
                  error-message="Inserire un nome valido."
                />
              </template>
              <template v-else>
                <q-input
                  autofocus
                  dense
                  v-model="newName"
                  :label="nameFormLabel"
                  bottom-slots
                  clearable
                />
              </template>
              <q-card-actions align="right">
                <lms-buttons>
                  <lms-button noMinWidth @click="addNameFilter">Applica</lms-button>
                  <lms-button noMinWidth outline @click="abortNameFilter">Annulla</lms-button>
                </lms-buttons>
              </q-card-actions>

            </q-card-section>
          </q-card>
        </div>
      </div>
      <!-- TIPOLOGIA -->
      <div class="col-12 col-md-4 relative-position" v-if="service !== SERVICES.PHARMACIES">
        <q-card class="filter-card filter-label" :class="{'active' : isType }">
          <q-card-section @click="toggleTypeFilter" @keyup.enter="toggleTypeFilter" class="q-py-none"
                          tabindex="0">
            <q-field dense class="field-filter-label" v-model="type" :label="typeFormLabel"
                     float-label clearable @clear="removeType">
              <template v-slot:control>
                <div class="self-center full-width no-outline row justify-between items-center">
                  <div class="col-10 field-filter-label__text">{{typeLabel}}</div>
                </div>
              </template>
              <template v-if="!isType" v-slot:append>
                <q-icon name="arrow_drop_down" class="cursor-pointer"/>
              </template>
            </q-field>
          </q-card-section>
        </q-card>
        <div class="filter-form-input-container" v-if="showFilterType">
          <q-card class="filter-card">
            <q-card-section class="q-py-sm">
              <template v-if="service === SERVICES.FACILITIES">
                <q-select
                  ref="filterTypeSelect"
                  :label="typeFormLabel"
                  autofocus
                  v-model="newType"
                  use-input
                  fill-input
                  no-error-icon
                  bottom-slots
                  hide-selected
                  input-debounce="0"
                  :options="typeFacilitiesOptions"
                  @filter="filterType"
                  clearable
                  @input="addTypeFilter"
                  @clear="abortTypeFilter"
                  @blur="removeTypeFilter"
                />
              </template>
              <template v-else>
                <q-select
                  ref="filterTypeSelect"
                  autofocus
                  bottom-slots
                  dense
                  :label="typeFormLabel"
                  v-model="newType"
                  :options="typeOptions"
                  clearable
                  @input="addTypeFilter"
                  @clear="abortTypeFilter"
                />
              </template>
              <!--              <q-card-actions align="right">-->
              <!--                <lms-buttons>-->
              <!--                  <lms-button noMinWidth @click="addTypeFilter">Applica</lms-button>-->
              <!--                  <lms-button noMinWidth outline @click="abortTypeFilter">Annulla</lms-button>-->
              <!--                </lms-buttons>-->
              <!--              </q-card-actions>-->

            </q-card-section>
          </q-card>
        </div>
      </div>
      <!-- INDIRIZZO -->
      <div class="col-12 col-md-4 relative-position">
        <q-card class="filter-card filter-label" :class="{'active' : isAddress  }">
          <q-card-section @click="toggleAddressFilter" @keyup.enter="toggleAddressFilter"
                          class="q-py-none" tabindex="0">
            <q-field dense class="field-filter-label" bg-color="bg-white" v-model="address" label="Vicino a" float-label
                     clearable @clear="removeAddress">
              <template v-slot:control>
                <div class="self-center full-width no-outline row justify-between items-center">
                  <div class="col-10 field-filter-label__text">{{addressLabel}}</div>
                  <div v-if="isAddress && isDistance" class="col-auto field-filter-label__text">{{distance}} km</div>
                </div>

              </template>
              <template v-if="!isAddress" v-slot:append>
                <q-icon name="arrow_drop_down" class="cursor-pointer"/>
              </template>
            </q-field>
          </q-card-section>
        </q-card>
        <div class="filter-form-input-container" v-if="showFilterAddress">
          <q-card class="filter-card filter-label">
            <q-card-section class="q-py-sm">
              <div class="">
                <template v-if="!isGeolocation">
                  <q-select
                    dense
                    autofocus
                    v-model="newAddress"
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
                    :error="!addressValidation"
                    placeholder="Inserisci indirizzo, un comune o condividi la posizione"
                    error-message="Inserisci indirizzo dall'elenco o condividi la posizione"
                  >
                    <template v-slot:append>
                      <q-avatar class="cursor-pointer" @click="locateUser()">
                        <q-icon name="gps_fixed" size="sm" color="primary"/>
                      </q-avatar>
                    </template>
                  </q-select>
                </template>
                <q-field
                  v-else
                  dense
                  bottom-slots
                  :value="geoPositionLabel"
                  label="Inserisci indirizzo o località"
                  stack-label
                  clearable
                  @clear="cleanAddress"
                  tabindex="0"
                >
                  <template v-slot:control>
                    <div class="self-center full-width no-outline">{{geoPositionLabel}}</div>
                  </template>
                </q-field
                >
              </div>
              <div>
                <q-field
                  label="Distanza"
                  dense
                  stack-label
                  borderless
                  tabindex="0"
                >
                  <template v-slot:control>
                    <q-slider
                      v-model="newDistance"
                      :min="0"
                      :max="20"
                      label
                      :label-value="newDistance + ' km'"
                      label-always
                      style="margin-top: 22px"
                    />
                  </template>
                </q-field>
              </div>
              <q-card-actions align="right">
                <lms-buttons>
                  <lms-button noMinWidth @click="addAddressFilter">Applica</lms-button>
                  <lms-button noMinWidth outline @click="abortAddressFilter">Annulla</lms-button>
                </lms-buttons>
              </q-card-actions>

            </q-card-section>
          </q-card>
        </div>
      </div>

    </div>
    <template v-else>
      <div class="q-mt-xs row items-center justify-between">
        <div class="col-auto">
          <q-btn no-caps :ripple="false" icon="filter_list" class="bg-white q-ml-sm" label="Filtri"
                 padding="sm"
                 @click="toggleFilter">
            <q-badge class="filters-badge" color="primary" floating>{{nFilters}}</q-badge>
          </q-btn>
        </div>
        <div class="col-auto" v-if="areResults">
          <q-fab
            v-model="isShowingMap"
            square
            :label="isShowingMap ?  'Mostra elenco' : 'Mostra mappa' "
            icon="map"
            active-icon="menu"
            direction="up"
            color="white"
            text-color="black"
            padding="sm"
          />
        </div>

      </div>

      <lms-search-form :value="isOpenFilter" title="Filtri" :default-filters="filters" @query-params="setDialogParams" @close-dialog="closeFormDialog"/>
    </template>
  </div>

</template>

<script>
  import {DOCTOR_TYPES_LABEL, SERVICES, SERVICES_LABELS} from "../services/config";
  import {NAVIGATION} from "../boot/navigation";
  import {DEFAULT_DISTANCE, GEOPOSITION_LABEL, apiErrorNotify, capitalize, deepClone, isEmpty, orderBy} from "../services/utils";
  import {getSuggestDoctors, getSuggestedAddress} from "../services/api";
  import {mapSuggestedAddresses, normalizeLoccsiPlaces} from "../services/business-logic";
  import LmsSearchForm from "./LmsSearchForm";
  import {HEALTH_FACILITIES as HEALTH_FACILITIES_ROUTE} from "../router/routes";

  export default {
    name: "LmsFiltersForm",
    components: {LmsSearchForm},
    props: {
      defaultFilters: {type: Object, required: false, default: null},
      loading: {type: Boolean, default: false},
      areResults : {type: Boolean, default: false},
    },
    watch: {
      defaultFilters: {
        immediate: true,
        handler(newVal, oldVal) {
          if (!isEmpty(newVal)) {
            this.setDefaultFilters(newVal)
          }

        }
      },
      newAddress:{
        deep:true,
        handler(newVal, oldVal){
          this.newDistance = newVal?.coords ? DEFAULT_DISTANCE : 0
        }
      },
      filters: {
        deep: true,
        handler(newVal, oldVal) {
          if(!this.isFirstAccess)
            this.searchItems()
        }
      },
      isFirstAccess:{
        immediate :true,
        handler(val, oldVal){
          if(val) this.isOpenFilter =true
        }
      }
    },
    data() {
      return {
        DEFAULT_DISTANCE,
        GEOPOSITION_LABEL,
        SERVICES,
        SERVICES_LABELS,
        name: '',
        newName: '',
        newNameLabel: '',
        type: '',
        newType: '',
        newAddress: null,
        newAddressLabel: null,
        address: null,
        distance: 0,
        newDistance: 0,
        showFilterAddress: false,
        showFilterName: false,
        showFilterType: false,
        newAddressGeolocated: false,
        onSearchingName: false,
        suggestedNamesOptions: [],
        suggestedAddressList: null,
        onSearchingAddress: false,
        isSearchFinished: false,
        isFiltering: true,
        isOpenFilter: false,
        gettingLocation: false,
        geoPositionLabel: GEOPOSITION_LABEL,
        noFieldsFilled: false,
        isValidName: true,
        isSearched: false,
        typeFacilitiesOptions: [],
        containerHeight: 0,
      }
    },
    computed: {
      service() {
        return this.$store.getters["getActiveService"];

      },
      isSomeFilter() {
        return this.isName || this.isType || this.isAddress || this.isDistance
      },
      filters() {
        return {
          name: this.name,
          type: this.type,
          address: !isEmpty(this.address?.coords) ? this.address : null,
          distance: this.distance > 0 ? this.distance : 0.5
        }
      },
      userAddress() {
        return this.$store.getters["getUserAddress"];
      },
      //NOME
      isName() {
        return !isEmpty(this.name)
      },
      nameFormLabel() {
        let label = SERVICES_LABELS[this.service].name ?? ''
        return 'Nome ' + label
      },
      nameValidation() {
        let validationOption = !isEmpty(this.newName) && this.suggestedNamesOptions.length > 0
        if (this.service === SERVICES.DOCTORS)
          return validationOption || isEmpty(this.newName) || this.newName === this.name
        else
          return true
      },
      //TIPO
      isType() {
        return !isEmpty(this.type)
      },
      typeFormLabel() {
        let label = SERVICES_LABELS[this.service].type ?? ''
        return 'Tipo ' + label
      },
      typeOptions() {
        let types= null
        let options = []
        switch (this.service) {
          case SERVICES.DOCTORS:
            types = deepClone(this.$store.getters["getDoctorTypes"]);
            if (!isEmpty(types))
              options = types.map(type => {
                let normalizedType = DOCTOR_TYPES_LABEL.find(t => type.id === t.value)
                return {label: normalizedType.label, value: type.id}
              })
            options = orderBy(options, ['label'])
            break;
          case SERVICES.HOSPITALS:
            types = deepClone(this.$store.getters["getHospitalsTypes"])
            if (!isEmpty(types)) {
              options = types.map(type => {
                let label = capitalize(type.descrizione)
                return {label: label, value: type.codice}
              })
              options = orderBy(options, ['label'])
            }
            break;
          case SERVICES.FACILITIES:
            types = this.$store.getters["getFacilitiesTypes"];
            if (!isEmpty(types)) {
              options = types.map(type => {
                return {label: type.label, value: type.codice}
              })
              options = orderBy(options, ['label'])

            }
            break
          case SERVICES.STORES:
            types =  deepClone(this.$store.getters["getCeliacStoresTypes"])
            if (!isEmpty(types)) {
              options = types.map(type => {
                return {label: type.descrizione, value: type.codice}
              })
              options = orderBy(options, ['label'])

            }
            break;
        }
        return options
      },
      typeLabel() {
        return this.type ? this.type.label : ''
      },
      //INDIRIZZO
      isAddress() {
        return !isEmpty(this.address?.coords)
      },
      isGeolocation(){
        return this.newAddress?.isGeolocated
      },
      addressLabel() {
        return this.address ? this.address.label : ''
      },
      isDistance() {
        return (this.distance > 0.5)
      },
      suggestedAddressOptions() {
        // let orderedAddresses = [];
        // if (!isEmpty(this.suggestedAddressList)) {
        //   let addressList = deepClone(this.suggestedAddressList)
        //   let addresses = addressList.map(address => {
        //     return {
        //       label: address.indirizzo,
        //       value: address.id,
        //       coords: {
        //         lat: address.coordinate.coordinates[1],
        //         lon: address.coordinate.coordinates[0]
        //       },
        //       isGeolocated: false
        //     }
        //   });
        //
        //   orderedAddresses = orderBy(addresses, ["label"]);
        // }
        // return Object.freeze(orderedAddresses);
        return mapSuggestedAddresses(this.suggestedAddressList)
      },
      isValidAddress() {
        return isEmpty(this.address) || this.isAddress
      },
      addressValidation() {
        return isEmpty(this.newAddress) || this.newAddress?.coords && !this.isSearchFinished
      },
      nFilters() {
        let counter = 0
        let filters = [this.isName, this.isType, this.isAddress, this.isDistance]
        filters.forEach(filter => {
          if (filter) counter++
        })
        return counter
      },
      isShowingMap: {
        get: function () {
          return this.$store.getters['isShowMap']
        },
        set: function (val) {
          this.$store.dispatch('setResultsOnMap', val)
        }
      },

      isFirstAccess:{
        get: function () {
          return this.$store.getters['isFirstAccess']
        },
        // setter
        set: function (val) {
          this.$store.dispatch('setIfFirstAccess', val)
        }
      }

    },
    created() {
      if (!this.address && this.userAddress) {
        this.address = this.userAddress
        this.distance= DEFAULT_DISTANCE
      }
      if (this.service === SERVICES.FACILITIES) this.typeFacilitiesOptions = this.typeOptions

    },
    methods: {
      setDefaultFilters(params) {
       let address = params.address ?? this.userAddress
        let distance = 0
        if(address){
          if(params.distance > 0)
            distance = params.distance
          else
            distance = DEFAULT_DISTANCE
        }
        this.name = params.name
        this.type = params.type
        this.address = address
        this.distance = distance
        if (this.address) {
          this.newAddress = this.address
          this.newAddressLabel = this.address.label
          this.newDistance = this.distance > 0.5 ? this.distance : 0
        }

      },
      isInValidFilters() {
        this.noFieldsFilled = !this.isName && isEmpty(this.address)
        return this.noFieldsFilled || !this.isValidName || !this.isValidAddress
      },
      setDialogParams(params) {
        this.isFirstAccess=false
        this.name = params.name
        this.type = params.type
        this.address = params.address
        this.distance = params.distance
        if (this.address) {
          this.newAddress = this.address
          this.newAddressLabel = this.address.label
        }

        this.isOpenFilter = false
      },
      searchItems() {
        if (this.isInValidFilters()) {
          this.$emit('invalid-filters', true)
          return
        }
        this.isSearched = true
        this.$emit('invalid-filters', false)
        this.$store.dispatch('setUserAddress', {address: this.filters.address});
        this.$emit('query-params', this.filters)
        this.isOpenFilter = false
      },
      onContainerResize() {
        let container = this.$refs.container
        this.containerHeight = container.clientHeight + 'px';

      },
      //NOME
      toggleNameFilter() {

        this.showFilterName = !this.showFilterName
      },
      removeName() {
        this.name = ''
        this.newName = ''
      },
      onInputName(val) {
        this.newNameLabel = val
        if (val.length < 2 || isEmpty(val)) {
          this.suggestedNamesOptions = []
        }
        this.newName = this.newNameLabel
      },
      async filterByName(val, update, abort) {
        if (val.length < 2 || isEmpty(val)) {
          abort()
          return
        }
        this.onSearchingName = true
        update()
        let params = {s: val};
        let options = []
        try {
          let namesResponse = await getSuggestDoctors({_no5XXRedirect: true, params: params});
          options = namesResponse.data
        } catch (e) {

        } finally {
          update(() => {
            this.suggestedNamesOptions = options
            this.onSearchingName = false
          })
        }


      },
      abortFilterByName() {
      },

      addNameFilter() {
        if (!this.nameValidation) return
        this.name = this.newName
        this.showFilterName = false
      },
      abortNameFilter() {
        if (this.isName)
          this.newName = this.name
        else
          this.newName = ''
        this.showFilterName = false
      },
      //TIPO
      toggleTypeFilter() {
        this.showFilterType = !this.showFilterType
        if (this.showFilterType) {
          this.$nextTick(() => {
            this.$refs.filterTypeSelect.showPopup()
          })
        }
      },
      removeType() {
        this.type = ''
        this.newType = ''
      },
      cleanType() {
        this.newType = ''
      },
      addTypeFilter(val) {

        this.type = this.newType
        this.showFilterType = false
      },
      abortTypeFilter() {
        if (this.isType)
          this.newType = this.type
        else
          this.cleanType()
        this.showFilterType = false
      },
      removeTypeFilter(){
        if(isEmpty(this.newType)){
          this.cleanType()
          this.showFilterType = false
        }
      },
      filterType(val, update, abort) {
        update(() => {
          const needle = val.toLowerCase()
          this.typeFacilitiesOptions = this.typeOptions.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
        })
      },
      //INDIRIZZO
      toggleAddressFilter() {
        this.showFilterAddress = !this.showFilterAddress
      },
      removeAddress() {
        this.address = null;
        this.newAddress = null;
        this.newAddressLabel = ''
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
      cleanAddress() {

        this.newAddress = null;
        this.newAddressLabel = ''

      },
      removeDistance() {
        this.distance = 0
      },
      setAddressLabel(value) {
        this.newAddressLabel = value
      },
      setAddress(value) {
        if (!this.newAddress?.coords){
          this.newAddress = this.newAddressLabel
        }

      },
      abortAddressFilter() {
        if (this.isAddress) {
          this.newAddress = this.address
          this.newAddressLabel = this.address.label
        } else {
          this.cleanAddress()
        }
        this.showFilterAddress = false

      },
      addAddressFilter() {
        if (!this.addressValidation) return
        this.address = this.newAddress
        this.distance = this.newDistance
        this.showFilterAddress = false
      },
      async locateUser() {
        if (this.isGeolocation) {
          return
        }
        this.gettingLocation = true;
        try {
          let currentPosition = await this.$getLocation({enableHighAccuracy: true});

          this.newAddress = {
            label: GEOPOSITION_LABEL,
            coords: {
              lat: this.roundFloatCoords(currentPosition.lat),
              lon: this.roundFloatCoords(currentPosition.lng)
            },
            isGeolocated:true
          }

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
      toggleFilter() {
        this.isOpenFilter = !this.isOpenFilter
      },

      closeFormDialog(val){
        this.isOpenFilter = val
      }
    }


  }
</script>

<style lang="sass">
  .filters-badge
    height: 20px
    width: 20px
    text-align: center
    font-weight: bold
    font-size: 14px
    top: -8px
    right: -8px

  .search-filters-form
    .filter-form-input-container
      position: absolute
      top: 0
      padding-top: 16px
      width: calc(100% - 16px)
      z-index: 1000

      .q-field__label
        top: 4px

    .filter-card
      border-radius: 10px

      &.filter-label
        &:hover
          background: #E8F1F7 !important

        &.active
          background: #E8F1F7 !important

          .field-filter-label
            padding: 0

            &.q-field--auto-height.q-field--dense.q-field--labeled .q-field__native
              min-height: 40px

            .field-filter-label__text
              ouline: 0
              font-weight: bold
              color: $primary

      .field-filter-label
        padding: 7px 0

        .q-field__append.q-anchor--skip
          padding-top: 24px

        &.q-field--standard .q-field__control:before
          border: none

        .q-field__label
          top: 12px



</style>
