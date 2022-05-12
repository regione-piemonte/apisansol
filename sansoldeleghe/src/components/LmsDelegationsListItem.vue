<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="row items-center q-col-gutter-x-xs">
    <div class="col-10 row items-center q-col-gutter-x-xs">
      <div class="col-12 col-sm-6">
        <strong>{{serviceName}}</strong>
      </div>

      <div class="col-12 col-sm-6">
        <span>Attiva fino al </span>
        <span > <strong>{{delegation.data_fine_delega | date}}</strong></span>

        <span v-if="isExpiring" class="text-caption col-12 col-sm">
      <strong>In scadenza</strong>
    </span>
      </div>
    </div>

    <div class="col-2">
      <lms-delegations-list-item-status :rank="delegation.grado_delega" :status="delegation.stato_delega" icon-right/>
    </div>
  </div>


  <!--  <q-item>-->
  <!--    <q-item-main>-->
  <!--      <div class="row items-center gutter-x-xs">-->
  <!--        <div class="q-body-2 col-12 col-sm-6">-->
  <!--          {{serviceName}}-->
  <!--        </div>-->
  <!--        <div class="q-body-1 col-12 col-sm-4">-->
  <!--          <span>Attiva fino al </span>-->
  <!--          <span class="q-body-2">{{delegation.data_fine_delega | format}}</span>-->
  <!--        </div>-->
  <!--        <div v-if="isExpiring" class="q-caption col-12 col-sm">-->
  <!--          <strong>In scadenza</strong>-->
  <!--        </div>-->
  <!--      </div>-->
  <!--    </q-item-main>-->

  <!--    <q-item-side class="column items-center col-2">-->
  <!--      <csi-delegations-list-item-status :status="delegation.stato_delega" icon-right/>-->
  <!--    </q-item-side>-->
  <!--  </q-item>-->
</template>


<script>
  import LmsDelegationsListItemStatus from "components/LmsDelegationsListItemStatus";
  import {DELEGATION_STATUS_MAP} from "src/services/config";
  import {equalsIgnoreCase} from "src/services/utils";

  export default {
    name: "LmsDelegationsListItem",
    components: {LmsDelegationsListItemStatus},
    props: {
      delegation: {type: Object, required: true}
    },
    computed: {
      isExpiring() {
        return this.delegation.stato_delega === DELEGATION_STATUS_MAP.IS_EXPIRING;
      },
      serviceCode() {
        return this.delegation && this.delegation.codice_servizio;
      },
      serviceName() {
        let serviceCode = this.serviceCode;
        let appList = this.$store.getters['delegableAppServices']
        let service = appList.find(a => equalsIgnoreCase(a.codice_servizio, serviceCode))
        return service ? service.applicazione?.descrizione : serviceCode;
      },
    },
  }
</script>

<style scoped></style>
