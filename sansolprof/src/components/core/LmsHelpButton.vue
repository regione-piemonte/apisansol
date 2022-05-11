<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-btn flat dense round icon="help" class="lms-help-button">
    <q-menu
      :value="isMenuVisible"
      class="lms-help-button__menu"
      @input="updateMenu"
    >
      <q-list class="lms-help-button__menu__list" style="min-width: 120px">
        <q-item clickable @click="$emit('click-contacts')">
          <q-item-section>
            <q-item-label>
              Contatti
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable @click="$emit('click-faq')">
          <q-item-section>
            <q-item-label>
              FAQ
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-if="isAssistance" clickable @click="$emit('click-assistance')">
          <q-item-section>
            <q-item-label>
              Assistenza
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>

<script>
export default {
  name: "LmsHelpButton",
  data() {
    return {
      isMenuVisible: false
    };
  },
  computed: {
    workingApp() {
      return this.$store.getters["getWorkingApp"];
    },
    isAssistance(){
      return this.workingApp?.albero_aiuti_visibile
    }
  },
  methods: {
    showMenu() {
      this.isMenuVisible = true;
    },
    hideMenu() {
      this.isMenuVisible = false;
    },
    updateMenu(val) {
      this.isMenuVisible = val;
    }
  }
};
</script>
