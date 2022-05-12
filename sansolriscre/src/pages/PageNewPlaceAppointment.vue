<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <lms-page padding>
    <lms-page-title v-if="!isNewAppointment"
      >Modifica luogo per {{ this.screeningName }}</lms-page-title
    >
    <lms-page-title v-else
    >Nuovo appuntamento per {{ this.screeningName }}</lms-page-title
    >
    <!-- Appuntamento attuale-->
    <q-card class="q-my-md text-body1"  v-if="!isNewAppointment" >
      <q-card-section class="q-pa-none">
        <lms-card-item no-actions>
          <template slot="primary">
            <lms-card-item-primary>
              <template slot="icon">
                <q-icon size="md" :name="appointmentTypeIcon" />
              </template>
              <template slot="text">
                <div class="text-subtitle1 text-weight-bold q-pa-sm">
                  Appuntamento attuale
                </div>
              </template>
            </lms-card-item-primary>
          </template>
          <template slot="secondary">
            <q-item v-if="appointment" class="full-height" :class="{'q-pt-lg' : $q.screen.gt.xs}">
              <q-item-section >
                <div class="row items-stretch">
                  <div class="col-12 col-sm-6 " v-if="!isDummyAppointment">
                    <div class="row">
                      <div class="col">
                        <div>Data</div>
                        <div>
                          <strong>{{ appointmentDate | date }}</strong>
                        </div>
                      </div>
                      <div class="col">
                        <div>Orario</div>
                        <div>
                          <strong>{{ appointmentHour }}</strong>
                        </div>
                      </div>
                    </div>

                  </div>

                  <div class="col-12 col-sm-6" :class="{'q-pt-md' : $q.screen.lt.sm}">
                    <div>Struttura</div>
                    <div><strong>{{appointmentOpUnit}}</strong></div>
                    <div>
                      {{appointmentAddress}}
                    </div>
                  </div>
                </div>
              </q-item-section>
            </q-item>
            <template v-else>
              <div class="row col full-height items-center  q-pa-md">
                <div class="col-12">
                  <q-banner  class="h-banner h-banner--info full-width">
                    {{ notAppointmentMsg }}
                  </q-banner>
                </div>
              </div>
            </template>
            <template slot="actions"> </template>
          </template>
        </lms-card-item>
      </q-card-section>
    </q-card>

    <div :class="isNewAppointment ? 'q-mt-xl': 'q-mt-lg'">
      <q-tabs v-model="tab" active-color="primary" align="left" no-caps>
        <q-tab
          name="map"
          label="Cerca su mappa"
          default
          class="text-subtitle1 q-py-sm"
        />
        <q-tab
          name="facilities"
          label="Cerca per struttura"
          class="text-subtitle1 q-py-sm"
          :disable="isLoading"
        />
      </q-tabs>
      <q-tab-panels v-model="tab" animated class="bg-transparent">
        <!--CERCA SU MAPPA-->
        <q-tab-panel name="map" class="no-padding">
          <template v-if="!isLoading">
            <template  v-if="$q.screen.gt.xs">
              <q-splitter
                v-model="splitterModel"
                :limits="splitterLimits"
              >
                <template v-slot:before>
                  <div class="q-pa-md q-mb-lg">
                    <div class="text-caption"><p>Strutture più vicine a:</p></div>
                    <div class="row items-center ">
                      <div class="col-12 col-sm-auto q-pr-lg">
                        <strong>{{ onSearchAddress }}</strong>
                      </div>
                      <div
                        class="col-12 col-sm-auto cursor-pointer text-primary q-py-x"
                        @click="openAddressModal"
                      >
                        <strong>modifica</strong>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div
                      class="row  q-pl-md">
                      <template v-if="nearestOpUnitsList.length > 0">
                        <q-scroll-area
                          id="scroll-area-vertical"
                          class="q-px-0 full-width"
                          style="height: 550px"
                        >
                          <div
                            class="q-mr-md q-mb-lg"
                            ref="opUnitCardObjectsVer"
                            v-for="(opUnit, index) in nearestOpUnitsList"
                            :key="index"
                          >
                            <csi-op-unit-card :op-unit="opUnit" :focused="opUnitFocused === index" @show-marker="(value) => showMarker(value,index)" @show-calendar="openCalendarModal"/>
                          </div>

                          <!--                        <div-->
                          <!--                          class="col-12 text-primary text-weight-bold text-center cursor-pointer q-pa-lg"-->
                          <!--                          @click="showMore()"-->
                          <!--                        >-->
                          <!--                          Mostra altri-->
                          <!--                        </div>-->
                        </q-scroll-area>
                      </template>
                      <template v-else>
                        <div class="q-pr-md">
                          <q-banner class="h-banner h-banner--info">Nessuna struttura trovata in base ai filtri di ricerca.</q-banner>
                        </div>

                      </template>
                    </div>
                  </div>
                </template>
                <template v-slot:after>
                  <div
                    class="csi-op-units-map"
                    ref="mapContainer"
                    style="height: 700px"
                  >
                    <csi-op-units-results-map
                      :user-coords="userAddressCoords"
                      :nearest-op-units-list="nearestOpUnitsList"
                      :active-item="opUnitFocused"
                      @show-op-unit-card="showOpUnitCard"
                    />
                  </div>

                </template>
              </q-splitter>
            </template>
            <template v-else>
              <div class="q-pa-md q-mb-lg">
                <div class="text-caption"><p>Strutture più vicine a:</p></div>
                <div class="row items-center ">
                  <div class="col-12 col-sm-auto q-pr-lg">
                    <strong>{{ onSearchAddress }}</strong>
                  </div>
                  <div
                    class="col-12 col-sm-auto cursor-pointer text-primary q-py-x"
                    @click="openAddressModal"
                  >
                    <strong>modifica</strong>
                  </div>
                </div>
              </div>
              <template v-if="nearestOpUnitsList && nearestOpUnitsList.length>0">
                <div class="height-area-mobile relative-position q-mt-lg" style="margin-bottom: 50px">
                  <div class="fit absolute-center " :class="{'invisible' : !isShowingMap}">
                    <div class="height-area-mobile full-width">
                      <csi-op-units-results-map
                        :user-coords="userAddressCoords"
                        :nearest-op-units-list="nearestOpUnitsList"
                        :active-item="opUnitFocused"
                        @show-op-unit-card="showOpUnitCard"
                      />
                    </div>
                    <div class="absolute-bottom" v-if="selectedOpUnitCard"
                         style="z-index:1000;">
                      <div class="q-pa-md">
                        <csi-op-unit-card
                          :op-unit="selectedOpUnitCard"
                          @show-marker="(value) => showMarkerMobile(value,opUnitFocused)" @show-calendar="openCalendarModal"/>
                      </div>
                    </div>

                    <!--                    <div class="absolute-bottom" v-if="selectedItem"-->
                    <!--                         style="z-index:1000;">-->
                    <!--                      <div class="q-pa-md">-->
                    <!--                        <lms-results-card-item-->
                    <!--                          mobile-->
                    <!--                          :item="selectedItem"-->
                    <!--                          @show-marker="(value) => showMarkerMobile(value, itemFocused)"-->
                    <!--                        />-->
                    <!--                      </div>-->
                    <!--                    </div>-->
                  </div>
                  <div class="fit absolute-center " v-show="!isShowingMap">
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
                          class="q-mr-md q-mb-lg"
                          ref="opUnitCardObjectsVer"
                          v-for="(opUnit, index) in nearestOpUnitsList"
                          :key="index"
                        >
                          <csi-op-unit-card :op-unit="opUnit" :focused="opUnitFocused === index" @show-marker="(value) => showMarker(value,index)" @show-calendar="openCalendarModal"/>
                        </div>
                      </q-scroll-area>

                    </div>
                  </div>

                </div>
                <div
                  class="absolute-bottom text-center q-pa-lg"
                >
                  <q-fab
                    square
                    :label="isShowingMap ? 'Mostra elenco' : 'Mostra su mappa'"
                    icon="map"
                    active-icon="menu"
                    direction="up"
                    color="white"
                    text-color="black"
                    @input="onFabInput"
                    @hide="isShowingMap = false"
                    padding="sm"
                  />
                </div>
              </template>
              <template v-else>
                <q-banner  class="h-banner h-banner--info">Nessuna struttura trovata in base ai filtri di ricerca.</q-banner>
              </template>
            </template>
          </template>
          <lms-inner-loading block :showing="isLoading" />
        </q-tab-panel>

        <!--CERCA PER STRUTTURA-->
        <q-tab-panel name="facilities">
          <div class="row items-center q-col-gutter-lg">
            <div class="col-12 col-sm-5">
              <q-select
                v-model="selectedAsl"
                :options="aslOptions"
                label="Seleziona Asl"
                @input="onInputSelectedAsl"
                clearable
              />
            </div>
            <div class="col-12 col-sm-5">
              <q-select
                v-model="selectedOpUnit"
                :options="opUnitsOptions"
                label="Selezione Struttura"
                clearable
              />
            </div>
            <div class="col-12 col-sm-2 text-center">
              <lms-button
                outline
                no-min-width
                @click="onSearchOperatingUnits()"
                >Cerca</lms-button
              >
            </div>
          </div>

          <div class="q-pt-lg row items-stretch q-col-gutter-lg" v-if="!isFacilitiesListLoading">
            <template v-if="facilitiesDetailsList.length>0">
              <div  v-for="(facility,index) in facilitiesDetailsList" :key="index" class="col-12 col-md-6">
                <csi-op-unit-card facility :op-unit="facility"  @show-calendar="openCalendarModal"/>
              </div>
            </template>
            <template v-else>
              <div class="full-width q-mt-lg">
                <q-banner class="h-banner h-banner--negative q-pa-md" v-if="emptyFilters">
                  Seleziona ASL o struttura di riferimento
                </q-banner>
                <template v-else>
                  <q-banner v-if="!isFirstSearch" class="h-banner h-banner--info q-pa-md">Nessuna struttura trovata in base ai filtri di ricerca.</q-banner>
                </template>
              </div>
            </template>
          </div>

          <lms-inner-loading block :showing="isFacilitiesListLoading" />
        </q-tab-panel>
      </q-tab-panels>
    </div>

    <q-dialog v-model="calendarModal" :maximized="$q.screen.lt.sm">
      <q-card v-if="newOpUnit" style="width:700px; max-width: 800px;">
        <q-card-section class="row items-center q-pb-none">
          <div class="col-10 col-sm-auto">
            Verifica disponibilità della struttura:
            <br v-if="$q.screen.lt.sm" />
            <strong>{{ newOpUnit.descrizione }}</strong>
          </div>
          <q-space />
          <div class="col-auto self-start">
            <q-btn icon="close" flat round dense v-close-popup />
          </div>
        </q-card-section>
        <q-card-section>
          <csi-appointment-edit-date-time
            :agenda-id="agendaId"
            :appointment-type="typeId"
            :first-available-date="
              newOpUnit.data_primo_appuntamento_disponibile
            "
            @new-appointment="selectedDateTime"
            @is-date-list="isAvailableDateList"
          />
        </q-card-section>

        <q-card-actions align="right">
          <lms-buttons padding>
            <lms-button @click="confirmNewChoice">Conferma</lms-button>
            <lms-button outline @click="closeCalendarModal">Annulla</lms-button>
          </lms-buttons>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="changeAddressModal" :maximized="$q.screen.lt.sm">
      <csi-suggest-address-dialog @new-address="saveNewAddress" />
    </q-dialog>

    <!--    DIALOG CONFERMA MODIFICA-->
    <csi-new-appointment-confirm-choice-dialog :value="isConfirmChoiceDialog" :appointment-params="newAppointmentParams" @close-dialog="closeConfirmDialog"/>

  </lms-page>
