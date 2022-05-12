<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-layout-footer :class="{'csi-footer__no-shadow' : noFooterShadow}">

    <!-- VALUTAZIONE -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <div v-if="!noRating" class="bg-primary text-white q-px-md q-py-lg row justify-center gutter-x-sm no-margin">
      <div class="col-auto">
        <q-icon name="chat_bubble_outline" class="csi-icon--md"/>
      </div>
      <div class="col-auto cursor-pointer" @click="$emit('rating-click')">
        <div class="q-headline">Valuta questo servizio</div>
        <div class="q-body-1">Aiutaci a migliorare</div>
      </div>
    </div>

    <!-- HELP -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <div class="bg-primary q-pa-md">
      <div class="row gutter-md">

        <div class="col-12 col-md-auto text-center">
          <img
            src="statics/images/logo-regione-piemonte.svg"
            alt="Regione Piemonte"
            class="csi-logo-regione"
          >
        </div>

        <div class="col-12 col-md-auto text-center">
          <img
            src="statics/images/logo-fesr.svg"
            alt="Fondo europeo di sviluppo regionale"
            class="csi-logo-fesr"
          >
        </div>

        <div class="col-12 col-md"></div>

        <template v-if="buttonCanSee">
          <div class="col-12 col-md-auto text-white csi-app-footer__help">
            <div class="q-title" style="font-size: 20px;">Hai bisogno di aiuto?</div>


            <csi-help-button
              class="q-title"
              square
              :multiple="buttonCanSee"
              @contacts-click="goToContacts"
            />
          </div>
        </template>
      </div>
    </div>


    <!-- LINKS -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <div class="bg-blue-10 q-pa-md text-white text-center row justify-between items-center gutter-y-md no-margin">

      <div class="col-12 col-sm-auto">

        <a :href="urlPiemonteTu">
          <img src="statics/images/logo-piemonte-tu.svg" alt="Logo CSI" class="responsive" style="max-width: 180px;">
        </a>

        <q-btn v-if="isReservations" @click="onLogin" color="white"></q-btn>
      </div>


      <div class="col-12 col-sm-auto">
        <img src="statics/images/logo-csi.svg" alt="Logo CSI" class="responsive" style="max-width: 180px;">
      </div>
    </div>

    <!-- LINK SECONDARI -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <div class="csi-app-footer__links-secondary bg-blue-10 q-pa-md text-white row items-center gutter-y-sm no-margin">
      <div class="col-12 bg-blue-10 q-px-sm" style="padding-top: 0">
        <div class="bg-grey-5" style="height: 1px"></div>
      </div>

      <div class="col-12 col-sm-auto">
        <div class="row items-center">
          <a :href="urlPrivacyPolicy" target="_blank"   class="col-12 col-md-auto pis-footer__external-links q-pa-sm">
            Note legali e privacy
          </a>
          <a :href="urlCookiePolicy" target="_blank"  class="col-12 col-md-auto pis-footer__external-links q-pa-sm" >
            Cookie Policy
          </a>
        </div>

      </div>

      <template v-if="$q.screen.gt.xs">
        <div class="col"></div>
      </template>

      <!-- VERSION -->
      <!-- ----------------------------------------------------------------------------------------------------------- -->
      <template v-if="!noVersion">
        <div class="col-12 col-sm-auto q-caption">
          Versione: <strong>{{$config.global.version}}</strong>
        </div>
      </template>
    </div>
  </q-layout-footer>
</template>


