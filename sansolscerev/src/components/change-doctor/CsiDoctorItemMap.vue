<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="csi-doctor-item q-pa-md">
    <q-card
      class="csi-focusable-card service-card"
      :class="{'active': isSelected}"
    >
      <!---BANNER --->
      <csi-bar
        :bg-color="csiBarBgColor"
      >
        <div class="row justify-start q-py-sm">
          <div class="col-1 text-center q-pt-sm">
            <q-icon :name="csiBarIcon" class="csi-icon--sm"/>
          </div>
          <div class="col-11 q-pl-sm">
            <a class="text-weight-bold text-black q-body-2"
               v-if="!readMoreActivated"
               @click="activateReadMore"
               href="#">Verifica disponibilità</a>
            <div v-if="readMoreActivated" v-on:click="readMoreActivated=false">
                <template v-if="!isDoctorMaximal">
                  Questo medico non può essere scelto. Rivolgiti all'ASL per ulteriori informazioni.
                </template>
              <template v-else>
                <template   v-if="availabilityInfo ">
                  {{selectableInfo.info}}
                </template>
                <template v-if="!availability">
                  A causa un un problema temporaneo questo medico non può essere scelto. Riprovare più tardi
                </template>
              </template>
              <span v-if="isDoctorMonitored ">
                <br>
                Su questo medico hai attivato il monitoraggio, riceverai una notifica appena il medico avrà posti disponibili.
              </span>

            </div>
          </div>
        </div>
      </csi-bar>




      <q-card-main class="no-padding">
        <q-item class="no-margin q-pb-xs q-pt-md q-px-sm ">
          <q-item-side>
            <csi-icon-base class="csi-svg-icon--lg">
              <template v-if="isPediatrician">
                <csi-icon-avatar-pediatrician :is-female="office.medico.sesso === 'F'"/>
              </template>
              <template v-else>
                <csi-icon-avatar-doctor :is-female="office.medico.sesso === 'F'"/>
              </template>
            </csi-icon-base>
          </q-item-side>
          <q-item-main>
            <q-item-tile
              class="q-subheading q-pb-xs text-weight-bold">
              {{office.medico.cognome}} {{office.medico.nome}}
            </q-item-tile>
            <q-item-tile
            > <span
              class="q-body-1 text-primary text-weight-bold q-pb-xs cursor-pointer"
              v-on:click="doctorDetails(office.medico)">
              Vedi scheda
            </span>
            </q-item-tile>
          </q-item-main>
          <q-item-side>
            <q-icon
              v-if="$q.screen.lt.lg && availabilityInfo"
              name="info"
              class="csi-icon--sm cursor-pointer"
              color="primary"
              @click.native="toggleBanner()"
            />
          </q-item-side>
        </q-item>

        <!-- Ambulatorio-->
        <q-item class="no-margin q-px-sm ">
          <q-item-side>
            <csi-icon-base class="csi-svg-icon--lg">
              <csi-icon-hospital/>
            </csi-icon-base>
          </q-item-side>
          <q-item-main>
            <q-item-tile class="q-body-2">{{office.indirizzo}} - {{office.comune}}</q-item-tile>
          </q-item-main>
        </q-item>

        <q-item class="no-margin q-pb-md q-pt-xs q-px-sm justify-end">
          <q-item-tile>
            <div class="row items-center float-right">
              <div class="col-12 col-lg-auto">
                <csi-buttons>
                  <csi-button
                    v-if="isSelectable && isDoctorMaximal"
                    primary
                    label="Scegli"
                    :loading="combinationControlLoading"
                    @click="chooseDoctorModal"
                  />
                  <template v-if="isMonitorable && isDoctorMaximal">
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
                </csi-buttons>
              </div>
            </div>

          </q-item-tile>
        </q-item>

      </q-card-main>
    </q-card>

    <!-- MODALS -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->

    <csi-confirm-address-modal
      v-model="isChangeDoctor"
      :user-info="userInfo"
      :choosen-doctor="office.medico"
      @combination-control="getCombinationControl"
    />

    <csi-doctor-consent-modal
      v-model="doctorConsentModal"
      :doctor="office.medico"
      :derogation-type="derogationType"
      @change-doctor="isDoctorConsent"
    />
    <csi-login-modal
      v-model="loginModal"
      :doctor="office.medico"
      :change-doctor="changeDoctorRequest"
    />

    <csi-doctor-wrong-type v-model="isWrongChoice"/>

    <csi-monitoring-modal
      v-model="showMonitoringModal"
      :doctor="office.medico"
      :monitoring="toggleMonitoring"
      :cf="cf"
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
          <csi-button primary color="primary" label="Ok" @click="props.ok"/>
        </csi-buttons>
      </template>
    </q-dialog>

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

    <!--  DETTAGLIO MEDICO  -->
    <template v-if="showDoctorDetail">
      <csi-doctor-details :id="office.medico.id" :cf="office.medico.codice_fiscale" :associations="null"
                          v-model="showDoctorDetail"/>
    </template>

  </div>
