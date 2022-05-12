<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-select
    :value="value"
    :options="detectionModeListSorted"
    option-value="codice"
    option-label="descrizione_regionale"
    emit-value
    map-options
    label="Modalità di rilevazione"
    required
    :loading="isLoading"
    @input="$emit('input', $event)"
  />
</template>

<script>
  import {apiErrorNotify, apiErrorNotifyDialog} from "../services/utils";
import { getDetectionModeList } from "../services/api";

export default {
  name: "TacDetectionModeSelect",
  props: {
    value: { type: String, required: false, default: null }
  },
  data() {
    return {
      isLoading: false,
      detectionModeList: []
    };
  },
  computed: {
    detectionModeListSorted() {
      return this.detectionModeList;
    }
  },
  created() {
    this.loadDetectionModeList();
  },
  methods: {
    async loadDetectionModeList() {
      this.isLoading = true;

      try {
        let { data } = await getDetectionModeList();
        this.detectionModeList = data;
      } catch (err) {
        let message =
          "Non è stato possibile caricare l'elenco delle modalità di rilevazione";
        apiErrorNotifyDialog({ err, message });
      }

      this.isLoading = false;
    }
  }
};
</script>

<style scoped lang="sass"></style>
