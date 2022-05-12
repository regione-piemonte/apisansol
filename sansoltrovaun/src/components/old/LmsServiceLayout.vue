<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div>
<!--    INIZIO FILTRI-->
    <div class="relative-position lms-filter-form-container q-mt-xs">
      <div v-if="$q.screen.gt.sm" class="row items-start search-filters-form full-width q-col-gutter-md q-pr-md"
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

      </template>
    </div>
<!--FINE FILTRI -->
    <template v-if="!isInvalidSearch">
      <div v-if="areResults" class="q-mt-lg">
        <!--    INIZIO RISULTATI-->
        <div class="lms-results">
          <div class="full-width" v-if="foundItemsList.length>0">
            <div class="row justify-center q-mb-lg" v-if="$q.screen.gt.sm">
              <q-chip color="info"><strong>{{nResultsLabel}}</strong></q-chip>
            </div>
            <q-splitter
              v-model="splitterModel"
              class="bg-transparent relative-position"
              :limits="limits"
              v-if="$q.screen.gt.xs"
            >
              <template v-slot:before>
                <!-- Lista elementi trovati VERTICALE-->
                <div :class="{'q-pl-md q-pt-md csi-bg-default': isFullsize}">
                  <div
                    class="row"
                  >
                    <q-scroll-area
                      :thumb-style="{width:'12px'}"
                      visible
                      id="scroll-area-vertical"
                      class="q-px-0 full-width height-area"
                      :class="{'fullsize' : isFullsize}"
                    >
                      <!--  SCHEDA ELEMENTO TROVATO  -->
                      <div
                        class="q-mr-md q-mb-lg q-ml-xs"
                        ref="itemCardObjects"
                        v-for="(item,index) in foundItemsList" :key="index">
                        <lms-results-card-item
                          :focused="itemFocused===index"
                          :item="item"
                          @show-marker="(value) => showMarker(value, index)"
                        />
                      </div>
                      <div class="col-12 text-primary text-weight-bold text-center cursor-pointer" v-if="areMoreElements"
                           @click="showMore">
                        <p v-if="!loading">Mostra altri</p>
                        <q-spinner v-else color="primary" size="md"/>
                      </div>

                    </q-scroll-area>

                  </div>
                </div>

              </template>
              <template v-slot:after>
                <template>
                  <div class="height-area" :class="{'fullsize' : isFullsize}">
                    <lms-results-map
                      :user-coords="userCoords"
                      :found-items-list="foundItemsList"
                      :is-fullsize="isFullsize"
                      :active-item="itemFocused"
                      @show-fullsize-map="fullSizeMap"
                      @show-item-card="showItemCard"
                    />

                  </div>
                </template>
              </template>
            </q-splitter>
            <!-- MOBILE-->
            <div v-if="$q.screen.lt.sm" class="csi-bg-default height-area-mobile relative-position" style="margin-bottom: 50px">
              <!--        <div class="q-pb-md q-px-md text-right">-->
              <!--          <q-btn-->
              <!--            :ripple="false"-->
              <!--            no-caps-->
              <!--            color="white"-->
              <!--            text-color="black"-->
              <!--            icon="fullscreen"-->
              <!--            Left-->
              <!--            label="Ingrandisci"-->
              <!--            @click="fullSizeMap(true)"-->
              <!--          />-->
              <!--        </div>-->

              <!--  MAPPA  -->
              <div class="fit absolute-center " :class="{'invisible' : !isShowingMap}">
                <lms-results-map
                  :user-coords="userCoords"
                  :found-items-list="foundItemsList"
                  :active-item="itemFocused"
                  @show-item-card="showItemCardMobile"
                  @show-fullsize-map="fullSizeMap"
                  :center-marker="centerMarker"
                />
                <div class="absolute-bottom" v-if="selectedItem"
                     style="z-index:1000;">
                  <div class="q-pa-md">
                    <lms-results-card-item
                      mobile
                      :item="selectedItem"
                      @show-marker="(value) => showMarkerMobile(value, itemFocused)"
                    />
                  </div>
                </div>
              </div>
              <!--  LISTA  -->
              <div class="fit absolute-center" v-show="!isShowingMap">
                <div
                  class="row"
                >
                  <q-scroll-area
                    visible
                    :thumb-style="{width:'12px'}"
                    class="q-px-0 full-width height-area-mobile"
                  >
                    <!--  SCHEDA ELEMENTO TROVATO  -->
                    <div
                      class="q-mb-lg q-mx-md q-mt-sm"
                      ref="itemCardObjects"
                      v-for="(item,index) in foundItemsList" :key="index">
                      <lms-results-card-item
                        :focused="itemFocused===index"
                        :item="item"
                        @show-marker="(value) => showMarker(value, index)"/>
                    </div>

                    <div class="col-12 text-primary text-weight-bold text-center cursor-pointer" v-if="areMoreElements"
                         @click="showMore">
                      <p v-if="!loading">Mostra altri</p>
                      <q-spinner v-else color="primary" size="md"/>
                    </div>
                  </q-scroll-area>

                </div>

              </div>
              <!--        <div class="absolute-bottom text-center " z-index="2000">-->
              <!--          <q-fab-->
              <!--            v-model="isShowingMap"-->
              <!--            square-->
              <!--            :label="isShowingMap ?  'Mostra elenco' : 'Mostra su mappa' "-->
              <!--            icon="map"-->
              <!--            active-icon="menu"-->
              <!--            direction="up"-->
              <!--            color="white"-->
              <!--            text-color="black"-->
              <!--            @input="onShowMapListInput"-->
              <!--            @hide="isShowingMap = false"-->
              <!--            padding="sm"-->
              <!--          />-->
              <!--        </div>-->
            </div>
          </div>
          <!--INZIO FULLSIZE MAP-->
          <!------------------------------------------------------------->
          <q-dialog v-model="isFullsize" class="bg-white " maximized>
            <q-card class="no-scroll" id="fullsize-map-dialog">
              <q-card-section class="no-scroll fit no-padding csi-bg-default">
                <q-splitter
                  v-model="splitterModel"
                  class="bg-transparent relative-position"
                  :limits="limits"
                  v-if="!isFullsizeMobile"
                >
                  <template v-slot:before>
                    <!-- Lista elementi trovati VERTICALE-->
                    <div class="q-pl-md q-pt-md csi-bg-default">
                      <div
                        class="row"
                      >
                        <q-scroll-area
                          visible
                          :thumb-style="{width:'12px'}"
                          id="scroll-area-vertical-fullscreen"
                          class="q-px-0 full-width height-fullsize"

                        >
                          <!--  SCHEDA ELEMENTO TROVATO  -->
                          <div
                            class="q-mr-md q-mb-lg q-ml-xs"
                            ref="itemCardObjectsFullsize"
                            v-for="(item,index) in foundItemsList" :key="index">

                            <lms-results-card-item
                              :focused="itemFocused===index"
                              :item="item"
                              @show-marker="(value) => showMarker(value, index)"
                            />

                          </div>
                          <div class="col-12 text-primary text-weight-bold text-center cursor-pointer" v-if="areMoreElements"
                               @click="showMore">
                            <p v-if="!loading">Mostra altri</p>
                            <q-spinner v-else color="primary" size="md"/>
                          </div>

                        </q-scroll-area>

                      </div>
                    </div>

                  </template>
                  <template v-slot:after>
                    <template>
                      <div class="height-fullsize" v-if="isFullsize">
                        <lms-results-map
                          :user-coords="userCoords"
                          :found-items-list="foundItemsList"
                          is-fullsize
                          :is-dialog-close="isClosingMap"
                          :active-item="itemFocused"
                          @show-fullsize-map="fullSizeMap"
                          @show-item-card="showItemCard"
                        />
                        <div class="absolute-bottom" v-if="$q.screen.lt.sm  && selectedItem"
                             style="z-index:1000; bottom:50px">
                          <div class="q-pa-md">
                            <lms-results-card-item
                              mobile
                              :item="selectedItem"
                              @show-marker="(value) => showMarker(value, itemFocused)"
                            />

                          </div>
                        </div>
                      </div>
                    </template>
                  </template>
                </q-splitter>
                <!--  MOBILE-->
                <template v-else>
                  <div class="height-fullsize" v-show="isShowingMap">
                    <lms-results-map
                      :user-coords="userCoords"
                      :found-items-list="foundItemsList"
                      is-fullsize
                      :is-dialog-close="isClosingMap"
                      :active-item="itemFocused"
                      @show-fullsize-map="fullSizeMap"
                      @show-item-card="showItemCard"
                      :center-marker="centerMarker"
                    />
                    <div class="absolute-bottom" v-if="selectedItem"
                         style="z-index:1000; bottom:50px">
                      <div class="q-pa-md">
                        <lms-results-card-item
                          mobile
                          :item="selectedItem"
                          @show-marker="(value) => showMarkerMobile(value, itemFocused)"
                        />

                      </div>
                    </div>
                  </div>
                  <!--            <div class="height-fullsize fullsize__list " v-show="!isShowingMap">-->
                  <!--              <div-->
                  <!--                class="row"-->
                  <!--              >-->
                  <!--                <div class="col-12 text-right q-pa-md">-->
                  <!--                  <q-btn-->
                  <!--                    :ripple="false"-->
                  <!--                    no-caps-->
                  <!--                    color="white"-->
                  <!--                    text-color="black"-->
                  <!--                    :icon="isFullsize ? 'fullscreen_exit' : 'fullscreen'"-->
                  <!--                    Left-->
                  <!--                    :label="isFullsize ? 'Riduci' : 'Ingrandisci'"-->
                  <!--                    @click="fullSizeMap(!isFullsize)"-->
                  <!--                  />-->
                  <!--                </div>-->
                  <!--                <div class="col-12 full-height">-->
                  <!--                  <q-scroll-area-->
                  <!--                    visible-->
                  <!--                    :thumb-style="{width:'12px'}"-->
                  <!--                    class="q-px-0 full-width height-area-mobile"-->
                  <!--                  >-->
                  <!--                    &lt;!&ndash;  SCHEDA ELEMENTO TROVATO  &ndash;&gt;-->
                  <!--                    <div-->
                  <!--                      class="q-mr-md q-mb-lg q-mt-sm q-ml-xs "-->
                  <!--                      ref="itemCardObjectsFullsize"-->
                  <!--                      v-for="(item,index) in foundItemsList" :key="index">-->

                  <!--                      <lms-results-card-item-->
                  <!--                        :focused="itemFocused===index"-->
                  <!--                        :item="item"-->
                  <!--                        @show-marker="(value) => showMarker(value, index)"-->
                  <!--                      />-->

                  <!--                    </div>-->
                  <!--                    <div class="col-12 text-primary text-weight-bold text-center cursor-pointer" v-if="areMoreElements"-->
                  <!--                         @click="showMore">-->
                  <!--                      <p v-if="!loading">Mostra altri</p>-->
                  <!--                      <q-spinner v-else color="primary" size="md"/>-->
                  <!--                    </div>-->

                  <!--                  </q-scroll-area>-->
                  <!--                </div>-->


                  <!--              </div>-->

                  <!--            </div>-->
                  <div class="absolute-bottom text-center map-list-btn">
                    <q-btn
                      square
                      label="Mostra elenco"
                      icon="menu"
                      color="white"
                      text-color="black"
                      padding="sm"
                      @click="onShowMapListInput"
                    />

                  </div>
                </template>
              </q-card-section>
            </q-card>
          </q-dialog>
          <!--FINE FULLSIZE MAP-->
        </div>
        <!--FINE RISULTATI -->

      </div>
      <div v-if="!areResults && !isLoading && !isFirstResearch" class="q-my-lg">
        <q-banner class="h-banner h-banner--info">
          Nessun risultato trovato.
        </q-banner>
      </div>
    </template>
    <div v-else class="q-my-lg">
      <q-banner class="h-banner h-banner--negative">
        <template v-slot:avatar>
          <q-icon name="warning" size="md"/>
        </template>
        <p class="text-body1 no-margin">{{noFieldsFilledMsg}}</p>
      </q-banner>
    </div>
    <div class="row items-center justify-center q-mt-lg">
      <lms-inner-loading :showing="isLoading" class="bg-transparent" block/>
    </div>
    <lms-search-form :value="isOpenFilter" title="Filtri" :default-filters="filters" @query-params="setDialogParams" @close-dialog="closeFormDialog"/>
  </div>

