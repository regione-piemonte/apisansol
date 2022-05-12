<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="full-width full-height lms-results-map" ref="mapContainer">
    <template v-if="mapProperties">
      <l-map
        ref="map"
        :zoom="zoom"
        :center="center"
        :options="mapOptions"
        :bounds="bounds"
        @update:center="onPan"
        @update:zoom="zoomUpdate"
      >
        <l-control position="topleft" v-if="userCoords ">
          <q-btn
            padding="xs"
            :ripple="false"
            no-caps
            color="white"
            text-color="black"
            icon="gps_fixed"
            @click="goToDefaultCenter()"
          />
        </l-control>
        <l-control position="topleft">
          <q-btn
            padding="xs"
            :ripple="false"
            no-caps
            color="white"
            text-color="black"
            :icon="busMarkersBtnIcon"
            @click="activeBusStopsMarkers()"
          >
            <!--            <q-tooltip content-class="bg-accent">La mia posizione</q-tooltip>-->
          </q-btn>
        </l-control>
        <l-control position="topright">
          <q-btn
            :ripple="false"
            no-caps
            color="white"
            text-color="black"
            :icon="this.isFullsize ? 'fullscreen_exit' : 'fullscreen'"
            Left
            :label="fullsizeMapLabel"
            @click="fullSizeMap()"
            :disable="!mapProperties"
          />
        </l-control>
        <l-tile-layer
          :url="url"
          :attribution="attribution"
        />
        <template v-if="showBusStopMarkers">
          <l-tile-layer :url="wmsTileLayerUrl"/>
        </template>


        <l-marker-cluster ref="markersCluster" :options="{chunkedLoading: true}">
          <l-marker
            v-for="(item, index) in foundItemsList"
            :key="index"
            :icon="setIcon(index)"
            :lat-lng="itemAddressCoords(item)"
            @click="showItemCard(index)"
            ref="markersRef"
          >
            <l-popup :options="{closeButton: false}" v-if="$q.screen.gt.xs">

              <q-item class="no-margin no-padding items-start">
                <q-item-section side class="q-pr-md">
                  <q-icon :name="itemIcon(item)" size="md"/>
                </q-item-section>
                <q-item-section class="text-body2 q-pb-xs no-margin">
                  <q-item-label><strong>{{itemName(item) | empty}}</strong></q-item-label>
                  <q-item-label> {{itemAddress(item) | empty}}</q-item-label>
                </q-item-section>
              </q-item>
            </l-popup>
          </l-marker>
        </l-marker-cluster>
        <l-marker
          v-if="userPosition"
          :icon="positionIcon"
          :lat-lng="userPosition"
          ref="markerPosition"
        />

        <!-- MARKER FERMATE BUS -->
        <!-- ------------------------------------------------------------------------------------------------------- -->
        <template v-if="currentZoom >= STOP_MIN_ZOOM">
          <l-layer-group ref="stopList">
            <template v-if="showBusStopMarkers">
              <l-circle-marker
                v-for="stop in stopList"
                :key="stop.stop_id"
                :lat-lng="[stop.stop_lat, stop.stop_lon]"
                :radius="10"
                :opacity="0"
                :fill-opacity="0"
                @click="getBusLines(stop)"
              />

              <template v-if="stopInfo">
                <l-layer-group ref="selectedStopLayer">
                  <l-popup
                    :lat-lng="{
                        lat: stopInfo.stop_lat,
                        lon: stopInfo.stop_lon
                      }"

                  >
                    <q-card style="min-width:120px" flat>
                      <q-card-section class="q-px-none">
                        <div class="text-body1 q-mb-md q-px-md">
                          <strong>{{ stopInfo.stop_name }}</strong>
                        </div>
                        <q-list separator>
                          <q-item
                            class="route-item-label"
                            v-for="route in stopInfo.linee"
                            :key="route.route_id"
                            clickable
                            @click="showTimeTable(route)"
                          >
                            <q-item-section>
                              <q-item-label overline>
                                {{ route.route_short_name }}
                              </q-item-label>
                              <q-item-label>
                                {{ route.route_long_name }}
                              </q-item-label>
                            </q-item-section>

                            <q-item-section side>
                              <q-icon name="chevron_right"/>
                            </q-item-section>
                          </q-item>
                        </q-list>
                      </q-card-section>
                    </q-card>
                  </l-popup>
                </l-layer-group>
              </template>
            </template>
          </l-layer-group>
        </template>


      </l-map>
    </template>

    <template v-else>
      <lms-inner-loading :showing="!mapProperties"/>
    </template>


    <lms-timetable-route-dialog
      :value="showTimetableDialog"
      :stop="stopInfo"
      :route="selectedRoute"
      @close-dialog="closeTimetableDialog"
    />
  </div>
