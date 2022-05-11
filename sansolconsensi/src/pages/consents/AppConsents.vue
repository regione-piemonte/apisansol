<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <csi-service-app-page
    :active-delegation="$store.getters['consents/getActiveDelegation']"
    :service-code="serviceCode"
    delegation-mode
    fse-doc-delegators
    portal-target-name="service-toolbar-income-exemption"
    toolbar-title="Gestione Consensi"
    @title-click="goToServiceHome"
    @set-delegation="setDelegation"
    @unset-delegation="unsetDelegation"
  >

    <template slot="toolbar-title-after">
      <!--      <template v-if="$config.global.isDevelopment || $config.global.isTest">-->
      <!--        <template v-if="!isLoadingDelegatorList">-->
      <!--          <template v-if="isVisibibleFseBtn">-->
      <!--            <csi-consents-change-button/>-->
      <!--          </template>-->
      <!--        </template>-->
      <!--      </template>-->
      <csi-help-button
        @contacts-click="goToContacts"
      />
      <!--      <q-btn flat round icon="help">-->
      <!--        <q-popover style="min-width: 180px;">-->
      <!--          <q-list separator link sparse class="no-padding">-->
      <!--            <q-item v-close-overlay @click.native="goToFaq()">-->
      <!--              &lt;!&ndash;<q-item-side icon="person"></q-item-side>&ndash;&gt;-->
      <!--              <q-item-main>-->
      <!--                <q-item-tile label>FAQ</q-item-tile>-->
      <!--              </q-item-main>-->
      <!--            </q-item>-->

      <!--            <q-item v-close-overlay @click.native="goToContacts()">-->
      <!--              &lt;!&ndash;<q-item-side icon="exit_to_app"></q-item-side>&ndash;&gt;-->
      <!--              <q-item-main>-->
      <!--                <q-item-tile label>Contatti</q-item-tile>-->
      <!--              </q-item-main>-->
      <!--            </q-item>-->
      <!--          </q-list>-->
      <!--        </q-popover>-->

      <!--        <q-tooltip>Aiuto</q-tooltip>-->
      <!--      </q-btn>-->
    </template>



    <!-- Qui vengono renderizzate tutte le pagine relative all'accelleratore "Consensi" -->
    <template v-if="configUpdate">
      <csi-update-page/>
    </template>

    <template v-else-if="isLoadingDelegatorList">
      <q-page class="flex flex-center">
        <csi-inner-loading :visible="true" block/>
      </q-page>
    </template>

    <template v-else>
      <template v-if="isUserMinor">
        <csi-app-user-minor-banner />
      </template>
      <template v-else>
        <template v-if="$config.global.isNewEnrollableActive">
          <q-page padding>
            <div class="q-my-md" v-show="isEnrollmentGuardVisibile">
              <csi-enrollment-guard2
                :code="enrollmentCode"
                :active-delegator="activeDelegation"
                is-consent-app
                @click-activate="onActivate"
              />
            </div>

            <template v-if="!isEnrollmentCodeBlocker">
              <router-view @page-load="pageLoad"/>
            </template>
          </q-page>
        </template>

        <!-- IN PROD LASCIAMO IL VECCHIO COMPORTAMENTO PER ORA -->
        <template v-else>
          <router-view/>
        </template>
      </template>

    </template>

    <!-- IMMAGINE SOPRA IL FOOTER -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <div class="app-consents-footer">
      <div class="app-consents-footer__waves">
        <div class="app-consents-footer__banner"></div>
      </div>
    </div>
    <template v-if="user && isPageLoad">
      <csi-customer-satisfaction-widget :service-code="serviceCode"/>
    </template>
  </csi-service-app-page>
</template>


<script>
//import {getConsentsList} from "@services/api/consents";


