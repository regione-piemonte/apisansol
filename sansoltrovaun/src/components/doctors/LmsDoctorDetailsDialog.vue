<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-dialog ref="doctorDetailsDialog"  :value="value" :maximized="$q.screen.lt.md"  @hide="$emit('close-dialog', false)">
    <q-card class="no-scroll lms-doctor-details"  :class="{ 'minWidthDetailCard' : $q.screen.gt.sm }">
      <q-card-section class="no-padding">
        <q-toolbar class="bg-primary text-white" >
          <q-toolbar-title class="details-toolbar"><strong>Scheda medico</strong></q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>
      </q-card-section>
      <template v-if="doctor && !isLoading">

        <q-card-section class="scroll overflow-hidden-x" :style="{maxHeight : scrollMaxHeight}">
          <div class="lms-doctor-details-container q-pa-lg" >
            <q-card>
              <template v-if="!isDoctorMaximal">
                <lms-card-item-bar type="negative">
                  Questo medico non può essere scelto. Rivolgiti all'ASL per ulteriori informazioni.
                </lms-card-item-bar>
              </template>
              <template v-else>
                <template v-if="selectableInfo">
                  <lms-card-item-bar :type="selectableInfo.color">
                    {{selectableInfo.info}}
                  </lms-card-item-bar>
                </template>
                <template v-else>
                  <lms-card-item-bar type="negative">
                    A causa un un problema temporaneo questo medico non può essere scelto. Riprovare più tardi.
                  </lms-card-item-bar>
                </template>
              </template>

              <lms-card-item>
                <template v-slot:primary>
                  <lms-card-item-primary>
                    <template slot="icon">
                      <q-icon :name="doctorIcon" size="xl"/>
                    </template>
                    <template slot="text">
                      <div class="q-subheading text-weight-bold doctor-name">
                        {{doctor.cognome}} {{doctor.nome}}
                      </div>
                    </template>
                  </lms-card-item-primary>
                </template>
                <template v-slot:secondary>
                  <q-item class="q-py-lg">
                    <q-item-section>
                      <q-item-label
                        class="text-body2 text-weight-bold"
                        v-if="doctorType"
                      >
                        {{doctorType.descrizione}}
                      </q-item-label>
                      <q-item-label
                        class="text-body1"
                      >
                        <span v-if="doctor.data_nascita">{{doctor.data_nascita | date }}</span> <span v-if="doctor.specializzazioni">-</span>
                        {{doctor.specializzazioni}}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </lms-card-item>
            </q-card>
          </div>
          <!------- AMBULATORI ------------>
          <!-- ----------------------------------------------------------------------------------------------------- -->
          <div class="q-pa-lg">
            <template v-if="doctorOffices.length>0">
              <div class="row q-mb-md">
                <h1 class="text-h1 q-ma-none text-weight-bold">Ambulatori</h1>
              </div>
              <q-card>
                <q-card-section class="q-px-lg">
                  <q-list separator >
                    <q-item
                      v-for="ambulatorio in doctorOffices"
                      :key="ambulatorio.id"
                      class="q-py-md q-px-none row"
                    >
                      <q-item-section class="col-12 col-sm-8">
                        <q-item-label
                          class="flex items-center q-px-none">
                          <q-icon
                            size="xl"
                            name="img:/statics/la-mia-salute/icone/unita-operativa.svg"/>
                          <div class="text-body1 doctor-address">
                            <div>
                              <strong>{{ambulatorio.indirizzo}} - {{ambulatorio.comune}}</strong>
                            </div>


                            <div class="cursor-pointer q-py-xs" @click="openMapDialog(ambulatorio)" v-if="$q.screen.lt.sm">
                              <a class="lms-link">Vedi mappa</a>
                            </div>
                          </div>

                        </q-item-label>
                        <div class="csi-medical-office-item q-mt-md q-body-1">
                          <div id="telefono" v-if="ambulatorio.telefono">
                            <span class="q-mr-xs">Telefono: </span>
                            <span><a class="text-black text-weight-bold" style="text-decoration: none" :href="`tel:${ambulatorio.telefono}`"> {{ambulatorio.telefono}}</a></span>
                          </div>

                          <div id="mail" v-if="ambulatorio.email">
                            <span class="q-mr-xs">E-mail: </span>
                            <span>  <a class="text-primary text-weight-bold" style="text-decoration: none" :href="`mailto:${ambulatorio.email}`">{{ambulatorio.email}}</a> </span>
                          </div>

                          <div id="orari" class="q-pt-md" v-if="ambulatorio.orari.length >0">
                            <div class="q-pb-sm q-pt-md">Orari ricevimento</div>
                            <div
                              v-for="(orario, index) in ambulatorio.orari"
                              :key="index"
                              class="justify-start flex items-start q-pb-sm"
                            >
                              <template v-if="orario.intervalli.length >0">
                                <div class="text-weight-bold csi-day-of-week">{{orario.nome | dayOfWeek}}</div>
                                <div class="row office-timetable" >
                                  <div class="col-xs-12 col-sm-auto"  v-for="(intervallo, i) in orario.intervalli" :key="i">
                                  <span>
                                    {{intervallo.apertura}} - {{intervallo.chiusura}}
                                  </span>
                                    <q-icon
                                      v-show="intervallo.note && intervallo.note !== ''"
                                      name="info"
                                      class="note-info-icon cursor-pointer"
                                      @click.native="showNoteDialog(intervallo.note)"
                                    />
                                    <span
                                      v-if="i < orario.intervalli.length -1"
                                      class="q-body-1 q-px-xs gt-sm"
                                    > e </span>
                                  </div>
                                </div>
                              </template>
                            </div>
                          </div>

                          <div id="note" class="q-caption" v-if="ambulatorio.note">
                            Note: {{ambulatorio.note}}
                          </div>
                        </div>
                      </q-item-section>

                      <!-- MAPPA -->
                      <q-item-section side top class="col-12 col-sm-4">
                        <div
                          class="q-py-md fit"
                          @click="openMapDialog(ambulatorio)"
                          style="min-height: 180px"
                          v-show="showMap"
                        >
                          <l-map
                            ref="map"
                            :zoom="15"
                            :center="addressCoords(ambulatorio)"
                            :options="{zoomControl: false}"
                          >
                            <l-tile-layer
                              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                              :attribution="mapAttribution"
                            />
                            <l-marker ref="marker" :lat-lng="addressCoords(ambulatorio)" :icon="markerIcon">
                            </l-marker>
                          </l-map>
                        </div>
                      </q-item-section>

                    </q-item>
                  </q-list>

                </q-card-section>
              </q-card>
            </template>
          </div>

          <!------- ASSOCIAZIONI ------------>
          <!-- ----------------------------------------------------------------------------------------------------- -->
          <div class="q-pa-lg">
            <template v-if="associationsList && associationsList.length>0">
              <div class="row q-mb-md">
                <h1 class="text-h1 q-ma-none text-weight-bold">I medici associati</h1>
              </div>
              <q-card>
                <q-card-section class="no-padding">
                  <lms-doctor-association-list
                    :associations="associationsList"
                    :doctor_id="doctorId"
                  />
                </q-card-section>
              </q-card>
            </template>
            <template v-if="associationsErr">
              <div class="row q-mb-md">
                <h1 class="text-h1 q-ma-none text-weight-bold">I medici associati</h1>
              </div>
              <q-card>
                <q-card-section>
                  <q-banner class="h-banner h-banner--warning" >
                    <div class="text-body1 q-pa-md">
                      In questo momento non è possibile visualizzare le associazioni del medico.
                    </div>
                  </q-banner>
                </q-card-section>
              </q-card>

            </template>
          </div>

        </q-card-section>


      </template>

      <template v-if="detailsErr">
        <q-card-section class="q-my-xl q-pa-md" >
          <q-banner class="h-banner h-banner--warning"> In questo momento non è possibile visualizzare i dettagli del medico. Riprovare più tardi.</q-banner>
        </q-card-section>
      </template>

      <q-card-section class="q-my-xl" v-show="isLoading">
        <q-inner-loading :showing="isLoading" block color="primary" />
      </q-card-section>

    </q-card>


    <!-- DIALOG DELLE NOTE -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <q-dialog ref="noteDialog" v-model="openNoteDialog">
      <q-card class="no-scroll">
        <q-toolbar class="justify-end">
          <q-btn flat round dense icon="close" v-close-popup/>
        </q-toolbar>
        <q-card-section class="q-pt-none">
          <p>{{selectedTimeNote}}</p>
        </q-card-section>
        <!--        <q-card-actions align="right" class="q-ma-md">-->
        <!--          <lms-buttons>-->
        <!--            <lms-button @click="onDialogHide">OK</lms-button>-->
        <!--          </lms-buttons>-->
        <!--        </q-card-actions>-->
      </q-card>
    </q-dialog>

    <lms-office-map
      :office="selectedOffice"
      :value="openFullMap"
      @close-dialog="closeFullMap"
    />

  </q-dialog>
