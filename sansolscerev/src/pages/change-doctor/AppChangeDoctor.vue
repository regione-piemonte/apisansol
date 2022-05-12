<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<style scoped lang="stylus"></style>


<template>
  <csi-service-app-page
    :service-code="serviceCode"
    :active-delegation="$store.getters['changeDoctor/getActiveDelegation']"
    toolbar-title="Il mio medico"
    delegation-mode
    portal-target-name="service-toolbar-change-doctor"
    @title-click="goToServiceHome"
    @set-delegation="setDelegationDialog"
    @unset-delegation="unsetDelegation"
  >

    <template slot="toolbar-title-after">
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

    <q-dialog
      v-model="isDelegationDialog"
      @ok="setDelegation(delegator)"
    >

      <div slot="title" class="q-title">Delega</div>
      <div slot="message" class="text-black">
        Stai operando in delega di una persona maggiorenne. <br>
        Per portare a termine la scelta o revoca del suo medico, dovrai allegare copia di un suo documento
        d'identità e stampare, far firmare e allegare il modulo che ti verrà presentato al termine della procedura.
      </div>

      <template slot="buttons" slot-scope="props">
        <csi-buttons>
          <csi-button primary color="primary" label="Procedi" @click="props.ok"/>
          <csi-button secondary color="primary" label="Annulla" @click="props.cancel"/>
        </csi-buttons>
      </template>
    </q-dialog>

    <template v-if="configUpdate">
      <csi-update-page/>
    </template>

    <template v-else-if="isUserMinor">
     <csi-app-user-minor-banner/>
    </template>

    <template v-else-if="isLoadingDelegatorList">
      <q-page class="flex flex-center">
        <csi-inner-loading block :visible="true"/>
      </q-page>
    </template>
    <!-- Qui vengono renderizzate tutte le pagine relative all'accelleratore "cambio medico" -->
    <template v-else>

      <router-view @page-load="pageLoad"/>
    </template>

    <div class="app-change-doctor-footer">
      <div class="app-change-doctor-footer__waves">
        <div class="app-change-doctor-footer__banner"></div>
      </div>
    </div>
    <template v-if="isUserLogged && isPageLoad">
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
  import {getMonitoredDoctors, getUserInfo, getDoctorsTypes, getDisclaimer} from "@services/api/change-doctor";
  import {isDelegatorMinor} from "@services/delegations/business-logic";
  import {notifyError} from "@services/api/utils";
  import {appDetailFaq} from "../../services/global/business-logic";
  import {equalsIgnoreCase} from "../../services/global/utils";
  import CsiHelpButton from "../../components/global/common/CsiHelpButton";
  import {getServiceDelegators} from "../../services/api/delegations";
  import {isDelegationValid} from "../../services/delegations/business-logic";
  import CsiEnrollmentGuard2 from "../../components/enrollment/CsiEnrollmentGuard2";
  import CsiCustomerSatisfactionWidget from "../../components/global/common/CsiCustomerSatisfactionWidget";
  import CsiAppUserMinorBanner from "../../components/global/common/CsiAppUserMinorBanner";

  export default {
    name: 'AppChangeDoctor',
    data() {
      return {
        configUpdate: config.isToUpdate,
        isDelegationDialog: false,
        delegator: null,
        isLoadingDelegatorList: false,
        isPageLoad:false
      }
    },
    components: {
      CsiAppUserMinorBanner,
      CsiCustomerSatisfactionWidget, CsiEnrollmentGuard2, CsiHelpButton, CsiServiceAppPage, CsiUpdatePage},
    computed: {
      userInfo() {
        return this.$store.getters['changeDoctor/getUserInfo']
      },
      isUserMinor(){
        return this.$store.getters['global/isUserMinor']
      },
      user() {
        return this.$store.getters['global/user']
      },
      serviceCode() {
        return this.$config.global.appServiceCodes.changeDoctor
      },
      cf() {
        return this.$store.getters['changeDoctor/getTaxCode']
      },
      isUserLogged() {
        return this.$store.getters['global/isUserLogged']
      },
      enrollmentCode() {
        return this.activeUserEnrollmentInfo ? this.activeUserEnrollmentInfo.codice_risposta : null;
      },
      activeUserEnrollmentInfo() {
        return this.$store.getters["changeDoctor/getActiveDelegation/getActiveUserEnrollmentInfo"];
      },
    },
    // watch: {
    //   cf: {
    //     immediate: true,
    //     handler(val, oldVal) {
    //       this.$store.dispatch('changeDoctor/setUserInfo', {info: null});
    //       this.$store.dispatch('changeDoctor/setMaxLimitChanges', {newAllowedDate: null, isMaxLimit:null});
    //      this.getUserData();
    //     }
    //   }
    // },
    methods: {
      goToServiceHome() {
        this.$router.push(this.$routes.CHANGE_DOCTOR.APP)
      },
      setDelegation(delegator) {
        this.$store.dispatch('changeDoctor/setActiveDelegation', delegator);
        // Per far ripartire il flusso dall'inizio
        this.$router.push(this.$routes.CHANGE_DOCTOR.APP);
      },
      unsetDelegation() {
        this.delegator = null;
        this.$store.dispatch('changeDoctor/unsetActiveDelegation');
        // Per far ripartire il flusso dall'inizio
        this.$router.push(this.$routes.CHANGE_DOCTOR.APP);
      },
      setDelegationDialog(delegator) {
        if (!isDelegatorMinor(delegator)) {
          this.delegator = delegator;
          this.isDelegationDialog = true
        } else {
          this.setDelegation(delegator)
        }
      },
      // async getUserData(){
      //   if(this.isUserLogged){
      //
      //     this.$store.dispatch('changeDoctor/setUserInfo', {info: null});
      //     try{
      //       let userInfoPromise = getUserInfo(this.cf, {_no5XXRedirect:true});
      //       let userInfoResponse = await userInfoPromise;
      //       this.$store.dispatch('changeDoctor/setUserInfo', {info: userInfoResponse.data});
      //     }catch (e) {
      //       notifyError(e, "Errore durante il caricamento dei dati del cittadino.")
      //     }finally {
      //       this.$router.push(this.$routes.CHANGE_DOCTOR.HOME)
      //     }
      //
      //   }else{
      //     this.$router.push(this.$routes.CHANGE_DOCTOR.HOME)
      //   }
      //
      // },
      goToFaq() {
        //this.$router.push(this.$routes.CHANGE_DOCTOR.FAQ)
        let url = appDetailFaq(this.serviceCode)
        window.open(url)
      },
      goToContacts() {
        this.$router.push(this.$routes.CHANGE_DOCTOR.CONTACTS)
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
      pageLoad(){
        this.isPageLoad=true
      }
    },
    async created() {
      let disclaimerPromise = getDisclaimer({_no5XXRedirect: true});
      let typeListPromise = getDoctorsTypes({_no5XXRedirect: true});
      let typeListResponse = await typeListPromise;
      this.$store.dispatch('changeDoctor/setDoctorTypes', {types: typeListResponse.data});
      let disclaimerResponse = await disclaimerPromise;
      this.$store.dispatch('changeDoctor/setDisclaimer', {text: disclaimerResponse.data});

      let {d} = this.$route.query;

      if (d && this.user) {
        this.isLoadingDelegatorList = true;
        await this.preselectDelegation(d);
        this.isLoadingDelegatorList = false;
      }
    },
  }
</script>

<style lang="stylus">
  .app-change-doctor-footer
    width: 100%
    margin-top: 16px
    margin-bottom: -3px

  .app-change-doctor-footer__waves
    background-image: url('../../statics/images/footer-onde.svg')
    background-repeat: no-repeat;
    background-position: center top;
    background-size: auto;
    min-height: 400px;

  .app-change-doctor-footer__banner
    background-image: url('../../statics/images/change-doctor/change-doctor-footer-banner.svg')
    background-repeat: no-repeat;
    background-position: center top;
    background-size: 1000px 400px;
    min-height: 400px;
</style>
