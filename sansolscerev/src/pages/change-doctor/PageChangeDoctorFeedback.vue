<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
    <q-page padding>
<!--      <csi-page-title @back="goBack" title="Richiesta effettuata" class="q-mb-md"></csi-page-title>-->
      <template>
        <div  class="q-px-xl q-py-lg ">
          <q-alert type="positive" class="csi-request-alert" v-if="isAutomatic" >
            <div class="q-body-1 q-pa-md">
              La tua richiesta è andata a buon fine.
            </div>
          </q-alert>
          <q-alert type="positive" class="csi-request-alert" v-if="isSended" >
            <div class="q-body-1 q-pa-md">
              <div class="q-mb-sm">La tua richiesta è stata inviata ad un operatore.</div>
              <div v-if="!isDelegation">
                <template v-if="isUserContactEmail">
                  Controlla le preferenze di notifica nella tua pagina <a href="/la-mia-salute/profilo-utente/#/contatti">profilo</a>
                  se hai indicato di voler ricevere notifiche per il servizio "il mio medico",
                  così ti  invieremo una notifica per aggiornarti sull'avanzamento della tua pratica.
                </template>
                <template v-else>
                  Aggiungi un'email al tuo <a href="/la-mia-salute/profilo-utente/#/contatti">profilo</a>
                  e indica di voler ricevere notifiche per il servizio "il mio medico",
                  così ti  invieremo una notifica per aggiornarti sull'avanzamento della tua pratica.
                </template>
              </div>
              <div v-else>Una volta processata riceverai una notifica.</div>
            </div>
          </q-alert>
          <q-alert type="positive" class="csi-request-alert" v-if="isDraft" >
            <div class="q-body-1 q-pa-md">
              Il salvataggio della richiesta come bozza è andato a buon fine.
            </div>
          </q-alert>
          <q-alert type="warning" class="csi-request-alert" v-if="notAllowed">
            <div class="q-body-1 q-pa-md">
              Per poter terminare questa operazione occorre contattare l'ASL di riferimento.
            </div>
          </q-alert>
          <q-alert type="warning" class="csi-request-alert" v-if="isRejected">
            <div class="q-body-1 q-pa-md">
              La tua richiesta è stata respinta.
              Per poter terminare questa operazione occorre contattare l'ASL di riferimento.
            </div>
          </q-alert>
          <q-alert type="negative" class="csi-request-alert" v-if="errorRequest">
            <div class="q-body-1 q-pa-md">
              La richiesta non è andata a buon fine.
              <br>
              {{errorRequest}}
            </div>
          </q-alert>
          <q-alert type="positive" class="csi-request-alert" v-if="isReview">
            <div class="q-body-1 q-pa-md">
             La rettifica della domanda è stata inviata con successo.
            </div>
          </q-alert>

          <q-alert type="positive" class="csi-request-alert" v-if="isWorkInProgress">
            <div class="q-body-1 q-pa-md">
              <div class="q-mb-sm">La domanda è stata inviata con successo.</div>
              <div v-if="!isDelegation">
                <template v-if="isUserContactEmail">
                  Controlla le preferenze di notifica nella tua pagina <a href="/la-mia-salute/profilo-utente/#/contatti">profilo</a>
                  se hai indicato di voler ricevere notifiche per il servizio "il mio medico",
                  ti  invieremo una notifica per aggiornarti sull'avanzamento della tua pratica.
                </template>
                <template v-else>
                  Aggiungi un'email al tuo <a href="/la-mia-salute/profilo-utente/#/contatti">profilo</a>
                  e indica di voler ricevere notifiche per il servizio "il mio medico",
                  così ti  invieremo una notifica per aggiornarti sull'avanzamento della tua pratica.
                </template>
              </div>
            </div>

          </q-alert>
          <div class="row q-mt-lg justify-end items-center">
            <csi-buttons class="col-12 col-md-auto">
              <csi-button
                primary
                label="Torna alla Homepage"
                @click="goToHomePage()"
                :loading="isLoading"
              />
            </csi-buttons>
          </div>
        </div>

     </template>
<!--        &lt;!&ndash;      LOADER&ndash;&gt;-->
<!--      <csi-inner-loading :visible="isLoading" />-->


    </q-page>
</template>

<script>

  import CsiCardItem from "components/global/common/CsiCardItem";
  import CsiPageTitle from "components/global/common/CsiPageTitle";
  import {
     getUserInfo
  } from "@services/api/change-doctor";
  import {isEmpty} from "@services/global/utils";
  import {config} from "plugins/config";


export default {
    name: 'PageChangeDoctorFeedback',
    components:{CsiCardItem, CsiPageTitle},
    data() {
      return {
        isLoading: false,
        request: null,
        notAllowed:false,
        errorRequest:false,
        isAutomatic: false,
        isSended:false,
        isDraft:false,
        notAvailable :false,
        isReview:false,
        isRejected:false,
        isWorkInProgress:false
      }
    },
    computed: {
      cf(){
        return this.$store.getters['changeDoctor/getTaxCode']
      },
      combinationControl(){
        return this.$store.getters['changeDoctor/getCombinationControl'];
      },
      userContacts() {
        let userProfile = this.$store.getters['global/user'];
        return userProfile ? userProfile.contacts : null
      },
      isUserContactEmail(){
        return this.userContacts && this.userContacts.email
      },
      isDelegation() {
        return this.$store.getters['changeDoctor/isDelegationActive']
      },

    },

  created(){
    if(isEmpty(this.$route.params)){
      this.$router.replace(this.$routes.CHANGE_DOCTOR.HOME);
    }else{
      let{request, notAllowed, errorRequest, notAvailable} = this.$route.params;
      this.notAvailable = notAvailable;
      this.request = request ? request : null;
      this.notAllowed = notAllowed;
      this.errorRequest = errorRequest;
      this.getCases()
    }
  },

  methods:{
    getCases(){
      if(this.request){
        switch (this.request.stato.id) {
            case  this.$config.changeDoctor.RequestStates.BOZZA:
              this.isDraft = true;
              break;
            case  this.$config.changeDoctor.RequestStates.INVIATA:
              this.isSended = true;
              break;
            case  this.$config.changeDoctor.RequestStates.IN_REVISIONE:
              this.isReview = true;
              break;
            case  this.$config.changeDoctor.RequestStates.COMPLETATA:
              this.isAutomatic = true;
              break;
            case  this.$config.changeDoctor.RequestStates.CHIUSA:
              this.isAutomatic = true;
              break;
            case  this.$config.changeDoctor.RequestStates.RESPINTA:
              this.isRejected = true;
              break;
            case  this.$config.changeDoctor.RequestStates.IN_LAVORAZIONE:
              this.isWorkInProgress = true;
              break;
        }

      }

    },
    async goToHomePage(){
      // this.isLoading=true;
      // let userInfoPromise = await getUserInfo(this.cf, {_no5XXRedirect: true});
      // let userInfo = userInfoPromise.data;
      // this.$store.dispatch('changeDoctor/setUserInfo', {info: userInfo});
      // this.isLoading=false;
      this.$router.replace(this.$routes.CHANGE_DOCTOR.HOME)
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
