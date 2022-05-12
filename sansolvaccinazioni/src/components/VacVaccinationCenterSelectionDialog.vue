<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-dialog v-bind="attrs" v-on="listeners" :maximized="$q.screen.lt.sm">
    <q-card style="width: 800px; max-width: 800px;">
      <!-- HEADER -->
      <!-- --------------------------------------------------------------------------------------------------------- -->
      <q-card-section class="no-padding">
        <q-toolbar>
          <q-toolbar-title>
            Cambia centro vaccinale
          </q-toolbar-title>

          <q-btn v-close-popup flat round dense icon="close" />
        </q-toolbar>
      </q-card-section>

      <!-- SELEZIONE ASR -->
      <!-- --------------------------------------------------------------------------------------------------------- -->
      <q-card-section>
        <q-select
          dense
          label="Seleziona una ASL"
          v-model="asrSelected"
          :options="asrList"
          option-value="id"
          option-label="descrizione"
          emit-value
          map-options
          :loading="isLoadingAsrList"

        />
      </q-card-section>

      <q-card-section v-if="!asrSelected"></q-card-section>

      <!-- LISTA CENTRI VACCINALI -->
      <!-- --------------------------------------------------------------------------------------------------------- -->
      <div v-if="!isLoadingVaccinationCenterList">
        <q-card-section v-if="asrSelected" >
          <template v-if="vaccinationCenterList.length <= 0">
            <div>
              <q-banner class="q-banner--info">
                <div class="text-body1">
                  Nessun centro vaccinale trovato per l'ASL selezionata
                </div>
              </q-banner>
            </div>
          </template>

          <template v-else>
              <vac-vaccination-center-card
                class=" q-mb-md"
                v-for="vaccinationCenter in vaccinationCenterList"
                :key="vaccinationCenter.codice"
                :vaccination-center="vaccinationCenter"
                bordered
                @on-selected="onVaccinationCenterSelected"
              />
          </template>
        </q-card-section>
      </div>

      <!-- CARICAMENTO -->
      <!-- --------------------------------------------------------------------------------------------------------- -->
      <lms-inner-loading :showing="isLoadingVaccinationCenterList" block />
    </q-card>
  </q-dialog>
</template>

<script>
import VacVaccinationCenterListItem from "./VacVaccinationCenterListItem";
import { getAsrListTemp, getVaccinationCenterList } from "../services/api";
import { apiErrorNotify } from "../services/utils";
import VacVaccinationCenterCard from "components/VacVaccinationCenterCard";
import {VACCINATION_CENTER_FILTER} from "src/services/config";

export default {
  name: "VacVaccinationCenterSelectionDialog",
  inheritAttrs: false,
  components: {VacVaccinationCenterCard },
  props: {
    vaccinationCode: {type: String, required: false, default: null},
    vaccinationCenterSelected: {
      type: Object,
      required: false,
      default: null
    }
  },
  data() {
    return {
      isLoadingAsrList: false,
      isLoadingVaccinationCenterList: false,
      asrList: [],
      asrSelected:null,
      vaccinationCenterList: []
    };
  },
  computed: {
    attrs() {
      const { ...attrs } = this.$attrs;
      return attrs;
    },
    listeners() {
      const { ...listeners } = this.$listeners;
      return listeners;
    },

  },
  async created() {
    this.isLoadingAsrList = true;

    try {
      let { data } = await getAsrListTemp();
      this.asrList = data.filter(a => a.tipologia === "ASL");
    } catch (error) {
      let message = "Non è stato possibile caricare l'elenco delle ASL";
      apiErrorNotify({ error, message });
    }

    this.isLoadingAsrList = false;
  },
  watch: {
    asrSelected: {
      immediate:true,
      handler(val, oldVal) {
        if(val) this.loadVaccinationCenterList();
      }
    }
  },
  methods: {
    // onAslSelected(){
    //   this.loadVaccinationCenterList();
    // },
    async loadVaccinationCenterList() {
      let asrCode = "010" + this.asrSelected;
      let filter = {};
      filter.asl = { eq: asrCode };
      filter.tipoCentro = { eq: VACCINATION_CENTER_FILTER };
      if (this.vaccinationCode) filter.associazione = {eq: this.vaccinationCode};
      let params = { filter };

      this.isLoadingVaccinationCenterList = true;

      try {
        let { data } = await getVaccinationCenterList({ params });
        this.vaccinationCenterList = data;
      } catch (error) {
        let message =
          "Non è stato possibile caricare l'elenco dei centri vaccinali";
        apiErrorNotify({ error, message });
      }

      this.isLoadingVaccinationCenterList = false;
    },
    onVaccinationCenterSelected(vaccinationCenter) {
      this.$emit("selected", vaccinationCenter);
    }
  }
};
</script>

<style lang="sass">

</style>
