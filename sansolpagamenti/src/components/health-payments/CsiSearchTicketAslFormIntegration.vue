<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="hidden">

    <!-- INTEGRAZIONE CON VECCHIO SERVIZIO -->
    <!-- Prima viene caricato nell'iframe la pagina dell'asr per cui vogliamo cercare il ticket affinchè il server generi il cookie -->
    <!-- Poi inviamo la POST tramite form -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <iframe
      v-if="isIframeVisible"
      :src="iframeSrc"
      @load="onIframeLoaded"
      class="hidden">
    </iframe>

    <form :action="action" method="post" ref="form" class="hidden">
      <input type="text" name="codFiscale" :value="taxCode">
      <input type="text" name="idAsl" :value="aslId">
      <input type="text" name="numeroTicket" :value="number">
      <input type="text" name="prosegui" value="PROSEGUI">
    </form>
  </div>
</template>


<script>
    export default {
        name: 'CsiSearchTicketAslFormIntegration',
        components: {},
        props: {
            taxCode: {type: String, required: true},
            aslId: {required: true},
            number: {type: String, required: false, default: ''},
        },
        data() {
            return {
                isIframeVisible: false,
                iframeSrc: '',
            }
        },
        computed: {
            action() {
                let url = `${this.$config.global.oldServicesUrls.pagamento_ticket_autenticato}`
                return url
            }
        },
        created() {
        },
        methods: {
            submit() {
                this.showIframe()
            },
            showIframe() {
                this.iframeSrc = `${this.$config.global.oldServicesUrls.pagamento_ticket_autenticato}?idAsl=${this.aslId}`
                this.isIframeVisible = true
            },
            hideIframe() {
                this.isIframeVisible = false
                this.iframeSrc = ''
            },
            onIframeLoaded() {
                this.hideIframe()
                this.$refs.form.submit()
            },
        },
    }
</script>


<style scoped lang="stylus"></style>

