<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="csi-doctor-item">
    <q-card v-if="doctor">
      <template v-if="!homeCard">
        <!---BANNER --->
        <csi-bar :bg-color="csiBarBgColor">
          <div class="row flex items-center justify-start q-py-sm">
            <div class="col-1 text-center">
              <q-icon :name="csiBarIcon"
                      class="csi-icon--sm q-pr-sm"/>
            </div>
            <div class="col-11">
              <div v-if="!isDoctorMaximal">Questo medico non può essere scelto. Rivolgiti all'ASL per ulteriori
                informazioni.
              </div>
              <template v-else>
                <div v-if="selectableInfo && availability">{{ selectableInfo.info }}</div>
                <div v-if="!availability">A causa un un problema temporaneo questo medico non può essere scelto.
                  Riprovare più tardi
                </div>
              </template>

              <div v-if="isDoctorMonitored">Su questo medico hai attivato il monitoraggio, riceverai una notifica appena
                il medico avrà posti disponibili.
              </div>
            </div>

          </div>

        </csi-bar>


      </template>
      <q-card-main class="no-padding">
        <csi-card-item>

          <!-- PRIMARY -->
          <!-- ----------------------------------------------------------------------------------------------------- -->
          <template slot="primary">
            <csi-card-item-primary :class="classPrimary" class="q-px-md">

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
                <div :class="{'q-pb-md' : !isPediatrician}" class="q-subheading  text-weight-bold">
                  {{ doctor.cognome }} {{ doctor.nome }}
                </div>
                <div class="q-caption q-pb-md"><strong> {{ doctor.tipologia.descrizione }}</strong></div>
                <!--                  <div-->
                <!--                    :class="{'q-pb-md': !homeCard}"-->
                <!--                    class="q-body-1 text-primary text-weight-bold q-pb-xs cursor-pointer"-->
                <!--                   v-on:click="doctorDetails({id:doctor.id, codice_fiscale: doctor.codice_fiscale, isHomeDoctor: homeCard})">-->
                <!--                    Vedi scheda-->
                <!--                  </div>-->
                <div
                  :class="{'q-pb-md': !homeCard}"
                  class="q-body-1 text-primary text-weight-bold q-pb-xs cursor-pointer"
                  v-on:click="doctorDetails()">
                  Vedi scheda
                </div>
                <div
                  v-show="homeCard"
                  class="q-body-1 text-primary text-weight-bold cursor-pointer"
                  v-on:click="getMedicalCard"
                >
                  Stampa tesserino
                </div>
              </template>
            </csi-card-item-primary>
          </template>

          <!-- SECONDARY -->
          <!-- ----------------------------------------------------------------------------------------------------- -->
          <template slot="secondary">
            <!-- Ambulatori-->
            <q-item class="q-pb-none">
              <q-item-side>
                <csi-icon-base class="csi-svg-icon--lg">
                  <csi-icon-hospital/>
                </csi-icon-base>
              </q-item-side>
              <q-item-main>
                <q-item-tile class="text-weight-bold">Ambulatori</q-item-tile>
              </q-item-main>
            </q-item>
            <template v-if="doctorOffices && doctorOffices.length>0">
              <q-list class="csi-address-list" no-border>
                <q-item
                  v-for="ambulatorio in doctorOffices"
                  :key="ambulatorio.id"
                  class="q-px-none csi-doc-address-item"
                >
                  <q-item-main class="q-px-none">
                    <q-collapsible
                      :label="officeAddress(ambulatorio)"
                      collapse-icon="keyboard_arrow_down"
                      header-class="q-body-2 no-padding text-left"
                    >
                      <csi-medical-office-item :ambulatorio="ambulatorio"/>

                    </q-collapsible>
                  </q-item-main>

                </q-item>
              </q-list>
            </template>
            <template v-else>
              <div class="q-body-1 q-pa-lg">Nessuna informazione disponibile.</div>
            </template>
            <!-- Medici Associati-->
            <template v-if="homeCard && associations">
              <q-item class="q-pr-lg cursor-pointer q-py-md" @click.native="toggleShowMore">
                <q-item-side>
                  <csi-icon-base class="csi-svg-icon--lg">
                    <csi-icon-associated-doctors/>
                  </csi-icon-base>
                </q-item-side>
                <q-item-main>
                  <q-item-tile class="text-weight-bold">Medici associati</q-item-tile>
                </q-item-main>
                <q-item-side
                  v-show="associations && associations.length>0"
                  class="text-primary text-weight-bold cursor-pointer text-right">
                  <q-icon
                    :class="{'show-more-icon--active': isShowingMore}"
                    class="csi-icon--sm show-more-icon"
                    name="keyboard_arrow_down"
                  />
                </q-item-side>
              </q-item>
              <template v-if="associations && associations.length>0">
                <q-slide-transition>
                  <template v-if="isShowingMore">
                    <csi-doctor-association-list
                      :associations="associations"
                      :doctor_id="doctor.id"
                      @show-associated-doctor-details="showAssociatedDoctor"
                    />
                  </template>
                </q-slide-transition>
              </template>
              <template v-else>
                <div class="q-body-1 q-pa-lg">Questo medico non appartiene a nessuna associazione.</div>
              </template>
            </template>


            <!-- AZIONI -->
            <!-- --------------------------------------------------------------------------------------------------------- -->
            <slot name="actions">
              <div class="row items-center justify-end self-end q-pa-md q-mt-sm">
                <!--                    <div class="row items-center justify-start" :class="{'reverse': this.$q.screen.gt.sm}">-->
                <div class="col-12 col-md-auto">
                  <csi-buttons>
                    <template v-if="homeCard">
                      <csi-button
                        label="Cambia medico"
                        primary
                        @click="changeDoctorModal"
                      />
                      <csi-button
                        color="negative"
                        label="Revoca medico"
                        secondary
                        @click="showRevokeDoctorModal"
                      />
                    </template>
                    <template v-if="!homeCard && isDoctorMaximal">
                      <csi-button
                        v-if="isSelectable"
                        :loading="combinationControlLoading"
                        label="Scegli"
                        primary
                        @click="chooseDoctorModal"
                      />
                      <template v-if="isMonitorable">
                        <csi-button
                          v-if="isDoctorMonitored"
                          color="negative"
                          label="Annulla monitoraggio" secondary
                          @click="manageMonitoringModal(false)"
                        />
                        <csi-button
                          v-else
                          label="Monitora"
                          secondary
                          @click="manageMonitoringModal(true)"
                        />
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


    <!-- MODALS -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <csi-revoke-doctor-modal
      v-model="isRevokeDoctor"
      :cf="cf"
      :doctor="doctor"
    />

    <csi-confirm-address-modal
      v-model="isChangeDoctor"
      :choosen-doctor="choosenDoctor"
      :user-info="userInfo"
      @go-to-results="goToResults"
      @combination-control="getCombinationControl"
    />

    <csi-doctor-consent-modal
      v-model="doctorConsentModal"
      :derogation-type="derogationType"
      :doctor="choosenDoctor"
      @change-doctor="isDoctorConsent"
    />

    <csi-monitoring-modal
      v-model="showMonitoringModal"
      :cf="cf"
      :doctor="choosenDoctor"
      :monitoring="toggleMonitoring"
    />

    <csi-login-modal
      v-model="loginModal"
      :change-doctor="changeDoctorRequest"
      :doctor="choosenDoctor"
    />

    <csi-doctor-wrong-type v-model="isWrongChoice"/>

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
          <csi-button color="primary" label="Ok" primary @click="props.ok"/>
        </csi-buttons>
      </template>
    </q-dialog>
    <!-- DIALOG DI limite massimo di richieste-->
    <q-dialog
      v-model="isMaxLimitDialog"
    >
      <div slot="title" class="q-title">Limite massimo di operazioni</div>
      <div slot="message">
        <span>Hai recentemente effettuato un'operazione di scelta o revoca del medico. Potrai effettuarne una nuova dal {{
            maxLimitChangeOrRevoke.newAllowedDate | format
          }}.</span>

      </div>

      <template slot="buttons" slot-scope="props">
        <csi-buttons>
          <csi-button color="primary" label="Ok" primary @click="props.ok"/>
        </csi-buttons>
      </template>
    </q-dialog>

    <!--  DETTAGLIO MEDICO  -->
    <template v-if="showDoctorDetail">
      <csi-doctor-details :id="selectedDoctorDetails.id" v-model="showDoctorDetail"
                          :associations="selectedDoctorDetails.associazioni"
                          :cf="selectedDoctorDetails.codice_fiscale" :is-home-doctor="homeCard"
      />
    </template>


  </div>

