<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-btn flat round :icon="visibilityIcon" :disable="isLoading">
    <q-popover style="min-width: 180px; max-width: 300px" :disable="isLoading">
      <div class="q-pa-md">
        <q-toggle v-model="visibility" @input="onInputVisibility" label="Consenti la consultazione dei dati e documenti relativi alle esenzioni ai professionisti sanitari." />
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
              <p>
                Stai per modificare la visibilità dei dati e documenti relativi alle esenzioni.
              </p>
              <p v-if="!isVisible">
                Confermando l’operazione renderai queste informazioni <strong>visibili</strong> ai
                <strong>professionisti sanitari</strong> purchè tu abbia fornito anche il consenso alla
                <router-link class="csi-link" :to="$routes.CONSENTS.HOME">consultazione</router-link>
                del tuo Fascicolo.

              </p>
              <p v-else>
                Negando il consenso renderai queste informazioni <strong>oscurate</strong> ai
                <strong>professionisti sanitari</strong> che pertanto non vedranno queste informazioni neppure se hai
                fornito anche il consenso alla <router-link class="csi-link" :to="$routes.CONSENTS.HOME">consultazione</router-link> del tuo Fascicolo.
              </p>
            </div>
          </q-alert>
          <csi-buttons>
            <csi-button v-if="!isVisible" primary @click="changeVisibility()"  :loading="isStatusLoading">Conferma</csi-button>
            <csi-button v-else  color="negative" secondary @click="changeVisibility()"  :loading="isStatusLoading">Nega consenso</csi-button>
            <csi-button secondary @click="cancelChoice" :disabled="isStatusLoading">Annulla</csi-button>
          </csi-buttons>
        </q-card>
        <template v-else>
          <q-card class="q-pa-md" v-if="canOpenFse">
            <q-alert class="q-pb-lg q-pt-sm" color="warning">
              <div>
                <p>
                  Apri il Fascicolo Sanitario Elettronico per consentire ai tuoi delegati
                  e agli Operatori sanitari di visualizzare le tue esenzioni

                </p>
              </div>
            </q-alert>
            <csi-buttons>
              <csi-button primary @click="openFse()" >Apri Fascicolo</csi-button>
              <csi-button secondary @click="visibility=false" v-close-overlay >Annulla</csi-button>
            </csi-buttons>
          </q-card>
          <q-card class="q-pa-md" v-else>
            <q-alert class="q-pb-lg q-pt-sm" color="warning">
              <div>
                <p>
                  Per consentire  la consultazione da parte di terzi, occorre avere aperto il Fascicolo Sanitario Elettronico

                </p>
              </div>
            </q-alert>
            <csi-buttons>
              <csi-button secondary @click="visibility=false" v-close-overlay >OK</csi-button>

            </csi-buttons>
          </q-card>
        </template>

      </q-modal-layout>
    </q-modal>

  </q-btn>
</template>

<script>
import {setVisibility, getExceptions} from "../../services/api/enrollment";
import {notifyError} from "../../services/api/utils";
import {urlEnrollment} from "../../services/enrollment/business-logic";

