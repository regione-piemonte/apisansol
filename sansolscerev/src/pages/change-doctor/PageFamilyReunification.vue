<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
    <q-page padding>
      <csi-page-title @back="goBack" title="Ricongiungimento familiare" class="q-mb-md"></csi-page-title>



        <!------- MOTIVAZIONE RICONGIUNGIMENTO FAMILIARE------------>
        <!-- ----------------------------------------------------------------------------------------------------- -->

          <div class="row change-doctor-home-title">
            <p class="csi-text">
              Questo medico è disponibile soltanto in caso di ricongiungimento familiare.
            </p>
            <p class="csi-text">
              Completa il modulo qui sotto con i dati del tuo familiare.
            </p>
          </div>
          <q-alert type="info" class="q-my-md csi-modal-alert" >
            <div class="q-pa-md">
              Ricorda che il familiare deve essere presente nel tuo stato di famiglia e deve essere un assistito del medico che stai scegliendo.
            </div>
          </q-alert>

          <q-card class="bg-white q-my-lg">
            <q-card-title class="q-pt-lg q-pb-none" >
              <h1 class="csi-h1">Dati del familiare</h1>
            </q-card-title>
            <q-card-main ref="familyMotivationForm">
              <q-item class="no-padding">
                <q-item-main>
                  <div class="row gutter-x-md" >
                    <q-field class="q-my-md col-xs-12 col-md-6"
                             :error="$v.firstname.$error"
                             required
                    >
                      <q-input
                        v-model="firstname"
                        type="text"
                        clearable=""
                        float-label="Nome">
                      </q-input>
                      <template slot="error-label" >
                        <div v-if="!$v.firstname.required">Campo obbligatorio</div>
                      </template>

                    </q-field>
                    <q-field class="q-my-md col-xs-12 col-md-6"
                             :error="$v.lastname.$error"
                             required>
                      <q-input
                        v-model="lastname"
                        type="text"
                        clearable=""
                        float-label="Cognome">
                      </q-input>
                      <template slot="error-label" >
                        <div v-if="!$v.lastname.required">Campo obbligatorio</div>
                      </template>
                    </q-field>
                  </div>
                  <div class="row gutter-x-md" >
                    <div class="q-my-md col-xs-12 col-md-6">
                      <!-- CODICE FISCALE -->
                      <csi-input-tax-code
                        required
                        v-model="taxCode"
                        :error="$v.taxCode.$error"
                        clearable="">

                        <div slot="error-label">
                          <slot name="tax-code-error-label">
                            <div v-if="!$v.taxCode.required">Campo obbligatorio</div>
                            <div v-if="!$v.taxCode.numeric">Deve essere composto solo da numeri</div>
                            <div v-if="!$v.taxCode.alphaNum">Deve essere composto solo da lettere e numeri</div>
                            <div v-if="!$v.taxCode.taxCodeLength">Deve avere esattamente {{taxCodeTemporaryLength}} o {{taxCodeLength}}
                              caratteri
                            </div>
                            <div v-if="!$v.taxCode.sameUser">Deve essere diverso dal tuo codice fiscale
                            </div>
                            <div v-else>
                              <div v-if="!$v.taxCode.taxCodeCin">
                                Il codice di controllo non è corretto, potrebbero esserci degli errori di battitura
                              </div>
                            </div>
                          </slot>
                        </div>

                      </csi-input-tax-code>

                    </div>

                    <q-field class="q-my-md col-xs-12 col-md-6"
                             :error="$v.relationship.$error"
                             required>
                      <q-select
                        v-model="relationship"
                        :options="relationshipOptions"
                        float-label="Rapporto di parentela"
                      />
                      <template slot="error-label" >
                        <div v-if="!$v.relationship.required">Campo obbligatorio</div>
                      </template>
                    </q-field>
                  </div>
                </q-item-main>
              </q-item>

            </q-card-main>
          </q-card>


        <!--ACTIONS--->
        <div class="row q-mt-lg justify-end items-center">
          <csi-buttons class="col-12 col-md-auto q-pa-sm">
            <csi-button
              primary
              type="submit"
              label="Prosegui"
              :loading="isLoading"
              @click="addAdditionalInfo()" />
