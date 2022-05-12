<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="covid-cms-message-list q-pa-md q-px-xl q-gutter-y-md">
    <covid-cms-message-list-item
      v-for="mex in cmsMessageList"
      :key="mex.title"
      :body="mex.body"
      :type="mex.tipo_di_messaggio && mex.tipo_di_messaggio.name"
    />
  </div>
</template>

<script>
import CovidCmsMessageListItem from "./CovidCmsMessageListItem";
export default {
  name: "CovidCmsMessageList",
  components: { CovidCmsMessageListItem },
  props: {},
  data() {
    return {};
  },
  computed: {
    cmsMessageList() {
      return this.$store.getters["getCmsMessageList"];
    },
  },
  created() {},
  methods: {},
};
</script>

<style lang="scss">
.covid-cms-message-list {
  @media (min-width: $breakpoint-sm) {
    max-width: $breakpoint-sm;
    margin: auto;
  }

  @media (min-width: $breakpoint-md) {
    max-width: $breakpoint-md;
    margin: auto;
  }
}
</style>
