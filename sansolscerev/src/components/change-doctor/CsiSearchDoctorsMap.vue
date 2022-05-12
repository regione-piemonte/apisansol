<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-modal
    @input="$emit('input', $event)"
    @hide="resetMap()"
    :value="value"
    class="csi-results-map-modal maximized"
    ref="modal"
    v-if="searchParams"
  >
    <q-modal-layout header-class="no-shadow"  >
      <div class="absolute q-pa-lg  "  style="right: 0; z-index:1000">
        <q-btn
          round
          color="white"
          text-color="primary"
          size="md"
          icon="close"
          v-close-overlay
        />
      </div>

      <div class="row full-height" >

        <!-- Lista risultati-->
        <q-scroll-area
          v-show="viewList"
          class="col-12 col-md-4  full-height "
          ref="verticalContainer"
        >
          <!--Risultati-->
          <div
            class="cursor-pointer"
            v-for="(office, index) in officesList"
            :key="index"
            @click="showMarker(index)"
            ref="cardsVerticalRef"
          >
            <csi-doctor-item-map
              :office="office"
              :is-selected="selectedCardId===index"
            />
          </div>
        </q-scroll-area>

        <!-- Mappa-->
        <div class="col-12 col-md-8 no-scroll map-modal-map full-height " v-show="viewMap">
          <template v-if="mapProperties && officesList">
            <div class="csi-results-map"  ref="mapContainer" >
              <l-map
                ref="searchMap"
                :zoom="zoom"
                :center="center"
                :options="mapOptions"
                :bounds ="bounds"
                @update:zoom="zoomUpdate"
              >
                <l-tile-layer
                  :url="url"
                  :attribution="attribution"
                />
                <l-control position="topleft" v-if="userAddressCoords">
                  <q-btn
                    no-ripple
                    no-caps
                    color="white"
                    text-color="black"
                    icon="gps_fixed"
                    @click="goToDefaultCenter()"
                  />
                </l-control>

                <l-marker-cluster ref="markersCluster" :options="{chunkedLoading: true }">
                  <l-marker
                    v-for="(office, index) in officesList"
                    :key="index"
                    :lat-lng="addressCoords(office)"
                    :icon="setIcon(index)"
                    @click="showDoctorCard(index)"
                    ref="markersRef"
                  >
                    <l-popup
                      class="csi-map-popup"
                      v-if="$q.screen.gt.sm "
                      :options="{closeButton:false, className: 'csi-map-popup'}"
                    >
                      <q-item class="no-margin no-padding items-start">
                        <q-item-side>
                          <csi-icon-base class="csi-svg-icon--md">
                            <template v-if="isPediatrician(office.medico)">
                              <csi-icon-avatar-pediatrician :is-female="office.medico.sesso === 'F'"/>
                            </template>
                            <template v-else>
                              <csi-icon-avatar-doctor :is-female="office.medico.sesso === 'F'" />
                            </template>
                          </csi-icon-base>
                        </q-item-side>
                        <q-item-main class="q-body2 q-pb-xs text-weight-bold no-margin"
                            :label="doctorName(office.medico)"
                            label-lines="2"
                            :sublabel="doctorAddress(office)"
                            sublabel-lines="3"
                          >
                        </q-item-main>
                      </q-item>
                    </l-popup>
                  </l-marker>
                </l-marker-cluster>
                <l-marker
                  v-if="userAddress"
                  :icon="userAddressIcon"
                  :lat-lng="userAddressCoords"
                  ref="markerPosition"
                />
              </l-map>
            </div>

            <div class="absolute-bottom q-mb-xxl" v-if="($q.screen.lt.md || isListOpen)  && selectedOffice" style="z-index:1000;">
              <csi-doctor-item-map
                :office="selectedOffice"
              />
            </div>
          </template>

        </div>

<!--        &lt;!&ndash;Risultati&ndash;&gt;-->
<!--        <div-->
<!--          v-show="this.$q.screen.lt.lg"-->
<!--          class="absolute full-width csi-results-horizontal">-->
<!--            <div class="row items-end no-wrap csi-results-horizontal-scroll"-->
<!--                 ref="horizontalContainer"-->
<!--            >-->