<script>

  import {config} from '@plugins/config'
  import {routes} from '@plugins/routes'
  import CsiHelpButton from 'components/global/common/CsiHelpButton'
  import {login} from "@services/global/session";
  import {toLower} from "@filters/cases";
  import {appDetailFaq, urlCookiePolicy, urlPrivacyPolicy} from "../../../services/global/business-logic";

  const BUTTONS_CODES = [
    config.global.appServiceCodes.delegations,
    config.global.appServiceCodes.onlineReports,
    config.global.appServiceCodes.healthPayments,
    config.global.appServiceCodes.incomeExemption,
    config.global.appServiceCodes.pathologyExemption,
    config.global.appServiceCodes.consents,
    config.global.appServiceCodes.prescriptions,
    config.global.appServiceCodes.reservations,
    config.global.appServiceCodes.covid,
    config.global.appServiceCodes.changeDoctor,
  ];

  const FAQ_ROUTE_MAP = {
    [config.global.appServiceCodes.delegations]: routes.DELEGATIONS.FAQ,
    [config.global.appServiceCodes.onlineReports]: routes.ONLINE_REPORTS.FAQ,
    [config.global.appServiceCodes.healthPayments]: routes.HEALTH_PAYMENTS.FAQ,
    [config.global.appServiceCodes.incomeExemption]: routes.INCOME_EXEMPTION.FAQ,
    [config.global.appServiceCodes.consents]: routes.CONSENTS.FAQ,
    [config.global.appServiceCodes.prescriptions]: routes.PRESCRIPTIONS.FAQ,
    [config.global.appServiceCodes.reservations]: routes.RESERVATIONS.FAQ,
    [config.global.appServiceCodes.covid]: routes.COVID.FAQ,
  };

  const CONTACTS_ROUTE_MAP = {
    [config.global.appServiceCodes.delegations]: routes.DELEGATIONS.CONTACTS,
    [config.global.appServiceCodes.onlineReports]: routes.ONLINE_REPORTS.CONTACTS,
    [config.global.appServiceCodes.healthPayments]: routes.HEALTH_PAYMENTS.CONTACTS,
    [config.global.appServiceCodes.incomeExemption]: routes.INCOME_EXEMPTION.CONTACTS,
    [config.global.appServiceCodes.consents]: routes.CONSENTS.CONTACTS,
    [config.global.appServiceCodes.prescriptions]: routes.PRESCRIPTIONS.CONTACTS,
    [config.global.appServiceCodes.reservations]: routes.RESERVATIONS.CONTACTS,
    [config.global.appServiceCodes.covid]: routes.COVID.CONTACTS,
    [ config.global.appServiceCodes.changeDoctor] : routes.CHANGE_DOCTOR.CONTACTS
  };


  export default {
    name: 'CsiAppFooter',
    components: {CsiHelpButton},
    props: {
      noRating: {type: Boolean, required: false, default: false},
      noVersion: {type: Boolean, required: false, default: false},
      noHelp: {type: Boolean, required: false, default: false},
    },
    data() {
      return {
        buttonCanSee: false
      }
    },
    watch: {
      $route(to, from) {
        this.buttonCanSee = BUTTONS_CODES.includes(to.meta.appServiceCode)
      }
    },
    computed: {
      isUserLogged() {
        return this.$store.getters['global/isUserLogged']
      },
      isReservations() {
        return this.$route.meta.appServiceCode === "RESERVATIONS";
      },
      noFooterShadow() {
        let serviceCode = this.$route.meta.appServiceCode;
        let codes = [
          this.$config.global.appServiceCodes.asr,
          this.$config.global.appServiceCodes.fse,
        ]

        return !codes.includes(serviceCode);
      },
      isProduction(){
        return this.$config.global.isProduction || this.$config.global.isAlpha
      },

      urlPiemonteTu() {
        return this.isUserLogged
          ? 'url'
          : 'url';
      },
      serviceCode(){
        return this.$route.meta.appServiceCode
      },
      urlPrivacyPolicy(){
        return urlPrivacyPolicy();
      },
      urlCookiePolicy(){
        return urlCookiePolicy();
      }
    },
    created() {
      this.buttonCanSee = BUTTONS_CODES.includes(this.$route.meta.appServiceCode)
    },
    methods: {
      async onLogin() {
        let route = this.$routes.RESERVATIONS.HOME_COLNE;
        this.$router.push(route)

      },
      goToHelp() {
        let route = this.$routes.GLOBAL.CONTACTS_HELP;
        this.$router.push(route)
      },
      goToFaq() {
        let serviceCode = this.$route.meta.appServiceCode;
        let params = {flag: true};
        let route = '';
        route = FAQ_ROUTE_MAP[serviceCode];
        this.$router.push({name: route.name, params})
      },
      goToContacts() {
        let serviceCode = this.$route.meta.appServiceCode;
        let params = {flag: false};
        let route = CONTACTS_ROUTE_MAP[serviceCode];
        if (!route) route = this.$routes.GLOBAL.CONTACTS_HELP;

        this.$router.push({name: route.name, params})

      },


    }
  }
</script>


<style scoped lang="stylus">
  @require '~variables'

  .csi-logo-regione {
    width: 100%;
    max-width: 160px;
    height: auto;
  }

  .csi-logo-fesr {
    width: 100%;
    max-width: 280px;
    height: auto;
  }

  .csi-footer__no-shadow.q-layout-footer
    box-shadow: none;

  .csi-app-footer__help {
    text-align: center;
    order: -1;
  }

  .csi-app-footer__links-secondary {
    text-align: center;

    & a{
      color: #FFF
      text-decoration: none
      font-size: 18px

      &:hover{
        text-decoration: underline
      }
    }
  }

  @media (min-width: $breakpoint-md)
    .csi-app-footer__help
      text-align: right;
      order: 1;

    .csi-app-footer__links-secondary {
      text-align: left;
    }
</style>
