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
        <span>{{validText}} </span>
        <span> <strong>{{delegationDate | date}}</strong></span>
      </div>
    </div>

    <div class="col-2">
      <lms-delegations-list-item-status :rank="delegation.grado_delega" :status="delegation.stato_delega" icon-right/>
    </div>

    <div class="col-12 q-mt-md" v-if="isDelegationValid">
      <lms-buttons>
        <lms-button outline label="Rinuncia" @click="removeDelegation()"/>
      </lms-buttons>
    </div>

  </div>

</template>

<script>
import {apiErrorNotify, equalsIgnoreCase} from "src/services/utils";
import {DELEGATION_STATUS_MAP} from "src/services/config";
import LmsDelegationsListItemStatus from "components/LmsDelegationsListItemStatus";
import {getServiceName, isDelegationValid} from "src/services/business-logic";
import {waiveDelegation} from "src/services/api";

export default {
  name: "LmsDelegatorListItem",
  components: {LmsDelegationsListItemStatus},
  props: {
    delegation: {type: Object, required: true}
  },
  data(){
   return{
     isConfirmDialogOpen: false
   }
  },
  computed:{
    serviceName() {
      return getServiceName(this.serviceCode);
    },
    delegationsToRemoveSorted() {
      let result = [...this.delegationsToRemove];

      result.sort((a, b) => {
        a = getServiceName(a.codice_servizio);
        b = getServiceName(b.codice_servizio);
        return a > b ? 1 : -1;
      });

      return result;
    },
    taxCode(){
      return this.$store.getters["getTaxCode"];
    },
    serviceCode() {
      return this.delegation?.codice_servizio;
    },

    validText() {
      let textMap = {
        [DELEGATION_STATUS_MAP.ACTIVE]: 'Valida fino al',
        [DELEGATION_STATUS_MAP.IS_EXPIRING]: 'Valida fino al',
        [DELEGATION_STATUS_MAP.UPDATED]: 'Valida fino al',
        [DELEGATION_STATUS_MAP.EXPIRED]: 'Valida fino al',
        [DELEGATION_STATUS_MAP.REFUSED]: 'Rifiutata il',
        [DELEGATION_STATUS_MAP.REVOKED]: 'Revocata il',
      }

      return textMap[this.delegation.stato_delega]
    },
    delegationDate() {
      let propMap = {
        [DELEGATION_STATUS_MAP.ACTIVE]: 'data_fine_delega',
        [DELEGATION_STATUS_MAP.IS_EXPIRING]: 'data_fine_delega',
        [DELEGATION_STATUS_MAP.UPDATED]: 'data_fine_delega',
        [DELEGATION_STATUS_MAP.EXPIRED]: 'data_fine_delega',
        [DELEGATION_STATUS_MAP.REFUSED]: 'data_rinuncia_delega',
        [DELEGATION_STATUS_MAP.REVOKED]: 'data_revoca_delega',
      }

      let prop = propMap[this.delegation.stato_delega]
      return this.delegation[prop]
    },
    isDelegationValid(){
      return isDelegationValid(this.delegation.stato_delega)
    },

  },
  methods:{
    removeDelegation() {
      this.$emit('remove-delegation', [this.delegation])
    },

  }
}
</script>

<style scoped>

</style>
