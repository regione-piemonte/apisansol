<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-list class="vac-vaccination-center-list-item" >
    <!-- NOME -->
    <!-- --------------------------------------------------------------------------------------------------------- -->
    <q-item class="q-px-none">
      <q-item-section side top>
        <q-icon
          size="md"
          name="img:/statics/la-mia-salute/icone/unita-operativa.svg"
          class="gt-xs"
        />
      </q-item-section>
      <q-item-section>
        <q-item-label>Struttura</q-item-label>
        <q-item-label>
          <strong>{{ description | capitalCase }}</strong>
        </q-item-label>
      </q-item-section>
    </q-item>

    <!-- INDIRIZZO -->
    <!-- --------------------------------------------------------------------------------------------------------- -->
    <q-item class="q-px-none q-pt-md">
      <q-item-section side top>
        <q-icon
          size="md"
          name="place"
          color="icon-color"
          class="gt-xs"
        />
      </q-item-section>
      <q-item-section>
        <q-item-label>Indirizzo</q-item-label>
        <q-item-label>
          <strong> {{ address | capitalCase }}, {{ city | capitalCase }}</strong>
        </q-item-label>
      </q-item-section>
    </q-item>

    <!-- EMAIL -->
    <!-- --------------------------------------------------------------------------------------------------------- -->
    <q-item class="q-px-none q-pt-md">
      <q-item-section side top>
        <q-icon
          size="md"
          name="email"
          color="icon-color"
          class="gt-xs"
        />
      </q-item-section>
      <q-item-section>
        <q-item-label>Email</q-item-label>
        <q-item-label v-if="mail">
          <a :href="'mailto:' + mail" class="lms-link"> {{ mail }}</a>
        </q-item-label>
        <q-item-label v-else>
          <strong>-</strong>
        </q-item-label>
      </q-item-section>
    </q-item>

    <!-- TELEFONO -->
    <!-- --------------------------------------------------------------------------------------------------------- -->
    <q-item class="q-px-none q-pt-md">
      <q-item-section side top>
        <q-icon
          size="md"
          name="phone"
          color="icon-color"
          class="gt-xs"
        />
      </q-item-section>
      <q-item-section>
        <q-item-label>Telefono</q-item-label>
        <q-item-label v-if="phone">
          <a :href="'tel:' + phone" class="lms-link">{{phone}}</a>
        </q-item-label>
        <q-item-label v-else>
          <strong>-</strong>
        </q-item-label>
      </q-item-section>
    </q-item>
    <!-- LISTA VACCINI -->
    <!-- --------------------------------------------------------------------------------------------------------- -->
    <q-item class="q-px-none q-pt-md" v-if="!isEmpty(vaccinations)">
      <q-item-section side top>
        <q-icon
          name="img:/statics/la-mia-salute/icone/vaccino.svg"
          size="md"
          class="gt-xs"
        />
      </q-item-section>
      <q-item-section>
        <q-item-label>Vaccini</q-item-label>
        <q-item-label>
          <strong>{{vaccinations | capitalCase}}</strong>
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script>
import LmsCardItem from "./core/LmsCardItem";
import LmsCardItemPrimary from "./core/LmsCardItemPrimary";
import {isEmpty} from "src/services/utils";


export default {
  name: "VacVaccinationCenterListItem",
  components: {},
  props: {
    vaccinationCenter: {type: Object, required: false, default: null},
    vaccinations:{type: String, required: false, default: null}
  },
  data() {
    return {};
  },
  computed: {
    description() {
      return this.vaccinationCenter?.descrizione ?? "";
    },
    city() {
      return this.vaccinationCenter?.comune ?? "";
    },
    address() {
      return this.vaccinationCenter?.indirizzo ?? "";
    },
    mail() {
      return this.vaccinationCenter?.mail ?? "";
    },
    phone() {
      return this.vaccinationCenter?.telefono ?? "";
    },
  },
  created() {
  },
  methods: {
    isEmpty,
  }
};
</script>

<style lang="sass"></style>