<!--                <div-->
<!--                  v-for="(office, index) in officesList"-->
<!--                  :key="index"-->
<!--                  @click="showMarker(index)"-->
<!--                  ref="cardsHorizontalRef"-->
<!--                  class="cursor-pointer col-auto"-->
<!--                >-->
<!--                  <csi-doctor-item-map-->
<!--                    :office="office"-->
<!--                    style="width: 300px"-->
<!--                    :is-selected="selectedCardId===index"-->
<!--                  />-->
<!--                </div>-->
<!--            </div>-->

<!--        </div>-->

      </div>

<!--      <div class="absolute-bottom q-mb-sm" v-if="$q.screen.lt.md" style="z-index:1000; height:50px;">-->
<!--        <div class="row full-height items-center justify-center">-->
<!--&lt;!&ndash;          <q-btn&ndash;&gt;-->
<!--&lt;!&ndash;            color="white"&ndash;&gt;-->
<!--&lt;!&ndash;            @click="showHideList"&ndash;&gt;-->
<!--&lt;!&ndash;            class="fixed"&ndash;&gt;-->
<!--&lt;!&ndash;            text-color="black"&ndash;&gt;-->
<!--&lt;!&ndash;            :icon="isListOpen ? 'map' : 'menu'"&ndash;&gt;-->
<!--&lt;!&ndash;            :label="isListOpen ? 'Mostra su mappa' : 'Mostra elenco'"&ndash;&gt;-->
<!--&lt;!&ndash;            v-close-overlay&ndash;&gt;-->
<!--&lt;!&ndash;          />&ndash;&gt;-->

<!--          <q-btn-->
<!--            color="white"-->
<!--            class="fixed"-->
<!--            text-color="black"-->
<!--            icon="menu"-->
<!--            label="Mostra elenco"-->
<!--            v-close-overlay-->
<!--          />-->

<!--        </div>-->



<!--      </div>-->

    </q-modal-layout>
    <!--      LOADER-->
    <csi-inner-loading :visible="!mapProperties" />
  </q-modal>
