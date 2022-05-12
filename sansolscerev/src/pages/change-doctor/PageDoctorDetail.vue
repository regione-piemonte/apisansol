<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
    <q-page padding>
      <csi-page-title @back="goBack" title="Scheda medico" class="q-mb-md"></csi-page-title>
      <template v-if="doctor && !isLoading">

     <!------- CARD MEDICO ------------>
     <!-- ----------------------------------------------------------------------------------------------------- -->
        <q-card class="csi-doctor-detail-card">
          <!---BANNER --->
          <csi-bar
            v-if="doctor.disponibilita && !isHomeDoctor && selectableInfo"
            :bg-color="selectableInfo.bgColor"
          >
            <div class="row flex items-center justify-start q-py-sm" >
              <div class="col-1 text-center">
                <q-icon :name="selectableInfo.iconName" class="csi-icon--sm q-pr-sm"/>
              </div>
              <div class="col-11">{{selectableInfo.info}}</div>
            </div>

          </csi-bar>
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
                        <csi-icon-avatar-doctor :is-female="doctor.sesso === 'F'" />
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
                      {{doctor.data_nascita | format }} <span v-if="doctor.specializzazioni">-</span> {{doctor.specializzazioni}}
                    </q-item-tile>
                    <q-item-tile class="q-body-1 text-weight-bold text-primary">
                      {{doctor.mail}}
                    </q-item-tile>
                  </q-item-main>
                </q-item>

                <!-- AZIONI -->
                <!-- --------------------------------------------------------------------------------------------------------- -->
                <slot  name="actions">
                  <div class="row items-center float-right q-pa-md" >
                    <div class="col-12 col-md-auto">
                      <csi-buttons>
                        <template v-if="isHomeDoctor">
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
                          <csi-button
                            v-if="isSelectable"
                            primary
                            :loading="combinationControlLoading"
                            label="Scegli"
                            @click="chooseDoctor"
                          />

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
         <template v-if="doctorOffices.length>0" >
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
                           <csi-icon-hospital />
                         </csi-icon-base>
                         <div class="q-body-2 doctor-address q-pa-xs">
                           <div>
                             {{ambulatorio.indirizzo}} - {{ambulatorio.comune}}
                           </div>


                           <div class="cursor-pointer q-py-xs" @click="openMapModal(ambulatorio)"  v-if="$q.screen.lt.sm">
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
          <template v-if="associations.length>0">

          <div class="row change-doctor-home-title">
            <h1 class="csi-h1">I medici associati</h1>
          </div>

          <q-card>
            <q-card-main class="no-padding">
                <csi-doctor-association-list
                  :associations="associations"
                  :doctor_id="doctor.id"
                  />

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
          :cf="cf"
        />


        <csi-monitoring-modal
          v-model="isManageMonitoring"
          :doctor="doctor"
          :toggleMonitoring="toggleMonitoring"
          :cf="cf"
          @manage-monitoring="manageMonitoring"
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
              <csi-button primary color="primary" label="Ok" @click="props.ok" />
            </csi-buttons>
          </template>
        </q-dialog>

        <csi-doctor-wrong-type v-model="isWrongChoice" />

     </template>
        <!--      LOADER-->
      <csi-inner-loading :visible="isLoading" />
    </q-page>


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
  import CsiDoctorAssociationList from "components/change-doctor/CsiDoctorAssociationList";
  import CsiConfirmAddressModal from "components/change-doctor/CsiConfirmAddressModal";
  import {is4XX, notifyError} from "@services/api/utils";
  import {
    availabilityDoctorMessage,
    firstControlCombinationOptions,  getStandardAddress, goToRequestNotAllowed,
    isDoctorDerogation,
  } from "@services/change-doctor/business-logic";
  import CsiDoctorConsentModal from "components/change-doctor/CsiDoctorConsentModal";
  import CsiLoginModal from "components/change-doctor/CsiLoginModal";
  import CsiOfficeMap from "components/change-doctor/CsiOfficeMap";
  import {latLng} from "leaflet";
  import { Icon } from 'leaflet';
  import 'leaflet/dist/leaflet.css';
  import {LMap, LTileLayer, LMarker } from "vue2-leaflet";
  import CsiMarkerIcon from "src/statics/icons/svgs/marker-icon.svg";
  import CsiIconAvatarPediatrician from "components/global/icons/CsiIconAvatarPediatrician";
  import CsiDoctorWrongType from "components/change-doctor/CsiDoctorWrongType";

  // delete L.Icon.Default.prototype._getIconUrl;
  //
  // L.Icon.Default.mergeOptions({
  //   iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  //   iconUrl: require('leaflet/dist/images/marker-icon.png'),
  //   shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  // });

