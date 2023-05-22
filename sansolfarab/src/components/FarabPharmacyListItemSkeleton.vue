<!--
 SPDX-License-Identifier: EUPL-1.2
 Copyright Regione Piemonte - 2023
-->

<template>
  <q-card>
    <q-card-section >
      <q-item class="items-start no-padding">
        <q-item-section side>
          <q-skeleton type="QAvatar" size="md" />
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-subtitle1">
            <q-skeleton type="text" class="bg-grey-5" />
          </q-item-label>
          <q-item-label>
            <q-skeleton type="text" />
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-card-section>
    <!--  RECAPITI-->
    <template v-if="$q.screen.lt.sm">
      <q-skeleton type="rect" class="full-width" />
    </template>
    <q-card-section class="card-link q-py-none" v-else>
      <div class="row items-center">
        <q-skeleton type="text" width="60px" class="bg-grey-5 col-auto q-mr-md" />
        <q-skeleton type="text" class="col"/>
      </div>
      <div class="row items-center">
        <q-skeleton type="text" width="50px" class="bg-grey-5 col-auto q-mr-md" />

        <q-skeleton type="text" class="col"/>
      </div>
      <div class="row items-center">
        <q-skeleton type="text" width="60px" class="bg-grey-5 col-auto q-mr-md" />
        <q-skeleton type="text" class="col" />
      </div>
    </q-card-section>


    <!--  AZIONI-->
    <q-card-section>
      <q-skeleton type="QBtn" class="full-width"/>
    </q-card-section>

  </q-card>
</template>

<script>
export default {
name: "FarabPharmacyListItemSkeleton"
}
</script>

<style scoped>

</style>
