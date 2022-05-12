<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-modal
    @input="$emit('input', $event)"
    :value="value"
    :class="{'maximized' : $q.screen.lt.md}"
    class="csi-doctor-details"
    ref="modal"

  >
    <q-modal-layout header-class="no-shadow">
      <q-toolbar slot="header" color="primary" text-color="white">
        <q-toolbar-title>Scheda medico</q-toolbar-title>
        <q-btn flat round icon="close" v-close-overlay/>
      </q-toolbar>

      <q-page padding class="csi-doctor-details-container layout-padding" >
          <template v-if="doctor && !isLoading">
            <!------- CARD MEDICO ------------>
            <!-- ----------------------------------------------------------------------------------------------------- -->
            <q-card class="csi-doctor-detail-card ">
              <!---BANNER --->
              <template v-if="!isUserOwnDoctor">
                <csi-bar
                  :bg-color="csiBarBgColor"
                >
                  <div class="row flex items-center justify-start q-py-sm">
                    <div class="col-1 text-center">
                      <q-icon :name="csiBarIcon" class="csi-icon--sm q-pr-sm"/>
                    </div>
                    <div class="col-11">
                      <template v-if="!isDoctorMaximal">
                        Questo medico non può essere scelto. Rivolgiti all'ASL per ulteriori informazioni.
                      </template>
                      <template v-else>
                        <template v-if="availability && selectableInfo">{{selectableInfo.info}}</template>
                        <template v-if="!availability">
                          A causa un un problema temporaneo questo medico non può essere scelto. Riprovare più tardi
                        </template>
                      </template>

                      <template v-if="isDoctorMonitored">
                        <br>
                        Su questo medico hai attivato il monitoraggio, riceverai una notifica appena
                        il medico avrà posti disponibili.
                      </template>

                     </div>
                  </div>
                </csi-bar>

              </template>
              <q-card-main class="no-padding">
                <csi-card-item>
                  <!-- PRIMARY -->
                  <!-- ----------------------------------------------------------------------------------------------------- -->
                  <template slot="primary">
                    <csi-card-item-primary class="q-py-md">
                      <template slot="icon">
                        <csi-icon-base class="csi-svg-icon--xl">
                          <template v-if="isPediatrician">
                            <csi-icon-avatar-pediatrician :is-female="doctor.sesso === 'F'"/>
                          </template>
                          <template v-else>
                            <csi-icon-avatar-doctor :is-female="doctor.sesso === 'F'"/>
                          </template>

                        </csi-icon-base>

                      </template>
                      <template slot="text">
                        <div class="q-subheading text-weight-bold doctor-name">
                          {{doctor.cognome}} {{doctor.nome}}
                        </div>
                      </template>
                    </csi-card-item-primary>
                  </template>
                  <!-- SECONDARY -->
                  <!-- ----------------------------------------------------------------------------------------------------- -->
                  <template slot="secondary">
                    <q-item class="q-pa-lg gutter-y-xs">
                      <q-item-main>
                        <q-item-tile
                          class="q-body-2 text-weight-bold"
                          v-if="doctor.tipologia"
                        >
                          {{doctor.tipologia.descrizione}}
                        </q-item-tile>
                        <q-item-tile
                          class="q-body-1"
                        >
                          <span v-if="doctor.data_nascita">{{doctor.data_nascita | format }}</span> <span v-if="doctor.specializzazioni">-</span>
                          {{doctor.specializzazioni}}
                        </q-item-tile>
                        <!--                  <q-item-tile class="q-body-1 text-weight-bold ">-->
                        <!--                    <a class="text-primary" style="text-decoration: none" :href="`mailto:${doctor.mail}`">{{doctor.mail}}</a>-->
                        <!--                  </q-item-tile>-->
                      </q-item-main>
                    </q-item>

                    <!-- AZIONI -->
                    <!-- --------------------------------------------------------------------------------------------------------- -->
                    <slot name="actions">
                      <div class="row items-center float-right q-pa-md">
                        <div class="col-12 col-md-auto">
                          <csi-buttons>
                            <template v-if="isUserOwnDoctor">
                              <csi-button
                                primary
                                label="Cambia medico"
                                @click="changeDoctorModal"
                              />
                              <csi-button
                                color="negative"
                                secondary
                                label="Revoca"
                                @click="revokeDoctorModal"
                              />
                            </template>
                            <template v-else>
                              <template v-if="isDoctorMaximal">
                                <csi-button
                                  v-if="isSelectable"
                                  primary
                                  :loading="combinationControlLoading"
                                  label="Scegli"
                                  @click="chooseDoctor"
                                />
                                <template v-if="isMonitorable">
                                  <csi-button
                                    v-if="isDoctorMonitored"
                                    color="negative"
                                    secondary label="Annulla monitoraggio"
                                    @click="manageMonitoringModal(false)"
                                  />
                                  <csi-button
                                    v-else
                                    secondary
                                    label="Monitora"
                                    @click="manageMonitoringModal(true)"
                                  />
                                </template>
                              </template>
                            </template>
                          </csi-buttons>
                        </div>
                      </div>
                    </slot>

                  </template>
                </csi-card-item>
              </q-card-main>
            </q-card>

            <!------- AMBULATORI ------------>
            <!-- ----------------------------------------------------------------------------------------------------- -->
            <template v-if="doctorOffices.length>0">
              <div class="row change-doctor-home-title">
                <h1 class="csi-h1">Ambulatori</h1>
              </div>
              <q-card>
                <q-card-main class="no-padding">
                  <q-list no-border separator class="q-px-lg">
                    <q-item multiline
                            v-for="ambulatorio in doctorOffices"
                            :key="ambulatorio.id"
                            class="q-py-md q-px-none"
                    >
                      <q-item-main class="no-padding row">
                        <div class="col-12 col-sm-9">
                          <q-item-tile
                            class="flex items-center q-px-none">
                            <csi-icon-base class="csi-svg-icon--lg">
                              <csi-icon-hospital/>
                            </csi-icon-base>
                            <div class="q-body-2 doctor-address q-pa-xs">
                              <div>
                                {{ambulatorio.indirizzo}} - {{ambulatorio.comune}}
                              </div>


                              <div class="cursor-pointer q-py-xs" @click="openMapModal(ambulatorio)" v-if="$q.screen.lt.sm">
                                <span class="text-primary text-weight-bold">Vedi mappa</span>
                              </div>
                            </div>

                          </q-item-tile>

                          <q-item-tile class="q-px-none q-pa-sm">
                            <csi-medical-office-item :ambulatorio="ambulatorio"/>
                          </q-item-tile>
                        </div>
                        <div
                          class="col-3 q-py-md"
                          @click="openMapModal(ambulatorio)"
                          style="min-height: 180px"
                          v-show="$q.screen.gt.xs"
                        >
                          <l-map
                            :zoom="15"
                            :center="addressCoords(ambulatorio)"
                            :options="{zoomControl: false}"
                          >
                            <l-tile-layer
                              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                              :attribution="mapAttribution"
                            />
                            <l-marker :lat-lng="addressCoords(ambulatorio)" :icon="markerIcon">
                            </l-marker>
                          </l-map>
                        </div>

                      </q-item-main>

                    </q-item>
                  </q-list>

                </q-card-main>
              </q-card>
            </template>


            <!------- MEDICI ASSOCIATI ------------>
            <!-- ----------------------------------------------------------------------------------------------------- -->
            <template v-if="associationsList && associationsList.length>0">
              <div class="row change-doctor-home-title">
                <h1 class="csi-h1">I medici associati</h1>
              </div>
              <q-card>
                <q-card-main class="no-padding">
                  <csi-doctor-association-list
                    :associations="associationsList"
                    :doctor_id="doctor.id"
                    @show-associated-doctor-details="showAssociatedDoctor"
                  ></csi-doctor-association-list>
                </q-card-main>
              </q-card>
            </template>
            <template v-if="associationsErr">
              <div class="row change-doctor-home-title">
                <h1 class="csi-h1">I medici associati</h1>
              </div>
              <q-card>
                <q-card-main class="no-padding">
                  <q-alert type="warning" class="csi-modal-alert q-pa-md" >
                    <div class="q-body-1 q-pa-md">
                      In questo momento non è possibile visualizzare le associazioni del medico.
                    </div>
                  </q-alert>
                </q-card-main>
              </q-card>

            </template>
          </template>
          <template v-if="detailsErr">
            <q-card>
              <q-card-main class="no-padding">
                <q-alert type="warning" class="csi-modal-alert q-pa-md" >
                  <div class="q-body-1 q-pa-md">
                    In questo momento non è possibile visualizzare i dettagli del medico. Riprovare più tardi.
                  </div>
                </q-alert>
              </q-card-main>
            </q-card>
          </template>

        <!-- MODALS -->
        <!-- ----------------------------------------------------------------------------------------------------------- -->
        <csi-office-map
          v-model="openFullMap"
          :office="selectedOffice"
        />
        <csi-revoke-doctor-modal
          v-model="isRevokeDoctor"
          :doctor="doctor"
          :cf="taxCode"
        />
        <csi-monitoring-modal
          v-model="showMonitoringModal"
          :doctor="doctor"
          :monitoring="toggleMonitoring"
          :cf="taxCode"
        />
        <csi-confirm-address-modal
          v-model="changeAddressModal"
          :user-info="userInfo"
          :choosen-doctor="choosenDoctor"
          @combination-control="getCombinationControl"
          @go-to-results="goToResults"
        />
        <csi-doctor-consent-modal
          v-model="doctorConsentModal"
          :doctor="choosenDoctor"
          :derogation-type="derogationType"
          @change-doctor="isDoctorConsent"
        />
        <csi-login-modal
          v-model="loginModal"
          :doctor="choosenDoctor"
          :change-doctor="changeDoctorRequest"
        />

        <!-- DIALOG DI limite massimo di richieste-->
        <q-dialog
          v-model="isMaxLimitDialog"
        >
          <div slot="title" class="q-title">Limite massimo di operazioni</div>
          <div slot="message">
            <span>Hai recentemente effettuato un'operazione di scelta o revoca del medico. Potrai effettuarne una nuova dal {{maxLimitChangeOrRevoke.newAllowedDate | format}}.</span>

          </div>

          <template slot="buttons" slot-scope="props">
            <csi-buttons>
              <csi-button primary color="primary" label="Ok" @click="props.ok"/>
            </csi-buttons>
          </template>
        </q-dialog>


        <!-- DIALOG DI cambio medico -->
        <!-- ----------------------------------------------------------------------------------------------------------- -->
        <q-dialog
          v-model="isRequestInProgressDialog"
        >

          <div slot="title" class="q-title">Richiesta in corso</div>
          <div slot="message">
            Non è possibile inviare una nuova richiesta di cambio medico. <br>
            È necessario annullare prima la domanda precedente.
          </div>

          <template slot="buttons" slot-scope="props">
            <csi-buttons>
              <csi-button primary color="primary" label="Ok" @click="props.ok"/>
            </csi-buttons>
          </template>
        </q-dialog>
        <csi-doctor-wrong-type v-model="isWrongChoice"/>
      </q-page>
      <!--      LOADER-->
      <csi-inner-loading :visible="isLoading"/>
    </q-modal-layout>
  </q-modal>
