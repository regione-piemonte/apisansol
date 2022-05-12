<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-banner rounded class="bg-orange-2 fse-message-list-item">
    <p class="text-body1 q-mb-none">
      {{ message }}
    </p>
  </q-banner>
</template>

<script>
export default {
  name: "FseMessageListItem",
  props: {
    message: { type: Object, required: false, default: () => null }
  },
  data() {
    return {};
  },
  computed: {},
  created() {},
  methods: {}
};
</script>

<style scoped lang="sass"></style>
