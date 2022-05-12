<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <lms-page padding>
    <template v-if="nearestOpUnitsList">

      <q-select
        class="q-mb-xl"
        v-model="typeId"
        :options="screeningTypeOptions"
        label="Tipologia di screening"
        @input="getFacilitiesList"
        emit-value
        map-options
      />

      <template v-if="!isLoading">
        <template  v-if="$q.screen.gt.xs">
          <q-splitter
            v-model="splitterModel"
            :limits="splitterLimits"
          >
            <template v-slot:before>
              <div
                  class="row  q-pl-md">
                  <template v-if="nearestOpUnitsList.length > 0">
                    <q-scroll-area
                      id="scroll-area-vertical"
                      class="q-px-0 full-width"
                      style="height: 700px"
                    >
                      <div
                        class="q-mr-md q-mb-lg"
                        ref="opUnitCardObjectsVer"
                        v-for="(opUnit, index) in nearestOpUnitsList"
                        :key="index"
                      >
                        <q-card
                          class="lms-op-unit-card service-card"
                          :class="{ active: opUnitFocused === index }"
                          @click="showMarker(index)"
                        >
                          <q-card-section>
                            <div class=" row items-start">
                              <!--                          <q-icon class="col-auto q-mr-md" name="img:/statics/la-mia-salute/icone/unita-operativa.svg" :size="($q.screen.sm ) ? 'md' : 'lg'"/>-->
                              <div class="col">
                                <div class="text-subtitle1 q-mb-xs">
                                  <strong>{{opUnit.descrizione}}</strong>
                                </div>
                                <div>
                                  {{ opUnit.indirizzo }}
                                </div>
                              </div>
                            </div>
                          </q-card-section>
                        </q-card>

                      </div>

                    </q-scroll-area>
                  </template>
                  <template v-else>
                    <div class="q-pr-md">
                      <q-banner  class="h-banner h-banner--info">Nessuna struttura trovata in base ai filtri di ricerca.</q-banner>
                    </div>

                  </template>
                </div>
            </template>
            <template v-slot:after>
              <div
                class="csi-op-units-map"
                ref="mapContainer"
                style="height: 700px"
              >
                <csi-op-units-results-map
                  :user-coords="PIEDMONT_COORDS"
                  :nearest-op-units-list="nearestOpUnitsList"
                  :active-item="opUnitFocused"
                  @show-op-unit-card="showOpUnitCard"
                />
              </div>

            </template>
          </q-splitter>
        </template>
        <template v-else>
          <template v-if="nearestOpUnitsList && nearestOpUnitsList.length>0">
            <div class="height-area-mobile relative-position q-mt-lg" style="margin-bottom: 50px">
              <div class="fit absolute-center " :class="{'invisible' : !isShowingMap}">
                <div class="height-area-mobile full-width">
                  <csi-op-units-results-map
                    :user-coords="PIEDMONT_COORDS"
                    :nearest-op-units-list="nearestOpUnitsList"
                    :active-item="opUnitFocused"
                    @show-op-unit-card="showOpUnitCard"
                  />
                </div>
                <div class="absolute-bottom" v-if="selectedOpUnitCard"
                     style="z-index:1000;">
                  <div class="q-pa-md">
                    <q-card
                      class="lms-op-unit-card service-card"
                      @click="showMarkerMobile(opUnitFocused)"
                    >
                      <q-card-section>
                        <div class=" row items-start">
                          <!--                          <q-icon class="col-auto q-mr-md" name="img:/statics/la-mia-salute/icone/unita-operativa.svg" :size="($q.screen.sm ) ? 'md' : 'lg'"/>-->
                          <div class="col">
                            <div class="text-subtitle1 q-mb-xs">
                              <strong>{{selectedOpUnitCard.descrizione}}</strong>
                            </div>
                            <div>
                              {{ selectedOpUnitCard.indirizzo }}
                            </div>
                          </div>
                        </div>
                      </q-card-section>
                    </q-card>

                  </div>
                </div>

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
                      <q-card
                        class="lms-op-unit-card service-card"
                        :class="{ active: opUnitFocused === index }"
                        @click="showMarker(index)"
                      >
                        <q-card-section>
                          <div class=" row items-start">
                            <!--                          <q-icon class="col-auto q-mr-md" name="img:/statics/la-mia-salute/icone/unita-operativa.svg" :size="($q.screen.sm ) ? 'md' : 'lg'"/>-->
                            <div class="col">
                              <div class="text-subtitle1 q-mb-xs">
                                <strong>{{opUnit.descrizione}}</strong>
                              </div>
                              <div>
                                {{ opUnit.indirizzo }}
                              </div>
                            </div>
                          </div>
                        </q-card-section>
                      </q-card>
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
            <q-banner class="h-banner h-banner--info">Nessuna struttura trovata in base ai filtri di ricerca.</q-banner>
          </template>
        </template>
      </template>


    </template>
    <lms-inner-loading block :showing="isLoading" />
  </lms-page>
</template>

<script>
import {apiErrorNotify, capitalize, scrollToElement} from "../services/utils";
    import {latLng, latLngBounds} from "leaflet";
    import {getFacilities, getOperatingUnitDetail, getOperatingUnitsList} from "../services/api";

  import {APPOINTMENT_TYPES, APPOINTMENT_TYPES_LABEL, APPOINTMENT_TYPES_NAME, PIEDMONT_COORDS} from "src/services/config";