</template>

<script>
  import {
    combinationControl,
    getAssociationsList,
    getDoctorDetails
  } from "@services/api/change-doctor";
  import CsiCardItem from "components/global/common/CsiCardItem";
  import CsiCardItemPrimary from "components/global/common/CsiCardItemPrimary";
  import CsiIconBase from "components/global/icons/CsiIconBase";
  import CsiDoctorItem from "components/change-doctor/CsiDoctorItem";
  import CsiIconHospital from "components/global/icons/CsiIconHospital";
  import CsiIconAvatarDoctor from "components/global/icons/CsiIconAvatarDoctor";
  import CsiIconMap from "components/global/icons/CsiIconMap";
  import CsiIconAssociatedDoctors from "components/global/icons/CsiIconAssociatedDoctors";
  import CsiPageTitle from "components/global/common/CsiPageTitle";
  import CsiRevokeDoctorModal from "components/change-doctor/CsiRevokeDoctorModal";
  import CsiMonitoringModal from "components/change-doctor/CsiMonitoringModal";
  import CsiBar from 'components/global/common/CsiBar';
  import CsiMedicalOfficeItem from "components/change-doctor/CsiMedicalOfficeItem";
  //import CsiDoctorAssociationList from "components/change-doctor/CsiDoctorAssociationList";
  import CsiConfirmAddressModal from "components/change-doctor/CsiConfirmAddressModal";
  import {is4XX, notifyError} from "@services/api/utils";
  import {
    availabilityDoctorMessage,
    firstControlCombinationOptions, getStandardAddress, goToRequestNotAllowed,
    isDoctorDerogation,
  } from "@services/change-doctor/business-logic";
  import CsiDoctorConsentModal from "components/change-doctor/CsiDoctorConsentModal";
  import CsiLoginModal from "components/change-doctor/CsiLoginModal";
  import CsiOfficeMap from "components/change-doctor/CsiOfficeMap";
  import {latLng} from "leaflet";
  import {Icon} from 'leaflet';
  import 'leaflet/dist/leaflet.css';
  import {LMap, LTileLayer, LMarker} from "vue2-leaflet";
  import CsiMarkerIcon from "src/statics/icons/svgs/marker-icon.svg";
  import CsiIconAvatarPediatrician from "components/global/icons/CsiIconAvatarPediatrician";
  import CsiDoctorWrongType from "components/change-doctor/CsiDoctorWrongType";

  export default {
    name: "CsiDoctorDetails",
    components: {
      CsiDoctorWrongType,
      CsiIconAvatarPediatrician,
      CsiOfficeMap,
      CsiMonitoringModal,
      CsiRevokeDoctorModal,
      CsiDoctorItem,
      CsiCardItem,
      CsiIconMap,
      CsiBar,
      CsiCardItemPrimary,
      CsiIconHospital,
      CsiIconAvatarDoctor,
      CsiIconAssociatedDoctors,
      CsiMedicalOfficeItem,
      CsiDoctorAssociationList: () => import('components/change-doctor/CsiDoctorAssociationList'),
      CsiIconBase,
      CsiPageTitle,
      CsiConfirmAddressModal,
      CsiDoctorConsentModal,
      CsiLoginModal,
      Icon,
      LMap,
      LMarker,
      LTileLayer
    },
    data() {
      return {
        doctor: null,
        doctorId:'',
        doctorCf:'',
        doctorOffices: null,
        associationsList: [],
        associationsErr: false,
        detailsErr:false,
        availability: null,
        isLoadingDetails: false,
        isLoadingAssociations:false,
        loginModal: false,
        hideModal: false,
        showMonitoringModal: false,
        isWrongChoice: false,
        toggleMonitoring: '',
        isRevokeDoctor: false,
        isSelectable: false,
        isMonitorable:false,
        changeAddressModal: false,
        selectableInfo: {bgColor: '', info: '', extraInfo: '', iconName: ''},
        combinationControlResponse: null,
        doctorConsentModal: false,
        isDoctorDerogation: false,
        derogationType: null,
        changeDoctorRequest: false,
        isUserOwnDoctor: false,
        requestInProgress: false,
        isRequestInProgressDialog: false,
        openFullMap: false,
        selectedOffice: null,
        mapAttribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        combinationControlLoading: false,
        isMaxLimitDialog: false,
        markerIcon:
          L.icon({
            iconUrl: CsiMarkerIcon,
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
          }),
      }
    },
    computed: {
      userInfo() {
        return this.$store.getters['changeDoctor/getUserInfo']
      },
      isProduction(){
        return this.$config.global.isProduction || this.$config.global.isAlpha
      },
      taxCode() {
        return this.$store.getters['changeDoctor/getTaxCode']
      },
      userAge() {
        return this.$store.getters['changeDoctor/getUserAge']
      },

      isDelegation() {
        return this.$store.getters['changeDoctor/isDelegationActive']
      },
      userOwnDoctorId() {
        return this.$store.getters['changeDoctor/getUserDoctor']
      },
      isAskedUserAddress() {
        return this.$store.getters['changeDoctor/isAskedAddress']
      },
      monitoredDoctors() {
        return this.$store.getters['changeDoctor/getMonitoredDoctors'];
      },
      isDoctorMonitored() {
        if (this.monitoredDoctors) {
          let getMonitoredDoctor = this.monitoredDoctors.find(d => d.id === this.doctorId);
          if (getMonitoredDoctor) return true
        }
        return false
      },
      isAskedAddress() {
        return this.$store.getters['changeDoctor/isAskedAddress']
      },
      choosenDoctor() {
          return !this.isUserOwnDoctor ?  this.doctor : null
      },
      isPediatrician() {
        let type = this.doctor.tipologia.id;
        return (type === this.$config.changeDoctor.doctorsType.PLS)
      },
      isLoading(){
        return this.isLoadingDetails || this.isLoadingAssociations
      },
      maxLimitChangeOrRevoke() {
        return this.$store.getters['changeDoctor/getMaxLimitChanges']
      },
      isDoctorMaximal(){
        if(!this.doctor) return false
        return this.doctor.massimale && this.doctor.massimale>0
      },
      csiBarBgColor() {
        let color = 'info'
        if (!this.isDoctorMaximal)
          color = 'warning'
        else {
          if (this.selectableInfo && this.availability)
            color = this.selectableInfo.bgColor
          if (!this.availability)
            color = 'warning'
        }

        return color
      },
      csiBarIcon() {

        let icon = 'info'
        if (!this.isDoctorMaximal)
          icon = 'info'
        else {
          if (this.selectableInfo && this.availability)
            icon = this.selectableInfo.iconName
          if (!this.availability)
            icon = 'info'
        }

        return icon

      },

    },

    props: {
      value: {type: Boolean, required: false, default: false},
      id: {type: String, required: true, default: ''},
      cf: {type: String, required: true, default: ''},
      associations: {type: Array, required: false, default: null},
      isHomeDoctor: {type: Boolean, default: false}
    },
    watch:{
      doctorId:{
        immediate:true,
        handler(newVal, oldval){
          if(newVal){
            this.associationsErr= false;
            this.detailsErr=false;
            this.loadDoctorInfo();
          }

        }
      }
    },
    async created() {
      this.doctorId = this.id;
      this.doctorCf = this.cf;
      // this.associationsErr= false;
      // this.detailsErr=false;
       this.associationsList = this.associations;
      // this.doctorId = this.id;
      // this.doctorCf = this.cf;
      // this.loadDoctorInfo();
    },
    methods: {
      async loadDoctorInfo() {
        this.isLoadingDetails = true;
        this.isLoadingAssociations = true;
        try {
          let doctorInfoPromise = await getDoctorDetails(this.doctorCf, {_no5XXRedirect: true});
          this.doctor = doctorInfoPromise.data;
          if (this.doctor) {
            this.doctorOffices = this.doctor.ambulatori;
            delete this.doctor['ambulatori'];
            this.isUserOwnDoctor = this.doctorsInfo();
            //Nascosto tasto "scegli" se il medico non è di ASL ammessa
            //   if(this.doctor.asl)
            //     this.isAllowedAsl =  isAllowedASL(this.doctor.asl.id);
            this.availability = this.doctor.disponibilita;
            this.isDoctorSelectable();
            this.loadAssociationsList();
          }
          if (this.userInfo && this.userInfo.richiesta_cambio) {
            this.requestInProgress = true
          }
        } catch (e) {
          this.detailsErr=true;
          notifyError(e, 'Impossibile caricare i dati del medico.')
        } finally {
          this.isLoadingDetails = false;
          this.isLoadingAssociations = false;
        }

      },
      async loadAssociationsList(){
        this.isLoadingAssociations = true;
        try{
          if (!this.associationsList) {
            let associationsResponse = await getAssociationsList(this.doctorId, {_no5XXRedirect: true});
            this.associationsList = associationsResponse.data
          }
        }catch (e) {
          this.associationsErr =true;
          notifyError(e, 'Impossibile caricare le associazioni del medico.')
        }finally {
          this.isLoadingAssociations = false;
        }
      },
      doctorsInfo() {
        return this.userOwnDoctorId === this.doctorId

      },

      goBack() {
        this.$router.go(-1)
      },

      changeDoctorModal() {
        if (this.maxLimitChangeOrRevoke.isMaxLimit) {
          this.isMaxLimitDialog = true;
          return
        }

        if (this.requestInProgress) {
          this.requestInProgressAlert();
          return
        }

        if (this.isAskedUserAddress) {
          this.goToResults()
        } else {
          this.changeAddressModal = true
        }
      },
      goToResults() {
        let route = {
          name: this.$routes.CHANGE_DOCTOR.SEARCH_DOCTOR_RESULTS.name,
          params:{onlyUserAddress:true}
        };
        this.$router.push(route);
      },
      manageMonitoringModal(value) {
        this.toggleMonitoring = value;
        this.showMonitoringModal = true
      },
      revokeDoctorModal() {
        if (this.maxLimitChangeOrRevoke.isMaxLimit) {
          this.isMaxLimitDialog = true;
          return
        }
        this.isRevokeDoctor = true
      },
      revokeDoctor() {
        this.isUserOwnDoctor = false;

      },
      isDoctorConsent(value) {
        if (value) {
          this.combinationControlLoading = true;
          firstControlCombinationOptions(this.combinationControlResponse, this.choosenDoctor, this.isDoctorDerogation)
        }
      },
      requestInProgressAlert() {
        this.isRequestInProgressDialog = true
      },
      chooseDoctor() {
        if (this.maxLimitChangeOrRevoke.isMaxLimit) {
          this.isMaxLimitDialog = true;
          return
        }

        if (this.requestInProgress) {
          this.requestInProgressAlert();
          return
        }
        if (this.userAge && (this.userAge > 16 && this.isPediatrician) ||  (this.userAge < 6 && !this.isPediatrician)) {
          this.isWrongChoice = true;
          return
        }
        this.$store.dispatch('changeDoctor/setChoosenDoctor', {doctor: this.choosenDoctor});
        if (this.isAskedUserAddress) {
          this.getCombinationControl()
        } else {
          this.changeAddressModal = true
        }
      },
      async getCombinationControl() {
        this.combinationControlLoading = true;
        this.$store.dispatch('changeDoctor/resetAllRequestsOptions');

        let savecittadinanza = this.$store.getters['changeDoctor/getCitizenship'];
        let saveresidenza = this.$store.getters['changeDoctor/getNewResidence'];
        let savedomicilio = this.$store.getters['changeDoctor/getNewDomicile'];

        let cittadinanza = savecittadinanza ? savecittadinanza : this.userInfo.cittadinanza;
        let residenza = saveresidenza ? saveresidenza : this.userInfo.residenza;
        let domicilio = savedomicilio ? savedomicilio : this.userInfo.domicilio;


        let combinationParams = {
          codice_fiscale_medico: this.doctorCf,
          medico_altra_regione: this.userInfo.medico_altra_regione,
          cittadinanza: cittadinanza,
          domicilio: domicilio,
          residenza: residenza
        };
        try {
          let combinationresponse = await combinationControl(this.taxCode, combinationParams, {_no5XXRedirect: true});
          this.combinationControlResponse = combinationresponse.data;

          if (this.combinationControlResponse.ammessa) {
            if (this.combinationControlResponse)
              this.$store.dispatch('changeDoctor/setCombinationControl', {combination: this.combinationControlResponse});

            //VERIFICA SE NECESSARIO IL CONSENSO MEDICO

            let isDoctorDerogationResponse = isDoctorDerogation(this.combinationControlResponse, this.choosenDoctor.tipologia.id);
            this.isDoctorDerogation = isDoctorDerogationResponse.isDerogation;
            this.derogationType = isDoctorDerogationResponse.derogationType;


            if (this.isDoctorDerogation) {
              this.combinationControlLoading = false;
              this.doctorConsentModal = true;
            } else {
              firstControlCombinationOptions(this.combinationControlResponse, this.choosenDoctor, this.isDoctorDerogation)
            }
          } else {
            this.combinationControlLoading = false;

            //IN caso di ricusazione del medico la richiesta viene bloccata
            let params = {}

            if(this.combinationControlResponse.ricusazione){
              params = {refusal:true}
            }else{
              params = {notAllowed:true}
            }
            goToRequestNotAllowed(this.choosenDoctor, params)

          }
        } catch (e) {
          notifyError(e, 'Non è stato possibile effettuare la richiesta.');
          this.combinationControlLoading = false;
        }finally {
          this.changeAddressModal = false
        }
      },
      isDoctorSelectable() {
        if (this.availability) {
          const availability = availabilityDoctorMessage(this.availability, this.doctor.tipologia.id);
          this.selectableInfo = availability;
          this.isSelectable = availability ? availability.isSelectable : false;
          this.isMonitorable = this.availability.monitorabile
        }

      },
      doctorDetails(doctorParams) {
        let route = {
          name: this.$routes.CHANGE_DOCTOR.DOCTOR_DETAIL.name,
          params: doctorParams
        };
        this.$router.push(route);
      },
      addressCoords(item) {
        let coordinates = item.coordinate.coordinates;
        return latLng(coordinates[1], coordinates[0])
      },

      openMapModal(office) {
        this.selectedOffice = office;
        this.openFullMap = true;

      },
      closeModal() {
        //this.$refs.modal.modal.hide();
      },
      showAssociatedDoctor(doctor){
        this.doctorId = doctor.id
        this.doctorCf = doctor.codice_fiscale
        this.associationsList = null
      }


    },

  }
</script>

<style lang="stylus">
  .csi-doctor-details
    .change-doctor-home-title
      margin-top: 48px;
      margin-bottom: 16px;

    .doctor-address
      margin-left: 8px
      max-width: calc(100% - 70px);

    .modal-content
      width: 80%;
      height: 80%;

</style>
