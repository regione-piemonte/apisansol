<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-dialog
    :value="value"
    persistent
    :maximized="$q.screen.lt.md"
    class="timetable-dialog"
    :class="{'timetable-minwidth' : $q.screen.gt.sm}"
    @hide="$emit('close-dialog', false)"
  >
    <q-card>
      <div class="q-ma-md">
        <q-toolbar>
          <q-toolbar-title >
            {{ stopName }}
          </q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>

        <q-card-section class="q-py-none">
          <div class="text-h6">
            {{ routeName }}
          </div>
        </q-card-section>
      </div>


      <q-card-section>
        <template v-if="isLoadingTimetable">
          <q-skeleton type="text" />
        </template>

        <template v-else>
          <!--            <div class="text-italic">Questi orari sono provvisori</div>-->
          <template v-if="routeExternalUrl">
            <a :href="routeExternalUrl" target="_blank" class="lms-link">
              Visualizza orari in tempo reale
            </a>
          </template>


          <q-timeline color="secondary" class="timetable-dialog__timeline q-px-md" v-if="isTimeTable">
            <q-timeline-entry
              v-for="(time,index) in timeTables"
              :key="index"
            >
              <template v-slot:title>
                <span class="text-subtitle1 text-bold">
                  {{ formatTime(time.arrival_time ) }}
                </span>
              </template>

              <template v-slot:default>
                <span class="text-caption text-grey-8">
                  {{ time.trip_headsign }}
                </span>
              </template>
            </q-timeline-entry>
          </q-timeline>
          <div v-else>
            <p class="q-px-md text-italic">
              Nessun orario disponibile.
            </p>
          </div>
        </template>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
  import {apiErrorNotify, isEmpty} from "../services/utils";
  import {getBusTimeTables} from "../services/api";

    export default {
        name: "LmsTimetableRouteDialog",
      props:{
        value:{type:Boolean, default:false},
        stop:{type:Object, default:null},
        route:{type:Object, default:null}
      },
      data(){
          return {
            isLoadingTimetable:false,
            timetableInfo:null
          }
      },
      watch:{
          value:{
            immediate:true,
            handler(val, oldVal){
              if(val)this.showTimeTables()
            }
          }
      },
      computed:{
        stopName(){
          return this.stop?.stop_name ?? ''
        },
        isTimeTable(){
          return !isEmpty(this.timeTables) && this.timeTables?.length>0
        },
        routeName(){
          if(this.route){
            return `Linea ${this.route.route_short_name} - ${ this.route.route_long_name }`
          }else return ''
        },
        routeExternalUrl(){
          return this.route?.route_url
        },
        timeTables(){
          let timeList = []
          if(this.timetableInfo){
            timeList =  this.timetableInfo.linee[0]?.trips
          }
          return timeList
        }
      },
      methods:{
        async showTimeTables(route){
          this.isLoadingTimetable=true
          this.timetableInfo = null
          let routeId = this.route?.route_id
          let stopId = this.stop?.stop_id
          try{
            let timetablesResponse = await getBusTimeTables(stopId, routeId, {_no5XXRedirect: true})
            this.timetableInfo = timetablesResponse.data

          }catch (e) {
            apiErrorNotify({error:e, message:'Non è stato possibile effettuare la ricerca dei passaggi.' })
          }finally{
            this.isLoadingTimetable=false
          }
        },
        formatTime(time) {
          let splitted = time.split(":");
          splitted.pop();
          return splitted.join(":");
        }
      }
    }
</script>

<style lang="sass">
  .timetable-minwidth
    min-width: 500px
    .timetable-dialog__timeline
    .q-timeline__content
      padding: 1px
    .q-timeline__title
      margin-bottom: 0
    &.q-timeline--dense--right
      .q-timeline__entry
        padding-left: 26px
        padding-bottom: 8px
        &:before
          display: none
</style>
