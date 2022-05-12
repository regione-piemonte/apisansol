<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<style scoped></style>


<template>
<!--  <q-page>-->

<!--    <q-tabs>-->
<!--      <q-route-tab-->
<!--        label="Paga per te"-->
<!--        :to="$routes.HEALTH_PAYMENTS.AUTH_YOUR_HEALTH_PAYMENTS"-->
<!--        slot="title">-->
<!--      </q-route-tab>-->
<!--      <q-route-tab-->
<!--        label="Paga per altri"-->
<!--        :to="$routes.HEALTH_PAYMENTS.AUTH_OTHER_HEALTH_PAYMENTS"-->
<!--        slot="title">-->
<!--      </q-route-tab>-->
<!--    </q-tabs>-->

<!--    <div>-->
<!--      <router-view></router-view>-->
<!--    </div>-->


<!--  </q-page>-->

  <div>
    <router-view></router-view>
  </div>
</template>


<script>
  export default {
    name: "PageAuthHealthPayments"
  }
</script>
