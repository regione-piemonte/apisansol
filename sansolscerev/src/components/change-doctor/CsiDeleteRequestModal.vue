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
      <div class="csi-modal-content flex items-center justify-center ">
        <div  class="q-px-lg q-pb-lg " >

          <q-alert type="warning" class="csi-revoke-assitance-alert" v-if="request">
            <div class="q-body-1 q-pa-md">
              Stai annullando la domanda n°<span class="text-weight-bold">{{request.id}}</span>.
            </div>
          </q-alert>

            <div class="row q-mt-lg justify-end items-center">
              <csi-buttons class="col-12">
                <csi-button
                  primary
                  label="Conferma"
                  @click="deleteRequest"
                  :loading ="isLoading"
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

  import {deleteRequest, getUserInfo} from "@services/api/change-doctor";
  import {notifyError} from "@services/api/utils";


    export default {
        name: "CsiDeleteRequestModal",
        props:{
          request: {type: Object, default:null},
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
          async deleteRequest(){
           this.isLoading =true;
           try{
             let deleteRequestPromise = await deleteRequest(this.cf, this.request.id, {_no5XXRedirect: true});
             let userInfoPromise = await getUserInfo(this.cf, {_no5XXRedirect: true});
             let userInfo = userInfoPromise.data;
             if(userInfo)
               this.$store.dispatch('changeDoctor/setUserInfo', {info: userInfo});
             this.isLoading =false;
             // this.$emit('delete-request');
             this.$q.notify({
               type: 'positive',
               message: 'Richiesta annullata con successo.'
             })
            }catch(e){
             notifyError(e, "Errore durante l'annullamento della richiesta.");
             this.isLoading =false;
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
