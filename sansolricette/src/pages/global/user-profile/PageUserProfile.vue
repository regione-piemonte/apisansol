<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-page class="full-width" style="max-width: 100%">

    <template>

      <div>
        <div class="bg-secondary  q-py-xl"></div>
        <!-- CHI SEI -->


        <div class="text-right relative-position q-mb-xl">
          <q-btn flat round size="xl" class="absolute-center bg-tertiary text-white" no-ripple>
            {{user.nome.charAt(0)}}{{user.cognome.charAt(0)}}
          </q-btn>
        </div>

        <div class="text-center">
          <div class="q-title q-mt-sm">{{user.nome}} {{user.cognome}}</div>
          <div class="row items-center justify-center q-mt-xs gutter-x-xs">
            <div class="q-subheading ">{{user.cf}}</div>
            <div>  <q-btn flat round dense color="primary" icon="mdi-qrcode" @click="showQrCodeModal" /></div>
          </div>

        </div>

        <!--aggiunta tab -->
        <q-tabs v-sticky sticky-offset="offset" v-scroll="scrolled" class="col-12 q-pt-md bg-grey-11" align="center">
          <q-route-tab
            slot="title"
            label="Anagrafica"
            exact
            default
            :to="$routes.GLOBAL.USER_ANAGRAPHICS"
          />

          <q-route-tab
            slot="title"
            label="Contatti"
            exact
            :to="$routes.GLOBAL.USER_CONTACTS"
          />

          <q-route-tab
            slot="title"
            label="Notifiche"
            exact
            :to="$routes.GLOBAL.USER_NOTIFICATION_PREFERENCES"
          />

          <q-route-tab
            slot="title"
            label="Accessi"
            exact
            :to="$routes.GLOBAL.USER_ACCESS_LIST"
          />

          <!--<q-route-tab v-if="!config.global.isProduction" label="Consensi"  :to="$routes.GLOBAL.USER_CONSENTS" exact slot="title" ></q-route-tab> -->
        </q-tabs>


        <keep-alive :include="keepAlive">
          <router-view></router-view>
        </keep-alive>
      </div>
    </template>

  <!--    MODAL QRCODE-->
    <q-modal v-model="isOpenQrCode"
             :content-css="{maxWidth: '800px', minHeight:'400px'}">
      <q-modal-layout footer-class="shadow-0">
        <div class="text-right q-pa-sm">
          <q-btn v-close-overlay flat round dense icon="close"></q-btn>
        </div>
        <div class="column q-px-lg">
          <div class="col-12">
            Di seguito il QRCode del tuo Codice Fiscale
          </div>
          <div class="col-10 col-sm-6">
            <vue-qrcode
              tag="div"
              :value="qrCodeString"
              :options="qrCodeOption"
            >
            </vue-qrcode>
          </div>

        </div>
      </q-modal-layout>
    </q-modal>

  </q-page>
</template>

<script>
  import {config} from "@plugins/config";
  import PageUserContacts from "pages/global/user-profile/PageUserContacts";
  import PageUserNotificationPreferences from "pages/global/user-profile/PageUserNotificationPreferences";
  import PageUserAnagraphics from "pages/global/user-profile/PageUserAnagraphics";
  import PageUserAccessList from "pages/global/user-profile/PageUserAccessList";

  import VueQrcode from '@chenfengyuan/vue-qrcode';

  export default {
    name: 'PageUserProfile',
    components: {PageUserAnagraphics, PageUserContacts, PageUserNotificationPreferences,VueQrcode},
    data() {
      return {

        keepAlive: [
          PageUserContacts.name,
          PageUserNotificationPreferences.name,
          PageUserAnagraphics.name,
          PageUserAccessList.name
        ],

        isEmailModalOpen: false,
        isSmsModalOpen: false,
        config: config,
        positionScroll: null,
        offset: {top: 0, bottom: 0},
        oldPosition: 0,
        isOpenQrCode:false,
        qrCodeOption:{
          errorCorrectionLevel: 'M',
          version: 2
        }
      }
    },
    computed: {
      user() {
        return this.$store.getters['global/user']
      },
      userContacts() {
        return this.user.contacts
      },
      qrCodeString(){
        return this.user.cf
      }
    },
    methods: {
      scrolled(position) {
        this.positionScroll = position
        this.offset = {top: this.positionScroll, bottom: 0};
      },
      showQrCodeModal(){
        this.isOpenQrCode=true
      }
    },
    created() {
    }
  }
</script>

<style>
</style>