</template>


<script>
import CsiCardItem from "components/global/common/CsiCardItem";
import CsiCardItemPrimary from "components/global/common/CsiCardItemPrimary";
import CsiIconBase from "components/global/icons/CsiIconBase";
import CsiIconHospital from "components/global/icons/CsiIconHospital";
import CsiIconAvatarDoctor from "components/global/icons/CsiIconAvatarDoctor";
import CsiIconAssociatedDoctors from "components/global/icons/CsiIconAssociatedDoctors";
import format from 'date-fns/format';
import {dayWeek} from '@filters/strings'
import {
  combinationControl,
  getDoctorDetails,
  getMedicalCardPdf,
  getMonitoredDoctors,
  getRevokeCertificatePdf, newChangeDoctorRequest, postMonitoredDoctor
} from "@services/api/change-doctor";
import CsiRevokeDoctorModal from "components/change-doctor/CsiRevokeDoctorModal"
import CsiMedicalOfficeItem from "components/change-doctor/CsiMedicalOfficeItem";
import CsiDoctorAssociationList from "components/change-doctor/CsiDoctorAssociationList";
import CsiConfirmAddressModal from "components/change-doctor/CsiConfirmAddressModal";
import {config} from "plugins/config";
import CsiBar from 'components/global/common/CsiBar';
import {is4XX, notifyError} from "@services/api/utils";
import {
  availabilityDoctorMessage,
  changeDoctorParams,
  combinationControlOptions, firstControlCombinationOptions, getStandardAddress,
  goToAdditionalInformation, goToAttachments, goToConfirmRequest,
  goToRenewAssistance, goToRequestNotAllowed,
  isDoctorAnotherRegion,
  isDoctorDerogation,
  isDoctorOnlyFamilyReunion,
  isTemporaryAssistance
} from "@services/change-doctor/business-logic";
import CsiDoctorConsentModal from "components/change-doctor/CsiDoctorConsentModal";
import {DOCUMENTATION_REQUIRED} from "@router/routes/change-doctor";
import CsiLoginModal from "components/change-doctor/CsiLoginModal";
import CsiMonitoringModal from "components/change-doctor/CsiMonitoringModal";
import {routes} from "plugins/routes";
import router from "@router/index";
import CsiIconAvatarPediatrician from "components/global/icons/CsiIconAvatarPediatrician";
import CsiDoctorWrongType from "components/change-doctor/CsiDoctorWrongType";
import CsiDoctorDetails from "components/change-doctor/CsiDoctorDetails";


