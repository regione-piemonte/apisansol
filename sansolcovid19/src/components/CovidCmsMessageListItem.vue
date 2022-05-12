<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-banner class="covid-cms-message-list-item" rounded :class="classes">
    <div class="text-body1">
      <div v-html="body"></div>
    </div>
  </q-banner>
</template>

<script>
export default {
  name: "CovidCmsMessageListItem",
  props: {
    body: { type: String, required: false, default: "" },
    type: { type: String, required: false, default: "" },
  },
  data() {
    return {};
  },
  computed: {
    cmsMessageList() {
      return this.$store.getters["getCmsMessageList"];
    },
    classes() {
      let result = [];

      if (this.type) {
        result.push(`covid-cms-message-list-item--${this.type}`);
      }

      return result;
    },
  },
  created() {},
  methods: {},
};
</script>

<style lang="scss">
.covid-cms-message-list-item {
  background-color: $blue-2;

  &--avviso {
    background-color: $orange-2;
  }
}
</style>
