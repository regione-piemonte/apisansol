<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<style scoped lang="stylus">

  @require '~variables'

  .csi-home-card
    cursor pointer
    transition all .3s ease

    &--unlocked
      &:hover
        background-color $grey-2

      &:active
        background-color $primary
        color white

    &--locked
      cursor initial
      background-color $grey-2
      box-shadow: $shadow-0
      border 1px solid $grey-5


  /*.csi-home-card-header*/

  .csi-home-card-header-title
    font-weight bold

  .csi-home-card-main
    height 120px

</style>

<template>
  <q-page padding class="csi-page-global-app-global" v-if="!configUpdate">

    <!-- MESSAGGI DINAMICI DELLA CONFIGURAZIONE -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <csi-config-dynamic-message-list home class="q-mb-md"/>


    <!-- CARD LOGIN -->
    <!-- Per attirare l'attenzione dell'utente ed invogliarlo ad autenticarsi -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <div v-if="!isUserLogged" class="q-mb-xl">
      <q-card>
        <q-card-main>

          <div class="row items-center gutter-sm">
            <div class="col-12 col-md-auto" :class="{'text-center': $q.screen.lt.md}">
              <csi-icon-base class="csi-svg-icon--xl">
                <csi-icon-authentication/>
              </csi-icon-base>
            </div>

            <div class="col-12 col-md">
              Per utilizzare i servizi de <i>Salute Piemonte</i>, accedi con le tue credenziali
            </div>

            <div class="col-12 col-md-auto">
              <csi-buttons>
                <csi-button primary label="Accedi" @click="onLogin"/>
              </csi-buttons>
            </div>
          </div>
        </q-card-main>
      </q-card>
    </div>


    <!-- LISTA DEI SERVIZI -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <div class="row gutter-sm">
      <div
        v-for="(item, index) in navigation"
        :key="item.meta.navigationLabel"
        class="col-12 col-sm-6 col-lg-4">
        <q-card
          class="csi-home-card"
          @click.native="isInMaintenance(item)"
          :class="{'csi-home-card--unlocked': canUseService(item), 'csi-home-card--locked': !canUseService(item)}">
          <q-item class="csi-home-card-header">
            <q-item-side v-if="item.meta.iconName" :icon="item.meta.iconName"/>
            <q-item-side v-if="item.meta.iconComponent">
              <csi-icon-base class="csi-svg-icon--md">
                <component :is="item.meta.iconComponent" class="primary"/>
              </csi-icon-base>
            </q-item-side>
            <q-item-main>
              <q-item-tile label class="csi-home-card-header-title">
                {{item.meta.navigationLabel}}
              </q-item-tile>
            </q-item-main>
          </q-item>

          <q-card-main class="csi-home-card-main">
            <p class="csi-home-card-main-text">
              {{item.meta.navigationDescription || ''}}
            </p>
          </q-card-main>

          <q-card-separator class="q-mx-md q-mt-sm"/>

          <q-card-actions align="end" class="q-px-md q-py-sm">
            <span v-if="canUseService(item)" class="csi-text--xs">
              <template v-if="isSuspended(item)">
                <span class="text-negative text-bold">Momentaneamente sospeso</span>
              </template>
              <template v-else>Vai al servizio</template>
            </span>
            <div v-else>
              <span class="csi-text--xs">Accedi per usufruire del servizio</span>
              <q-icon name="lock" class="csi-icon--xs text-grey-8 q-ml-sm"/>
            </div>
          </q-card-actions>
        </q-card>

      </div>
    </div>

    <!-- MESSAGGIO VISUALIZZAZIONE SERVIIZI -->
    <q-alert color="info" class="q-mt-md" v-if="$q.platform.is.mobile">
      <div class="q-body-1">
        Per scoprire gli altri servizi accedi da PC. Presto saranno ottimizzati anche per smartphone!
      </div>
    </q-alert>


    <!-- MODALS -->
    <!-- --------------------------------------------------------------------------------------------------------- -->
    <!-- MODAL ALERT PRENOTAZIONI VISITE ED ESAMI -->
    <!-- MODALE NUOVA INTERAZIONE -->
    <q-modal v-model="isMedicalPrescriptionAlertNewVisible" minimized :content-css="{maxWidth: '800px'}">
      <div class="q-pa-md">
        <div class="q-title text-weight-bold">Attenzione:</div>

        <div class="q-mt-sm">
          Il servizio di prenotazione visite ed esami è in fase di evoluzione, coerentemente al piano di migrazione
          delle Aziende Sanitarie, sul nuovo Sistema regionale omogeneo di gestione delle agende e delle
          prenotazioni sanitarie (<strong>CUP Piemonte</strong>).
        </div>

        <div class="q-mt-md">
          Al momento è possibile prenotare:
          <ul>
            <li>
              <strong>SOVRACUP</strong> presso ASL TO3, Ospedale Gradenigo, Città della Salute e
              della Scienza di Torino. Il servizio, in corso di dismissione, non è abilitato per le seguenti modalità
              di autenticazione: SPID, CIE, TS-CNS
            </li>

            <li>
              <strong>CUP Piemonte</strong> presso ASL Città di Torino, ASL TO4, ASL TO5, ASL Novara, ASL Biella, ASL
              VCO, ASL Cuneo 1, ASL VC, Azienda S. Croce e
              Carle di Cuneo, Ospedale Mauriziano di Torino e Ospedale San Luigi Gonzaga di Orbassano, Az. Ospedaliera
              Universitaria Maggiore di Novara, ASL Alessandria e Az. Ospedaliera di Alessandria
            </li>
          </ul>
        </div>


        <csi-buttons class="q-mt-lg">
          <csi-button primary label="Continua sul CUP Piemonte" @click="goToCupNew"/>
          <csi-button primary label="Continua sul Sovracup" @click="goToSovracup"/>
          <csi-button v-close-overlay secondary label="Annulla"/>
        </csi-buttons>
      </div>
    </q-modal>

    <!-- MODAL SCREENING -->
    <!-- DISSERVIZIO TEMPORANEO -->
    <q-modal v-model="isScreeningAlertVisible" minimized :content-css="{maxWidth: '800px'}">
      <q-toolbar class="bg-transparent">
        <q-toolbar-title class="q-title text-weight-bold text-black q-pl-none">
          Momentaneamente sospeso
        </q-toolbar-title>
        <q-btn round flat icon="close" v-close-overlay color="black"/>
      </q-toolbar>

      <div class="q-pa-md">
        Nel corso della Fase 2 dell'emergenza relativa al virus COVID-19 per richiedere un appuntamento o per spostare
        un appuntamento già fissato è necessario contattare il Centro di Screening della propria ASL.
        <br>
        <br>
        Il servizio on line di prenotazione appuntamenti per gli esami di screening oncologici, pertanto, resterà
        sospeso fino a nuova
        disposizione.
      </div>
    </q-modal>


    <!-- MODAL ALERT CAMBIO MEDICO-->

