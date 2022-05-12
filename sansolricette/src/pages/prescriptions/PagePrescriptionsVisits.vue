<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-page padding>
    <!-- FILTRI -->
    <!-- --------------------------------------------------------------------------------------------------------- -->
    <div class="row gutter-xs q-mb-xl ">
      <div class="col-12 col-lg ">
        <csi-prescription-visit-filter
          :status="statusSelected"
          :period="periodSelected"
          :region="regionSelected"
          @period-change="onPeriodSelected"
          @status-change="onStatusSelected"
          @region-change="findNoPiedmont"
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
                  <span v-if="isEmpty(visits)">Nessuna ricetta disponibile entro {{periodSelected}} mesi.  </span>
                  <span
                    v-else-if="visits.length === 1">Hai 1 ricetta disponibile entro {{periodSelected}} mesi.  </span>
                  <span v-else>Hai {{visits.length}} ricette disponibili entro {{periodSelected}} mesi.  </span>
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
      <div v-if="isEmpty(visits)">
        <div v-if="statusSelected===null && periodSelected===3">
          <q-card>
            <q-card-main>
              <csi-banner image-src="statics/images/banners/img_nessuna_ricetta.svg">
                <template slot="text">
                  <p>Questo servizio permette di visualizzare il promemoria delle ricette per visite specialistiche,
                    esami
                    e farmaci, a tuo nome o per conto di chi ti ha delegato, prescritte in Piemonte e non.</p>

                  <p>Sono visibili solo le ricette non scadute, fintanto che non vengono utilizzate per il ritiro di un
                    farmaco
                    o per l’erogazione di una visita/esame.</p>

                  <p>Il promemoria stampato da questo servizio equivale a quello fornito dal medico al momento della
                    prescrizione</p>
                </template>
              </csi-banner>
            </q-card-main>
          </q-card>
        </div>
      </div>

      <!-- LISTA RICETTE -->
      <!-- ----------------------------------------------------------------------------------------------------------- -->
      <transition-group name="visits-transition" tag="div" leave-active-class="animated bounceOutRight">
        <csi-prescription-item
          v-for="prescription in visits "
          :key="prescription.nre"
          :prescription="prescription"
          class="q-mt-md"
          @detail="goToDetail(prescription)"
          @hide="onHide(prescription)"
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
  import CsiPrescriptionVisitFilter from "components/prescriptions/CsiPrescriptionVisitFilter";
  import {getPrescriptionsVisits} from "@services/api/prescriptions";
  import CsiPrescriptionEnrollmentModal from "components/prescriptions/CsiPrescriptionEnrollmentModal";
  import CsiBanner from "components/global/common/CsiBanner";
  import {isEmpty} from "@services/global/utils";
  import {notifyError} from "@services/api/utils";
  import subMonths from 'date-fns/sub_months'
  import CsiPrescriptionsCountBadge from "components/prescriptions/CsiPrescriptionsCountBadge";
  import CsiEnrollmentModal from "components/enrollment/CsiEnrollmentModal";

  export default {
    name: 'PagePrescriptionsVisits',
    components: {
      CsiEnrollmentModal,
      CsiPrescriptionsCountBadge,
      CsiPrescriptionItem,
      CsiPrescriptionVisitFilter,
      CsiPrescriptionEnrollmentModal,
      CsiBanner
    },
    data() {
      return {
        statusSelected: "3",
        periodSelected: 3,
        regionSelected: true,
        isLoadingVisitsPiedmont: false,
        isLoadingVisitsNoPiedmont: false,
        noPiedmontSearched: false,
        visitsPiedmont: [],
        visitsNoPiedmont: [],
        toDetail: false,
      }
    },
    computed: {
      user() {
        return this.$store.getters['global/user']
      },
      cf() {
        return this.$store.getters['prescriptions/getTaxCode']
      },
      visits() {
        let result = [...(this.visitsNoPiedmont.sort((a, b) => new Date(a.data_compilazione.toString()) - new Date(b.data_compilazione.toString()))).reverse(),
          ...(this.visitsPiedmont.sort((a, b) => new Date(a.data_compilazione.toString()) - new Date(b.data_compilazione.toString()))).reverse()].filter(p => !p.nascosta)
        // Il filtro tramite stato avviene lato client
        if (this.statusSelected) result = result.filter(p => p.stato.codice === this.statusSelected)
        //if (this.regionSelected) result = result.filter(p => p.regionale === this.regionSelected)

        return result
      },
      isLoading() {
        return this.isLoadingVisitsPiedmont
      }
    },
    async created() {

      if (isEmpty(this.$route.query) && this.$q.sessionStorage.has("prescriptionVisitsQuery")) {
        let name = this.$routes.PRESCRIPTIONS.PRESCRIPTIONS_VISIT.name
        let route = {
          name,
          query: this.$q.sessionStorage.get.item("prescriptionVisitsQuery")
        }

        await this.$router.replace(route)
      }

      if (this.$route.query.dataFilter) {
        this.periodSelected = parseInt(this.$route.query.dataFilter)
      }

      if (this.$route.query.statusFilter) {
        this.statusSelected = this.$route.query.statusFilter
      }

      if (this.$route.query.regionFilter === true || this.$route.query.regionFilter === false) {
        this.regionSelected = this.$route.query.regionFilter
      }

      this.regionSelected ? this.getVisitsPiedmont() : this.getVisitsNoPiedmontFilter()
    },
    beforeRouteLeave(to, from, next) {
      if (this.toDetail === false) this.$q.sessionStorage.set("prescriptionVisitsQuery", this.$route.query)
      next()
    },
    watch: {
      cf: {
        handler() {
          sessionStorage.removeItem("prescriptionVisitsQuery")
          sessionStorage.removeItem("hiddenQuery")
          sessionStorage.removeItem("prescriptionDrugsQuery")
          this.periodSelected = 3
          this.statusSelected = "3"
          this.regionSelected = true
          this.noPiedmontSearched = false;
          this.getVisitsPiedmont();
        }
      },
    },
    methods: {
      isEmpty,
      goToDetail(prescription) {
        let name = this.$routes.PRESCRIPTIONS.PRESCRIPTION_DETAIL.name
        let params = {id: prescription.nre, prescription}
        let route = {
          name,
          params,
          query: {tipo: 'P', regionale: prescription.regionale, data: prescription.data_compilazione,}
        }
        this.toDetail = true;
        this.$router.push(route);
      },
      async onPeriodSelected(newValue) {
        this.periodSelected = newValue
        if (newValue) this.getVisitsPiedmont()

        if (this.noPiedmontSearched) {
          this.getVisitsNoPiedmont()
        }

        let name = this.$routes.PRESCRIPTIONS.PRESCRIPTIONS_VISIT.name
        let route = {
          name,
          query: {
            dataFilter: this.periodSelected,
            statusFilter: this.statusSelected,
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
      onStatusSelected(newValue) {
        this.statusSelected = newValue
        if (this.noPiedmontSearched) {
          this.getVisitsNoPiedmont()
        }
        let name = this.$routes.PRESCRIPTIONS.PRESCRIPTIONS_VISIT.name
        let route = {
          name,
          query: {
            dataFilter: this.periodSelected,
            statusFilter: this.statusSelected,
            regionFilter: this.regionSelected
          }
        }

        this.$router.replace(route)
      },
      onHide(prescription) {
        prescription.nascosta = true
      },
      async getVisitsPiedmont() {

        if (this.noPiedmontSearched === true) {
          return
        }
        this.isLoadingVisitsPiedmont = true

        let now = new Date()

        let startDate = subMonths(now, this.periodSelected).toISOString().split('T')[0]
        let endDate = now.toISOString().split('T')[0]

        let filter = {}
        filter.data_compilazione = {gte: startDate, lte: endDate}
        let config = {params: {filter}, _no5XXRedirect: true}

        try {
          let response = await getPrescriptionsVisits(this.cf, true, config)

          this.visitsPiedmont = response.data
        } catch (e) {
          notifyError(e, 'Non è stato possibile ottenere le ricette per le visite')
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
          let response = await getPrescriptionsVisits(this.cf, false, config)
          this.visitsNoPiedmont = response.data
          this.noPiedmontSearched = true
        } catch (e) {
          notifyError(e, 'Non è stato possibile ottenere le ricette non piemontesi per le visite')
        }

        this.isLoadingVisitsPiedmont = false
      },
      async getVisitsNoPiedmontFilter() {
        if (this.noPiedmontSearched === true) {
          this.isLoadingVisitsPiedmont = true
          this.visitsNoPiedmont = []
          this.noPiedmontSearched = false
          await this.getVisitsPiedmont()
          this.isLoadingVisitsPiedmont = false
          return
        }

        this.isLoadingVisitsPiedmont = true

        let now = new Date()
        let startDate = subMonths(now, this.periodSelected).toISOString()
        let endDate = now.toISOString()

        let filter = {}
        filter.data_compilazione = {gte: startDate, lte: endDate}
        let config = {params: {filter}, _no5XXRedirect: true}

        try {
          let response = await getPrescriptionsVisits(this.cf, this.regionSelected, config)
          this.visitsNoPiedmont = response.data
          this.visitsPiedmont = []
          this.noPiedmontSearched = true
        } catch (e) {
          notifyError(e, 'Non è stato possibile ottenere le ricette non piemontesi per le visite')
        }

        this.isLoadingVisitsPiedmont = false
      },
      async findNoPiedmont(newValue) {
        // Se l'utente che vuole visualizzare le ricette fuori regione non è piemontese
        // => apriamo la modal di arruolamento

        // @TODO: adesso come deve essere il comportamento?
        // if (this.isEnlisted || this.isDelegationActive) {
        //  console.log(this.isPiedmontUser)
        this.regionSelected = newValue
        this.getVisitsNoPiedmontFilter()
        //     return;
        // }

        let name = this.$routes.PRESCRIPTIONS.PRESCRIPTIONS_VISIT.name
        let route = {
          name,
          query: {
            dataFilter: this.periodSelected,
            statusFilter: this.statusSelected,
            regionFilter: this.regionSelected
          }
        }

        this.$router.replace(route)
      }
    },
  }
</script>

<style scoped lang="stylus"></style>
