<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-banner class="q-my-md bg-blue-2" rounded>
    <div class="row q-col-gutter-md items-center">
      <div class="col-auto">
        <q-icon name="fas fa-info-circle" size="md" />
      </div>

      <div class="col text-body1">
        Non hai nessun referto da pagare e/o ritirare
      </div>
    </div>
  </q-banner>
</template>

<script>
export default {
  name: "FseRolListEmptyBanner",
  props: {},
  data() {
    return {};
  },
  computed: {},
  created() {},
  methods: {}
};
</script>

<style scoped lang="sass"></style>
