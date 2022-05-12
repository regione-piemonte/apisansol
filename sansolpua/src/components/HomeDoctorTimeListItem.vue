<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <span>
    {{ label }}
  </span>
</template>

<script>
export default {
  name: "HomeDoctorTimeListItem",
  props: {
    time: { type: Object, required: false, default: null }
  },
  data() {
    return {};
  },
  computed: {
    label() {
      let intervalList = this.time?.intervalli ?? [];
      let result = intervalList.map(i => `${i.apertura} - ${i.chiusura}`);
      return result.join(" e ");
    }
  },
  created() {},
  methods: {}
};
</script>

<style scoped lang="sass"></style>