<!--    <q-modal v-model="isChangeDoctorAlertNewVisible" minimized :content-css="{maxWidth: '800px'}">-->
<!--      <div class="q-pa-md">-->
<!--        <div class="q-title text-weight-bold">Attenzione!</div>-->

<!--        <div class="q-mt-sm">-->
<!--          ll servizio di Scelta e revoca del medico è in fase di evoluzione, se vuoi scegliere o-->
<!--          cambiare un medico o un pediatra delle-->
<!--          <strong>ASL AL</strong>, <strong>ASL AT</strong>, <strong>ASL BI</strong>, <strong>ASL CN1</strong>, <strong>ASL CN2</strong>,-->
<!--          <strong>ASL NO</strong>, <strong>ASL TO3</strong>, <strong>ASL TO4</strong>, <strong>ASL TO5</strong>,-->
<!--          <strong>ASL VC</strong> o <strong>ASL VCO</strong>-->
<!--          continua su <strong>Il mio medico</strong>.-->
<!--          Se vuoi cambiare il tuo medico esclusivamente nella tua ASL di assistenza continua su <strong>Cambio medico</strong>.-->
<!--        </div>-->
<!--        <csi-buttons class="q-mt-lg">-->
<!--          <csi-button primary label="Continua su Il mio medico" @click="goToChangeDoctorNew"/>-->
<!--          <csi-button primary label="Continua su Cambio medico" @click="goToChangeDoctorOld"/>-->
<!--          <csi-button v-close-overlay secondary label="Annulla"/>-->
<!--        </csi-buttons>-->
<!--      </div>-->
<!--    </q-modal>-->




  </q-page>
  <csi-update-page v-else/>
