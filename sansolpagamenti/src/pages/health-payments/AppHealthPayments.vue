<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <csi-service-app-page
    toolbar-title="Pagamenti sanitari"
    portal-target-name="service-toolbar-health-payments"
    :service-code="serviceCode"
    :delegation-mode="canUseDelegations"
    :active-delegation="activeDelegation"
    @set-delegation="setDelegation"
    @unset-delegation="unsetDelegation">
    <template v-if="configUpdate">
      <csi-update-page></csi-update-page>
    </template>
    <template v-else-if="isUserMinor">
      <csi-app-user-minor-banner/>
    </template>

    <template v-else-if="isLoadingDelegatorList">
      <q-page class="flex flex-center">
        <csi-inner-loading block :visible="true"/>
      </q-page>
    </template>
    <template v-else>
      <template slot="toolbar-content">
        <q-toolbar-title @click.native="goToServiceHome" class="cursor-pointer">
          {{serviceLabel}}
        </q-toolbar-title>

        <portal-target name="service-toolbar-health-payments">
          <!--
          This component can be located anwhere in your App.
          The slot content of the above portal component will be rendered here.
          -->
        </portal-target>

        <!-- bottone help -->
        <csi-help-button
          @contacts-click="goToContacts"
          @faq-click="goToFaq"
        >
          <template slot="after">
            <q-item
              v-close-overlay
              tag="a"
              href="url"
              target="_blank"
              class="text-black"
              style="text-decoration: none"
            >
              <q-item-main>
                <q-item-tile label>
                  Manuale d'uso pagamento con pagoPA
                </q-item-tile>
              </q-item-main>
            </q-item>
          </template>
        </csi-help-button>


        <!-- BOTTONE CARRELLO -->
        <!-- ------------------------------------------------------------------------------------------------------- -->
        <q-btn v-if="canShowCartButton" flat dense :round="$q.screen.lt.md" no-caps >
          <q-icon name="shopping cart"></q-icon>
          <q-chip v-if="addedItems.length > 0" floating dense color="negative">{{addedItems.length}}</q-chip>
          <q-popover max-height="80%">

            <div class="q-pa-md" v-if="addedItems.length <= 0">
              Nessun pagamento aggiunto
            </div>

            <div v-if="addedItems.length >= 1">
              <csi-transition-fade-out-right tag="div" is-group>
                <csi-cart-list-item
                  v-for="item in addedItems"
                  :key="item.numero_pratica_regionale"
                  :item="item"
                  class="csi-transition-property-all csi-transition-duration-1000"
                />
              </csi-transition-fade-out-right>


              <div class="row items-center bg-grey-3 q-px-md q-py-md">
                <div class="col q-body-2 uppercase">Totale {{cartTotal | toFixed}} &euro;</div>
                <div class="col-auto">
                  <q-btn @click="$router.push($routes.HEALTH_PAYMENTS.PAYMENT)" color="primary">Paga</q-btn>
                </div>
              </div>

              <div class="q-body-2 text-right q-px-md q-py-sm">
                <router-link :to="$routes.HEALTH_PAYMENTS.CART">Vai al carrello</router-link>
              </div>
            </div>
          </q-popover>
          <div class="gt-sm q-pl-xs">Carrello</div>
          <q-tooltip>Carrello</q-tooltip>
        </q-btn>
      </template>


      <!-- MESSAGGI DINAMICI DELLA CONFIGURAZIONE -->
      <!-- ----------------------------------------------------------------------------------------------------------- -->
      <csi-config-dynamic-message-list :service-code="serviceCode" class="csi-container q-pa-md"/>


      <!-- Qui vengono renderizzate tutte le pagine relative all'accelleratore "Pagamenti sanitari" -->
      <router-view></router-view>

      <div class=" text-right layout-padding" v-if="!$route.meta.privacy">
        <router-link :to="$routes.HEALTH_PAYMENTS.POLICY"
                     class="text-italic  csi-link ">
          Privacy e condizioni d'uso
        </router-link>
      </div>
    </template>

    <!-- IMMAGINE SOPRA IL FOOTER -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <div class="app-health-payments-footer">
      <div class="app-health-payments-footer__waves">
        <div class="app-health-payments-footer__banner"></div>
      </div>
    </div>


  </csi-service-app-page>



</template>


