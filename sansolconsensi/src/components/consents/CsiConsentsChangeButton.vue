<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-btn flat round :icon="visibilityIcon" :disable="isLoading">
    <q-popover style="min-width: 180px; max-width: 300px" :disable="isLoading">
      <div class="q-pa-md">
        <q-toggle v-model="visibility" @input="onInputVisibility" label="Consenti la consultazione dei tuoi documenti da parte degli operatori sanitari" />
      </div>

    </q-popover>

    <q-tooltip>Visibilità</q-tooltip>


    <!-- MODAL DI CONFERMA -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->

    <q-modal
      minimized
      class="q-pb-xl transparent"
      v-model="isConfirmDialogOpen"
      :content-css="{maxWidth: '800px'}"
    >
      <q-modal-layout header-class="no-shadow no-scroll">

        <q-card class="q-pa-md" v-if="isActiveUserEnrolled">
          <q-alert class="q-pb-lg q-pt-sm" color="info">
            <div>
              <p v-if="!isVisible">
                Confermi il consenso alla visualizzazione da parte degli operatori sanitari?

              </p>
              <p v-else>
               Vuoi negare il consenso alla visualizzazione da parte degli operatori sanitari?
              </p>
            </div>
          </q-alert>
          <csi-buttons>
            <csi-button v-if="!isVisible" primary @click="changeFseConsents()"  :loading="isLoadingConsents">Conferma</csi-button>
            <csi-button v-else  color="negative" secondary @click="changeFseConsents()"  :loading="isLoadingConsents">Nega consenso</csi-button>
            <csi-button secondary @click="cancelChoice" :disabled="isLoading">Annulla</csi-button>
          </csi-buttons>
        </q-card>
        <template v-else>
          <template v-if="canOpenFse && isPiedmontUser">
            <csi-enrollment-card
              :can-open="canOpenFse"
              @click-activate="onActivate"
            />
          </template>
          <template v-else>
            <q-card class="q-pa-md">
              <template v-if="canOpenFse">
                <q-alert class="q-pb-lg q-pt-sm" color="info">
                  <div>
                    <p >
                      Apri il Fascicolo Sanitario Elettronico la consultazione da parte degli Operatori Sanitari
                    </p>
                  </div>
                </q-alert>
                <csi-buttons>
                  <csi-button primary @click="onActivate" v-close-overlay >Attiva il Fascicolo Sanitario</csi-button>
                </csi-buttons>
              </template>
              <template v-else>
                <q-alert class="q-pb-lg q-pt-sm" color="warning">
                  <div>
                    <p>
                      Per consentire la consultazione da parte degli Operatori Sanitari, occorre avere aperto il Fascicolo Sanitario Elettronico
                    </p>
                  </div>
                </q-alert>
                <csi-buttons>
                  <csi-button secondary @click="visibility=false" v-close-overlay >OK</csi-button>
                </csi-buttons>
              </template>

            </q-card>
          </template>


        </template>

      </q-modal-layout>
    </q-modal>

  </q-btn>
</template>

<script>
import {
  setVisibility,
  getExceptions,
  getConsenso,
  getLastPolicyVersion,
  saveConsenso
} from "../../services/api/enrollment";
import {notifyError} from "../../services/api/utils";
import CsiEnrollmentCard from "../enrollment/CsiEnrollmentCard";
import {isMinor} from "../../services/global/business-logic";
import {deepClone} from "../../services/global/utils";
import {canOpenFse as _canOpenFse, urlEnrollment} from "../../services/enrollment/business-logic";

export default {
name: "CsiConsentsChangeButton",
  components: {CsiEnrollmentCard},
  data(){
  return {
    visibility:false,
    isConfirmDialogOpen:false,
    isLoading:false,
    isLoadingConsents:false,
    consentsInfo:null,
    isStatusLoading:false
  }
  },
  watch:{
    isActiveUserEnrolled:{
      immediate:true,
      handler(val, oldVal){
        if(val)
          this.getConsents()
      }
    }
  },

  computed:{
    isVisible(){
     return this.consentsInfo && this.consentsInfo.consenso_consultazione
    },
    visibilityIcon(){
      return this.isVisible ? 'visibility' : 'visibility_off'
    },
    isPiedmontUser() {
      return this.$store.getters['global/isPiedmontUser']
    },
    isActiveUserEnrolled() {
      return (
        this.enrollmentInfo &&
        this.enrollmentInfo.codice_risposta ===
        this.$config.enrollment.codes.FSE_APPROVED
      );
    },
    activeDelegation(){
      return this.$store.getters['consents/getActiveDelegation']
    },
    enrollmentInfo(){
      return this.$store.getters['consents/getActiveUserEnrollmentInfo']
    },
    cf(){
      return this.$store.getters['consents/getTaxCode']
    },
    isDelegationActive() {
      return this.$store.getters["pathologyExemption/isDelegationActive"];
    },
    isDeclarationActive() {
      return (
        this.isDelegationActive &&
        isMinor(this.activeDelegation.data_nascita_delega)
      );
    },
    canOpenFse(){
      return _canOpenFse(this.enrollmentInfo, this.isDelegationActive, this.isDeclarationActive)
    },


  },
  created(){

  },
  methods:{
    onInputVisibility(val){
      if(this.isLoadingConsents || this.isVisible === val) return

      this.isConfirmDialogOpen = true
      this.visibility=!val

    },

    cancelChoice(){
      this.visibility =false
      this.isConfirmDialogOpen = false
    },
    onActivate() {
      this.visibility =false
      this.isConfirmDialogOpen = false
      // let name = this.$routes.ENROLLMENT.FLOW.name;
      // let query = {};
      //
      // if (this.isDeclarationActive) {
      //   query = {
      //     minore: this.activeDelegation.codice_fiscale_delega,
      //     servizio: this.$config.global.appServiceCodes.consents
      //   }
      // }else if(this.isDelegationActive){
      //   query = {
      //     d: this.activeDelegation.codice_fiscale_delega,
      //     servizio: this.$config.global.appServiceCodes.consents
      //   }
      // }

      let serviceCode=  this.$config.global.appServiceCodes.consents
      let url = urlEnrollment(serviceCode, this.isDeclarationActive, this.isDelegationActive, this.activeDelegation )
      window.location.assign(url);
    },
    async getConsents(){
      this.isLoading=true
      try{
        let params = {servizio: this.$config.enrollment.serviceCodes.consents};
        let config = {params, _no5XXRedirect: true};
        let consentResponse = await getConsenso(this.cf, config)
        this.consentsInfo = consentResponse.data
        this.visibility = this.isVisible
        let lastPolicy = await getLastPolicyVersion(this.cf)
        if(this.consentsInfo.identificativo_informativa === lastPolicy.data.identificativo_informativa)
          this.isLastPolicy=true

      }catch (e) {
        console.error(e);
        this.consentsInfo=null
      }finally {
        this.isLoading=false
        this.isConfirmDialogOpen=false
      }

    },
    async changeFseConsents(){
      this.isLoadingConsents = true
      let payload = deepClone(this.consentsInfo)
      payload.consenso_consultazione = !this.isVisible
      console.log([payload, this.consentsInfo])
      try{
        let response = await saveConsenso(this.cf, payload, {_no5XXRedirect:true})
        console.log(response)
        this.consentsInfo = response.data
        this.visibility = this.isVisible
      }catch (error) {
        notifyError(error, 'Non è stato possibile modificare il consenso.')
      }finally {
        this.isLoadingConsents = false
        this.isConfirmDialogOpen=false
      }

    },
  }
}
</script>

<style scoped>

</style>
