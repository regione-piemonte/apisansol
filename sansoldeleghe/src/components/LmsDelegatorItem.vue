<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div>
    <q-card class="q-py-md q-px-sm" v-if="delegations">
      <q-item>
        <q-item-section avatar>
          <q-icon size="lg" :name="avatarIcon" />
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-bold">{{delegatorFullName | startCase}}</q-item-label>
          <q-item-label caption>{{delegator.codice_fiscale_delega}}</q-item-label>
        </q-item-section>
        <q-item-section side v-if="hasMoreActions">
          <q-icon
            color="grey-7"
            size="sm"
            name="more_vert"
            class="cursor-pointer"
          >
            <q-menu auto-close>
              <q-list>
                <q-item clickable @click="showDialog(validDelegations)">
                  <q-item-section> Rinuncia a tutti</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-icon>
        </q-item-section>
      </q-item>

      <q-card-section class="no-padding">
        <div class="q-px-md q-py-sm">Servizi a cui sei stato delegato</div>

        <div
          v-for="(delegation, index) in delegationListSorted"
          :key="delegation.uuid"
        >
          <lms-delegator-list-item
            :delegation="delegation"
            class="q-pa-md"
            @remove-delegation="showDialog"
          />

          <div class="q-px-md" v-if="index < delegationListSorted.length - 1">
            <q-separator />
          </div>
        </div>
      </q-card-section>


      <!-- LOADING -->
      <!-- --------------------------------------------------------------------------------------------------------- -->
      <q-inner-loading :visible="isLoading"/>
    </q-card>


    <!-- DIALOG DI CONFERMA -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <q-dialog
      v-model="isConfirmDialogOpen"
      >
      <q-card>
        <q-card-section>
          <div class="text-h6">Rinuncia Delega</div>
        </q-card-section>
        <q-card-section>
          <div>
            Stai per rinunciare alla delega per conto di
            <strong>{{delegatorFullName}}</strong>
            all'utilizzo dei servizi online:
            <ul class="q-mt-md">
              <li
                v-for="delegation in delegationsToRemoveSorted"
                :key="delegation.uuid"
              >
                <strong>{{getServiceName(delegation.codice_servizio)}}</strong>
              </li>
            </ul>
          </div>
        </q-card-section>
        <q-card-section>
          <q-card-actions align="right">
            <lms-buttons>
              <lms-button color="warning" label="Sì, rinuncia" :loading="isRemovingDelegations"  @click="removeDelegations"/>
              <lms-button outline label="No, annulla"  v-close-popup/>
            </lms-buttons>
          </q-card-actions>
        </q-card-section>

      </q-card>

    </q-dialog>

  </div>
</template>