</template>

<script>
import CsiAppointmentEditDateTime from "../components/preventionScreening/CsiAppointmentEditDateTime";
import {HOME, NEW_APPOINTMENT_SUMMARY} from "src/router/routes";
import {
  getFacilities,
  getOperatingUnitDetail,
  getOperatingUnitsList
} from "src/services/api";
import { orderBy } from "src/services/business-logic";

import { scrollHorizontalToElement, scrollToElement } from "src/services/utils";
import CsiSuggestAddressDialog from "../components/preventionScreening/CsiSuggestAddressDialog";
import { apiErrorNotify } from "src/services/utils";
import { geocoding } from "src/services/api";
import { Screen } from "quasar";
import {intersectionBy, isEmpty, normalizeAddress} from "../services/utils";
import CsiNewAppointmentConfirmChoiceDialog
  from "../components/preventionScreening/CsiNewAppointmentConfirmChoiceDialog";
import {normalizeLoccsiCities, normalizeLoccsiRoads} from "../services/business-logic";
import CsiOpUnitsResultsMap from "../components/preventionScreening/CsiOpUnitsResultsMap";
import CsiOpUnitCard from "../components/preventionScreening/CsiOpUnitCard";
import {APPOINTMENT_TYPES_NAME} from "src/services/config";

const COLUMN_FACILITY = {
  name: "facility",
  label: "Struttura",
  align: "left",
  sortable: true
};
const COLUMN_ADDRESS = {
  name: "address",
  label: "Indirizzo",
  align: "left",
  sortable: true
};
const COLUMN_DATE = {
  name: "date",
  label: "Primo appuntamento disponibile",
  align: "left",
  sortable: true
};
const COLUMN_BOOKING = {
  name: "booking",
  label: "",
  align: "center"
};
const TABLE_PAGINATION = {
  rowsPerPage: 0
};

