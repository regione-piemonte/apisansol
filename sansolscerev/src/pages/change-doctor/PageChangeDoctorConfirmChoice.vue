<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
    <q-page padding>
      <csi-page-title @back="goBack" title="Conferma scelta medico" class="q-mb-md"></csi-page-title>
      <template v-if="isData">
        <div  class="q-px-xl q-py-lg ">

          <q-alert type="warning" class="csi-request-alert" v-if = "isDraft">
            <div class="q-body-1 q-pa-md">
              La tua richiesta sarà salvata come bozza. Potrai completarla dopo aver allegato i documenti richiesti.
            </div>
          </q-alert>

          <template v-else>
            <template v-if="isAssistanceRenewal">
              <q-alert type="warning" class="csi-request-alert">
                <div class="q-body-1 q-pa-md">
                  Stai rinnovando l'assistenza del medico {{userDoctor.cognome | upperCase}} {{userDoctor.nome}}.
                </div>
              </q-alert>
            </template>
            <template v-else>
              <q-alert type="warning" class="csi-request-alert" v-if = "!toBackOffice">
                <div class="q-body-1 q-pa-md" v-if="userDoctor">
                  Stai revocando il medico {{userDoctor.cognome | upperCase}} {{userDoctor.nome}} per sostituirlo con {{doctor.cognome | upperCase}} {{doctor.nome}}
                </div>
                <div class="q-body-1 q-pa-md" v-else>
                  Stai richiedendo l'assistenza del medico {{doctor.cognome | upperCase}} {{doctor.nome}}.
                </div>
              </q-alert>
              <template  v-if = "toBackOffice && !isReview">
                <q-alert type="warning" class="csi-request-alert">
                  <div class="q-body-1 q-pa-md">
                    Stai richiedendo l'assistenza del medico {{doctor.cognome | upperCase}} {{doctor.nome}}.
                    <br>
                    La tua domanda dovrà essere verificata da un operatore.
                  </div>
                </q-alert>

              </template>
              <template  v-if = "isReview">
                <q-alert type="warning" class="csi-request-alert">
                  <div class="q-body-1 q-pa-md">
                    Stai inviando la rettifica della domanda n°{{requestInformation.id}}.
                  </div>
                </q-alert>
              </template>
            </template>
            <q-card class="bg-white q-my-lg"  v-if = "toBackOffice">
              <q-card-main>
                <q-item class="no-padding" >
                  <q-item-main>
                    <q-field class="q-my-md">
                      <q-input v-model="notes" float-label="Eventuali comunicazioni per l'ASL" type="textarea" />
                    </q-field>
                  </q-item-main>
                </q-item>
                <q-item class="no-padding q-mt-md" v-if="!isReview">
                  <q-item-main>

                    <q-field class="q-my-md"
                             :error="$v.telephone.$error"
                             required>
                      <q-input
                        v-model.trim="telephone"
                        :after="[{icon: 'done', condition: telephone!== null && telephone!=='', handler () {}}]"
                        float-label="Numero di telefono per comunicazioni sulla domanda"
                        type="text"
                        clearable
                      />
                      <template slot="error-label" >
                        <div v-if="!$v.telephone.required">Campo obbligatorio</div>
                      </template>
                    </q-field>
                  </q-item-main>
                </q-item>
              </q-card-main>
            </q-card>
          </template>

          <div class="row q-mt-lg justify-end items-center">
            <csi-buttons class="col-12 col-md-auto">
              <csi-button
                primary
                label="Conferma"
                @click="postRequest()"
                :loading="isLoading"
              />
              <csi-button
                secondary
                label="Annulla"
                @click="cancel()"

              />
            </csi-buttons>
          </div>


        </div>

     </template>
        <!--      LOADER-->
      <csi-inner-loading :visible="!isData" />


    </q-page>
</template>

<script>

  import CsiCardItem from "components/global/common/CsiCardItem";
  import CsiPageTitle from "components/global/common/CsiPageTitle";
  import {
    combinationControl,
    getDoctorDetails,
    newChangeDoctorRequest,
    requestCorrection
  } from "@services/api/change-doctor";
  import {
   isAura
  } from "@services/change-doctor/business-logic";
  import {is4XX, notifyError} from "@services/api/utils";
  import {routes} from "plugins/routes";
  import router from "@router/index";
  import {isEmpty} from "@services/global/utils";


