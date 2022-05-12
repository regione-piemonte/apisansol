<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<style scoped></style>


<template>
  <div class="no-margin bg-grey-3 q-py-md" :class="{
      'row gutter-x-xs items-center': $q.screen.lt.sm,
      'full-height gutter-y-sm': $q.screen.gt.xs,
    }">

    <slot>
      <div class="col-auto" :class="{'text-center': $q.screen.gt.xs,}">
        <slot name="icon"></slot>
      </div>

      <div class="col-auto" :class="{'text-center': $q.screen.gt.xs,}">
        <slot name="text"></slot>
      </div>
    </slot>
  </div>
</template>


<script>
  export default {
    name: "CsiCardItemPrimary",
  }
</script>
