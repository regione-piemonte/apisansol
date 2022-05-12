<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-page class="home-page-home overflow-hidden" :class="classes">
    <!-- VISUALIZZAZIONE MOBILE -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <template v-if="$q.screen.lt.lg">
      <!-- UTENTE ANONIMO -->
      <!-- --------------------------------------------------------------------------------------------------------- -->
      <template v-if="!user">
        <home-login-widget class="q-pa-md" />
        <home-config-message-list-widget class="q-pa-md" />
        <home-application-list-widget-new class="q-pa-md" />
        <div class="q-py-md" />
        <home-find-a-widget class="q-pa-md" />
        <div class="row reverse">
          <div class="col-12 ">
            <home-support-widget />
          </div>
        </div>
      </template>

      <!-- UTENTE LOGGATO -->
      <!-- --------------------------------------------------------------------------------------------------------- -->
      <template v-else>
        <div class="home-user-widget-container">
          <home-user-widget />
        </div>

        <!-- TABS -->
        <!-- ---- -->
        <q-tabs
          v-model="tab"
          active-color="primary"
          active-bg-color="transparent"
          content-class="home-tabs-mobile"
          class="bg-transparent"
        >
          <q-tab
            :ripple="false"
            :name="TABS.APP_LIST"
            label="Servizi"
            no-caps
          />
          <q-tab
            :ripple="false"
            :name="TABS.MESSAGE_LIST"
            label="Comunicazioni"
            no-caps
          >
            <q-badge
              v-if="areConfigMessage"
              floating
              color="pink-7"
              class="q-pb-xs"
              style="top: 0px; right:-17px"
            >
              <q-icon name="warning" color="white" />
            </q-badge>
            <q-badge
              v-if="!areConfigMessage && messageListUnseenCount > 0"
              floating
              color="pink-7"
              class="q-pb-xs"
              style="top: 0px; right:-17px"
            >
              {{ messageListUnseenCount }}
            </q-badge>
          </q-tab>
          <q-tab :ripple="false" :name="TABS.DOCTOR" label="Medico" no-caps />
          <q-tab
            :ripple="false"
            :name="TABS.DELEGATIONS"
            label="Deleghe"
            no-caps
          />
        </q-tabs>

        <q-tab-panels
          v-model="tab"
          animated
          keep-alive
          :swipeable="$q.platform.is.mobile"
          :infinite="$q.platform.is.mobile"
        >
          <!-- TAB SERVIZI -->
          <!-- ----------- -->
          <q-tab-panel :name="TABS.APP_LIST">
            <home-application-list-widget-new />
            <div class="q-py-md" />
            <home-find-a-widget />
          </q-tab-panel>

          <!-- TAB MESSAGGI -->
          <!-- ------------ -->
          <q-tab-panel :name="TABS.MESSAGE_LIST" class="no-padding">
            <home-message-list-widget
              heading-classes="q-pa-md"
              @click-onboarding-fse="openFseTutorialDialog"
            />
          </q-tab-panel>

          <!-- TAB DOTTORE -->
          <!-- ----------- -->
          <q-tab-panel :name="TABS.DOCTOR">
            <home-doctor-widget />
          </q-tab-panel>

          <!-- TAB DELEGHE -->
          <!-- ----------- -->
          <q-tab-panel :name="TABS.DELEGATIONS">
            <home-delegator-list-widget-select />
          </q-tab-panel>
        </q-tab-panels>

        <home-support-widget />
      </template>
    </template>

    <!-- VISUALIZZAZIONE DESKTOP -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <template v-else>
      <div class="q-px-md q-pt-md" style="max-width: 1440px; margin: auto">
        <!-- UTENTE ANONIMO -->
        <!-- ------------------------------------------------------------------------------------------------------- -->
        <template v-if="!user">
          <div class="row q-col-gutter-xl">
            <!-- COLONNA DI SINISTRA -->
            <!-- ------------------- -->
            <div class="col-12 col-lg-6">
              <home-login-widget />
            </div>

            <!-- COLONNA DESTRA -->
            <!-- -------------- -->
            <div class="col-12 col-lg-6 ">
              <div class="q-py-sm" />
              <home-config-message-list-widget />
              <div class="q-py-md" />
              <home-application-list-widget-new />
              <div class="q-py-xl" />
              <div class="q-py-xl" />
              <home-find-a-widget />
            </div>
          </div>
          <div class="row reverse">
            <div class="col-4">
              <home-support-widget />
            </div>
          </div>
        </template>

        <!-- UTENTE LOGGATO -->
        <!-- ------------------------------------------------------------------------------------------------------- -->
        <template v-else>
          <div class="row q-col-gutter-lg">
            <!-- COLONNA DI SINISTRA -->
            <!-- ------------------- -->
            <div class="col-12 col-lg-4" style="z-index: 1">
              <home-user-widget />
              <div class="q-py-sm" />
              <q-separator />
              <div class="q-py-md" />
              <home-delegator-list-widget-select />
              <div class="q-py-lg" />
              <q-separator />
              <div class="q-py-md" />
              <home-doctor-widget />
            </div>

            <!-- COLONNA CENTRALE -->
            <!-- ---------------- -->
            <div class="col-12 col-lg-4">
              <home-message-list-widget @click-onboarding-fse="openFseTutorialDialog" />
            </div>

            <!-- COLONNA DESTRA -->
            <!-- -------------- -->
            <div class="col-12 col-lg-4">
              <home-application-list-widget-new />
              <div class="q-py-xl" />
              <home-find-a-widget />
              <home-support-widget />
            </div>
          </div>
        </template>
      </div>
    </template>
    <template v-if="user">
      <!--      <home-onboarding-dialog-->
      <!--        :value="showOnboardingDialog"-->
      <!--        @close-onboarding-dialog="closeOnboardingDialog"-->
      <!--        :is-loading="isLoading"-->
      <!--      />-->

      <home-fse-dialog
        :value="showFseDialog"
        @close-fse-dialog="closeFseTutorialDialog"
        :is-loading="isLoading"
      />
    </template>
  </q-page>
