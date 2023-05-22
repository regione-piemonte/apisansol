<!--
 SPDX-License-Identifier: EUPL-1.2
 Copyright Regione Piemonte - 2023
-->

<template>
  <div class="full-width full-height farab-results-map" ref="mapContainer">
    <template v-if="mapProperties">
      <l-map
        ref="map"
        :zoom="zoom"
        :center="center"
        :options="mapOptions"
        :bounds="bounds"
        @update:zoom="zoomUpdate"
      >
        <l-control position="topleft" v-if="latitude && longitude">
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
        <l-tile-layer :url="url" :attribution="attribution" />

        <l-marker-cluster
          ref="markersCluster"
          :options="{
            chunkedLoading: true,
            showCoverageOnHover: false,
            iconCreateFunction: getClusterIcon
          }"
        >
          <l-marker
            v-for="(pharmacy, index) in pharmaciesList"
            :key="index"
            :icon="setIcon(index, pharmacy)"
            :lat-lng="itemAddressCoords(pharmacy)"
            :options="{ index, pharmacy }"
            @click="showItemCard(pharmacy, index)"
            ref="markersRef"
          >
            <l-popup :options="{ closeButton: false }" v-if="$q.screen.gt.xs">
              <q-item class="no-margin no-padding items-start">
                <q-item-section side>
                  <q-icon :name="PHARMACY_ICON_URL" size="md" />
                </q-item-section>
                <q-item-section class="text-body2">
                  <q-item-label>
                    <strong>{{
                      itemName(pharmacy) | empty | capitalize
                    }}</strong>
                  </q-item-label>
                  <q-item-label>
                    {{ itemAddress(pharmacy) | empty | capitalize }}
                  </q-item-label>
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
      <lms-inner-loading :showing="!mapProperties" />
    </template>

    <template v-if="$q.screen.lt.sm">
      <div
        class="absolute-bottom "
        :class="{ 'item-card-fullsize': isFullsize }"
        v-if="selectedPharmacy"
        style="z-index:1000;"
      >
        <div class="q-pa-md">
          <farab-pharmacy-list-item
            on-map
            :pharmacy="selectedPharmacy"
            @show-marker="centerActiveMarker"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { latLng, latLngBounds } from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import {
  LMap,
  LPopup,
  LTileLayer,
  LMarker,
  LControl,
  LIcon,
  LCircleMarker,
  LLayerGroup
} from "vue2-leaflet";
import Vue2LeafletMarkerCluster from "vue2-leaflet-markercluster";
import "leaflet.markercluster.freezable";
import { PHARMACY_ICON_URL } from "src/services/config";
import FarabPharmacyListItem from "components/FarabPharmacyListItem";

const STOP_MIN_ZOOM = 13;

