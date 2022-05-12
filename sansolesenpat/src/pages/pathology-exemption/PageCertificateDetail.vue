<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-page padding>

    <csi-page-title class=" q-mb-md" title="Dettaglio certificato"/>

    <csi-pathology-certificate-list-item
      v-if="certificate && !exemption"
      :certificate="certificate"
      is-detail
    />

    <csi-pathology-certificate-list-item
      v-if="certificate && exemption"
      :certificate="certificate"
      :exemption="exemption"
      is-detail
    />

    <!-- LOADING -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <csi-inner-loading :visible="isLoading"/>
  </q-page>
</template>


<script>
    import CsiPathologyCertificateListItem from 'components/pathology-exemption/CsiPathologyCertificateListItem'
    import {getCertificateDetail} from '@services/api/pathology-exemption'
    import CsiPageTitle from 'components/global/common/CsiPageTitle'

    export default {
        name: 'PageExemptionDetail',
        components: {CsiPageTitle, CsiPathologyCertificateListItem},
        props: {},
        data() {
            return {
                isLoading: false,
                certificate: null,
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

            let {id, certificate, exemption} = this.$route.params

            if (!certificate) {
                this.isLoading = true
                let response = await getCertificateDetail(this.cf, id)
                certificate = response.data
                this.isLoading = false
            }

            if (exemption) {
                this.exemption = exemption
            }
            this.certificate = certificate
        },
        methods: {},
    }
</script>


<style scoped lang="stylus"></style>
