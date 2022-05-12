<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-layout view="hHh lpr fff" class="lms-layout-app">
    <!-- HEADER -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <lms-layout-header menu @click-menu="toggleMenu">
      <template #right>
        <template v-if="!user">
          <lms-layout-header-login-button />
        </template>

        <template v-else>
          <lms-layout-header-profile-button
            :name="user.nome"
            :surname="user.cognome"
            :tax-code="user.cf"
          />
        </template>
      </template>
    </lms-layout-header>

    <!-- MENU -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <q-drawer
      v-model="isMenuVisible"
      overlay
      behavior="mobile"
      class="lms-menu-drawer"
    >
      <q-scroll-area class="fit">
        <q-list class="lms-menu-list">
          <div class="q-pa-md">
            <q-img
              class="lms-menu-list__logo"
              contain
              basic
              src="/statics/la-mia-salute/immagini/logo-la-mia-salute-blu.svg"
              alt="La mia salute"
            />
          </div>

          <lms-menu-list-item
            v-for="item in appListVisible"
            :key="item.url"
            :menu-list="item.menu"
            :href="item.url"
            :title="item.descrizione"
            :icon="item.icona_url"
            :locked="!item.pubblico && !user"
            :active="isActive(item)"
          />
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <!-- PAGINE -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- FOOTER -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <lms-layout-footer />
  </q-layout>
</template>

<script>
import LmsLayoutFooter from "src/components/core/LmsLayoutFooter";
import LmsLayoutHeader from "src/components/core/LmsLayoutHeader";
import LmsLayoutHeaderProfileButton from "src/components/core/LmsLayoutHeaderProfileButton";
import LmsLayoutHeaderLoginButton from "src/components/core/LmsLayoutHeaderLoginButton";
import LmsMenuListItem from "../components/core/LmsMenuListItem";

export default {
  name: "LayoutApp",
  components: {
    LmsMenuListItem,
    LmsLayoutFooter,
    LmsLayoutHeaderLoginButton,
    LmsLayoutHeaderProfileButton,
    LmsLayoutHeader
  },
  data() {
    return {
      isMenuVisible: false,
      areNotificationsVisible: false,
      messageList: [],
      messageUnseenList: []
    };
  },
  computed: {
    user() {
      return this.$store.getters["getUser"];
    },
    appList() {
      return this.$store.getters["getAppList"];
    },
    workingApp() {
      return this.$store.getters["getWorkingApp"];
    },
    notifyContacts() {
      return this.$store.getters["getNotifyContacts"];
    },
    appListVisible() {
      let isMobile = this.$q.platform.is.mobile;

      let result = this.appList.filter(a => {
        if (isMobile) return a.visibile_menu_mobile;
        return a.visibile_menu_desktop;
      });

      return result;
    }
  },
  async created() {},
  methods: {
    toggleMenu() {
      this.isMenuVisible = !this.isMenuVisible;
    },
    isActive(app) {
      return app.codice === this.workingApp?.codice;
    }
  }
};
</script>

<style lang="sass"></style>
