<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-layout class="lms-layout-app" view="hHh lpr fff">
    <!-- HEADER -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <lms-layout-header menu @click-menu="toggleMenu">
      <template #right>
        <template v-if="!user">
          <lms-layout-header-login-button/>
        </template>

        <template v-else>
          <lms-layout-header-notification-button
            :unseen-count="messageUnseenList.length"
            class="q-mr-sm"
            @click="toggleNotifications"
          />

          <lms-layout-header-profile-button
            :name="user.nome"
            :surname="user.cognome"
            :tax-code="user.cf"
          />
        </template>
      </template>

      <!-- TOOLBAR DEL VERTICALE -->
      <!-- --------------------------------------------------------------------------------------------------------- -->
      <template #after>
        <lms-layout-app-toolbar>
          <div class="q-ml-sm" style="font-size: 18px">
            {{ workingAppName | empty }}
          </div>

          <template #right>
            <div :class="$q.screen.lt.md ? 'q-gutter-x-sm' : 'q-gutter-x-md'" class="row justify-end">
              <lms-help-button
                @click-contacts="goToHelpContacts"
                @click-faq="goToHelpFaq"
                @click-assistance="goToAssistance"
              />

              <!-- Mostriamo l'elenco dei deleganti SOLO se l'app è delegabile -->
              <template v-if="user && isWorkingAppDelegable">
                <lms-delegator-list-button>
                  <template v-if="delegatorListError">
                    <q-item class="lms-delegator-list-item">
                      <q-item-section>
                        <q-item-label>
                          Siamo spiacenti, al momento non è possibile recuperare
                          informazioni sulle deleghe
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                  <template v-else>
                    <template v-if="!workingAppDelegatorList.length">
                      <q-item class="lms-delegator-list-item">
                        <q-item-section>
                          <q-item-label>
                            Non hai ancora deleghe a tuo nome.
                          </q-item-label>
                        </q-item-section>
                      </q-item>
                    </template>
                    <q-item
                      v-for="delegator in workingAppDelegatorList"
                      :key="delegator.uuid"
                      class="lms-delegator-list-item"
                      clickable
                      @click="onDelegatorSelected(delegator)"
                    >
                      <q-item-section>
                        <q-item-label>
                          {{ delegator.cognome_delega }}
                          {{ delegator.nome_delega }}
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                </lms-delegator-list-button>
              </template>
            </div>
          </template>
        </lms-layout-app-toolbar>

        <!-- DELEGA ATTIVA -->
        <!-- ------------------------------------------------------------------------------------------------------- -->
        <template v-if="delegatorSelected">
          <lms-layout-delegator-toolbar
            :first-name="delegatorSelected.nome_delega"
            :last-name="delegatorSelected.cognome_delega"
            @close="onDelegatorUnselected"
          />
        </template>
      </template>
    </lms-layout-header>

    <!-- MENU -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <q-drawer
      v-model="isMenuVisible"
      behavior="mobile"
      class="lms-menu-drawer"
      overlay
    >
      <q-scroll-area class="fit">
        <q-list class="lms-menu-list">
          <div class="q-pa-md">
            <q-img
              alt="Salute Piemonte"
              basic
              class="lms-menu-list__logo"
              contain
              src="/statics/la-mia-salute/immagini/logo-la-mia-salute-blu.svg"
            />
          </div>

          <lms-menu-list-item
            v-for="item in appList"
            :key="item.url"
            :active="isActive(item)"
            :href="item.url"
            :icon="item.icona_url"
            :locked="!item.pubblico && !user"
            :menu-list="item.menu"
            :title="item.descrizione"
          />
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <!-- LISTA NOTIFICHE -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <q-drawer
      v-model="areNotificationsVisible"
      behavior="mobile"
      class="lms-notification-drawer"
      overlay
      side="right"
    >
      <q-scroll-area class="fit">
        <q-list class="lms-notification-list">
          <!-- HEADER -->
          <!-- ------ -->
          <slot name="header">
            <q-item class="lms-notification-list__header">
              <q-item-section>
                <q-item-label class="text-subtitle2 text-weight-bold">
                  Notifiche
                </q-item-label>
              </q-item-section>
              <q-item-section avatar>
                <q-btn
                  color="primary"
                  dense
                  flat
                  icon="settings"
                  round
                  @click="onClickSettings"
                />
              </q-item-section>
            </q-item>
          </slot>
          <q-separator/>

          <!-- LISTA -->
          <!-- ----- -->
          <div class="lms-notification-list__body">
            <!-- PROFILO NON ATTIVO SU NOTIFICATORE -->
            <!-- ---------------------------------- -->
            <template v-if="!notifyContacts">
              <q-item
                class="lms-notification-list-item-contacts-activation"
                clickable
                @click="onNotificationActivate"
              >
                <q-item-section>
                  <q-item-label class="text-body1">
                    <slot name="text">
                      Attiva le notifiche via email, SMS e push
                    </slot>
                  </q-item-label>
                  <q-item-label class="text-body-2 text-grey-8">
                    <slot name="caption">
                      Clicca qui per inserire i contatti nel tuo profilo
                      personale ed attivare il servizio di notifiche.
                    </slot>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </template>

            <!-- NO MESSAGGI -->
            <!-- ----------- -->
            <template v-if="!messageList.length">
              <div class="lms-notification-list-empty">
                <slot>Nessun messaggio ricevuto</slot>
              </div>
            </template>

            <!-- ELENCO NOTIFICHE -->
            <!-- ---------------- -->
            <lms-notification-list-item
              v-for="notification in messageList"
              :id="notification.id"
              :key="notification.id"
              :datetime="notification.timestamp"
              :read="!!notification.read_at"
              :sender="notification.sender"
              :title="notification.mex.title"
              clickable
              removable
              @remove="onNotificationRemove(notification)"
            >
              <span class="pre-line text-wrap-word">{{
                  notification.mex.body
                }}</span>
            </lms-notification-list-item>
          </div>

          <slot name="footer">
            <template v-if="messageList.length > 0">
              <div class="lms-notification-list__footer q-pa-md text-center">
                <lms-button @click="onClickShowAll">Vedi tutte</lms-button>
              </div>
            </template>
          </slot>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <!-- PAGINE -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <q-page-container>
      <template v-if="isUserMinor">
        <lms-page padding style="min-height: 0px">
          <q-banner class="bg-orange-2 q-mt-lg" rounded>
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

    <!-- FOOTER -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <lms-layout-footer
      help-assistance
      help-faq
      rating
      @click-help-contacts="goToHelpContacts"
      @click-help-faq="goToHelpFaq"
      @click-rating="goToRatingPage"
      @click-help-assistance="goToAssistance"
    />
  </q-layout>