import CsiServiceAppPage from "components/global/common/CsiServiceAppPage";
import CsiUpdatePage from "components/global/common/CsiUpdatePage";
import {config} from "@plugins/config";
import router from "@router";
import CsiConsentsChangeButton from "../../components/consents/CsiConsentsChangeButton";
import {appDetailFaq, isMinor} from "../../services/global/business-logic";
import {getArruolabilita} from "../../services/api/enrollment";
import {equalsIgnoreCase} from "../../services/global/utils";
import {getDelegators, getServiceDelegators} from "@services/api/delegations";
import {isDelegationValid} from "@services/delegations/business-logic";
import CsiHelpButton from "../../components/global/common/CsiHelpButton";
import {createAudit} from "@services/api/online-reports";
import CsiEnrollmentGuard2 from "components/enrollment/CsiEnrollmentGuard2";
import CsiCustomerSatisfactionWidget from "../../components/global/common/CsiCustomerSatisfactionWidget";
import {urlEnrollment} from "../../services/enrollment/business-logic";
import CsiAppUserMinorBanner from "../../components/global/common/CsiAppUserMinorBanner";

export default {
  name: 'AppConsents',
  data() {
    return {
      configUpdate: config.isToUpdate,
      isLoading: false,
      isLoadingDelegatorList: false,
      isPageLoad:false
    }
  },
  components: {
    CsiAppUserMinorBanner,
    CsiCustomerSatisfactionWidget,
    CsiEnrollmentGuard2, CsiHelpButton, CsiConsentsChangeButton, CsiServiceAppPage, CsiUpdatePage
  },
  computed: {
    user() {
      return this.$store.getters['global/user']
    },
    taxCode() {
      return this.$store.getters['consents/getTaxCode']
    },
    serviceCode() {
      return this.$config.global.appServiceCodes.consents
    },
    isPiedmontUser() {
      return this.$store.getters['global/isPiedmontUser']
    },
    activeDelegation() {
      return this.$store.getters['consents/getActiveDelegation']
    },
    isDelegationActive() {
      return this.$store.getters["consents/isDelegationActive"];
    },
    isDeclarationActive() {
      return (
        this.isDelegationActive &&
        isMinor(this.activeDelegation.data_nascita_delega)
      );
    },
    activeUserEnrollmentInfo() {
      return this.$store.getters["consents/getActiveUserEnrollmentInfo"];
    },
    isActiveUserEnrollable() {
      return (
        this.activeUserEnrollmentInfo && this.activeUserEnrollmentInfo.risposta
      );
    },
    isVisibibleFseBtn() {
      let isActiveFseDelegation = this.activeDelegation && this.activeDelegation.deleghe.some(delegation => {
        return equalsIgnoreCase(delegation.codice_servizio, this.$config.enrollment.serviceCodes.consents)
      })

      return (!this.isDelegationActive || isActiveFseDelegation)
    },
    enrollmentCode() {
      return this.activeUserEnrollmentInfo ? this.activeUserEnrollmentInfo.codice_risposta : null;
    },
    isEnrollmentCodeBlocker() {
      // @NOTA: Questo è uno dei pochi verticali che ha un comportamento diverso
      //        Quindi è normale se i codici di blocco riportati qui sotto sono diversi
      //        da quelli presenti negli altri applicativi
      let BLOCK_CODE_LIST = [
        '001',
        '002',
        '007',
        '009',
        '011',
        '013',
        '014',
        '015',
      ];

      return BLOCK_CODE_LIST.includes(this.enrollmentCode)
    },
    isEnrollmentGuardVisibile(){
      let meta = this.$route.meta && this.$route.meta.showEnrollmentAlert;
      return this.isEnrollmentCodeBlocker || meta
    },
    isUserMinor(){
      return this.$store.getters['global/isUserMinor']
    }
  },
  async created() {
    let {d} = this.$route.query;
    if(this.isUserMinor) return;

    if (d && this.user) {
      this.isLoadingDelegatorList = true;
      await this.preselectDelegation(d);
      this.isLoadingDelegatorList = false;
    }

  },
  methods: {
    onActivate() {
      // let name = this.$routes.ENROLLMENT.FLOW.name;
      // let query = {};
      //
      // if (this.isDeclarationActive) {
      //   query = {
      //     minore: this.activeDelegation.codice_fiscale_delega,
      //     servizio: this.$config.global.appServiceCodes.consents
      //   };
      // }
      //
      // this.$router.push({name, query});


      let serviceCode= this.$config.global.appServiceCodes.consents

      let url = urlEnrollment(serviceCode, this.isDeclarationActive, this.isDelegationActive, this.activeDelegation )
      window.location.assign(url);
    },
    goToServiceHome() {
      this.$router.push(this.$routes.CONSENTS.APP)
    },
    setDelegation(delegator) {
      this.$store.commit('consents/setActiveDelegation', {delegator});
      // Per far ripartire il flusso dall'inizio
      this.$router.push(this.$routes.CONSENTS.APP);
    },
    unsetDelegation() {
      this.$store.commit('consents/unsetActiveDelegation');
      // Per far ripartire il flusso dall'inizio
      this.$router.push(this.$routes.CONSENTS.APP);
    },
    goToContacts() {
      this.$router.push(this.$routes.CONSENTS.CONTACTS)
    },
    async preselectDelegation(delegatorTaxCode) {
      let taxCode = this.user.cf;
      let delegatorList = [];

      try {
        // let {data} = await getServiceDelegators(taxCode, this.serviceCode, {_no5XXRedirect: true});
        let {data} = await getDelegators(taxCode, {_no5XXRedirect: true});

        // Prendiamo solo i deleganti di CONSENSI o di FSEDOC
        delegatorList = data.filter(delegator => {
          return delegator.deleghe.some(delegation => {
            let isServiceDelegator = equalsIgnoreCase(delegation.codice_servizio, this.serviceCode);
            isServiceDelegator = isServiceDelegator || equalsIgnoreCase(delegation.codice_servizio, 'FSEDOC');
            let isValid = isDelegationValid(delegation.stato_delega);
            return isServiceDelegator && isValid;
          })
        });
      } catch (e) {
      }

      let delegator = delegatorList.find(el => el.codice_fiscale_delega === delegatorTaxCode || el.uuid === delegatorTaxCode);
      if (delegator) this.setDelegation(delegator);
    },
    async reload() {
      this.isLoading = true;
      let activeUserEnrollmentInfo = null
      let params = {servizio: this.serviceCode};
      let httpConfig = {params, _no5XXRedirect: true};

      try {
        let {data} = await getArruolabilita(this.taxCode, httpConfig);
        activeUserEnrollmentInfo = data;
      } catch (e) {
        console.error(e);
        // Se fallisce per CONSENSI => proviamo con la delega di FSEDOC
        params = {servizio: 'FSEDOC'};
        httpConfig = {params, _no5XXRedirect: true};
        let {data} = await getArruolabilita(this.taxCode, httpConfig);
        activeUserEnrollmentInfo = data;
      } finally {
        console.log('dispatch', activeUserEnrollmentInfo)
        this.$store.commit('consents/setActiveUserEnrollmentInfo', activeUserEnrollmentInfo);
      }

      try {
        let taxCode = this.$store.getters['consents/getTaxCode'];
        let payload = {codice_verticale: "CONSENSI"};
        createAudit(taxCode, payload, {_no5XXRedirect: true});
      } catch (error) {
        console.error(error);
      }

      this.isLoading = false;
    },

    pageLoad(){
      this.isPageLoad=true
    }
  },
  watch: {
    taxCode: {
      immediate: true,
      handler() {
        this.reload();
      }
    }
  },
}
</script>
<style lang="stylus" scoped>
.app-consents-footer
  width: 100%
  margin-top: 16px
  margin-bottom: -3px

.app-consents-footer__waves
  background-image: url('../../statics/images/footer-onde.svg')
  background-repeat: no-repeat;
  background-position: center top;
  background-size: auto;
  min-height: 400px;

.app-consents-footer__banner
  background-image: url('../../statics/images/consents/consents-footer-banner.svg')
  background-repeat: no-repeat;
  background-position: center top;
  background-size: 1000px 400px;
  min-height: 400px;
</style>
