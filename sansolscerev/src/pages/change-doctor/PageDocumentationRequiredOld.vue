<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template >
    <q-page padding>
      <csi-page-title @back="goBack" title="Documentazione" class="q-mb-md"></csi-page-title>

      <template v-if="requestCorrection && !isLoading">
        <q-alert type="info" class="csi-doctor-alert q-my-lg">
          <div class="q-body-1 q-pa-md">
            {{requestCorrection}}
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
            <!------- DOCUMENTO D'IDENTITA' DEL DELEGANTE ------------>
            <!-- ----------------------------------------------------------------------------------------------------- -->
            <q-item class="no-padding"  v-if="attachmentsList.isDelegation && !isMinorDelegator">
                <q-item-main>
                  <q-field
                    class="q-my-md"
                    :error="$v.documents.docIdentityFront.$error"
                    required
                  >
                        <q-uploader
                          ref="uploader"
                          float-label="Documento d'identità del delegante - Fronte"
                          url=""
                          extensions=".jpg, .jpeg, .png, .pdf"
                          clearable
                          hide-upload-button
                          hide-upload-progress
                          auto-expand
                          class="csi-uploader"
                          @add="(files) => onDocumentsAdded(files, 'docIdentityFront')"
                          @remove:cancel="(file) => onDocumentRemoved(file, 'docIdentityFront')"

                        />
                        <template slot="error-label">
                          <div v-if="!$v.documents.docIdentityFront.required">Documento mancante</div>
                          <div v-if="!$v.documents.docIdentityFront.dimensionLimit">Il documento è troppo grande</div>
                        </template>

                  </q-field>
                  <q-field
                    class="q-my-md"
                    :error="$v.documents.docIdentityBack.$error"
                    required
                  >
                    <q-uploader
                      ref="uploader"
                      float-label="Documento d'identità del delegante - Retro"
                      url=""
                      extensions=".jpg, .jpeg, .png, .pdf"
                      clearable
                      hide-upload-button
                      hide-upload-progress
                      auto-expand
                      class="csi-uploader"
                      @add="(files) => onDocumentsAdded(files, 'docIdentityBack')"
                      @remove:cancel="(file) => onDocumentRemoved(file, 'docIdentityBack')"

                    />
                    <template slot="error-label">
                      <div v-if="!$v.documents.docIdentityBack.required">Documento mancante</div>
                      <div v-if="!$v.documents.docIdentityBack.dimensionLimit">Il documento è troppo grande</div>
                    </template>
                  </q-field>
                </q-item-main>
            </q-item>


            <!------- CONSENSO DEL MEDICO RICHIESTO ------------>
            <!-- ----------------------------------------------------------------------------------------------------- -->
            <q-item class="no-padding" v-if="attachmentsList.isDoctorDerogation">
              <q-item-main>
                <q-field
                  class="q-my-md"
                  :error="$v.documents.docDoctorConsent.$error"
                  required
                >
                  <q-uploader
                    ref="uploader"
                    float-label="Consenso del medico richiesto"
                    url=""
                    extensions=".jpg, .jpeg, .png, .pdf"
                    helper="Dimensione massima: 5Mb"
                    clearable
                    hide-upload-button
                    hide-upload-progress
                    auto-expand
                    class="csi-uploader"
                    @add="(files) => onDocumentsAdded(files, 'docDoctorConsent')"
                    @remove:cancel="(file) => onDocumentRemoved(file, 'docDoctorConsent')"

                  />
                  <template slot="error-label">
                    <div v-if="!$v.documents.docDoctorConsent.required">Documento mancante</div>
                    <div v-if="!$v.documents.docDoctorConsent.dimensionLimit">Il documento è troppo grande</div>
                  </template>
                </q-field>
              </q-item-main>
            </q-item>

            <!------- CERTIFICATO MEDICO FIRMATO DIGITALMENTE ------------>
            <!-- ----------------------------------------------------------------------------------------------------- -->
            <q-item class="no-padding" v-if="attachmentsList.isCareMotivation">
              <q-item-main>
                <q-field
                  class="q-my-md"
                  :error="$v.documents.docDoctorSignature.$error"
                  required
                >
                  <q-uploader
                    ref="uploader"
                    float-label="Certificato medico firmato digitalmente"
                    url=""
                    extensions=".jpg, .jpeg, .png, .pdf"
                    clearable
                    hide-upload-button
                    hide-upload-progress
                    helper="Dimensione massima: 5Mb"
                    auto-expand
                    class="csi-uploader"
                    @add="(files) => onDocumentsAdded(files, 'docDoctorSignature')"
                    @remove:cancel="(file) => onDocumentRemoved(file, 'docDoctorSignature')"

                  />
                  <template slot="error-label">
                    <div v-if="!$v.documents.docDoctorSignature.required">Documento mancante</div>
                    <div v-if="!$v.documents.docDoctorSignature.dimensionLimit">Il documento è troppo grande</div>
                  </template>
                </q-field>
              </q-item-main>
            </q-item>


            <!------- PERMESSO DI SOGGIORNO ------------>
            <!-- ----------------------------------------------------------------------------------------------------- -->
            <q-item class="no-padding"  v-if="isForeigner">
              <q-item-main>
                <q-field
                  class="q-my-md"
                  :error="$v.documents.docResidencePermit.$error"
                  required
                >
                  <q-uploader
                    ref="uploader"
                    float-label="Permesso o carta di soggiorno"
                    url=""
                    extensions=".jpg, .jpeg, .png, .pdf"
                    clearable
                    hide-upload-button
                    hide-upload-progress
                    helper="Dimensione massima: 5Mb"
                    auto-expand
                    class="csi-uploader"
                    @add="(files) => onDocumentsAdded(files, 'docResidencePermit')"
                    @remove:cancel="(file) => onDocumentRemoved(file, 'docResidencePermit')"

                  />
                  <template slot="error-label">
                    <div v-if="!$v.documents.docResidencePermit.required">Documento mancante</div>
                    <div v-if="!$v.documents.docResidencePermit.dimensionLimit">Il documento è troppo grande</div>
                  </template>
                </q-field>
              </q-item-main>
            </q-item>

          </q-card-main>
        </q-card>
        <!------- DELEGHE------------>
        <!-- ----------------------------------------------------------------------------------------------------- -->
        <q-card class="bg-white q-my-lg" v-if="attachmentsList.isDelegation && !isMinorDelegator">
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

            <q-item class="no-padding" >
              <q-item-main>
                <q-field
                  class="q-my-md"
                  :error="$v.documents.docDelegationForm.$error"
                  required
                >
                  <q-uploader
                    ref="uploader"
                    float-label="Modulo richiesta firmata dal delegante"
                    url=""
                    extensions=".jpg, .jpeg, .png, .pdf"
                    clearable
                    hide-upload-button
                    hide-upload-progress
                    helper="Dimensione massima: 5Mb"
                    auto-expand
                    class="csi-uploader"
                    @add="(files) => onDocumentsAdded(files, 'docDelegationForm')"
                    @remove:cancel="(file) => onDocumentRemoved(file, 'docDelegationForm')"

                  />
                  <template slot="error-label">
                    <div v-if="!$v.documents.docDelegationForm.required">Documento mancante</div>
                    <div v-if="!$v.documents.docDelegationForm.dimensionLimit">Il documento è troppo grande</div>
                  </template>
                </q-field>
              </q-item-main>
            </q-item>

          </q-card-main>
        </q-card>

        <!------- NO DOCUMENTI------------>
        <!-- ----------------------------------------------------------------------------------------------------- -->
        <div class="row" v-if="!isReview">
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
    combinationControl, delegationFormPdf, getDoctorDetails
  } from "@services/api/change-doctor";
  import {toBase64} from "@services/global/files";
  import {
    citizenshipInfo,
    goToConfirmRequest,
    isAura,
    isDoctorDerogation
  } from "@services/change-doctor/business-logic";
  import {notifyError} from "@services/api/utils";
  import store from "@store/index";

  const MAX_FILE_SIZE = 3 * 1024 * 1024; /* =3M */

