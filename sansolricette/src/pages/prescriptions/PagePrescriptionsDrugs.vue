<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-page padding>
    <!--    <template v-if="isPiedmontUser || isDelegationActive">-->
    <!-- FILTRI -->
    <!-- --------------------------------------------------------------------------------------------------------- -->
    <div class="row gutter-xs q-mb-xl ">
      <div class="col-12 col-lg ">
        <csi-prescription-drug-filter
          :region="regionSelected"
          @region-change="searchNoPiedmont"
        />
      </div>
    </div>

    <template v-if="!isLoading">
      <!-- BADGE NUMERO RICETTE -->
      <!-- ----------------------------------------------------------------------------------------------------------- -->
      <div class="row items-center justify-center q-mb-lg">
        <div class="col-auto">
          <q-chip class="q-py-xs" color="info" text-color="black">
            <strong>
              <span v-if="isEmpty(drugs)">Nessuna ricetta disponibile</span>
              <span v-else-if="drugs.length === 1">Hai 1 ricetta disponibile</span>
              <span v-else>Hai {{drugs.length}} ricette disponibili</span>
            </strong>
          </q-chip>
        </div>
      </div>

      <!-- STATO VUOTO -->
      <!-- ----------------------------------------------------------------------------------------------------------- -->
      <!--Se ne occupa il q-chip-->

      <!-- LISTA RICETTE -->
      <!-- ----------------------------------------------------------------------------------------------------------- -->
      <transition-group name="drugs-transition" tag="div" leave-active-class="animated bounceOutRight">
        <csi-prescription-item
          v-for="prescription in drugs"
          :key="prescription.nre"
          :prescription="prescription"
          class="q-mt-md"
          @detail="goToDetail(prescription)"
          @hide="onHide(prescription)"
        />
      </transition-group>
    </template>
    <!--    </template>-->

    <!-- LOADING -->
    <!-- --------------------------------------------------------------------------------------------------------- -->
    <csi-inner-loading :visible="isLoading" block/>
  </q-page>
</template>

<script>
  import CsiPrescriptionItem from "components/prescriptions/CsiPrescriptionItem";
  import {getPrescriptionsDrugs} from "@services/api/prescriptions";
  import CsiBanner from "components/global/common/CsiBanner";
  import {isEmpty} from "@services/global/utils";
  import {notifyError} from "@services/api/utils";
  import CsiPrescriptionsCountBadge from "components/prescriptions/CsiPrescriptionsCountBadge";
  import CsiPrescriptionDrugFilter from "components/prescriptions/CsiPrescriptionDrugFilter";
  import {createAudit} from "@services/api/online-reports";

  export default {
    name: 'PagePrescriptionsDrugs',
    components: {
      CsiPrescriptionsCountBadge,
      CsiPrescriptionItem,
      CsiBanner,
      CsiPrescriptionDrugFilter
    },
    data() {
      return {
        regionSelected: true,
        isLoadingDrugsNoPiedmont: false,
        isLoadingDrugsPiedmont: false,
        noPiedmontSearched: false,
        drugsPiedmont: [],
        drugsNoPiedmont: [],
      }
    },
    computed: {
      user() {
        return this.$store.getters['global/user']
      },
      cf() {
        return this.$store.getters['prescriptions/getTaxCode']
      },
      isLoading() {
        // return this.isLoadingDrugsNoPiedmont || this.isLoadingDrugsPiedmont
        return this.isLoadingDrugsPiedmont
      },
      drugs() {
        return [...(this.drugsNoPiedmont.sort((a, b) => new Date(a.data_compilazione.toString()) - new Date(b.data_compilazione.toString()))).reverse(),
          ...(this.drugsPiedmont.sort((a, b) => new Date(a.data_compilazione.toString()) - new Date(b.data_compilazione.toString()))).reverse()].filter(d => !d.nascosta)
      },
    },
    created() {
      if (isEmpty(this.$route.query) && this.$q.sessionStorage.has("prescriptionDrugsQuery")) {
        let name = this.$routes.PRESCRIPTIONS.PRESCRIPTIONS_DRUGS.name
        let route = {
          name,
          query: this.$q.sessionStorage.get.item("prescriptionDrugsQuery")
        }
        this.$router.replace(route)
      }
      if (this.$route.query.regionFilter === true || this.$route.query.regionFilter === false) {
        this.regionSelected = this.$route.query.regionFilter

      }

      if (this.regionSelected === true) {
        this.getDrugsPiedmont()
      } else {
        if (this.regionSelected === false) {
          this.getDrugsNoPiedmont()
        }
      }
    },
    beforeRouteLeave(to, from, next) {
      if (!this.toDetail) this.$q.sessionStorage.set("prescriptionDrugsQuery", this.$route.query)
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
          query: {tipo: 'F', regionale: prescription.regionale, data: prescription.data_compilazione}
        }
        this.$router.push(route);
      },
      onHide(prescription) {
        prescription.nascosta = true
      },
      async getDrugsPiedmont() {
        this.isLoadingDrugsPiedmont = true

        try {
          let response = await getPrescriptionsDrugs(this.cf, true, {_no5XXRedirect: true})
          this.drugsPiedmont = response.data

          // if(this.$config.global.isDevelopment || this.$config.global.isTest) {
          try {
            let taxCode = this.$store.getters['prescriptions/getTaxCode'];
            let payload = {
              codice_verticale: "promem",
              codice_audit: "ACC_PROMEM_FARM",
              parametri: [
                {indice: "1", valore: "In piemonte"},
              ]
            };
            createAudit(taxCode, payload, {_no5XXRedirect: true});
          } catch (error) {
            console.error(error);
          }
          // }

        } catch (e) {
          notifyError(e, 'Non è stato possibile ottenere le ricette farmaceutiche piemontesi')
        }

        this.isLoadingDrugsPiedmont = false
      },
      async getDrugsNoPiedmont() {

        if (this.noPiedmontSearched === true) {
          this.drugsNoPiedmont = []
          this.noPiedmontSearched = false
          this.getDrugsPiedmont()
          return
        }

        this.isLoadingDrugsPiedmont = true
        //piemontese arruolabile

        try {
          let response = await getPrescriptionsDrugs(this.cf, false, {_no5XXRedirect: true})
          this.drugsNoPiedmont = response.data
          this.drugsPiedmont = []
          this.noPiedmontSearched = true

          // if(this.$config.global.isDevelopment || this.$config.global.isTest){
          try {
            let taxCode = this.$store.getters['prescriptions/getTaxCode'];
            let payload = {
              codice_verticale: "promem",
              codice_audit: "ACC_PROMEM_FARM",
              parametri: [
                {indice: "1", valore: "Fuori piemonte"},
              ]
            };
            createAudit(taxCode, payload, {_no5XXRedirect: true});
          } catch (error) {
            console.error(error);
          }
          // }

        } catch (e) {
          notifyError(e, 'Non è stato possibile ottenere le ricette farmaceutiche non piemontesi')
        }

        this.isLoadingDrugsPiedmont = false
      },
      searchNoPiedmont(newValue) {
        this.regionSelected = newValue
        let name = this.$routes.PRESCRIPTIONS.PRESCRIPTIONS_DRUGS.name
        let route = {
          name,
          query: {
            regionFilter: this.regionSelected
          }
        }
        this.$router.replace(route)

        this.getDrugsNoPiedmont()
      },
    },
  }
</script>


<style scoped lang="stylus"></style>
