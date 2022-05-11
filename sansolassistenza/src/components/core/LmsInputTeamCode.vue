<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-input v-bind="attrs" v-on="listeners" class="csi-input-team-code" :required="isRequired" >
    <template #hint>
      <a href="#" class="lms-link" @click.prevent="showTeamInfoModal">
        Come trovo il numero della tessera sanitaria?
      </a>

      <!-- DOVE TROVO CODICE TEAM -->
      <!-- ----------------------------------------------------------------------------------------------------------- -->
      <q-dialog v-model="isTeamInfoModalVisible" :maximized="$q.screen.lt.sm">
        <q-card footer-class="shadow-0" header-class="no-shadow">
          <q-toolbar color="transparent" text-color="black">
            <q-toolbar-title>
              Come trovo il numero della tessera sanitaria?
            </q-toolbar-title>
            <q-btn v-close-popup round flat icon="close" />
          </q-toolbar>

          <div class="q-mt-lg q-pa-md text-center">
            <img
              src="images/team-dove-trovarlo.jpg"
              alt="Numero tessera sanitaria"
              class="responsive"
            />
          </div>
        </q-card>
      </q-dialog>
    </template>
  </q-input>
</template>

<script>


import {TEAM_LENGTH, TEAM_MASK} from "src/services/tax-code";

export default {
  name: "LmsInputTeamCode",
  inheritAttrs: false,
  props: {
    isRequired:{ type: Boolean, required: false, default: false }
  },
  data() {
    return {
      isTeamInfoModalVisible: false
    };
  },
  computed: {
    defaultRules() {
      if(this.isRequired){
        return [
          v => this.$rules.required(v) || "Campo obbligatorio",
          v =>
            !v ||  this.$rules.length(v, TEAM_LENGTH) ||
              `Deve essere di ${TEAM_LENGTH} caratteri`
        ];
      }else{
        return [
          v =>
            !v ||  this.$rules.length(v, TEAM_LENGTH) ||
              `Deve essere di ${TEAM_LENGTH} caratteri`
        ];
      }

    },
    attrs() {
      const { ...attrs } = this.$attrs;

      if (!("type" in attrs)) attrs.type = "text";
      if (!("label" in attrs)) attrs.label = "Numero tessera sanitaria";
      if (!("name" in attrs)) attrs.name = "team";
      if (!("autocomplete" in attrs)) attrs.autocomplete = "on";
      if (!("noErrorIcon" in attrs)) attrs.noErrorIcon = true;
      if (!("counter" in attrs)) attrs.counter = true;
      attrs.maxlength = TEAM_LENGTH;
      attrs.mask = TEAM_MASK;
      attrs.unmaskedValue = true;

      attrs.rules = attrs.rules || [];
      attrs.rules = [attrs.rules, ...this.defaultRules];

      return attrs;
    },
    listeners() {
      const { ...listeners } = this.$listeners;
      return listeners;
    }
  },
  created() {},
  methods: {
    showTeamInfoModal() {
      this.isTeamInfoModalVisible = true;
    }
  }
};
</script>

<style scoped lang="sass"></style>
