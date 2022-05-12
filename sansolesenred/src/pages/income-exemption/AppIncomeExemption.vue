<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <csi-service-app-page
    toolbar-title="Esenzioni per reddito"
    portal-target-name="service-toolbar-income-exemption"
    @title-click="goToServiceHome">

    <template slot="toolbar-title-after">
      <csi-help-button
        @contacts-click="goToContacts"
      />
    </template>

    <csi-update-page v-if="configUpdate"/>

    <template v-else-if="isUserMinor">
      <csi-app-user-minor-banner/>
    </template>

    <!-- Qui vengono renderizzate tutte le pagine relative all'accelleratore "Esenzioni per reddito" -->
    <router-view v-else @page-load="pageLoad"/>




    <div class=" text-right layout-padding" v-if="!$route.meta.privacy">
      <router-link :to="$routes.INCOME_EXEMPTION.POLICY"
                   class="text-italic  csi-link ">
        Privacy e condizioni d'uso
      </router-link>
    </div>

    <!-- IMMAGINE SOPRA IL FOOTER -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <div class="app-income-exemption-footer">
      <div class="app-income-exemption-footer__waves">
        <div class="app-income-exemption-footer__banner"></div>
      </div>
    </div>

    <template v-if="user && isPageLoad">
      <csi-customer-satisfaction-widget :service-code="serviceCode"/>
    </template>

  </csi-service-app-page>
</template>


<script>
  import CsiServiceAppPage from "components/global/common/CsiServiceAppPage";
  import CsiUpdatePage from "components/global/common/CsiUpdatePage";
  import {config} from "@plugins/config";
  import {getConfiguration, getInfo} from "@services/api/income-exemption";
  import CsiHelpButton from "components/global/common/CsiHelpButton";
  import {getArruolabilita} from "../../services/api/enrollment";
  import CsiCustomerSatisfactionWidget from "../../components/global/common/CsiCustomerSatisfactionWidget";
  import CsiAppUserMinorBanner from "../../components/global/common/CsiAppUserMinorBanner";

  export default {
    name: 'AppIncomeExemption',
    components: {CsiAppUserMinorBanner, CsiCustomerSatisfactionWidget, CsiHelpButton, CsiServiceAppPage, CsiUpdatePage},
    data() {
      return {
        configUpdate: config.isToUpdate,
        isPageLoad:false
      }
    },
    computed: {
      user() {
        return this.$store.getters['global/user']
      },
      serviceCode() {
        return this.$config.global.appServiceCodes.incomeExemption
      },
      isUserMinor(){
        return this.$store.getters['global/isUserMinor']
      }
    },
    async created() {
      if(this.isUserMinor) return;
      let infoPromise = getInfo(this.user.cf);
      let configurationPromise = getConfiguration()

      let params = {servizio: this.serviceCode};
      let httpConfig = {params, _no5XXRedirect: true};
      let enrollmentInfoPromise = getArruolabilita(this.user.cf, httpConfig);

      try {
        let infoResponse = await infoPromise
        this.$store.dispatch('incomeExemption/setUserInfo', {cf: this.user.cf, info: infoResponse.data})
      } catch (error) {
        console.error(error);
      }

      try {
        let configurationResponse = await configurationPromise
        this.$store.dispatch('incomeExemption/setConfiguration', {configuration: configurationResponse.data})
      } catch (error) {
        console.error(error);
      }

      try {
        let enrollmentInfo = await enrollmentInfoPromise;
        this.$store.dispatch('incomeExemption/setActiveUserEnrollmentInfo', {activeUserEnrollmentInfo: enrollmentInfo.data})
      } catch (error) {
        console.error(error);
      }
    },
    methods: {
      goToServiceHome() {
        this.$router.push(this.$routes.INCOME_EXEMPTION.APP)
      },
      goToFaq() {
        this.$router.push(this.$routes.INCOME_EXEMPTION.FAQ)
      },
      goToContacts() {
        this.$router.push(this.$routes.INCOME_EXEMPTION.CONTACTS)
      },
      pageLoad(){
        this.isPageLoad=true
      }
    },
  }
</script>
<style scoped lang="stylus">
  .app-income-exemption-footer
    width: 100%
    margin-top: 16px
    margin-bottom: -3px

  .app-income-exemption-footer__waves
    background-image: url('../../statics/images/footer-onde.svg')
    background-repeat: no-repeat;
    background-position: center top;
    background-size: auto;
    min-height: 400px;

  .app-income-exemption-footer__banner
    background-image: url('../../statics/images/income-exemption/income-exemption-footer-banner.svg')
    background-repeat: no-repeat;
    background-position: center top;
    background-size: 1000px 400px;
    min-height: 400px;
</style>
