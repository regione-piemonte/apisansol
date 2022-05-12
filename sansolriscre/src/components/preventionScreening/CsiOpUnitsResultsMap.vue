<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="full-width full-height lms-results-map" ref="mapContainer">
    <template v-if="mapProperties">
      <l-map
        ref="operatingUnitsMap"
        :zoom="zoom"
        :center="center"
        :options="mapOptions"
        :bounds="bounds"
        @update:zoom="zoomUpdate"
      >
        <l-tile-layer :url="url" :attribution="attribution"/>
        <l-control position="topleft" v-if="userCoords">
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
        <l-marker-cluster ref="markersCluster" :options="{removeOutsideVisibleBounds: true}">
          <l-marker
            v-for="(opUnit, index) in nearestOpUnitsList"
            :key="index"
            :icon="setIcon(index)"
            :lat-lng="opUnitAddressCoords(opUnit)"
            @click="showOpUnitCard(index)"
            ref="markersRef"
          >
            <l-popup
              :options="{ closeButton: false }"
              v-if="$q.screen.gt.xs"
            >
              <q-item class="no-margin no-padding items-center">
                <q-item-section side class="q-pr-sm">
                  <q-icon name="img:/statics/la-mia-salute/icone/unita-operativa.svg"  size="sm"/>
                </q-item-section>
                <q-item-section class="text-body2 no-margin">
                  <q-item-label>{{opUnit.descrizione | empty}}</q-item-label>
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
      </l-map>
    </template>
    <template v-else>
      <lms-inner-loading :showing="!mapProperties"/>
    </template>
  </div>
</template>

<script>
  import {latLng, latLngBounds} from "leaflet";
  import 'leaflet/dist/leaflet.css';
  import 'leaflet.markercluster/dist/MarkerCluster.css';
  import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
  import {LMap, LPopup, LTileLayer, LMarker, LControl, LIcon, LCircleMarker, LLayerGroup} from "vue2-leaflet";
  import Vue2LeafletMarkerCluster from 'vue2-leaflet-markercluster';
  import {PIEDMONT_COORDS} from "src/services/config";

  export default {
    name: "CsiOpUnitsResultsMap",
    components: {
      LMap,
      LTileLayer,
      LMarker,
      LPopup,
      LControl,
      'l-marker-cluster': Vue2LeafletMarkerCluster,
    },
    props: {
      nearestOpUnitsList: {type: Array, required: true, default: null},
      isFullsize: {type: Boolean, default: false},
      activeItem: {type: Number, default: -1},
      isDialogClose: {type: Boolean, default: false},
      userCoords: {type: Object, default: null},
      centerMarker: {type: Boolean, default: false}
    },
    watch: {
      activeItem: {
        handler(newValue, oldValue) {
          if (this.centerMarker)
            this.centerActiveMarker(newValue)
          else
            this.showMarker(newValue);
        }
      },

    },
    data() {
      return {
        map: null,
        mapProperties: false,
        bounds: [],
        defaultCenter: null,
        zoom: 13,
        currentZoom: null,
        center: null,
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
        markerObjects: null
      }
    },
    created() {
      this.setMapDefaultValues()
    },
    methods: {
      zoomUpdate(zoom) {
        this.currentZoom = zoom;
      },
      goToDefaultCenter() {
        this.operatingUnitsMap?.mapObject.setView(
          this.userPosition,
          this.zoom
        );
      },
      setMapDefaultValues() {
        let latlng = null;
        if (this.userCoords) {
          latlng = latLng(this.userCoords.lat, this.userCoords.lon);
        } else {
          // Se non ci sono le coordinate inserisco le  coordinate del piemonte.

          latlng = latLng(PIEDMONT_COORDS.lat, PIEDMONT_COORDS.lon);
        }

        this.center = latlng;
        this.userPosition = latlng;
        let coords = [];

        if (this.nearestOpUnitsList.length > 0) {
          this.nearestOpUnitsList.forEach(unit => {
            //let coordinates = unit.indirizzo_geo?.coordinate?.coordinates ?? []
            let coordinates = unit.geo?.coordinates ?? []
            coords.push([coordinates[1], coordinates[0]]);
          });

          this.bounds = latLngBounds(coords);
        } else {
          this.bounds = latLngBounds([
            this.userCoords.lat,
            this.userCoords.lon
          ]);
        }

        this.mapProperties = true;
        this.$nextTick(() => {
          this.operatingUnitsMap = this.$refs.operatingUnitsMap;
          setTimeout(
            () => this.operatingUnitsMap?.mapObject.invalidateSize(),
            400
          );
          this.currentZoom = this.operatingUnitsMap?.mapObject.getZoom();
          this.markersCluster = this.$refs.markersCluster?.mapObject;
          this.markerObjects = this.$refs.markersRef?.map(ref => ref.mapObject);
          this.showMarker(this.activeItem)
        });

      },
      setIcon(index) {
        let url = (index === this.selectedMarkerId) ? '/statics/la-mia-salute/icone/mappa-pin-attivo-fucsia.svg' : '/statics/la-mia-salute/icone/mappa-pin.svg'
        return L.icon({
          iconUrl: url,
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
        })

      },
      showMarker(index) {
        if (this.selectedMarkerId === index || index === null) {
          this.selectedMarkerId = null
          return
        }
        this.selectedMarkerId = index;

        let selectedMarker = this.markerObjects ? this.markerObjects[index] : null;
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
      centerActiveMarker(val) {
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
      opUnitAddressCoords(item) {
        // let coordinates = item.indirizzo_geo?.coordinate?.coordinates;
        let coordinates = item.geo?.coordinates;
        return latLng(coordinates[1], coordinates[0]);
      },
      showOpUnitCard(index) {
        if (this.activeItem === index) {
          this.selectedMarkerId = null
        }
        this.$emit('show-op-unit-card', index)
      },
    }
  }
</script>

<style scoped>

</style>