export default {
    name: 'PageChangeDoctorConfirmChoice',
    components:{CsiCardItem, CsiPageTitle},
    data() {
      return {
        isLoading: false,
        isLoadingData:false,
        doctorId: null,
        doctorCf: null,
        doctor:null,
        userDoctor:null,
        isDraft: false,
        isReview:false,
        feedback: null,
        notes: '',
        telephone:'',
        attachments: null,
        combinationControl: null
      }
    },
  validations(){
    return{
      telephone:{
        required: v =>  !!v || !this.showNotesField,
      },
    }
    },
    computed: {
      userInfo(){
        return this.$store.getters['changeDoctor/getUserInfo']
      },
      requestInformation(){
        let info = this.userInfo.richiesta_cambio;
        if(!info)
          info = this.$store.getters['changeDoctor/getRequestInformation'];

        return info
      },
      cf(){
        return this.$store.getters['changeDoctor/getTaxCode']
      },
      isData(){
         return (this.userInfo && this.requestInformation && this.doctor && this.combinationControl) || this.isReview
      },

      toBackOffice(){
        return this.$store.getters['changeDoctor/getIsToBackoffice']
      },
      showNotesField(){
        return this.toBackOffice && !this.isDraft && !this.isReview
      },
      userDoctorDetails(){
        return this.$store.getters['changeDoctor/getUserDoctorDetails'];
      },
      choosenDoctor(){
        return this.$store.getters['changeDoctor/getChoosenDoctor'];
      },
      isAssistanceRenewal() {
        return this.$store.getters['changeDoctor/isAssistanceRenewal'];
      },

    },

  created(){
    if(isEmpty(this.requestInformation)){
      this.$router.replace(this.$routes.CHANGE_DOCTOR.HOME);
    }else{
      let {id, codice_fiscale,  isDraft, isReview, attachments}  = this.$route.params;
      this.doctorId = id;
      this.doctorCf = codice_fiscale;
      this.isDraft = isDraft ? isDraft : false;
      this.isReview = isReview ? isReview : false;
      this.attachments = attachments ? attachments : null;

      if(!this.isReview){
        if(this.requestInformation && this.requestInformation.recapiti){
          this.telephone = this.requestInformation.recapiti.telefono;
        }else{
          this.telephone = this.userInfo.recapiti ? this.userInfo.recapiti.telefono : '';
        }
      }else{
        this.telephone = this.userInfo.recapiti ? this.userInfo.recapiti.telefono : '';
      }

      if(!this.isReview)
        this.setRequestInfo(this.requestInformation)
    }

  },

  methods:{
   postRequest(){
     this.$v.$touch();
     if (this.$v.$error) {
       return
     }
      this.isLoading = true;
      if(this.isReview){
        this.changeRequest()
      }else{
        this.changeDoctor()
      }

    },
   async  setRequestInfo(info){
     if(!this.userDoctorDetails){
       let userDoctorCf= this.userInfo.medico ? this.userInfo.medico.codice_fiscale : null;
       let userDoctorPromise = null;
       if(userDoctorCf){
         try{
           userDoctorPromise = await getDoctorDetails(userDoctorCf, {_no5XXRedirect: true});
           this.userDoctor = userDoctorPromise ? userDoctorPromise.data : null;
         }catch (e) {
           console.log(e)
         }
       }
     }else{
       this.userDoctor = this.userDoctorDetails
     }
        if(!this.choosenDoctor){
          try{
            let newDoctorInfoPromise = await getDoctorDetails(this.doctorCf, {_no5XXRedirect: true});
            this.doctor = newDoctorInfoPromise.data;
          }catch (e) {
            console.log(e)
          }
        }else{
          this.doctor = this.choosenDoctor
        }

        let savedCombinationControl = this.$store.getters['changeDoctor/getCombinationControl'];
      if(info.controllo_combinazione){
        this.combinationControl = info.controllo_combinazione
      }else if(savedCombinationControl){
        this.combinationControl = savedCombinationControl
      }else{
        let combinationParams = {
          codice_fiscale_medico: this.doctorCf,
          medico_altra_regione: this.userInfo.medico_altra_regione,
          cittadinanza: this.requestInformation.cittadinanza ? this.requestInformation.cittadinanza : this.userInfo.cittadinanza ,
          domicilio: this.requestInformation.domicilio ? this.requestInformation.domicilio: this.userInfo.domicilio,
          residenza: this.requestInformation.residenza ? this.requestInformation.residenza: this.userInfo.residenza,
          rinnovo_assistenza:this.isAssistanceRenewal
        };
          let combinationresponse = await combinationControl(this.cf, combinationParams, {_no5XXRedirect: true});
          this.combinationControl = combinationresponse.data;
          this.$store.dispatch('changeDoctor/setCombinationControl', {combination: this.combinationControl});
      }
    },
    setQueryParams(){
      let emptyAdditionalInfo={
        motivazione_soggiorno: null,
        motivazione_domicilio:  null,
        assitenza_temporanea_data_fine_validita: null,
        note: null,
        lavoro_tipologia: null,
        lavoro_professione: null,
        lavoro_partita_iva: null,
        lavoro_numero_iscrizione:  null,
        lavoro_azienda:  null,
        lavoro_azienda_telefono: null,
        lavoro_azienda_provincia:  null,
        lavoro_azienda_comune: null,
        lavoro_azienda_indirizzo: null,
        lavoro_azienda_civico:null,
        lavoro_data_fine_validita_contratto: null,
        studio_nome_istituto:null,
        studio_istituto_provincia: null,
        studio_istituto_comune: null,
        studio_istituto_indirizzo: null,
        studio_istituto_civico:  null,
        studio_data_termine_iscrizione:  null,
        ricongiungimento_nome:  null,
        ricongiungimento_cognome:  null,
        ricongiungimento_codice_fiscale: null,
        ricongiungimento_parentela: null
      };

      let citizenship = this.requestInformation.cittadinanza ?  this.requestInformation.cittadinanza : this.userInfo.cittadinanza  ;
      let domicile = this.requestInformation.domicilio ?  this.requestInformation.domicilio : null;
      let residence = this.requestInformation.residenza ? this.requestInformation.residenza : null;
      let contacts = this.requestInformation.recapiti ? this.requestInformation.recapiti : null;
      let doctorAnotherRegion = this.requestInformation.medico_atra_regione ? this.requestInformation.medico_atra_regione : null;
      let additionalInfo =this.requestInformation.dati_aggiuntivi ? this.requestInformation.dati_aggiuntivi : null;

      if(this.toBackOffice){
        let telephone = !isEmpty(this.telephone) ? ". Telefono per comunicazioni sulla domanda: " + this.telephone : '';
        additionalInfo = this.requestInformation.dati_aggiuntivi ? this.requestInformation.dati_aggiuntivi: emptyAdditionalInfo;
        additionalInfo.note = this.notes + telephone
      }



      //let attachments = this.attachments ? this.attachments : null;

      let params = {
        rinnovo_assistenza:this.isAssistanceRenewal,
        controllo_combinazione: this.combinationControl,
        cittadinanza: citizenship,
        domicilio: domicile,
        residenza: residence,
        recapiti: contacts,
        bozza:  this.isDraft,
        medico_altra_regione: doctorAnotherRegion,
        dati_aggiuntivi: additionalInfo,
        allegati: this.attachments
      };

      return params
    },
    async changeRequest(){
     let telephone = !isEmpty(this.telephone) ? ". Telefono per comunicazioni sulla domanda: " + this.telephone : '';
      let newData = {
        note: this.notes + telephone,
        allegati: this.attachments
      };
      try{
        let correctionPromise =  await requestCorrection(this.cf, this.requestInformation.id, newData, {_no5XXRedirect: true});
        let correctionResponse = correctionPromise.data;
        this.feedback = {request:correctionResponse, isReview: true};
      }catch(e){
        console.log(e.response.data);
        if (is4XX(e)) {
          this.feedback = {errorRequest: e.response.data}
        } else {
          let message = `I dati potrebbero non essere corretti.`;
          this.feedback = {errorRequest: message}
        }
      }finally{
        this.isLoading=false;
        let route = {
          name:this.$routes.CHANGE_DOCTOR.REQUEST_FEEDBACK.name,
          params: this.feedback
        };
        this.$router.replace(route)
      }

    },
    async changeDoctor(){
      let params = this.setQueryParams();
      try{
        let changeDoctorResponse =  await newChangeDoctorRequest(this.cf, this.doctorCf, params, {_no5XXRedirect: true});
        let newRequest = changeDoctorResponse.data;
        this.feedback = {request:newRequest}
      }catch (e) {
        let message = `I dati potrebbero non essere corretti.`;
        if (is4XX(e)) {
          let errorMsg = e.response.data ? e.response.data.title : message
          this.feedback = {errorRequest: errorMsg}
        } else {
          this.feedback = {errorRequest: message}
        }
      }finally{
        this.isLoading=false;
        if(this.feedback.errorRequest && this.feedback.errorRequest.notAvailable){
          this.goToDoctorNotAvailable()
        }else{
          let route = {
            name:this.$routes.CHANGE_DOCTOR.REQUEST_FEEDBACK.name,
            params: this.feedback
          };
          this.$router.replace(route)
        }
      }

    },

    cancel(){
      this.$router.push(this.$routes.CHANGE_DOCTOR.HOME)
    },

    goToDoctorNotAvailable(){
      let params = {id: this.doctorId, codice_fiscale: this.doctorCf};
      let route = {
        name: routes.CHANGE_DOCTOR.REQUEST_DOCTOR_NOT_AVAILABLE.name,
        params
      };
      router.replace(route);

    },
    goBack(){
      this.$router.go(-1)
    },


  }

}
</script>
<style lang="stylus">
  .csi-request-alert
    .q-alert-side
      align-self: center
      background : none
      @media (max-width: 480px)
        display:none

</style>
