<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-layout view="hHh lpr fff" class="lms-layout-app">
    <template v-if="delegatorSelected">
      <lms-layout-delegator-toolbar
        :first-name="delegatorSelected.nome_delega"
        :last-name="delegatorSelected.cognome_delega"
        @close="onDelegatorUnselected"
      />
    </template>


    <!-- PAGINE -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <q-page-container>
      <template v-if="isUserMinor">
        <lms-page padding style="min-height: 0px">
          <q-banner class="bg-orange-2 fse-message-list-item q-mt-lg" rounded>
            <p class="text-body1 q-mb-none">
              È stata utilizzata una credenziale associata ad una cittadina/o minorenne. Per accedere al servizio
              entrambi i genitori devono dichiarare la propria responsabilità genitoriale attraverso il servizio
              Deleghe ed accedere come delegati per conto del proprio figlio minorenne.
            </p>
          </q-banner>
        </lms-page>

      </template>
      <template v-else>
        <router-view />
      </template>

    </q-page-container>

  </q-layout>
</template>

<script>
import {
  getNotifyMessages,
  getNotifyMessagesUnseen,
  updateMessagesAsSeen,
  deleteMessage
} from "src/services/api";
import {CONVERSATION_LIST, HELP_CONTACTS, SERVICE_RATING} from "src/router/routes";
import LmsLayoutAppToolbar from "src/components/core/LmsLayoutAppToolbar";
import LmsLayoutDelegatorToolbar from "src/components/core/LmsLayoutDelegatorToolbar";
import LmsLayoutFooter from "src/components/core/LmsLayoutFooter";
import LmsLayoutHeader from "src/components/core/LmsLayoutHeader";
import LmsLayoutHeaderProfileButton from "src/components/core/LmsLayoutHeaderProfileButton";
import LmsLayoutHeaderLoginButton from "src/components/core/LmsLayoutHeaderLoginButton";
import LmsLayoutHeaderNotificationButton from "src/components/core/LmsLayoutHeaderNotificationButton";
import LmsHelpButton from "src/components/core/LmsHelpButton";
import LmsDelegatorListButton from "src/components/core/LmsDelegatorListButton";
import LmsMenuListItem from "src/components/core/LmsMenuListItem";
import LmsNotificationListItem from "src/components/core/LmsNotificationListItem";
import { apiErrorNotifyDialog } from "src/services/utils";
import {appAssistanceForm, appAssistanceTree, appDetailFaq} from "../services/urls";
import TheGuardEnrollment2 from "components/TheGuardEnrollment2";

export default {
  name: "LayoutConversationDetail",
  components: {
    LmsLayoutDelegatorToolbar,
  },
  data() {
    return {
    };
  },
  created() {

    if(!this.$route.name)
      this.$router.push(CONVERSATION_LIST)
  },
  computed: {

    delegatorSelected() {
      return this.$store.getters["getDelegatorSelected"];
    },
    isUserMinor() {
      return this.$store.getters["isUserMinor"];
    },

  },

  methods: {
    onDelegatorUnselected() {
      let url = new URL(window.location.origin + window.location.pathname);
      window.location.assign(url.origin + url.pathname);

      // let delegatorSelected = null;
      // this.$store.dispatch("setDelegatorSelected", { delegatorSelected });
    }
  }
};
</script>

<style lang="sass">

</style>
