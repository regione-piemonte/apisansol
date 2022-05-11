<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="q-py-sm q-px-md">

      <div class="row  items-center justify-between q-col-gutter-x-md">
<!--        <div class="col-auto">-->
<!--          <q-skeleton type="text" width="60px" />-->
<!--        </div>-->
        <div class="col-10 q-mt-xs text-body1 text-bold">
          <q-skeleton type="text"  height="30px" class="bg-grey-5" />
          <q-skeleton type="QBadge" width="80px" />
        </div>
        <q-space />

        <div class="col-auto">
          <q-skeleton type="circle" size="25px" class="bg-grey-5" />
        </div>
      </div>

      <div class="q-mt-xs">

        <q-skeleton type="text" width="95%" />
        <q-skeleton type="text" width="85%" />
      </div>

      <div class="q-mt-xs">
        <q-skeleton type="text" width="40%" height="30px" class="bg-grey-5" />
      </div>
      <div class="q-mt-xs">
        <q-skeleton type="text" width="60px" />
      </div>
  </div>
</template>

<script>
export default {
name: "AccountNotificationListItemSkeleton"
}
</script>

<style scoped>

</style>
