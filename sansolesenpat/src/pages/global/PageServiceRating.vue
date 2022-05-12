<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-page padding>
    <csi-page-title :title="pageTitle" @back="onBack" class="q-mb-md" />
    <csi-policy v-if="link" :src="link" :iframe-styles="{height: '780px'}" />
  </q-page>
</template>


<script>

  import {config} from '@plugins/config'
  import CsiPageTitle from "components/global/common/CsiPageTitle";
  import CsiPolicy from "components/global/common/CsiPolicy";

  const LINK_MAP = {
    [config.global.appServiceCodes.onlineReports]: 'URL',
    [config.global.appServiceCodes.delegations]: 'URL',
    [config.global.appServiceCodes.healthPayments]: 'URL',
    [config.global.appServiceCodes.prescriptions]: 'URL',
    [config.global.appServiceCodes.reservations]: 'URL',
    [config.global.appServiceCodes.consents]: 'URL',
    [config.global.appServiceCodes.vaccinations]: 'URL',
    [config.global.appServiceCodes.changeDoctor]: 'URL',
    [config.global.appServiceCodes.covid]: 'URL',
    [config.global.appServiceCodes.pathologyExemption]: 'URL',
  };

  export default {
    name: 'PageServiceRating',
    components: {CsiPolicy, CsiPageTitle},
    data() {
      return {
      }
    },
    computed: {
      serviceCode() {
        return this.$route.query.servizio
      },
      isCustomerServiceWidget(){
        return this.$route.query.cs
      },
      service() {
        if (!this.serviceCode) return;
        return this.$store.getters['global/appService'](this.serviceCode)
      },
      activeApplication() {
        return this.$store.getters['global/appServiceActive'](this.serviceCode);
      },
      customerSatisfactionUrl() {
        return this.activeApplication ? this.activeApplication.soddisfazione_cliente_url : ''

      },
      serviceName() {
        if (!this.service) return '';
        return this.service.descrizione
      },
      pageTitle() {
        return `Valuta il servizio ${this.serviceName}`
      },
      link() {
        return this.isCustomerServiceWidget ? this.customerSatisfactionUrl :  LINK_MAP[this.serviceCode]
      }
    },
    methods: {
      onBack(){
        this.$router.back()
      }
    }
  }
</script>


<style scoped lang="stylus"></style>
