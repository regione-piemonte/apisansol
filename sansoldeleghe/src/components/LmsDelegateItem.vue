<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<!--
Questo componente rappresenta una delega concesse
-->
<template>
  <div>
    <q-card class="q-py-md q-px-sm">
      <q-item>
        <q-item-section avatar>
          <q-icon size="lg" :name="avatarIcon" />
        </q-item-section>

        <q-item-section>
          <q-item-label class="text-bold">{{delegateFullName | startCase}}</q-item-label>
          <q-item-label caption>{{delegate.codice_fiscale_delega}}</q-item-label>
        </q-item-section>

        <q-item-section side v-if="!readOnly">
          <q-icon
            color="grey-7"
            size="sm"
            name="more_vert"
            class="cursor-pointer"
          >
            <q-menu auto-close>
              <q-list>
                <q-item clickable @click="goToHistory()">
                  <q-item-section>Storico delegato</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-icon>
        </q-item-section>
      </q-item>
      <q-card-section class="no-padding">
        <div
          v-for="(delegation, index) in delegationListSorted"
          :key="delegation.uuid"
        >
          <lms-delegations-list-item
            :delegation="delegation"
            class="q-pa-md"
          />

          <div class="q-px-md" v-if="index < delegationListSorted.length - 1">
            <q-separator />
          </div>
        </div>
      </q-card-section>

      <lms-buttons v-if="!readOnly" class="q-pa-md" >
        <lms-button  outline @click="goToEdit" label="Gestisci"/>
      </lms-buttons>
    </q-card>

  </div>
</template>


<script>

  import LmsDelegationsListItem from "components/LmsDelegationsListItem";
  import {equalsIgnoreCase, startCase} from "src/services/utils";
  import {DELEGATE_EDIT, DELEGATE_HISTORY} from "src/router/routes";
  import {getAvatarIcon, getServiceName, isFseCodes} from "src/services/business-logic";

  export default {
    name: 'LmsDelegateItem',
    components: {LmsDelegationsListItem},
    props: {
      delegate: {type: Object, required: true},
      status: {required: false, default: undefined},
      service: {required: false, default: undefined},
      readOnly: {type: Boolean, required: false, default: false},
    },
    data() {
      return {}
    },
    computed: {
      avatarIcon(){
        return getAvatarIcon(this.delegate?.sesso_delega)
      },
      delegateFullName() {
        return `${this.delegate.nome_delega} ${this.delegate.cognome_delega}`
      },
      delegations() {

        let result = this.delegate.deleghe?.filter(d => !isFseCodes(d.codice_servizio));

        // @TODO: nascondiamo temporaneamente la delega di FSE
        result = result.filter(el => el.codice_servizio !== "FSE");

        if (this.status) result = result.filter(d => d.stato_delega === this.status)
        if (this.service) result = result.filter(d => d.codice_servizio === this.service)
        return result
      },
      delegationListSorted() {
        let result = [...this.delegations];

        result.sort((a, b) => {
          a = getServiceName(a.codice_servizio);
          b = getServiceName(b.codice_servizio);
          return a > b ? 1 : -1
        });

        return result
      }
    },
    methods: {

      goToHistory() {
        let route = DELEGATE_HISTORY
        let params = {delegateUuid: this.delegate.uuid, delegate:this.delegate}
        this.$router.push({name: route.name, params})
      },
      goToEdit() {
        let route = DELEGATE_EDIT
        let params = {delegateUuid: this.delegate.uuid, delegate: this.delegate}
        this.$router.push({name: route.name, params})
      },
    }
  }
</script>


<style></style>
