<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div
    class="lms-card-item-primary no-margin bg-grey-3 q-py-md"
    :class="{
      'row q-col-gutter-x-md items-center': $q.screen.lt.sm,
      'q-col-gutter-y-md full-height': $q.screen.gt.xs
    }"
  >
    <slot>
      <div class="col-auto" :class="{ 'text-center': $q.screen.gt.xs }">
        <slot name="icon" />
      </div>

      <div class="col-auto" :class="{ 'text-center': $q.screen.gt.xs }">
        <slot name="text" />
      </div>
    </slot>
  </div>
</template>

<script>
export default {
  name: "LmsCardItemPrimary",
  data() {
    return {};
  }
};
</script>

<style lang="sass"></style>
