<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="lms-banner row q-col-gutter-y-md" :class="classes">
    <!-- IMMAGINE -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <div class="col-12 col-md col-lg-5 q-px-lg">
      <slot name="image">
        <img :src="imageSrc" :alt="imageAlt">
      </slot>
    </div>

    <!-- TESTO -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <div class="col-12 col-md q-gutter-y-sm">


        <slot name="text"></slot>

      <!-- AZIONI -->
      <!-- ----------------------------------------------------------------------------------------------------------- -->
      <slot name="actions">
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "LmsBanner",
  props: {
    imageSrc: {type: String, required: true},
    imageAlt: {type: String, required: false, default: 'Immagine banner'},
  },
  data() {
    return {
      showMore: false
    };
  },
  computed: {
    autoShowMore() {
      return this.$q.screen.gt.md;
    },
    classes() {
      return {
        "lms-enrollment-banner--showing-more":
          this.autoShowMore || this.showMore
      };
    }
  }
};
</script>

<style lang="sass">
</style>
