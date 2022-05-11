<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <lms-page padding>


<!--    <div class="full-width q-mt-lg q-mb-md">-->
<!--      <lms-buttons>-->
<!--        <lms-button href="/la-mia-salute/#/pagamenti-sanitari" label="Effettua pagamento" type="a"></lms-button>-->
<!--      </lms-buttons>-->
<!--    </div>-->


    <q-tabs
      active-color="primary"
      align="center"
      indicator-color="primary"
      no-caps
    >
      <q-route-tab :to="EXPENSE_LIST" label="Spese effettuate"/>
      <template v-if="isTest">
        <q-route-tab :to="CREDIT_LIST" label="Crediti"/>
        <q-route-tab :to="REFUND_LIST" label="Rimborsi"/>
      </template>


    </q-tabs>

    <keep-alive v-if="!isLoading" :include="keepAlive">
      <router-view/>
    </keep-alive>
    <lms-inner-loading :showing="isLoading" block/>
    <div class="q-py-lg" v-if="!isDelegationActive">
      <q-banner class="h-banner--info h-banner ">
        <div class="text-body1 text-bold">
          Puoi scaricare gli eventuali documenti caricati all'interno del fascicolo finanziario accedendo all'
          <a :href="downloadDocsLink" class="lms-link">apposita sezione</a>
        </div>
      </q-banner>
    </div>
  </lms-page>
</template>

<script>
import {EXPENSE_LIST, CREDIT_LIST, REFUND_LIST, CREDIT_LIST_PAYMENTS, REFUND_LIST_PAYMENTS} from "../router/routes";
import PageExpenseList from "./PageExpenseList";
import PageCreditList from "./PageCreditList";
import PageRefundList from "./PageRefundList";
import {getAslList, getPaymentMode} from "../services/api";

export default {
  name: "PageHome",

  data() {
    return {
      keepAlive: [PageExpenseList.name, PageCreditList.name, PageRefundList.name],
      isLoading: false,
      EXPENSE_LIST,
      CREDIT_LIST,
      REFUND_LIST,

    };
  },
  created() {
    this.getDefaultData()
  },
  computed:{
    downloadDocsLink(){
      if(this.isTest){
        return 'url'
      }
      return 'url'
    },
    isTest(){
      return process.env.APP_IS_DEV || process.env.APP_IS_TEST
    },
    isDelegationActive(){
      return this.$store.getters["isDelegationActive"];
    }
  },
  methods: {
    async getDefaultData() {
      this.isLoading = true
      try {
        let getPaymentModesList = await getPaymentMode()
        this.$store.dispatch('setPaymentType', getPaymentModesList.data)
        let getAsrList = await getAslList()
        this.$store.dispatch('setAsrList', getAsrList.data)
      } catch (e) {
        console.log(e)
      } finally {
        this.isLoading = false
      }
    }
  }
};
</script>
