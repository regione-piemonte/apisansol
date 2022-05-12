<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="row full-width">
    <!-- INFORMATIVA -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <q-card class="q-mt-md">
      <q-card-title>Informativa sul trattamento dei dati personali</q-card-title>
      <q-card-main>
        <q-field class="q-mt-md">
          <q-toggle
            v-model="isPolicyAccepted"
          >
            <div class="q-ml-md">
              Dichiaro di aver preso visione di quanto contenuto nelle
              <a href="#" @click.prevent.stop="openModalService">Condizioni del servizio</a> e
              <a href="#" @click.prevent.stop="openModalPrivacy">nell'Informativa sulla Privacy</a>
            </div>
          </q-toggle>
        </q-field>
      </q-card-main>
    </q-card>

    <q-modal v-model="isSelectionModalServiceOpen" :content-css="{maxWidth: '800px'}" v-if="disclaimerText">
      <q-modal-layout class="bg-grey-2">
        <q-toolbar slot="header">
          <q-toolbar-title>
            Condizioni del servizio
          </q-toolbar-title>
          <q-btn flat round icon="close" v-close-overlay />
        </q-toolbar>

        <div class="q-pa-md">
          <csi-policy :iframe-styles="{minHeight: '80vh'}">
            <template slot="text">
              <div class="policy-text" v-html="disclaimerText.testo_condizioni_servizio"></div>
            </template>
          </csi-policy>
        </div>
      </q-modal-layout>
    </q-modal>
    <q-modal v-model="isSelectionModalPrivacyOpen" :content-css="{maxWidth: '800px'}" v-if="disclaimerText">
      <q-modal-layout class="bg-grey-2">
        <q-toolbar slot="header">
          <q-toolbar-title>
            Informativa sulla Privacy
          </q-toolbar-title>
          <q-btn flat round icon="close" v-close-overlay />
        </q-toolbar>

        <div class="q-pa-md">
          <csi-policy :iframe-styles="{minHeight: '80vh'}">
            <template slot="text">
              <div class="policy-text" v-html="disclaimerText.testo_privacy"></div>
            </template>
          </csi-policy>
        </div>
      </q-modal-layout>
    </q-modal>
  </div>

</template>

<script>
    import CsiPolicy from "components/global/common/CsiPolicy";
    import {getDisclaimer} from "@services/api/change-doctor";
    import {getStatusList} from "@services/api/pathology-exemption";

    export default {
        name: "CsiPolicyForm",
      components: {CsiPolicy},
      data(){
          return{
            isPolicyAccepted:false,
            isSelectionModalServiceOpen:false,
            isSelectionModalPrivacyOpen:false,

          }
      },
      created(){
      },
      watch:{
        isPolicyAccepted:{
          immediate:true,
          handler(newVal, oldVal){
            this.$emit('get-policy-value', this.isPolicyAccepted);
          }
        }
      },
      computed:{
          disclaimerText() {
              return this.$store.getters['changeDoctor/getDisclaimer']
          }
      },
      methods:{

        openModalService(){
          this.isSelectionModalServiceOpen = true
        },
        openModalPrivacy(){
          this.isSelectionModalPrivacyOpen = true
        }
      }
    }
</script>

<style scoped lang="stylus">
.policy-text h4
  margin-top: 8px
  margin-bottom :16px
</style>
