<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-page padding>
    <!-- FILTRI -->
    <!-- --------------------------------------------------------------------------------------------------------- -->
    <div class="row q-mb-xl">
      <div class="col-12 col-lg">
        <csi-prescription-hide-filter
          :typology="typologySelected"
          :status="statusSelected"
          :period="periodSelected"
          :region="regionSelected"
          @period-change="onPeriodSelected"
          @status-change="onStatusSelected"
          @typology-change="onTypologySelected"
          @region-change="searchNoPiedmont"
        />
      </div>
    </div>

    <template v-if="!isLoading">
      <!-- BADGE NUMERO RICETTE FUORI PIEMONTE -->
      <!-- ----------------------------------------------------------------------------------------------------------- -->
      <div class="row items-center justify-center q-mb-lg">
        <div class="col-auto">
          <q-chip class="q-py-xs" color="info" text-color="black">
            <div class="row">
              <div class="col-12 col-md-auto text-center ">
                <strong>
                  <span
                    v-if="isEmpty(prescriptions)">Nessuna ricetta disponibile entro {{periodSelected}} mesi.  </span>
                  <span
                    v-else-if="prescriptions.length === 1">Hai 1 ricetta disponibile entro {{periodSelected}} mesi.  </span>
                  <span v-else>Hai {{prescriptions.length}} ricette disponibili entro {{periodSelected}} mesi.  </span>
                </strong>
              </div>
              <div style="white-space: pre-line;" class="col-12 col-md-auto text-center">
                <strong>
                  <span v-if="periodSelected<24" @click="periodIncrement">  <a style="color:#003575"
                                                                               href="javascript:;"> Estendi periodo</a></span>
                </strong>
              </div>
            </div>
          </q-chip>
        </div>
      </div>

      <!-- STATO VUOTO -->
      <!-- ----------------------------------------------------------------------------------------------------------- -->


      <!-- LISTA RICETTE -->
      <!-- ----------------------------------------------------------------------------------------------------------- -->
      <transition-group name="visits-transition" tag="div" leave-active-class="animated bounceOutLeft">
        <csi-prescription-item
          v-for="prescription in prescriptions"
          :key="prescription.nre"
          :prescription="prescription"
          class="q-mt-md"
          @detail="goToDetail(prescription)"
          @restore="onRestore(prescription)"
        />
      </transition-group>
    </template>

    <!-- LOADING -->
    <!-- --------------------------------------------------------------------------------------------------------- -->
    <csi-inner-loading :visible="isLoading" block/>
  </q-page>
</template>