<script>
import LmsDelegatorListItem from "components/LmsDelegatorListItem";
import {getAvatarIcon, getServiceName, isDelegationValid, isFseCodes} from "src/services/business-logic";
import {DELEGATION_STATUS_MAP} from "src/services/config";
import {apiErrorNotify, equalsIgnoreCase} from "src/services/utils";
import {waiveDelegation} from "src/services/api";
export default {
name: "LmsDelegatorItem",
  components: {LmsDelegatorListItem},
  props: {
    delegator: {type: Object, required: true},
    status: {required: false, default: undefined},
    service: {required: false, default: undefined},
  },
  data() {
    return {
      isLoading: false,
      isConfirmDialogOpen: false,
      delegationsToRemove: [],
      isRemovingDelegations:false
    }
  },
  computed: {
    taxCode(){
      return this.$store.getters["getTaxCode"];
    },
    avatarIcon(){
      return getAvatarIcon(this.delegator?.sesso_delega)
    },
    delegatorFullName() {
      return `${this.delegator.nome_delega} ${this.delegator.cognome_delega}`;
    },
    delegations() {
      let result = this.delegator.deleghe?.filter(d => !isFseCodes(d.codice_servizio));
      // @TODO: nascondiamo temporaneamente la delega di FSE
      result = result.filter(el => el.codice_servizio !== "FSE");
      if (this.status) result = result.filter(d => d.stato_delega === this.status);
      if (this.service) result = result.filter(d => d.codice_servizio === this.service);
      return result
    },
    delegationListSorted() {
      let result = [...this.delegations];

      result.sort((a, b) => {
        a = getServiceName(a.codice_servizio);
        b = getServiceName(b.codice_servizio);
        return a > b ? 1 : -1;
      });

      return result;
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
    validDelegations() {
      return this.delegations.filter(d => isDelegationValid(d.stato_delega))
    },
    delegationRemovableList() {
      let codes = [
       DELEGATION_STATUS_MAP.ACTIVE,
        DELEGATION_STATUS_MAP.UPDATED,
        DELEGATION_STATUS_MAP.IS_EXPIRING,
      ];

      return this.delegations.filter(d => codes.includes(d.stato_delega))
    },
    hasMoreActions() {
      return this.delegationRemovableList.length > 0;
    }
  },
  methods: {
    getServiceName,
    isDelegationValid,
    showDialog(delegations) {
      this.delegationsToRemove = delegations;
      this.isConfirmDialogOpen = true;
    },

    getText(delegation) {
      let textMap = {
        [DELEGATION_STATUS_MAP.ACTIVE]: 'Valida fino al',
        [DELEGATION_STATUS_MAP.IS_EXPIRING]: 'Valida fino al',
        [DELEGATION_STATUS_MAP.UPDATED]: 'Valida fino al',
        [DELEGATION_STATUS_MAP.EXPIRED]: 'Valida fino al',
        [DELEGATION_STATUS_MAP.REFUSED]: 'Rifiutata il',
        [DELEGATION_STATUS_MAP.REVOKED]: 'Revocata il',
      }

      return textMap[delegation.stato_delega]
    },
    getDate(delegation) {
      let propMap = {
        [DELEGATION_STATUS_MAP.ACTIVE]: 'data_fine_delega',
        [DELEGATION_STATUS_MAP.IS_EXPIRING]: 'data_fine_delega',
        [DELEGATION_STATUS_MAP.UPDATED]: 'data_fine_delega',
        [DELEGATION_STATUS_MAP.EXPIRED]: 'data_fine_delega',
        [DELEGATION_STATUS_MAP.REFUSED]: 'data_rinuncia_delega',
        [DELEGATION_STATUS_MAP.REVOKED]: 'data_revoca_delega',
      }

      let prop = propMap[delegation.stato_delega]
      return delegation[prop]
    },
    async removeDelegations() {
      this.isRemovingDelegations=true
      let delegatorCf = this.delegator.codice_fiscale_delega;
      try {
        let promises = this.delegationsToRemove.map(d => waiveDelegation(this.taxCode, delegatorCf, d.uuid, {}, {}))
        let response = await Promise.all(promises)
        this.delegationsToRemove.forEach(d => {
          d.stato_delega = DELEGATION_STATUS_MAP.REFUSED
          d.data_rinuncia_delega = new Date().toISOString()
        })
        this.delegationsToRemove = []
      } catch (error) {

        // @TODO: attualmente gestiamo l'errore di richiesta verso il notificatore restituito dal server
        //        in futuro, sarà sistemato e dovremo togliere questo codice
        let success = false;
        if (error.response && error.response.data && error.response.data.detail) {
          error.response.data.detail.forEach(d => {
            if (!d.valore) return
            let val = d.valore.toLowerCase()
            if (val.includes(`non esiste una delega servizio per l'uuid`) || val.includes(`errore notificatore`)) success = true
          })
        }


        if (success) {
          console.debug('We catch the fake error... good!')
          this.delegationsToRemove.forEach(d => {
            d.stato_delega = DELEGATION_STATUS_MAP.REFUSED
            d.data_rinuncia_delega = new Date().toISOString()
          })
          this.delegationsToRemove = []
        } else {
          let message= 'Non è stato possibile effettuare la rinuncia'

          // @TODO: gestire l'errore di rinuncia alla delega
          apiErrorNotify({message})
        }

      }finally {
        this.isRemovingDelegations=false
        this.isConfirmDialogOpen =false
      }


    },
  },
}
</script>

<style scoped>

</style>
