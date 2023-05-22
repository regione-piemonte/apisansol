<!--
 SPDX-License-Identifier: EUPL-1.2
 Copyright Regione Piemonte - 2023
-->

<template>
  <lms-page padding class="page-pharmacies-search-results">
    <lms-page-title class="q-mb-lg"> Farmacia abituale </lms-page-title>

    <!--FILTRI -->
    <!----------------------------------------------------------------------------------------------------------------->
    <div id="farab-filters" class="q-mb-lg">
      <!--FILTRI DESKTOP-->
      <!----------------------------------------------------------------------------------------------------------------->
      <template v-if="$q.screen.gt.xs">
        <div
          class="row items-start justify-center search-filters-form full-width q-col-gutter-md q-pr-md"
          ref="filtersContainer"
        >
          <!-- NOME -->
          <div class="col-12 col-md relative-position">
            <q-card
              class="filter-card filter-label"
              :class="{ active: isName }"
            >
              <q-card-section
                @click="toggleNameFilter"
                @keyup.enter="toggleNameFilter"
                class="q-py-none"
                tabindex="0"
              >
                <q-field
                  dense
                  class="field-filter-label"
                  v-model="name"
                  label="Nome farmacia"
                  float-label
                  :clearable="isAddress"
                  @clear="removeName"
                >
                  <template v-slot:control>
                    <div
                      class="self-center full-width no-outline row justify-between items-center"
                    >
                      <div class="col-10 field-filter-label__text">
                        {{ name }}
                      </div>
                    </div>
                  </template>
                  <template v-if="!isName" v-slot:append>
                    <q-icon name="arrow_drop_down" class="cursor-pointer" />
                  </template>
                </q-field>
              </q-card-section>
            </q-card>
            <div class="filter-form-input-container" v-if="showFilterName">
              <q-card class="filter-card">
                <q-card-section class="q-py-sm">
                  <q-input
                    autofocus
                    dense
                    v-model="newName"
                    label="Nome farmacia"
                    bottom-slots
                    clearable
                  />
                  <q-card-actions align="right">
                    <lms-buttons>
                      <lms-button noMinWidth @click="setFilterName"
                        >Applica</lms-button
                      >
                      <lms-button noMinWidth outline @click="abortFilterName"
                        >Annulla</lms-button
                      >
                    </lms-buttons>
                  </q-card-actions>
                </q-card-section>
              </q-card>
            </div>
          </div>

          <!-- INDIRIZZO -->
          <div class="col-12 col-md relative-position">
            <q-card
              class="filter-card filter-label"
              :class="{ active: isAddress }"
            >
              <q-card-section
                @click="toggleAddressFilter"
                @keyup.enter="toggleAddressFilter"
                class="q-py-none"
                tabindex="0"
              >
                <q-field
                  dense
                  class="field-filter-label"
                  bg-color="bg-white"
                  v-model="address"
                  label="Vicino a"
                  float-label
                  :clearable="isName"
                  @clear="removeAddress"
                >
                  <template v-slot:control>
                    <div
                      class="self-center full-width no-outline row justify-between items-center"
                    >
                      <div class="col-10 field-filter-label__text">
                        {{ addressLabel }}
                      </div>
                      <div
                        v-if="isAddress && isDistance"
                        class="col-auto field-filter-label__text"
                      >
                        {{ distance }} km
                      </div>
                    </div>
                  </template>
                  <template v-if="!isAddress" v-slot:append>
                    <q-icon name="arrow_drop_down" class="cursor-pointer" />
                  </template>
                </q-field>
              </q-card-section>
            </q-card>
            <div class="filter-form-input-container" v-if="showFilterAddress">
              <q-card class="filter-card filter-label">
                <q-card-section class="q-py-sm">
                  <lms-address-form v-model="newAddress" label="Vicino a" />
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
                      <lms-button noMinWidth @click="addAddressFilter"
                        >Applica</lms-button
                      >
                      <lms-button noMinWidth outline @click="abortAddressFilter"
                        >Annulla</lms-button
                      >
                    </lms-buttons>
                  </q-card-actions>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </div>
      </template>

      <!--FILTRI MOBILE-->
      <!----------------------------------------------------------------------------------------------------------------->
      <template v-else>
        <div class="row items-center justify-between q-mb-md">
          <div class="col-auto">
            <q-btn
              no-caps
              :ripple="false"
              icon="filter_list"
              class="bg-white q-ml-sm"
              label="Filtri"
              padding="sm"
              @click="toggleFilter"
            >
              <q-badge class="filters-badge" color="primary" floating>{{
                nFilters
              }}</q-badge>
            </q-btn>
          </div>
          <q-space />
          <div class="col-auto" v-if="pharmaciesList.length > 0">
            <q-fab
              v-model="isShowingList"
              square
              :label="isShowingList ? 'Mostra mappa' : 'Mostra elenco'"
              icon="menu"
              active-icon="map"
              direction="up"
              color="white"
              text-color="black"
              padding="sm"
              @input="onInputView"
            />
          </div>
        </div>
      </template>
    </div>

    <template v-if="!isLoading">
      <template v-if="noFiltersErr">
        <q-banner class="q-banner--negative">
          <template v-slot:avatar>
            <q-icon name="warning" size="md" />
          </template>
          <p class="text-body1 no-margin">
            È necessario inserire il nome della farmacia o un indirizzo valido
          </p>
        </q-banner>
      </template>
      <template v-else>
        <!-- LISTA FARMACIE -->
        <!----------------------------------------------------------------------------------------------------------------->
        <div v-if="pharmaciesList.length > 0" class="full-width">
          <div class="row justify-center q-mb-lg" v-if="Screen.gt.sm">
            <q-chip color="info">
              <strong>{{ nResultsLabel }}</strong>
            </q-chip>
          </div>

          <!-- DESKTOP -->
          <!-------------------------------------------------------------------------------------------------------------->
          <template v-if="Screen.gt.xs">
            <q-splitter
              v-model="splitterModel"
              class="bg-transparent relative-position"
              :limits="limits"
            >
              <template v-slot:before>
                <!-- Lista elementi trovati VERTICALE-->
                <div
                  :class="{ 'q-pl-md q-pt-md farab-bg-default': isFullsize }"
                >
                  <div class="row">
                    <q-scroll-area
                      :thumb-style="{ width: '12px' }"
                      visible
                      id="scroll-area-vertical"
                      class="q-px-none full-width height-area"
                      :class="{ fullsize: isFullsize }"
                    >
                      <!--  SCHEDA ELEMENTO TROVATO  -->
                      <div
                        class="q-mr-md q-mb-lg q-ml-xs"
                        ref="pharmacyCardObjects"
                        v-for="(pharmacy, index) in pharmaciesList"
                        :key="index"
                      >
                        <farab-pharmacy-list-item
                          :focused="pharmacyFocused === index"
                          :pharmacy="pharmacy"
                          @show-marker="showMarker(index, pharmacy)"
                        />
                      </div>
                      <farab-pharmacy-show-more-item
                        v-if="areMoreElements"
                        :loading="loadingMoreItems"
                        classes="q-mr-md q-mb-lg q-ml-xs"
                        @show-more="loadMoreResults"
                      />
                    </q-scroll-area>
                  </div>
                </div>
              </template>

              <template v-slot:after>
                <div class="height-area" :class="{ fullsize: isFullsize }">
                  <farab-pharmacy-results-map
                    :active-item="pharmacyFocused"
                    :pharmacies-list="pharmaciesList"
                    :latitude="latitude"
                    :longitude="longitude"
                    @show-card="showItemCard"
                    @show-fullsize-map="fullSizeMap"
                  />
                </div>
              </template>
            </q-splitter>
          </template>

          <!-- MOBILE -->
          <!-------------------------------------------------------------------------------------------------------------->
          <template v-else>
            <!-- TITOLO -->
            <!-- ------ -->
            <!--            <template v-if="isAddress">-->
            <!--              <div class="q-pa-md text-h5">-->
            <!--                Farmacie nei pressi di-->
            <!--                {{ addressLabel | startCase }}-->
            <!--              </div>-->
            <!--            </template>-->

            <div>
              <!-- LISTA -->
              <!------------------------------->
              <div v-show="isShowingList">
                <!--  SCHEDA ELEMENTO TROVATO  -->
                <div
                  class="q-mb-lg q-mx-md q-mt-sm"
                  ref="pharmacyCardObjects"
                  v-for="(pharmacy, index) in pharmaciesList"
                  :key="index"
                >
                  <farab-pharmacy-list-item
                    :focused="pharmacyFocused === index"
                    :pharmacy="pharmacy"
                    @show-marker="showMarker(index, pharmacy)"
                  />
                </div>

                <template v-if="areMoreElements">
                  <farab-pharmacy-show-more-item
                    :loading="loadingMoreItems"
                    classes="q-mb-lg q-mx-md q-mt-sm"
                    @show-more="loadMoreResults"
                  />
                </template>
              </div>
              <!-- MAPPA -->
              <!------------------------------->

              <div style="height: 500px" :class="{ invisible: isShowingList }">
                <farab-pharmacy-results-map
                  :active-item="pharmacyFocused"
                  :pharmacies-list="pharmaciesList"
                  :latitude="latitude"
                  :longitude="longitude"
                  @show-card="showItemCard"
                  @show-fullsize-map="fullSizeMap"
                />
              </div>
            </div>
          </template>
        </div>

        <!-- LISTA FARMACIE VUOTA -->
        <!----------------------------------------------------------------------------------------------------------------->
        <template v-else>
          <q-banner class="q-banner q-banner--info">
            Non sono state trovate farmacie in base ai criteri di ricerca.
          </q-banner>
        </template>
      </template>

      <!--FULLSIZE MAP-->
      <!------------------------------------------------------------->
      <q-dialog v-model="isFullsize" maximized>
        <q-card class="no-scroll" id="fullsize-map-dialog">
          <q-card-section class="no-scroll fit no-padding farab-bg-default">
            <!--  DESKTOP-->
            <template v-if="Screen.gt.xs">
              <q-splitter
                v-model="splitterModel"
                class="bg-transparent relative-position"
                :limits="limits"
              >
                <template v-slot:before>
                  <!-- Lista elementi trovati VERTICALE-->
                  <div class="q-pl-md q-pt-md farab-bg-default">
                    <div class="row">
                      <q-scroll-area
                        visible
                        :thumb-style="{ width: '12px' }"
                        id="scroll-area-vertical-fullscreen"
                        class="q-px-0 full-width height-fullsize"
                      >
                        <!--  SCHEDA ELEMENTO TROVATO  -->
                        <div
                          class="q-mr-md q-mb-lg q-ml-xs"
                          ref="pharmacyCardObjectsFullsize"
                          v-for="(pharmacy, index) in pharmaciesList"
                          :key="index"
                        >
                          <farab-pharmacy-list-item
                            :focused="pharmacyFocused === index"
                            :pharmacy="pharmacy"
                            @show-marker="showMarker(index, pharmacy)"
                          />
                        </div>
                        <farab-pharmacy-show-more-item
                          v-if="areMoreElements"
                          :loading="loadingMoreItems"
                          classes="q-mr-md q-mb-lg q-ml-xs"
                          @show-more="loadMoreResults"
                        />
                      </q-scroll-area>
                    </div>
                  </div>
                </template>
                <template v-slot:after>
                  <template>
                    <div class="height-fullsize" v-if="isFullsize">
                      <farab-pharmacy-results-map
                        is-fullsize
                        :active-item="pharmacyFocused"
                        :pharmacies-list="pharmaciesList"
                        :latitude="latitude"
                        :longitude="longitude"
                        @show-card="showItemCard"
                        @show-fullsize-map="fullSizeMap"
                      />
                    </div>
                  </template>
                </template>
              </q-splitter>
            </template>
            <!--  MOBILE-->
            <template v-else>
              <div class="height-fullsize" v-show="!isShowingList">
                <farab-pharmacy-results-map
                  is-fullsize
                  :active-item="pharmacyFocused"
                  :pharmacies-list="pharmaciesList"
                  :latitude="latitude"
                  :longitude="longitude"
                  @show-card="showItemCard"
                  @show-fullsize-map="fullSizeMap"
                />
              </div>
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

      <!--FORM FILTRI-->
      <!------------------------------------------------------------->
      <q-dialog v-model="isOpenFiltersDialog" :maximized="$q.screen.lt.md">
        <q-card style="width: 800px; max-width: 800px">
          <q-card-section class="q-py-sm q-pr-none">
            <q-toolbar>
              <q-toolbar-title> Filtri </q-toolbar-title>
              <q-btn v-close-popup flat round dense icon="close" />
            </q-toolbar>
          </q-card-section>
          <q-card-section>
            <farab-pharmacy-search-form
              :default-filters="filterParams"
              @search="onSearchPharmacies"
              :loading="isLoading"
            />
          </q-card-section>
        </q-card>
      </q-dialog>
    </template>

    <template v-else>
      <lms-inner-loading :showing="isLoading" block />
    </template>
  </lms-page>
