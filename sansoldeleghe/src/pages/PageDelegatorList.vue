<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <lms-page>
    <div v-if="!isLoading">

      <!-- STATO VUOTO -->
      <!-- --------------------------------------------------------------------------------------------------------- -->
      <div v-if="isEmpty(delegators)" class="flex-center">
        <q-card  class="q-mt-lg">
          <q-card-section>
            <lms-banner image-src="images/delegators-empty.svg">
              <template slot="text">
                <p>
                  Non hai ancora ricevuto deleghe.
                </p>
              </template>
            </lms-banner>
          </q-card-section>
        </q-card>
      </div>


      <!-- STATO PIENO -->
      <!-- --------------------------------------------------------------------------------------------------------- -->
      <div v-else>

        <!-- FILTRI -->
        <!-- ------------------------------------------------------------------------------------------------------- -->
        <div>
          <lms-delegations-filters
            :service="serviceSelected"
            :status="statusSelected"
            @service-change="onServiceSelected"
            @status-change="onStatusSelected"
          />
        </div>

        <!-- LISTA DELEGANTI ADULTI -->
        <!-- ------------------------------------------------------------------------------------------------------- -->
        <div class="q-mt-md csi-group-card">

          <div v-if="isEmpty(filteredDelegators)">
            Nessun risultato trovato in base ai filtri impostati
          </div>

          <lms-delegator-item
            class="q-py-sm"
            v-for="delegator in filteredDelegatorsSorted"
            :key="delegator.uuid"
            :delegator="delegator"
            :status="statusSelected"
            :service="serviceSelected"
          />
        </div>
      </div>

      <div class="q-py-md text-right">
        <router-link :to="POLICY" class="lms-link">Privacy e condizioni d'uso</router-link>
      </div>
    </div>

    <lms-inner-loading :showing="isLoading" />
  </lms-page>
</template>

<script>
import LmsBanner from "components/core/LmsBanner";
import LmsDelegationsFilters from "components/LmsDelegationsFilters";
import {intersectionBy, isEmpty, isNil} from "src/services/utils";
import LmsDelegatorItem from "components/LmsDelegatorItem";
import {POLICY} from "src/router/routes";
import {isDelegatorMinor, isGrownChildDelegator} from "src/services/business-logic";
import {getDelegators} from "src/services/api";
export default {
  name: "PageDelegatorList",
  components: {LmsDelegatorItem, LmsDelegationsFilters, LmsBanner},
  data() {
    return {
      POLICY,
      isLoading: true,
      delegators: [],
      serviceSelected: undefined,
      statusSelected: null,
    };
  },
  computed: {
    taxCode(){
      return this.$store.getters["getTaxCode"];
    },
    adultDelegators() {
      return this.delegators.filter(delegator => {
        let isGrownChild =  delegator?.deleghe.some(d => isGrownChildDelegator(d))
        return !isDelegatorMinor(delegator) && !isGrownChild
      })
    },

    serviceDelegators() {
      if (isNil(this.serviceSelected)) return this.delegators
      return this.delegators.filter(delegator => delegator.deleghe.some(d => d.codice_servizio === this.serviceSelected))
    },
    statusDelegators() {
      if (isNil(this.statusSelected)) return this.delegators
      return this.delegators.filter(delegator => delegator?.deleghe?.some(d => d.stato_delega === this.statusSelected))
    },
    filteredDelegators() {
      return intersectionBy(
        this.adultDelegators,
        this.serviceDelegators,
        this.statusDelegators,
        d => d.uuid
      )
    },
    filteredDelegatorsSorted() {
      let result = [...this.filteredDelegators];

      result.sort((a, b) => {
        let aFullName = [a.nome_delega, a.cognome_delega].join(' ');
        let bFullName = [b.nome_delega, b.cognome_delega].join(' ');
        return aFullName > bFullName ? 1 : -1
      });

      return result
    },
  },
  async created() {
    this.isLoading = true;
    let response = await getDelegators(this.taxCode);
    this.delegators = response.data;
    this.isLoading = false;
  },
  methods: {
    isEmpty,
    onServiceSelected(newValue) {
      this.serviceSelected = newValue
    },
    onStatusSelected(newValue) {
      this.statusSelected = newValue
    },
  }
}
</script>

<style scoped>

</style>
