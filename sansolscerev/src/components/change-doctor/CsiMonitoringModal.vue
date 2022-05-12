<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-modal
    @input="$emit('input', $event)"
    :value="value"
    :content-css="{maxWidth: '800px'}"
    ref="modal"
  >

    <q-modal-layout header-class="no-shadow no-scroll">
      <q-toolbar slot="header" color="transparent" text-color="primary">
        <q-toolbar-title></q-toolbar-title>
        <q-btn flat round icon="close" v-close-overlay />
      </q-toolbar>
      <div class="csi-modal-content flex items-center">
        <div  class="q-px-xl q-pb-lg " >

          <q-alert type="info" class="csi-monitoring-alert" v-if="doctor">
            <div class="q-body-1 q-pa-md" v-if="!monitoring">
              Stai sospendendo il monitoraggio del medico <span class="text-weight-bold">{{doctor.cognome | upperCase}} {{doctor.nome}}</span>.
            </div>

            <div class="q-body-1 q-pa-md" v-if="monitoring">
              <div class="q-mb-sm">Hai richiesto di monitorare la disponibilità di <strong>{{doctor.cognome | upperCase}} {{doctor.nome}}</strong>.</div>
              <div>
                 <template v-if="isUserContactEmail">
                   Se hai attivato le <a href="/la-mia-salute/profilo-utente/#/contatti">notifiche</a>
                  per il servizio "il mio medico", ti invieremo una notifica appena il medico avrà posti disponibili.
                </template>
                <template v-else>
                  Aggiungi un'email al tuo <a href="/la-mia-salute/profilo-utente/#/contatti">profilo</a>
                  e indica di voler ricevere notifiche per il servizio "il mio medico", così ti invieremo una
                  notifica appena il medico avrà posti disponibili.
                </template>
              </div>
              <div v-if="isDelegation" class="q-mt-sm">
                N.B. Le notifiche verranno mandate ai tuoi contatti e non a quelli del delegante.
              </div>
            </div>
          </q-alert>

            <div class="row q-mt-lg justify-end items-center">
              <csi-buttons class="col-12 col-md-auto">
                <csi-button
                  v-if="monitoring"
                  primary
                  label="Conferma"
                  @click="manageMonitoring"
                  :loading="isLoading"
                />
                <csi-button
                  v-else
                  secondary
                  color="negative"
                  label="Annulla monitoraggio"
                  @click="manageMonitoring"
                  :loading="isLoading"
                />
              </csi-buttons>
            </div>
        </div>
      </div>
    </q-modal-layout>
  </q-modal>
</template>

<script>

  import {deleteMonitoring, getMonitoredDoctors, postMonitoredDoctor} from "@services/api/change-doctor";
  import {notifyError} from "@services/api/utils";
  import {getPreferences} from "@services/api/preferences";


    export default {
        name: "CsiMonitoringModal",
        props:{
          monitoring :  {type: Boolean, required: false, default: null},
          doctor: {type: Object, default:null},
          cf: {type: String, default: ''},
          value: {type: Boolean, required: false, default: false}
        },
        computed:{
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

        data() {
          return {
            isLoading: false,
            isMonitoredDoctor:false,
            isNotificationsContacts:false
          }
        },
        methods: {
          async manageMonitoring(){
            let userLogged= this.$store.getters['global/user']
            let userCf= userLogged.cf
            this.isLoading =true;
            let doctorCf = this.doctor.codice_fiscale;
            let doctorId =  this.doctor.id;
            let monitoredDoctors= [];
            if(this.monitoring) {
              try {
                let monitoringPromise = await postMonitoredDoctor(userCf, {codice_fiscale: doctorCf}, {_no5XXRedirect: true});
                let monitoredDoctorsResponse = await getMonitoredDoctors(userCf, {_no5XXRedirect: true});
                monitoredDoctors = monitoredDoctorsResponse.data;
                if (monitoredDoctors) this.$store.dispatch('changeDoctor/setMonitoredDoctors', {info: monitoredDoctors});
                this.$emit('monitoring-changed', true)
              } catch (e) {
                notifyError(e, 'Non è stato possibile attivare il monitoraggio.')
              } finally {
                this.isLoading = false;
                this.hide();
              }
            }else {
              try {
                let monitoringPromise = await deleteMonitoring(userCf, doctorId, {_no5XXRedirect: true});
                let monitoredDoctorsResponse = await getMonitoredDoctors(userCf, {_no5XXRedirect: true});
                monitoredDoctors = monitoredDoctorsResponse.data;
                if (monitoredDoctors) this.$store.dispatch('changeDoctor/setMonitoredDoctors', {info: monitoredDoctors});
                this.$emit('monitoring-changed', true)
              } catch (e) {
                notifyError(e, 'Non è stato possibile annullare il monitoraggio.')
              } finally {
                this.isLoading = false;
                this.hide();
              }
            }
          },
          hide() {
            return this.$refs.modal.hide();
          },
        },
    }
</script>

<style lang="stylus">
  .csi-modal-content
    height: calc(100% - 50px)

  .loader-container
    max-height : 30px
    display : flex
    align-items : center
    justify-content : center

  .csi-monitoring-alert
      .q-alert-side
          align-self: center
          background : none
          @media (max-width: 480px)
            display:none

</style>
