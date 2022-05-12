<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
    <q-page padding>
      <csi-page-title @back="goBack" title="Richiesta di rinnovo assistenza" class="q-mb-md"></csi-page-title>
      <template v-if="userInfo">
        <div  class="q-px-xl q-py-lg ">

          <q-alert type="warning" class="csi-request-alert" >
            <div class="q-body-1 q-pa-md">
              Il tuo diritto all'assistenza sanitaria scadrà il {{userInfo.data_fine_assistenza | format}}
              <br>
              Desideri rinnovarla a partire da oggi?
            </div>
          </q-alert>
          <div class="row q-mt-lg justify-end items-center">
            <csi-buttons class="col-12 col-md-auto">
              <csi-button
                primary
                label="Si, rinnova assistenza"
                @click="renewAssistance(true)"
              />
              <csi-button
                secondary
                label="No, non rinnovare"
                @click="renewAssistance(false)"
              />
            </csi-buttons>
          </div>


        </div>

     </template>
        <!--      LOADER-->
      <csi-inner-loading :visible="!userInfo" />


    </q-page>
</template>

<script>

  import CsiCardItem from "components/global/common/CsiCardItem";
  import qs from 'qs';
  import {getRegions} from "@services/api/cross";
  import {isEmpty, orderBy} from "@services/global/utils";
  import {capitalize, toUpper} from "@filters/cases";
  import CsiPageTitle from "components/global/common/CsiPageTitle";
  import {
    assistanceControl, maximumCoverageControl, goToAdditionalInformation, goToAttachments, goToConfirmRequest,
  } from "@services/change-doctor/business-logic";

export default {
    name: 'PageRenewAssistance',
    components:{CsiCardItem, CsiPageTitle},
    data() {
      return {
        isLoading: false,
        doctorInfo: null
      }
    },
    computed: {
      userInfo(){
        return this.$store.getters['changeDoctor/getUserInfo']
      },

      isDelegation(){
        return this.$store.getters['changeDoctor/isDelegationActive']
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

  created(){
    if(!this.combinationControl){
      this.$router.replace(this.$routes.CHANGE_DOCTOR.HOME);
    }
  },

  methods:{
    renewAssistance(value){
      this.$store.dispatch('changeDoctor/setRenewTemporaryAssistance', {value: value});
      if(this.isProduction){
        if(value){
          assistanceControl(this.combinationControl, this.choosenDoctor)
        }else{
          maximumCoverageControl(this.combinationControl, this.choosenDoctor)
        }
      }else{
        let query = this.$route.query;
        let addInfo = query.addInfo === 'true'
        if(value || addInfo){
          query.addInfo = value
          goToAdditionalInformation(this.choosenDoctor, query)
        }else{
          maximumCoverageControl(this.combinationControl, this.choosenDoctor)
        }
      }



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
