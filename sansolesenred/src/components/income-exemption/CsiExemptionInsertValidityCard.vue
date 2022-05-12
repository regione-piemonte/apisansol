<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-card class="csi-exemption-insert-validity-card">
    <q-card-title>Validità</q-card-title>
    <q-card-main>
      <div class="row">
        <div class="col-6">
          <div>
            Inizio validità: <br>
            <strong>{{startDate | format}}</strong>
          </div>
        </div>
        <div class="col-6">
          <div>
            Scadenza: <br>
            <strong>{{endDate | format}}</strong>
          </div>
        </div>
      </div>
    </q-card-main>
  </q-card>
</template>


<script>
    export default {
        name: 'CsiExemptionInsertValidityCard',
        components: {},
        props: {},
        data() {
            return {}
        },
        computed: {
            startDate() {
                return new Date()
            },
            endDate() {
                return this.$store.getters['incomeExemption/getNewExemptionsExpirationDate']
            },
        },
        created() {
        },
        methods: {},
    }
</script>


<style scoped lang="stylus"></style>
