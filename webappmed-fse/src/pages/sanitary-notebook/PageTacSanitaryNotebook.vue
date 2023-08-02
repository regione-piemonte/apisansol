<!--
 SPDX-License-Identifier: EUPL-1.2
 Copyright Regione Piemonte - 2023
-->

<template>
  <router-view />
</template>

<script>
export default {
  name: "PageTacSanitaryNotebook",
};
</script>

<style lang="sass">
@media (min-width: $breakpoint-md)
  .csi-page--tac
    max-width: $breakpoint-md


@media (min-width: $breakpoint-lg)
  .csi-page--tac
    max-width: $breakpoint-lg-min
</style>
