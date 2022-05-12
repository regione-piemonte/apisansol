<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div v-if="!isLoading">
    <template v-if="allowedOperations">
      <q-card class="q-my-md text-body1" v-if="isVisibile">
        <lms-card-item-bar type="info" v-if="isDummyAppointment">
          Hai ricevuto un invito. Puoi prenotare l'appuntamento cliccando "Crea appuntamento".
        </lms-card-item-bar>
        <q-card-section class="q-pa-none">
          <lms-card-item no-actions  v-if="isAppointment">
            <template slot="primary">
              <lms-card-item-primary>
                <template slot="icon">
                  <q-icon size="lg" :name="appointmentIcon" />
                </template>
                <template slot="text">
                  <div class="text-subtitle1 text-weight-bold q-pa-sm">
                    {{ appointmentName | capitalize }} <br />
                    {{ appointmentLevel }}
                  </div>
                </template>
              </lms-card-item-primary>
            </template>
            <template slot="secondary">
              <div class="row q-pa-md">
                <q-list class="col col-md-10">
                  <q-item class="q-px-none q-pb-md" v-if="!isDummyAppointment">
                    <q-item-section side top>
                      <q-icon
                        size="xl"
                        name="img:/statics/la-mia-salute/icone/calendario.svg"
                      />
                    </q-item-section>
                    <q-item-section >
                      <div>Appuntamento</div>
                      <div>
                        <strong>{{ appointmentDate | date }}</strong>
                      </div>
                      <div>
                        <strong>Ore {{ appointmentHour }}</strong>
                      </div>
                      <!--                    <template v-if="$q.screen.lt.md">-->
                      <!--                      <div-->
                      <!--                        v-if="isEditable"-->
                      <!--                        class="text-primary q-my-sm"-->
                      <!--                        @click="changeDate"-->
                      <!--                      >-->
                      <!--                        <strong>Modifica data</strong>-->
                      <!--                      </div>-->
                      <!--                    </template>-->
                    </q-item-section>
                  </q-item>
                  <q-item class="q-px-none">
                    <q-item-section side top>
                      <q-icon
                        size="xl"
                        name="img:/statics/la-mia-salute/icone/unita-operativa.svg"
                      />
                    </q-item-section>
                    <q-item-section>
                      <div>Struttura</div>
                      <div>
                        <strong>{{ opUnitName }}</strong>
                      </div>
                      <div>
                        {{ appointmentAddress }},
                        {{ appointment.detail.unita_operativa_civico }}
                        -
                        {{ appointmentCity }}
                      </div>
                      <!--                    <template v-if="$q.screen.lt.md">-->
                      <!--                      <div-->
                      <!--                        v-if="isEditable"-->
                      <!--                        class="text-primary q-my-sm"-->
                      <!--                        @click="changePlace"-->
                      <!--                      >-->
                      <!--                        <strong>Modifica luogo</strong>-->
                      <!--                      </div>-->
                      <!--                    </template>-->

                      <div class="row items-center">
                        <div
                          class="cursor-pointer col-12 text-primary q-py-sm"
                          @click="showMap()"
                        >
                          <q-icon
                            size="xs"
                            name="img:/statics/la-mia-salute/icone/mappa.svg"
                            class="q-mr-xs"
                          />
                          <strong>Vedi luogo su mappa</strong>
                        </div>
                      </div>
                    </q-item-section>

                    <!--                  <q-item-section-->
                    <!--                    side-->
                    <!--                    top-->
                    <!--                    v-if="$q.screen.gt.sm"-->
                    <!--                    class="q-pt-lg"-->
                    <!--                  >-->
                    <!--                    <div-->
                    <!--                      v-if="isEditable"-->
                    <!--                      class="cursor-pointer"-->
                    <!--                      @click="changePlace()"-->
                    <!--                    >-->
                    <!--                      <span v-show="$q.screen.gt.sm">-->
                    <!--                        <q-icon size="xs" color="primary" name="edit" />-->
                    <!--                      </span>-->
                    <!--                      <span class="text-primary 'q-ml-xs">-->
                    <!--                        <strong>Modifica luogo</strong></span-->
                    <!--                      >-->
                    <!--                    </div>-->
                    <!--                  </q-item-section>-->
                  </q-item>
                </q-list>
                <q-space />
                <div class="row reverse text-center ">
                  <q-icon
                    color="grey-7"
                    size="sm"
                    name="more_vert"
                    class="cursor-pointer"
                  >
                    <q-menu auto-close>
                      <q-list>
                        <q-item clickable @click="printAppointment()">
                          <q-item-section>Stampa</q-item-section>
                        </q-item>
                        <q-item clickable @click="saveOnCalendar()" v-if="!isDummyAppointment">
                          <q-item-section>Salva su calendario</q-item-section>
                        </q-item>
                      </q-list>
                    </q-menu>
                  </q-icon>
                </div>
              </div>
              <!--            SEZIONE MODIFICA APPUNTAMENTO-->
              <div v-if="isEditable" class="q-px-md q-pb-md " >
                <lms-buttons>
                  <lms-dropdown-button v-if="isDummyAppointment"  color="primary" label="Crea Appuntamento">
                    <q-list>
                      <q-item clickable v-close-popup @click="changeDate">
                        <q-item-section>
                          <q-item-label>Crea nella stessa struttura</q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-item clickable v-close-popup @click="changePlace">
                        <q-item-section>
                          <q-item-label>Crea in una struttura diversa</q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </lms-dropdown-button>


                  <lms-dropdown-button v-else outline color="primary" label="Modifica">
                    <q-list>
                      <q-item clickable v-close-popup @click="changeDate">
                        <q-item-section>
                          <q-item-label>Modifica data</q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-item clickable v-close-popup @click="changePlace">
                        <q-item-section>
                          <q-item-label>Modifica luogo</q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </lms-dropdown-button>
                </lms-buttons>
              </div>
            </template>
          </lms-card-item>
        </q-card-section>
      </q-card>
    </template>
    <q-dialog v-model="viewMap" :maximized="$q.screen.lt.md">
      <q-card class="no-scroll" :class="{ minWidthCard: $q.screen.gt.sm }">
        <q-card-section class="no-scroll fit no-padding">
          <div class="absolute q-pa-lg" style="right: 0; z-index:1000">
            <q-btn
              round
              dense
              color="white"
              text-color="primary"
              size="md"
              icon="close"
              v-close-popup
            />
          </div>

          <div class="csi-op-units-map fit" v-if="isMapProperties">
            <l-map
              ref="addressMap"
              :zoom="zoom"
              :center="center"
              :options="mapOptions"
            >
              <l-tile-layer :url="url" :attribution="attribution" />
              <l-marker :lat-lng="center" :icon="markerIcon">
                <l-popup :options="{ closeButton: false }">
                  <div>
                    {{ appointment.detail.unita_operativa_descrizione }}
                  </div>
                </l-popup>
              </l-marker>
            </l-map>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <csi-print-appointment :appointment="printAppointmentData" :is-dummy-appointment="isDummyAppointment" />
  </div>
