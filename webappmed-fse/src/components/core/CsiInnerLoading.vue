<!--
 SPDX-License-Identifier: EUPL-1.2
 Copyright Regione Piemonte - 2023
-->

<template>
  <!-- Nel caso in cui vogliamo che lo spinner occupi del contenuto -->
  <div v-if="block" class="csi-inner-loading">
    <div v-show="$attrs.showing" class="q-pa-lg text-center">
      <slot>
        <q-spinner color="primary" size="48px" :thickness="3" />
      </slot>
    </div>
  </div>

  <!-- Nel caso in cui vogliamo che lo spinner vada in overlay -->
  <q-inner-loading
    v-else
    v-bind="$attrs"
    class="csi-inner-loading"
    :class="classes"
  >
    <slot>
      <q-spinner color="primary" size="48px" :thickness="3" />
    </slot>
  </q-inner-loading>
</template>

<script>
export default {
  name: "CsiInnerLoading",
  props: {
    block: { type: Boolean, required: false, default: false },
    hasBg: { type: Boolean, required: false, default: false }
  },
  data() {
    return {};
  },
  computed: {
    classes() {
      return {
        "bg-transparent": !this.hasBg
      };
    }
  },
  created() {},
  methods: {}
};
</script>
