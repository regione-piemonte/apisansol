<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <lms-page padding class="home-page-app-list">
    <lms-page-title class="q-mb-lg">
      Privacy e condizioni d'uso
    </lms-page-title>

    <q-card class="lms-privacy-policy-dialog">
      <q-card-section>

        <p>Di seguito sono riportate le informazioni sul trattamento dei dati personali e
          sulle condizioni d'uso relativamente ai tuoi Servizi Digitali.</p>
        <ul>
          <li v-for="(policy,index) in policyServicesOrderedList" :key="index">
            <a :href="policy.url" target="_blank" class="lms-link">{{ policy.label }}</a>
          </li>

        </ul>
        <p>Per tutti gli altri servizi è necessario far riferimento alle informative rese disponibili dalle ASL di
          competenza.</p>
      </q-card-section>
    </q-card>
  </lms-page>
</template>

<script>
import {orderBy} from "src/services/utils";

const POLICY_SERVICES_LIST = [
  {
    label: 'Servizio',
    url: 'url'
  },


]
export default {
  name: "PagePrivacyLinks",
  data() {
    return {
      POLICY_SERVICES_LIST
    }
  },
  computed:{
    policyServicesOrderedList(){
      return orderBy(POLICY_SERVICES_LIST, ['label'])
    }
  }
}
</script>

<style scoped>

</style>