export default {
  name: "PageNewPlaceAppointment",
  components: {
    CsiOpUnitCard,
    CsiOpUnitsResultsMap,
    CsiNewAppointmentConfirmChoiceDialog,
    CsiSuggestAddressDialog,
    CsiAppointmentEditDateTime
  },

  data() {
    return {
      Screen,
      HOME,
      NEW_APPOINTMENT_SUMMARY,
      APPOINTMENT_TYPES_NAME,
      isLoading: false,
      tab: "map",
      typeLabel:'',
      typeId: "",
      appointment: null,
      screeningName:'',
      appointmentTypeIcon: "",
      userAddressCoords: null,
      selectedDate: null,
      selectedTime: null,
      selectedAsl: null,
      selectedOpUnit: null,
      newOpUnit: null,
      aslList: null,
      opUnitsList: null,
      splitterModel: null,
      splitterLimits: null,
      nearestOpUnitsList: null,
      opUnitFocused: null,
      calendarModal: false,
      facilitiesTableColumns: [
        COLUMN_FACILITY,
        COLUMN_ADDRESS,
        COLUMN_DATE,
        COLUMN_BOOKING
      ],
      tablePagination: TABLE_PAGINATION,
      facilitiesDetailsList: [],
      newAddress: null,
      suggestedAddress: null,
      changeAddressModal: false,
      onSearchingAddress: false,
      isFacilitiesListLoading: false,
      onSearchAddress: "",
      isNewAppointment: false,
      selectedOpUnitCard: null,
      isConfirmChoiceDialog:false,
      newAppointmentParams:{},
      centerMarker:false,
      isNewOpUnitSelected: false,
      isShowingMap:false,
      isFirstSearch:true,
      isDummyAppointment:false,
      areAvailableDates:false,
      emptyFilters:false
    };
  },
  watch: {
    Screen: {
      deep: true,
      immediate: true,
      handler(newValue, oldValue) {
        this.setScreenParams(newValue);
      }
    },
    selectedOpUnitCard: {
      deep: true,
      handler(newVal, oldVal) {
        console.log('newVal', this.isNewOpUnitSelected)
        if (newVal && this.isNewOpUnitSelected) {
          this.scrollToOpUnit(newVal)
        }
      }
    },

    isShowingMap: {
      handler(newVal, oldVal) {
        if (!newVal && this.selectedOpUnitCard) {
          this.scrollToOpUnit(this.selectedOpUnitCard)
        }
      }
    }
  },
  computed: {
    userInfo() {
      return this.$store.getters["preventionScreening/getUserRiscreInfo"];
    },
    userCodes() {
      return this.$store.getters["preventionScreening/getUserCodes"];
    },
    appointmentOpUnit(){
      return this.appointment ? this.appointment.luogo : ''
    },
    appointmentAddress(){
      let details = this.appointment?.detail
      return details ? `${details.unita_operativa_indirizzo}, ${ details.unita_operativa_civico } - ${ details.unita_operativa_comune }` : ''
    },
    appointmentDate(){
      return this.appointment?.data
    },
    appointmentHour(){
      return this.appointment?.ora ? this.appointment?.ora.slice(0,5) : ''
    },
    aslOptions() {
      let orderedAsl = [];
      if (this.aslList) {
        let list = this.aslList;
        let aslOptions = list.map(asl => {
          let label = asl.descrizione;
          return { label, value: asl.codice };
        });
        orderedAsl = orderBy(aslOptions, ["label"]);
      }
      return orderedAsl;
    },
    opUnitsOptions() {
      let orderedOpUnits = [];
      if (this.opUnitsList) {
        let opUnits = this.opUnitsList;
        if (this.selectedAsl) {
          opUnits = opUnits.filter(unit => {
            return unit.asl_codice === this.selectedAsl.value;
          });
        }
        let opUnitsOptions = opUnits.map(unit => {
          let label = unit.descrizione;
          return { label, value: unit.codice, _model: unit };
        });

        orderedOpUnits = orderBy(opUnitsOptions, ["label"]);
      }
      return orderedOpUnits;
    },
    agendaId(){
      return Number(this.newOpUnit?.agenda_codice)
    },
    notAppointmentMsg() {
      return this.allowedOperations?.messaggio;
    },
    allowedOperations(){
      let operationsList =  this.$store.getters["preventionScreening/getAllowedOperations"]
      return this.typeId ? operationsList[this.typeId] : null
    },
  },

  created() {
    if(isEmpty(this.$route.params) || !this.$route.params?.typeId){
      this.$router.push(HOME);
      return
    }
    this.isLoading = true;
    let { type, typeId, isNewAppointment, appointment, isDummyAppointment } = this.$route.params;
    this.appointment = appointment;
    this.isNewAppointment = isNewAppointment;
    this.isDummyAppointment = isDummyAppointment;
    this.typeLabel = type
    this.typeId = typeId;
    this.screeningName = APPOINTMENT_TYPES_NAME[typeId]
    this.appointmentTypeIcon = `img:/statics/la-mia-salute/icone/screening-${this.typeLabel}.svg`;
    this.getFacilitiesList();
    this.getDefaultOperatingUnitsList();
  },
  methods: {
    setScreenParams(value) {
      let isScreenSm = value.sm;
      this.splitterLimits = isScreenSm ? [50, 50] : [40, 60];
      this.splitterModel = isScreenSm ? 50 : 40;
    },
    async getDefaultOperatingUnitsList() {
      let userAddress = normalizeAddress(`${this.userInfo.indirizzo} ${this.userInfo.comune}`)
      let userCity = this.userInfo.comune
      let params = {
        indirizzo: userAddress,
        limit: "20"
      };

      try {
        let geoCodingResponse = await geocoding({
          _no5XXRedirect: true,
          params: params
        });
        let addressObject = geoCodingResponse.data;
        let address = null;
        if(!isEmpty(addressObject)) {
          addressObject = normalizeLoccsiRoads(addressObject);
          address = addressObject.filter(address => address.comune === userCity.toUpperCase())[0];
          if (!address) {
            let cityQuery = {indirizzo: userCity};
            let cityResponse = await geocoding({_no5XXRedirect: true, params: cityQuery});
            let cityObject = cityResponse.data;
            if (!isEmpty(cityObject)) {
              cityObject = normalizeLoccsiCities(cityObject);
              address = cityObject.filter(address => address.indirizzo === userCity.toUpperCase())[0]
            }

          }
          this.onSearchAddress = address?.indirizzo
          this.userAddressCoords = {
            lat: address?.coordinate?.coordinates[1],
            lon: address?.coordinate?.coordinates[0]
          };
          this.getNearestOperatingUnitsList(this.userAddressCoords);
        }
      } catch (e) {
        console.log(e);
      }
    },
    async getNearestOperatingUnitsList(coords) {
      this.nearestOpUnitsList = null
      this.isLoading = true
      let params = {
        tipologia: this.typeId,
        lat: coords.lat,
        lon: coords.lon,
        distanza: 10,
        limit:1000
      };

      try {
        let opUnitsResponse = await getOperatingUnitsList({
          _no5XXRedirect: true,
          params: params
        });
        let opUnitList = opUnitsResponse.data;
        this.nearestOpUnitsList = await this.mapNearestOpUnitDetails(opUnitList);

        console.log(this.nearestOpUnitsList)
      } catch (e) {
        apiErrorNotify({
          error: e,
          message: "Errore nel caricamento delle unità operative."
        });
      }finally {
          this.isLoading =false
        }

    },
    async mapOpUnitDetails(list) {
      let promises = []
      promises = list.map(async unit => {
          let params = {
            tipologia: this.typeId,
            codice_interno: this.userCodes.codice_interno,
            codice_interno_prefisso: this.userCodes.codice_interno_prefisso,
            asl: unit.asl_codice
          };

          let newOpUnitResponse = await getOperatingUnitDetail(unit.codice, {
            _no5XXRedirect: true,
            params: params
          });
          let details =  newOpUnitResponse.data;

          unit.agenda_codice = details.agenda_codice
          unit.dipartimento_codice = details.dipartimento_codice
          unit.indirizzo_label = `${unit.indirizzo_geo?.tipo_via_stradario} ${unit.indirizzo_geo?.via} ${unit.indirizzo_geo?.civico}, ${unit.indirizzo_geo?.comune}`
          unit.dettaglio = details
          unit.data_primo_appuntamento_disponibile = details.data_primo_appuntamento_disponibile
          return unit
        });

        return Promise.all(promises);


    },
    async mapNearestOpUnitDetails(list) {
      let opUnitList = list.filter(item => {
        return this.opUnitsList.some( opUnitItem => {
          return item.codice === opUnitItem.codice && item.asl_codice === opUnitItem.asl_codice;
        });
      })

      let promises = opUnitList.map(async unit => {
        let params = {
          tipologia: this.typeId,
          codice_interno: this.userCodes.codice_interno,
          codice_interno_prefisso: this.userCodes.codice_interno_prefisso,
          asl: unit.asl_codice
        };
        let newOpUnitResponse = await getOperatingUnitDetail(unit.codice, {
          _no5XXRedirect: true,
          params: params
        });
        let details =  newOpUnitResponse.data;

        unit.agenda_codice = details.agenda_codice
        unit.dettaglio = details
        unit.data_primo_appuntamento_disponibile = details.data_primo_appuntamento_disponibile
        return unit
      });
      this.isFacilitiesListLoading = false;
      return Promise.all(promises);
    },
    setIcon(index) {
      let url =
        index === this.opUnitFocused
          ? "/statics/la-mia-salute/icone/mappa-pin-attivo.svg"
          : "/statics/la-mia-salute/icone/mappa-pin.svg";
      return L.icon({
        iconUrl: url,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34]
      });
    },
    async getFacilitiesList() {
      let params = {
        tipologia: this.typeId,
        codice_interno: this.userCodes.codice_interno,
        codice_interno_prefisso: this.userCodes.codice_interno_prefisso
      };

      let facilitiesResponse = await getFacilities({
        _no5XXRedirect: true,
        params: params
      });
      this.aslList = facilitiesResponse.data.asl;
      this.opUnitsList = facilitiesResponse.data.unita_operative;

    },
    showOpUnitCard(index) {
      // if (this.opUnitFocused === index) {
      //   this.opUnitFocused = null;
      //   this.selectedOpUnitCard = null;
      //   return;
      // } else {
      //   this.opUnitFocused = index;
      //   this.selectedOpUnitCard = this.nearestOpUnitsList[index];
      // }
      // let opUnitcardV = this.$refs.opUnitCardObjectsVer[index];
      // scrollToElement(opUnitcardV);

      if (this.opUnitFocused === index) {
        this.opUnitFocused = null
        this.selectedOpUnitCard = null
        return
      }
      this.opUnitFocused = index
      this.isNewOpUnitSelected = true
      this.selectedOpUnitCard = this.nearestOpUnitsList[index]
    },
    showMarker(value, index) {
      if (value) {
        this.centerMarker = false
        this.opUnitFocused = index
        this.isNewOpUnitSelected = false
        this.selectedOpUnitCard = this.nearestOpUnitsList[index]
      }

    },
    showMarkerMobile(value, index){
      if (value) {
        this.opUnitFocused = null
        this.centerMarker = true
        setTimeout(()=>{
          this.opUnitFocused = index
          this.isNewOpUnitSelected = false
          this.selectedOpUnitCard = this.nearestOpUnitsList[index]
        }, 100)

      }
    },
    scrollToOpUnit(item) {
      console.log('scroll', item)
      let index = this.nearestOpUnitsList.indexOf(item)
      let itemCard = this.$refs.opUnitCardObjectsVer[index]

      this.$nextTick(() => {
        scrollToElement(itemCard)
      })

    },
    openCalendarModal(opUnit) {
      this.newOpUnit = opUnit;
      this.calendarModal = true;
    },
    openAddressModal() {
      this.changeAddressModal = true;
    },
    onFabInput(val) {
      this.isShowingMap = val;
    },
    selectedDateTime(dateTime) {
      this.selectedDate = dateTime.date;
      this.selectedTime = dateTime.time;
    },
    closeCalendarModal() {
      this.selectedDate = null;
      this.selectedTime = null;
      this.calendarModal = false;
    },
    async onSearchOperatingUnits() {
      this.emptyFilters= false
      if(this.selectedAsl === null && this.selectedOpUnit === null){
        this.facilitiesDetailsList=[]
        this.emptyFilters= true
        return
      }
      try {
        this.isFacilitiesListLoading = true;
        this.facilitiesDetailsList=[]
        let facilitiesList = [];
        if (this.selectedOpUnit) {
          facilitiesList = [this.selectedOpUnit];
        } else {
          facilitiesList = this.opUnitsOptions;
        }
        facilitiesList = facilitiesList.map(f => {
          return f._model;
        });
        this.facilitiesDetailsList = await this.mapOpUnitDetails(facilitiesList);
      } catch (e) {
        apiErrorNotify({
          error: e,
          message: "Errore nel caricamento delle unità operative."
        });
      }finally {
        this.isFacilitiesListLoading = false;
        if(this.isFirstSearch) this.isFirstSearch =false
      }




      },
    saveNewAddress(newLocation) {
      console.log("emit", newLocation);
      this.changeAddressModal = false;
      this.onSearchAddress = newLocation.address;
      this.userAddressCoords = newLocation.coords;
      console.log("this.userAddressCoords", this.userAddressCoords);
      this.getNearestOperatingUnitsList(this.userAddressCoords);
    },
    confirmNewChoice(){
      if (!this.selectedDate || !this.selectedTime) {
        return;
      }

      let opUnitAddress = this.newOpUnit.dettaglio?.indirizzo +  ' ' + this.newOpUnit.dettaglio?.civico + ', ' + this.newOpUnit.dettaglio?.comune_descrizione;
     this.newAppointmentParams= {
        newAppointmentInfo: {
          tipologia_codice: this.typeId,
          agenda_codice: this.newOpUnit.agenda_codice,
          unita_operativa_codice: this.newOpUnit.codice,
          asl_codice: this.newOpUnit.asl_codice,
          dipartimento_codice: this.newOpUnit.dipartimento_codice,
          data: this.selectedDate,
          ora: this.selectedTime.ora,
          ora_inizio: this.selectedTime.ora_inizio,
          ora_fine: this.selectedTime.ora_fine,
          ora_slot: this.selectedTime.ora_slot,
          progressivo: this.selectedTime.progressivo
        },
        opUnitAddress: opUnitAddress,
        type: this.typeLabel,
        isNewAppointment: this.isNewAppointment
      };

      this.isConfirmChoiceDialog =true



    },
    createNewAppointment() {
      if (!this.selectedDate || !this.selectedTime) {
        return;
      }

      let opUnitAddress = this.newOpUnit.dettaglio?.indirizzo +  ' ' + this.newOpUnit.dettaglio?.civico + ', ' + this.newOpUnit.dettaglio?.comune_descrizione;
      let params = {
        newAppointmentInfo: {
          tipologia_codice: this.typeId,
          agenda_codice: this.newOpUnit.agenda_codice,
          unita_operativa_codice: this.newOpUnit.codice,
          asl_codice: this.newOpUnit.asl_codice,
          dipartimento_codice: this.newOpUnit.dipartimento_codice,
          data: this.selectedDate,
          ora: this.selectedTime.ora,
          ora_inizio: this.selectedTime.ora_inizio,
          ora_fine: this.selectedTime.ora_fine,
          ora_slot: this.selectedTime.ora_slot,
          progressivo: this.selectedTime.progressivo
        },
        opUnitAddress: opUnitAddress,
        type: this.typeLabel,
        isNewAppointment: this.isNewAppointment
      };

      let route = {
        name: this.NEW_APPOINTMENT_SUMMARY.name,
        params
      };

      this.$router.replace(route);
    },
    closeConfirmDialog(val){
      this.isConfirmChoiceDialog =false
    },
    isAvailableDateList(val){
      this.areAvailableDates=val
    },
    onInputSelectedAsl(val){
      this.selectedOpUnit = null
    }
  }
};
</script>

<style lang="sass">
.height-scroll-area
  height: 550px
  &.fullsize
    height: 100vh !important

.op-unit-horizontal-item
  &:hover
    background-color: $grey-3
  border-right: 1px solid rgba(0, 0, 0, 0.12)


.csi-op-units-map
  height: 100%
  width: 100%

.op-units-table
  tbody
    td
      padding: 16px

.height-area-mobile
  height: 550px
</style>