</template>

<script>
import HomeUserWidget from "../components/HomeUserWidget";
import HomeDoctorWidget from "../components/HomeDoctorWidget";
import HomeMessageListWidget from "../components/HomeMessageListWidget";
import HomeApplicationListWidgetNew from "../components/HomeApplicationListWidgetNew";
import HomeFindAWidget from "../components/HomeFindAWidget";
import HomeSupportWidget from "../components/HomeSupportWidget";
import HomeLoginWidget from "../components/HomeLoginWidget";
import HomeDelegatorListWidgetSelect from "../components/HomeDelegatorListWidgetSelect";
import HomeOnboardingDialog from "components/HomeOnboardingDialog";
import { setTutorialStatus } from "src/services/api";
import { apiErrorNotify } from "src/services/utils";
import HomeConfigMessageListWidget from "components/HomeConfigMessageListWidget";
import HomeFseDialog from "../components/HomeFseDialog";

const TABS = {
  MESSAGE_LIST: "MESSAGE_LIST",
  APP_LIST: "APP_LIST",
  DOCTOR: "DOCTOR",
  DELEGATIONS: "DELEGATIONS"
};

export default {
  name: "PageHome",
  components: {
    HomeFseDialog,
    HomeConfigMessageListWidget,
    HomeDelegatorListWidgetSelect,
    HomeLoginWidget,
    HomeSupportWidget,
    HomeFindAWidget,
    HomeApplicationListWidgetNew,
    HomeMessageListWidget,
    HomeDoctorWidget,
    HomeUserWidget
  },
  data() {
    return {
      TABS,
      tab: TABS.APP_LIST,
      showOnboardingDialog: false,
      showFseDialog: false,
      isLoading: false,
      isSeenMessages: false
    };
  },
  watch: {
    tab: {
      handler(val, oldVal) {
        if (val === TABS.MESSAGE_LIST && !this.isSeenMessages) {
          this.isSeenMessages = true;
          this.$store.commit("SET_MESSAGE_LIST_UNSEEN_COUNT", {
            messageListUnseenCount: 0
          });
        }
      }
    }
  },
  computed: {
    user() {
      return this.$store.getters["getUser"];
    },
    isTutorialSeen() {
      return this.user?.info?.tutorial_home_visualizzato;
    },
    isTutorialFseSeen() {
      return this.user?.info?.tutorial_fse_visualizzato;
    },
    messageListUnseenCount() {
      return this.$store.getters["getMessageListUnseenCount"];
    },
    classes() {
      let result = [];
      if (!this.user) result.push("home-page-home--anonymous");
      if (this.user) result.push("home-page-home--logged");
      return result;
    },
    areConfigMessage() {
      let messagesList = this.$store.getters["getConfigMessagesActive"];
      return messagesList?.length > 0;
    }
  },
  async created() {
    if (!this.isTutorialSeen) this.showOnboardingDialog = true;
    if (!this.isTutorialFseSeen) this.showFseDialog = true;
    let messagesUnseenPromise = this.$store.dispatch("loadMessageListUnseen");
    try {
      this.loading = true;
      await messagesUnseenPromise;
    } catch (err) {
      console.error(err);
    } finally {
      this.loading = false;
    }
  },
  methods: {
    openFseTutorialDialog(){
      this.showFseDialog = true;
    },
    async closeOnboardingDialog(value) {
      this.isLoading = true;
      try {
        let userID = this.user?.info?.id;
        let payload = {
          tutorial_home_visualizzato: true
        };

        let response = await setTutorialStatus(userID, payload);
        this.$store.dispatch("setUserStatus", response.data);
      } catch (e) {
        // apiErrorNotify({ error, message });
      } finally {
        this.isLoading = false;
        this.showOnboardingDialog = value;
      }
    },
    async closeFseTutorialDialog(value) {
      this.isLoading = true;
      try {
        let userID = this.user?.info?.id;
        let payload = {
          tutorial_fse_visualizzato: true
        };

        let response = await setTutorialStatus(userID, payload);
        this.$store.dispatch("setUserStatus", response.data);
      } catch (e) {
        // apiErrorNotify({ error, message });
      } finally {
        this.isLoading = false;
        this.showFseDialog = value;
      }
    }
  }
};
</script>

