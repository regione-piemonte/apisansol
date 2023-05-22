<!--
 SPDX-License-Identifier: EUPL-1.2
 Copyright Regione Piemonte - 2023
-->

<template>
  <q-btn flat dense :round="$q.screen.lt.md" no-caps icon="help" class="lms-help-button" @click="showMenu">
    <q-tooltip>
      Aiuto
    </q-tooltip>
    <div class="gt-sm q-pl-xs">Aiuto</div>
    <div>
      <q-menu
        :value="isMenuVisible"
        class="lms-help-button__menu"
        @input="updateMenu"
      >
        <q-list class="lms-help-button__menu__list" style="min-width: 120px">
<!--          <q-item clickable @click="$emit('click-contacts')">-->
<!--            <q-item-section>-->
<!--              <q-item-label>-->
<!--                Contatti-->
<!--              </q-item-label>-->
<!--            </q-item-section>-->
<!--          </q-item>-->

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
    </div>

  </q-btn>
</template>

<script>

import {appDetailFaq} from "src/services/urls";

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
    },
    faqUrl(){
      return appDetailFaq()
    }
  }
};
</script>
