<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-page padding>
    <csi-page-title title="Esenzione richiesta"></csi-page-title>

    <template v-if="exemption && !isLoading">
      <q-alert color="positive" class="q-mt-lg">
        <div class="q-display-2 text-weight-bold">
          La richiesta di esenzione è stata completata con successo. <br>
          Numero pratica {{exemption.numero_pratica}}. Nuova esenzione richiesta il {{today | format}}
        </div>

        <!-- Se l'esenzione è in stato "inviata" => è un'esenzione da validare -->
        <template v-if="exemption.stato.codice === 'INV'">
          <!-- Se ci sono gli allegati => l'utente ha caricato il file e si aspetta solo l'ok dell'operatore -->
          <div v-if="exemption.zip" class="q-pt-md">
            Da questo momento la pratica richiesta viene presa in carico e completata da un operatore ASL sulla base
            della documentazione presentata.
          </div>

          <!-- Altrimenti il cittadino deve andare a consegnare la documentazione allo sportello -->
          <div v-else class="q-pt-md">
            Dovrai passare allo sportello a consegnare la documentazione cartacea relativa
          </div>
        </template>

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
    import {getAttestatoPdf, getCertificatoPdf, getExemptionDetail} from '@services/api/pathology-exemption'
    import CsiPageTitle from 'components/global/common/CsiPageTitle'

    export default {
        name: 'PageExemptionNewSuccess',
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
            user() {
                return this.$store.getters['global/user']
            },
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
                if (this.exemption.certificato_id) {
                    params.document_type = '01'
                } else {
                    params.document_type = '02'
                }
                let response = await getAttestatoPdf(this.cf, this.exemption.id, {params})
            }
        },
    }
</script>


<style scoped lang="stylus"></style>
