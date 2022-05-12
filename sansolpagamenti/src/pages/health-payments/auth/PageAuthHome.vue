<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<style scoped></style>

<template>
  <q-page>
    <template v-if="$config.global.isNewEnrollableActive">
      <div class="q-my-lg q-mx-md">
        <csi-enrollment-guard2
          :code="enrollmentCode"
          :active-delegator="activeDelegation"
          is-health-payment-app
          @click-activate="onActivate"
        />
      </div>
    </template>

    <q-tabs>
      <q-route-tab
        label="Pagamenti sanitari"
        :to="$routes.HEALTH_PAYMENTS.AUTH_HEALTH_PAYMENTS"
        slot="title"
      />

      <q-route-tab
        label="Altri pagamenti"
        :to="$routes.HEALTH_PAYMENTS.AUTH_OTHER_PAYMENTS"
        exact
        slot="title"
      />

      <q-route-tab
        label="Già pagati"
        :to="$routes.HEALTH_PAYMENTS.AUTH_PAYED_PAYMENTS"
        exact
        slot="title"
      />
    </q-tabs>

    <div>
      <router-view></router-view>
    </div>
    <csi-customer-satisfaction-widget :service-code="serviceCode"/>
  </q-page>
</template>


<script>
    import CsiEnrollmentGuard2 from "../../../components/enrollment/CsiEnrollmentGuard2";
    import {isMinor} from "../../../services/global/business-logic";
    import CsiCustomerSatisfactionWidget from "../../../components/global/common/CsiCustomerSatisfactionWidget";
    import {urlEnrollment} from "../../../services/enrollment/business-logic";
    export default {
        name: 'PageAuthHome',
      components: {CsiCustomerSatisfactionWidget, CsiEnrollmentGuard2},
      data() {
            return {};
        },
        computed: {
            isUserLogged() {
                return this.$store.getters['global/isUserLogged']
            },
          enrollmentCode() {
            return this.activeUserEnrollmentInfo ? this.activeUserEnrollmentInfo.codice_risposta : null;
          },
          activeUserEnrollmentInfo() {
            return this.$store.getters["healthPayments/getActiveUserEnrollmentInfo"];
          },
          serviceCode() {
            return this.$config.global.appServiceCodes.healthPayments
          },
          activeDelegation() {
            return this.$store.getters["healthPayments/getActiveDelegation"];
          },
          isDeclarationActive() {
            return (
              this.isDelegationActive &&
              isMinor(this.activeDelegation.data_nascita_delega)
            );
          },
          isDelegationActive(){
            return this.$store.getters['healthPayments/isDelegationActive']
          },
        },
        created() {
            console.debug('PageAuthHome created()', {isLogged: this.isUserLogged})
            if (!this.isUserLogged) this.$router.push(this.$routes.HEALTH_PAYMENTS.APP)
        },
      methods:{
        onActivate() {
          // let name = this.$routes.ENROLLMENT.FLOW.name;
          // let query = {};
          //
          // if (this.isDeclarationActive) {
          //   query = {
          //     minore: this.activeDelegation.codice_fiscale_delega,
          //     servizio: this.serviceCode
          //   };
          // } else if (this.isDelegationActive) {
          //   query = {
          //     d: this.activeDelegation.codice_fiscale_delega,
          //     servizio: this.serviceCode
          //   };
          // }
          //
          // this.$router.push({name, query});

          let url = urlEnrollment(this.serviceCode, this.isDeclarationActive, this.isDelegationActive, this.activeDelegation )
          window.location.assign(url);
        },
      }
    }
</script>

