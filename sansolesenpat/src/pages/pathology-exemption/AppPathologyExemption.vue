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

      <portal-target name="service-toolbar-pathology-exemption"></portal-target>

      <template v-if="isVisibilityBtn">
        <csi-pathology-visibility-button
          :cf="cf"
          :declaration="isDeclarationActive"
          :delegation="isDelegationActive"
          :enrollment-info="activeUserEnrollmentInfo"
        />
      </template>

      <div></div>

      <csi-help-button
        @contacts-click="goToContacts"
      />
    </template>

    <template v-if="isUserMinor">
      <csi-app-user-minor-banner/>
    </template>

    <q-page v-else padding>
      <transition
        v-if="!isLoading && !isLoadingDelegatorList"
        enter-active-class="animated fadeIn csi-animation-duration--300"
        leave-active-class="animated fadeOut csi-animation-duration--300"
        mode="out-in"
      >


        <template v-if="$config.global.isNewEnrollableActive">
          <div class="q-my-md">
            <template v-if="!isHelpPage">
              <csi-enrollment-guard2
                :active-delegator="activeDelegation"
                :code="enrollmentCode"
                is-esenpat-app
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
                @click-activate="onActivate"
                @click-retry="reload"
                @click-close="closeModal"
              />
            </template>

            <template v-else>
              <csi-pathology-enrollment-card
                :can-open="canOpenFse"
                :not-piedmont="notPiedmontUserEnrollment"
                required-on-service
                @click-activate="onActivate"
                @click-exit="onExit"
              />
            </template>
          </template>
          <!-- Qui vengono renderizzate tutte le pagine relative all'accelleratore-->
          <router-view v-else/>
        </template>


      </transition>

      <csi-inner-loading :visible="isLoading || isLoadingDelegatorList"/>
    </q-page>
    <!-- IMMAGINE SOPRA IL FOOTER -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <div class="app-pathology-exemption-footer">
      <div class="app-pathology-exemption-footer__waves">
        <div class="app-pathology-exemption-footer__banner"></div>
      </div>
    </div>

    <template v-if="user">
      <csi-customer-satisfaction-widget :service-code="serviceCode"/>
    </template>
  </csi-service-app-page>
</template>

<script>
import CsiServiceAppPage from "components/global/common/CsiServiceAppPage";
import CsiHelpButton from "components/global/common/CsiHelpButton";
import CsiActiveDelegationToolbar from "components/global/common/CsiActiveDelegationToolbar";
import CsiPathologyVisibilityButton from "../../components/pathology-exemption/CsiPathologyVisibilityButton";
import {getArruolabilita, saveDoNotAskMeAgain} from "../../services/api/enrollment";
import {isMinor} from "../../services/global/business-logic";
import CsiEnrollmentCardDelegator from "components/global/common/CsiEnrollmentCardDelegator";
import CsiEnrollmentCard from "components/enrollment/CsiEnrollmentCard";
import {equalsIgnoreCase} from "../../services/global/utils";
import {isDelegationValid} from "../../services/delegations/business-logic";
import CsiPathologyEnrollmentCard from "components/pathology-exemption/CsiPathologyEnrollmentCard";
import {getServiceDelegators} from "../../services/api/delegations";
import {createAudit} from "@services/api/online-reports";
import {getResponseStatusCode} from "../../services/api/utils";
import CsiEnrollmentGuard2 from "components/enrollment/CsiEnrollmentGuard2";
import CsiCustomerSatisfactionWidget from "../../components/global/common/CsiCustomerSatisfactionWidget";
import {urlEnrollment} from "../../services/enrollment/business-logic";
import CsiAppUserMinorBanner from "../../components/global/common/CsiAppUserMinorBanner";