export default {
name: "CsiPathologyVisibilityButton",
  props:{
    enrollmentInfo: {type:Object, default: null},
    delegation:{type:Boolean, default: false},
    declaration:{type:Boolean,  default: false},
    cf:{type:String, default: null}
  },
  data(){
  return {
    visibility:false,
    isConfirmDialogOpen:false,
    isLoading:false,
    exceptionsInfo:false,
    isStatusLoading:false
  }
  },
  watch:{
    isActiveUserEnrolled:{
      immediate:true,
      handler(val, oldVal){
        if(val)
          this.getExceptionsStatus()
      }
    },

  },

  computed:{
    fseCode(){
      return this.$config.enrollment.serviceCodes.pathologyExemption
    },
    isVisible(){
     return this.setIsVisibile()
    },
    visibilityIcon(){
      return this.isVisible ? 'visibility' : 'visibility_off'
    },

    isActiveUserEnrolled() {
      let codes = [
        this.$config.enrollment.codes.FSE_APPROVED,
        this.$config.enrollment.codes.FSE_NOT_CONSENTS,
        this.$config.enrollment.codes.FSE_NOT_CONSENTS_2,
        this.$config.enrollment.codes.OTHER_REGION,
        this.$config.enrollment.codes.CONSENT_NOT_AUTHORIZED,
        this.$config.enrollment.codes.DATA_TRANSFER,
        this.$config.enrollment.codes.FSE_ACTIVATED
      ]

      return (
        this.enrollmentInfo &&  codes.includes(this.enrollmentInfo.codice_risposta)
      );
    },
    isActiveUserEnrollable() {
      return (
        this.enrollmentInfo && this.enrollmentInfo.risposta
      );
    },
    canOpenFse() {
      // true se l'utente corrente (delegante o utente loggato che sia) è arruolabile
      let isEnrollable = this.isActiveUserEnrollable;
      let code = this.enrollmentInfo
        ? this.enrollmentInfo.codice_risposta
        : null;
      let enrollableCodes = [
        this.$config.enrollment.DO_NOT_ASK_ME_AGAIN,
        this.$config.enrollment.codes.FSE_NOT_APPROVED
      ];
      // true se l'utente corrente (delegante o utente loggato che sia) è arruolabile oppure se ha un codice
      // che permette l'arruolamento
      isEnrollable = isEnrollable || enrollableCodes.includes(code);

      // Se la delega non è attiva => basta controllare se l'utente risulta "arruolabile"
      if (!this.delegation) return isEnrollable;

      // Se la delega è attiva => è possibile aprire il FSE solo per i minori
      return this.declaration;
    },
    activeDelegation() {
      return this.$store.getters["pathologyExemption/getActiveDelegation"];
    },

  },
  created(){

  },
  methods:{
    onInputVisibility(val){
      if(this.isStatusLoading || this.isVisible === val) return

      this.isConfirmDialogOpen = true
      this.visibility= !val

    },
   async  changeVisibility(){
      this.isStatusLoading = true
      let fseConfig = this.$config.pathologyExemption.fseConfig
      let payload = {
        oscuramento :[{
          fonte_oscuramento: fseConfig.hiddenCode,
          id_documento: null,
          codice_cl: null,
          tipo_screening: null,
          data_esame: null,
          tipo_esame: null,
          tipo_di_dato: fseConfig.type,
          oscurato: this.isVisible
        }]

      }
      let config = {
        _no5XXRedirect: true,
        params :{

          servizio: this.fseCode
        }
      }

      try{
        let response = await setVisibility(this.cf,payload, config )
        await this.getExceptionsStatus()
      }catch (e) {
        // let msg = hide ? 'Non è stato possibile mostrare la vista esame' : 'Non è stato possibile oscurare la vista esame'
        notifyError(e, "Non è stato possibile modificare il consenso.");
      }finally{
        this.isStatusLoading = false
        this.isConfirmDialogOpen = false
      }

    },
    cancelChoice(){
      this.visibility =false
      this.isConfirmDialogOpen = false
    },
    openFse(){
      this.visibility =false
      this.isConfirmDialogOpen = false
      // let name = this.$routes.ENROLLMENT.FLOW.name;
      // let query = {};
      //
      // if (this.declaration) {
      //   query = {
      //     minore: this.activeDelegation.codice_fiscale_delega,
      //     servizio: this.$config.global.appServiceCodes.pathologyExemption
      //   }
      // }else if(this.delegation){
      //   query = {
      //     d: this.activeDelegation.codice_fiscale_delega,
      //     servizio: this.$config.global.appServiceCodes.pathologyExemption
      //   }
      // }
      //
      // this.$router.push({name, query});

      let serviceCode= this.$config.global.appServiceCodes.pathologyExemption
      let url = urlEnrollment(serviceCode, this.isDeclarationActive, this.isDelegationActive, this.activeDelegation )
      window.location.assign(url);
    },
    async getExceptionsStatus(){
      this.isLoading = true
      console.log('lista esenzioni')
     let params ={servizio: this.fseCode}
      try{
        let response = await getExceptions(this.cf, {params})
        this.exceptionsInfo = response.data
        this.visibility = this.setIsVisibile()
      }catch (e) {
        notifyError(e, "Non è stato possibile reperire lo stato delle esenzioni.");
      }finally {
        this.isLoading = false
      }


    },
    setIsVisibile(){
      let visibleCodes = ["N", "M"];
      let visibility = this.exceptionsInfo ? this.exceptionsInfo.oscuramento_esenzioni : false
      return visibleCodes.includes(visibility);
    }

  }
}
</script>

<style scoped>

</style>
