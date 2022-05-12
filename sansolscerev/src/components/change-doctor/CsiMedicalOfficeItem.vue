<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template >
<div class="csi-medical-office-item">
  <div id="telefono" v-if="ambulatorio.telefono">
    <span class="q-body-1 q-mr-xs">Telefono: </span>
    <span class="q-body-2"><a class="body-color" style="text-decoration: none" :href="`tel:${ambulatorio.telefono}`"> {{ambulatorio.telefono}}</a></span>
  </div>

  <div id="mail" v-if="ambulatorio.email">
    <span class="q-body-1 q-mr-xs">E-mail: </span>
    <span class="q-body-2">  <a class="text-primary" style="text-decoration: none" :href="`mailto:${ambulatorio.email}`">{{ambulatorio.email}}</a> </span>
  </div>

  <div id="orari" class="q-py-md" v-if="ambulatorio.orari.length >0">
    <div class="q-body-1 q-pb-sm">Orari ricevimento</div>
    <div
      v-for="(orario, index) in ambulatorio.orari"
      :key="index"
      class="justify-start flex items-start q-pb-xs"
    >
      <template v-if="orario.intervalli.length >0">
        <div class="q-body-2 csi-day-of-week">{{orario.nome | dayWeek}}</div>
        <div class="row office-timetable" >
          <template
            v-for="(intervallo, i) in orario.intervalli"
          >
            <div class="col-xs-12 col-sm-auto">
              <p class="q-body-1">
                {{intervallo.apertura}} - {{intervallo.chiusura}}
                <!--            {{getCorrectTime(intervallo.apertura) | format('HH:mm')}} - {{getCorrectTime(intervallo.chiusura) | format('HH:mm')}}-->
              </p>


                <q-icon
                  v-show="intervallo.note && intervallo.note !== ''"
                  name="info"
                  class="csi-icon--xs note-info-icon cursor-pointer"
                  @click.native="showNoteDialog(intervallo.note)"
                >
<!--                  <q-tooltip anchor="top right" self="center left">{{intervallo.note}}</q-tooltip>-->
                </q-icon>

              <p
                v-if="i < orario.intervalli.length -1"
                class="q-body-1 q-px-xs gt-sm"
              > e </p>

            </div>

          </template>
        </div>
      </template>
    </div>

  </div>

  <div id="note" class="q-caption" v-if="ambulatorio.note">
    Note: {{ambulatorio.note}}
  </div>


  <!-- DIALOG DELLE NOTE -->
  <!-- ----------------------------------------------------------------------------------------------------------- -->
  <q-dialog
    v-model="openDialog"
  >
<!--    <div slot="title" class="q-title">Richiesta in corso</div>-->
    <div slot="message" class="q-pa-md">
     {{selectedTimeNote}}
    </div>

    <template slot="buttons" slot-scope="props">
      <csi-buttons>
        <csi-button noMinWidth primary color="primary" label="Ok" @click="props.ok" />
      </csi-buttons>
    </template>
  </q-dialog>
</div>





</template>




<script>

  import CsiIconBase from "components/global/icons/CsiIconBase";
  import format from 'date-fns/format';
  import {dayWeek} from '@filters/strings'


  export default {
    name: 'CsiMedicalOfficeItem',
    components: {
      CsiIconBase,
      format
    },
    props: {
      ambulatorio: {type: Object, required: true}
    },
    data() {
      return {
        openDialog:false,
        selectedTimeNote : ''
      }
    },
    computed: {
      currentMonth(){
        return new Date().toISOString()
      }
    },
    methods: {
      getCorrectTime(time){
        // Per fomattare correttamente un orario. Imposto una data fittizia per poter usare filter format
        return new Date(`1983-01-01T${time}`)
      },
      showNoteDialog(note){
        this.selectedTimeNote = note;
        this.openDialog = true
      }
    }
  }
</script>


<style lang="stylus">
  @require '~variables'

  .csi-medical-office-item

    .office-timetable
      width: calc(100% - 70px)
      p
        margin:0px
        float :left

    .csi-ambulatori
      padding: 24px 0

    .csi-day-of-week
      width: 60px;
      /*float: left;*/

    .note-info-icon
      color: #acacac;
      margin-top: -16px;

    .csi-doc-address-item
      border-bottom: 1px solid #e0e0e0;

    .csi-address-list
      padding: 0px 24px 24px 24px;

    .body-color
      color: #0c0c0c;


</style>
