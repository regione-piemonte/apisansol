<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="help-message">
      {{ label }}
  </div>
</template>

<script>


export default {
  name: "HelpMessage",
  components: { },
  props: {
      message: {
          type: Object,
          required: false,
          default: () => null
      }
  },
  data() {
    return {

    };
  },
  computed: {
      label() {
          return this.message?.testo
      },
  }
};
</script>

<style scoped></style>
