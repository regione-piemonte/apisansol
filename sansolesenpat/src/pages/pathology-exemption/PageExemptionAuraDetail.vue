<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-page padding>

    <csi-page-title
      title="Dettaglio esenzione"
      class="q-mb-md"
      @back="onBack"
    />


    <csi-pathology-exemption-aura-list-item
      v-if="exemption "
      :exemption="exemption"
      @revoked="onBack"
      is-detail></csi-pathology-exemption-aura-list-item>

    <!-- LOADING -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <csi-inner-loading :visible="isLoading"/>
  </q-page>
</template>


<script>
    import {getAuraExemptionDetail} from '@services/api/pathology-exemption'
    import CsiPageTitle from 'components/global/common/CsiPageTitle'
    import CsiPathologyExemptionAuraListItem from "components/pathology-exemption/CsiPathologyExemptionAuraListItem";
    import {date} from 'quasar';
    const {buildDate, startOfDate, endOfDate, formatDate, clone, getDateDiff, addToDate, subtractFromDate, getDayOfWeek} = date;
    export default {
        name: 'PageExemptionAuraDetail',
        components: {CsiPathologyExemptionAuraListItem, CsiPageTitle},
        props: {},
        data() {
            return {
                isLoading: false,
                exemption: null,
                emissionDate: null,
                expireDate: null,
                exemptionCode: null,
                pathologyCode: null,
            }
        },
        computed: {
            user() {
                return this.$store.getters['global/user']
            },
            cf() {
                return this.$store.getters['pathologyExemption/getTaxCode']
            },
        },
        async created() {

           // let {emissionDate, exemptionCode, expireDate, exemption} = this.$route.params
            let {emissionDate, exemptionCode, pathologyCode, exemption} = this.$route.params

            this.emissionDate=emissionDate
            //this.expireDate=expireDate
            this.exemptionCode = exemptionCode
            this.pathologyCode = pathologyCode
            console.log(this.$route.params)
            if (!exemption) {

                this.isLoading = true
                // let filters = {data_scadenza: null,
                // data_emissione: null}
                let filters = {
                data_emissione: null}

                if (this.emissionDate) { filters.data_emissione = {'eq': formatDate(new Date(this.emissionDate), "YYYY-MM-DD")}
                }

                // if (this.expireDate) filters.data_scadenza = {'eq': formatDate(new Date(this.expireDate), "YYYY-MM-DD")}


                let response = await getAuraExemptionDetail(this.cf, this.exemptionCode, this.pathologyCode,  filters)
                exemption = response.data
                this.isLoading = false
            }

            this.exemption = exemption

        },
        methods: {
            onBack() {
                // if (this.exemption.archiviata === false) {
                //     this.$router.push(this.$routes.PATHOLOGY_EXEMPTION.HOME)
                // } else {
                //     this.$router.push(this.$routes.PATHOLOGY_EXEMPTION.EXEMPTION_LIST_ARCHIVED)
                // }

                    if(this.exemption.stato.codice==='VAL'){
                        this.$router.push(this.$routes.PATHOLOGY_EXEMPTION.EXEMPTION_AURA_LIST)
                    }
                    else{
                        this.$router.push(this.$routes.PATHOLOGY_EXEMPTION.EXEMPTION_AURA_LIST_ARCHIVED)
                    }



            }
        },
    }
</script>


<style scoped lang="stylus"></style>
