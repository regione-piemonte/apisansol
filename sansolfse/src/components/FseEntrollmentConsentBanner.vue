<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-banner class="bg-blue-2" rounded>
    <div class="row q-col-gutter-md items-center">
      <div class="col-auto">
        <q-icon name="fas fa-info-circle" size="md" />
      </div>

      <div class="col text-body1">
        Non hai dato il consenso a medici e operatori sanitari di consultare i tuoi documenti,
        puoi farlo in qualunque momento modificando le
        impostazioni nell'<a href="#" class="lms-link"  @click.prevent="onPermanentConsent">apposito servizio</a>
      </div>
    </div>
  </q-banner>
</template>

<script>
    export default {
        name: "FseEntrollmentConsentBanner",
        props: {},
        data() {
            return {}
        },
        computed: {

        },
        created() {
        },
        methods: {
          onPermanentConsent() {
            let url = "/la-mia-salute/#/consensi";
            window.location.assign(url);
          }
        }
    }
</script>

<style scoped lang="sass">

</style>
