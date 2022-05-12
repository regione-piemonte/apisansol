<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-modal
    @input="$emit('input', $event)"
    :value="value"
    :content-css="{maxWidth: '800px', maxHeight: '100vh'}"
    ref="modal"
    @hide="isLoading=false"
  >

    <q-modal-layout header-class="no-shadow no-scroll">
      <q-toolbar slot="header" color="transparent" text-color="primary">
        <q-toolbar-title></q-toolbar-title>
        <q-btn flat round icon="close" v-close-overlay />
      </q-toolbar>
      <div class="csi-modal-content flex items-center" v-if="userInfo">
        <div  class="q-px-xl q-pb-lg ">
          <template v-if="isAuraUser && isCompleteAddress">
            <q-alert type="info" class="csi-revoke-doctor-alert" >
              <div class="q-body-1 q-pa-md">
                Il tuo domicilio e la tua residenza registrati nell'Archivio Regionale degli Assistiti sono:
              </div>
              <div class="q-body-2 q-pa-md" >
                <p v-if="userInfo.domicilio">
                  Domicilio: {{userInfo.domicilio.indirizzo | toUpper}}, {{userInfo.domicilio.civico | toUpper}} - {{userInfo.domicilio.cap}} {{userInfo.domicilio.comune | toUpper}}
                </p>
                <p v-if="userInfo.residenza">
                  Residenza:  {{userInfo.residenza.indirizzo | toUpper}}, {{userInfo.residenza.civico | toUpper}} - {{userInfo.residenza.cap}} {{userInfo.residenza.comune | toUpper}}
                </p>
                <p v-if="userInfo.cittadinanza">
                  Cittadinanza: {{userInfo.cittadinanza.descrizione | toUpper}}
                </p>
                <p v-if="userInfo.recapiti && userInfo.recapiti.telefono">
                  Telefono: {{userInfo.recapiti.telefono}}
                </p>
                <p v-if="userInfo.recapiti && userInfo.recapiti.telefono_secondario">
                  Telefono secondario: {{userInfo.recapiti.telefono_secondario}}
                </p>
                <p v-if="userInfo.recapiti && userInfo.recapiti.indirizzo_email">
                  Email: {{userInfo.recapiti.indirizzo_email}}
                </p>
              </div>
            </q-alert>

            <csi-policy-form @get-policy-value="getPolicyValue" />

            <!--        DICHIARAZIONE STATO CONTRIBUTIVO E SASN -->
            <q-card class="q-mt-md">
              <q-card-title>Dichiarazioni per l'uso del servizio</q-card-title>
              <q-card-main>
                <q-field class="q-mt-md">
                  <q-toggle
                    v-model="isDeclarationAccepted"
                  >
                    <div class="q-ml-md">
                      Dichiaro di non avere una posizione contributiva all'estero e
                      di non essere iscritto ai Servizi Assistenza Sanitaria Naviganti (SASN).
                    </div>
                  </q-toggle>
                </q-field>
              </q-card-main>
            </q-card>

            <div class="row q-mt-lg justify-end items-center">
              <csi-buttons class="col-12 col-md-auto">
                <csi-button
                  :loading="isLoading"
                  primary
                  label="Prosegui"
                  @click="goToNextPage"
                />
                <csi-button
                  secondary
                  label="Modifica dati"
                  @click="goToChangeAddress"
                />
              </csi-buttons>
            </div>

          </template>
          <template v-else>
            <q-alert type="info" class="csi-revoke-doctor-alert" >
              <div class="q-body-1 q-pa-md">
                <template v-if="isCompleteAddress">
                  <span >Il tuo domicilio e la tua residenza non sono registrati nell'Archivio Regionale degli Assistiti.</span>
                  <br>
                </template>
                Compila il modulo per proseguire nella scelta del medico.
              </div>
            </q-alert>

            <csi-policy-form @get-policy-value="getPolicyValue" />

      <!--        DICHIARAZIONE STATO CONTRIBUTIVO E SASN -->
            <q-card class="q-mt-md">
              <q-card-title>Dichiarazioni per l'uso del servizio</q-card-title>
              <q-card-main>
                <q-field class="q-mt-md">
                  <q-toggle
                    v-model="isDeclarationAccepted"
                  >
                    <div class="q-ml-md">
                      Dichiaro di non avere una posizione contributiva all'estero e
                      di non essere iscritto ai Servizi Assistenza Sanitaria Naviganti (SASN).
                    </div>
                  </q-toggle>
                </q-field>
              </q-card-main>
            </q-card>


            <div class="row q-mt-lg justify-end items-center">
              <csi-buttons class="col-12 col-md-auto">
                <csi-button
                  primary
                  label="Prosegui"
                  @click="goToChangeAddress"
                />
              </csi-buttons>
            </div>
          </template>

        </div>
      </div>
    </q-modal-layout>

  </q-modal>
