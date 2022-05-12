<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-btn
    round
    @click="showMenu"
    aria-label="Profilo"
    flat
    :ripple="false"
    unelevated
  >
    <q-avatar class="lms-layout-header-profile-button">
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

          <template v-if="isOtp">
            <q-item clickable @click="onClickLoginWithOtpEnabled">
              <q-item-section>
                <q-item-label>
                  Autenticati con credenziali abilitate per utilizzare tutti i
                  servizi
                </q-item-label>
              </q-item-section>
            </q-item>
          </template>

          <template v-if="!isOtp">
            <q-item clickable @click="onClickProfile">
              <q-item-section side>
                <q-icon :name="iconProfile" />
              </q-item-section>

              <q-item-section>
                <q-item-label>Profilo</q-item-label>
              </q-item-section>
            </q-item>
          </template>

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
import {login} from "../../services/utils";

export default {
  name: "LmsLayoutHeaderProfileButton",
  props: {
    name: { type: String, required: false, default: "" },
    surname: { type: String, required: false, default: "" },
    taxCode: { type: String, required: false, default: "" },
    iconProfile: { type: String, required: false, default: "person" },
    iconLogout: { type: String, required: false, default: "exit_to_app" },
    isOtp: { type: Boolean, required: false, default: false },
  },
  data() {
    return {
      isMenuVisible: false,
    };
  },
  computed: {
    avatarText() {
      let n = this.name ? this.name.charAt(0) : "";
      let c = this.surname ? this.surname.charAt(0) : "";
      let result = `${n}${c}`;
      return result.trim();
    },
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
    },
    onClickLogout() {
      this.hideMenu();
      let eventName = "click-logout";
      let url = "/api/bff/logout";

      if (eventName in this.$listeners) return this.$emit(eventName, url);

      if (this.isOtp) {
        this.$store.dispatch("closeOtpSession");
        // Dopo il logout con OTP ricarichiamo la pagina per far scattare
        // nuovamente il bootstrap
        let url = new URL(window.location.origin + window.location.pathname);
        window.location.assign(url.origin + url.pathname);
      } else {
        window.location.assign(url);
      }
    },
    onClickLoginWithOtpEnabled(){
      this.$store.dispatch("closeOtpSession");
      login("/api/bff/login");
    }
  },
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
