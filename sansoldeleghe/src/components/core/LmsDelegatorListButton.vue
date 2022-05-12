<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-btn flat dense no-caps :round="$q.screen.lt.md" icon="people" class="lms-delegator-list-button" @click="showMenu">
    <q-tooltip>
      Deleghe
    </q-tooltip>
    <div class="gt-sm q-pl-xs">Deleghe</div>
    <div>
      <q-menu
        :value="isMenuVisible"
        class="lms-delegator-list-button__menu"
        @input="updateMenu"
      >
        <q-list class="lms-delegator-list-button__list" style="min-width: 160px">
          <q-item dense>
            <q-item-section>
              <q-item-label caption>
                Deleghe
              </q-item-label>
            </q-item-section>
          </q-item>

          <slot />
        </q-list>

        <q-item
          clickable
          class="lms-delegator-list-button__delegation"
          @click="onClickDelegation"
        >
          <q-item-section>
            <q-item-label>
              Gestisci deleghe
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-menu>
    </div>

  </q-btn>
</template>

<script>
export default {
  name: "LmsDelegatorListButton",
  data() {
    return {
      isMenuVisible: false
    };
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
    onClickDelegation() {
      let eventName = "click-delegation";
      let url = "/la-mia-salute/deleghe/#/";

      if (eventName in this.$listeners) return this.$emit(eventName, url);

      window.location.assign(url);
    }
  }
};
</script>

<style lang="sass">
.lms-delegator-list-button__menu
  min-width: 180px
  max-height: 80%

.lms-delegator-list-button__list
  padding: 0

.lms-delegator-list-button__delegation
  background-color: $grey-3
</style>
