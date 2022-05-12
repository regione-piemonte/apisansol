<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
    <q-page padding>
<!--      <csi-page-title @back="goBack" title="Richiesta effettuata" class="q-mb-md"></csi-page-title>-->
      <template>
        <div  class="q-px-xl q-py-lg ">
          <q-alert type="warning" class="csi-request-alert" >
               <div class="q-body-1 q-pa-md" v-if="temporaryAssistance" >
                 Il medico che hai scelto non ha posti disponibili per l'assistenza temporanea.
               </div>
               <div class="q-body-1 q-pa-md" v-if="childhood" >
                 Il medico che hai scelto non ha posti disponibili per i bambini al di sotto dei 6 anni.
               </div>
              <div class="q-body-1 q-pa-md" v-if="notAvailable">
                Il medico che hai scelto non ha posti disponibili per la tua richiesta.
              </div>

              <div class="q-body-1 q-pa-md" v-if="notAllowed">
                Per poter terminare questa operazione occorre contattare l'ASL di riferimento.
              </div>

              <div class="q-body-1 q-pa-md" v-if="isRefusal">
               Non puoi scegliere questo medico. Contatta l'ASL di riferimento per ulteriori informazioni.
                <br>
                Puoi comunque selezionare un altro medico.
              </div>

          </q-alert>

          <div class="row q-mt-lg justify-end items-center">
            <csi-buttons class="col-12 col-md-auto">
              <csi-button
                primary
                label="Torna alla Homepage"
                @click="goToHomePage()"
              />
              <csi-button
                v-if="!notAllowed"
                secondary
                label="Scegli un altro medico"
                @click="goToSearchDoctors()"
              />
              <csi-button
                v-if="notAvailable && isMonitorable && !isRefusal"
                secondary
                label="Monitora disponibilità"
                @click="doctorMonitoring()"
              />
            </csi-buttons>
          </div>
        </div>


        <!-- MODALS -->
        <csi-monitoring-modal
          v-model="showMonitoringModal"
          :doctor="doctor"
          monitoring
          :cf="cf"
          @monitoring-changed="isMonitoringChanged"
        />

     </template>
        <!--      LOADER-->
      <csi-inner-loading :visible="isLoading" />


    </q-page>
</template>

<script>

  import CsiCardItem from "components/global/common/CsiCardItem";
  import CsiPageTitle from "components/global/common/CsiPageTitle";
  import {config} from "plugins/config";
  import CsiMonitoringModal from "components/change-doctor/CsiMonitoringModal";


export default {
    name: 'PageChangeDoctorNotAvailable',
    components:{CsiMonitoringModal, CsiCardItem, CsiPageTitle},
    data() {
      return {
        isLoading: false,
        notAllowed: false,
        notAvailable:false,
        childhood: false,
        temporaryAssistance: false,
        showMonitoringModal:false,
        isRefusal:false,
      }
    },
    computed: {
      cf(){
        return this.$store.getters['changeDoctor/getTaxCode']
      },

      monitoredDoctors(){
        return this.$store.getters['changeDoctor/getMonitoredDoctors'];
      },
      isDoctorMonitored(){
        if(this.doctor.id && this.monitoredDoctors){
          let getMonitoredDoctor = this.monitoredDoctors.find(d => d.id === this.doctor.id);
          if(getMonitoredDoctor) {
            return true;
          }
        }
        return false;
      },
      isMonitorable(){
        return this.doctor.disponibilita && this.doctor.disponibilita.monitorabile && !this.isDoctorMonitored
      },
      doctor(){
        return this.$store.getters['changeDoctor/getChoosenDoctor']
      },
      userInfo(){
        return  this.$store.getters['changeDoctor/getUserInfo']
      },
      userAddress(){
        let domicile = this.$store.getters['changeDoctor/getNewDomicile'];

         if(domicile){
           return  domicile.indirizzo + ' ' + domicile.comune
         }else{
          return this.userInfo.domicilio.indirizzo + ' ' + this.userInfo.domicilio.comune
         }
      },
    },

  created(){
    this.isLoading=true;
    let{notAvailable, notAllowed, temporaryAssistance, childhood, refusal} = this.$route.params;
    this.notAvailable = notAvailable;
    this.notAllowed = notAllowed;
    this.temporaryAssistance = temporaryAssistance;
    this.childhood = childhood;
    this.isRefusal = refusal;
    this.isLoading=false;
  },

  methods:{
    goToHomePage(){
      this.$router.replace(this.$routes.CHANGE_DOCTOR.HOME)
    },
    goToSearchDoctors(){
      // let route= {
      //   name: this.$routes.CHANGE_DOCTOR.SEARCH_DOCTOR_RESULTS.name,
      //   query: {indirizzo: this.userAddress}
      // };
      // this.$router.push(route)
      //
      //
      this.$router.replace(this.$routes.CHANGE_DOCTOR.SEARCH_DOCTOR);
    },
    doctorMonitoring(){
      this.showMonitoringModal = true
    },
    goBack(){
      this.$router.go(-1)
    },
    isMonitoringChanged(val){
     if(val) this.goToHomePage()
    }
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
