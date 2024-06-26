<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-btn round @click="showMenu" aria-label="Profilo" flat :ripple="false" unelevated>
  <q-avatar class="lms-layout-header-profile-button" >
    <div class="lms-layout-header-profile-button__text">
      <slot>{{ avatarText }}</slot>
    </div>

    <q-menu
      :value="isMenuVisible"
      class="lms-layout-header-profile-button__menu"
      @input="updateMenu"
    >
      <q-list style="min-width: 160px">
        <q-item>
          <q-item-section>
            <q-item-label> {{ name }} {{ surname }} </q-item-label>
            <q-item-label caption> {{ taxCode | empty }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable @click="onClickProfile">
          <q-item-section side>
            <q-icon :name="iconProfile" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Profilo</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable @click="onClickLogout">
          <q-item-section side>
            <q-icon :name="iconLogout" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Esci</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-avatar>
  </q-btn>
</template>

<script>
export default {
  name: "LmsLayoutHeaderProfileButton",
  props: {
    name: { type: String, required: false, default: "" },
    surname: { type: String, required: false, default: "" },
    taxCode: { type: String, required: false, default: "" },
    iconProfile: { type: String, required: false, default: "person" },
    iconLogout: { type: String, required: false, default: "exit_to_app" }
  },
  data() {
    return {
      isMenuVisible: false
    };
  },
  computed: {
    avatarText() {
      let n = this.name ? this.name.charAt(0) : "";
      let c = this.surname ? this.surname.charAt(0) : "";
      let result = `${n}${c}`;
      return result.trim();
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
    onClickProfile() {
      this.hideMenu();
      let eventName = "click-profile";
      let url = "/la-mia-salute/profilo-utente/#/";

      if (eventName in this.$listeners) return this.$emit(eventName, url);

      window.location.assign(url);

      this.$emit("click-logout");
    },
    onClickLogout() {
      this.hideMenu();
      let eventName = "click-logout";
      // let url = "/api/bff/logout";
      let url = "/la-mia-salute/logout.html";

      if (eventName in this.$listeners) return this.$emit(eventName, url);

      window.location.assign(url);
    }
  }
};
</script>

<style lang="sass">
.lms-layout-header-profile-button
  background-color: $accent
  cursor: pointer

.lms-layout-header-profile-button
  font-size: 32px !important

.lms-layout-header-profile-button__text
  text-transform: uppercase
  font-size: 14px
</style>