<style lang="scss">
.home-page-home {
  background-color: #ffffff !important;
}

@media (min-width: $breakpoint-lg-min) {
  .home-page-home {
    background: url(../../public/blob-alto-sinistra.svg) -200px -200px / 45%
      no-repeat;
  }
}

@media (max-width: $breakpoint-md-max) {
  .home-page-home--logged {
    background-position: -200px -270px;
    background-image: url(../../public/blob-alto-sinistra-mobile.svg);
    background-repeat: no-repeat;
    background-size: auto;
  }
  .home-user-widget-container {
    min-height: 110px;
  }
}

.home-page-home--anonymous {
  @media (min-width: $breakpoint-md-min) {
    & {
      background: url(../../public/dottore.png) right 0px top -20px/300px no-repeat;
    }
  }

  @media (min-width: $breakpoint-lg-min) {
    & {
      background: url(../../public/dottore.png) left 200px top 250px / 30%
          no-repeat,
        url(../../public/onda-utente-anonimo.svg) left -600px top 100px / 100% no-repeat;
    }
  }

  @media (min-width: $breakpoint-xl-min) {
    & {
      background: url(../../public/dottore.png) left 200px top 250px / 30%
          no-repeat,
        url(../../public/onda-utente-anonimo.svg) left -800px top 50px / 100% no-repeat;
    }
  }
}
.home-tabs-mobile {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}
.home-tabs-mobile .q-tab--active .q-tab__label {
  font-weight: 700 !important;
}
//.page-home
//  background-image: url(../statics/blob-alto-sinistra.svg), url(../statics/avatar-assistenza.svg), url(../statics/blob-basso-destra.svg)
//  background-position: -300px -300px, 95% 100%, 280% -500%
//  background-size: 46%, 15%, 80%
//  background-repeat: no-repeat
</style>