import CsiOpUnitsResultsMap from "components/preventionScreening/CsiOpUnitsResultsMap";

    export default {
        name: "PageUnitOpMap",
      components: {
        CsiOpUnitsResultsMap,

      },
        data(){
          return{
            Screen,
            APPOINTMENT_TYPES,
            PIEDMONT_COORDS,
            isLoading: false,
            operatingUnitsMap: null,
            tab: "map",
            typeId: "",
            appointment: null,
            screeningName:'',
            selectedOpUnit: null,
            newOpUnit: null,
            aslList: null,
            opUnitsList: null,
            splitterModel: null,
            splitterLimits: null,
            nearestOpUnitsList: null,
            userPosition: null,
            opUnitFocused: null,
            calendarModal: false,
            facilitiesDetailsList: [],
            isListOpen: false,
            selectedOpUnitCard: null,
            isConfirmChoiceDialog:false,
            screeningTypeOptions:[],
            isShowingMap:false,
            centerMarker:false
          }
        },
      watch:{
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
      created(){
          this.screeningTypeOptions =[
          {
            label: capitalize(APPOINTMENT_TYPES_NAME[APPOINTMENT_TYPES.CV]),
            value: APPOINTMENT_TYPES.CV
          },
          {
            label: capitalize(APPOINTMENT_TYPES_NAME[APPOINTMENT_TYPES.MX]),
            value: APPOINTMENT_TYPES.MX
          },
        ]
        this.splitterLimits = [40, 60];
        this.splitterModel =  40

          this.typeId = this.screeningTypeOptions[0].value
          this.getFacilitiesList()
      },
      computed:{
        userCodes() {
          return this.$store.getters["preventionScreening/getUserCodes"];
        },
        typeLabel(){
          return this.typeId ? capitalize(APPOINTMENT_TYPES_NAME[this.typeId]) : ''
        }
      },
      methods:{
        async getFacilitiesList() {
          if(!this.typeId)return
          this.isLoading =true
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
          this.getNearestOperatingUnitsList()
        },
        async getNearestOperatingUnitsList() {
          this.isLoading = true
          this.nearestOpUnitsList = null
          this.isLoading = true
          let params = {
            tipologia: this.typeId,
            lat:  PIEDMONT_COORDS.lat,
            lon: PIEDMONT_COORDS.lon,
            distanza: 100,
            limit:10000
          };

          try {
            let opUnitsResponse = await getOperatingUnitsList({
              _no5XXRedirect: true,
              params: params
            });
            let opUnitList = opUnitsResponse.data;
            this.nearestOpUnitsList = opUnitList.filter(item => {
              return this.opUnitsList.some( opUnitItem => {
                return item.codice === opUnitItem.codice && item.asl_codice === opUnitItem.asl_codice;
              });
            })


            console.log(this.nearestOpUnitsList)
            this.setMapDefaultValues();
          } catch (e) {
            apiErrorNotify({
              error: e,
              message: "Errore nel caricamento delle unità operative."
            });
          }
        },
        setMapDefaultValues() {
          let latlng = latLng(PIEDMONT_COORDS.lat,PIEDMONT_COORDS.lon);
          this.center = latlng;
          this.userPosition = latlng;
          let coords = [];

          if (this.nearestOpUnitsList.length > 0) {
            this.nearestOpUnitsList.forEach(unit => {
              let coordinates = unit.geo?.coordinates ?? []
              coords.push([coordinates[1], coordinates[0]]);
            });

            this.bounds = latLngBounds(coords);
          } else {
            this.bounds = latLngBounds([
              PIEDMONT_COORDS.lat,
              PIEDMONT_COORDS.lon
            ]);
          }
          this.isLoading=false;
        },
        opUnitAddressCoords(item) {
          // let coordinates = item.indirizzo_geo?.coordinate?.coordinates;
          let coordinates = item.geo?.coordinates;
          return latLng( coordinates[1], coordinates[0]);
        },
        onScrollArea({ verticalPosition }) {
          if (this.isListOpen) {
            let index = this.nearestOpUnitsList.indexOf(this.selectedOpUnitCard);
            // let index = this.opUnitFocused;
            let opUnitcardV = this.$refs.opUnitCardObjectsVer[index];
            scrollToElement(opUnitcardV);
          }
        },
        zoomUpdate(zoom) {
          this.currentZoom = zoom;
        },
        showMarker(index) {

            this.centerMarker = false
            this.opUnitFocused = index
            this.isNewOpUnitSelected = false
            this.selectedOpUnitCard = this.nearestOpUnitsList[index]

        },

        showMarkerMobile(index){
            this.opUnitFocused = null
            this.centerMarker = true
            setTimeout(()=>{
              this.opUnitFocused = index
              this.isNewOpUnitSelected = false
              this.selectedOpUnitCard = this.nearestOpUnitsList[index]
            }, 100)

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
          //
          // scrollToElement(opUnitcardV.$el);
          if (this.opUnitFocused === index) {
            this.opUnitFocused = null
            this.selectedOpUnitCard = null
            return
          }
          this.opUnitFocused = index
          this.isNewOpUnitSelected = true
          this.selectedOpUnitCard = this.nearestOpUnitsList[index]

        },
        screeningType(type){
          if( this.typeId === type) return
          this.typeId = type
          this.typeLabel = APPOINTMENT_TYPES_LABEL[type]
          this.getFacilitiesList()

        },
        onInputScreeningType(type){
          this.getFacilitiesList()
        },
        scrollToOpUnit(item) {
          console.log('scroll', item)
          let index = this.nearestOpUnitsList.indexOf(item)
          let itemCard = this.$refs.opUnitCardObjectsVer[index]

          this.$nextTick(() => {
            scrollToElement(itemCard)
          })

        },
        onFabInput(val) {
          this.isShowingMap = val;
        },
      }
    }
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
