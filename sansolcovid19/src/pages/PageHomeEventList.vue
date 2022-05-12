<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <lms-page padding class="covid-page-home-event-list">
    <!-- LISTA EVENTI -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <template v-if="eventListSorted.length <= 0">
      <q-banner rounded class="bg-info q-mt-md">
        <div class="text-body1">Nessun provvedimento o evento disponibile</div>
      </q-banner>
    </template>

    <div class="q-gutter-y-md">
      <q-card
        v-for="event in eventListSorted"
        :key="event.idDecorso"
        class="covid-page-home-event-list__item"
      >
<!--        <q-card-section>-->
          <covid-event-list-item :event="event" />
<!--        </q-card-section>-->
      </q-card>
    </div>
  </lms-page>
</template>

<script>
import CovidEventListItem from "../components/CovidEventListItem";
import { orderBy } from "../services/utils";

export default {
  name: "PageHomeEventList",
  components: { CovidEventListItem },
  data() {
    return {};
  },
  computed: {
    citizenCovid() {
      return this.$store.getters["getCitizen"];
    },
    eventList() {
      return this.citizenCovid?.elencoDecorso || [];
    },
    eventListSorted() {
      return orderBy(this.eventList, ["dataDimissioni"], ["desc"]);
    },
  },
  created() {},
  methods: {},
};
</script>

<style lang="scss">
.covid-page-home-event-list {
  &__item:first-of-type {
    border: 3px solid #ec407a;
  }
}
</style>
