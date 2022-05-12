<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
    <q-page padding>
      <csi-page-title @back="goBack" title="Richiesta dati medico precedente (fuori Piemonte)" class="q-mb-md"></csi-page-title>
      <template v-if="areDefaultValues">
        <!------- AZIENDA MEDICO PRECEDENTE------------>
        <!-- ----------------------------------------------------------------------------------------------------- -->
        <q-card class="bg-white q-my-lg">
          <q-card-title class="q-pt-lg q-pb-none" >
            <h1 class="csi-h1">Azienda sanitaria medico precedente</h1>
          </q-card-title>
          <q-card-main>
            <q-item class="no-padding" >
              <q-item-main>
                <div class="row gutter-x-md ">
                  <q-field class="q-my-md col-xs-12 col-md-6"
                           :error="$v.region.$error"
                           required
                  >
                    <q-select
                      v-model="region"
                      :options="regionsOptions"
                      filter
                      float-label="Regione"
                      placeholder="Seleziona una regione"
                    />
                    <template slot="error-label" >
                      <div v-if="!$v.region.required">Campo obbligatorio</div>
                   <!--  <div v-if="!$v.region.suggest"> Regione non valida. Selezionane una tra quelle suggerite.</div>-->
                    </template>
                  </q-field>
                  <q-field class="q-my-md col-xs-12 col-md-6"
                           required
                           :error="$v.healthcareCompany.$error"
                  >
                    <q-input
                      v-model="healthcareCompany"
                      type="text"
                      clearable=""
                      :after="[{icon: 'done', condition: healthcareCompany!=null && healthcareCompany!='', handler () {}}]"
                      float-label="Azienda sanitaria"
                     />
                    <template slot="error-label" >
                      <div v-if="!$v.healthcareCompany.required">Campo obbligatorio</div>
                    </template>
                  </q-field>
                </div>
              </q-item-main>
            </q-item>

          </q-card-main>
        </q-card>



        <!------- MEDICO------------>
        <!-- ----------------------------------------------------------------------------------------------------- -->
      <q-card class="bg-white q-my-lg">
        <q-card-title class="q-pt-lg q-pb-none" >
          <h1 class="csi-h1">Medico</h1>
        </q-card-title>
        <q-card-main>
                <q-item class="no-padding" >
                  <q-item-main>

                    <div class="row gutter-x-md ">
                    <q-field class="q-my-md col-xs-12 col-md-6"
                             :error="$v.doctorFirstname.$error"
                             required
                    >
                      <q-input
                        v-model="doctorFirstname"
                        type="text"
                        clearable=""
                        :after="[{icon: 'done', condition: doctorFirstname!=null && doctorFirstname!='', handler () {}}]"
                        float-label="Nome"/>
                      <template slot="error-label" >
                        <div v-if="!$v.doctorFirstname.required">Campo obbligatorio</div>
                      </template>
                    </q-field>
                      <q-field class="q-my-md col-xs-12 col-md-6"
                               :error="$v.doctorFirstname.$error"
                               required
                      >
                        <q-input
                          v-model="doctorLastname"
                          type="text"
                          clearable=""
                          :after="[{icon: 'done', condition: doctorLastname!=null && doctorLastname!='', handler () {}}]"
                          float-label="Cognome"/>
                        <template slot="error-label" >
                          <div v-if="!$v.doctorLastname.required">Campo obbligatorio</div>
                        </template>
                      </q-field>
                    </div>
                  </q-item-main>
                </q-item>

        </q-card-main>
      </q-card>



        <div class="row q-mt-lg justify-end items-center">

          <csi-buttons class="col-12 col-md-auto q-pa-sm">
            <csi-button
              primary
              type="submit"
              label="Prosegui"
              :loading="isLoading"
              @click="addDoctorInfo()" />
<!--            <span class="loader-container col-md-auto col-12">   <csi-inner-loading :visible="isLoading" block /></span>-->
          </csi-buttons>
        </div>


          <!-- MODALS -->
          <!-- ----------------------------------------------------------------------------------------------------------- -->


     </template>
        <!--      LOADER-->
      <csi-inner-loading :visible="!areDefaultValues" />


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
  import {routes} from "plugins/routes";
  import router from "@router/index";
  import {assistanceControl} from "@services/change-doctor/business-logic";
  import {goToAdditionalInformation, maximumCoverageControl} from "../../services/change-doctor/business-logic";




export default {
    name: 'PageDoctorAnotherRegion',
    components:{CsiCardItem, CsiPageTitle},
    data() {
      return {
        region: null,
        regionsOptions:null,
        healthcareCompany:'',
        doctorFirstname:'',
        doctorLastname:'',
        isLoading : false,
      }
    },
  validations(){
      return{
        region:{required},
        healthcareCompany:{required},
        doctorFirstname:{required},
        doctorLastname:{required},
      }

  },
    computed: {
      userInfo(){
        return this.$store.getters['changeDoctor/getUserInfo']
      },
      areDefaultValues() {
        if (this.regionsOptions && this.userInfo) return true
      },
      choosenDoctor(){
        return this.$store.getters['changeDoctor/getChoosenDoctor'];
      },
      combinationControl(){
        return this.$store.getters['changeDoctor/getCombinationControl'];
      },
      isProduction(){
        return this.$config.global.isProduction
      },
    },

  async created(){
    if(!this.combinationControl){
      this.$router.replace(this.$routes.CHANGE_DOCTOR.HOME);
    }
    let {regione, asl, nome, cognome} =  this.$route.query;
    this.region = regione ? parseInt(regione) : null;
    this.healthcareCompany = asl ? asl : '';
    this.doctorFirstname = nome ? nome : '';
    this.doctorLastname = cognome ? cognome : '';

    this.getDefaultDataForm()
  },

  methods:{
    async getDefaultDataForm(){
      let regionsResponse = await getRegions();
       let regionsList = regionsResponse.data;
      let regionsOptions=[];
      if (regionsList) {
        // Deve essere l'elenco delle "Altre regioni"
        // quindi escludiamo la regione Piemonte dalla lista
        regionsOptions = regionsList.filter(r => {
          return r.desc.toUpperCase() !== 'PIEMONTE'
        });

        regionsOptions = regionsOptions.map(region => {
          let label = capitalize(region.desc);
          return {label, value: region.codice_istat}
        });


        this.regionsOptions = orderBy(regionsOptions, ['label']);
      }
    },

    goBack(){
      this.$router.go(-1)
    },

    addDoctorInfo(){
      this.$v.$touch();
      if (this.$v.$error) {
        return
      }
        let region = this.regionsOptions.find(region => region.value === this.region);

        let doctorInfo= {
          regione: region ? region.label : '',
          azienda_sanitaria: this.healthcareCompany,
          nome: this.doctorFirstname,
          cognome: this.doctorLastname
        };

        this.$store.dispatch('changeDoctor/setDoctorAnotherRegion', {doctor: doctorInfo});
        this.$router.replace({ path: this.$router.history.current.fullPath , query: doctorInfo });

        if(this.isProduction){
          assistanceControl(this.combinationControl, this.choosenDoctor)
        }else{
          let query = this.$route.query;
          if(query){
            goToAdditionalInformation(this.choosenDoctor, query)
          }else{
            maximumCoverageControl(this.combinationControl, this.choosenDoctor)
          }

        }


    }
  }

}
</script>
<style scoped lang="stylus">
  .loader-container
    max-height : 30px
    display : flex
    align-items : center
    justify-content : center

</style>
