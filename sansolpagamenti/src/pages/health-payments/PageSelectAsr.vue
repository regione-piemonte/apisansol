<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-page padding>

<!--    <q-card v-if="!isLoadingAsr">-->

<!--      <q-card-title>-->
<!--        Seleziona l'Azienda Sanitaria relativa al pagamento da effettuare-->
<!--      </q-card-title>-->

<!--      <q-list no-border link sparse>-->
<!--        <q-item-->
<!--          v-for="asr in asrs"-->
<!--          :key="asr.id"-->
<!--          class="position-relative"-->
<!--          v-ripple-->
<!--          @click.native="goToNewService">-->
<!--          <q-item-main>{{asr.descrizione}}</q-item-main>-->
<!--          <q-item-side right icon="chevron_right" />-->
<!--        </q-item>-->

<!--        <q-item-->
<!--          class="position-relative"-->
<!--          v-ripple-->
<!--          @click.native="goToOldService">-->
<!--          <q-item-main>Altre ASL</q-item-main>-->
<!--          <q-item-side right icon="chevron_right" />-->
<!--        </q-item>-->
<!--      </q-list>-->

<!--    </q-card>-->


    <csi-inner-loading visible />
  </q-page>
</template>


<script>
  import {notifyError} from "@services/api/utils";
  import {getAsr} from "@services/api/health-payments";
  import qs from 'qs';

  export default {
    name: 'PageSelectAsr',
    components: {},
    props: {},
    data() {
      return {
        asrs: [],
        asrLoaded: false,
        isLoadingAsr: false,
      }
    },
    computed: {},
    created() {
      // this.loadAsrs()
      this.goToNewService()
    },
    methods: {
      async loadAsrs() {

        this.isLoadingAsr = true

        try {
          let response = await getAsr()
          this.asrs = response.data
          this.asrLoaded = true
        } catch (e) {
          notifyError(e, 'Al momento non è possibile visualizzare la lista delle ASL')
        }

        this.isLoadingAsr = false
      },
      goToNewService() {
        let isUserLogged = this.$store.getters['global/isUserLogged']
        let route = isUserLogged ? this.$routes.HEALTH_PAYMENTS.AUTH_HOME : this.$routes.HEALTH_PAYMENTS.ANONYMOUS_WELCOME
        this.$router.push(route)
      },
      goToOldService() {
        console.debug('redirect')
        let isUserLogged = this.$store.getters['global/isUserLogged']

        // L'url può assumere 3 valori diversi per 3 casistiche diverse:
        //    - Utente non loggato
        //    - Utente loggato senza ASL di riferimento
        //    - Utente loggato con ASL di riferimento

        // Se l'utente non è loggato => effettuiamo il redirect su una pagina ad hoc
        if (!isUserLogged) {
          let url = this.$config.global.oldServicesUrls.pagamento_ticket_anonimo
          console.debug('Redirect to:', url)
          location.assign(url)
          return
        }

        // Se siamo a questo punto allora l'utente è sicuramente loggato
        let redirectUrl = this.$config.global.oldServicesUrls.pagamento_ticket_autenticato
        let redirectQueryParams = {servizio: 'ticket'}

        // Se l'utente è anche piemontese ed ha l'asl di assistenza impostata
        // => aggiungiamo nei query params l'id dell'asl di assistenza
        let isPiedmontUser = this.$store.getters['global/isPiedmontUser']
        if (isPiedmontUser) {
          let user = this.$store.getters['global/user']
          if (user.profile && user.profile.info_san && user.profile.info_san.asl_assistenza) {
            let idAsl = user.profile.info_san.asl_assistenza.slice(-3)
            redirectQueryParams['idAsl'] = idAsl
          }
        }

        let url = `${redirectUrl}?${qs.stringify(redirectQueryParams)}`
        console.debug('Redirect to:', url)
        location.assign(url)
      }
    },
  }
</script>


<style scoped lang="stylus"></style>
