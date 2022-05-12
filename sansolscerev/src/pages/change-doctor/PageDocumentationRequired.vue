<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template >
    <q-page padding>
      <csi-page-title @back="goBack" title="Documentazione" class="q-mb-md"></csi-page-title>

      <template v-if="requestCorrection && correctionMessage && !isLoading">
        <q-alert type="info" class="csi-doctor-alert q-my-lg">
          <div class="q-body-1 q-pa-md">
            {{correctionMessage}}
          </div>
        </q-alert>
      </template>
      <template v-if="!isLoading">
        <q-card class="bg-white q-my-lg" >
          <q-card-title class="q-pt-lg " >
            <h1 class="csi-h1 q-mb-sm">Allegati richiesti</h1>
            <div class="q-body-1">Per portare a termine la procedura è necessario allegare copia di questi documenti:</div>
            <div class="q-caption text-italic">La dimensione massima degli allegati è di 3 Mb</div>
          </q-card-title>
          <q-card-main>

            <template v-for="document in documentsTypeList" >
              <csi-attachment-form
                :attachment="document"
                @add-document="getAttachments"
                @remove-document="removeAttachment"
                :is-not-document="isNotDocuments"
                ref="attachmentForm"
              />
            </template>

          </q-card-main>
        </q-card>
        <!------- DELEGHE------------>
        <!-- ----------------------------------------------------------------------------------------------------- -->
        <q-card class="bg-white q-my-lg" v-if="delegatorAttachment">
          <q-card-main>
            <q-item class="no-padding" >
              <q-item-main>
                  <q-alert type="info" class="q-my-lg" >
                Stampare il modulo con i dati inseriti, farlo firmare da {{userInfo.cognome | upperCase}} {{userInfo.nome}} e caricarlo qui sotto.
                <csi-buttons>
                  <csi-button secondary label="Stampa modulo" @click="getDelegationForm" />
                </csi-buttons>
              </q-alert>
              </q-item-main>
            </q-item>

           <csi-attachment-form
             :attachment="delegatorAttachment"
             @add-document="getAttachments"
             @remove-document="removeAttachment"
             :is-not-document="isNotDocuments"
             ref="attachmentFormDelegation"
           />

          </q-card-main>
        </q-card>

        <!------- NO DOCUMENTI------------>
        <!-- ----------------------------------------------------------------------------------------------------- -->
        <div class="row" v-if="!isReview && !requestCorrection">
            <q-checkbox
              v-model="isNotDocuments"
              color="primary"
              label="In questo momento non sono in possesso dei documenti richiesti, proseguirò più tardi." />
        </div>

        <!--ACTIONS--->
        <div class="row q-mt-lg justify-end items-center" >
          <csi-buttons class="col-12 col-md-auto q-pa-sm">
            <csi-button
              :disabled="noAttachments"
              primary
              type="submit"
              label="Prosegui"
              :loading="newDataLoading"
              @click="uploadAttachments()"
            />
<!--            <span class="loader-container col-md-auto col-12">   <csi-inner-loading :visible="isLoading" block /></span>-->
          </csi-buttons>
        </div>

          <!-- MODALS -->
          <!-- ----------------------------------------------------------------------------------------------------------- -->
     </template>
        <!--      LOADER-->
      <csi-inner-loading :visible="isLoading" />

    </q-page>
</template>

<script>

  import CsiCardItem from "components/global/common/CsiCardItem";
  import qs from 'qs';
  import {getRegions} from "@services/api/cross";
  import {isEmpty, orderBy} from "@services/global/utils";
  import {capitalize, toUpper} from "@filters/cases";
  import CsiPageTitle from "components/global/common/CsiPageTitle";
  import { filter } from 'quasar'
  import required from "vuelidate/lib/validators/required";
  import {
    attachmentControl,
    combinationControl, delegationFormPdf, getDoctorDetails
  } from "@services/api/change-doctor";
  import {toBase64} from "@services/global/files";
  import {
    citizenshipInfo,
    goToConfirmRequest,
    isAura,
    isDoctorDerogation, isPreviousDoctorRevokeRequired
  } from "@services/change-doctor/business-logic";
  import {notifyError} from "@services/api/utils";
  import store from "@store/index";
  import CsiAttachmentForm from "components/change-doctor/CsiAttachmentForm";
  import {getAdditionalInfo} from "@store/change-doctor/getters";
  import {axiosInstance} from "@plugins/axios";

  const MAX_FILE_SIZE = 3 * 1024 * 1024; /* =3M */

