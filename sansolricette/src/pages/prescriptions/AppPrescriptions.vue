<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <csi-service-app-page
    :active-delegation="activeDelegation"
    :service-code="serviceCode"
    delegation-mode
    @set-delegation="setDelegation"
    @unset-delegation="unsetDelegation"
  >
    <template slot="toolbar-content">
      <q-toolbar-title class="cursor-pointer" @click.native="goToServiceHome">
        {{ serviceLabel }}
      </q-toolbar-title>

      <csi-help-button
        @contacts-click="goToContacts"
      />

      <portal-target name="service-toolbar-prescriptions"></portal-target>

    </template>
    <template v-if="isUserMinor">
      <csi-app-user-minor-banner/>
    </template>

    <!-- PAGINA INTERNA -->
    <!-- --------------------------------------------------------------------------------------------------------- -->
    <q-page v-else padding>
      <transition
        v-if="!isLoading && !isLoadingDelegatorList"
        enter-active-class="animated fadeIn csi-animation-duration--300"
        leave-active-class="animated fadeOut csi-animation-duration--300"
        mode="out-in"
      >
        <div>


          <template v-if="$config.global.isNewEnrollableActive">
            <div class="q-my-md">
              <template v-if="!isHelpPage">
                <!-- @TODO: solo per debug -->
                <!--                <csi-buttons>-->
                <!--                  <csi-button secondary :to="$routes.DEV.TESTS_IS_ENROLLABLE">-->
                <!--                    Messaggi arruolamento-->
                <!--                  </csi-button>-->
                <!--                </csi-buttons>-->

                <csi-enrollment-guard2
                  :active-delegator="activeDelegation"
                  :code="enrollmentCode"
                  is-prescriptions-app
                  @click-activate="onActivate"
                />
              </template>

              <template v-if="isHelpPage || !isEnrollmentCodeBlocker">
                <router-view/>
              </template>
            </div>
          </template>

          <!-- IN PROD LASCIAMO IL VECCHIO COMPORTAMENTO PER ORA -->
          <template v-else>
            <template v-if="isEnrollmentModalVisible && isOpen && !isHelpPage">
              <template v-if="isDelegationActive">
                <csi-enrollment-card-delegator

                  :can-open="canOpenFse"
                  :no-data="isActiveUserEnrollmentUnknown"
                  :obbligatorio="obbligatorioArruolamento"
                  @click-activate="onActivate"
                  @click-retry="reload"
                  @click-close="closeModal"
                />
              </template>

              <template v-else>

                <csi-prescription-enrollment-card
                  :can-open="canOpenFse"
                  :not-piedmont="notPiedmontUserEnrollment"
                  required-on-service
                  @click-activate="onActivate"
                />

              </template>
            </template>

            <router-view v-else/>
          </template>


        </div>
      </transition>

      <csi-inner-loading :visible="isLoading || isLoadingDelegatorList"/>
    </q-page>

    <!-- IMMAGINE SOPRA IL FOOTER -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <div class="app-prescriptions-footer">
      <div class="app-prescriptions-footer__waves">
        <div class="app-prescriptions-footer__banner"></div>
      </div>
    </div>
    <template v-if="user && !isLoading && !isLoadingDelegatorList">
      <csi-customer-satisfaction-widget :service-code="serviceCode"/>
    </template>
  </csi-service-app-page>
</template>


<script>
import CsiServiceAppPage from "components/global/common/CsiServiceAppPage";
import CsiHelpButton from "components/global/common/CsiHelpButton";
import CsiEnrollmentCardDelegator from "components/global/common/CsiEnrollmentCardDelegator";
import CsiPrescriptionEnrollmentCard from "components/prescriptions/CsiPrescriptionEnrollmentCard";
import {getArruolabilita} from "@services/api/enrollment";
import {isMinor} from "@services/global/business-logic";
import {equalsIgnoreCase} from "../../services/global/utils";
import {getServiceDelegators} from "../../services/api/delegations";
import {isDelegationValid} from "../../services/delegations/business-logic";
import {createAudit} from "@services/api/online-reports";
import CsiEnrollmentCard from "../../components/enrollment/CsiEnrollmentCard";
import CsiEnrollmentGuard2 from "components/enrollment/CsiEnrollmentGuard2";
import CsiCustomerSatisfactionWidget from "../../components/global/common/CsiCustomerSatisfactionWidget";
import {urlEnrollment} from "../../services/enrollment/business-logic";
import CsiAppUserMinorBanner from "../../components/global/common/CsiAppUserMinorBanner";


