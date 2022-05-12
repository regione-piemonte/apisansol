<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-bar
    class="lms-user-mock-bar bg-amber-2 text-black text-body2"
    :class="classes"
  >
    <div>
      Stai simulando l'utenza
      <span class="text-bold">
        {{ mockedLastName }} {{ mockedFirstName }} ({{ mockedTaxCode }})
      </span>
    </div>

    <q-space />

    <q-btn dense flat round icon="close" @click="onRemoveUserMock" />
  </q-bar>
</template>

<script>
import {
  clearUserMockParams,
  getUserMockParams
} from "../services/business-logic";

export default {
  name: "LmsUserMockBar",
  props: {},
  data() {
    return {
      mockedLastName: "",
      mockedFirstName: "",
      mockedTaxCode: ""
    };
  },
  computed: {
    isUserMockActive() {
      return this.mockedTaxCode;
    },
    classes() {
      let result = [];
      if (!this.isUserMockActive) result.push("hidden");
      return result;
    }
  },
  created() {
    let params = getUserMockParams();
    this.mockedLastName = params.lastName ?? "";
    this.mockedFirstName = params.firstName ?? "";
    this.mockedTaxCode = params.taxCode ?? "";
  },
  methods: {
    onRemoveUserMock() {
      clearUserMockParams();
      window.location.reload();
    }
  }
};
</script>

<style lang="sass"></style>