</template>
<script>

  import {latLng, latLngBounds} from "leaflet";
  import { Icon } from 'leaflet';
  import 'leaflet/dist/leaflet.css';
  import 'leaflet.markercluster/dist/MarkerCluster.css';
  import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
  import {LMap, LPopup, LTileLayer, LMarker, LControl } from "vue2-leaflet";

  import CsiDoctorItemMap from "components/change-doctor/CsiDoctorItemMap";
  import {doctorsOfficesListResults} from "@services/api/change-doctor";
  import CsiIconAvatarDoctor from "components/global/icons/CsiIconAvatarDoctor";
  import CsiIconBase from "components/global/icons/CsiIconBase";
  import CsiIconHospital from "components/global/icons/CsiIconHospital";
  import Vue2LeafletMarkerCluster from 'vue2-leaflet-markercluster'
  import { scroll } from 'quasar'
  import {scrollToElement} from "@services/global/utils";
  import CsiIconAvatarPediatrician from "components/global/icons/CsiIconAvatarPediatrician";
  const { getScrollTarget, setScrollPosition, getScrollPosition } = scroll;
  import markerIconActive from 'src/statics/icons/svgs/marker-icon-active.svg';
  import  markerIcon from 'src/statics/icons/svgs/marker-icon.svg';
  import markerIconGeoPosition from 'src/statics/icons/svgs/geo-position.svg';


  // delete L.Icon.Default.prototype._getIconUrl;
  //
  // L.Icon.Default.mergeOptions({
  //   iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  //   iconUrl: require('leaflet/dist/images/marker-icon.png'),
  //   shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  // });


  export default {
    name: 'CsiSearchDoctorsMap',
    components: {
      CsiIconAvatarPediatrician,
      CsiDoctorItemMap,
      CsiIconAvatarDoctor,
      CsiIconHospital,
      CsiIconBase,
      LMap,
      LTileLayer,
      LMarker,
      LControl,
      LPopup,
      Icon,
      'l-marker-cluster' : Vue2LeafletMarkerCluster
  },
    props: {
      value: {type: Boolean, required: false, default: false},
      searchParams: {type: Object, required: false, default:null},
      isNewSearch:{type: Boolean, required: false, default: false},
      userAddress:{type:Object, default:null}
    },
    data() {
      return {
        searchMap:null,
        markersCluster:null,
        mapProperties: false,
        markerObjects:null,
        cardVerticalObjects:null,
        cardHorizontalObjects:null,
        bounds:[],
        zoom: 13,
        currentZoom:null,
        center: null,
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution:
          '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        doctorInfo:null,
        currentCenter: null,
        showParagraph: false,
        mapOptions: {
          maxZoom:18,
          zoomSnap: 0.5,
          dragging: true,
          touchZoom: true,
        },
        isSearchFinished: false,
        officesList:null,
        selectedCardId:null,
        selectedMarkerId : null,
        selectedOffice:null,
        isListOpen:false,
        userAddressIcon:
          L.icon({
            iconUrl:markerIconGeoPosition,
            iconSize:    [19, 36],
            iconAnchor:  [8, 36],
          }),
      }
    },
    computed:{
      viewList(){
        if(this.$q.screen.gt.sm)
          return true;
        else
          return  this.isListOpen
      },
      userDoctorId(){
        return this.$store.getters['changeDoctor/getUserDoctor']
      },

      viewMap(){
        if(this.$q.screen.gt.sm)
          return true;
        else
          return  !this.isListOpen
      },
      userAddressCoords(){
        let coords = null;
        if (this.userAddress){
          coords=  latLng(this.userAddress.lat,this.userAddress.lon)
        }
         return coords
      },

    },
    watch:{
      searchParams:{
        immediate: true,
        handler(newValue, oldValue){
          if((!oldValue || this.isNewSearch) && newValue)
           this.getDefaultValues()
        }
      }
    },
    created(){

    },
    methods: {
      resetMap(){
        if(this.markerObjects){
          for (let markerObject of this.markerObjects) {
            markerObject.closePopup();
          }
        }
      },
      async getDefaultValues(){
        if(this.officesList){
         this.officesList = null;

         }
        let latlng = null;
        if(this.searchParams.latitudine & this.searchParams.longitudine){
          latlng = latLng(this.searchParams.latitudine, this.searchParams.longitudine);
        }else{
          // Se non ci sono le coordinate inserisco le  coordinate del piemonte.
          latlng = latLng(45.060735, 7.923549);
        }

         this.center = latlng;

           try{

             let officesListPromise = await doctorsOfficesListResults( { _no5XXRedirect: true, params: this.searchParams});
             let officesListResponse =  officesListPromise.data;
             //Viene nascosto il proprio medico
             let officesResponse = officesListResponse.filter(office => office.medico.id !== this.userDoctorId);
             //FILTRO SOLO PER I MEDICI DI ALCUNE ASL
             //  officesResponse = officesResponse.filter(office => office.medico.asl && isAllowedASL(office.medico.asl.id));

             if(officesResponse){
               let doctorsList = [];
               let coords = [];
               officesResponse.forEach( office =>{
                 doctorsList.push(office.medico);
                 coords.push([office.coordinate.coordinates[1], office.coordinate.coordinates[0]])
               });

               // let availabilityResponse = await doctorsAvailability(doctorsList, {_no5XXRedirect: true});
               // let availabilityList =  availabilityResponse.data;
               //  this.officesList = this.setAvailability(officesResponse,availabilityList );
               this.officesList = officesResponse;

               this.bounds = latLngBounds(coords);
               this.mapProperties = true;
               this.$nextTick(() => {

                 this.searchMap = this.$refs.searchMap;

                 setTimeout(()=> this.searchMap.mapObject.invalidateSize(), 400);
                 this.currentZoom = this.searchMap.mapObject.getZoom();
                 this.markersCluster = this.$refs.markersCluster.mapObject;
                 this.markerObjects = this.$refs.markersRef.map(ref => ref.mapObject);
                 this.cardVerticalObjects = this.$refs.cardsVerticalRef;
                 this.cardHorizontalObjects = this.$refs.cardsHorizontalRef;
               });
             }

           }
           catch (e) {

           }


      },

   setAvailability(offices, availabilities){
    return offices.map(office => {
        let availability = availabilities.find(a => (a.medico_id === office.medico.id));
        office.disponibilita = availability;
        return office
    });

    },
      setIcon(index){
        let url = (index === this.selectedMarkerId) ? markerIconActive : markerIcon;

        return L.icon({
          iconUrl: url,
          iconSize:    [25, 41],
          iconAnchor:  [12, 41],
          popupAnchor: [1, -34],
        })

      },

      addressCoords(item){
        let coordinates = item.coordinate.coordinates;
        return latLng(coordinates[1], coordinates[0])
      },
      showDoctorCard(selectedItem){
        this.selectedMarkerId = selectedItem;
        if( this.selectedCardId === selectedItem){
          this.selectedCardId = null;
          this.selectedOffice=null;
          return
        }

        this.selectedCardId = selectedItem;
        this.selectedOffice=this.officesList[selectedItem];
        // if(this.$q.screen.lt.lg){
        //   let doctorCard = this.cardHorizontalObjects[selectedItem];
        //   let container = this.$refs.horizontalContainer;
        //   let center= doctorCard.offsetLeft - (container.clientWidth/2 - doctorCard.clientWidth/2);
        //   container.scrollLeft = center;
        // }
        if(this.$q.screen.gt.sm){
          let doctorCard = this.cardVerticalObjects[selectedItem];
          scrollToElement(doctorCard, 0);
        }

      },

      showMarker(selectedOffice){
        if(this.selectedMarkerId === selectedOffice){
          this.selectedOffice=null;
          return
        }
        this.selectedOffice = this.officesList[selectedOffice];
        this.selectedMarkerId = selectedOffice;
        this.selectedCardId = selectedOffice;
        let selectedMarker= this.markerObjects[selectedOffice];

      //  this.center= selectedMarker.getLatLng();
       // this.searchMap.mapObject.setView(this.center, this.currentZoom);
        setTimeout(() => {
          this.markersCluster.zoomToShowLayer(selectedMarker, () => {
            console.log('selectedMarker', selectedMarker);

            if (!selectedMarker.isPopupOpen()) {
              if (this.$q.screen.gt.sm) selectedMarker.openPopup();
            }
          });
        }, 500)

      },
      zoomUpdate(zoom){
        this.currentZoom = zoom;
      },
      isPediatrician(doctor){
        let type = doctor.tipologia.id;
        return (type === this.$config.changeDoctor.doctorsType.PLS)
      },
      doctorName(doctor){
        return doctor.nome + ' ' + doctor.cognome
      },
      doctorAddress(office){
        return office.indirizzo + ', ' + office.comune
      },
      showHideList(){
         this.isListOpen =  !this.isListOpen
      },
      goToDefaultCenter(){
        this.searchMap.mapObject.setView( this.userAddressCoords, this.currentZoom)
      }

    }
  }
</script>


<style lang="stylus">
  @require '~variables'
  .csi-results-map-modal
    .modal-content
      width: 90%;
      height: 90%;
    .q-modal-layout
      background : $csi-brand-colors.background;
    .q-modal-layout-content
      overflow: hidden !important;

  .csi-results-map-modal-map
    position: -webkit-sticky;
    position: sticky;
    top: 0;
  .csi-results-map
    width : 100%;
    height: 100%;

  .middle-height
    height : 50% !important;
  .middle-width
    width : 50% !important;
  .csi-map-popup
    .leaflet-popup-content-wrapper
      border-radius : 3px;

  .csi-results-horizontal
    height 300px;
    bottom:0;
    left:0;
    z-index:900;
    .csi-results-horizontal-scroll
      overflow-x: auto;
      height : 300px;

  .csi-results-vertical
    max-height:100%;
    top:0;
    left:0;
    z-index:900;


</style>