</template>


<script>
  import CsiCardItem from "components/global/common/CsiCardItem";
  import CsiCardItemPrimary from "components/global/common/CsiCardItemPrimary";
  import CsiIconBase from "components/global/icons/CsiIconBase";
  import CsiIconHospital from "components/global/icons/CsiIconHospital";
  import CsiIconAvatarDoctor from "components/global/icons/CsiIconAvatarDoctor";
  import format from 'date-fns/format';
  import {combinationControl} from "@services/api/change-doctor";
  import CsiMedicalOfficeItem from "components/change-doctor/CsiMedicalOfficeItem";
  import CsiConfirmAddressModal from "components/change-doctor/CsiConfirmAddressModal";
  import CsiBar from 'components/global/common/CsiBar';
  import {is4XX, notifyError} from "@services/api/utils";
  import {
    availabilityDoctorMessage,
    firstControlCombinationOptions, goToRequestNotAllowed,
    isDoctorDerogation,
  } from "@services/change-doctor/business-logic";
  import CsiDoctorConsentModal from "components/change-doctor/CsiDoctorConsentModal";
  import CsiLoginModal from "components/change-doctor/CsiLoginModal";
  import CsiIconAvatarPediatrician from "components/global/icons/CsiIconAvatarPediatrician";
  import CsiDoctorWrongType from "components/change-doctor/CsiDoctorWrongType";
  import CsiDoctorDetails from "components/change-doctor/CsiDoctorDetails";
  import CsiMonitoringModal from "components/change-doctor/CsiMonitoringModal";

  export default {
    name: 'CsiDoctorItemMap',
    components: {
      CsiMonitoringModal,
      CsiDoctorDetails,
      CsiDoctorWrongType,
      CsiIconAvatarPediatrician,
      CsiDoctorConsentModal,
      CsiConfirmAddressModal,
      CsiMedicalOfficeItem,
      CsiIconAvatarDoctor,
      CsiIconHospital,
      CsiIconBase,
      CsiCardItemPrimary,
      CsiCardItem,
      format,
      CsiBar,
      CsiLoginModal
    },
    props: {
      office: {type: Object, required: true},
      isCardResult: {type: Boolean, required: false, default: false},
      isSelected: {type: Boolean, required: false, default: false}
    },
    data() {
      return {
        showBanner: false,
        loginModal: false,
        isChangeDoctor: false,
        isSelectable: false,
        selectableInfo: {bgColor: '', info: '', extraInfo: '', iconName: ''},
        combinationControl: null,
        doctorConsentModal: false,
        isDoctorDerogation: false,
        combinationControlResponse: null,
        changeDoctorRequest: false,
        requestInProgress: false,
        isRequestInProgressDialog: false,
        readMoreActivated: false,
        isWrongChoice: false,
        derogationType: null,
        combinationControlLoading: false,
        isMaxLimitDialog: false,
        showDoctorDetail: false,
        isMonitorable: false,
        toggleMonitoring: false,
        showMonitoringModal: false,
        availability: null,
      }
    },
    computed: {
      userInfo() {
        return this.$store.getters['changeDoctor/getUserInfo']
      },
      isProduction(){
        return this.$config.global.isProduction || this.$config.global.isAlpha
      },
      maxLimitChangeOrRevoke() {
        return this.$store.getters['changeDoctor/getMaxLimitChanges']
      },
      availabilityInfo() {
        return (this.selectableInfo && this.availability)
      },
      userAge() {
        return this.$store.getters['changeDoctor/getUserAge']
      },
      cf() {
        return this.$store.getters['changeDoctor/getTaxCode']
      },
      isDelegation() {
        return this.$store.getters['changeDoctor/isDelegationActive']
      },
      isAskedUserAddress() {
        return this.$store.getters['changeDoctor/isAskedAddress']
      },
      isPediatrician() {
        let type = this.office.medico.tipologia.id;
        return (type === this.$config.changeDoctor.doctorsType.PLS)
      },
      monitoredDoctors() {
        return this.$store.getters['changeDoctor/getMonitoredDoctors']
      },
      isDoctorMonitored() {
        let doctorId = this.office.medico.id;
        if (this.monitoredDoctors) {
          let getMonitoredDoctor = this.monitoredDoctors.find(d => d.id === doctorId);
          if (getMonitoredDoctor) return true
        }
        return false
      },
      isDoctorMaximal(){
        if(!this.office.medico) return false
        return this.office.medico.massimale && this.office.medico.massimale>0
      },
      csiBarBgColor(){
        let color = 'info'
        if(!this.isDoctorMaximal)
          color = 'warning'
        else{
          if(this.availabilityInfo && (this.showBanner || this.$q.screen.gt.md))
            color= this.selectableInfo.bgColor
          if(!this.availability)
            color = 'warning'
        }

        return color
      },
      csiBarIcon(){
        let icon = 'info'
        if(!this.isDoctorMaximal)
          icon = 'info'
        else{
          if(this.availabilityInfo && (this.showBanner || this.$q.screen.gt.md))
            icon= this.selectableInfo.iconName
          if(!this.availability)
            icon = 'info'
        }

        return icon
      },
    },
    created() {
      this.availability =  this.office.medico.disponibilita;
      if ( this.availability)
        this.isDoctorSelectable();
      //Nascosto tasto "scegli" se il medico non è di ASL ammessa

      // if(this.office.medico.asl)
      //     this.isAllowedAsl = isAllowedASL(this.office.medico.asl.id);

      if (this.userInfo && this.userInfo.richiesta_cambio) {
        this.requestInProgress = true
      }
    },
    methods: {
      activateReadMore() {
        this.readMoreActivated = true
      },
      chooseDoctorModal() {
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
        this.$store.dispatch('changeDoctor/setChoosenDoctor', {doctor: this.office.medico});
        if (this.isAskedUserAddress) {
          this.getCombinationControl()
        } else {
          this.isChangeDoctor = true
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
          codice_fiscale_medico: this.office.medico.codice_fiscale,
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
            if (this.combinationControlResponse)
              this.$store.dispatch('changeDoctor/setCombinationControl', {combination: this.combinationControlResponse});

            //VERIFICA SE NECESSARIO IL CONSENSO MEDICO
            let isDoctorDerogationResponse = isDoctorDerogation(this.combinationControlResponse, this.office.medico.tipologia.id);
            this.isDoctorDerogation = isDoctorDerogationResponse.isDerogation;
            this.derogationType = isDoctorDerogationResponse.derogationType;


            if (this.isDoctorDerogation) {
              this.combinationControlLoading = false;
              this.doctorConsentModal = true;
            } else {
              firstControlCombinationOptions(this.combinationControlResponse, this.office.medico, this.isDoctorDerogation)
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
            goToRequestNotAllowed(this.office.medico, params)

          }
        } catch (e) {
          notifyError(e, 'Non è stato possibile effettuare la richiesta.');
          this.combinationControlLoading = false;
        }finally {
          this.isChangeDoctor=false
        }
      },

      isDoctorConsent(value) {
        if (value) {
          this.combinationControlLoading = true;
          firstControlCombinationOptions(this.combinationControlResponse, this.office.medico, this.isDoctorDerogation)
        }
      },
      doctorDetails() {
        // let route = {
        //   name: this.$routes.CHANGE_DOCTOR.DOCTOR_DETAIL.name,
        //   params: {id: id, codice_fiscale: cf}
        // };
        // this.$router.push(route);
        this.showDoctorDetail = true
      },
      isDoctorSelectable() {
        const availability = availabilityDoctorMessage(this.availability, this.office.medico.tipologia.id);
        this.selectableInfo = availability;
        this.isSelectable = availability ? availability.isSelectable : false;
        this.isMonitorable = this.availability ? this.availability.monitorabile : false
      },
      requestInProgressAlert() {
        this.isRequestInProgressDialog = true
      },
      toggleBanner() {
        this.showBanner = !this.showBanner;
      },
      manageMonitoringModal(value) {

        this.toggleMonitoring = value;
        this.showMonitoringModal = true
      },
    }
  }