export default {
    name: 'PageDoctorDetail',
    components:{
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
      CsiDoctorAssociationList,
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
        doctor : null,
        doctorOffices:null,
        associations:null,
        // availability: null,
        isLoading : false,
        loginModal:false,
        hideModal: false,
        isManageMonitoring:false,
        isWrongChoice:false,
        doctorId:null,
        doctorCf:null,
        toggleMonitoring: '',
        isRevokeDoctor: false,
        isSelectable: false,
        changeAddressModal:false,
        selectableInfo: {bgColor: '', info: '', extraInfo:'', iconName:''},
        combinationControlResponse:null,
        doctorConsentModal:false,
        isDoctorDerogation:false,
        derogationType:null,
        changeDoctorRequest:false,
        isUserOwnDoctor:false,
        requestInProgress:false,
        isRequestInProgressDialog:false,
        openFullMap:false,
        selectedOffice:null,
        mapAttribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        combinationControlLoading:false,
        isHomeDoctor: false,
        markerIcon:
          L.icon({
            iconUrl:CsiMarkerIcon,
            iconSize:    [25, 41],
            iconAnchor:  [12, 41],
            popupAnchor: [1, -34],
          }),
      }
    },
  computed: {
      userInfo(){
        return this.$store.getters['changeDoctor/getUserInfo']
      },
      cf(){
        return this.$store.getters['changeDoctor/getTaxCode']
      },
      userAge(){
        return this.$store.getters['changeDoctor/getUserAge']
      },

      isDelegation(){
        return this.$store.getters['changeDoctor/isDelegationActive']
      },
      userOwnDoctorId(){
        return this.$store.getters['changeDoctor/getUserDoctor']
      },
      isAskedUserAddress(){
        return this.$store.getters['changeDoctor/isAskedAddress']
      },
      monitoredDoctors(){
          return this.$store.getters['changeDoctor/getMonitoredDoctors'];
      },
      isDoctorMonitored(){
        if(this.doctorId){
          let monitoredDoctors =  this.monitoredDoctors;
          let getMonitoredDoctor = monitoredDoctors.find(d => d.id === this.doctorId);
          if(getMonitoredDoctor) {
            return true;
          }
        }
        return false;
     },
      isAskedAddress(){
        return this.$store.getters['changeDoctor/isAskedAddress']
      },
      choosenDoctor() {
        if (this.isHomeDoctor) {
          return null
        } else
          return this.doctor
      },
    isPediatrician(){
      let type = this.doctor.tipologia.id;
      return (type === this.$config.changeDoctor.doctorsType.PLS)
    },
    isProduction(){
      return this.$config.global.isProduction || this.$config.global.isAlpha
    },
      },
  watch: {
    $route(to, from) {
      this.isLoading = true;
      this.doctorId = this.$route.params.id;
      this.doctorCf = this.$route.params.codice_fiscale;
      this.loadDoctorInfo();
    }
  },
  async created(){
    this.isLoading = true;
    let {id, codice_fiscale, associations, isHomeDoctor} = this.$route.params;
    this.doctorId = id;
    this.doctorCf = codice_fiscale;
    this.isHomeDoctor = isHomeDoctor;
    // this.availability  = availability;
    this.associations = associations;
    this.loadDoctorInfo();
  },

  methods:{
    async loadDoctorInfo(){
      try {
        let doctorInfoPromise = await getDoctorDetails(this.doctorCf, {_no5XXRedirect: true});
        this.doctor = doctorInfoPromise.data;
        if (this.doctor)  {
          this.doctorOffices = this.doctor.ambulatori;
          delete this.doctor['ambulatori'];
          this.isUserOwnDoctor  = this.doctorsInfo();
          // if(!this.availability && !this.isUserOwnDoctor){
          //   let availabilityResponse = await doctorsAvailability([this.doctor], {_no5XXRedirect: true});
          //   this.availability = availabilityResponse.data[0]
          // }

          this.isDoctorSelectable();
          if(!this.associations){
            let associationsResponse = await getAssociationsList(this.doctorId, {_no5XXRedirect: true});
            this.associations = associationsResponse.data
          }

        }
        if(this.userInfo && this.userInfo.richiesta_cambio){
         this.requestInProgress = true
        }
      }catch (e) {
        notifyError(e, 'Impossibile caricare i dati del medico.')
      }finally {
        this.isLoading = false;
      }
    },

    doctorsInfo(){
      return this.userOwnDoctorId === this.doctorId

    },

    goBack(){
      this.$router.go(-1)
    },

    changeDoctorModal() {

      if(this.requestInProgress){
        this.requestInProgressAlert();
        return
      }

      if(this.isAskedUserAddress){
        this.goToResults()
      }else{
        this.changeAddressModal = true
      }
    },
    goToResults(){
      let route= {
        name: this.$routes.CHANGE_DOCTOR.SEARCH_DOCTOR_RESULTS.name,
        params:{onlyUserAddress:true}

      };
      this.$router.push(route);
    },
    manageMonitoringModal(){
      if(this.isDoctorMonitored){
        this.toggleMonitoring = this.$config.changeDoctor.manageMonitoring.DELETE
      }else{
        this.toggleMonitoring = this.$config.changeDoctor.manageMonitoring.ADD
      }
      this.isManageMonitoring = true
    },

    manageMonitoring(isMonitored){
      this.toggleMonitoring = '';
        if(isMonitored){
          this.isDoctorMonitored = true;
        }else{
          this.isDoctorMonitored = false;
        }
      this.updateMonitoringList()
    },
    updateMonitoringList(){
      let newMonitoredDoctors = null;
      let oldMonitoredDoctors = this.monitoredDoctors;
      if(this.isDoctorMonitored){
        newMonitoredDoctors = oldMonitoredDoctors.push(this.doctor)
      }else{
        newMonitoredDoctors = oldMonitoredDoctors.filter(d => d.id !== this.doctor.id)
      }
      this.$store.dispatch('changeDoctor/setMonitoredDoctors', {cf: this.cf, info: newMonitoredDoctors})

    },
     revokeDoctorModal(){
     this.isRevokeDoctor = true
    },
    revokeDoctor(){
      this.isUserOwnDoctor = false;
      this.isHomeDoctor = false
    },
    isDoctorConsent(value){
      if(value){
        this.combinationControlLoading =true;
        firstControlCombinationOptions(this.combinationControlResponse, this.choosenDoctor, this.isDoctorDerogation)
      }
    },
    requestInProgressAlert(){
      this.isRequestInProgressDialog = true
    },
    chooseDoctor(){
      if(this.requestInProgress){
        this.requestInProgressAlert();
        return
      }
      if(this.userAge && (this.userAge>16 && this.isPediatrician) ||  (this.userAge < 6 && !this.isPediatrician)){
        this.isWrongChoice =true;
        return
      }

      this.$store.dispatch('changeDoctor/setChoosenDoctor', {doctor: this.choosenDoctor});

        if(this.isAskedUserAddress){
          this.getCombinationControl()
        }else{
          this.changeAddressModal = true
        }



    },
    async getCombinationControl() {
      this.combinationControlLoading =true;
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
        residenza: residenza,
        rinnovo_assistenza:false
      };
      try {
        let combinationresponse = await combinationControl(this.cf, combinationParams, {_no5XXRedirect: true});
        this.combinationControlResponse = combinationresponse.data;

        if (this.combinationControlResponse.ammessa) {
          if(this.combinationControlResponse)
            this.$store.dispatch('changeDoctor/setCombinationControl', {combination: this.combinationControlResponse});

          //VERIFICA SE NECESSARIO IL CONSENSO MEDICO

          let isDoctorDerogationResponse = isDoctorDerogation(this.combinationControlResponse, this.choosenDoctor.tipologia.id);
          this.isDoctorDerogation = isDoctorDerogationResponse.isDerogation;
          this.derogationType = isDoctorDerogationResponse.derogationType;


          if (this.isDoctorDerogation) {
            this.combinationControlLoading =false;
            this.doctorConsentModal = true;
          } else {
           firstControlCombinationOptions(this.combinationControlResponse, this.choosenDoctor, this.isDoctorDerogation)
          }
        }else{
          this.combinationControlLoading =false;
          goToRequestNotAllowed(this.choosenDoctor, {notAllowed:true})
        }
      } catch (e) {
        notifyError(e, 'Non è stato possibile effettuare la richiesta.');
        this.combinationControlLoading =false;
      }finally {
        this.changeAddressModal=false
      }
    },
    isDoctorSelectable() {
      if(this.doctor.disponibilita){
        const availability = availabilityDoctorMessage(this.doctor.disponibilita,this.doctor.tipologia.id);
        this.selectableInfo = availability;
        this.isSelectable = availability ?  availability.isSelectable : false
      }

    },
    doctorDetails(doctorParams){
      let route = {
        name: this.$routes.CHANGE_DOCTOR.DOCTOR_DETAIL.name,
        params: doctorParams
      };
      this.$router.push(route);
    },
    addressCoords(item){
      let coordinates = item.coordinate.coordinates;
      return latLng(coordinates[1], coordinates[0])
    },

    openMapModal(office){
      this.selectedOffice = office;
      this.openFullMap = true;

    },

  },



}
</script>
<style scoped lang="stylus">


  .change-doctor-home-title
    margin-top: 48px;
    margin-bottom: 16px;

  .doctor-address
    margin-left : 8px
    max-width: calc(100% - 70px);

</style>
