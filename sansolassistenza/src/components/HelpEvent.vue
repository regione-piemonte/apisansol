<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="help-event">
      {{ label }}
  </div>
</template>

<script>


export default {
  name: "HelpEvent",
  components: { },
  props: {
      event: {
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
          return this.event?.stato?.descrizione
      },
  }
};
</script>

<style scoped></style>
