<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div>
    <a href="#" class="lms-link" @click.prevent="showCunDialog"> Cos'è? </a>

    <covid-cun-info-dialog v-model="isCunDialogVisible" />
  </div>
</template>

<script>
import CovidCunInfoDialog from "./CovidCunInfoDialog";

export default {
  name: "CovidCunLink",
  components: { CovidCunInfoDialog },
  props: {},
  data() {
    return {
      isCunDialogVisible: false,
    };
  },
  computed: {},
  created() {},
  methods: {
    showCunDialog() {
      this.isCunDialogVisible = true;
    },
  },
};
</script>

<style scoped lang="scss"></style>
