<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="csi-card-item row">

    <div class="col-12" v-if="$q.screen.lt.sm">
      <slot name="header"></slot>
    </div>

    <div class="col-12 col-sm-3">
      <slot name="primary"></slot>
    </div>

    <div class="col-12 col-sm-9 column">
      <div v-if="$q.screen.gt.xs">
        <slot name="header"></slot>
      </div>

      <div>
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
    name: "CsiCardItem",
    // props: {},
    // render(h) {
    //
    //   let header = h(
    //     'div',
    //     {staticClass: 'col-12'},
    //     [this.$slots.header]
    //   );
    //
    //   let primary = h(
    //     'div',
    //     {
    //       staticClass: 'col-12 col-sm-3',
    //     },
    //     [this.$slots.primary]
    //   );
    //
    //   let secondary = h(
    //     'div',
    //     {staticClass: 'col-12 col-sm-9'},
    //     [
    //       this.$q.screen.gt.xs ? header : '',
    //       this.$slots.secondary
    //     ]
    //   );
    //
    //   return h(
    //     'div',
    //     {staticClass: 'row'},
    //     [
    //       this.$q.screen.lt.sm ? header : '',
    //       primary,
    //       secondary
    //     ]
    //   );
    // }
  }
</script>


<style lang="stylus">

</style>
