<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div>
    <template v-if="!isConsentSupply">
      <div class="q-mb-lg"  v-if="isPiedmontUser">
        <csi-enrollment-card
          :can-open="canOpenFse"
          @click-activate="onActivate"
        />
      </div>

    </template>
    <template  v-else>
      <q-card class="q-mb-lg" v-if="fseConsentInfo">
        <q-card-main>
          <q-list no-border>
            <q-item class="q-body-1">
              <q-item-side>
                <q-toggle @input="onInputConsent(consentTypes.SUPPLY, $event)" v-model="newConsentsList.consenso_alimentazione" />
              </q-item-side>
              <q-item-main>
                <q-item-tile >Consenti l'alimentazione dei tuoi documenti sanitari</q-item-tile>
                <q-item-tile v-if="$q.screen.lt.md"> <a class="csi-link cursor-pointer">Informativa sulla privacy</a></q-item-tile>
              </q-item-main>
              <q-item-side v-if="$q.screen.gt.sm" right>
                <q-item-tile> <a class="csi-link cursor-pointer">Informativa sulla privacy</a></q-item-tile>
              </q-item-side>
            </q-item>

            <q-item class="q-body-1">
              <q-item-side>
                <q-toggle @input="onInputConsent(consentTypes.CONSULTATION, $event)" v-model="newConsentsList.consenso_consultazione" />
              </q-item-side>
              <q-item-main>
                <q-item-tile >Consenti la consultazione dei tuoi documenti da parte degli operatori sanitari</q-item-tile>
              </q-item-main>
            </q-item>

            <q-item  class="q-body-1" v-if="!isConsentPrevious">
              <q-item-side >
                <q-toggle @input="onInputConsent(consentTypes.PREVIOUS, $event)" v-model="newConsentsList.consenso_pregresso" />
              </q-item-side>
              <q-item-main>
                <q-item-tile >Consenti il recupero dei tuoi documenti pregressi</q-item-tile>
              </q-item-main>
            </q-item>
            <q-alert color="info" v-else>Hai attivato il consenso al recupero dei tuoi documenti pregressi</q-alert>
          </q-list>

        </q-card-main>
      </q-card>
    </template>

    <q-modal
      v-model="isConfirmModalOpen"
      :maximized="$q.screen.lt.md"
      :content-css="{maxWidth: '800px'}"
      ref="modal"
    >

      <q-modal-layout header-class="no-shadow no-scroll">
        <q-toolbar slot="header" color="transparent" text-color="primary">
          <q-toolbar-title></q-toolbar-title>
          <q-btn flat round icon="close" v-close-overlay/>
        </q-toolbar>
        <div class="csi-modal-content flex items-center">
          <div  class="q-px-xl q-pb-lg ">
              <q-alert type="warning" v-if="consentSelected.label === consentTypes.SUPPLY && consentSelected.value">
                <div class="text-body-1">
                  <p class="q-mb-md">
                    Confermi di voler togliere il consenso all'alimentazione dei tuoi documenti sanitari?
                  </p>
                  <p>
                    Se confermi la scelta, <strong>i tuoi documenti non saranno più visibili</strong>,
                    ma non verranno cancellati; torneranno visibili riattivando il consenso all'alimentazione dei tuoi documenti.
                  </p>
                  <p>
                    noltre, non saranno più aggiornabili i servizi collegati al Fascicolo
                    (Taccuino delle rilevazioni, Profilo Sanitario Sintetico, Bilancio di salute...)
                  </p>
                </div>
              </q-alert>
              <q-alert :type="consentSelected.value ? 'warning' : 'info'" v-else>
                <div class="text-body-1">
                  <p class="q-mb-md">
                    {{changeConsentMsg}}
                  </p>
                </div>
              </q-alert>

            <div class="row q-mt-lg justify-end items-center">
              <csi-buttons>
                <csi-button
                  primary
                  :loading="isChangingConsents"
                  label="Conferma"
                  @click="changeFseConsents"
                />
                <csi-button
                  secondary
                  label="Annulla"
                  v-close-overlay
                />
              </csi-buttons>

            </div>
          </div>
        </div>
      </q-modal-layout>

    </q-modal>


  </div>

</template>

<script>
import {getArruolabilita, getConsenso, getLastPolicyVersion, saveConsenso} from "../../services/api/enrollment";
import {isMinor} from "../../services/global/business-logic";
import CsiEnrollmentCard from "../enrollment/CsiEnrollmentCard";
import {deepClone, isEmpty} from "../../services/global/utils";
import {notifyError} from "../../services/api/utils";
import {urlEnrollment} from "../../services/enrollment/business-logic";