export default {
  name: "FarabPharmacyResultsMap",
  components: {
    FarabPharmacyListItem,
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
    LControl,
    "l-marker-cluster": Vue2LeafletMarkerCluster
  },
  props: {
    latitude: { type: [String, Number], default: null },
    longitude: { type: [String, Number], default: null },
    isFullsize: { type: Boolean, default: false },
    activeItem: { type: Number, default: -1 },
    pharmaciesList: { type: Array, required: true, default: null }
  },
  data() {
    return {
      STOP_MIN_ZOOM,
      PHARMACY_ICON_URL,
      isLoading: false,
      map: null,
      mapProperties: false,
      zoom: 13,
      center: null,
      mapOptions: {
        zoomSnap: 0.5,
        dragging: true,
        touchZoom: true
      },
      bounds: [],
      currentZoom: null,
      userPosition: null,
      markersCluster: null,
      markerObjects: null,
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      selectedMarkerId: null,
      positionIcon: L.icon({
        iconUrl: "/statics/la-mia-salute/icone/mappa-pin-centro-ricerca.svg",
        iconSize: [19, 36],
        iconAnchor: [8, 36]
      }),
      selectedPharmacy: null
    };
  },
  computed: {
    partecipantPharmacies() {
      return this.$store.getters["getPartecipantPharmacies"];
    },
    fullsizeMapLabel() {
      if (this.$q.screen.gt.xs) {
        return this.isFullsize ? "Riduci mappa" : "Ingrandisci mappa";
      }
      return "";
    }
  },
  watch: {
    activeItem: {
      handler(newValue, oldValue) {
        this.showMarker(newValue);
      }
    },
    pharmaciesList: {
      deep: true,
      handler(newVal, oldVal) {
        let coords = [];
        if (newVal.length > 0) {
          newVal.forEach(item => {
            let coordinates = item.geo.coordinates;
            coords.push([coordinates[1], coordinates[0]]);
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
  beforeDestroy() {
    if (this.markerObjects) {
      for (let markerObject of this.markerObjects) {
        markerObject.closePopup();
      }
    }
    this.mapProperties = false;
  },
  created() {
    this.isLoading = true;
    this.mapProperties = false;
    this.setMapDefaultValues();
  },

  methods: {
    async setMapDefaultValues() {
      let latlng = null;
      if (this.latitude && this.longitude) {
        latlng = latLng(this.latitude, this.longitude);
      } else {
        //coordinate del piemonte
        latlng = latLng(45.052237, 7.515388);
      }
      this.center = latlng;
      this.userPosition = latlng;
      let coords = [];
      this.pharmaciesList?.forEach(item => {
        let coordinates = item.geo.coordinates;
        coords.push([coordinates[1], coordinates[0]]);
      });
      this.bounds = latLngBounds(coords);
      this.mapProperties = true;
      this.$nextTick(async () => {
        this.map = this.$refs.map;
        setTimeout(() => this.map.mapObject.invalidateSize(), 400);
        this.currentZoom = this.map.mapObject.getZoom();
        this.markersCluster = this.$refs.markersCluster.mapObject;
        this.markerObjects = this.$refs.markersRef.map(ref => ref.mapObject);
        this.showMarker(this.activeItem);
        this.isLoading = false;
      });
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
      }, 100);
    },
    zoomUpdate(zoom) {
      this.currentZoom = zoom;
    },
    goToDefaultCenter() {
      this.map.mapObject.setView(this.userPosition, this.currentZoom);
    },
    fullSizeMap() {
      if (this.isFullsize) {
        setTimeout(() => {
          this.markerObjects = [];
          this.markersCluster = null;
          this.map.mapObject.remove;
          this.mapProperties = false;
          this.$emit("show-fullsize-map", !this.isFullsize);
        }, 200);
        return;
      }
      this.$emit("show-fullsize-map", !this.isFullsize);
    },
    setIcon(index, pharmacy) {
      let url = "/statics/la-mia-salute/icone/mappa-pin.svg";

      if (pharmacy.aderente) {
        url = "/statics/la-mia-salute/icone/mappa-pin-verde.svg";
      }

      if (index === this.selectedMarkerId) {
        url = "/statics/la-mia-salute/icone/mappa-pin-attivo-fucsia.svg";
      }

      return L.icon({
        iconUrl: url,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34]
      });
    },
    itemAddressCoords(item) {
      let coordinates = item.geo?.coordinates;
      return latLng(coordinates[1], coordinates[0]);
    },
    showMarker(index) {
      if (this.selectedMarkerId === index || index === null) {
        this.selectedMarkerId = null;
        this.selectedPharmacy = null;
        return;
      }
      this.selectedMarkerId = index;
      this.selectedPharmacy = this.pharmaciesList[index];
      let selectedMarker = this.markerObjects
        ? this.markerObjects[index]
        : null;
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
      }, 500);
    },
    showItemCard(pharmacy, index) {
      if (this.activeItem === index) {
        this.selectedMarkerId = null;
      }
      this.$emit("show-card", index, pharmacy);
    },
    itemName(item) {
      return item?.descrizione;
    },
    itemAddress(item) {
      return `${item?.indirizzo} - ${item?.comune}`;
    },
    isPharmacyPartecipant(pharmacy) {
      let pharmachyPartecipantList = this.partecipantPharmacies;
      return pharmachyPartecipantList.includes(pharmacy.codice);
    },
    getClusterIcon(cluster) {
      let markerList = cluster.getAllChildMarkers();
      let pharmacyList = markerList.map(m => m.options.pharmacy);
      let pharmacyListPartecipant = pharmacyList.filter(p => p.aderente);

      let classes = ["marker-cluster", "marker-cluster-small"];
      if (pharmacyListPartecipant.length > 0) {
        classes.push("marker-cluster--partecipant");
      }

      // console.log({
      //   cluster,
      //   markerList,
      //   pharmacyList,
      //   pharmacyListPartecipant,
      //   classes
      // });

      return L.divIcon({
        html: `<div><span>${markerList.length}</span></div>`,
        className: classes.join(" "),
        iconSize: L.point(40, 40)
      });
    },
    getClusterIconDefault: function(cluster) {
      var childCount = cluster.getChildCount();

      var c = " marker-cluster-";
      if (childCount < 10) {
        c += "small";
      } else if (childCount < 100) {
        c += "medium";
      } else {
        c += "large";
      }

      return new L.DivIcon({
        html: "<div><span>" + childCount + "</span></div>",
        className: "marker-cluster" + c,
        iconSize: new L.Point(40, 40)
      });
    }
  }
};
</script>

<style lang="scss">
.farab-results-map {
  $cluster-color: $blue-10;
  $cluster-color-partecipant: $green-8;

  .item-card-fullsize {
    bottom: 50px;
  }

  .marker-cluster {
    background-color: transparentize($cluster-color, 0.4);

    div {
      background-color: transparentize($cluster-color, 0.1);
      font-weight: bold;
      color: #ffffff;
    }

    &--partecipant {
      background-color: transparentize($cluster-color-partecipant, 0.4);

      div {
        background-color: transparentize($cluster-color-partecipant, 0.1);
      }
    }
  }
}
</style>
