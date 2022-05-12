<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-dialog
    v-bind="attrs"
    v-on="listeners"
    :maximized="$q.screen.lt.md"
  >
    <q-card :class="{'minWidth' : $q.screen.gt.sm}">
      <q-toolbar>
        <q-toolbar-title>
          Scegli il servizio
        </q-toolbar-title>

        <q-btn v-close-popup aria-label="chiudi finestra" dense flat icon="close" round/>
      </q-toolbar>
      <q-card-section v-if="serviceDelegateList.length>0" class="row q-col-gutter-md">
        <div v-for="service in serviceDelegateList"
             :key="service.id"
             class="col-12 col-sm-6 col-md-4">
          <q-card
            bordered
            class="q-pa-sm fit home-delegator-service-item cursor-pointer"
            flat
            @click="goToService(service)"
          >
            <q-item class="">
              <q-item-section side top>
                <q-icon :name="'img:' + iconUrl(service)" class="q-mr-xs" size="md"/>
              </q-item-section>

              <q-item-section top>
                <q-item-label class="text-bold" style="word-break: break-word">
                  {{ service.descrizione | empty }}
                </q-item-label>
                <q-item-label class="text-caption">
                  {{ categoryLabel(service) | empty }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-card>
        </div>
      </q-card-section>
      <q-card-section v-else>
        <q-banner class="q-mt-md q-py-md h-banner h-banner--info">
          <template #avatar>
            <q-icon name="img:info-outline.svg" size="md"/>
          </template>
          <div class="text-body1">
            Nessuna delega attiva.
          </div>
        </q-banner>
      </q-card-section>
      <q-card-actions align="right" class="q-pa-md">
        <q-btn
          :class="{'full-width': $q.screen.lt.sm}"
          :href="urls.delegatorListAdult()"
          class="delegations-btn q-mt-md"
          color="primary"
          outline
          type="a"
          unelevated
        >
          Gestisci servizi
        </q-btn>
      </q-card-actions>

    </q-card>
  </q-dialog>
</template>

<script>
import {date} from 'quasar'
import {DELEGATION_STATUS_MAP} from "src/services/config";
import {orderBy} from "src/services/utils";
import * as urls from "src/services/urls";

const {getDateDiff} = date;
export default {

  name: "HomeDelegatorServicesDialog",
  props: {
    delegator: {type: Object, default: null}
  },
  data() {
    return {
      urls,
    }
  },
  computed: {
    attrs() {
      const {...attrs} = this.$attrs;
      return attrs;
    },
    listeners() {
      const {...listeners} = this.$listeners;
      return listeners;
    },
    appList() {
      return this.$store.getters["getAppList"];
    },
    appListVisible() {
      return this.appList.filter(
        a => a.visibile_home_desktop || a.visibile_home_mobile
      );
    },
    delegations() {
      return this.delegator?.deleghe
    },
    delegatorUuid() {
      return this.delegator?.uuid
    },
    taxCode() {
      return this.delegator?.codice_fiscale_delega
    },
    serviceDelegateList() {
      let delegations = this.delegator?.deleghe
      let delegationList = []
      let delgationsListOrdered = []
      if (delegations) {
        for (let i = 0; i < delegations.length; i++) {
          let delegation = delegations[i]
          let service = this.appList.find(app => app.deleghe_codice === delegation.codice_servizio)
          if (service && delegation.stato_delega === DELEGATION_STATUS_MAP.ACTIVE)
            delegationList.push(service)
        }
        delgationsListOrdered = orderBy(delegationList, ['posizione'])

      }
      return delgationsListOrdered


    },
  },
  methods: {
    iconUrl(service) {
      return service?.icona_url ?? "";
    },
    categoryLabel(service) {
      return service?.categoria?.descrizione ?? "";
    },
    goToService(service) {
      let url = `${service.url}?d=${this.delegatorUuid}`;
      window.location.assign(url);
    }

  }
}
</script>

<style lang="sass">
.minWidth
  min-width: 750px

.home-delegator-service-item
  transition: all .5s ease

  &:hover
    box-shadow: nth($shadows, 3) !important
    background-color: $blue-1

.delegations-btn
  min-width: 200px

  &.focus, &:focus
    outline: 3px solid #f3c716

</style>
