<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="q-pa-md">
    <template v-if="!isLoading">
      <!-- NO ANAGRAFE VACCINALE -->
      <!-- --------------------------------------------------------------------------------------------------------- -->
      <template v-if="!citizen">
        <q-banner class="q-banner--info q-mt-lg">
          <div class="text-body1">
            Il tuo profilo non risulta censito nell'Anagrafe vaccinale. Ti
            consigliamo di recarti presso uno sportello per prenotare una
            vaccinazione.
          </div>
        </q-banner>
      </template>

      <template v-else>
        <!-- STATO VUOTO -->
        <!-- ------------------------------------------------------------------------------------------------------- -->
        <template v-if="vaccinationList.length <= 0">
          <q-banner class="q-banner--info q-mt-lg">
            <div class="text-body1">
              Le vaccinazioni previste dal tuo Calendario Vaccinale sono state completate: consulta la sezione "vaccini
              effettuati" per visualizzare il dettaglio.
            </div>
          </q-banner>
        </template>

        <!-- LISTA VACCINI -->
        <!-- ------------------------------------------------------------------------------------------------------- -->
        <div class="q-gutter-y-md" v-else>
          <vac-vaccination-future-list-item
            v-for="(vaccination, indexVF) in vaccinationListSorted"
            :key="indexVF"
            :vaccination="vaccination"
          />
        </div>

      </template>
    </template>

    <!-- CARICAMENTO -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <lms-inner-loading :showing="isLoading" block/>
  </div>
</template>

<script>
import {
  getVaccinationListFuture,
  getVaccinationUserInfo
} from "../services/api";
import {apiErrorNotify} from "../services/utils";
import VacVaccinationFutureListItem from "../components/VacVaccinationFutureListItem";

export default {
  name: "PageVaccinationCalendar",
  components: {VacVaccinationFutureListItem},
  data() {
    return {
      isLoading: false,
      citizen: null,
      vaccinationList: []
    };
  },
  computed: {
    cf() {
      return this.$store.getters["getTaxCode"];
    },
    vaccinationListSorted() {
      let result = [...this.vaccinationList];
      result.sort((a, b) => a.eta - b.eta);

      //controllo per mese
      result = result.map(a =>
        a.eta > 30 && a.eta < 730
          ? {...a, eta: Math.floor(a.eta / 30), unita: "mese"}
          : a
      );

      //controllo post 2 anni
      result = result.map(a =>
        a.eta > 730 ? {...a, eta: Math.floor(a.eta / 365), unita: "anno"} : a
      );

      return result;
    }
  },
  async created() {
    this.isLoading = true;

    try {
      let {data} = await getVaccinationUserInfo(this.cf);
      if (data && data.codice_fiscale) this.citizen = data;
    } catch (error) {
      let message = "Non è stato possibile recuperare i dati del cittadino";
      apiErrorNotify({error, message});
    }

    if (this.citizen) {
      try {
        let {data} = await getVaccinationListFuture(this.cf);
        this.vaccinationList = data.sort();
      } catch (error) {
        let message =
          "Non è stato possibile recuperare i dati del calendario vaccinale";
        apiErrorNotify({error, message});
      }
    }

    this.isLoading = false;
  },
  methods: {}
};
</script>

<style lang="sass"></style>