export default {
    name: 'PageDocumentationRequired',
    components:{CsiAttachmentForm, CsiCardItem, CsiPageTitle},
    data() {
      return {
        attachmentsRequiredList:[],
        isNotDocuments:false,
        isLoading : false,
        newDataLoading:false,
        isDerogation:false,
        isDelegation: false,
        isCareMotivation: false,
        isForeigner:false,
        requestCorrection:null,
        correctionMessage:null,
        doctor:null,
        isReview:false,
        isDraft:false,
        doctorInfo: null,
        documentErrLabel:'',
        dimensionErr : {},
        fixedAttachments: [],
        combinationControl: null,
        documentsTypeList: [],
        delegatorAttachment:null,
        foreignerAttachmentsTypeList:[],
        documentsErrors: false
      }
    },

    computed: {
      userInfo(){
       return  this.$store.getters['changeDoctor/getUserInfo']
      },
      cf(){
        return this.$store.getters['changeDoctor/getTaxCode']
      },
      isMinorDelegator(){
        return this.$store.getters['changeDoctor/isMinorDelegator']
      },

      isAdultDelegator(){
        return this.$store.getters['changeDoctor/isAdultDelegator']
      },
      requestInfo(){
        let info = (this.userInfo && this.userInfo.richiesta_cambio) ? this.userInfo.richiesta_cambio : this.$store.getters['changeDoctor/getRequestInformation'];
        return info
      },
      citizenshipInfo(){
        return citizenshipInfo()
      },
      noAttachments(){
        return ((!this.isNotDocuments || this.requestCorrection) && this.attachmentsRequiredList.length===0)
      },
      attachmentsOptions(){
        return this.$store.getters['changeDoctor/getAttachmentsOptions'];
      },
      additionalInfo(){
        return this.$store.getters['changeDoctor/getAdditionalInfo'];
      },
      choosenDoctor(){
       return  this.$store.getters['changeDoctor/getChoosenDoctor'];
      },
      isAssistanceRenewal(){
        return  this.$store.getters['changeDoctor/isAssistanceRenewal'];
      }

    },
  created(){
   this.isLoading = true;
   this.fixedAttachments = this.$config.changeDoctor.fixedAttachments;
   if(isEmpty(this.requestInfo)){
     this.$router.replace(this.$routes.CHANGE_DOCTOR.HOME);
   }else{
     this.getInfoControls()
   }
  },

  methods: {
    async getInfoControls() {
      this.doctorInfo = this.requestInfo.medico;
      let {isNotDocuments, requestCorrection, correctionMessage, isReview} = this.$route.query;
      this.isNotDocuments = (isNotDocuments === "true");
      this.correctionMessage = correctionMessage ? correctionMessage : null;
      this.requestCorrection = requestCorrection === true || requestCorrection === "true";
      this.isReview =  isReview === true || isReview === "true";
      this.combinationControl = this.$store.getters['changeDoctor/getCombinationControl'];
      this.doctor = this.$store.getters['changeDoctor/getChoosenDoctor'];



      if(this.isReview){
          this.documentsTypeList = this.requestInfo.allegati;
          let delegatorAttachment =  this.documentsTypeList.find(doc => doc.tipo === '5');
        if(delegatorAttachment){
          this.delegatorAttachment = delegatorAttachment;
          const index = this.documentsTypeList.indexOf(delegatorAttachment);
          this.documentsTypeList.splice(index, 1);
        }
        this.isLoading =false
      }else{
        if (!this.doctor) {
          let doctorInfoPromise = await getDoctorDetails(this.doctorInfo.codice_fiscale, {_no5XXRedirect: true});
          this.doctor = doctorInfoPromise.data;
          delete this.doctor['ambulatori']
        }

        if(!this.combinationControl){
          let combinationParams = {
            codice_fiscale_medico: this.doctorInfo.codice_fiscale,
            medico_altra_regione: this.userInfo.medico_altra_regione,
            cittadinanza: this.requestInfo.cittadinanza ? this.requestInfo.cittadinanza : this.userInfo.cittadinanza,
            domicilio:this.requestInfo.domicilio ? this.requestInfo.domicilio : this.userInfo.domicilio,
            residenza: this.requestInfo.residenza ? this.requestInfo.residenza : this.userInfo.residenza,
            rinnovo_assistenza:this.isAssistanceRenewal
          };

          try {
            let combinationPromise = await combinationControl(this.cf, combinationParams, {_no5XXRedirect: true});
            this.combinationControl = combinationPromise.data;
            this.$store.dispatch('changeDoctor/setCombinationControl', {combination: this.combinationControl});
            // this.isDerogation = isDoctorDerogation(this.combinationControl, this.doctor.tipologia.id);
            this.setDocumentsTypesRequired()
          } catch (e) {
            notifyError(e, 'Errore nel caricamento dei dati.')
          }
        }else{
          this.setDocumentsTypesRequired()
        }
      }

    },

    setDocumentsTypesRequired(){
      this.isForeigner =this.citizenshipInfo ? this.citizenshipInfo.isForeigner: false;
      if(this.attachmentsOptions && this.attachmentsOptions.isDelegation)
        this.isDelegation = this.attachmentsOptions.isDelegation;
      else
        this.isDelegation =  this.$store.getters['changeDoctor/isAdultDelegator'];

      if(this.attachmentsOptions && this.attachmentsOptions.isCareMotivation)
        this.isCareMotivation = this.attachmentsOptions.isCareMotivation;
      else
        this.isCareMotivation = this.requestInfo && this.requestInfo.dati_aggiuntivi && this.requestInfo.dati_aggiuntivi.motivazione_domicilio ? this.requestInfo.dati_aggiuntivi.motivazione_domicilio.id === this.$config.changeDoctor.DomicileReasons.CURA : false;

      if(this.attachmentsOptions && this.attachmentsOptions.isDoctorDerogation)
        this.isDerogation = this.attachmentsOptions.isDoctorDerogation;
      else{
        let isDoctorDerogationResponse = isDoctorDerogation(this.combinationControl, this.doctor.tipologia.id);
        this.isDerogation = isDoctorDerogationResponse.isDerogation;
      }

      if(this.attachmentsOptions && this.attachmentsOptions.isForeignerDocuments){
        let savedAttachments = this.$store.getters['changeDoctor/getAttachmentsTypeList'];
        this.foreignerAttachmentsTypeList = savedAttachments.allegati;
        this.documentsTypeList  = this.documentsTypeList.concat( this.foreignerAttachmentsTypeList)
      }else{
        if(this.isForeigner && this.requestInfo.dati_aggiuntivi && this.requestInfo.dati_aggiuntivi.motivazione_soggiorno){
          this.getForeignerAttachments()
        }
      }


      if( this.isDelegation){
          let delegatorAttachments = this.fixedAttachments.filter( doc => doc.tipo === '1' || doc.tipo === '2');
          this.documentsTypeList = this.documentsTypeList.concat(delegatorAttachments);
          let delegatorAttachment = this.fixedAttachments.find(doc => doc.tipo === '5');
          if(delegatorAttachment){
            this.delegatorAttachment = delegatorAttachment
          }
        }
      if(this.isCareMotivation){
          let careMotivationAttachments = this.fixedAttachments.find( doc => doc.tipo === '4');
        this.documentsTypeList  = this.documentsTypeList.concat(careMotivationAttachments)
        }
      if(this.isDerogation){
        let derogationAttachments = this.fixedAttachments.find( doc => doc.tipo === '3');
        this.documentsTypeList  = this.documentsTypeList.concat(derogationAttachments)
      }

      if (isPreviousDoctorRevokeRequired()) {
        let derogationAttachments = this.fixedAttachments.find( doc => doc.tipo === '18');
        this.documentsTypeList  = this.documentsTypeList.concat(derogationAttachments)
      }


      this.isLoading = false;
    },
    getAttachments(params){
      if(params)
        this.attachmentsRequiredList.push(params)

    },

    removeAttachment(params){

      const index = this.attachmentsRequiredList.indexOf(params);
      if (index > -1) {
        this.attachmentsRequiredList.splice(index, 1);

      }

    },

    async getForeignerAttachments(){

      let params = {
        cittadinanza: this.citizenshipInfo ? this.citizenshipInfo.nation : '',
        motivazione_soggiorno: this.requestInfo.dati_aggiuntivi ? this.requestInfo.dati_aggiuntivi.motivazione_soggiorno : null,
        asl_iscrizione: this.combinationControl.asl_iscrizione,
        asl_domicilio: this.combinationControl.asl_domicilio,
        asl_residenza: this.combinationControl.asl_residenza
      };

      let attachmentsControlResponse= await attachmentControl(this.cf, params, {_no5XXRedirect: true});
      let attachments = attachmentsControlResponse.data;
      if(attachments && attachments.allegati.length>0){
        this.$store.dispatch('changeDoctor/setForeignerAttachments', {attachments: attachments});
        this.$store.dispatch('changeDoctor/setIsForeignerDocuments', {value: true});
        this.foreignerAttachmentsTypeList = attachments.allegati;
        this.documentsTypeList  = this.documentsTypeList.concat( this.foreignerAttachmentsTypeList)
      }

    },

    goBack() {
      this.$router.go(-1)
    },

    uploadAttachments() {

      let documentsErrors =false;
      this.newDataLoading = true;
      let attachmentsForms = this.$refs.attachmentForm;
      if(this.delegatorAttachment){
        attachmentsForms.push(this.$refs.attachmentFormDelegation)
      }

      attachmentsForms.forEach( document =>{
        document.touch();
        if(document.$v.$error){
          documentsErrors = true
        }

      });
      if(documentsErrors){
        this.newDataLoading = false;
        return
      }


      let isDraft = false;
      if(this.isNotDocuments){
        isDraft = true;
      }

      let attachments = this.attachmentsRequiredList.length>0 ? this.attachmentsRequiredList : null;

      this.$store.dispatch('changeDoctor/setAttachments', {attachments: attachments});
      this.$store.dispatch('changeDoctor/setIsToBackoffice', {value:true});
      let params = {
        id: this.doctorInfo.id,
        codice_fiscale: this.doctorInfo.codice_fiscale,
        isDraft: isDraft,
        isReview: this.isReview,
        attachments: attachments
      };
      let query = {
        isNotDocuments: this.isNotDocuments,
        requestCorrection: this.requestCorrection,
        isReview: this.isReview
      };
      this.$router.replace({path: this.$router.history.current.fullPath, query: query});
      this.newDataLoading = false;
      goToConfirmRequest(params)

    },
    async getDelegationForm() {
      let params = {
        codice_fiscale_medico: this.doctorInfo.codice_fiscale,
        cittadinanza: this.requestInfo.cittadinanza ? this.requestInfo.cittadinanza : this.userInfo.cittadinanza,
        domicilio: this.requestInfo.domicilio ? this.requestInfo.domicilio : this.userInfo.domicilio,
        residenza: this.requestInfo.residenza ? this.requestInfo.residenza : this.userInfo.residenza,
        recapiti: this.requestInfo.recapiti ? this.requestInfo.recapiti : this.userInfo.recapiti,
        medico_altra_regione: this.requestInfo.medico_altra_regione,
        dati_aggiuntivi: this.requestInfo.dati_aggiuntivi,
        generalita_assistito: {
          nome: this.userInfo.nome,
          cognome: this.userInfo.cognome,
          data_nascita: this.userInfo.data_nascita,
          comune_nascita: this.userInfo.comune_nascita
        }
      };


      let form = document.createElement('form');
      form.id = 'form-temp';
      form.method = 'post';
      form.action = `${axiosInstance.defaults.baseURL}${this.$config.global.basePaths.changeDoctor}/cittadini/${this.cf}/modulo-delegante/pdf`;

      let hiddenField = document.createElement('input');
      hiddenField.type = 'hidden';
      hiddenField.name = 'payload';
      hiddenField.value = JSON.stringify(params);

      form.append(hiddenField);
      document.body.appendChild(form);
      form.submit();
      setTimeout(() => {
        document.getElementById('form-temp').outerHTML = '';
      });


      // let config = {
      //   responseType: 'arraybuffer',
      //   _no5XXRedirect: true
      // };
      // let pdfResponse = await delegationFormPdf(this.cf, params, config);
      // // let file = new Blob([pdfResponse.data], {type: 'application/pdf'});
      // // let fileURL = URL.createObjectURL(file);
      // window.open("data:application/pdf," + encodeURI(pdfResponse.data));
    },
  }

}
</script>
<style lang="stylus">
  .documentation-required-title
    margin-top: 48px;
    margin-bottom: 16px;


  .loader-container
    max-height : 30px
    display : flex
    align-items : center
    justify-content : center

  .csi-doctor-alert
    .q-alert-side
      align-self: center
      background : none
      @media (max-width: 480px)
        display:none

</style>