</template>

<script>
import {
  getNotifyMessages,
  getNotifyMessagesUnseen,
  updateMessagesAsSeen,
  deleteMessage
} from "src/services/api";
import {HELP_CONTACTS, SERVICE_RATING} from "src/router/routes";
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
import {apiErrorNotify} from "src/services/utils";
import {appAssistanceForm, appAssistanceTree, appDetailFaq} from "src/services/urls";

export default {
  name: "LayoutApp",
  components: {
    LmsLayoutFooter,
    LmsNotificationListItem,
    LmsMenuListItem,
    LmsLayoutDelegatorToolbar,
    LmsDelegatorListButton,
    LmsHelpButton,
    LmsLayoutAppToolbar,
    LmsLayoutHeaderNotificationButton,
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
    delegatorListError() {
      return this.$store.getters["getDelegatorListError"];
    },
    appList() {
      let appList = this.$store.getters["getAppList"];
      return appList?.filter(item => this.mustShowInMenu(item))
    },
    workingApp() {
      return this.$store.getters["getWorkingApp"];
    },
    notifyContacts() {
      return this.$store.getters["getNotifyContacts"];
    },
    workingAppDelegatorList() {
      return this.$store.getters["getWorkingAppDelegatorList"];
    },
    delegatorSelected() {
      return this.$store.getters["getDelegatorSelected"];
    },
    workingAppName() {
      return this.workingApp?.descrizione;
    },
    isWorkingAppDelegable() {
      return this.workingApp?.delegabile ?? false;
    },
    isUserMinor(){
      return this.$store.getters["isUserMinor"];
    }
  },
  async created() {
    if (this.user) {
      let messagesUnseenPromise = getNotifyMessagesUnseen(this.user.cf);
      let messagesPromise = getNotifyMessages(this.user.cf);

      try {
        let {data} = await messagesUnseenPromise;
        this.messageUnseenList = data;
      } catch (err) {
        console.error(err);
      }

      try {
        let {data} = await messagesPromise;
        this.messageList = data;
      } catch (err) {
        console.error(err);
      }
    }
  },
  methods: {
    toggleMenu() {
      this.isMenuVisible = !this.isMenuVisible;
    },
    toggleNotifications() {
      this.areNotificationsVisible = !this.areNotificationsVisible;
      this.setMessageListAsSeen();
    },
    isActive(app) {
      return app.codice === this.workingApp?.codice;
    },
    async onNotificationRemove(notification) {
      let taxCode = this.user.cf;
      let id = notification.id;

      try {
        await deleteMessage(taxCode, id);
        this.messageList = this.messageList.filter(
          n => n.id !== notification.id
        );
      } catch (error) {
        let message = "Non è stato possibile rimuovere la notifica";
        apiErrorNotify({error, message});
      }
    },
    async setMessageListAsSeen() {
      // Facciamo qualcosa solo se ci sono delle notifiche "non viste"
      if (this.messageUnseenList.length <= 0) return;

      try {
        let taxCode = this.user.cf;
        await updateMessagesAsSeen(taxCode, this.messageUnseenList);
        this.messageUnseenList = [];
      } catch (err) {
        console.error(err);
      }
    },
    onDelegatorSelected(delegatorSelected) {
      let url = new URL(window.location.origin + window.location.pathname);
      // url.searchParams.append("d", delegatorSelected.codice_fiscale_delega);
      url.searchParams.append("d", delegatorSelected.uuid);
      window.location.assign(url.origin + url.pathname + "#/" + url.search);
      window.location.reload();
      //this.$store.dispatch("setDelegatorSelected", { delegatorSelected });
    },
    onDelegatorUnselected() {
      let url = new URL(window.location.origin + window.location.pathname);
      window.location.assign(url.origin + url.pathname);
      // let delegatorSelected = null;
      // this.$store.dispatch("setDelegatorSelected", { delegatorSelected });
    },
    goToHelpContacts() {
      this.$router.push(HELP_CONTACTS);
    },
    goToHelpFaq() {
      let appCode = this.workingApp?.portale_codice ?? null
      let url = appDetailFaq(appCode)
      window.open(url);
    },
    goToAssistance() {
      let isAssistance = this.workingApp?.albero_aiuti_visibile
      let appCode = this.workingApp?.portale_codice ?? ''
      let url = isAssistance ? appAssistanceTree(appCode) : appAssistanceForm(appCode)
      window.location.assign(url);
    },
    goToRatingPage() {
      this.$router.push(SERVICE_RATING);
    },
    onClickSettings() {
      let url = "/la-mia-salute/profilo-utente/#/preferenze";
      window.location.assign(url);
    },
    onClickShowAll() {
      let url = "/la-mia-salute/#/notifiche-utente";
      window.location.assign(url);
    },
    onNotificationActivate() {
      let url = "/la-mia-salute/#/contatti-utente/attiva";
      window.location.assign(url);
    },
    mustShowInMenu(item) {
      if (this.$q.platform.is.mobile) return item.visibile_menu_mobile
      if (this.$q.platform.is.desktop) return item.visibile_menu_desktop
      return true
    },
  }
};
</script>

<style lang="sass">
.lms-menu-list__logo
  width: 100%
  max-width: 250px
  height: auto

.lms-notification-list__body > .lms-notification-list-item:not(:last-of-type)
  border-bottom: 1px solid rgba(0, 0, 0, .12)

.lms-notification-list-empty
  text-align: center
  padding: map-get($space-lg, 'y') map-get($space-lg, 'x')
  color: $lms-text-faded-color

.lms-notification-list-item-contacts-activation
  background-color: $blue-2
  padding: map-get($space-md, 'y') map-get($space-md, 'x')
</style>
