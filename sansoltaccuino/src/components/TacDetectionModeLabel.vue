<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <span class="tac-detection-mode-label">
    {{ label }}
  </span>
</template>

<script>
import {
  DETECTION_MODE_CODE_MAP,
  DETECTION_MODE_LABEL_MAP
} from "../services/config";

const DEFAULT_MODE = DETECTION_MODE_CODE_MAP.AUT;

export default {
  name: "TacDetectionModeLabel",
  props: {
    code: { type: String, required: false, default: DEFAULT_MODE }
  },
  computed: {
    label() {
      return (
        DETECTION_MODE_LABEL_MAP[this.code] ??
        DETECTION_MODE_LABEL_MAP[DEFAULT_MODE]
      );
    }
  }
};
</script>

<style scoped lang="sass"></style>