export default {
  name: "AppPathologyExemption",
  components: {
    CsiAppUserMinorBanner,
    CsiCustomerSatisfactionWidget,
    CsiEnrollmentGuard2,
    CsiPathologyEnrollmentCard,
    CsiEnrollmentCard,
    CsiEnrollmentCardDelegator,
    CsiPathologyVisibilityButton,
    CsiServiceAppPage,
    CsiHelpButton,
    CsiActiveDelegationToolbar
  },
  data() {
    return {
      isLoading: false,
      activeUserEnrollmentInfo: null,
      isOpen: true,
      isLoadingDelegatorList: false,
      isHiddenEnrollmentModal: false
    };
  },
  computed: {
    cf() {
      return this.$store.getters["pathologyExemption/getTaxCode"];
    },
    isUserMinor() {
      return this.$store.getters['global/isUserMinor']
    },
    user() {
      return this.$store.getters["global/user"];
    },
    serviceCode() {
      return this.$config.global.appServiceCodes.pathologyExemption;
    },
    fseExceptionsServiceCode() {
      return this.$config.global.appServiceCodes.fseExceptions;
    },
    serviceLabel() {
      return this.$config.global.appServiceCode2Label[this.serviceCode];
    },
    isDelegationActive() {
      return this.$store.getters["pathologyExemption/isDelegationActive"];
    },
    activeDelegation() {
      return this.$store.getters["pathologyExemption/getActiveDelegation"];
    },
    isDeclarationActive() {
      return (
        this.isDelegationActive &&
        isMinor(this.activeDelegation.data_nascita_delega)
      );
    },
    isVisibilityBtn() {
      let isVisibile = false;
      if (!this.isDelegationActive) {
        if (this.isActiveUserEnrolled) {
          isVisibile = true;
        }
      } else {
        if (this.activeDelegation && (this.canOpenFse || this.isActiveUserEnrolled)) {
          isVisibile = this.activeDelegation.deleghe.some(delegation => {
            return (
              equalsIgnoreCase(
                delegation.codice_servizio,
                this.fseExceptionsServiceCode
              ) &&
              equalsIgnoreCase(
                delegation.grado_delega,
                this.$config.delegations.delegationRankCodes.STRONG
              )
            );
          });
        }
      }

      return isVisibile;
    },
    obbligatorioArruolamento() {
      return this.appServiceNew.fse_obbligatorio;
    },
    isActiveUserEnrollable() {
      return (
        this.activeUserEnrollmentInfo && this.activeUserEnrollmentInfo.risposta
      );
    },
    canOpenFse() {
      // true se l'utente corrente (delegante o utente loggato che sia) è arruolabile
      let isEnrollable = this.isActiveUserEnrollable;
      let code = this.activeUserEnrollmentInfo
        ? this.activeUserEnrollmentInfo.codice_risposta
        : null;
      let enrollableCodes = [
        this.$config.enrollment.DO_NOT_ASK_ME_AGAIN,
        this.$config.enrollment.codes.FSE_NOT_APPROVED
      ];
      // true se l'utente corrente (delegante o utente loggato che sia) è arruolabile oppure se ha un codice
      // che permette l'arruolamento
      isEnrollable = isEnrollable || enrollableCodes.includes(code);

      // Se la delega non è attiva => basta controllare se l'utente risulta "arruolabile"
      if (!this.isDelegationActive) return isEnrollable;
      else {
        // Se la delega è attiva => è possibile aprire il FSE solo per i minori
        return this.isDeclarationActive || isEnrollable;
      }
    },
    isActiveUserEnrollmentUnknown() {
      return (
        !this.activeUserEnrollmentInfo ||
        this.activeUserEnrollmentInfo.codice_risposta ===
        this.$config.enrollment.codes.UNKNOWN
      );
    },
    isHelpPage() {
      return (
        this.$route.name === this.$routes.PATHOLOGY_EXEMPTION.FAQ.name ||
        this.$route.name === this.$routes.PATHOLOGY_EXEMPTION.CONTACTS.name
      );
    },
    appServices() {
      return this.$store.state.global.appServices;
    },
    appService() {
      return this.appServices.find(s => s.codice_servizio === this.serviceCode);
    },
    isActiveUserEnrolled() {
      let validCodes = [this.$config.enrollment.codes.FSE_APPROVED, this.$config.enrollment.codes.FSE_NOT_CONSENTS,
        this.$config.enrollment.codes.OTHER_REGION]
      return (
        validCodes.includes(this.enrollmentCode)
      );

    },
    isEnrollmentModalVisible() {
      let isActiveUserEnrolled = this.enrollmentCode === this.$config.enrollment.codes.FSE_APPROVED
      if (this.isHiddenEnrollmentModal) return false
      if (this.isDelegationActive) {
        return !isActiveUserEnrolled;
      } else {
        return (
          !isActiveUserEnrolled
        );
        //return true
      }
    },
    appServiceListNew() {
      return this.$store.getters["global/getAppList"];
    },
    appServiceNew() {
      return this.appServiceListNew.find(
        a => a.codice === this.$config.global.appCodeMapNew.ESENPAT
      );
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
        '010',
        '011',
        '012',
        '013',
        '015',
      ];

      return BLOCK_CODE_LIST.includes(this.enrollmentCode)
    }
  },
  watch: {
    cf: {
      immediate: true,
      handler() {
        this.reload();
      }
    }
  },
  async created() {
    let {d} = this.$route.query;

    if (d && this.user) {
      this.isLoadingDelegatorList = true;
      await this.preselectDelegation(d);
      this.isLoadingDelegatorList = false;
    }
  },
  methods: {
    async preselectDelegation(delegatorTaxCode) {
      let taxCode = this.user.cf;
      let delegatorList = [];

      try {
        let {data} = await getServiceDelegators(taxCode, this.serviceCode, {
          _no5XXRedirect: true
        });

        delegatorList = data.filter(delegator => {
          return delegator.deleghe.some(delegation => {
            return (
              equalsIgnoreCase(delegation.codice_servizio, this.serviceCode) &&
              isDelegationValid(delegation.stato_delega)
            );
          });
        });
      } catch (e) {
      }

      let delegator = delegatorList.find(
        el => el.codice_fiscale_delega === delegatorTaxCode
      );
      if (delegator) this.setDelegation(delegator);
    },
    // async onExit() {
    //   this.$router.push(this.$routes.GLOBAL.APP);
    // },
    closeModal() {
      this.isOpen = false;
    },
    onActivate() {
      // let name = this.$routes.ENROLLMENT.FLOW.name;
      // let query = {};
      //
      // if (this.isDeclarationActive) {
      //   query = {
      //     minore: this.activeDelegation.codice_fiscale_delega,
      //     servizio: this.$config.global.appServiceCodes.pathologyExemption
      //   };
      // } else if (this.isDelegationActive) {
      //   query = {
      //     d: this.activeDelegation.codice_fiscale_delega,
      //     servizio: this.$config.global.appServiceCodes.pathologyExemption
      //   };
      // }
      //
      // this.$router.push({name, query});

      let serviceCode = this.$config.global.appServiceCodes.pathologyExemption

      let url = urlEnrollment(serviceCode, this.isDeclarationActive, this.isDelegationActive, this.activeDelegation)
      window.location.assign(url);
    },
    async onExit(doNotAskMeAgain) {
      console.log('onExit')
      // Se l'utente ha spuntato "non me lo chiedere più" => salviamo sul server l'informazione
      if (doNotAskMeAgain) {
        try {
          let response = await saveDoNotAskMeAgain(this.user.cf)
        } catch (e) {
          this.$q.notify({
            type: 'negative',
            message: `[${getResponseStatusCode(e)}] Non siamo riusciti a salvare la tua richiesta. Ti chiederemo nuovamente di aprire il FSE`
          })
        } finally {
          this.$router.push(this.$routes.PATHOLOGY_EXEMPTION.APP);
        }
      } else {
        this.isHiddenEnrollmentModal = true
        this.$router.push(this.$routes.PATHOLOGY_EXEMPTION.APP);
      }
    },
    setDelegation(delegator) {
      this.$store.commit("pathologyExemption/setActiveDelegation", {
        delegator
      });
      // Per far ripartire il flusso dall'inizio
      this.$router.push(this.$routes.PATHOLOGY_EXEMPTION.APP);
    },
    unsetDelegation() {
      this.$store.commit("pathologyExemption/unsetActiveDelegation");
      // Per far ripartire il flusso dall'inizio
      this.$router.push(this.$routes.PATHOLOGY_EXEMPTION.APP);
    },
    goToServiceHome() {
      this.$router.push(this.$routes.PATHOLOGY_EXEMPTION.APP);
    },
    goToFaq() {
      this.$router.push(this.$routes.PATHOLOGY_EXEMPTION.FAQ);
    },
    goToContacts() {
      this.$router.push(this.$routes.PATHOLOGY_EXEMPTION.CONTACTS);
    },
    async reload() {
      this.isLoading = true;
      this.isHiddenEnrollmentModal = false
      let params = {servizio: this.serviceCode};
      let httpConfig = {params, _no5XXRedirect: true};

      try {
        let {data} = await getArruolabilita(this.cf, httpConfig);
        this.activeUserEnrollmentInfo = data;
      } catch (e) {
        console.error(e);
        this.activeUserEnrollmentInfo = null;
      }

      try {
        let taxCode = this.$store.getters["pathologyExemption/getTaxCode"];
        let payload = {codice_verticale: "FSEESE"};
        createAudit(taxCode, payload, {_no5XXRedirect: true});
      } catch (error) {
        console.error(error);
      }

      this.isLoading = false;
    }
  }
};
</script>

<style lang="stylus" scoped>
.app-pathology-exemption-footer
  width: 100%
  margin-top: 16px
  margin-bottom: -3px

.app-pathology-exemption-footer__waves
  background-image: url('../../statics/images/footer-onde.svg')
  background-repeat: no-repeat;
  background-position: center top;
  background-size: auto;
  min-height: 400px;

.app-pathology-exemption-footer__banner
  background-image: url('../../statics/images/pathology-exemption/pathology-exemption-footer-banner.svg')
  background-repeat: no-repeat;
  background-position: center top;
  background-size: 1000px 400px;
  min-height: 400px;
</style>