</template>

<script>
  import {DOCTOR_TYPES_LABEL, SEARCH_LIMIT, SERVICES, SERVICES_LABELS} from "../../services/config";
  import {
    apiErrorNotify,
    capitalize,
    deepClone,
    DEFAULT_DISTANCE,
    GEOPOSITION_LABEL,
    isEmpty,
    orderBy, scrollToElement
  } from "../../services/utils";
  import {errorSearchLabel, mapSuggestedAddresses, normalizeLoccsiPlaces} from "../../services/business-logic";
  import {getSuggestDoctors, getSuggestedAddress} from "../../services/api";
  import LmsSearchForm from "../LmsSearchForm";
  import {Screen} from "quasar";

    export default {
        name: "LmsServiceLayout",
      components: {LmsSearchForm},
      data(){
            return {
              DEFAULT_DISTANCE,
              GEOPOSITION_LABEL,
              SERVICES,
              SERVICES_LABELS,
              SEARCH_LIMIT,
              openFilter: true,
              queryParams: null,
              hospitalsList: [],
              filterParams: null,
              uploadNewElements: false,
              isNewSearch: true,
              offset: 0,
              newQueryParams: null,
              isLoading: false,
              isLoadingMoreItems: false,
              searchParams: null,
              viewFullsizeMap: false,
              isInvalidSearch: false,
              //FILTERS
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
              //RESULTS
              Screen,
              isListOpen: false,
              map: null,
              itemFocused: null,
              selectedItem: null,
              infoExpanded: false,
              isFullsize: false,
              showFixedBtn: false,
              fixedBtnLabel: '',
              isNewItemSelected: false,
              isClosingMap: false,
              centerMarker:false
          }
        },
        props:{
          serviceTypes:{type:Object, default:null},
          foundItemsList: {type: Array, required: true, default: null},
          userCoords: {type: Object, default: null},
          areMoreElements: {type: Boolean, default: false},
          loading: {type: Boolean, default: false},
        },
        computed: {
          areResults() {
            return this.foundItemsList.length > 0
          },
          isFirstResearch() {
            return isEmpty(this.filterParams)
          },
          noFieldsFilledMsg() {
            return errorSearchLabel()
          },
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
            let options = []
            let types = deepClone(this.serviceTypes);
            if(isEmpty(types)) return
            switch (this.service) {
              case SERVICES.DOCTORS:
                  options = types.map(type => {
                    let normalizedType = DOCTOR_TYPES_LABEL.find(t => type.id === t.value)
                    return {label: normalizedType.label, value: type.id}
                  })
                options = orderBy(options, ['label'])
                break;
              case SERVICES.HOSPITALS:

                  options = types.map(type => {
                    let label = capitalize(type.descrizione)
                    return {label: label, value: type.codice}
                  })
                  options = orderBy(options, ['label'])

                break;
              case SERVICES.FACILITIES:

                  options = types.map(type => {
                    return {label: type.label, value: type.codice}
                  })
                  options = orderBy(types, ['label'])

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
            return this.address?.isGeolocated
          },
          addressLabel() {
            return this.address ? this.address.label : ''
          },
          isDistance() {
            return (this.distance > 0.5)
          },
          suggestedAddressOptions() {
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
          },
          splitterModel: {
            // getter
            get: function () {
              return this.limits[0]
            },
            // setter
            set: function (newValue) {
              return newValue
            }
          },
          fullsizeMapLabel() {
            if (this.$q.screen.gt.xs) {
              return this.isFullsize ? 'Riduci mappa' : 'Ingrandisci mappa'
            }
            return ''
          },
          nResultsLabel() {
            if (this.foundItemsList.length === 1)
              return `${this.foundItemsList.length} risultato trovato`
            else
              return `${this.foundItemsList.length} risultati trovati`
          },
          serviceIcon() {
            return `img:/statics/la-mia-salute/icone/ospedale.svg`
          },
          dialogLoading() {
            if (!this.$refs.fullsizeMap) return true
            return false
          },
          limits() {
            if (this.Screen.lt.xl) return [45, 45]
            if (this.Screen.lt.md) return [50, 50]
            if (this.isFullsize) return [30, 30]
            return [35, 35]
          },
          isFullsizeMobile() {
            return this.isFullsize && this.$q.screen.lt.sm
          },

        },
      watch:{
        Screen: {
          deep: true,
          immediate: true,
          handler(newValue, oldValue) {
            this.setScreenParams(newValue);
          }
        },
        selectedItem: {
          deep: true,
          handler(newVal, oldVal) {
            if (newVal && this.isNewItemSelected) {
              this.scrollToItem(newVal)
            }
          }
        },

        isShowingMap: {
          handler(newVal, oldVal) {
            if (!newVal && this.selectedItem) {
              this.scrollToItem(this.selectedItem)
            }
          }
        }
      },
      created(){
        if (!this.address) {
          this.address = this.userAddress
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
          this.newName = this.newNameLabel
        },
        async filterByName(val, update, abort) {
          if (val.length < 2 || isEmpty(val)) {
            this.suggestedNamesOptions = []
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
          this.isGeolocation = false;
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
        },
        setScreenParams(value) {
          let isScreenSm = value.sm

          if (isScreenSm)
            this.isListOpen = false
          if (value.xs) {
            // this.scrollResultsIntersection(window.scrollY)
            this.isListOpen = true
            //this.isFullsize = true
            //this.isShowingMap = true
          }

        },
        setLimits(isScreenSm) {
          if (isScreenSm) return [50, 50]
          if (this.isFullsize) return [20, 20]
          return [45, 45]
        },
        showMarker(value, index) {
          if (value) {
            this.centerMarker = false
            this.itemFocused = index
            this.isNewItemSelected = false
            this.selectedItem = this.foundItemsList[index]
          }
        },
        showMarkerMobile(value, index){
          if (value) {
            this.itemFocused = null
            this.centerMarker = true
            setTimeout(()=>{
              this.itemFocused = index
              this.isNewItemSelected = false
              this.selectedItem = this.foundItemsList[index]
            }, 100)

          }

        },
        showItemCard(index) {
          if (this.itemFocused === index) {
            this.itemFocused = null
            this.selectedItem = null
            return
          }
          this.itemFocused = index
          this.isNewItemSelected = true
          this.selectedItem = this.foundItemsList[index]
        },
        showItemCardMobile(index) {
          if (this.itemFocused === index) {
            this.itemFocused = null
            this.selectedItem = null
            return
          }
          this.itemFocused = index
          this.selectedItem = this.foundItemsList[index]
        },
        fullSizeMap(val) {
          this.isFullsize = val
        },
        onShowMapListInput() {
          this.isShowingMap = false
          this.isFullsize = false
        },

        scrollToItem(item) {
          if(this.isFullsizeMobile) return
          let index = this.foundItemsList.indexOf(item)
          let results = null
          if (this.isFullsize) {
            results = this.$refs.itemCardObjectsFullsize
          } else
            results = this.$refs.itemCardObjects
          let itemCard = results[index]

          this.$nextTick(() => {
            scrollToElement(itemCard)
          })

        },
        showMore() {
          this.$emit('show-more')
        },
        closeFullsizeMap() {
          this.isClosingMap = true
        },
      }
    }
</script>

<style scoped>

</style>
