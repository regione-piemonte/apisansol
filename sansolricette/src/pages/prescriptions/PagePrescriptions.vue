<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-page>

    <!-- TABS -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->

    <q-tabs>
      <q-route-tab
        slot="title"
        label="Visite specialistiche ed esami"
        :to="$routes.PRESCRIPTIONS.PRESCRIPTIONS_VISIT">
      </q-route-tab>

      <q-route-tab
        slot="title"
        label="Farmaci"
        :to="$routes.PRESCRIPTIONS.PRESCRIPTIONS_DRUGS">
      </q-route-tab>

      <q-route-tab
        slot="title"
        label="Nascoste"
        :to="$routes.PRESCRIPTIONS.PRESCRIPTIONS_HIDDEN">
      </q-route-tab>
      <q-route-tab
        slot="title"
        label="Archivio"
        :to="$routes.PRESCRIPTIONS.PRESCRIPTIONS_ARCHIVE">
      </q-route-tab>


    </q-tabs>

    <!-- PAGINA INTERNA -->
    <!-- --------------------------------------------------------------------------------------------------------- -->
    <template>
      <router-view></router-view>
    </template>

  </q-page>
</template>


<script>
  import CsiPrescriptionEnrollmentModal from "components/prescriptions/CsiPrescriptionEnrollmentModal";
  import {getArruolabilita} from "@services/api/enrollment";

  export default {
    name: 'PagePrescriptions',
    components: {CsiPrescriptionEnrollmentModal},
    props: {},
    data() {
      return {
        isEnrollmentModalVisible: false,
        codice: null,
      }
    },
    computed: {
      user() {
        return this.$store.getters['global/user']
      },
      appServices() {
        return this.$store.state.global.appServices;
      },
    },
    created() {

      sessionStorage.removeItem("prescriptionVisitsQuery")
      sessionStorage.removeItem("hiddenQuery")
      sessionStorage.removeItem("prescriptionDrugsQuery")

    },

    methods: {
      goToEnrollment() {
        this.$router.push(this.$routes.ENROLLMENT.FLOW)
      },
      exit() {
        let serviceCode = this.$route.meta && this.$route.meta.appServiceCode
        let service = this.appServices.find(s => s.codice_servizio === serviceCode);
        if (service.obbligatorio_arruolamento) {
          this.$router.go(-1)
        } else {
          this.isEnrollmentModalVisible = false
        }
      },
      showEnrollmentModal() {
        let serviceCode = this.$route.meta && this.$route.meta.appServiceCode
        let service = this.appServices.find(s => s.codice_servizio === serviceCode);
        if (service.obbligatorio_arruolamento) {
          this.isEnrollmentModalVisible = false
          return
        }

        this.isEnrollmentModalVisible = true
      },
    },
  }
</script>


<style scoped lang="stylus"></style>