<script>
  import CsiPrescriptionItem from "components/prescriptions/CsiPrescriptionItem";
  import CsiPrescriptionHideFilter from "components/prescriptions/CsiPrescriptionHideFilter";
  import {getPrescriptionsDrugs, getPrescriptionsVisits} from "@services/api/prescriptions";
  import CsiPrescriptionEnrollmentModal from "components/prescriptions/CsiPrescriptionEnrollmentModal";
  import CsiBanner from "components/global/common/CsiBanner";
  import {isEmpty} from "@services/global/utils";
  import {notifyError} from "@services/api/utils";
  import CsiPrescriptionsCountBadge from "components/prescriptions/CsiPrescriptionsCountBadge";
  import subMonths from 'date-fns/sub_months';

  export default {
    name: 'PagePrescriptionsHidden',
    components: {
      CsiPrescriptionsCountBadge,
      CsiPrescriptionItem,
      CsiPrescriptionHideFilter,
      CsiPrescriptionEnrollmentModal,
      CsiBanner
    },
    data() {
      return {
        statusSelected: "3",
        typologySelected: "P",
        isLoadingVisitsPiedmont: false,
        isLoadingVisitsNoPiedmont: false,
        isLoadingDrugsPiedmont: false,
        isLoadingDrugsNoPiedmont: false,
        noPiedmontSearched: false,
        visitsPiedmont: [],
        visitsNoPiedmont: [],
        drugsPiedmont: [],
        drugsNoPiedmont: [],
        periodSelected: 3,
        toDetail: false,
        regionSelected: true,
      }
    },
    computed: {
      cf() {
        return this.$store.getters['prescriptions/getTaxCode']
      },
      user() {
        return this.$store.getters['global/user']
      },
      isLoading() {
        return this.isLoadingVisitsPiedmont || this.isLoadingDrugsPiedmont
      },
      isLoadingNoPiedmont() {
        return this.isLoadingVisitsNoPiedmont || this.isLoadingDrugsNoPiedmont
      },
      prescriptionsPiedmont() {
        let result = [...this.visitsPiedmont, ...this.drugsPiedmont].filter(p => p.nascosta)
        if (this.typologySelected) result = result.filter(p => p.tipologia.codice === this.typologySelected)
        if (this.statusSelected) result = result.filter(p => p.stato.codice === this.statusSelected)
        return result
      },
      prescriptionsNoPiedmont() {
        let result = [...this.visitsNoPiedmont, ...this.drugsNoPiedmont].filter(p => p.nascosta)
        if (this.typologySelected) result = result.filter(p => p.tipologia.codice === this.typologySelected)
        if (this.statusSelected) result = result.filter(p => p.stato.codice === this.statusSelected)
        return result
      },
      prescriptions() {
        return [...(this.prescriptionsNoPiedmont.sort((a, b) => new Date(a.data_compilazione.toString()) - new Date(b.data_compilazione.toString()))).reverse(),
          ...(this.prescriptionsPiedmont.sort((a, b) => new Date(a.data_compilazione.toString()) - new Date(b.data_compilazione.toString()))).reverse()]
      },
    },
    created() {
      if (isEmpty(this.$route.query) && this.$q.sessionStorage.has("hiddenQuery")) {
        let name = this.$routes.PRESCRIPTIONS.PRESCRIPTIONS_HIDDEN.name
        let route = {
          name,
          query: this.$q.sessionStorage.get.item("hiddenQuery")
        }
        this.$router.replace(route)

      }

      if (this.$route.query.dataFilter) {
        this.periodSelected = parseInt(this.$route.query.dataFilter)

      }
      if (this.$route.query.statusFilter) {
        this.statusSelected = this.$route.query.statusFilter

      }

      if (this.$route.query.typologyFilter) {
        this.typologySelected = this.$route.query.typologyFilter

      }
      if (this.$route.query.regionFilter === true || this.$route.query.regionFilter === false) {
        this.regionSelected = this.$route.query.regionFilter

      }

      this.updatePrescriptions()
    },
    beforeRouteLeave(to, from, next) {
      if (!this.toDetail) this.$q.sessionStorage.set("hiddenQuery", this.$route.query)
      next()
    },
    methods: {
      isEmpty,
      goToDetail(prescription) {
        let name = this.$routes.PRESCRIPTIONS.PRESCRIPTION_DETAIL.name
        let params = {id: prescription.nre, prescription}
        let route = {
          name,
          params,
          query: {
            tipo: prescription.tipologia.codice,
            regionale: prescription.regionale,
            data: prescription.data_compilazione,
            nascosta: true
          }
        }
        this.toDetail = true;
        this.$router.push(route);
      },
      onRestore(prescription) {
        prescription.nascosta = false
      },
      onTypologySelected(newValue) {

        this.typologySelected = newValue
        if (this.noPiedmontSearched) {
          this.getVisitsNoPiedmont()
          this.getDrugsNoPiedmont()
        }

        let name = this.$routes.PRESCRIPTIONS.PRESCRIPTIONS_HIDDEN.name
        let route = {
          name,
          query: {
            dataFilter: this.periodSelected,
            statusFilter: this.statusSelected,
            typologyFilter: this.typologySelected,
            regionFilter: this.regionSelected
          }
        }

        this.$router.replace(route)
        // this.updatePrescriptions()
      },
      onStatusSelected(newValue) {

        this.statusSelected = newValue
        // this.updatePrescriptions()
        if (this.noPiedmontSearched) {
          this.getVisitsNoPiedmont()
          this.getDrugsNoPiedmont()
        }

        let name = this.$routes.PRESCRIPTIONS.PRESCRIPTIONS_HIDDEN.name
        let route = {
          name,
          query: {
            dataFilter: this.periodSelected,
            statusFilter: this.statusSelected,
            typologyFilter: this.typologySelected,
            regionFilter: this.regionSelected
          }
        }
        this.$router.replace(route)
      },
      onPeriodSelected(newValue) {

        this.periodSelected = newValue
        if (newValue) this.updatePrescriptions()
        if (this.noPiedmontSearched) {
          this.getVisitsNoPiedmont()
          this.getDrugsNoPiedmont()
        }
        let name = this.$routes.PRESCRIPTIONS.PRESCRIPTIONS_HIDDEN.name
        let route = {
          name,
          query: {
            dataFilter: this.periodSelected,
            statusFilter: this.statusSelected,
            typologyFilter: this.typologySelected,
            regionFilter: this.regionSelected
          }
        }
        this.$router.replace(route)
      },
      periodIncrement() {
        if (this.periodSelected < 24) {
          this.onPeriodSelected(this.periodSelected * 2)
        }
      },
      updatePrescriptions() {
        // Carichiamo sempre le specialistiche dal momento che sono visibili da tutti gli utenti
        if (this.regionSelected) {
          this.updateVisitsPiedmont()
        }

        // Se l'utente è piemontese ed è arruolato o delegato => può vedere da subito anche le farmaceutiche piemontesi
        if (this.regionSelected) {
          this.getDrugsPiedmont()
        }

        // Se l'utente ha già chiesto di visualizzare le ricette non piemontesi => aggiorniamo anche quelle
        if (!this.regionSelected) {
          this.getVisitsNoPiedmont()
          this.getDrugsNoPiedmont()
        }
      },
      async updateVisitsPiedmont() {

        this.isLoadingVisitsPiedmont = true

        let now = new Date()

        let startDate = subMonths(now, this.periodSelected).toISOString().split('T')[0]
        let endDate = now.toISOString().split('T')[0]

        let filter = {}
        filter.data_compilazione = {gte: startDate, lte: endDate}
        let config = {params: {filter}, _no5XXRedirect: true}


        try {
          //delega
          this.visitsNoPiedmont = []
          let response = await getPrescriptionsVisits(this.cf, true, config)
          this.visitsPiedmont = response.data
        } catch (e) {
          notifyError(e, 'Non è stato possibile ottenere le ricette piemontesi per le visite specialistiche')
        }

        this.isLoadingVisitsPiedmont = false
      },
      async getVisitsNoPiedmont() {
        this.isLoadingVisitsPiedmont = true

        let now = new Date()
        let startDate = subMonths(now, this.periodSelected).toISOString()
        let endDate = now.toISOString()

        let filter = {}
        filter.data_compilazione = {gte: startDate, lte: endDate}
        let config = {params: {filter}, _no5XXRedirect: true}

        try {
          //delega
          this.visitsPiedmont = []
          let response = await getPrescriptionsVisits(this.cf, false, config)
          this.visitsNoPiedmont = response.data


        } catch (e) {
          notifyError(e, 'Non è stato possibile ottenere le ricette non piemontesi per le visite specialistiche')
        }

        this.isLoadingVisitsPiedmont = false
      },
      async getDrugsPiedmont() {
        this.isLoadingDrugsPiedmont = true

        let now = new Date()

        let startDate = subMonths(now, this.periodSelected).toISOString().split('T')[0]
        let endDate = now.toISOString().split('T')[0]

        let filter = {}
        filter.data_compilazione = {gte: startDate, lte: endDate}
        let config = {params: {filter}, _no5XXRedirect: true}


        try {
          //delega
          let response = await getPrescriptionsDrugs(this.cf, true, {_no5XXRedirect: true})
          this.drugsPiedmont = response.data
        } catch (e) {
          notifyError(e, 'Non è stato possibile ottenere le ricette farmaceutiche piemontesi')
        }

        this.isLoadingDrugsPiedmont = false
      },
      async getDrugsNoPiedmont() {
        this.isLoadingDrugsPiedmont = true
        try {
          //delega
          let response = await getPrescriptionsDrugs(this.cf, false, {_no5XXRedirect: true})
          this.drugsPiedmont = []
          this.drugsNoPiedmont = response.data
        } catch (e) {
          notifyError(e, 'Non è stato possibile ottenere le ricette farmaceutiche non piemontesi')
        }

        this.isLoadingDrugsPiedmont = false
      },
      async searchNoPiedmont(newValue) {
        this.regionSelected = newValue

        if (this.regionSelected === false) {
          await this.getVisitsNoPiedmont()
          await this.getDrugsNoPiedmont()

          this.noPiedmontSearched = true

          let name = this.$routes.PRESCRIPTIONS.PRESCRIPTIONS_HIDDEN.name
          let route = {
            name,
            query: {
              dataFilter: this.periodSelected,
              statusFilter: this.statusSelected,
              typologyFilter: this.typologySelected,
              regionFilter: this.regionSelected
            }
          }
          this.$router.replace(route)

          return
        }

        if (this.regionSelected === true) {

          this.updateVisitsPiedmont()
          this.getDrugsPiedmont()
          this.noPiedmontSearched = false

        }
        let name = this.$routes.PRESCRIPTIONS.PRESCRIPTIONS_HIDDEN.name
        let route = {
          name,
          query: {
            dataFilter: this.periodSelected,
            statusFilter: this.statusSelected,
            typologyFilter: this.typologySelected,
            regionFilter: this.regionSelected
          }
        }
        this.$router.replace(route)

      },
    },
  }
</script>

<style scoped lang="stylus"></style>
