<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-page padding>
    <csi-page-title title="Esenzione rinnovata"/>

    <template v-if="exemption && !isLoading">
      <q-alert color="positive" class="q-mt-lg q-mx-md">
        <div class="q-display-2 text-weight-bold">
          La richiesta di rinnovo è stata completata con successo. <br>
          Numero pratica {{exemption.numero_pratica}}. Rinnovo richiesto il {{today | format}}
        </div>

        <div class="q-pt-md">
          Da questo momento la pratica richiesta viene presa in carico e completata da un operatore ASL sulla base della
          documentazione presentata.
        </div>

        <div class="q-pt-md text-weight-light">
          Hai bisogno di aiuto?
          Scrivi a assistenza.salute@csi.it specificando: il tuo recapito telefonico, il tuo codice fiscale, il problema
          che hai rilevato
        </div>
      </q-alert>

      <csi-buttons class="q-mt-lg">
        <csi-button primary label="Torna alla home" @click="goToHome"/>

        <csi-button secondary label="Stampa" @click="downloadSchermata"/>

      </csi-buttons>
    </template>

    <!-- LOADING -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <csi-inner-loading :visible="isLoading"/>
  </q-page>
</template>


<script>
    import CsiPageTitle from "components/global/common/CsiPageTitle";
    import {getAttestatoPdf, getExemptionDetail} from "@services/api/pathology-exemption";

    export default {
        name: 'PageExemptionRevokeSuccess',
        components: {CsiPageTitle},
        props: {},
        data() {
            return {
                isLoading: false,
                exemption: null,
                today: null,
            }
        },
        computed: {

            cf() {
                return this.$store.getters['pathologyExemption/getTaxCode']
            },
        },
        async created() {
            this.today = Date.now()
            let {id, exemption} = this.$route.params

            if (!exemption) {
                this.isLoading = true
                let response = await getExemptionDetail(this.cf, id)
                exemption = response.data
                this.isLoading = false
            }

            this.exemption = exemption
        },
        methods: {
            goToHome() {
                this.$router.push(this.$routes.PATHOLOGY_EXEMPTION.HOME)
            },
            async downloadSchermata() {
                let params = {}
                params.document_type = '03'
                let response = await getAttestatoPdf(this.cf, this.exemption.id, {params})
            }
        },
    }
</script>


<style scoped lang="stylus"></style>
