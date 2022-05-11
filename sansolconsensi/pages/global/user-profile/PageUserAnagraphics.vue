<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-page>

    <template>

      <!-- CHI SEI -->

      <div v-if="!isLoading">

        <q-list v-if="hasFSE" no-border separator sparse link class="q-px-sm q-mt-md ">

          <q-item>
            <div class="row" style="width: 100%">
              <div class="col-md-6 col-xs-12 text-bold">Residenza:</div>
              <div class="col-md-6 col-xs-12">{{user.profile.info_anag.residenza.desc_comune}},
                {{user.profile.info_anag.residenza.indirizzo}}, {{user.profile.info_anag.residenza.num_civico}}
              </div>
            </div>
          </q-item>

          <q-item>
            <div class="row" style="width: 100%">
              <div class="col-md-6 col-xs-12 text-bold">Asl di assistenza:</div>
              <div class="col-md-6 col-xs-12">{{asr}}</div>
            </div>
          </q-item>

          <q-item>
            <div class="row" style="width: 100%">
              <div class="col-md-6 col-xs-12 text-bold">Domicilio sanitario:</div>
              <div class="col-md-6 col-xs-12 ">{{user.profile.info_anag.domicilio.desc_comune}},
                {{user.profile.info_anag.domicilio.indirizzo}}, {{user.profile.info_anag.domicilio.num_civico}}
              </div>
            </div>
          </q-item>

        </q-list>


        <!-- <q-alert type="info" v-else class="text-center q-mt-xl q-pa-md q-display-1 ">
           I dati di Anagrafica sono relativi ai cittadini piemontesi. Puoi comunque consultare i <strong>Contatti</strong>
           e le <strong>Preferenze</strong> di notifica, sia <strong>Globali</strong> che per i <strong>Consensi</strong>.
         </q-alert> -->

        <q-alert type="info" v-else class="text-center q-mt-xl q-pa-md q-display-1 ">
          I dati anagrafici sono disponibili agli assistiti della regione piemonte
        </q-alert>
      </div>

      <q-inner-loading :visible="isLoading">
        <q-spinner-mat size="50px" color="primary"></q-spinner-mat>
      </q-inner-loading>

    </template>
  </q-page>
</template>

<script>
    import CsiContactEmailItem from "components/global/user-profile/CsiContactEmailItem";
    import CsiContactMobilePhoneItem from "components/global/user-profile/CsiContactMobilePhoneItem";
    import {config} from "@plugins/config";
    import {getAsrTemp} from "@services/api/profile";

    export default {
        name: 'PageUserProfile',
        components: {CsiContactMobilePhoneItem, CsiContactEmailItem},
        data() {
            return {
                isEmailModalOpen: false,
                isSmsModalOpen: false,
                config: config,
                asr: null,
                hasFSE: true,
                isLoading: false,
            }
        },
        computed: {
            user() {
                return this.$store.getters['global/user']
            },
            //asr(){

            //},
            userContacts() {
                console.log(this.user);
                return this.user.contacts

            }
        },
        methods: {},

        async created() {
            if (this.user.profile) {
                this.isLoading = true;
                console.log(this.user);
                let asrNationalId = this.user.profile.info_san.asl_domicilio;
                let asrLocalId =asrNationalId ? asrNationalId.substr(asrNationalId.length - 3) : '';
                console.log(asrLocalId);
                let response = await getAsrTemp({_no5XXRedirect: true});
                let listaAsr = response.data;
                for (let i = 0; i < listaAsr.length; i++) {
                    if (asrLocalId === listaAsr[i].id.toString()) {
                        this.asr = listaAsr[i].descrizione
                    }
                }
                this.isLoading = false;
            } else {
                this.hasFSE = false
            }
        }
    }
</script>

<style>
</style>