export default {
  name: 'CsiDoctorItem',
  components: {
    CsiDoctorDetails,
    CsiDoctorWrongType,
    CsiIconAvatarPediatrician,
    CsiLoginModal,
    CsiDoctorConsentModal,
    CsiConfirmAddressModal,
    CsiDoctorAssociationList,
    CsiMedicalOfficeItem,
    CsiIconAvatarDoctor,
    CsiIconHospital,
    CsiIconAssociatedDoctors,
    CsiIconBase,
    CsiCardItemPrimary,
    CsiCardItem,
    format,
    CsiRevokeDoctorModal,
    CsiBar,
    CsiMonitoringModal
  },
  props: {
    doctor: {type: Object, required: true},
    cf: {type: String, required: true, default: ''},
    associations: {type: Array, required: false, default: null},
    homeCard: {type: Boolean, default: false}
  },
  data() {
    return {
      availability: null,
      isShowingMore: false,
      loginModal: false,
      currentMonth: null,
      doctorOffices: null,
      isRevokeDoctor: false,
      isChangeDoctor: false,
      isSelectable: false,
      isMonitorable: false,
      selectableInfo: {bgColor: '', info: '', extraInfo: '', iconName: ''},
      combinationControl: null,
      doctorConsentModal: false,
      isDoctorDerogation: false,
      derogationType: null,
      combinationControlResponse: null,
      toggleMonitoring: '',
      showMonitoringModal: false,
      changeDoctorRequest: false,
      requestInProgress: false,
      isRequestInProgressDialog: false,
      combinationControlLoading: false,
      isWrongChoice: false,
      isMaxLimitDialog: false,
      showDoctorDetail: false,
      selectedDoctorDetails: false
    }
  },

  computed: {
    userInfo() {
      return this.$store.getters['changeDoctor/getUserInfo']
    },
    maxLimitChangeOrRevoke() {
      return this.$store.getters['changeDoctor/getMaxLimitChanges']
    },
    isProduction() {
      return this.$config.global.isProduction || this.$config.global.isAlpha
    },
    userAge() {
      return this.$store.getters['changeDoctor/getUserAge']
    },
    isDelegation() {
      return this.$store.getters['changeDoctor/isDelegationActive']
    },
    isDoctorMonitored() {
      if (this.monitoredDoctors) {
        let getMonitoredDoctor = this.monitoredDoctors.find(d => d.id === this.doctor.id);
        if (getMonitoredDoctor) return true
      }
      return false
    },
    monitoredDoctors() {
      return this.$store.getters['changeDoctor/getMonitoredDoctors']
    },
    isAskedUserAddress() {
      return this.$store.getters['changeDoctor/isAskedAddress']
    },
    userOwnDoctorId() {
      return this.$store.getters['changeDoctor/getUserDoctor']
    },
    isOwnDoctor() {
      return this.userOwnDoctorId === this.doctor.id
    },
    choosenDoctor() {
      if (this.homeCard) {
        return null
      } else
        return this.doctor
    },
    classPrimary() {
      return {
        'q-py-md': !this.homeCard,
        'q-py-xl': this.homeCard
      }
    },
    isPediatrician() {
      let type = this.doctor.tipologia.id;
      return (type === this.$config.changeDoctor.doctorsType.PLS)
    },
    isDoctorMaximal() {
      if (!this.doctor) return false
      return this.doctor.massimale && this.doctor.massimale > 0
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
  created() {
    this.availability = this.doctor.disponibilita;
    if (this.availability)
      this.isDoctorSelectable();
    //Nascosto tasto "scegli" se il medico non è di ASL ammessa
    //    if(this.doctor.asl)
    //      this.isAllowedAsl =  isAllowedASL(this.doctor.asl.id);


    this.currentMonth = new Date().toISOString();
    if (this.userInfo && this.userInfo.richiesta_cambio) {
      this.requestInProgress = true
    }
    this.doctorOffices = this.doctor.ambulatori;
    delete this.doctor['ambulatori']

  },
  methods: {
    manageMonitoringModal(value) {
      // if (!this.isUserLogged) {
      //   this.changeDoctorRequest = false;
      //   this.loginModal = true;
      //   return
      // }
      this.toggleMonitoring = value;
      this.showMonitoringModal = true
    },

    toggleShowMore() {
      this.isShowingMore = !this.isShowingMore
    },
    associatedDoctors(medici) {
      let filtereddoctors = medici.filter(m => m.id !== this.doctor.id);
      return filtereddoctors;
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
        this.isChangeDoctor = true
      }
    },
    goToResults() {

      let route = {
        name: this.$routes.CHANGE_DOCTOR.SEARCH_DOCTOR_RESULTS.name,
        params:{onlyUserAddress:true}
      };
      this.$router.push(route);
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
      if (this.userAge && (this.userAge > 16 && this.isPediatrician) || (this.userAge < 6 && !this.isPediatrician)) {
        this.isWrongChoice = true;
        return
      }
      this.$store.dispatch('changeDoctor/setChoosenDoctor', {doctor: this.choosenDoctor});
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

      // if(!isAura()){
      //   cittadinanza = this.$store.getters['changeDoctor/getCitizenship'];
      //   residenza = this.$store.getters['changeDoctor/getNewResidence'];
      //   domicilio = this.$store.getters['changeDoctor/getNewDomicile']
      // }

      let combinationParams = {
        codice_fiscale_medico: this.choosenDoctor.codice_fiscale,
        medico_altra_regione: this.userInfo.medico_altra_regione,
        cittadinanza: cittadinanza,
        domicilio: domicilio,
        residenza: residenza,
        rinnovo_assistenza: false
      };
      try {
        let combinationresponse = await combinationControl(this.cf, combinationParams, {_no5XXRedirect: true});
        this.combinationControlResponse = combinationresponse.data;

        if (this.combinationControlResponse.ammessa) {
          if (this.combinationControlResponse)
            this.$store.dispatch('changeDoctor/setCombinationControl', {combination: this.combinationControlResponse});

          //VERIFICA SE NECESSARIO IL CONSENSO MEDICO
          let isDoctorDerogationResponse = isDoctorDerogation(this.combinationControlResponse, this.choosenDoctor.tipologia.id);
          this.isDoctorDerogation = isDoctorDerogationResponse.isDerogation;
          this.derogationType = isDoctorDerogationResponse.derogationType;

          if (this.isDoctorDerogation) {
            this.doctorConsentModal = true;
            this.combinationControlLoading = false
          } else {
            firstControlCombinationOptions(this.combinationControlResponse, this.choosenDoctor, this.isDoctorDerogation)
          }
        } else {
          this.combinationControlLoading = false;

          //IN caso di ricusazione del medico la richiesta viene bloccata
          let params = {}

          if (this.combinationControlResponse.ricusazione) {
            params = {refusal: true}
          } else {
            params = {notAllowed: true}
          }
          goToRequestNotAllowed(this.choosenDoctor, params)

        }
      } catch (e) {
        notifyError(e, 'Non è stato possibile effettuare la richiesta.');
        this.combinationControlLoading = false;
      } finally {
        this.isChangeDoctor = false
      }
    },

    showRevokeDoctorModal() {
      if (this.maxLimitChangeOrRevoke.isMaxLimit) {
        this.isMaxLimitDialog = true;
        return
      }
      this.isRevokeDoctor = true
    },
    revokeDoctor() {
      this.$emit('revoke-doctor');
    },
    revokeAssistance() {
      this.$emit('revoke-assistance');
    },
    isDoctorConsent(value) {
      if (value) {
        this.combinationControlLoading = true;
        firstControlCombinationOptions(this.combinationControlResponse, this.choosenDoctor, this.isDoctorDerogation)
      }
    },
    async getMedicalCard() {
      try {
        let pdfPromise = await getMedicalCardPdf(this.cf, {_no5XXRedirect: true})
      } catch (e) {
        notifyError(e, "Non è stato pissibile stampare il tesserino medico")
      }


    },
    doctorDetails() {
      this.selectedDoctorDetails = this.doctor
      this.selectedDoctorDetails.associazioni = this.associations

      console.log('this.mydoctor', this.selectedDoctorDetails)
      this.showDoctorDetail = true
      // {id:doctor.id, codice_fiscale: doctor.codice_fiscale, isHomeDoctor: homeCard}
      // let route = {
      //   name: this.$routes.CHANGE_DOCTOR.DOCTOR_DETAIL.name,
      //   params: info
      // };
      // this.$router.push(route);
    },
    isDoctorSelectable() {
      const availability = availabilityDoctorMessage(this.availability, this.doctor.tipologia.id);
      this.selectableInfo = availability;
      this.isSelectable = availability ? availability.isSelectable : false;
      this.isMonitorable = this.availability ? this.availability.monitorabile : false
    },
    requestInProgressAlert() {
      this.isRequestInProgressDialog = true
    },
    officeAddress(item) {
      return `${item.indirizzo}, ${item.comune}`
    },
    showAssociatedDoctor(doctor) {
      this.selectedDoctorDetails = doctor
      console.log('this.selectedDoctorDetails', this.selectedDoctorDetails)
      this.showDoctorDetail = true
    }
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

</style>
