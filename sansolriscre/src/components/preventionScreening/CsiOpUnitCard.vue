<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-card
    class="lms-op-unit-card service-card fit"
    :class="{ active: focused }"
    @click="showMarker()"
  >
    <q-card-section>
      <div class=" row items-start">
        <q-icon class="col-auto q-mr-md" name="img:/statics/la-mia-salute/icone/unita-operativa.svg" :size="($q.screen.sm ) ? 'md' : 'lg'"/>
        <div class="col">
          <div class="text-subtitle1 q-mb-xs">
            <strong>{{opUnitDescription}}</strong>
          </div>
          <div>
            {{opUnitAddress}}
          </div>
        </div>
      </div>
    </q-card-section>
    <q-card-section>
      <div class=" row items-start">
        <q-icon
          class="col-auto q-mr-md"
          :size="($q.screen.sm ) ? 'md' : 'lg'"
          name="img:/statics/la-mia-salute/icone/calendario.svg"
        />
        <div class="col">
          <div>
            Prima disponibilità:
          </div>
          <div>
            <strong v-if="firstAvailableDate">{{firstAvailableDate}}</strong>
            <strong v-else class="text-negative text-italic">
              Nessuna disponibilità per questa struttura
            </strong>
          </div>
        </div>
      </div>

    </q-card-section>

    <q-card-actions
      class="q-gutter-x-md "
      align="right"
    >
      <lms-buttons class="q-py-md q-pr-md" v-if="firstAvailableDate">
        <lms-button
          no-min-width
          @click="showCalendar()"
        >Prenota qui
        </lms-button
        >
      </lms-buttons>
    </q-card-actions>

  </q-card>
</template>

<script>
  import { date } from 'quasar'

  export default {
    name: "CsiOpUnitCard",

    data() {
      return{}
    },
    props: {
      opUnit: {type: Object, default: null},
      focused: {type: Boolean, default: false},
      mobile: {type: Boolean, default: false},
      facility: {type: Boolean, default: false},
    },
    computed: {
      opUnitDescription() {
        return this.opUnit?.descrizione
      },
      opUnitAddress() {
        if(this.opUnit)
          return this.facility ? this.opUnit.indirizzo_label : this.opUnit.indirizzo
        else
          return ''
      },
      firstAvailableDate() {
        return this.opUnit ? date.formatDate(this.opUnit.data_primo_appuntamento_disponibile, 'ddd D MMMM YYYY') : null
      }
    },
    methods: {
      openAddressModal() {
        this.changeAddressModal = true;
      },
      showMarker() {
        this.$emit('show-marker', true)
      },
      showCalendar() {
        this.$emit('show-calendar', this.opUnit)
      }
    }
  }
</script>

<style scoped>

</style>
