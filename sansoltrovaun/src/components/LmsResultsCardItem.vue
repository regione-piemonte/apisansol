<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-card
    ref="resultCard"
    class="lms-trova-un-card service-card"
    :class="{'active': focused}"
    @click="showMarker"
  >
    <template v-if="!isMobile">
      <q-card-section horizontal class="no-padding">
        <q-card-section class="q-pt-md q-pr-none q-px-sm">
          <q-icon :name="getIcon" :size="isShortCard ? 'md' : 'xl'"/>
        </q-card-section>
        <q-card-section class="q-pl-sm">
          <div class="text-caption"><i>{{typeLabel}}</i></div>
          <div class="text-subtitle1 q-mb-xs">
            <strong>{{itemName | empty}} </strong>
          </div>
          <div v-if="isDoctor">
            <a class="lms-link" @click="showDoctorDetails">Vedi scheda</a>
          </div>
          <div v-if="!isDoctor">
            <span>{{itemAddress | empty}}</span>
          </div>
          <template v-if="!isShortCard">
            <div class="" v-if="isDoctor">
              <q-expansion-item
                dense
                dense-toggle
                :label="itemAddress"
                @input="(val) => {timeTableExpanded = val}"
                class="q-px-none full-width"
                header-class="q-px-none text-primary text-weight-bold"
              >
                <div class="" v-if="officeTimetables.length >0">
                  <div class="text-body1 q-pb-sm "><strong>Orari ricevimento</strong></div>
                  <div
                    v-for="(hours, index) in officeTimetables"
                    :key="index"
                    class="justify-start row items-start"
                  >
                    <template v-if="hours.intervalli.length >0">
                      <div class="text-body2 q-pr-xs" style="min-width: 30px">{{hours.nome | dayOfWeek}}</div>
                      <div class="row office-timetable">
                        <div class="col-xs-12 col-sm-auto" v-for="(interval, i) in hours.intervalli" :key="i">
                          <p class="text-body1 q-mb-xs">
                                <span>
                                  {{interval.apertura}} - {{interval.chiusura}}
                                </span>
                            <span>
                                   <q-icon v-show="interval.note && interval.note !== ''"
                                           name="info"
                                           class="cursor-pointer note-info-icon"
                                           size="17px"
                                           @click="showNoteDialog(interval.note)"
                                   />
                                </span>
                            <span v-if="i <hours.intervalli.length-1" class="q-px-xs gt-sm">e</span>
                          </p>

                        </div>
                      </div>
                    </template>

                  </div>
                  <div class="q-caption" v-if="item.note">
                    Note: {{item.note}}
                  </div>
                </div>
              </q-expansion-item>
            </div>
            <div class="q-mt-md">
              <div>
                <span v-if="telephone" class="card-link"><strong>Telefono: </strong><a :href="telephoneLink">{{telephone}}</a> </span>
                <span v-else><strong>Telefono: </strong>-</span>
              </div>
              <div v-if="!isCeliacStore">
                <span v-if="email" class="card-link "><strong>Email: </strong><a :href="emailLink">{{email}}</a></span>
                <span v-else><strong>Email: </strong>-</span>
              </div>
              <div v-if="!isDoctor">
                <span v-if="webSite" class="card-link"><strong>sito-web: </strong><a :href="webSiteLink"
                                                                                     target="_blank">{{webSite}}</a></span>
                <span v-else><strong>sito-web: </strong>-</span>
              </div>
            </div>

          </template>

        </q-card-section>
      </q-card-section>
      <q-card-section class="q-py-none q-px-md" v-if="isShortCard">
        <div class="" v-if="isDoctor">
          <q-expansion-item
            dense
            dense-toggle
            expand-icon="keyboard_arrow_down"
            :label="itemAddress"
            @input="(val) => {timeTableExpanded = val}"
            class="q-px-none full-width"
            header-class="q-px-none text-primary text-weight-bold"
          >
            <div class="" v-if="officeTimetables.length >0">
              <div class="text-body1 q-pb-sm "><strong>Orari ricevimento</strong></div>
              <div
                v-for="(hours, index) in officeTimetables"
                :key="index"
                class="justify-start row items-start"
              >
                <template v-if="hours.intervalli.length >0">
                  <div class="text-body2 q-pr-xs" style="min-width: 30px">{{hours.nome | dayOfWeek}}</div>
                  <div class="row office-timetable">
                    <div class="col-xs-12 col-sm-auto" v-for="(interval, i) in hours.intervalli" :key="i">
                      <p class="text-body1 q-mb-xs">
                                <span>
                                  {{interval.apertura}} - {{interval.chiusura}}
                                </span>
                        <span>
                                   <q-icon v-show="interval.note && interval.note !== ''"
                                           name="info"
                                           class="cursor-pointer note-info-icon"
                                           size="xs"
                                           @click="showNoteDialog(interval.note)"
                                   />
                                </span>
                        <span v-if="i <hours.intervalli.length-1" class="q-px-xs gt-sm">e</span>
                      </p>

                    </div>
                  </div>
                </template>

              </div>
              <div class="q-caption" v-if="item.note">
                Note: {{item.note}}
              </div>
            </div>
          </q-expansion-item>
        </div>
        <div>
          <span v-if="telephone" class="card-link"><strong>Telefono: </strong><a :href="telephoneLink">{{telephone}}</a> </span>
          <span v-else><strong>Telefono: </strong>-</span>
        </div>
        <div v-if="!isCeliacStore">

          <span v-if="email" class="card-link"><strong>Email: </strong><a :href="emailLink">{{email}}</a></span>
          <span v-else><strong>Email: </strong>-</span>
        </div>
        <div v-if="!isDoctor">
          <span v-if="webSite" class="card-link"><strong>sito-web: </strong><a :href="webSiteLink" target="_blank">{{webSite}}</a></span>
          <span v-else><strong>sito-web: </strong>-</span>
        </div>
      </q-card-section>
      <q-card-section v-if="isCeliacPharmacy && !isProductsAvailable">
        <q-banner class="h-banner h-banner--warning" >
          <div class="row items-center justify-start">
            <q-icon name="warning" size="sm"  class="col-auto"/>
            <span class="col text-body1 text-italic no-margin q-pl-sm">{{availabilityMsg}}</span>
          </div>
        </q-banner>
      </q-card-section>
      <q-card-actions>
        <div class="row items-center justify-between full-width ">
          <q-btn color="primary" flat no-caps :ripple="false" @click="roadDirectionsDialog(true)">
            <div class="row items-center no-wrap">
              <q-icon left name="img:/statics/la-mia-salute/icone/mappa-percorso.svg" size="xs"/>
              <div class="text-center">
                Indicazioni stradali
              </div>
            </div>
          </q-btn>

          <q-btn color="primary" flat no-caps :ripple="false" @click="publicTransportDialog(true)">
            <div class="row items-center no-wrap">
              <q-icon left name="img:/statics/la-mia-salute/icone/trasporto-pubblico.svg" size="xs"/>
              <div class="text-center">
                Trasporto pubblico
              </div>
            </div>
          </q-btn>
        </div>
      </q-card-actions>
    </template>
    <template v-else>
      <q-card-section horizontal v-if="isMobile">
        <q-card-section class="q-pt-xl q-pr-sm">
          <q-icon :name="getIcon" size="md"/>
        </q-card-section>
        <q-card-section class="q-pl-sm items-center text-left full-width overflow-hidden">

          <div class="text-caption"><i>{{typeLabel}}</i></div>
          <div class="text-subtitle1 q-mb-xs">
            <strong>{{itemName | empty}} </strong>
          </div>
          <div class="">
            {{itemAddress | empty}}
          </div>
          <div v-if="isDoctor">
            <a class="lms-link" @click="showDoctorDetails">Vedi scheda</a>
          </div>
        </q-card-section>
      </q-card-section>
      <q-card-section v-if="isCeliacPharmacy && !isProductsAvailable">
        <q-banner class="h-banner h-banner--warning" >
          <div class="row items-center justify-start">
            <q-icon name="warning" size="sm"  class="col-auto"/>
            <span class="col text-body1 text-italic no-margin q-pl-sm">{{availabilityMsg}}</span>
          </div>
        </q-banner>
      </q-card-section>
      <q-card-section>
        <q-expansion-item
          dense
          dense-toggle
          :label="infoExpanded ? 'Mostra meno' : 'Mostra altro'"
          @input="(val) => {infoExpanded = val}"
          header-class="text-primary text-weight-bold q-pl-none"

        >
          <q-card-section class="q-px-none q-pb-none" v-if="isDoctor">
            <div class="" v-if="officeTimetables.length >0">
              <div class="text-body1 q-pb-sm "><strong>Orari ricevimento</strong></div>
              <div
                v-for="(hours, index) in officeTimetables"
                :key="index"
                class="justify-start row items-start"
              >
                <template v-if="hours.intervalli.length >0">
                  <div class="text-body2 q-pr-xs" style="min-width: 30px">{{hours.nome | dayOfWeek}}</div>
                  <div class="row office-timetable">
                    <div class="col-xs-12 col-sm-auto" v-for="(interval, i) in hours.intervalli" :key="i">
                      <p class="text-body1 q-mb-xs">
                                <span>
                                  {{interval.apertura}} - {{interval.chiusura}}
                                </span>
                        <span>
                                   <q-icon v-show="interval.note && interval.note !== ''"
                                           name="info"
                                           class="cursor-pointer note-info-icon"
                                           size="xs"
                                           @click="showNoteDialog(interval.note)"
                                   />
                                </span>
                        <span v-if="i <hours.intervalli.length-1" class="q-px-xs gt-sm">e</span>
                      </p>

                    </div>
                  </div>
                </template>
                <div class="q-caption" v-if="item.note">
                  Note: {{item.note}}
                </div>
              </div>
            </div>
          </q-card-section>
          <q-card-section class="q-px-none">
            <div>

              <span v-if="telephone" class="card-link"><strong>Telefono: </strong><a
                :href="telephoneLink">{{telephone}}</a> </span>
              <span v-else><strong>Telefono: </strong>-</span>
            </div>
            <div v-if="!isCeliacStore">
              <span v-if="email" class="card-link"><strong>Email: </strong><a :href="emailLink">{{email}}</a></span>
              <span v-else><strong>Email: </strong>-</span>
            </div>
            <div v-if="!isDoctor">
              <span v-if="webSite" class="card-link"><strong>sito-web: </strong><a :href="webSiteLink" target="_blank">{{webSite}}</a></span>
              <span v-else><strong>sito-web: </strong>-</span>
            </div>
          </q-card-section>
          <q-card-actions align="right" class="q-mt-sm no-padding">
            <q-btn color="primary" flat no-caps :ripple="false" @click="roadDirectionsDialog(true)">
              <q-icon name="img:/statics/la-mia-salute/icone/mappa-percorso.svg" size="sm"/>
            </q-btn>
            <q-btn color="primary" flat no-caps :ripple="false" @click="publicTransportDialog(true)">
              <q-icon name="img:/statics/la-mia-salute/icone/trasporto-pubblico.svg" size="sm"/>
            </q-btn>
          </q-card-actions>
        </q-expansion-item>
      </q-card-section>
    </template>

    <!-- DIALOG DELLE NOTE -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <q-dialog ref="noteDialog" v-model="openDialog" @hide="onDialogHide">
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
    <!-- DIALOG SCHEDA MEDICO -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <template v-if="isDoctor">
      <lms-doctor-details-dialog
        :value="openDoctorDetailsDialog"
        :doctor-cf="doctorCf"
        :doctor-id="doctorId"
        @close-dialog="closeDoctorDetails"
      />
    </template>

    <!-- INDICAZIONI STRADALI-->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <lms-road-directions-dialog :value="showRoadDirections" :arrival-address="itemAddressObject"
                                @close-dialog="roadDirectionsDialog"/>

    <!--MEZZI PUBBLICI-->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <lms-public-transport-dialog :value="showPublicTransport" :address="itemAddressObject" @close-dialog="publicTransportDialog" />

    <q-resize-observer @resize="resizeCard"/>
  </q-card>

