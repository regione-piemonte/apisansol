<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div>
    <div class="bg-secondary q-py-xl "></div>
    <lms-page padding style="padding-top:0">


      <!-- CHI SEI -->
      <!-- ----------------------------------------------------------------------------------------------------------- -->
      <div class="text-right relative-position">
        <q-avatar
          size="60px"
          font-size="24px"
          text-color="white"
          color="grey-9"
          class="absolute-center"
        >
          {{ userAvatarLetters }}
        </q-avatar>
      </div>

      <div class="q-py-md"></div>
      <div class="text-center">
        <div class="text-h1 q-mt-sm text-uppercase">{{ user.nome }} {{ user.cognome }}</div>
        <div class="row items-center justify-center q-mt-xs q-col-gutter-x-xs">
          <div class="text-subtitle1 ">{{ user.cf }}</div>
          <div>
            <q-btn flat round dense color="primary" icon="mdi-qrcode" @click="showQrCodeModal"/>
          </div>
        </div>
      </div>

      <!-- TABS -->
      <!-- ----------------------------------------------------------------------------------------------------------- -->
      <q-tabs
        class="q-my-md"
        align="center"
        active-color="primary"
        no-caps
      >
        <q-route-tab class="text-subtitle1 q-py-sm" label="Anagrafica" :to="PROFILE_IDENTITY" exact/>
        <q-route-tab class="text-subtitle1 q-py-sm" label="Contatti" :to="PROFILE_CONTACTS" exact/>
        <q-route-tab class="text-subtitle1 q-py-sm" label="Notifiche" :to="PROFILE_PREFERENCES" exact/>
        <q-route-tab class="text-subtitle1 q-py-sm" label="Accessi" :to="PROFILE_ACCESS_LIST" exact/>
      </q-tabs>

      <!-- PAGINE -->
      <!-- ----------------------------------------------------------------------------------------------------------- -->
      <keep-alive :include="keepAlive">
        <router-view/>
      </keep-alive>

      <!--    MODAL QRCODE-->
      <q-dialog v-model="isOpenQrCode">
        <q-card style="max-width: 800px; min-height:400px">
          <q-card-section class="no-padding">
            <div class="text-right q-pa-sm">
              <q-btn v-close-popup flat round dense icon="close"></q-btn>
            </div>
          </q-card-section>
          <q-card-section>
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
          </q-card-section>
        </q-card>
      </q-dialog>
    </lms-page>
  </div>

</template>

<script>
import PageProfileIdentity from "src/pages/PageProfileIdentity";
import PageProfileContacts from "src/pages/PageProfileContacts";
import PageProfilePreferences from "src/pages/PageProfilePreferences";
import PageProfileNotificationList from "src/pages/PageProfileNotificationList";
import PageProfileAccessList from "src/pages/PageProfileAccessList";
import VueQrcode from "@chenfengyuan/vue-qrcode";

import {
  PROFILE_IDENTITY,
  PROFILE_CONTACTS,
  PROFILE_PREFERENCES,
  PROFILE_NOTIFICATION_LIST, PROFILE_ACCESS_LIST
} from "src/router/routes";

export default {
  name: "PageProfile",
  components: {VueQrcode},
  props: {},
  data() {
    return {
      PROFILE_IDENTITY,
      PROFILE_CONTACTS,
      PROFILE_PREFERENCES,
      PROFILE_NOTIFICATION_LIST,
      PROFILE_ACCESS_LIST,
      keepAlive: [
        PageProfileIdentity.name,
        PageProfileContacts.name,
        PageProfilePreferences.name,
        PageProfileNotificationList.name,
        PageProfileAccessList.name,
      ],
      isOpenQrCode: false,
      qrCodeOption: {
        errorCorrectionLevel: 'M',
        version: 2
      }
    };
  },
  computed: {
    user() {
      return this.$store.getters["getUser"];
    },
    userAvatarLetters() {
      let surname = this.user?.cognome?.charAt(0);
      let name = this.user?.nome?.charAt(0);
      return `${name}${surname}`;
    },
    qrCodeString() {
      return this.user.cf
    }
  },
  created() {
  },
  methods: {
    showQrCodeModal() {
      this.isOpenQrCode = true
    }
  }
};
</script>

<style lang="sass"></style>