</script>


<style lang="stylus">
  @require '~variables'

  .csi-doctor-item

    .q-collapsible-toggle-icon
      color: $primary

    .q-collapsible-sub-item
      padding-left: 0px;

    .csi-ambulatori
      padding: 24px 0

    .csi-day-of-week
      width: 60px;

    /*float: left;*/

    .note-info-icon
      color: #acacac;

    .csi-doc-address-item
      border-bottom: 1px solid #e0e0e0;

    .csi-address-list
      padding: 0px 24px 8px 24px;

    .show-more-icon
      transition transform .3s ease

      &--active
        transform rotateZ(180deg)

  .csi-focusable-card
    margin: 2px
    cursor: pointer

  .csi-focusable-card:hover
    margin: 0px
    border: 2px solid rgba($csi-active-card, 0.6)
    box-shadow: 0px 0px 5px rgba($csi-active-card, 0.5)
    -webkit-box-shadow: 0px 0px 5px rgba($csi-active-card, 0.5)
    -moz-box-shadow: 0px 0px 5px rgba($csi-active-card, 0.5)

  .csi-focusable-card.active
    margin: 0px
    border: 2px solid $csi-active-card
    box-shadow: 0px 0px 10px $csi-active-card
    -webkit-box-shadow: 0px 0px 10px $csi-active-card
    -moz-box-shadow: 0px 0px 10px $csi-active-card

</style>
