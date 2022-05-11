<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <lms-page >
      <template v-if="!isLoading">
        <q-tabs
          active-color="primary"
          indicator-color="primary"
          align="center"
          no-caps
        >
          <q-route-tab :to="EXPENSE_LIST" label="Spese e credito" />
          <q-route-tab :to="PAYMENT_LIST" label="Pagamenti" />
        </q-tabs>

        <keep-alive :include="keepAlive">
          <router-view />
        </keep-alive>

        <lms-customer-satisfaction-widget v-if="isWidgetVisibile"/>

      </template>

    <lms-inner-loading :showing="isLoading" />

  </lms-page>
</template>

<script>
import {EXPENSE_LIST, PAYMENT_LIST, PRIVACY_POLICY} from "../router/routes";
import PageExpenseList from "./PageExpenseList";
import PagePayment from "./PagePayment";
import {getCurrentPayslip, getCurrentPin, getMovementList} from "src/services/api";
import {apiErrorNotify, errorHasResponse, isStatusIn} from "src/services/utils";
import LmsCustomerSatisfactionWidget from "components/LmsCustomerSatisfactionWidget";

export default {
  name: "PageHome",
  components: {LmsCustomerSatisfactionWidget},
  data() {
    return {
      keepAlive: [PageExpenseList.name, PagePayment.name],
      EXPENSE_LIST,
      PAYMENT_LIST,
      PRIVACY_POLICY,
      isLoading:false
    };
  },
  computed:{
    isUserLogged(){
      return this.$store.getters["isUserLogged"];
    },
    workingApp() {
      return this.$store.getters["getWorkingApp"];
    },
    taxCode() {
      return this.$store.getters["getTaxCode"];
    },
    userAppInfo(){
      return this.$store.getters["userAppInfo"];
    },
    isDelegationActive(){
      return this.$store.getters["isDelegationActive"];
    },
    isWidgetVisibile(){
      let isUserSeen= this.userAppInfo?.soddisfazione_cliente_visualizzato
      return this.workingApp?.soddisfazione_cliente_visibile && !isUserSeen && !this.isDelegationActive && this.isUserLogged
    }
  },
  watch: {
    taxCode: {
      immediate: true,
      deep:true,
      handler(val, oldVal) {
        if(val) this.getDefaultInfo()
      }
    }
  },
 async created() {
  },
  methods:{
    async getDefaultInfo(){
      this.isLoading = true;
      this.$store.dispatch('setPayslipErrMessage', {} )
      try {
        let response = await getCurrentPayslip(this.taxCode);
        let payslip = response.data;
        this.$store.dispatch('setCurrentPayslip', {payslip} )
      } catch (e) {

        let message= {}
        if(errorHasResponse(e)){
          if(isStatusIn(e.response, 404, 404) ) {
            let apiMsg = e?.response?.data?.title
            if(apiMsg)
              message={
                color : 'h-banner--info',
                message: apiMsg
              }
          }else{
            message={
              color : 'h-banner--negative',
              message:  "Non è stato possibile recuperare i dati del cedolino corrente"
            }

          }

        }
        this.$store.dispatch('setPayslipErrMessage', {message})
      }finally{
        this.isLoading = false;
      }

    },

  }
};
</script>