export default {
  name: "CsiConsentsFseCard",
  components: {CsiEnrollmentCard},
  props:{
    isPiedmontUser:{type:Boolean, default:false},
    taxCode: {type:String, default: ''}
  },
  data(){
    return{
      fseConsentInfo:null,
      consentSupply:false,
      consentConsultation:false,
      consentPrevious:false,
      isConfirmModalOpen:false,
      isLastPolicy:false,
      isChangingConsents:false,
      newConsentsList:null,
      isLoading:true,
      enrollmentInfo:null,
      consentSelected: {}
    }
  },
  computed:{
    fseCode(){
      return this.$config.enrollment.serviceCodes.consents
    },
    isConsentSupply(){
      return this.fseConsentInfo ? this.fseConsentInfo.consenso_alimentazione : false
    },
    isConsentPrevious(){
      return this.fseConsentInfo ? this.fseConsentInfo.consenso_pregresso :false
    },
    canOpenFse() {
      // true se l'utente corrente (delegante o utente loggato che sia) è arruolabile
      let isEnrollable = this.isActiveUserEnrollable
      let code = this.isActiveUserEnrollable ? this.isActiveUserEnrollable.codice_risposta : null;
      let enrollableCodes = [this.$config.enrollment.DO_NOT_ASK_ME_AGAIN, this.$config.enrollment.codes.FSE_NOT_APPROVED];
      // true se l'utente corrente (delegante o utente loggato che sia) è arruolabile oppure se ha un codice
      // che permette l'arruolamento
      isEnrollable = isEnrollable || enrollableCodes.includes(code);

      // Se la delega non è attiva => basta controllare se l'utente risulta "arruolabile"
      if (!this.isDelegationActive) return isEnrollable;

      // Se la delega è attiva => è possibile aprire il FSE solo per i minori
      return this.isDeclarationActive;
    },
    isActiveUserEnrollable() {
      return (
        this.enrollmentInfo && this.enrollmentInfo.risposta
      );
    },
    isActiveUserEnrolled() {
      return (
        this.enrollmentInfo &&
        this.enrollmentInfo.codice_risposta ===
        this.$config.enrollment.codes.FSE_APPROVED
      );
    },
    isDelegationActive() {
      return this.$store.getters['consents/isDelegationActive']
    },
    activeDelegation() {
      return this.$store.getters['consents/getActiveDelegation']
    },
    isDeclarationActive() {
      return this.isDelegationActive && isMinor(this.activeDelegation.data_nascita_delega)
    },
    consentTypes(){
      return this.$config.consents.consentsTypes
    },
    consentTypesMessages(){
      return this.$config.consents.consentTypesMessages
    },
    changeConsentMsg(){
      if(isEmpty(this.consentSelected)) return ''

      return this.consentSelected.value ? this.consentTypesMessages[this.consentSelected.label].NO_CONSENT : this.consentTypesMessages[this.consentSelected.label].CONSENT
    }

  },
  created(){
  },
  watch: {
    taxCode: {
      immediate:true,
      handler() {
        this.reloadEnrollmentInfo();
      }
    },
    fseConsentInfo:{
      immediate:true,
      handler(val, oldval) {
        this.newConsentsList = deepClone(val)
      }
    }
  },
  methods:{
    async reloadEnrollmentInfo() {
      console.log('reloadEnrollmentInfo')
      this.isLoading = true;
      let params = {servizio: this.serviceCode};
      let httpConfig = {params, _no5XXRedirect: true};

      try {
        let {data} = await getArruolabilita(this.taxCode, httpConfig);
        this.enrollmentInfo= data;
        if( this.isActiveUserEnrollable || this.isActiveUserEnrolled)
          this.getConsents()
      } catch (e) {
        console.error(e);
        this.enrollmentInfo = null;
      }

      this.isLoading = false;
    },
    async getConsents(){
      this.isLoading=true
      try{
        let config = {
          params:{servizio : this.fseCode},
          _no5XXRedirect: true
        }
        let consentResponse = await getConsenso(this.taxCode, config)
        this.fseConsentInfo = consentResponse.data
        let lastPolicy = await getLastPolicyVersion(this.taxCode)
        if(this.fseConsentInfo.identificativo_informativa === lastPolicy.data.identificativo_informativa)
          this.isLastPolicy=true

      }catch (e) {
        console.error(e);
        this.fseConsentInfo=null
      }finally {
        this.isLoading=false
      }

    },
    async changeFseConsents(){
      this.isChangingConsents = true

      this.newConsentsList[this.consentSelected.label] = !this.consentSelected.value
      try{
        let response = await saveConsenso(this.taxCode, this.newConsentsList, {_no5XXRedirect:true})
        console.log(response)
        this.fseConsentInfo = response.data
      }catch (error) {
        notifyError(error, 'Non è stato possibile modificare il consenso.')
        this.newConsentsList = this.fseConsentInfo
      }finally {
        this.isChangingConsents = false
        this.isConfirmModalOpen=false
      }

    },
    onActivate() {

      let serviceCode= this.$config.global.appServiceCodes.consents

      let url = urlEnrollment(serviceCode, this.isDeclarationActive, this.isDelegationActive, this.activeDelegation )
      window.location.assign(url);

    },
    onInputConsent(prop, newVal){
      this.newConsentsList[prop] = !newVal
      this.consentSelected = {
        label: prop,
        value: this.fseConsentInfo[prop]
      }
      console.log('onInputConsent')
      this.isConfirmModalOpen = true
    },

    lastPolicyVersionPdfUrl(){
      let baseUrl = axiosInstance.defaults.baseURL;
      let basePath = this.$config.global.basePaths.enrollment;
      return `${baseUrl}${basePath}/cittadini/${this.user.cf}/informativa-ultima/pdf`
    }
  }
}
</script>

<style scoped>

</style>
