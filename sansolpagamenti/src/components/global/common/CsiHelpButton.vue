<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div>
    <q-btn v-if="!square" flat :round="$q.screen.lt.md" no-caps icon="help">
      <q-popover style="min-width: 180px;">
        <q-list separator link sparse class="no-padding">
          <!--        <q-item v-close-overlay @click.native="$emit('contacts-click')">-->
          <!--          <q-item-main>-->
          <!--            <q-item-tile label>Contatti</q-item-tile>-->
          <!--          </q-item-main>-->
          <!--        </q-item>-->

          <q-item v-close-overlay @click.native="goToFaqs">
            <q-item-main>
              <q-item-tile label>FAQ</q-item-tile>
            </q-item-main>
          </q-item>


          <q-item v-if="isReservations" @click.native="showAssistanceDialog" v-close-overlay>
            <q-item-main>
              <q-item-tile label>Assistenza</q-item-tile>
            </q-item-main>
          </q-item>

          <q-item v-else tag="a" link :href="assistanceUrl" v-close-overlay>
            <q-item-main>
              <q-item-tile label>Assistenza</q-item-tile>
            </q-item-main>
          </q-item>

          <slot name="after"/>
        </q-list>
      </q-popover>
      <div class="gt-sm q-pl-xs">Aiuto</div>
      <q-tooltip>Aiuto</q-tooltip>
    </q-btn>

    <div
      v-else-if="multiple"
      class="row gutter-xs"
      :class="{
      'justify-center': $q.screen.lt.sm,
      'justify-end': $q.screen.gt.xs
    }"
    >
      <!--    <div class="col-auto">-->
      <!--      <q-btn-->
      <!--        text-color="white"-->
      <!--        flat-->
      <!--        no-caps-->
      <!--        label="Contatti"-->
      <!--        @click="$emit('contacts-click')"-->
      <!--      />-->
      <!--    </div>-->

      <!--    <div class="col-auto">-->
      <!--      <div class="vl"></div>-->
      <!--    </div>-->

      <div class="col-auto">
        <q-btn
          text-color="white"
          flat
          no-caps
          label="FAQ"
          @click="goToFaqs"
        />
      </div>

      <div class="col-auto">
        <div class="vl"></div>
      </div>
      <div class="col-auto">
        <q-btn
          v-if="isReservations"
          @click="showAssistanceDialog"
          text-color="white"
          flat
          no-caps
          label="Assistenza"
        />
        <q-btn
          v-else
          type="a"
          :href="assistanceUrl"
          text-color="white"
          flat
          no-caps
          label="Assistenza"
        />
      </div>
    </div>

    <!--  <div v-else>-->
    <!--    <q-btn-->
    <!--      text-color="white"-->
    <!--      label="Contatti"-->
    <!--      flat-->
    <!--      no-caps-->
    <!--      @click="$emit('help-click')"-->
    <!--    />-->
    <!--  </div>-->

    <!-- DIALOG ASSISTENZA RESERVATIONS----------------------------------------------------------------------------------------------------------- -->
    <q-modal v-model="assistanceDialog"
             :content-css="{maxWidth: '800px'}">
      <q-modal-layout footer-class="shadow-0" header-class="shadow-0">

          <q-toolbar slot="header" color="white" text-color="black" >
            <q-toolbar-title>Assistenza</q-toolbar-title>
            <q-btn flat round icon="close" v-close-overlay/>
          </q-toolbar>

        <div class="q-pa-md">
          <p>CUP PIEMONTE - Assistenza per le prenotazioni<strong> </strong></p>
          <ul>
            <li>telefonare al Call Center dedicato al
              <strong>numero verde 800.000.500 dalle ore 08.00 alle ore 20.00 (lunedì-domenica)</strong>
            </li>
            <li>scrivere un messaggio di posta elettronica alla casella:
              <strong><a class="csi-link" href="mailto:assistenza.cupregionale@aslcittaditorino.it">
                assistenza.cupregionale@aslcittaditorino.it</a></strong>
            </li>
          </ul>
          <q-alert class="q-pb-lg q-pt-sm" color="info">
            <div>
              <p>Attenzione! La casella offre solo supporto tecnico, perciò ti invitiamo a non utilizzarla per
                comunicare informazioni personali di tipo sanitario</p>
            </div>
          </q-alert>

        </div>
      </q-modal-layout>
    </q-modal>
  </div>
</template>


<script>
import {appAssistanceForm, appAssistancePage, appDetailFaq} from "../../../services/global/business-logic";
import {equalsIgnoreCase} from "../../../services/global/utils";

export default {
  name: 'CsiHelpButton',
  components: {},
  props: {
    square: {type: Boolean, default: false},
    multiple: {type: Boolean, default: false},
    serviceCode: {type: String, default: ''}

  },
  data() {
    return {
      assistanceDialog: false
    }
  },
  computed: {
    isUserLogged() {
      return this.$store.getters['global/isUserLogged']
    },
    appServiceCode() {
      return this.$route.meta.appServiceCode
    },
    appService() {
      let servicesList = this.$store.getters['global/getAppList']
      return servicesList.find(service => equalsIgnoreCase(service.portale_codice, this.appServiceCode))
    },
    isAssistance() {
      return this.appService && this.appService.albero_aiuti_visibile
    },
    isReservations() {
      return equalsIgnoreCase(this.appServiceWebCode, 'RESERVATIONS')
    },
    appServiceWebCode() {
      return this.appService ? this.appService.portale_codice : ''
    },
    assistanceUrl() {
      let isAssistance = this.appService && this.appService.albero_aiuti_visibile
      return isAssistance ? appAssistancePage(this.appServiceWebCode) : appAssistanceForm(this.appServiceWebCode)
    }
  },
  created() {
  },
  methods: {

    goToFaqs() {
      let serviceCode = this.appService ? this.appService.portale_codice : ''
      let url = appDetailFaq(serviceCode)
      window.open(url)
    },

    showAssistanceDialog(){
      console.log('showAssistanceDialog')
      this.assistanceDialog =true

    }
  },
}
</script>


<style lang="stylus">
.vl {
  display inline-block
  border-left 1px solid white
  height 100%
}

a.q-item-link {
  text-decoration: none !important
  color: #0c0c0c !important
}
</style>
