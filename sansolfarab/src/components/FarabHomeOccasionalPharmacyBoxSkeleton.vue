<!--
 SPDX-License-Identifier: EUPL-1.2
 Copyright Regione Piemonte - 2023
-->

<template>
  <div class="farab-home-ocasional-pharmachy-box-skeleton">
    <q-card>
      <q-card-section>
        <div class="text-h3 text-bold q-mb-md">
          Farmacia occasionale
        </div>

        <p class="text-bold q-mb-sm">
          Consenti alla farmacia occasionale di accedere alle ricette
        </p>

        <q-skeleton type="text" width="80%" />
        <q-skeleton type="text" width="60%" />
        <q-skeleton type="text" width="70%" />
        <q-skeleton type="text" width="50%" />
      </q-card-section>

      <q-card-section class="q-pt-sm">
        <lms-buttons>
          <q-skeleton type="QBtn" animation="none" width="200px" />
        </lms-buttons>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
export default {
  name: "FarabHomeOccasionalPharmacyBoxSkeleton",
  components: {},
  props: {},
  data() {
    return {};
  },
  computed: {},
  created() {},
  methods: {}
};
</script>

<style scoped lang="sass"></style>
