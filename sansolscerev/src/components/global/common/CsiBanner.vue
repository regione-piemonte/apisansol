<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<style scoped></style>


<template>
  <div class="row gutter-y-sm">

    <!-- IMMAGINE -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <div class="col-12 col-sm col-lg-5 q-px-lg">
      <slot name="image">
        <img :src="imageSrc" :alt="imageAlt">
      </slot>
    </div>

    <!-- TESTO -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <div class="col-s12 col-sm">
      <slot name="text"></slot>
    </div>
  </div>
</template>


<script>
  export default {
    name: "CsiBanner",
    props: {
      imageSrc: {type: String, required: true},
      imageAlt: {type: String, required: false, default: 'Immagine banner'},
    }
  }
</script>