export default {
  name: 'AppPrescriptions',
  components: {
    CsiAppUserMinorBanner,
    CsiCustomerSatisfactionWidget,
    CsiEnrollmentGuard2,
    CsiEnrollmentCard,
    CsiPrescriptionEnrollmentCard,
    CsiEnrollmentCardDelegator,
    CsiHelpButton,
    CsiServiceAppPage
  },
  data() {
    return {
      isLoading: false,
      activeUserEnrollmentInfo: null,
      isOpen: true,
      isLoadingDelegatorList: false
    };
  },
  computed: {
    user() {
      return this.$store.getters['global/user']
    },
    cf() {
      return this.$store.getters['prescriptions/getTaxCode']
    },
    isDelegationActive() {
      return this.$store.getters['prescriptions/isDelegationActive']
    },
    activeDelegation() {
      return this.$store.getters['prescriptions/getActiveDelegation']
    },
    isDeclarationActive() {
      return this.isDelegationActive && isMinor(this.activeDelegation.data_nascita_delega)
    },
    appServices() {
      return this.$store.state.global.appServices;
    },
    appService() {
      return this.appServices.find(s => s.codice_servizio === this.serviceCode)
    },
    obbligatorioArruolamento() {

      return this.appService.obbligatorio_arruolamento
    },
    serviceCode() {
      return this.$config.global.appServiceCodes.prescriptions
    },
    serviceLabel() {
      return this.$config.global.appServiceCode2Label[this.serviceCode]
    },
    isActiveUserEnrollable() {
      return this.activeUserEnrollmentInfo && this.activeUserEnrollmentInfo.risposta
    },
    isActiveUserEnrolled() {
      return this.activeUserEnrollmentInfo && this.activeUserEnrollmentInfo.codice_risposta === this.$config.enrollment.codes.FSE_APPROVED
    },
    isActiveUserEnrollmentUnknown() {
      return !this.activeUserEnrollmentInfo || this.activeUserEnrollmentInfo.codice_risposta === this.$config.enrollment.codes.UNKNOWN
    },
    // utente loggato => codice !== 003 && arruolamento obbligatorio
    // delegante      => codice !== 003
    isEnrollmentModalVisible() {
      if (this.isDelegationActive) {
        return !this.isActiveUserEnrolled;
      } else {
        return !this.isActiveUserEnrolled && this.appService.obbligatorio_arruolamento
      }
    },
    // utente loggato => risposta === true || codice in (000, 005)
    // delegante      =>(risposta === true || codice in (000, 005)) && delegante è un minore
    canOpenFse() {
      // true se l'utente corrente (delegante o utente loggato che sia) è arruolabile
      let isEnrollable = this.isActiveUserEnrollable
      let code = this.activeUserEnrollmentInfo ? this.activeUserEnrollmentInfo.codice_risposta : null;
      let enrollableCodes = [this.$config.enrollment.DO_NOT_ASK_ME_AGAIN, this.$config.enrollment.codes.FSE_NOT_APPROVED];
      // true se l'utente corrente (delegante o utente loggato che sia) è arruolabile oppure se ha un codice
      // che permette l'arruolamento
      isEnrollable = isEnrollable || enrollableCodes.includes(code);

      // Se la delega non è attiva => basta controllare se l'utente risulta "arruolabile"
      if (!this.isDelegationActive) return isEnrollable;

      // Se la delega è attiva => è possibile aprire il FSE solo per i minori
      return this.isDeclarationActive || isEnrollable;
    },
    isHelpPage() {
      return this.$route.name === this.$routes.PRESCRIPTIONS.FAQ.name || this.$route.name === this.$routes.PRESCRIPTIONS.CONTACTS.name
    },
    notPiedmontUserEnrollment() {
      return this.activeUserEnrollmentInfo &&
        this.activeUserEnrollmentInfo.codice_risposta === this.$config.enrollment.codes.NO_PIEDMONT
    },
    enrollmentCode() {
      return this.activeUserEnrollmentInfo ? this.activeUserEnrollmentInfo.codice_risposta : null;
    },
    isEnrollmentCodeBlocker() {
      let BLOCK_CODE_LIST = [
        '000',
        '001',
        '002',
        '004',
        '005',
        '007',
        '009',
        '010',
        '011',
        '013',
        '014',
        '015',
        '017',
      ];

      return BLOCK_CODE_LIST.includes(this.enrollmentCode)
    },
    isUserMinor() {
      return this.$store.getters['global/isUserMinor']
    }
  },
  watch: {
    cf: {
      immediate: true,
      handler() {
        this.reload()
      }
    },
  },
  async created() {
    let {d} = this.$route.query;

    if (this.isUserMinor) return;

    if (d && this.user) {
      this.isLoadingDelegatorList = true;
      await this.preselectDelegation(d);
      this.isLoadingDelegatorList = false;
    }
  },
  methods: {
    closeModal() {
      this.isOpen = false
    },
    async reload() {
      if (this.isUserMinor) return;
      this.isLoading = true;
      let params = {servizio: this.serviceCode};
      let httpConfig = {params, _no5XXRedirect: true};

      try {
        let {data} = await getArruolabilita(this.cf, httpConfig);
        this.activeUserEnrollmentInfo = data;
        this.$store.commit('prescriptions/setActiveEnrollment', this.activeUserEnrollmentInfo);
      } catch (e) {
        console.error(e);
        this.activeUserEnrollmentInfo = null;
      }

      try {
        let taxCode = this.$store.getters['prescriptions/getTaxCode'];
        let payload = {codice_verticale: "promem"};
        createAudit(taxCode, payload, {_no5XXRedirect: true});
      } catch (error) {
        console.error(error);
      }

      this.isLoading = false;
    },
    onActivate() {
      // let name = this.$routes.ENROLLMENT.FLOW.name;
      // let query = {};
      //
      // if (this.isDeclarationActive) {
      //   query = {
      //     minore: this.activeDelegation.codice_fiscale_delega,
      //     servizio: this.$config.global.appServiceCodes.prescriptions
      //   }
      // }
      //
      // this.$router.push({name, query});

      let serviceCode = this.$config.global.appServiceCodes.prescriptions

      let url = urlEnrollment(serviceCode, this.isDeclarationActive, this.isDelegationActive, this.activeDelegation)
      window.location.assign(url);
    },
    async onExit() {
      this.$router.push(this.$routes.GLOBAL.APP);
    },
    setDelegation(delegator) {
      this.$store.commit('prescriptions/setActiveDelegation', {delegator});
      this.$router.push(this.$routes.PRESCRIPTIONS.APP);
    },
    unsetDelegation() {
      this.$store.commit('prescriptions/unsetActiveDelegation');
      this.$router.push(this.$routes.PRESCRIPTIONS.APP);
    },
    goToServiceHome() {
      this.$router.push(this.$routes.PRESCRIPTIONS.APP)
    },
    goToFaq() {
      this.$router.push(this.$routes.PRESCRIPTIONS.FAQ)
    },
    goToContacts() {
      this.$router.push(this.$routes.PRESCRIPTIONS.CONTACTS)
    },
    async preselectDelegation(delegatorTaxCode) {
      let taxCode = this.user.cf;
      let delegatorList = [];

      try {
        let {data} = await getServiceDelegators(taxCode, this.serviceCode, {_no5XXRedirect: true});

        delegatorList = data.filter(delegator => {
          return delegator.deleghe.some(delegation => {
            return equalsIgnoreCase(delegation.codice_servizio, this.serviceCode) && isDelegationValid(delegation.stato_delega)
          })
        });
      } catch (e) {
      }

      let delegator = delegatorList.find(el => el.codice_fiscale_delega === delegatorTaxCode);
      if (delegator) this.setDelegation(delegator);
    },
  },
}
</script>

<style lang="stylus" scoped>
.app-prescriptions-footer
  width: 100%
  margin-top: 16px
  margin-bottom: -3px

.app-prescriptions-footer__waves
  background-image: url('../../statics/images/footer-onde.svg')
  background-repeat: no-repeat;
  background-position: center top;
  background-size: auto;
  min-height: 400px;

.app-prescriptions-footer__banner
  background-image: url('../../statics/images/prescriptions/prescriptions-footer-banner.svg')
  background-repeat: no-repeat;
  background-position: center top;
  background-size: 1000px 400px;
  min-height: 400px;
</style>
