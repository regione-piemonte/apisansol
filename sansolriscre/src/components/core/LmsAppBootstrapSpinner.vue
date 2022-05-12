<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="lms-app-bootstrap-spinner">
    <transition appear enter-active-class="animated fadeInDown">
      <img
        src="/statics/la-mia-salute/immagini/bootstrap-logo.svg"
        alt="Icona Salute Piemonte"
        class="lms-app-bootstrap-spinner__image responsive"
      />
    </transition>

    <transition appear enter-active-class="animated fadeInUp">
      <q-spinner-dots
        class="lms-app-bootstrap-spinner__spinner"
      />
    </transition>
  </div>
</template>

<script>
export default {
  name: "LmsAppBootstrapSpinner"
};
</script>

<style lang="sass">
.lms-app-bootstrap-spinner__image
  animation-duration: 2.5s
  display: block
  margin: auto
  width: 204px !important

.lms-app-bootstrap-spinner__spinner
  animation-duration: 2s
  animation-delay: .5s
  display: block
  margin: 8px auto
  color: $lms-text-faded-color
  font-size: 50px
</style>