</template>

<script>
  import {PHARMACIES_TYPE, SERVICES, AVAILABILITY_PRODUCTS_PHARMACIES} from "../services/config";
  import {getIcon} from "../services/business-logic";
  import {capitalize} from 'src/services/utils'
  import {openURL} from "quasar";
  import LmsRoadDirectionsDialog from "./LmsRoadDirectionsDialog";
  import LmsPublicTransportDialog from "./LmsPublicTransportDialog";
  import LmsDoctorDetailsDialog from "./doctors/LmsDoctorDetailsDialog";


  export default {
    name: "LmsResultsCardItem",
    components: {
      LmsDoctorDetailsDialog,
      LmsPublicTransportDialog,
      LmsRoadDirectionsDialog},
    props: {
      focused: {type: Boolean, default: false},
      mobile: {type: Boolean, default: false},
      item: {type: Object, default: null}
    },
    data() {
      return {
        servicesList: SERVICES,
        infoExpanded: false,
        timeTableExpanded: false,
        showRoadDirections: false,
        showPublicTransport:false,
        isShortCard: false,
        selectedTimeNote: null,
        openDialog: false,
        openDoctorDetailsDialog:false
      }
    },
    computed: {
      isDoctor() {
        return this.service === SERVICES.DOCTORS
      },
      doctorCf(){
        return this.isDoctor ? this.item?.medico?.codice_fiscale : ''
      },
      doctorId(){
        return this.isDoctor ? this.item?.medico?.id : ''
      },
      isMobile() {
        return this.mobile || (this.$q.screen.lt.sm && this.isShortCard)
      },
      service() {
        return this.$store.getters["getActiveService"];
      },

      typeLabel() {
        return capitalize(this.item?.tipologia)
      },
      itemName() {
        return this.isDoctor ? this.item?.nome_medico : this.item?.descrizione
      },
      itemAddressObject() {
        if (this.item) {
          let coords = this.item.geo?.coordinates
          return {
            label: `${this.itemName} - ${this.itemAddress}`,
            address: `${this.item?.indirizzo} ${this.item?.comune}`,
            coords: {
              lat: coords[1],
              lon: coords[0]
            }
          }
        }
        return null
      },
      itemAddress() {
        return `${this.item?.indirizzo} - ${this.item?.comune}`
      },
      telephoneLink() {
        return `tel:+39${this.item?.telefono}`
      },
      telephone() {
        return this.item?.telefono
      },
      emailLink() {
        return `mailto:${this.item?.email}`
      },
      email() {
        return this.item?.email
      },
      webSiteLink() {
        if (this.webSite && this.webSite.substring(0, 4) === "http")
          return this.webSite
        else
          return '//' + this.webSite
      },
      webSite() {
        return this.item?.sito_web
      },
      getIcon() {
        let icon = this.item ? getIcon(this.item) : null

        return icon ? `img:${icon}` : ''
      },
      officeTimetables() {
        return this.item?.orari ?? []
      },
      isCeliacPharmacy(){
        let type = this.item?.tipo_codice
        return this.service === SERVICES.STORES && type === PHARMACIES_TYPE.codice
      },
      isCeliacStore(){
        let type = this.item?.tipo_codice
        return this.service === SERVICES.STORES && type !== PHARMACIES_TYPE.codice
      },
      isProductsAvailable(){
        return this.item?.disponibili_alimenti_celiaci === AVAILABILITY_PRODUCTS_PHARMACIES.AVAILABLE
      },
      availabilityMsg(){
        let msg = ''
        if(this.item?.disponibili_alimenti_celiaci === AVAILABILITY_PRODUCTS_PHARMACIES.NOT_AVAILABLE)
          msg= 'Questa farmacia potrebbe non essere fornita di alimenti per celiaci'
        if(this.item?.disponibili_alimenti_celiaci === AVAILABILITY_PRODUCTS_PHARMACIES.UNKNOWN)
          msg= 'Nessuna informazione disponibile'

        return msg
      }
    },
    methods: {
      showMarker() {
        this.$emit('show-marker', true)
      },

      roadDirectionsDialog(value) {
        this.showRoadDirections = value
      },
      publicTransportDialog(value) {
        this.showPublicTransport = value
      },
      resizeCard() {
        // let cardWidth = this.$refs.resultCard?.clientWidth;
        let cardInfo = this.$refs.resultCard?.$el.getBoundingClientRect()
        let cardWidth = cardInfo.width

        this.isShortCard = cardWidth < 350;
      },
      showNoteDialog(note) {
        this.selectedTimeNote = note;
        this.openDialog = true
      },
      onDialogHide() {
        this.$refs.noteDialog.hide()
      },
      showDoctorDetails(){
        this.openDoctorDetailsDialog = true
      },
      closeDoctorDetails(val){
        this.openDoctorDetailsDialog = val
      }
    }
  }
</script>

<style lang="sass">

</style>
