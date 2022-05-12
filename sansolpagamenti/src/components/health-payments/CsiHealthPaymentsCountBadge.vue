<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <!--
   Questo componente rappresenta un badge che mostra all'utente quanti pagamenti sanitari vengono mostrati
   -->
  <q-chip color="info" text-color="black">
    <strong>
      <span v-if="payments.length <= 0">Non hai pagamenti in sospeso</span>
      <span v-if="payments.length === 1">Hai 1 pagamento da effettuare</span>
      <span v-if="payments.length >= 2">Hai {{payments.length}} pagamenti da effettuare</span>
    </strong>
  </q-chip>
</template>


<script>
  import {isToPay} from "@services/health-payments/business-logic";

  export default {
    name: 'CsiHealthPaymentsCountBadge',
    components: {},
    props: {
      healthPayments: {type: Array, required: true}
    },
    data() {
      return {}
    },
    computed: {
      payments(){
        return this.healthPayments.filter(p => isToPay(p))
      }
    },
    created() {
    },
    methods: {},
  }
</script>


<style scoped lang="stylus"></style>
