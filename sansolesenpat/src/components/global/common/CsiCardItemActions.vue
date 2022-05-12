<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<style scoped></style>


<template>
  <div class="row text-right q-pa-md gutter-sm"
       :class="{'reverse': $q.screen.gt.xs}">
    <slot></slot>
  </div>
</template>


<script>
  export default {
    name: "CsiCardItemActions"
  }
</script>
