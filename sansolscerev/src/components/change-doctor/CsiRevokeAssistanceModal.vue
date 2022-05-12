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
      <div class="csi-modal-content flex items-center ">
        <div  class="q-px-lg q-pb-lg " >

          <q-alert type="info" class="csi-revoke-assitance-alert" >
            <div class="q-body-1 q-pa-md" v-if="assistance">
              Stai revocando l'assistenza da parte dell'<span class="text-weight-bold">{{assistance.descrizione}}</span>.
            </div>
          </q-alert>

            <div class="row q-mt-lg justify-end items-center">
              <csi-buttons class="col-12">
                <csi-button
                  color="negative"
                  secondary
                  label="Revoca assistenza"
                  @click="revokeAssistance"
                  :loading="isLoading"
                />
<!--                <csi-button-->
<!--                  secondary-->
<!--                  label="Annulla"-->
<!--                  @click="hide"-->
<!--                />-->
              </csi-buttons>
            </div>
        </div>
      </div>
    </q-modal-layout>
  </q-modal>
</template>

<script>

  import {revokeAssistance} from "@services/api/change-doctor";
  import {notifyError} from "@services/api/utils";


    export default {
        name: "CsiRevokeAssistanceModal",
        props:{
          assistance: {type: Object, default:null},
          cf: {type: String, required: true, default:''},
          value: {type: Boolean, required: false, default: false}
        },
        computed:{
         },
        data() {
          return {
            isLoading: false
          }
        },
        methods: {
          async revokeAssistance(){
           this.isLoading =true;
           try{
             let revokePromise = await revokeAssistance(this.cf, {_no5XXRedirect: true});

             this.isLoading =false;
             this.$emit('revoke-assistance');
             this.$q.notify({
               type: 'positive',
               message: 'Assistenza revoca con successo.'
             })
            }catch(e){
              notifyError(e, 'Errore durante la richiesta di revoca.')
            }

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

  .csi-revoke-assitance-alert
      .q-alert-side
          align-self: center
          background : none
          @media (max-width: 480px)
              display:none


</style>