</template>


<script>
  import {NAVIGATION} from '@router/navigation'
  import CsiIconBase from 'components/global/icons/CsiIconBase'
  import CsiIconAuthentication from 'components/global/icons/CsiIconAuthentication'
  import {login} from '@services/global/session'
  import {config} from '@plugins/config'
  import CsiUpdatePage from 'components/global/common/CsiUpdatePage'
  import CsiPageTitle from 'components/global/common/CsiPageTitle'
  import CsiConfigDynamicMessageList from 'components/global/common/CsiConfigDynamicMessageList'
  import {openUrl} from '@services/global/utils'

  export default {
    name: 'AppGlobal',
    components: {CsiConfigDynamicMessageList, CsiIconAuthentication, CsiIconBase, CsiUpdatePage, CsiPageTitle},
    data() {
      return {
        configUpdate: config.isToUpdate,
        isMedicalPrescriptionAlertNewVisible: false,
        isScreeningAlertVisible: false,

      }
    },
    computed: {
      user() {
        return this.$store.getters['global/user']
      },
      isUserLogged() {
        return this.$store.getters['global/isUserLogged']
      },
      isUserMinor() {
        return this.$store.getters['global/isUserMinor']
      },
      navigation() {
        return NAVIGATION.filter(this.mustShowInHome)
      }
    },
    methods: {
      canUseService(item) {
        return this.isUserLogged || item.route.meta.isPublic
      },
      isSuspended(item) {
        let name = item.route.name;
        let suspended = [
          this.$routes.OLD_SERVICES.FEMALE_SCREENING_APP.name
        ];

        return suspended.includes(name);
      },
      goToRoute(item) {
        if (!this.canUseService(item)) return;
        this.$router.push(item.route)
      },
      goToSovracup() {
        openUrl(this.$config.global.oldServicesUrls.prenotazione_visite)
      },
      goToCupNew() {
        this.$router.push(this.$routes.RESERVATIONS.APP)
      },

      // Se siamo su mobile, l'item deve essere mostrato se entrambi i flags sono a false
      mustShowInHome(item) {
        // Facciamo prima il controllo su ciò che può eventualmente vedere il minore
        if (this.isUserMinor && !item.meta.isVisibleToMinor) return false;

        // In test mostriamo sempre tutte le card per comodità
        // if (this.$config.global.isTest) return true

        if (!this.$q.platform.is.mobile) return !item.meta.isHiddenInHome;
        // if (this.$q.screen.gt.sm) return !item.meta.isHiddenInHome
        return !item.meta.isHiddenInHome && !item.meta.isHiddenInMobileHome
      },
      onLogin() {
        login()
      },
      isInMaintenance(item) {
        // if (this.mustShowMedicalReservationAlertNew(item)) {
        //   this.showMedicalPrescriptionAlertNew()
        //   return
        // }

        if (this.mustShowScreeningAlert(item)) {
          this.showScreeningAlertNew();
          return
        }

        this.goToRoute(item)
      },
      mustShowMedicalReservationAlertNew(item) {
        return item.route === this.$routes.RESERVATIONS.APP && !this.$q.platform.is.mobile
      },


      showMedicalPrescriptionAlertNew() {
        this.isMedicalPrescriptionAlertNewVisible = true
      },
      mustShowScreeningAlert(item) {
        let name = item.route.name;
        let names = [
          this.$routes.OLD_SERVICES.FEMALE_SCREENING_APP.name
        ];

        return names.includes(name);
      },
      showScreeningAlertNew() {
        this.isScreeningAlertVisible = true
      },
    }
  }
</script>