<script>
  import CsiUpdatePage from "components/global/common/CsiUpdatePage";
  import CsiServiceAppPage from "components/global/common/CsiServiceAppPage";
  import CsiCartListItem from "components/health-payments/CsiCartListItem";
  import CsiTransitionFadeOutRight from "components/global/transitions/CsiTransitionFadeOutRight";
  import {config} from "@plugins/config";
  import {routes} from "@plugins/routes";
  import CsiHelpButton from "components/global/common/CsiHelpButton";
  import {getReminderPrintableTemp} from "@services/api/health-payments";
  import CsiConfigDynamicMessageList from "components/global/common/CsiConfigDynamicMessageList";
  import {equalsIgnoreCase} from "../../services/global/utils";
  import {getServiceDelegators} from "../../services/api/delegations";
  import {isDelegationValid} from "../../services/delegations/business-logic";
  import {getArruolabilita} from "../../services/api/enrollment";
  import CsiAppUserMinorBanner from "../../components/global/common/CsiAppUserMinorBanner";

  const EXCLUDE_CART_ROUTES = [
    routes.HEALTH_PAYMENTS.PAYMENT_FEEDBACK.name,
  ]

  export default {
    name: 'AppHealthPayments',
    components: {
      CsiAppUserMinorBanner,
      CsiConfigDynamicMessageList,
      CsiHelpButton, CsiTransitionFadeOutRight, CsiCartListItem, CsiServiceAppPage, CsiUpdatePage
    },
    data() {
      return {
        configUpdate: config.isToUpdate,
        isLoadingDelegatorList: false
      };
    },
    computed: {
      user() {
        return this.$store.getters['global/user']
      },
      isUserMinor(){
        return this.$store.getters['global/isUserMinor']
      },
      cf() {
        return this.$store.getters["healthPayments/getTaxCode"];
      },
      serviceCode() {
        return this.$config.global.appServiceCodes.healthPayments
      },
      serviceLabel() {
        return this.$config.global.appServiceCode2Label[this.serviceCode]
      },
      addedItems() {
        return this.$store.getters['healthPayments/cartItems']
      },
      cartTotal() {
        return this.$store.getters['healthPayments/cartTotal']
      },
      canShowCartButton() {
        return !EXCLUDE_CART_ROUTES.includes(this.$route.name)
      },
      activeDelegation() {
        return this.$store.getters['healthPayments/getActiveDelegation']
      },
      isUserLogged() {
        return this.$store.getters['global/isUserLogged']
      },
      canUseDelegations() {
        return false
        // @NOTE: Al momento PTW non supporta le deleghe.
        //        nel momento in cui le supporterà => basta riabilitare la righa qui sotto
        // return this.isUserLogged
      }
    },
    async created() {
      if(this.isUserMinor) return;
      // Scarichiamo la configurazione dei pormemoria stampabili e li salviamo nello store.
      // Questa è un'informazione che servirà al singolo <csi-ticket-list-item> per capire se mostrare o meno
      // il bottone per la stampa del pormemoria
      try {
        let {data: reminderPrintableList} = await getReminderPrintableTemp();
        this.$store.commit('healthPayments/setReminderPrintableList', {reminderPrintableList});
      } catch (err) {
        // DO NOTHING
      }

      if(this.isUserLogged){
        let params = {servizio: this.serviceCode};
        let httpConfig = {params, _no5XXRedirect: true};

        try {
          let {data : activeUserEnrollmentInfo} = await getArruolabilita(this.cf, httpConfig);
          this.$store.dispatch('healthPayments/setActiveUserEnrollmentInfo', {activeUserEnrollmentInfo});
        } catch (e) {
          console.error(e);
        }

        let {d} = this.$route.query;

        if (d) {
          this.isLoadingDelegatorList = true;
          await this.preselectDelegation(d);
          this.isLoadingDelegatorList = false;
        }
      }


    },
    methods: {
      setDelegation(delegator) {
        this.$store.commit('healthPayments/setActiveDelegation', {delegator});
        // Per far ripartire il flusso dall'inizio
        this.$router.push(this.$routes.HEALTH_PAYMENTS.APP);
      },
      unsetDelegation() {
        this.$store.commit('healthPayments/unsetActiveDelegation');
        // Per far ripartire il flusso dall'inizio
        this.$router.push(this.$routes.HEALTH_PAYMENTS.APP);
      },
      goToServiceHome() {
        this.$router.push(this.$routes.HEALTH_PAYMENTS.APP)
      },
      goToContacts() {
        this.$router.push(this.$routes.HEALTH_PAYMENTS.CONTACTS)
      },
      goToFaq() {
        this.$router.push(this.$routes.HEALTH_PAYMENTS.FAQ)
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


<style scoped lang="stylus">
  .csi-transition-property-all
    transition-property all

  .csi-transition-duration-1000
    transition-duration 1000ms

  .app-health-payments-footer
    width: 100%
    margin-top: 16px
    margin-bottom: -3px

  .app-health-payments-footer__waves
    background-image: url('../../statics/images/footer-onde.svg')
    background-repeat: no-repeat;
    background-position: center top;
    background-size: auto;
    min-height: 400px;

  .app-health-payments-footer__banner
    background-image: url('../../statics/images/health-payments/health-payments-footer-banner.svg')
    background-repeat: no-repeat;
    background-position: center top;
    background-size: 1000px 400px;
    min-height: 400px;
</style>