<!--            <span class="loader-container col-md-auto col-12">   <csi-inner-loading :visible="isLoading" block /></span>-->
          </csi-buttons>
        </div>



        <!--      LOADER-->
<!--      <csi-inner-loading :visible="!areDefaultValues" />-->

    </q-page>
</template>

<script>

  import CsiCardItem from "components/global/common/CsiCardItem";
  import {deepClone, hasTrueValue, isEmpty, orderBy, scrollToElement, unionBy} from "@services/global/utils";
  import {capitalize, toUpper} from "@filters/cases";
  import CsiPageTitle from "components/global/common/CsiPageTitle";
  import required from "vuelidate/lib/validators/required";
  import {
    goToAttachments, goToConfirmRequest,
    maximumCoverageControl
  } from "@services/change-doctor/business-logic";
  import addMonths from 'date-fns/add_months';
  import isAfter from "date-fns/is_after";
  import CsiInputTaxCode from 'components/global/forms/CsiInputTaxCode';
  import {taxCodeCin, taxCodeLength, taxCodeTemporaryLength} from "@validators/taxCode";
  import {alphaNum, numeric} from "vuelidate/lib/validators";
  import {LENGTH, TEMPORARY_LENGTH} from "@services/global/tax-code";
  import {format} from "@filters/date";
  import store from "@store/index";
  import {getDomicileMotivation} from "@services/api/change-doctor";
  import {notifyError} from "@services/api/utils";

  export default {
    name: 'PageFamilyReunification',
    components:{CsiCardItem, CsiPageTitle, CsiInputTaxCode},
    data() {
      return {
        firstname:'',
        lastname:'',
        taxCode:'',
        relationship:'',
        relationshipOptions: [],
        isLoading : false,
        doctorInfo:null,
        newQueryParams : null,
        additionalInfo: {
          motivazione_soggiorno: null,
          motivazione_domicilio: null,
          assitenza_temporanea_data_fine_validita: null,
          note:null,
          lavoro_tipologia:  null,
          lavoro_professione:  null,
          lavoro_partita_iva:  null,
          lavoro_numero_iscrizione:null,
          lavoro_azienda:  null,
          lavoro_azienda_telefono:  null,
          lavoro_azienda_provincia: null,
          lavoro_azienda_comune:  null,
          lavoro_azienda_indirizzo: null,
          lavoro_azienda_civico:  null,
          lavoro_data_fine_validita_contratto: null,
          studio_nome_istituto: null,
          studio_istituto_provincia:  null,
          studio_istituto_comune:  null,
          studio_istituto_indirizzo:null,
          studio_istituto_civico:  null,
          studio_data_termine_iscrizione:  null,
          ricongiungimento_nome:  null,
          ricongiungimento_cognome:  null,
          ricongiungimento_codice_fiscale: null,
          ricongiungimento_parentela: null
        }
      }
    },
    validations(){
      return{
        firstname:{
          required: v => !!v
        },
        lastname:{
          required: v => !!v
        },
        taxCode: {
          required: v => !!v,
          numeric: (taxCode = '') => !taxCodeTemporaryLength(taxCode) || numeric(taxCode),
          // Deve fallire solo se la lunghezza è quella di un CF normale ed i caratteri non sono alfanumerici
          alphaNum: (taxCode = '') =>  !taxCodeLength(taxCode) || alphaNum(taxCode),
          taxCodeLength: (taxCode = '') =>  taxCodeLength(taxCode) || taxCodeTemporaryLength(taxCode),
          // Deve fallire solo se la lunghezza è quella di un CF normale ed i CIN non corretto
          taxCodeCin: (taxCode = '') =>  !taxCodeLength(taxCode) || taxCodeCin(taxCode),
          // Deve fallire se il cf inserito è uguale al cf dell'utente
          sameUser: (taxCode = '') => !this.taxCodeUser(taxCode),
        },
        relationship:{
          required: v =>  !!v
        },
      }

    },
    computed: {
      userInfo(){
        return this.$store.getters['changeDoctor/getUserInfo']
      },
      cf(){
        return this.$store.getters['changeDoctor/getTaxCode']
      },
      isProduction(){
        return this.$config.global.isProduction
      },
      taxCodeLength() {
        return LENGTH
      },
      taxCodeTemporaryLength() {
        return TEMPORARY_LENGTH
      },
      choosenDoctor(){
        return this.$store.getters['changeDoctor/getChoosenDoctor'];
      },
      combinationControl(){
        return this.$store.getters['changeDoctor/getCombinationControl'];
      },

      isFamilyReunificationInfo(){
        this.$store.getters['changeDoctor/getFamilyReunionInfo'];
      },

    },

    async created(){
      if(!this.combinationControl){
        this.$router.replace(this.$routes.CHANGE_DOCTOR.HOME);
      }
      this.doctorInfo = this.$route.params;
      this.relationshipOptions = this.$config.changeDoctor.relationshipOptions;

      // let savedAdditionalInfo = this.$store.getters['changeDoctor/getAdditionalInfo'];
      // if(savedAdditionalInfo){
      //   this.additionalInfo = savedAdditionalInfo
      // }

      this.getQueryParams();
    },

    methods:{
      getQueryParams(){
        let query = this.$route.query;
        if(!isEmpty(query)){
          this.firstname = query.ricongiungimento_nome ? query.ricongiungimento_nome : '';
          this.lastname = query.ricongiungimento_cognome ? query.ricongiungimento_cognome : '';
          this.taxCode = query.ricongiungimento_codice_fiscale ? query.ricongiungimento_codice_fiscale : '';
          this.relationship = query.ricongiungimento_parentela ?  query.ricongiungimento_parentela : '';
        }
      },

      goBack(){
        this.$router.go(-1)
      },
      taxCodeUser(taxCode){
        return taxCode === this.cf
      },
      async addAdditionalInfo() {
        this.$v.$touch();
        if (this.$v.$error) {
          scrollToElement(this.$refs.familyMotivationForm.$el);
          return
        }
        this.isLoading =true;

        let savedAdditionalInfo = this.$store.getters['changeDoctor/getAdditionalInfo'];
        if(savedAdditionalInfo){
          this.additionalInfo.motivazione_soggiorno = savedAdditionalInfo.motivazione_soggiorno
        }


        try{
          let domicilePromise = await getDomicileMotivation();
          let domicileResponse = domicilePromise.data;
          if(domicileResponse)
            this.additionalInfo.motivazione_domicilio = domicileResponse.find(item => item.id === this.$config.changeDoctor.DomicileReasons.RICONGIUNGIMENTO_DEROGA);
        }catch (e) {
          notifyError(e, 'Impossibile effettuare il salvataggio dei dati. Riprovare.');
          this.isLoading=false;
          return
        }

        let familyInfo = {
          ricongiungimento_nome : this.firstname,
          ricongiungimento_cognome :  this.lastname,
          ricongiungimento_codice_fiscale : this.taxCode,
          ricongiungimento_parentela : this.relationship,
        };

        this.additionalInfo.ricongiungimento_nome = familyInfo.ricongiungimento_nome;
        this.additionalInfo.ricongiungimento_cognome =  familyInfo.ricongiungimento_cognome;
        this.additionalInfo.ricongiungimento_codice_fiscale = familyInfo.ricongiungimento_codice_fiscale;
        this.additionalInfo.ricongiungimento_parentela = familyInfo.ricongiungimento_parentela;

        this.$store.dispatch('changeDoctor/setAdditionalInformation', {info: this.additionalInfo});
        this.$store.dispatch('changeDoctor/setIsToBackoffice', {value:true});
        this.$store.dispatch('changeDoctor/setIsFamilyReunionInfo', {info: true});
        this.$router.replace({path: this.$router.history.current.fullPath, query: familyInfo});

        const attachments = store.getters['changeDoctor/getAttachmentsOptions'];
        this.isLoading =false;
        let params =  {
          id: this.choosenDoctor.id,
          codice_fiscale: this.choosenDoctor.codice_fiscale
        };

        if(hasTrueValue(attachments))
          goToAttachments(params, {});
        else
          goToConfirmRequest(params)
      },

    }

  }

</script>
<style scoped lang="stylus">
  .change-doctor-home-title
    margin-top: 48px;

  .loader-container
    max-height : 30px
    display : flex
    align-items : center
    justify-content : center

</style>
