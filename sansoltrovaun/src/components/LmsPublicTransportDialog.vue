<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div>
    <q-dialog ref="publicTransportDialog" :value="value" :maximized="$q.screen.lt.md"
              @hide="$emit('close-dialog', false)">
      <q-card :class="{ 'minWidthCard' : $q.screen.gt.sm }">
        <q-toolbar>
          <q-toolbar-title class="q-ma-md"><strong>Trasporto pubblico</strong></q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup/>
        </q-toolbar>
        <q-card-section>
          <q-list separator v-if="busStopList.length > 0">
            <div v-for="stop in busStopList" :key="stop.stop_id">
              <q-expansion-item
                expand-separator
                header-class="text-primary q-py-md text-weight-bold"
                group="busStops"
                :label="stop.stop_name"
                @show="showBusLines(stop)"
              >
                <q-card>
                  <q-card-section class="q-py-none q-pb-lg">
                    <template v-if="isLoadingRoutes">
                      <div class="q-pt-lg">
                        <q-skeleton  type="text"/>
                      </div>
                    </template>
                    <q-list separator v-if="busLines.length>0">
                      <q-item class="route-item-label" v-for="route in busLines" :key="route.route_id" clickable @click="showTimeTables(route)">
                        <q-item-section side>
                          <q-item-label class="text-black"><strong>{{route.route_short_name}}</strong></q-item-label>
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>{{route.route_long_name}}</q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>

                  </q-card-section>
                </q-card>
                <q-separator/>
              </q-expansion-item>
            </div>
          </q-list>
          <div style="height: 150px" v-if="isLoading">
            <q-inner-loading color="primary" block :showing="isLoading"/>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>


    <lms-timetable-route-dialog
      :value="showTimetableDialog"
      :stop="selectedStop"
      :route="selectedRoute"
      @close-dialog="closeTimetableDialog"
    />


  </div>

</template>

<script>
  import {getBusLines, getBusStopList, getBusTimeTables, getSuggestedAddress} from "../services/api";
  import {apiErrorNotify, isEmpty} from "../services/utils";
  import LmsTimetableRouteDialog from "./LmsTimetableRouteDialog";

  const DEFAULT_DISTANCE = 1000
  export default {
    name: "LmsPublicTransportDialog",
    components: {LmsTimetableRouteDialog},
    props: {
      value:{type:Boolean, required: true, default:false},
      address: {type: Object, default: null}
    },
    watch:{
      value:{
        immediate:true,
        handler(val, oldVal){
          if(val){
            if(this.busStopList.length === 0 && !isEmpty(this.address?.coords)) this.getBusStops()
          }
        }
      }
    },
    data() {
      return {
        isLoading:false,
        busStopList: [],
        distance: DEFAULT_DISTANCE,
        busLines: [],
        isLoadingRoutes:false,
        timetableInfo: null,
        showTimetableDialog: false,
        selectedStop: null,
        selectedRoute: null,
      }
    },
    created() {

    },
    methods: {
      async getBusStops() {
        this.isLoading = true
        let params = {
          lat: this.address.coords.lat,
          lon: this.address.coords.lon,
          distanza: this.distance
        }
        try{
          let busStopResponse = await getBusStopList({_no5XXRedirect: true, params: params});
          let list = busStopResponse.data
          if(list.length > 0 )
            this.busStopList = list.slice(0, 10)
          else{
            this.distance += 1000
            this.getBusStops()
          }
        }catch (e) {
          apiErrorNotify({error:e, message:'Non è stato possibile effettuare la ricerca di mezzi pubblici' })
        }finally{
          this.isLoading = false
        }

      },
      async showBusLines(stop){
        this.isLoadingRoutes=true
        this.selectedStop = stop
        let stopId = stop.stop_id
        this.busLines = []
        try{
          let busLinesResponse = await getBusLines(stopId,{_no5XXRedirect: true});
          let lines = busLinesResponse.data
          if(!isEmpty(lines))  this.busLines = lines.linee
        }catch (e) {
          apiErrorNotify({error:e, message:'Non è stato possibile effettuare la ricerca delle linee.' })
        }finally {
          this.isLoadingRoutes=false
        }
      },
      async showTimeTables(route){
        this.timetableInfo = null
        this.selectedRoute = route
        this.showTimetableDialog = true
      },
      closeTimetableDialog(val){
        this.showTimetableDialog =val
      }

    }
  }
</script>

<style lang="sass">


</style>
