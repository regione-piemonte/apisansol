<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-card class="tac-group-list-item-skeleton">
    <q-card-section>
      <!-- NOME SEZIONE -->
      <!-- ----------------------------------------------------------------------------------------------------------- -->
      <div
        class="tac-group-list-item-skeleton__header row items-center q-col-gutter-md"
      >
        <div class="col-12">
          <q-skeleton type="text" width="160px" class="bg-grey-6" />
        </div>
      </div>

      <q-separator spaced />

      <!-- ULTIMA RILEVAZIONE -->
      <!-- ----------------------------------------------------------------------------------------------------------- -->
      <div
        class="tac-group-list-item-skeleton__body row q-col-gutter-y-md q-col-gutter-x-lg q-py-lg"
      >
        <div class="col-auto">
          <q-skeleton type="circle" size="38px" animation="none" />
        </div>

        <div class="col">
          <q-skeleton type="text" width="100px" class="bg-grey-6" />
          <q-skeleton type="text" width="40px" height="16px" />
          <q-skeleton type="text" width="80px" class="q-mt-md" />
          <q-skeleton type="text" width="60px" />
        </div>
      </div>

      <q-separator spaced />

      <!-- AZIONI -->
      <!-- ----------------------------------------------------------------------------------------------------------- -->
      <div class="tac-group-list-item-skeleton__footer row q-col-gutter-md">
        <div class="col-auto">
          <q-skeleton type="circle" size="30px" animation="none" />
        </div>

        <q-space />

        <div class="col-auto">
          <q-skeleton type="circle" size="30px" animation="none" />
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  name: "TacGroupListItemSkeleton",
  props: {},
  data() {
    return {};
  },
  computed: {},
  created() {},
  methods: {}
};
</script>

<style lang="sass">
.tac-group-list-item-skeleton__header
  min-height: 60px

.tac-group-list-item-skeleton__body
  min-height: 180px
</style>
