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


    <csi-pathology-exemption-list-item
      v-if="exemption && !exemption.data_emissione"
      :exemption="exemption"
      is-detail
    />

<!--    <csi-pathology-exemption-aura-list-item-->
<!--      v-if="exemption && exemption.data_emissione"-->
<!--      :exemption="exemption"-->
<!--      is-detail></csi-pathology-exemption-aura-list-item>-->

    <!-- LOADING -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <csi-inner-loading :visible="isLoading"/>
  </q-page>
</template>


<script>
    import {getExemptionDetail} from '@services/api/pathology-exemption'
    import CsiPathologyExemptionListItem from 'components/pathology-exemption/CsiPathologyExemptionListItem'
    import CsiPageTitle from 'components/global/common/CsiPageTitle'

    export default {
        name: 'PageExemptionDetail',
        components: { CsiPageTitle, CsiPathologyExemptionListItem},
        props: {},
        data() {
            return {
                isLoading: false,
                exemption: null,
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

            let {id, exemption} = this.$route.params

            if (!exemption) {
                this.isLoading = true
                let response = await getExemptionDetail(this.cf, id)
                exemption = response.data
                this.isLoading = false
            }

            this.exemption = exemption
            console.log(this.exemption)
        },
        methods: {
            onBack() {
                // if (this.exemption.archiviata === false) {
                //     this.$router.push(this.$routes.PATHOLOGY_EXEMPTION.HOME)
                // } else {
                //     this.$router.push(this.$routes.PATHOLOGY_EXEMPTION.EXEMPTION_LIST_ARCHIVED)
                // }

                    this.$router.push(this.$routes.PATHOLOGY_EXEMPTION.EXEMPTION_LIST)



            }
        },
    }
</script>


<style scoped lang="stylus"></style>
