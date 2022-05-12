<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-page padding>
    <template v-if="!isLoading">
      <csi-page-title title="Dettaglio esenzione" @back="onBack" />

      <csi-exemption-item
        v-if="exemption"
        :exemption="exemption"
        @revoke="onRevoke"
        detail
        class="q-mt-md">
      </csi-exemption-item>
    </template>

    <q-inner-loading :visible="isLoading">
      <q-spinner-mat size="50px" color="primary"></q-spinner-mat>
    </q-inner-loading>
  </q-page>
</template>

<script>
    import CsiExemptionItem from 'components/income-exemption/CsiExemptionItem'
    import {getExemption} from '@services/api/income-exemption'
    import CsiPageTitle from 'components/global/common/CsiPageTitle'
    import {notifyError} from '@services/api/utils'

    export default {
        name: 'PageExemption',
        components: {CsiExemptionItem, CsiPageTitle},
        data() {
            return {
                exemption: undefined,
                isLoading: false,
            }
        },
        computed: {
            user() {
                return this.$store.getters['global/user']
            }
        },
        async created() {
            let {id, exemption} = this.$route.params

            if (!exemption) {
                this.isLoading = true

                try {
                    let response = await getExemption(this.user.cf, id, {_no5XXRedirect: true})
                    exemption = response.data
                } catch (e) {
                    notifyError(e, `Non è stato possibile ottenere l'esenzione`)
                }

                this.isLoading = false
            }

            this.exemption = exemption
        },
        methods: {
            onBack() {
                this.$router.go(-1)
            },
            onRevoke() {
                let name = this.$routes.INCOME_EXEMPTION.EXEMPTION_REVOKE.name
                let id = this.exemption.id
                let params = {id, exemption: this.exemption}
                this.$router.push({name, params})
            }
        },
    }
</script>

<style>
</style>
