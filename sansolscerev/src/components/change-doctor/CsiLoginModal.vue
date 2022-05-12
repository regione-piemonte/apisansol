<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template >
  <q-modal
    @input="$emit('input', $event)"
    :value="value"
    :content-css="{maxWidth: '800px'}"
    ref="modal"
  >

    <q-modal-layout header-class="no-shadow no-scroll" >
      <q-toolbar slot="header" color="transparent" text-color="primary">
        <q-toolbar-title></q-toolbar-title>
        <q-btn flat round icon="close" v-close-overlay />
      </q-toolbar>
      <div class="csi-modal-content flex items-center">
        <div  class="q-px-xl q-pb-lg ">

            <q-alert type="info" class="csi-modal-alert" v-if="changeDoctor">
              <div class="q-body-1 q-pa-md">
                   Per confermare la scelta medico occorre eseguire l'autenticazione.
              </div>
            </q-alert>
            <q-alert type="info" class="csi-modal-alert" v-if="!changeDoctor">
              <div class="q-body-1 q-pa-md">
                Per monitorare il medico occorre eseguire l'autenticazione.
              </div>
            </q-alert>
            <div class="row q-mt-lg justify-end items-center">
              <csi-buttons class="col-12 col-md-auto">
                <csi-button
                  primary
                  label="Esegui login"
                  @click="onLogin()"
                />
              </csi-buttons>
            </div>


        </div>
      </div>
    </q-modal-layout>

  </q-modal>
</template>

<script>


    import {login} from "@services/global/session";

    export default {
        name: "CsiLoginModal",
        props:{
          value: {type: Boolean, required: false, default: false},
          doctor :{type: Object, required: false, default: null},
          changeDoctor : {type: Boolean, required: false, default: false}
        },
        methods: {
          onLogin(){
            // this.$store.dispatch('changeDoctor/setFromAnonymousPage', {value:true});
            // login('#/il-mio-medico')
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

  .csi-modal-alert
      .q-alert-side
          align-self: center
          background : none
          @media (max-width: 480px)
            display:none

</style>