</template>

<script>
  import {latLng, latLngBounds} from "leaflet";
  import 'leaflet/dist/leaflet.css';
  import 'leaflet.markercluster/dist/MarkerCluster.css';
  import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
  import {LMap, LPopup, LTileLayer, LMarker, LControl, LIcon, LCircleMarker, LLayerGroup} from "vue2-leaflet";
  import Vue2LeafletMarkerCluster from 'vue2-leaflet-markercluster';
  import 'leaflet.markercluster.freezable';
  import {getIcon} from "../services/business-logic";
  import {getBusLines, getBusStopList} from "../services/api";
  import {apiErrorNotify, equals, isEmpty} from "../services/utils";
  import LmsTimetableRouteDialog from "./LmsTimetableRouteDialog";


  export default {
    name: "LmsResultsMap",
    components: {
      LmsTimetableRouteDialog,
      LMap,
      LTileLayer,
      LMarker,
      LPopup,
      LControl,
      LCircleMarker,
      LLayerGroup,
      'l-marker-cluster': Vue2LeafletMarkerCluster,
    },
    props: {
      foundItemsList: {type: Array, required: true, default: null},
      isFullsize: {type: Boolean, default: false},
      activeItem: {type: Number, default: -1},
      isDialogClose: {type: Boolean, default: false},
      userCoords: {type:Object, default:null},
      centerMarker:{type: Boolean, default: false}
    },
    watch: {
      activeItem: {
        handler(newValue, oldValue) {
          if(this.centerMarker)
            this.centerActiveMarker(newValue)
          else
            this.showMarker(newValue);
        }
      },
      foundItemsList: {
        deep: true,
        handler(newVal, oldVal) {
          let coords = []
          if (newVal.length > 0) {
            newVal.forEach(item => {
              let coordinates = item.geo.coordinates
              coords.push([coordinates[1], coordinates[0]])
            });

          }
          this.bounds = latLngBounds(coords);
          this.$nextTick(async () => {
            this.markersCluster = this.$refs.markersCluster.mapObject;
            this.markerObjects = this.$refs.markersRef.map(ref => ref.mapObject);
          });
        }
      }
    },
    data() {
      return {
        isLoading: false,
        map: null,
        mapProperties: false,
        bounds: [],
        defaultCenter: null,
        zoom: 13,
        STOP_MIN_ZOOM: 13,
        currentZoom: null,
        center: null,
        currentCenter: null,
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution:
          '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        mapOptions: {
          zoomSnap: 0.5,
          dragging: true,
          touchZoom: true,
        },
        //wmsTileLayerUrl: '',
        positionIcon:
          L.icon({
            iconUrl: '/statics/la-mia-salute/icone/mappa-pin-centro-ricerca.svg',
            iconSize: [19, 36],
            iconAnchor: [8, 36],
          }),
        userPosition: null,
        selectedMarkerId: null,
        markersCluster: null,
        markerObjects: null,
        showBusStopMarkers: false,
        stopList: [],
        stopInfo: null,
        selectedRoute: null,
        showTimetableDialog: false
      }
    },
    computed: {
      fullsizeMapLabel() {
        if (this.$q.screen.gt.xs) {
          return this.isFullsize ? 'Riduci mappa' : 'Ingrandisci mappa'
        }
        return ''
      },
      busMarkersBtnIcon() {
        return this.showBusStopMarkers ? 'img:images/icone/bus-stop-active.svg' : 'img:images/icone/bus-stop.svg'
      },
      boundsRadius() {
        let bounds = this.bounds || this.map.maxBounds;
        let result = this.distance(
          bounds._northEast.lat,
          bounds._northEast.lng,
          bounds._southWest.lat,
          bounds._southWest.lng
        );

        return Math.round((result / 2) * 1000);
      },
      isFullsizeMobile(){
        return this.isFullsize && this.$q.screen.lt.sm
      },
      wmsTileLayerUrl(){
        return 'url'
      }

    },
    created() {
      this.isLoading = true
      this.mapProperties = false
      this.setMapDefaultValues()
    },
    beforeDestroy() {

      if (this.markerObjects) {
        for (let markerObject of this.markerObjects) {
          markerObject.closePopup();
        }
      }
      this.mapProperties = false
    },
    methods: {

      setIcon(index) {
        let url = (index === this.selectedMarkerId) ? '/statics/la-mia-salute/icone/mappa-pin-attivo-fucsia.svg' : '/statics/la-mia-salute/icone/mappa-pin.svg'
        return L.icon({
          iconUrl: url,
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
        })

      },
      itemName(item) {
        if (item?.medico) {
          return `${item.medico.nome} ${item.medico.cognome}`
        } else
          return item?.descrizione
      },
      itemAddress(item) {

        return `${item?.indirizzo} - ${item?.comune}`
      },
      itemIcon(item) {
        let icon = item ? getIcon(item) : null

        return icon ? `img:${icon}` : ''
      },
      centerActiveMarker(val){
        let selectedMarker = this.markerObjects[this.selectedMarkerId];

        setTimeout(() => {
          if (this.markersCluster && selectedMarker) {
            this.markersCluster.zoomToShowLayer(selectedMarker, () => {
              // let otherMarkers = selectedMarker.getVisibleParent()
              // console.log(otherMarkers)
              if (!selectedMarker.isPopupOpen()) {
                if (this.$q.screen.gt.xs) selectedMarker.openPopup();
              }
            });
          }

        }, 500)
      },
      showMarker(index) {
        if (this.selectedMarkerId === index || index === null) {
          this.selectedMarkerId = null
          return
        }
        this.selectedMarkerId = index;

        let selectedMarker = this.markerObjects ?  this.markerObjects[index] : null;
       // this.center = selectedMarker.getLatLng()

        setTimeout(() => {
          if (this.markersCluster && selectedMarker) {
            this.markersCluster.zoomToShowLayer(selectedMarker, () => {
              // let otherMarkers = selectedMarker.getVisibleParent()
              // console.log(otherMarkers)
              if (!selectedMarker.isPopupOpen()) {
                if (this.$q.screen.gt.xs) selectedMarker.openPopup();
              }
            });
          }

        }, 500)

      },

      async setMapDefaultValues() {
        let latlng = null;
        if (this.userCoords) {
          latlng = latLng(this.userCoords.lat, this.userCoords.lon);
        } else {
          //coordinate del piemonte
          latlng = latLng(45.052237, 7.515388);
        }
        this.center = latlng;
        this.userPosition = latlng
        let coords = []
        if (this.foundItemsList.length > 0) {
          this.foundItemsList.forEach(item => {
            let coordinates = item.geo.coordinates
            coords.push([coordinates[1], coordinates[0]])
          });

        }
        this.bounds = latLngBounds(coords);
        await this.loadStops()
        this.$nextTick(async () => {
          this.map = this.$refs.map;
          setTimeout(() => this.map.mapObject.invalidateSize(), 400);
          this.currentZoom = this.map.mapObject.getZoom();
          this.currentCenter = this.map.mapObject.getCenter();
          this.markersCluster = this.$refs.markersCluster.mapObject;
          this.markerObjects = this.$refs.markersRef.map(ref => ref.mapObject);
          this.showMarker(this.activeItem)
          this.isLoading = false
        });
      },
      zoomUpdate(zoom) {
        this.currentZoom = zoom;
      },

      itemAddressCoords(item) {
        let coordinates = item.geo?.coordinates;
        return latLng(coordinates[1], coordinates[0])
      },
      showItemCard(index) {
        if(this.activeItem === index){
          this.selectedMarkerId = null
        }
        this.$emit('show-item-card', index)
      },
      goToDefaultCenter() {
        this.map.mapObject.setView(this.userPosition, this.currentZoom)
      },
      fullSizeMap() {
        if (this.isFullsize) {
          setTimeout(() => {
            this.markerObjects = []
            this.markersCluster = null
            this.map.mapObject.remove
            this.mapProperties = false
            this.$emit('show-fullsize-map', !this.isFullsize)
          }, 200);
          return
        }
        this.$emit('show-fullsize-map', !this.isFullsize)
      },
      async loadStops() {
        let {lat, lng} = this.center;
        let params = {
          lat: lat,
          lon: lng,
          distanza: this.boundsRadius
        }

        try {
          let stopsResponse = await getBusStopList({_no5XXRedirect: true, params: params});
          this.stopList = stopsResponse.data;
        } catch (e) {
          apiErrorNotify({error: e, message: "impossibile visualizzare le fermate dei mezzi pubblici."})
        } finally {
          this.mapProperties = true
        }


      },
      // @see http://www.geodatasource.com/developers/javascript
      distance(lat1, lon1, lat2, lon2) {
        if (lat1 === lat2 && lon1 === lon2) {

          return 1;
        } else {
          let radlat1 = (Math.PI * lat1) / 180;
          let radlat2 = (Math.PI * lat2) / 180;
          let theta = lon1 - lon2;
          let radtheta = (Math.PI * theta) / 180;
          let dist =
            Math.sin(radlat1) * Math.sin(radlat2) +
            Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);

          if (dist > 1) {
            dist = 1;
          }

          dist = Math.acos(dist);
          dist = (dist * 180) / Math.PI;
          dist = dist * 60 * 1.1515;
          // conversione in KM
          dist = dist * 1.609344;
          // console.log(dist);
          return dist;
        }
      },
      activeBusStopsMarkers() {
        this.showBusStopMarkers = !this.showBusStopMarkers
      },
      async getBusLines(stop) {
        let stopId = stop.stop_id
        try {
          let busLinesResponse = await getBusLines(stopId, {_no5XXRedirect: true});
          this.stopInfo = busLinesResponse.data
          this.$nextTick(() => {
            let latLng = {lat: stop.stop_lat, lng: stop.stop_lon};
            this.$refs.selectedStopLayer.mapObject.openPopup(latLng);
          });
        } catch (e) {
          apiErrorNotify({error: e, message: 'Non è stato possibile effettuare la ricerca delle linee.'})
        } finally {
        }
      },
      showTimeTable(route) {
        this.selectedRoute = route
        this.showTimetableDialog = true
      },
      closeTimetableDialog(val) {
        this.showTimetableDialog = val
      },
      onPan(center) {
        // Carichiamo le fermate solo se il livello di zoom è accettabile
        if (this.currentZoom < this.STOP_MIN_ZOOM || equals(this.currentCenter, center)) return;
        this.currentCenter = center
        this.loadStops();
      },

    }
  }
</script>

<style lang="sass">
  .lms-results-map
    #show-list-control
      left: 50vw
      transform: translateX(-50%)
      margin-left: 0
      margin-bottom: 24px

    .leaflet-container a.leaflet-popup-close-button
      top: 8px !important
      right: 8px !important
</style>
