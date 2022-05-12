<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <lms-page padding>
    <template v-if="!isLoading">

      <!-- STATO VUOTO -->
      <!-- --------------------------------------------------------------------------------------------------------- -->
      <div v-if="isEmpty(delegates)" class="flex-center">
        <q-card class="q-mt-lg">
          <q-card-section>
            <lms-banner image-src="images/delegates-empty.svg">
              <template slot="text">
                <p>
                  Questo servizio permette ad un cittadino maggiorenne (delegante) di abilitare un altro cittadino
                  adulto
                  (delegato) ad operare sui servizi on line in sua vece quali: pagamento dei ticket, ritiro dei referti,
                  e gli altri servizi on line che verranno rilasciati in futuro.
                  Il soggetto delegato (figlio, familiare, persona di fiducia, ecc.) potrà quindi operare in nome e per
                  conto
                  del soggetto delegante.
                </p>

                <q-btn
                  :to="DELEGATE_NEW"
                  color="primary"
                  class="full-width">
                  Nuova delega
                </q-btn>
              </template>
            </lms-banner>
          </q-card-section>
        </q-card>
      </div>

      <!-- STATO PIENO -->
      <!-- --------------------------------------------------------------------------------------------------------- -->
      <template v-else>
        <div class="row items-center q-col-gutter-md">

          <!-- FILTRI -->
          <!-- ----------------------------------------------------------------------------------------------------- -->
            <lms-delegations-filters
              :service="serviceSelected"
              :status="statusSelected"
              class="col-12 col-md"
              @service-change="onServiceSelected"
              @status-change="onStatusSelected"
            />


          <div class="col-12 col-md-auto" :class="$q.screen.lt.md ? 'order-first' : 'order-last'">
            <q-btn
              :to="DELEGATE_NEW"
              color="primary"
              class="full-width"
            >
              Nuova delega
            </q-btn>
          </div>
        </div>

        <!-- LISTA DELEGATI -->
        <!-- ------------------------------------------------------------------------------------------------------- -->
        <div class="q-mt-lg csi-group-card">
          <div v-if="isEmpty(filteredDelegates)">
            <q-banner rounded class="h-banner h-banner--info">
              <div class="text-body1">
                Nessun risultato trovato in base ai filtri impostati
              </div>

            </q-banner>

          </div>

          <lms-delegate-item
            class="q-py-sm"
            v-for="delegate in filteredDelegates"
            :key="delegate.uuid"
            :delegate="delegate"
            :status="statusSelected"
            :service="serviceSelected"
          />
        </div>

      </template>

      <div class="q-py-md text-right">
        <router-link :to="POLICY" class="lms-link">Privacy e condizioni d'uso</router-link>
      </div>
    </template>


    <!-- LOADER -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <lms-inner-loading :showing="isLoading" />

  </lms-page>
</template>

<script>
import {isEmpty, isNil} from "src/services/utils";
import LmsBanner from "components/core/LmsBanner";
import {DELEGATE_NEW, POLICY} from 'src/router/routes';
import {getDelegates} from "src/services/api";
import LmsDelegationsFilters from "components/LmsDelegationsFilters";
import LmsDelegateItem from "components/LmsDelegateItem";
import {isDelegatorMinor, isGrownChildDelegator} from "src/services/business-logic";
export default {
name: "PageDelegateList",
  components: {LmsDelegateItem, LmsDelegationsFilters, LmsBanner},
  data() {
    return {
      POLICY,
      DELEGATE_NEW,
      isLoading: false,
      serviceSelected: null,
      statusSelected: null,
      delegates: [],
      isEditModalOpen: false,
      editingDelegate: {},
    }
  },
  computed: {

    user() {
      return this.$store.getters["getUser"];
    },
    taxCode(){
      return this.$store.getters["getTaxCode"];
    },
    delegateListSorted(){
      let result = [...this.delegates];

      result.sort((a, b) => {
        let aFullName = [a.nome_delega, a.cognome_delega].join(' ');
        let bFullName = [b.nome_delega, b.cognome_delega].join(' ');
        return aFullName > bFullName ? 1 : -1
      });

      return result
    },
    adultDelegators() {
      return this.delegators.filter(delegator => {
        let isGrownChild =  delegator?.deleghe.some(d => isGrownChildDelegator(d))
        return !isDelegatorMinor(delegator) && !isGrownChild
      })
    },
    filteredDelegates() {
      let result = this.delegateListSorted

      result = result.filter(delegate => delegate.deleghe.some(d =>  !isGrownChildDelegator(d)))

      if (!isNil(this.serviceSelected)) {
        result = result.filter(delegate => delegate.deleghe.some(d => d.codice_servizio === this.serviceSelected))
      }

      if (!isNil(this.statusSelected)) {
        result = result.filter(delegate => delegate.deleghe.some(d => d.stato_delega === this.statusSelected))
      }

      return result;
    }
  },
  async created() {
    this.isLoading = true;
    let response = await getDelegates(this.taxCode);
    this.delegates = response.data;
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
    onDelegateUpdate(newVal) {
      this.delegates = this.delegates.map(d => d.codice_fiscale_delega === newVal.codice_fiscale_delega ? newVal : d)
      this.editingDelegate = {}
      this.isEditModalOpen = false
    }
  },
}
</script>

<style scoped>

</style>