</template>

<script>
import { NEW_APPOINTMENT_DATE, NEW_APPOINTMENT_PLACE } from "src/router/routes";
import {
  apiErrorNotify,
  isEmpty,
  capitalize,
  startCase
} from "../../services/utils";
import {
  APPOITNMENT_VISIBILITY_CODES,
  APPOINTMENT_TYPES,
  APPOINTMENT_TYPES_LABEL,
  APPOINTMENT_TYPES_NAME
} from "src/services/config";
import { latLng } from "leaflet";
import { date } from "quasar";
import {
  appointmentAllowedOperations,
  downloadICalendar,
  getAppointmentDetails,
  getCytologicalAppointment, getMammographicAppointment,
  getUserRiscreInfo
} from "../../services/api";
import { LMap, LPopup, LTileLayer, LMarker } from "vue2-leaflet";
import "leaflet/dist/leaflet.css";
import CsiPrintAppointment from "./CsiPrintAppointment";
import LmsDropdownButton from "../core/LmsDropdownButton";
import {screeningLevel} from "src/services/business-logic";
import LmsCardItemBar from "components/core/LmsCardItemBar";
export default {
  name: "CsiAppointmentCard",
  components: {
    LmsCardItemBar,
    LmsDropdownButton,
    CsiPrintAppointment,
    LMap,
    LTileLayer,
    LMarker,
    LPopup
  },
  props: {
    appointmentType: { type: String, default: "" },
    // appointment: {type:Object, default:null}
  },
  watch:{
    isLoading:{
      handler(val, oldVal){
        this.$emit('is-loading' , this.isLoading)
      }
    }
  },
  data() {
    return {
      isLoading:false,
      NEW_APPOINTMENT_PLACE,
      NEW_APPOINTMENT_DATE,
      viewMap: false,
      isMapProperties: false,
      selectedAppointment: null,
      zoom: 16,
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      mapOptions: {
        zoomSnap: 0.5,
        dragging: true,
        touchZoom: true
      },
      center: null,
      markerIcon: L.icon({
        iconUrl: "/statics/la-mia-salute/icone/mappa-pin.svg",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34]
      }),
      printPage: false,
      APPOINTMENT_TYPES_LABEL,
      APPOINTMENT_TYPES_NAME,
      appointment: null,
      allowedOperations:null,
      allowedOperationsError :'',
    };
  },
  async created() {
    this.isLoading = true
    await this.operationsAllowed()
    await this.getDefaultData()
  },
  computed: {
    cf() {
      return this.$store.getters["getTaxCode"];
    },
    userCodes() {
      return this.$store.getters["preventionScreening/getUserCodes"];
    },
    isAppointment() {
      return !isEmpty(this.appointment);
    },
    appointmentLevel() {
      return screeningLevel(this.appointment?.detail?.livello_appuntamento)
      // if ( !== "1") {
      //   return "II livello";
      // }
      // return "I livello";
    },
    appointmentTypeLabel() {
      return APPOINTMENT_TYPES_LABEL[this.appointmentType];
    },
    appointmentIcon() {
      return `img:/statics/la-mia-salute/icone/screening-${this.appointmentTypeLabel}.svg`;
    },
    appointmentName() {
      return APPOINTMENT_TYPES_NAME[this.appointmentType];
    },
    opUnitName() {
      return this.appointment?.luogo;
    },
    appointmentAddress() {
      return startCase(this.appointment?.detail.unita_operativa_indirizzo);
    },
    appointmentCity() {
      return startCase(this.appointment?.detail.unita_operativa_comune);
    },
    isEditable() {
      return this.allowedOperations?.modificabile;
    },
    isBookable() {
      return this.allowedOperations?.prenotabile;
    },

    isViewable() {
      return this.allowedOperations?.visualizzabile;
    },
    notAppointmentMsg() {
      return this.allowedOperations?.messaggio;
    },
    printAppointmentData() {
      if (this.appointment) {
        return {
          name: this.appointmentName,
          label: this.appointmentTypeLabel,
          icon: this.appointmentIcon,
          level: this.appointmentLevel,
          date: this.appointment.data,
          hour: this.appointment.ora,
          place: `${this.appointmentAddress}, ${this.appointment.detail.unita_operativa_civico} - ${this.appointmentCity}`
        };
      } else {
        return null;
      }
    },
    isVisibile(){
     return this.isViewable && (this.appointment?.app_visibile === APPOITNMENT_VISIBILITY_CODES.VISIBILE ||
      this.appointment?.app_visibile === APPOITNMENT_VISIBILITY_CODES.PARTIALLY_VISIBILE)
    },
    isDummyAppointment(){
      return this.appointment?.app_visibile === APPOITNMENT_VISIBILITY_CODES.PARTIALLY_VISIBILE
    },
    appointmentDate(){
     return  this.appointment?.data
    },
    appointmentHour(){
      return this.appointment?.ora?.slice(0, 5)
    },


  },
  methods: {
    async operationsAllowed(){
      try{
        let operationsResponse = await appointmentAllowedOperations(
          this.cf,
          this.appointmentType,
          { params: this.userCodes }
        );
        this.allowedOperations = operationsResponse.data
        let operations= {
          type: this.appointmentType,
          obj: this.allowedOperations
        }
        this.$store.dispatch("preventionScreening/setAllowedOperations", operations );

      }catch (e) {
        apiErrorNotify({
          error: e,
          message: e.response?.statusMessage
        });
        console.log(e.response)
        this.allowedOperationsError = e.response?.data?.title
      }
    },
    getDefaultData(){
      let httpconfig = {
        _no5XXRedirect: true,
        params: this.userCodes
      };
      // if(this.isBookable){
      //   let params= {
      //     type: this.appointmentType,
      //     isBookable: true
      //   }
      //   this.$store.dispatch("preventionScreening/setIsBookable", params );
      // }
      if(this.isViewable){
        if(this.appointmentType === APPOINTMENT_TYPES.CV)  this.getCytologicalAppointment(httpconfig)
        if(this.appointmentType === APPOINTMENT_TYPES.MX) this.getMammographicAppointment(httpconfig)
      }else{
        this.isLoading = false
      }


    },
    async getCytologicalAppointment(httpconfig){
      try{
        this.isLoading = true
        let cytologicalResponse= await getCytologicalAppointment(this.cf, httpconfig);
        this.appointment = cytologicalResponse.data
        if(!isEmpty(this.appointment) && this.isVisibile){
          let cytologicalDetailResponse = await getAppointmentDetails(this.cf, this.appointmentType, httpconfig);
          this.appointment.detail =  cytologicalDetailResponse.data
        }else{
          this.appointment = null
        }
      }catch (error) {
        console.log(error.response)
        apiErrorNotify({error, message: error.response?.statusMessage});
      }finally{
        this.isLoading = false;
      }
    },
    async getMammographicAppointment(httpconfig){
      try{
        this.isLoading = true
        let mammographicResponse= await getMammographicAppointment(this.cf, httpconfig);
        this.appointment  = mammographicResponse.data
        if(!isEmpty(this.appointment) && this.isVisibile){
          let mammographicDetailResponse = await getAppointmentDetails(this.cf, this.appointmentType, httpconfig);
          this.appointment .detail = mammographicDetailResponse.data
        }else{
          this.appointment=null
        }
      }catch (error) {
        console.log(error.response)
        apiErrorNotify({error, message: error.response?.statusMessage});
      }finally{
        this.isLoading = false;
      }
    },
    createNewAppointment(){
      let params = {
        type: this.appointmentTypeLabel,
        typeId:this.appointmentType,
        isNewAppointment: true
      };

      let route = {
        name: this.NEW_APPOINTMENT_PLACE.name,
        params
      };

      this.$router.push(route);
    },
    changeDate() {
      let params = {
        type: this.appointmentTypeLabel,
        typeId: this.appointmentType,
        appointment: this.appointment,
        isDummyAppointment: this.isDummyAppointment
      };

      let route = {
        name: this.NEW_APPOINTMENT_DATE.name,
        params
      };

      this.$router.push(route);
    },
    changePlace() {
      let params = {
        type: this.appointmentTypeLabel,
        typeId: this.appointmentType,
        appointment: this.appointment,
        isDummyAppointment: this.isDummyAppointment
      };

      let route = {
        name: this.NEW_APPOINTMENT_PLACE.name,
        params
      };

      this.$router.push(route);
    },

    async showMap() {
      this.viewMap = true;
      this.selectedAppointment = this.appointment;
      let coordinates = this.appointment.detail?.indirizzo_geo?.coordinate
        ?.coordinates;

      if (coordinates) {
        this.center = latLng(coordinates[1], coordinates[0]);
        this.isMapProperties = true;
        this.$nextTick(() => {
          let addressMap = this.$refs.addressMap;
          setTimeout(() => addressMap.mapObject.invalidateSize(), 400);
        });
      }
    },
    printAppointment() {
      const id = `print-appointment-${this.appointmentTypeLabel}`;
      const prtHtml = document.getElementById(id).innerHTML;
      // Get all stylesheets HTML
      let stylesHtml = "";
      for (const node of [
        ...document.querySelectorAll('link[rel="stylesheet"], style')
      ]) {
        stylesHtml += node.outerHTML;
      }
      // Open the print window
      const WinPrint = window.open("", "_blank");
      WinPrint.document.write(`<!DOCTYPE html>
                  <html>
                    <head>
                      ${stylesHtml}
                    </head>
                    <body class="print-page">
                      ${prtHtml}
                    </body>
                  </html>`);
      console.log(WinPrint);
      // WinPrint.document.close();
      setTimeout(() => {
        WinPrint.focus();
        WinPrint.print();
      }, 500);

      //WinPrint.close();
    },
    async saveOnCalendar() {
      const time = this.appointment.ora;
      let hours = time.split(":")[0];
      let minutes = time.split(":")[1];
      let startDate = date.addToDate(this.appointment.data, {
        hours: hours,
        minutes: minutes
      });
      console.log("startDate", startDate);
      let endDate = date.addToDate(startDate, { hours: 1 });
      let params = {
        file_nome: `appuntamento_screening_${this.appointmentTypeLabel}`,
        da: startDate,
        a: endDate,
        nome: this.appointmentName ? capitalize(this.appointmentName) : "",
        luogo: `${this.appointment.detail.unita_operativa_indirizzo} ${this.appointment.detail.unita_operativa_civico}, ${this.appointment.detail.unita_operativa_comune}`
      };
      console.log(params);
      try {
        let iCalendarResponse = await downloadICalendar({ params: params });
      } catch (e) {
        console.error(e);
        apiErrorNotify({
          error: e,
          message: "Impossibile effettuare il download."
        });
      }
      //
    }
  }
};
</script>

<style scoped></style>
