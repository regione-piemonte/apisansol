<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="q-pa-md">
    <template v-if="!isLoading">
      <!-- NO ANAGRAFE VACCINALE -->
      <!-- --------------------------------------------------------------------------------------------------------- -->
      <template v-if="!vaccinationUserInfo">
        <q-banner class="q-banner--info q-mt-lg">
          <div class="text-body1">
            Il tuo profilo non risulta censito nell'Anagrafe vaccinale. Ti
            consigliamo di recarti presso uno sportello per prenotare una
            vaccinazione.
          </div>
        </q-banner>
      </template>

      <div class="q-mt-md" v-else>
        <!-- CENTRO VACCINALE DI COMPETENZA -->
        <!-- ----------------------------------------------------------------------------------------------------- -->
        <template v-if="vaccinationCenter">
          <div class="text-h5 q-mt-sm">
            Il tuo centro vaccinale di competenza
          </div>
          <q-card class="q-mt-md">
            <q-card-section>
              <vac-vaccination-center-list-item
                :vaccination-center="vaccinationCenter"
              />
            </q-card-section>
          </q-card>

        </template>

        <!-- LISTA CENTRI VACCINALI ASL DI COMPETENZA -->
        <!-- ----------------------------------------------------------------------------------------------------- -->
        <template v-if="vaccinationCenterListMyAsr.length > 0">
          <div class="text-h5 q-mt-xl">
            Altri centri vaccinali della tua Asl di competenza
          </div>

          <div class="q-mt-md q-gutter-y-md">
            <q-card v-for="vaccinationCenter in vaccinationCenterListMyAsr"
                    :key="vaccinationCenter.codice">
              <q-card-section>
                <vac-vaccination-center-list-item
                  :vaccination-center="vaccinationCenter"
                />
              </q-card-section>
            </q-card>

          </div>
        </template>
      </div>

      <!-- ALTRI CENTRI VACCINALI -->
      <!-- ------------------------------------------------------------------------------------------------------- -->
      <div class="text-h5 q-mt-xl">
        Altri centri vaccinali
      </div>

      <div>
        <q-select
          v-model="asrSelected"
          emit-value
          map-options
          :options="asrList"
          label="seleziona un'ASL"
          option-value="id"
          option-label="descrizione"
          class="q-mt-md"
          @input="searchVaccinationCenters"
        />
        <template v-if="asrSelected">
          <template v-if="isSearching">
            <lms-inner-loading :visible="isSearching" block/>
          </template>
          <template v-else>
            <template v-if="vaccinationCenterListSearched.length <= 0">
              <q-banner class="q-banner--info q-mt-md">
                <div class="text-body1">
                  Per questa Asl non sono disponibili centri vaccinali
                </div>
              </q-banner>
            </template>
            <template v-else>
              <div class="q-mt-lg q-gutter-y-md">
                <q-card v-for="vaccinationCenter in vaccinationCenterListSearched"
                        :key="vaccinationCenter.codice">
                  <q-card-section>

                    <vac-vaccination-center-list-item
                      :vaccination-center="vaccinationCenter"
                    />
                  </q-card-section>
                </q-card>
              </div>
            </template>
          </template>
        </template>

      </div>
    </template>
    <lms-inner-loading :showing="isLoading" block/>
  </div>

</template>

<script>
import {
  getAsrListTemp,
  getVaccinationCenterDetail,
  getVaccinationCenterList,
  getVaccinationUserInfo
} from "../services/api";
import {apiErrorNotify} from "../services/utils";
import VacVaccinationCenterListItem from "../components/VacVaccinationCenterListItem";
import {VACCINATION_CENTER_FILTER} from "src/services/config";

export default {
  name: "PageVaccinationCenterList",
  components: {VacVaccinationCenterListItem},
  data() {
    return {
      isLoading: false,
      isSearching: false,
      vaccinationUserInfo: null,
      vaccinationCenter: null,
      vaccinationCenterListMyAsr: [],
      vaccinationCenterListSearched: [],
      asrList: [],
      asrSelected: null
    };
  },
  computed: {
    cf() {
      return this.$store.getters["getTaxCode"];
    },
    userVaccinationCenterId() {
      return this.vaccinationUserInfo?.centro_vaccinale;
    },
    userAslId() {
      return this.vaccinationUserInfo?.asl?.codice;
    },
  },
  async created() {
    this.isLoading = true;
    let citizenPromise = getVaccinationUserInfo(this.cf);
    let asrListPromise = getAsrListTemp();
    try {
      let {data} = await citizenPromise;
      if (data && data.codice_fiscale)  this.vaccinationUserInfo = data;
    } catch (error) {
      let message = "Non è stato possibile recuperare i dati del cittadino";
      apiErrorNotify({error, message});
    }

    if (this.vaccinationUserInfo) {
      let id = this.userVaccinationCenterId;
      let vaccinationCenterPromise = getVaccinationCenterDetail(id);

      let filter = {};
      filter.asl = {eq: this.userAslId};
      filter.tipoCentro = { eq: VACCINATION_CENTER_FILTER };
      let params = {filter};
      let vaccinationCenterListPromise = getVaccinationCenterList({params});

      try {
        let {data} = await vaccinationCenterPromise;
        this.vaccinationCenter = data;
      } catch (error) {
        let message =
          "Non è stato possibile recuperare i dati del centro vaccinale";
        apiErrorNotify({error, message});
      }

      try {
        let {data} = await vaccinationCenterListPromise;
        this.vaccinationCenterListMyAsr = data;
        if (this.vaccinationCenter) {
          this.vaccinationCenterListMyAsr = this.vaccinationCenterListMyAsr.filter(a => a.codice !== this.vaccinationCenter.codice)
        }
      } catch (error) {
        let message =
          "Non è stato possibile caricare la lista di centri vaccinali";
        apiErrorNotify({error, message});
      }

      try {
        let {data} = await asrListPromise;
        this.asrList = data.filter(a => a.tipologia === "ASL");
      } catch (error) {
        console.error(error);
      }
    }

    this.isLoading = false;
  },
  methods: {
    async searchVaccinationCenters() {
      let filter = {};
      filter.asl = {eq: "010" + this.asrSelected};
      filter.tipoCentro = { eq: VACCINATION_CENTER_FILTER };
      let params = {filter};
      this.isSearching = true;

      try {
        let {data} = await getVaccinationCenterList({params});
        this.vaccinationCenterListSearched = data;
      } catch (error) {
        let message =
          "Non è stato possibile caricare la lista di centri vaccinali";
        apiErrorNotify({error, message});
      }finally {
        this.isSearching = false;
      }


    }
  }
};
</script>

<style lang="sass"></style>