</template>

<script>
    import LmsCardItem from "../core/LmsCardItem";
    import LmsCardItemPrimary from "../core/LmsCardItemPrimary";
    import {doctorTypeIcon, getIcon} from "../../services/business-logic";
    import {latLng, latLngBounds} from "leaflet";
    import {Icon} from 'leaflet';
    import 'leaflet/dist/leaflet.css';
    import {LMap, LTileLayer, LMarker} from "vue2-leaflet";
    import {getAssociationsList, getDoctorDetails} from "../../services/api";
    import {apiErrorNotify, booleanToBinary, isEmpty} from "../../services/utils";
    import LmsOfficeMap from "./LmsOfficeMap";
    import LmsCardItemBar from "components/core/LmsCardItemBar";
    import {AVAILABILITY_MESSAGE_MMG, AVAILABILITY_MESSAGE_PLS, DOCTOR_TYPES} from "src/services/config";
    export default {
      name: "LmsDoctorDetailsDialog",
      components: {
        LmsCardItemBar,
        LmsDoctorAssociationList: () => import('src/components/doctors/LmsDoctorAssociationList'),
        LmsOfficeMap,
        LmsCardItemPrimary,
        LmsCardItem,
        LMap,
        LMarker,
        LTileLayer
      },
      props:{
        value: {type: Boolean, required: false, default: false},
        doctorCf:{type:String, required:false, default:''},
        doctorId:{type:String, required:false, default:''},
      },
      data(){
          return{
            doctor:null,
            isLoadingDetails: false,
            isLoadingAssociations:false,
            detailsErr:false,
            associationsErr:false,
            doctorOffices:[],
            associationsList:[],
            selectedOffice: null,
            openFullMap :false,
            openNoteDialog:false,
            selectedTimeNote:null,
            map:null,
            marker:null,
            mapAttribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
            markerIcon:
              L.icon({
                iconUrl: '/statics/la-mia-salute/icone/mappa-pin.svg',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
              }),
            // selectableInfo: {bgColor: '', info: '', extraInfo: '', iconName: ''},

          }
      },
      computed:{
        doctorType(){
          return this.doctor?.tipologia
        },
        doctorIcon() {
          let icon = this.doctor ? getIcon(this.doctor) : null
          return icon ? `img:${icon}` : ''
        },
        isLoading(){
          return this.isLoadingDetails || this.isLoadingAssociations
        },
        showMap(){
          return this.$q.screen.gt.xs
        },
        scrollMaxHeight(){
          return this.$q.screen.gt.sm ? 'calc(80vh - 50px)' : 'calc(100vh - 50px)'
        },
        availability(){
          return this.doctor?.disponibilita
        },
        isDoctorMaximal(){
          return this.doctor?.massimale && this.doctor?.massimale>0
        },
        selectableInfo(){
          let infoMessage= []
          if(!this.availability) return null
          const selectable = this.availability.selezionabile;
          const familyReunion = this.availability.selezionabile_ricongiungimento_familiare;
          const childhood = this.availability.selezionabile_infanzia;
          const temporaryAssistance = this.availability.selezionabile_assistenza_temporanea;

          if(this.doctorType?.id === DOCTOR_TYPES.MMG){
            let msgCode = "MMG_" + booleanToBinary(selectable) + booleanToBinary(familyReunion) +  booleanToBinary(temporaryAssistance);
            infoMessage =  AVAILABILITY_MESSAGE_MMG[msgCode]
          }
          if(this.doctorType?.id === DOCTOR_TYPES.PLS) {
            let msgCode = "PLS_" + booleanToBinary(selectable) + booleanToBinary(familyReunion) + booleanToBinary(childhood) + booleanToBinary(temporaryAssistance);
            infoMessage = AVAILABILITY_MESSAGE_PLS[msgCode];
          }

          return infoMessage
        }
      },
      watch:{
        value:{
          immediate: true,
          handler(newVal, oldVal){
            if(newVal && !isEmpty(this.doctorId) && !isEmpty(this.doctorCf))
              this.loadDoctorInfo()
          }
        },

      },
      created() {
        this.associationsErr= false;
        this.detailsErr=false;
      },
      methods:{
        openMapDialog(office){
          this.selectedOffice = office;
          this.openFullMap = true;
        },
        closeFullMap(val){
          this.openFullMap = val
        },
        closeMap(){
          if (this.map){
            this.map.removeLayer(this.marker)
            this.map.remove();
            this.map = null;
          }
        },
        showNoteDialog(note){
          this.selectedTimeNote = note;
          this.openNoteDialog = true
        },
        addressCoords(office) {
          let coordinates = office.coordinate.coordinates;
          return latLng(coordinates[1], coordinates[0])
        },
        async loadDoctorInfo() {
          this.isLoadingDetails = true;
          this.isLoadingAssociations = true;
          try {
            let doctorInfoPromise = await getDoctorDetails(this.doctorCf, {_no5XXRedirect: true});
            this.doctor = doctorInfoPromise.data;
            if (this.doctor) {
              this.doctorOffices = this.doctor.ambulatori;
              delete this.doctor['ambulatori'];
            }
            this.loadAssociationsList();
          } catch (e) {
            this.detailsErr=true;
            apiErrorNotify({error:e, message:'Impossibile caricare i dati del medico.' })
          } finally {
            this.isLoadingDetails = false;
          }
        },
        async loadAssociationsList(){
          this.isLoadingAssociations = true;
          try{
              let associationsResponse = await getAssociationsList(this.doctorId, {_no5XXRedirect: true});
              this.associationsList = associationsResponse.data
          }catch (e) {
            this.associationsErr =true;
            apiErrorNotify({error:e, message:'Impossibile caricare le associazioni del medico.' })

          }finally {
            this.isLoadingAssociations = false;
          }
        },
        setMapDefaultValues() {
          this.$nextTick(() => {
            let mapRef = this.$refs.map;
            this.map = mapRef ?? mapRef[0]
            this.marker = this.$refs.marker.map(ref => ref.mapObject);
            setTimeout(() => this.map?.mapObject?.invalidateSize(), 200);
          });
        },


      }
    }
</script>

<style lang="sass">
.lms-doctor-details
    &.minWidthDetailCard
      min-width: 800px !important
    .details-toolbar
      padding: 4px 12px
      font-size: 1.125rem
    .doctor-address
      margin-left: 8px
      max-width: calc(100% - 70px)
    .csi-day-of-week
      width: 60px
    .modal-content
      width: 80%
      height: 80%
</style>
