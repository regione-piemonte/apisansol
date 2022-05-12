<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<style></style>
<template>
  <div v-bind="attrs" v-on="listeners">
    <div class="row items-center">
      <div class="col-12 cursor-pointer">
        <q-btn flat color="white" text-color="black" icon="filter_list" label="Filtri"
               @click="openFilters"/>
      </div>
      <q-slide-transition>
        <div class="col-12 q-pl-md" v-show="isOpenFilters">
          <div class="row items-center q-mb-md q-col-gutter-lg">
            <div class="col-md col-12">
              <q-select
                :options="servicesOptions"
                v-model="selectedService"
                @input="$emit('service-change', $event)"
                label="Servizio"
                @filter="filterServices"
                use-input
                hide-selected
                fill-input
                map-options
                emit-value
                input-debounce="0"
                placeholder="Cerca tra i servizi ..."
                clearable>
              </q-select>
            </div>
            <div class="col-md col-12">
              <q-select
                :options="statussOptions"
                v-model="selectedStatus"
                @input="$emit('status-change', $event)"
                label="Stato"
                @filter="filterStatus"
                use-input
                hide-selected
                map-options
                emit-value
                fill-input
                input-debounce="0"
                placeholder="Cerca per stato ..."
                clearable>
              </q-select>
            </div>
          </div>
        </div>
      </q-slide-transition>
    </div>

  </div>
</template>

<script>
import {Screen} from "quasar";
import {DELEGATION_STATUS_LABEL, DELEGATION_STATUS_MAP} from "src/services/config";
import {orderBy} from "src/services/utils";
import {excludeFseCodes} from "src/services/business-logic";

export default {
  name: 'LmsDelegationsFilters',
  props: {
    service: {required: false, default: null},
    status: {required: false, default: null},
  },
  data() {
    return {
      Screen,
      servicesOptions: [],
      statussOptions: [],
      selectedService: null,
      selectedStatus: null,
      isOpenFilters: false
    }
  },

  computed: {
    listeners() {
      const {...listeners} = this.$listeners;
      return listeners;
    },
    attrs() {
      const {...attrs} = this.$attrs;
      return attrs;
    },

    appServices() {
     let services =  this.$store.getters['delegableAppServices']
      return excludeFseCodes(services)
    },
    servicesList() {
     let services =  this.appServices.map(service => {
        return {label: service?.applicazione?.descrizione, value: service.codice_servizio, _model: service};
      })
      return orderBy(services, ['label'], ['asc'])
    },
    statussList() {
      let statuss = DELEGATION_STATUS_MAP;
      return Object.values(statuss).map(s => ({value: s, label: DELEGATION_STATUS_LABEL[s]}))
    }
  },
  methods: {
    filterServices(val, update) {
      if (val === '') {
        update(() => {
          this.servicesOptions = this.servicesList
        })
        return
      }
      update(() => {

        const needle = val.toLowerCase()
        this.servicesOptions = this.servicesList.filter(v => v?.label.toLowerCase().indexOf(needle) > -1)
      })
    },
    filterStatus(val, update) {
      if (val === '') {
        update(() => {
          this.statussOptions = this.statussList
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.statussOptions = this.statussList.filter(v => v?.label.toLowerCase().indexOf(needle) > -1)
      })
    },
    openFilters() {
      this.isOpenFilters = !this.isOpenFilters
    },

  }
}
</script>
