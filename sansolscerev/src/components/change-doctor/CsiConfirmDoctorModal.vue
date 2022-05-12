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
        <div  class="q-px-xl q-pb-lg ">
          <template v-if="!selectableInfo">
            <q-alert type="info" class="csi-revoke-doctor-alert" >
              <div class="q-body-1 q-pa-md">
                Stai revocando il medico {{oldDoctor.cognome | upperCase}} {{oldDoctor.nome}} per sostituirlo con {{newDoctor.cognome | upperCase}} {{newDoctor.nome}}
              </div>
            </q-alert>

            <div class="row q-mt-lg justify-end items-center">
              <csi-buttons class="col-12 col-md-auto">
                <csi-button
                  primary
                  label="Conferma"
                  @click=""
                />
                <span class="loader-container col-md-auto col-12">   <csi-inner-loading :visible="isLoading" block /></span>
              </csi-buttons>
            </div>

          </template>
          <template v-else>
            <q-alert type="info" class="csi-revoke-doctor-alert" >
              <div class="q-body-1 q-pa-md">
                Il tuo domicilio e la tua residenza non sono registrati nell'Archivio Regionale degli Assistiti.
                <br>
                Compila il modulo e allega la documentazione richiesta per proseguire nella scelta del medico.
              </div>
            </q-alert>
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


  import {is4XX, notifyError} from "@services/api/utils";
  import {getStandardAddress, isAura} from "@services/change-doctor/business-logic";


    export default {
        name: "CsiConfirmDoctorModal",
        props:{
          value: {type: Boolean, required: false, default: false},
          userInfo: {type: Object, required: true, default:null},
          selectableInfo: {type: Object, required:true, default:null},
          oldDoctor:{type:Object, required:true, default:null},
          newDoctor: {type:Object, required:true, default:null}
        },
        computed:{

         },
        data() {
          return {
         isLoading:false
          }
        },
        methods: {
          async goToSearchDoctors() {
           this.isLoading = true;
            // this.$store.dispatch('changeDoctor/setAddressInfoAnswer', {val: true});
           try{
             let normalizedAddressString = getStandardAddress(this.userInfo.domicilio.indirizzo);

             // let searchParams =  {
             //   coordinate: addressObject.coordinate,
             //
             //   distanza: 2,
             //   nome_medico: null,
             //   sesso: null,
             //   tipologia: null,
             //   address: userAddress
             // };
             let route= {
               name: this.$routes.CHANGE_DOCTOR.SEARCH_DOCTOR_RESULTS.name,
               params:{onlyUserAddress:true}
             };
             this.isLoading =false;
             this.$router.push(route)

           }catch(e){
             if (is4XX(e)) {
               let message = `Si è verificato un errore nella richiesta, i dati potrebbero non essere corretti.`
             } else {
               notifyError(e, 'Non è stato possibile effettuare la ricerca.')
             }
             this.isLoading =false;
           }
           this.hide()
        },
        goToChangeAddress(){

          let route = {
            name: this.$routes.CHANGE_DOCTOR.NEW_ADDRESS.name,
            params: {isAura: isAura()}
          };
          this.$router.push(route);
          this.hide()
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

  .csi-revoke-doctor-alert
      .q-alert-side
          align-self: center
          background : none
          @media (max-width: 480px)
            display:none

</style>
