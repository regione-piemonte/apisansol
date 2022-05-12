<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<style scoped></style>

<template>
  <q-page padding>
    <csi-page-title @back="goBack" :title="title"></csi-page-title>

    <template v-if="prescription">
      <csi-prescription-item :prescription="prescription" detail class="q-mt-md"></csi-prescription-item>
    </template>

    <!-- LOADING -->
    <!-- --------------------------------------------------------------------------------------------------------- -->
    <csi-inner-loading :visible="isLoading"/>
  </q-page>
</template>

<script>
    import CsiPrescriptionItem from "components/prescriptions/CsiPrescriptionItem";
    import CsiPageTitle from "components/global/common/CsiPageTitle";
    import {getPrescription} from "@services/api/prescriptions";
    import subMonths from 'date-fns/sub_months'

    export default {
        name: "PagePrescription",
        components: {CsiPageTitle, CsiPrescriptionItem},
        data() {
            return {
                prescription: null,
                isLoading: false,
                dataFilter: null,
            }
        },
        computed: {
            title() {
                return "Ricetta: " + this.$route.params.id
            },
            user() {
                return this.$store.getters['global/user']
            },
            cf() {
                return this.$store.getters['prescriptions/getTaxCode']
            },
        },
        async created() {
            this.isLoading = true
            let {id, prescription} = this.$route.params

            if (!prescription) {
                if (this.$route.query.nascosta) {
                    this.goBack()
                    return
                }
                //delega

                let date = this.$route.query.data


                let startDate = subMonths(date, 1).toISOString().split('T')[0]
                let endDate = date.split('T')[0]
                let filter = {}

                filter.data_compilazione = {gte: startDate, lte: endDate}
                filter.regionale = {eq: this.$route.query.regionale}
                filter.tipologia = {eq: this.$route.query.tipo}

                let config = {params: {filter}}
                let response = await getPrescription(this.cf, id, config)

                prescription = response.data
                this.$forceUpdate()
            }

            this.isLoading = false
            this.prescription = prescription
        },
        methods: {
            goBack() {
                this.$router.back()
            }
        },
    }
</script>
