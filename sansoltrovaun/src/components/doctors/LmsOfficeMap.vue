
<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-dialog ref="officeMapDialog"  :value="value" :maximized="$q.screen.lt.md"  @hide="$emit('close-dialog', false)">
    <q-card class="no-scroll lms-office-map"  :class="{ 'minWidthDetailCard' : $q.screen.gt.sm }">
     <q-card-section class="no-padding fit" v-if="allProperties">
         <l-map
           ref="fullMap"
           :zoom="zoom"
           :center="center"
           :options="mapOptions"
         >
           <l-control position="topright">
             <q-btn
               :ripple="false"
               no-caps
               round
               color="white"
               text-color="black"
               icon="close"
               v-close-popup
             />
           </l-control>

           <l-tile-layer
             :url="url"
             :attribution="attribution"
           />
           <l-marker :lat-lng="marker" :icon="markerIcon">
             <l-popup :options="{closeButton:false}">

               <q-item class="no-margin no-padding">
                 <q-item-section avatar>
                   <q-icon name="img:/statics/la-mia-salute/icone/unita-operativa.svg" size="md"/>
                 </q-item-section>
                 <q-item-section class="text-body1">
                  <strong>{{office.indirizzo}}</strong>
                 </q-item-section>
               </q-item>
             </l-popup>
           </l-marker>
         </l-map>
     </q-card-section>
    </q-card>


  </q-dialog>
</template>

<script>
  import {latLng, latLngBounds} from "leaflet";
  import 'leaflet/dist/leaflet.css';
  import {LMap, LControl, LTileLayer, LMarker, LPopup} from "vue2-leaflet";
    export default {
      name: "LmsOfficeMap",
      components: {
        LMap,
        LControl,
        LTileLayer,
        LMarker,
        LPopup,
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
              iconUrl: '/statics/la-mia-salute/icone/mappa-pin.svg',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
            }),

        };

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

<style lang="sass">
  .lms-office-map
    height: 90%
    &.minWidthDetailCard
      min-width: 80% !important
</style>
