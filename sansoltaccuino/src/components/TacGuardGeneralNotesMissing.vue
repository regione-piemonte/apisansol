<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="tac-guard-general-note-missing">
    <template v-if="!missing">
      <slot />
    </template>

    <template v-else>
      Taccuino delle rilevazioni
    </template>
  </div>
</template>

<script>
export default {
  name: "TacGuardGeneralNotesMissing",
  props: {},
  data() {
    return {
      missing: false
    };
  },
  computed: {},
  created() {},
  methods: {}
};
</script>

<style scoped lang="sass"></style>