</template>

<script>

  import {isAura} from "@services/change-doctor/business-logic";
  import CsiPolicyForm from "components/change-doctor/CsiPolicyForm";
  import {isEmpty} from "@services/global/utils";


    export default {
        name: "CsiConfirmAddressModal",
      components: {CsiPolicyForm},
      props:{
          value: {type: Boolean, required: false, default: false},
          userInfo: {type: Object, required: false, default:null},
        },
        computed:{
          choosenDoctor(){
            return this.$store.getters['changeDoctor/getChoosenDoctor'];
          },
          isAuraUser(){
            return  isAura()
          },
          isCompleteAddress(){
              return  this.isCompleteDomicile && this.isCompleteResidence
          },
          isCompleteDomicile(){
              if(this.userInfo.domicilio){
                return !isEmpty(this.userInfo.domicilio.indirizzo) && !isEmpty(this.userInfo.domicilio.civico) && !isEmpty(this.userInfo.domicilio.cap)
              }else{
                return false
              }

          },
          isCompleteResidence(){
              if(this.userInfo.residenza){
                return !isEmpty(this.userInfo.residenza.indirizzo) && !isEmpty(this.userInfo.residenza.civico) && !isEmpty(this.userInfo.residenza.cap)
              }else{
                return false
              }
          },

         },
        created() {

        },

      data() {
          return {
            isLoading:false,
            isPolicyAccepted: false,
            isDeclarationAccepted:false
          }
        },

        methods: {
          isValidDeclarations(){
            if(!this.isPolicyAccepted ||!this.isDeclarationAccepted ){
              if (!this.isPolicyAccepted) {
                this.$q.notify({
                  color: 'negative',
                  message: "Devi accettare l'informativa e le condizioni di servizio prima di procedere."
                });

              }
              if(!this.isDeclarationAccepted){
                this.$q.notify({
                  color: 'negative',
                  message: "Devi accettare le dichiarazioni per l'uso del servizio prima di procedere."
                });
              }
              return false
            }
            return true
          },
          goToNextPage() {

          if(!this.isValidDeclarations())return
            this.isLoading =true
           this.$store.dispatch('changeDoctor/setIsAskedAddress', {val: true});
           if(this.choosenDoctor){
             //Si tratta di scelta medico, quindi si fa controllo combinazioni
             this.$emit('combination-control')

           }else{
             this.$emit('go-to-results')
             this.hide()
           }

        },

        goToChangeAddress(){
          if(!this.isValidDeclarations())return

          let route = {
            name: this.$routes.CHANGE_DOCTOR.NEW_ADDRESS.name,
          };
          this.$router.push(route);
          this.hide()
          },
         hide() {
            return this.$refs.modal.hide();
         },
          getPolicyValue(value){
            this.isPolicyAccepted = value
          }
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

  .csi-revoke-doctor-alert
      .q-alert-side
          align-self: center
          background : none
          @media (max-width: 480px)
            display:none

</style>