export default {
    name: 'PageDocumentationRequiredOld',
    components:{CsiCardItem, CsiPageTitle},
    data() {
      return {
        documents:{
          docIdentityFront:null,
          docIdentityBack:null,
          docDoctorConsent:null,
          docDoctorSignature:null,
          docResidencePermit:null,
          docDelegationForm:null
      },

        isNotDocuments:false,
        isLoading : false,
        newDataLoading:false,
        isDerogation:false,
        isForeigner:false,
        requestCorrection:null,
        doctor:null,
        filesCounter:0,
        isReview:false,
        isDraft:false,
        doctorInfo: null,
        documentErrLabel:'',
        dimensionErr : {},
        fixedAttachments: [],
        derogationType:null
      }
    },
  validations(){
      return{
          documents:{
            docDoctorSignature:{
              required: v=> this.isNotDocuments || !this.isCareMotivation || this.requestCorrection || !!v ,
              dimensionLimit : v=> this.fileDimensionError(v)
            },
            docDoctorConsent:{
              required: v=>  this.isNotDocuments || !this.isDerogation ||  this.requestCorrection || !!v,
             dimensionLimit : v=> this.fileDimensionError(v)
            },
            docIdentityFront:{
              required: v=>  this.isNotDocuments || !this.isDelegation || this.requestCorrection ||  !!v,
              dimensionLimit : v=> this.fileDimensionError(v)
            },
            docIdentityBack:{
              required: v=>  this.isNotDocuments || !this.isDelegation || this.requestCorrection ||  !!v,
              dimensionLimit : v=> this.fileDimensionError(v)
            },
            docDelegationForm:{
              required: v=> this.isNotDocuments || this.requestCorrection || !this.isDelegation || (this.isDelegation && this.isMinorDelegator)  || !!v,
              dimensionLimit : v=> this.fileDimensionError(v)
            },
            docResidencePermit:{
              required: v=>  this.isNotDocuments || !this.isForeigner || this.requestCorrection ||  !!v,
              dimensionLimit : v=> this.fileDimensionError(v)
            },
          }
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
      requestInfo(){
        let info = (this.userInfo && this.userInfo.richiesta_cambio) ? this.userInfo.richiesta_cambio : this.$store.getters['changeDoctor/getRequestInformation'];
        return info
      },
      isCareMotivation(){
        if(this.requestInfo && this.requestInfo.dati_aggiuntivi)
          return this.requestInfo.dati_aggiuntivi.motivazione_domicilio === this.$config.changeDoctor.DomicileReasons.CURA
      },
      citizenshipInfo(){
        return citizenshipInfo()
      },
      noAttachments(){
        return ((!this.isNotDocuments || this.requestCorrection) && this.filesCounter===0)
      },
      attachmentsList(){
        return this.$store.getters['changeDoctor/getAttachmentsOptions'];
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
      this.doctorInfo = this.$route.params;
      let {isNotDocuments, requestCorrection, isReview} = this.$route.query;
      this.isNotDocuments = (isNotDocuments === "true");
      this.requestCorrection = requestCorrection ? requestCorrection : null;
      this.isReview = isReview;
      this.combinationControl = this.$store.getters['changeDoctor/getCombinationControl'];
      this.doctor = this.$store.getters['changeDoctor/getChoosenDoctor'];
      if (!this.doctor) {
        let doctorInfoPromise = await getDoctorDetails(this.doctorInfo.codice_fiscale, {_no5XXRedirect: true});
        this.doctor = doctorInfoPromise.data;
        delete this.doctor['ambulatori']
      }
      if (!this.combinationControl && this.doctor) {
        let combinationParams = {
          codice_fiscale_medico: this.doctor.codice_fiscale,
          medico_altra_regione: this.userInfo.medico_altra_regione,
          cittadinanza: this.requestInfo.cittadinanza ? this.requestInfo.cittadinanza : this.userInfo.cittadinanza,
          domicilio:this.requestInfo.domicilio ? this.requestInfo.domicilio : this.userInfo.domicilio,
          residenza: this.requestInfo.residenza ? this.requestInfo.residenza : this.userInfo.residenza
        };

        try {
          let combinationPromise = await combinationControl(this.cf, combinationParams, {_no5XXRedirect: true});
          this.combinationControl = combinationPromise.data;
          this.$store.dispatch('changeDoctor/setCombinationControl', {combination: this.combinationControl});

          let isDoctorDerogation = isDoctorDerogation(this.combinationControl, this.doctor.tipologia.id);
          this.isDerogation = isDoctorDerogation.isDerogation;
          this.derogationType = isDoctorDerogation.derogationType;
          this.isForeigner = citizenshipInfo.isForeigner;
        } catch (e) {
          notifyError(e, 'Errore nel caricamento dei dati.')
        } finally {
          this.isLoading = false
        }
      } else {
        this.isForeigner = citizenshipInfo.isForeigner;
        this.isLoading = false
      }


    },


    async onDocumentsAdded(files, fileType) {
      let file = files[0];
      try {
        let base64 = await toBase64(file);
        let dataTypeString = `data:${file.type};base64,`;
        file.__base64 = base64.replace(dataTypeString, "");
        this.documents[fileType] = file;
        this.filesCounter++
      } catch (e) {
        notifyError(e, 'Si è verificato un errore nella lettura del file caricato')
      }
      this.$v.documents[fileType].$touch();
    },
    onDocumentRemoved(file, fileType) {
      this.documents[fileType] = null;
      this.filesCounter--
    },

    goBack() {
      this.$router.go(-1)
    },

    setDocumentsInfo(filename) {
      let params = null;
      if (filename) {
        params = {
          nome: filename.name,
          mime_type: filename.type,
          base_64: filename.__base64
        }
      }
      return params

    },

    uploadAttachments() {
      this.$v.$touch();
      // console.log(this.$v);
      if (this.$v.$error) {
        return
      }
      // if((this.requestCorrection || this.requestInfo.bozza) && this.isNotDocuments) {
      //   this.$router.push(this.$routes.CHANGE_DOCTOR.HOME);
      //   return
      // }

      this.newDataLoading = true;
      let documents = {
        identita_fronte: this.setDocumentsInfo(this.documents.docIdentityFront),
        identita_retro: this.setDocumentsInfo(this.documents.docIdentityBack),
        consenso_medico: this.setDocumentsInfo(this.documents.docDoctorConsent),
        certificato_medico: this.setDocumentsInfo(this.documents.docDoctorSignature),
        soggiorno: this.setDocumentsInfo(this.documents.docResidencePermit),
        delegante: this.setDocumentsInfo(this.documents.docDelegationForm)
      };

      let isDraft = false;
      if (this.isNotDocuments) {
        isDraft = true;
      }
      this.$store.dispatch('changeDoctor/setAttachments', {attachments: documents});
      let params = {
        id: this.doctor.id,
        codice_fiscale: this.doctor.codice_fiscale,
        toBackOffice: true,
        isDraft: isDraft,
        isReview: this.isReview,
        attachments: documents
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
        codice_fiscale_medico: this.doctor.codice_fiscale,
        cittadinanza: this.requestInfo.cittadinanza,
        domicilio: this.requestInfo.domicilio,
        residenza: this.requestInfo.residenza,
        recapiti: this.requestInfo.recapiti,
        medico_altra_regione: this.requestInfo.medico_altra_regione,
        dati_aggiuntivi: this.requestInfo.dati_aggiuntivi,
        generalita_assistito: {
          nome: this.userInfo.nome,
          cognome: this.userInfo.cognome,
          data_nascita: this.userInfo.data_nascita,
          comune_nascita: this.userInfo.comune_nascita
        }
      };
      let config = {
        responseType: 'arraybuffer',
        _no5XXRedirect: true
      };
      let pdfResponse = await delegationFormPdf(this.cf, params, config);
      // let file = new Blob([pdfResponse.data], {type: 'application/pdf'});
      // let fileURL = URL.createObjectURL(file);
      window.open("data:application/pdf," + encodeURI(pdfResponse.data));

    },
    filterMaxSize(files) {
      return files.filter((file) => {
        return file.size <= MAX_FILE_SIZE
      })
    },

    fileDimensionError(file) {
      if (file)
        return (file.size <= MAX_FILE_SIZE);
      else
        return true
    }
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
