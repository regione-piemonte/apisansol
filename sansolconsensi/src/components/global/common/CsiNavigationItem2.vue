<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="csi-navigation-item-2">
    <q-item
      :tag="isInternalRoute ? 'router-link' : 'a'"
      :href="app.url"
      :to="isInternalRoute ? internalRoutePath : undefined"
      :link="canNavigate"
      class="csi-link-seamless relative-position"
      :class="{'no-pointer-events': !canNavigate, 'csi-navigation-item-2__item--external': !isInternalRoute}"
      @click.native.capture="goToRoute"
    >
      <template v-if="app.icona_url">
        <q-item-side class="csi-navigation-item-2__icon">
          <img :src="app.icona_url" alt="icona">
        </q-item-side>
      </template>

      <q-item-main :class="{'text-grey': !canNavigate}">
        <q-item-tile label class="q-body-2" :class="{'text-primary': canNavigate, 'text-grey-8': !canNavigate}">
          {{app.descrizione}}
        </q-item-tile>
      </q-item-main>

      <q-item-side v-if="!canNavigate" right>
        <q-icon name="lock" class="csi-icon--xs"></q-icon>
      </q-item-side>
    </q-item>
    <template v-if="isMultiLevelMenu && canNavigate">
      <q-list dense no-border>
        <div
          class="row items-center csi-menu-list-item--child q-px-sm"
          v-for="menu in filteredMenuList"
          :key="menu.id"
        >
          <div class="col-2 csi-menu-list-item--child-item relative-position">
          </div>
          <q-item
            tag="a"
            :href="menu.url"
            link
            class="csi-menu-list-item col csi-link-seamless"
          >
            <q-item-main>
              <q-item-tile class="q-body-2 text-primary">
                {{ menu.descrizione }}
              </q-item-tile>
            </q-item-main>
          </q-item>
        </div>

      </q-list>
    </template>

    <!-- MODAL ALERT PRENOTAZIONI VISITE ED ESAMI -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <q-modal v-model="isMedicalPrescriptionAlertVisible" minimized :content-css="{maxWidth: '800px'}">
      <div class="q-pa-md">
        <q-alert color="info">
          <div class="text-weight-bold">Attenzione:</div>
          Il servizio di prenotazione visite ed esami è in fase di evoluzione, al momento è accessibile solo mediante le
          credenziali imputabili Sistema Piemonte o Torino Facile o smart card/Business Key.
          <a
            href="https://www.regione.piemonte.it/web/temi/sanita/accesso-ai-servizi-sanitari/cosa-serve-per-accedere-ai-servizi-on-line">
            Scopri di più
          </a>
        </q-alert>

        <csi-buttons class="q-mt-md">
          <template v-if="internalRoutePath">
            <csi-button v-close-overlay :to="internalRoutePath" label="Continua"/>
          </template>
          <template v-else>
            <csi-button v-close-overlay type="a" :href="app.url" label="Continua"/>
          </template>

          <csi-button v-close-overlay secondary label="Annulla"/>
        </csi-buttons>
      </div>
    </q-modal>
  </div>
</template>

<script>
  import CsiIconBase from "components/global/icons/CsiIconBase";
  import {orderBy} from "../../../services/global/utils";

  export default {
    name: "CsiNavigationItem2",
    components: {CsiIconBase},
    props: {
      app: {type: Object, required: true},
    },
    data() {
      return {
        isMedicalPrescriptionAlertVisible: false,
      }
    },
    computed: {
      user() {
        return this.$store.getters['global/user']
      },
      isUserLogged() {
        return this.$store.getters["global/isUserLogged"];
      },
      isInternalRoute() {
        // return this.app.url.startsWith(`${location.origin}/#/`)
        return this.app.url.includes(`/la-mia-salute/#/`)
      },
      internalRoutePath() {
        return this.app.url.split('#')[1]
      },
      canNavigate() {
        return this.app.pubblico || this.isUserLogged;
      },
      menuList(){
        return this.app ? this.app.menu : []
      },
      filteredMenuList() {
        let isMobile = this.$q.platform.is.mobile;

        let menuListItems = this.menuList.filter(m => {
          if (isMobile) return m.visibile_menu_mobile;
          return m.visibile_menu_desktop;
        });


        return orderBy(menuListItems, ["posizione"])
      },
      isMultiLevelMenu() {
        return this.filteredMenuList && this.filteredMenuList.length > 0
      },
    },
    methods: {
      goToRoute(event) {
        // if (this.mustShowMedicalReservationAlert(this.app)) {
        //   this.showMedicalPrescriptionAlert();
        //   event.preventDefault();
        //   event.stopPropagation();
        //   event.stopImmediatePropagation();
        // }
      },
      goToMedicalReservationApp() {
        this.$router.push(this.$routes.OLD_SERVICES.MEDICAL_RESERVATIONS_APP)
      },
      mustShowMedicalReservationAlert(app) {
        let isMedicalReservation = app.codice === 'PRENOTAZIONE_ESAMI';
        return isMedicalReservation && this.isUserLogged && this.user.autenticazione_metodo === 'SPID'
      },
      showMedicalPrescriptionAlert() {
        this.isMedicalPrescriptionAlertVisible = true
      },
    }
  };
</script>


<style lang="stylus">
@require '~variables'

  .csi-navigation-item-2

    .router-link-active
      background-color: $blue-1

    &__item--external.router-link-active
      background-color: unset

      &:hover
        background-color: rgba(189,189,189,0.5)

  .csi-navigation-item-2__icon
    min-width: 0
    height: 24px
    width: 24px

    img
      max-width: 100%
      height: auto

  .csi-menu-list-item--child
    .csi-menu-list-item--child-item
      height: 48px
      &::before
        content: ""
        position: absolute
        top: -2px
        bottom: 50%
        width: 50%
        left: calc(50% - 4px)
        border-left: 2px solid $primary;
        border-bottom: 2px solid $primary;
    &:not(:last-child)
      .csi-menu-list-item--child-item
        &::after
          content: ""
          position: absolute
          top: -2px
          bottom: 0
          width: 2px
          right: auto
          left:  calc(50% - 4px)
          border-left: 2px solid $primary
    .csi-menu-list-item--active
      background-color: #FFFFFF !important
</style>
