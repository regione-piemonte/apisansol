<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-page padding>

    <csi-page-title title="Revoca esenzione"/>

    <template v-if="exemption && !isLoading">

      <csi-pathology-exemption-list-item
        :exemption="exemption"
        no-actions
        no-more-actions
        class="q-mt-md"
      />

      <q-card class="q-mt-md">
        <q-card-main>
          <h5 class="csi-h6">Seleziona la motivazione</h5>

          <q-field required :error="$v.motivationValueSelected.$error" class="q-mt-md">
            <q-select
              float-label="Motivazione revoca"
              v-model="motivationValueSelected"
              :options="motivationOptions"
            />

            <template slot="error-label">
              <div v-if="!$v.motivationValueSelected.required">Campo obbilgatorio</div>
            </template>
          </q-field>
        </q-card-main>
      </q-card>

      <csi-buttons class="q-mt-lg">
        <csi-button primary label="Revoca" color="negative" :loading="isRevoking" @click="onRevoke"/>
      </csi-buttons>
    </template>

    <!-- LOADING -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <csi-inner-loading :visible="isLoading"/>
  </q-page>
</template>


<script>
    import {
        getExemptionDetail,
        getExemptionRevokeMotivations, revokeExemption
    } from "@services/api/pathology-exemption";
    import CsiPathologyExemptionListItem from "components/pathology-exemption/CsiPathologyExemptionListItem";
    import CsiPageTitle from "components/global/common/CsiPageTitle";
    import {required} from "vuelidate/lib/validators";

    export default {
        name: 'PageExemptionRevoke',
        components: {CsiPageTitle, CsiPathologyExemptionListItem},
        props: {},
        data() {
            return {
                isLoading: false,
                isRevoking: false,
                exemptionId: null,
                exemption: null,
                motivations: [],
                motivationValueSelected: null,
            }
        },
        computed: {
            cf() {
                return this.$store.getters['pathologyExemption/getTaxCode']
            },
            motivationOptions() {
                return this.motivations.map(m => ({value: m.codice, label: m.descrizione}))
            },
            motivationSelected() {
                return this.motivations.find(m => m.codice === this.motivationValueSelected)
            }
        },
        validations() {
            return {
                motivationValueSelected: {required}
            }
        },
        async created() {

            let {id, exemption} = this.$route.params
            this.exemptionId = id

            let motivationsPromise = getExemptionRevokeMotivations(this.cf, id)

            if (!exemption) {
                this.isLoading = true
                let response = await getExemptionDetail(this.cf, id)
                exemption = response.data
                this.isLoading = false
            }

            this.exemption = exemption
            let motivationsResponse = await motivationsPromise
            this.motivations = motivationsResponse.data
        },
        methods: {
            async onRevoke() {

                this.$v.$touch()
                if (this.$v.$error) return

                this.isRevoking = true
                let payload = {motivazione: this.motivationSelected}
                let response = await revokeExemption(this.cf, this.exemptionId, payload)
                let newExemption = response.data
                this.isRevoking = false

                let name = this.$routes.PATHOLOGY_EXEMPTION.EXEMPTION_REVOKE_SUCCESS.name
                let params = {id: this.exemptionId, exemption: newExemption}
                this.$router.push({name, params})
            }
        },
    }
</script>


<style scoped lang="stylus"></style>
