<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<style scoped lang="stylus"></style>


<template>
  <div>

    <div class="column">
      <slot name="icon"></slot>
      <slot name="label"></slot>
    </div>

  </div>
</template>


<script>
  export default {
    name: 'CsiIconWithLabel',
    data() {
      return {}
    }
  }
</script>
