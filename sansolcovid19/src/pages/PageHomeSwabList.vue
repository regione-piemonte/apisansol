<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <lms-page padding class="covid-page-home-swab-list">
    <!-- NO TAMPONI -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <template
      v-if="
        reservationListSorted.length <= 0 && swabUnionListSorted.length <= 0
      "
    >
      <q-banner rounded class="bg-info q-mt-md">
        Nessun tampone disponibile
      </q-banner>
    </template>

    <!-- LISTA TAMPONI PRENOTATI -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <!--    <template v-if="reservationListSorted.length > 0">-->
    <!--      <div class="q-my-lg csi-h5">-->
    <!--        Tamponi Prenotati-->
    <!--      </div>-->

    <!--      <div class="csi-group-card">-->
    <!--        <q-card v-for="reservation in reservationListSorted" :key="reservation.prenotazioneTamponeId">-->
    <!--          <q-card-main>-->
    <!--            <csi-covid-reservation-list-item :reservation="reservation"/>-->
    <!--          </q-card-main>-->
    <!--        </q-card>-->
    <!--      </div>-->
    <!--    </template>-->

    <!-- LISTA TAMPONI -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <template v-if="swabUnionListSorted.length > 0">
      <div class="q-my-lg text-bold text-h5">Tamponi eseguiti / prenotati</div>

      <div class="q-mt-xl q-gutter-y-xl">
        <q-card v-for="swab in swabUnionListSorted" :key="swab.__id">
<!--          <q-card-section>-->
            <template v-if="swab.__type === TYPE_MAP.RESERVATION">
              <covid-reservation-list-item :reservation="swab" />
            </template>
            <template v-else-if="swab.__type === TYPE_MAP.SWAB">
              <covid-swab-list-item :swab="swab" />
            </template>
            <template v-else>
              <covid-swab-screen-list-item :swab="swab" />
            </template>
<!--          </q-card-section>-->
        </q-card>
      </div>
    </template>
  </lms-page>
</template>

<script>
import CovidSwabListItem from "../components/CovidSwabListItem";
import CovidReservationListItem from "../components/CovidReservationListItem";
import CovidSwabScreenListItem from "../components/CovidSwabScreenListItem";
import { orderBy } from "../services/utils";
import { date } from "quasar";

const { getMaxDate } = date;

const TYPE_MAP = {
  SWAB: "SWAB",
  SCREEN: "SCREEN",
  RESERVATION: "RESERVATION",
};

export default {
  name: "PageHomeSwabList",
  components: {
    CovidSwabScreenListItem,
    CovidReservationListItem,
    CovidSwabListItem,
  },
  data() {
    return {
      TYPE_MAP,
    };
  },
  computed: {
    citizenCovid() {
      return this.$store.getters["getCitizen"];
    },
    reservationList() {
      return this.citizenCovid?.elencoPrenotazioneTampone || [];
    },
    reservationListSorted() {
      return orderBy(
        this.reservationList,
        ["hotspotDispeffFasciaDa"],
        ["desc"]
      );
    },
    swabList() {
      return this.citizenCovid?.elencoTampone || [];
    },
    swabScreenList() {
      return this.citizenCovid?.elencoTestScreening || [];
    },
    swabUnionList() {
      let swabList = this.swabList.map((s) => {
        let __date = getMaxDate(s.dataInserimentoRichiesta, s.dataTest);

        return {
          __type: TYPE_MAP.SWAB,
          __id: s.idTampone,
          // __date: s.dataInserimentoRichiesta,
          __date,
          ...s,
        };
      });

      let screenList = this.swabScreenList.map((s) => {
        return {
          __type: TYPE_MAP.SCREEN,
          __id: s.idTampone,
          __date: s.testDataEsecuzione,
          ...s,
        };
      });

      let reservationList = this.reservationList.map((s) => {
        return {
          __type: TYPE_MAP.RESERVATION,
          __id: s.prenotazioneTamponeId,
          __date: s.hotspotDispeffFasciaDa,
          ...s,
        };
      });

      return [...swabList, ...screenList, ...reservationList];
    },
    swabUnionListSorted() {
      return orderBy(this.swabUnionList, ["__date"], ["desc"]);
    },
  },
  created() {},
  methods: {},
};
</script>

<style scoped lang="scss"></style>