</template>

<script>
import { Screen } from "quasar";
import FarabPharmacyListItem from "src/components/FarabPharmacyListItem";
import FarabPharmacyResultsMap from "src/components/FarabPharmacyResultsMap";
import FarabPharmacyShowMoreItem from "src/components/FarabPharmacyShowMoreItem";
import LmsAddressForm from "src/components/core/LmsAddressForm";
import FarabPharmacySearchForm from "src/components/FarabPharmacySearchForm";
import { getPartecipantPharmacies, getPharmacies } from "src/services/api";
import {
  apiErrorNotify,
  apiErrorNotifyDialog,
  isEmpty,
} from "src/services/utils";
import { scrollToElement } from "src/services/business-logic";
import { DEFAULT_DISTANCE } from "src/services/config";
import { PHARMACY_SEARCH } from "src/router/routes";

const SEARCH_ITEMS_LIMIT = 20;

export default {
  name: "PagePartecipantPharmacySearchResults",
  components: {
    FarabPharmacySearchForm,
    LmsAddressForm,
    FarabPharmacyShowMoreItem,
    FarabPharmacyResultsMap,
    FarabPharmacyListItem,
  },
  data() {
    return {
      Screen,
      isLoading: false,
      isSearching: false,
      pharmacies: [],
      address: null,
      newAddress: null,
      name: "",
      newName: "",
      distance: 0,
      offset: 0,
      areMoreElements: false,
      isFullsize: false,
      pharmacyFocused: null,
      selectedPharmacy: null,
      isShowingList: true,
      loadingMoreItems: false,
      isOpenFilter: false,
      showFilterName: false,
      showFilterAddress: false,
      newDistance: 0,
      isOpenFiltersDialog: false,
      noFiltersErr: false,
    };
  },
  computed: {
    filterParams() {
      return {
        address: this.address,
        name: this.name,
        distance: this.distance,
      };
    },
    latitude() {
      return this.address?.coords?.lat;
    },
    longitude() {
      return this.address?.coords?.lon;
    },
    addressLabel() {
      return this.address?.label;
    },
    partecipantPharmacies() {
      return this.$store.getters["getPartecipantPharmacies"];
    },
    pharmaciesList() {
      let list = [];
      if (this.pharmacies?.length > 0) {
        list = this.pharmacies.map((pharmacy) => {
          let isPartecipant = this.partecipantPharmacies.includes(
            pharmacy.codice
          );
          pharmacy.aderente = isPartecipant;
          return pharmacy;
        });
      }
      return list;
    },
    nResultsLabel() {
      let resultLabel =
        this.pharmaciesList.length === 1
          ? "risultato trovato"
          : "risultati trovati";
      return `${this.pharmaciesList.length} ${resultLabel}`;
    },
    splitterModel: {
      // getter
      get: function () {
        return this.limits[0];
      },
      // setter
      set: function (newValue) {
        return newValue;
      },
    },
    limits() {
      if (this.Screen.lt.xl) return [45, 45];
      if (this.Screen.lt.md) return [50, 50];
      if (this.isFullsize) return [30, 30];
      return [35, 35];
    },
    isName() {
      return !!this.name;
    },
    isAddress() {
      return !!this.address?.coords;
    },
    isDistance() {
      return this.distance > 0.5;
    },
    nFilters() {
      let counter = 0;
      let filters = [this.isName, this.isAddress, this.isDistance];
      filters.forEach((filter) => {
        if (filter) counter++;
      });
      return counter;
    },
  },
  async created() {
    let { distance, name, address } = this.$route.params;
    this.name = name;
    this.newName = name;
    this.distance = distance;
    this.address = address;
    this.newAddress = address;
    this.newDistance = distance;

    // Se non abbiamo i parametri necessari probabilmente
    // l'utente è arrivato a questa pagina con un link diretto
    // e non tramite la pagina di ricerca.
    // Per questo motivo lo redirigiamo alla pagina di ricerca
    if (!this.isName && !this.isAddress) {
      let name = PHARMACY_SEARCH.name;
      await this.$router.replace({ name });
      return;
    }

    this.isLoading = true;

    try {
      let { data: partecipantPharmacies } = await getPartecipantPharmacies();
      await this.$store.dispatch(
        "setPartecipantPharmarcies",
        partecipantPharmacies
      );
    } catch (error) {
      let message = "Non è stato possibile recuperare le farmacie aderenti";
      apiErrorNotifyDialog({ error, message });
    }

    await this.searchPharmacies();
  },
  watch: {
    newAddress: {
      immediate: true,
      handler(val, oldVal) {
        this.newDistance = val?.coords ? DEFAULT_DISTANCE : 0;
      },
    },
  },
  methods: {
    async searchPharmacies(isNew = true) {
      if (!this.address?.coords && !this.name) {
        this.noFiltersErr = true;
        return;
      }
      this.noFiltersErr = false;

      if (isNew) {
        this.offset = 0;
        this.isLoading = true;
        this.pharmacies = [];
      } else {
        this.loadingMoreItems = true;
      }

      let coords = this.address?.coords;
      let distance = this.distance;
      if (coords && this.distance === 0) distance = 0.5;

      let params = {
        latitudine: this.latitude,
        longitudine: this.longitude,
        distanza: distance,
        dati_aggiuntivi_celiachia: false,
        s: this.name,
        limit: SEARCH_ITEMS_LIMIT,
        offset: this.offset,
      };

      try {
        let response = await getPharmacies({ params });
        let pharmaciesResponse = response.data;
        if (isNew) this.pharmacies = pharmaciesResponse ?? [];
        else this.pharmacies = this.pharmacies.concat(pharmaciesResponse);

        if (this.pharmacies?.length > 0) {
          let headers = response.headers;
          let xPage = parseInt(headers["x-page"]);
          let xTotalPages = parseInt(headers["x-total-pages"]);
          if (xPage < xTotalPages) {
            this.offset = this.offset + SEARCH_ITEMS_LIMIT;
          }
          this.areMoreElements = xTotalPages > xPage;
        }
      } catch (e) {
        apiErrorNotifyDialog({
          error: e,
          message: "Non è stato possibile effettuare la ricerca.",
        });
      } finally {
        this.isLoading = false;
        this.loadingMoreItems = false;
      }
    },
    loadMoreResults() {
      this.loadingMoreItems = true;
      this.searchPharmacies(false);
    },
    showMarker(index, pharmacy) {
      this.pharmacyFocused = index;
      this.selectedPharmacy = pharmacy;
    },
    showItemCard(index, pharmacy) {
      if (this.pharmacyFocused === index) {
        this.pharmacyFocused = null;
        this.selectedPharmacy = null;
        return;
      }
      this.pharmacyFocused = index;
      this.selectedPharmacy = pharmacy;
      this.scrollToItem(index);
    },
    scrollToItem(index) {
      let results = this.$refs.pharmacyCardObjects;
      let resultsFullsize = this.$refs.pharmacyCardObjectsFullsize;
      let itemCard = results ? results[index] : null;
      let itemCardFullsize = resultsFullsize ? resultsFullsize[index] : null;
      this.$nextTick(() => {
        if (itemCard) scrollToElement(itemCard);
        if (itemCardFullsize) scrollToElement(itemCardFullsize);
      });
    },
    toggleFilter() {
      this.isOpenFiltersDialog = !this.isOpenFiltersDialog;
    },
    onInputView(val) {
      if (val) this.scrollToItem(this.pharmacyFocused);
    },
    fullSizeMap(val) {
      this.isFullsize = val;
    },
    onShowMapListInput() {
      this.isShowingList = true;
      this.isFullsize = false;
      this.scrollToItem(this.pharmacyFocused);
    },
    //FILTRI
    toggleNameFilter() {
      this.showFilterName = !this.showFilterName;
    },
    removeName() {
      this.name = "";
      this.newName = "";
      this.searchPharmacies();
    },
    setFilterName() {
      this.name = this.newName;
      this.showFilterName = false;

      if (!isEmpty(this.newName)) {
        this.address = null;
        this.newAddress = null;
      }

      this.searchPharmacies();
    },
    abortFilterName() {
      this.newName = this.name ?? "";
      this.showFilterName = false;
    },
    toggleAddressFilter() {
      this.showFilterAddress = !this.showFilterAddress;
    },
    removeAddress() {
      this.address = null;
      this.newAddress = null;
      this.searchPharmacies();
    },

    abortAddressFilter() {
      this.newAddress = this.address?.coords ? this.address : null;
      this.showFilterAddress = false;
    },
    addAddressFilter() {
      this.address = this.newAddress;
      this.distance = this.newDistance;
      this.searchPharmacies();
      this.showFilterAddress = false;
    },
    async onSearchPharmacies(filters) {
      this.address = filters?.address;
      this.name = filters?.name;
      this.distance = filters?.distance;
      this.isOpenFiltersDialog = false;
      await this.searchPharmacies();
    },
  },
};
</script>

<style lang="sass">
.page-pharmacies-search-results
  min-height: 500px

  .height-area
    height: 600px

    &.fullsize
      height: 100vh !important

  .height-area-mobile
    height: 500px

.farab-bg-default
  background: $lms-background-color

#fullsize-map-dialog
  .map-list-btn
    margin-bottom: 20px
    z-index: 2000

  .height-fullsize
    height: 100vh !important

    &.fullsize__list
      padding-left: 16px

#farab-filters
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
