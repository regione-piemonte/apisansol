<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="lms-card-item row">
    <div v-if="$q.screen.lt.sm" class="col-12">
      <slot name="header"></slot>
    </div>

    <div class="col-12 col-sm-3">
      <slot name="primary"></slot>
    </div>

    <div class="col-12 col-sm-9" >
      <div v-if="$q.screen.gt.xs">
        <slot name="header"></slot>
      </div>

      <div :class="{'full-height' : noActions}">
        <slot name="secondary"></slot>
      </div>

      <!-- Spacer -->
      <!--<div class="col"></div>-->

      <div>
        <slot name="actions"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LmsCardItem",
  data() {
    return {};
  },
  props:{
    noActions:{type:Boolean, default:false}
  }
};
</script>

<style lang="sass"></style>
