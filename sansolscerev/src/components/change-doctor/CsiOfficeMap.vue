<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template >
  <q-modal
    @input="$emit('input', $event)"
    :value="value"
    class="csi-office-map-modal"
    :class="{'maximized' : $q.screen.lt.md}"
    ref="modal"
    v-if="office">
    <q-modal-layout header-class="no-shadow" >
      <div class="absolute q-pa-lg"  style="right: 0; z-index:1000">
        <q-btn
          round
          color="white"
          text-color="primary"
          size="md"
          icon="close"
          v-close-overlay
        />
      </div>
      <div style="height: 100%; width: 100%" v-if="allProperties">
          <l-map
            ref="fullMap"
            :zoom="zoom"
            :center="center"
            :options="mapOptions"
          >
            <l-tile-layer
              :url="url"
              :attribution="attribution"
            />
            <l-marker :lat-lng="marker" :icon="markerIcon">
              <l-popup :options="{closeButton:false}">

                <q-item class="no-margin no-padding">
                  <q-item-side>
                    <csi-icon-base class="csi-svg-icon--md">
                      <csi-icon-hospital />
                    </csi-icon-base>
                  </q-item-side>
                  <q-item-main class="no-margin">
                    <q-item-tile
                      class="q-body-2 q-pa-xs no-margin">
                      {{office.indirizzo}}
                    </q-item-tile>
                  </q-item-main>
                </q-item>
              </l-popup>
            </l-marker>
          </l-map>
        </div>
    </q-modal-layout>
  </q-modal>
</template>

<script>
  import { latLng } from "leaflet";
  import { Icon } from 'leaflet';
  import 'leaflet/dist/leaflet.css';
  import {LMap, LPopup, LTileLayer, LMarker } from "vue2-leaflet";
  import CsiIconAvatarDoctor from "components/global/icons/CsiIconAvatarDoctor";
  import CsiIconBase from "components/global/icons/CsiIconBase";
  import CsiIconHospital from "components/global/icons/CsiIconHospital";
  import  CsiMarkerIcon from 'src/statics/icons/svgs/marker-icon.svg';

  // delete L.Icon.Default.prototype._getIconUrl;
  //
  // L.Icon.Default.mergeOptions({
  //   iconRetinaUrl: require(markerIcon),
  //   iconUrl: require(markerIcon),
  // });

  export default {
    name: "CsiOfficeMap",
    components: {
      Icon,
      LMap,
      LTileLayer,
      LMarker,
      LPopup,
      CsiIconAvatarDoctor,
      CsiIconBase,
      CsiIconHospital
    },
    props:{
      value: {type: Boolean, required: false, default: false},
      office:{type: Object, required: false, default: null}
    },
    watch:{
      office:{
        immediate: true,
        handler(newValue, oldValue){
          this.getDefaultValues()
        }
      }
    },
    data(){
      return{
        map:null,
        zoom: 15,
        center: null,
        marker: null,
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution:
          '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        mapOptions: {
          zoomSnap: 0.5,
          dragging: true,
          touchZoom: true,
        },
        allProperties:false,
        markerIcon:
          L.icon({
            iconUrl:CsiMarkerIcon,
            iconSize:    [25, 41],
            iconAnchor:  [12, 41],
            popupAnchor: [1, -34],
          }),
      };

    },
    created(){

    },
    mounted(){

    },
    methods: {
      getDefaultValues(){
        if(this.office){
          let coordinates = this.office.coordinate.coordinates;
          let latlng = latLng(coordinates[1], coordinates[0]);
          this.center = latlng;
          this.marker = latlng;
          this.allProperties = true;

          this.$nextTick(() => {
           setTimeout(()=> this.$refs.fullMap.mapObject.invalidateSize(), 400)
          });


        }
      }
    },
  }
</script>

<style lang="stylus">
  .csi-office-map-modal
    .modal-content
      width: 80%;
      height: 80%;


</style>
