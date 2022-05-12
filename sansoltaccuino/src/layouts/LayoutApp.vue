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
          <span class="tac-toolbar-title">
            {{ workingAppName | empty }}
          </span>

          <template #right>
            <div class="row justify-end" :class="$q.screen.lt.md ? 'q-gutter-x-sm' : 'q-gutter-x-md'">
              <!-- BOTTONE OSCUSA/DEOSCURA TACCUINO -->
              <template v-if="!isDelegationTacWeak && userInfo && notebook">
                <q-btn
                  :round="$q.screen.lt.md"
                  flat
                  dense
                  no-caps
                  :icon="isNotebookVisible ? 'visibility' : 'visibility_off'"
                  @click="openNotebookVisibilityDialog"
                >
                  <div class="gt-sm q-pl-xs">
                    <template v-if="isNotebookVisible">
                      Oscura taccuino
                    </template>
                    <template v-else>
                      Rendi visibile taccuino
                    </template>
                  </div>
                  <q-tooltip anchor="top middle">
                    <template v-if="isNotebookVisible">
                      Oscura taccuino
                    </template>
                    <template v-else>
                      Rendi visibile taccuino
                    </template>
                  </q-tooltip>
                </q-btn>
              </template>

              <!-- BOTTONE HELP -->
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
                          Siamo spiacenti, al momento non è possibile recuperare informazioni sulle deleghe
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
                      clickable
                      class="lms-delegator-list-item"
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
            v-for="item in appList"
            :key="item.url"
            :href="item.url"
            :menu-list="item.menu"
            :title="item.descrizione"
            :icon="item.icona_url"
            :locked="!item.pubblico && !user"
            :active="isActive(item)"
          />
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <!-- LISTA NOTIFICHE -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <q-drawer
      v-model="areNotificationsVisible"
      overlay
      behavior="mobile"
      side="right"
      class="lms-notification-drawer"
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
                  flat
                  round
                  dense
                  icon="settings"
                  color="primary"
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
                clickable
                class="lms-notification-list-item-contacts-activation"
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
              :key="notification.id"
              :id="notification.id"
              :title="notification.mex.title"
              :sender="notification.sender"
              :datetime="notification.timestamp"
              :read="!!notification.read_at"
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
    <template v-if="isUserMinor">
      <q-page-container>
         <the-guard-user-minor/>
      </q-page-container>
    </template>

    <!-- NUOVA GESTIONE ARRUOLAMENTO -->
    <template v-else-if="IS_NEW_ENROLLABLE_ACTIVE">
      <q-page-container>
          <lms-page>

            <div class="q-my-md">
              <the-guard-enrollment2 :code="enrollmentCode" />

              <template v-if="!isEnrollmentCodeBlocker">
                <!--        <tac-guard-piedmont-user>-->
                <tac-guard-notebook-closed>
                  <tac-guard-notebook-hidden-to-delegator>
                        <router-view />
                  </tac-guard-notebook-hidden-to-delegator>
                </tac-guard-notebook-closed>
                <!--        </tac-guard-piedmont-user>-->
              </template>
            </div>
          </lms-page>
      </q-page-container>
    </template>

    <!-- VECCHIA GESTIONE -->
    <template v-else>
      <q-page-container>
        <tac-guard-piedmont-user>
          <tac-guard-notebook-closed>
            <tac-guard-notebook-hidden-to-delegator>
              <tac-guard-enrollment>
                <router-view/>
              </tac-guard-enrollment>
            </tac-guard-notebook-hidden-to-delegator>
          </tac-guard-notebook-closed>
        </tac-guard-piedmont-user>
      </q-page-container>
    </template>


    <!-- FOOTER -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <lms-layout-footer
      rating
      help-faq
      help-assistance
      @click-help-contacts="goToHelpContacts"
      @click-help-faq="goToHelpFaq"
      @click-assistance="goToAssistance"
      @click-help-assistance="goToAssistance"
    />

    <!-- DIALOGS -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <tac-notebook-visibility-change-dialog
      v-model="isNotebookVisibilityChangeDialogVisible"
      :is-notebook-visible="isNotebookVisible"
      :is-consent-fse-enabled="isConsentFseEnabled"
    />

    <!-- DIALOG VISIBILITA' -->
    <q-dialog v-model="isOpenVisibilityDialog">
      <q-card class="q-pa-md">
        <q-card-section>
          <p>
            In qualsiasi momento puoi oscurare o de-oscurare i dati e i
            documenti del Fascicolo.
          </p>
          <p>
            Questa possibilità si aggiunge alla funzione di consenso alla
            consultazione e/o delega. <br/>
            In questo modo potrai ad esempio oscurare puntualmente singoli
            documenti o gruppi di informazioni (come nel caso delle esenzioni e
            delle misurazioni inserite da te) ai professionisti Sanitari anche
            se è stato fornito il consenso alla consultazione.
          </p>
        </q-card-section>

        <q-card-actions align="right">
          <lms-buttons>
            <lms-button
              :loading="isSavingNotebookVisibility"
              @click="onToggleNotebookVisibility"
            >
              Conferma
            </lms-button>
            <lms-button outline v-close-popup>Annulla</lms-button>
          </lms-buttons>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script>
  import {
    getNotifyMessages,
    getNotifyMessagesUnseen,
    updateMessagesAsSeen,
    deleteMessage
  } from "src/services/api";
  import {DETECTION_LIST, HELP_CONTACTS} from "src/router/routes";
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
  import {
    apiErrorNotify,
    apiErrorNotifyDialog,
    orderBy
  } from "src/services/utils";
  import {updateNotebookVisibility} from "../services/api";
  import TacGuardPiedmontUser from "../components/TacGuardPiedmontUser";
  import TacGuardEnrollment from "../components/TacGuardEnrollment";
  import {notifySuccess} from "../services/utils";
  import TacGuardNotebookHiddenToDelegator from "../components/TacGuardNotebookHiddenToDelegator";
  import TacNotebookVisibilityChangeDialog from "../components/TacNotebookVisibilityChangeDialog";
  import TacGuardNotebookClosed from "../components/TacGuardNotebookClosed";
  import {appAssistanceForm, appAssistanceTree, appDetailFaq} from "src/services/urls";
  import {IS_NEW_ENROLLABLE_ACTIVE} from "../services/config";
  import TheGuardEnrollment2 from "../components/TheGuardEnrollment2";
  import TheGuardUserMinor from "components/TheGuardUserMinor";

  export default {
    name: "LayoutApp",
    components: {
      TheGuardUserMinor,
      TheGuardEnrollment2,
      TacGuardNotebookClosed,
      TacNotebookVisibilityChangeDialog,
      TacGuardNotebookHiddenToDelegator,
      TacGuardEnrollment,
      TacGuardPiedmontUser,
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
        IS_NEW_ENROLLABLE_ACTIVE,
        isMenuVisible: false,
        areNotificationsVisible: false,
        isSavingNotebookVisibility: false,
        isNotebookVisibilityChangeDialogVisible: false,
        messageList: [],
        messageUnseenList: [],
        isOpenVisibilityDialog: false
      };
    },
    computed: {
      user() {
        return this.$store.getters["getUser"];
      },
      isUserMinor(){
        return this.$store.getters["isUserMinor"];
      },
      userInfo() {
        return this.$store.getters["getUserInfo"];
      },
      appList() {
        let appList = this.$store.getters["getAppList"];
        return appList?.filter(item => this.mustShowInMenu(item));
      },
      workingApp() {
        return this.$store.getters["getWorkingApp"];
      },
      notifyContacts() {
        return this.$store.getters["getNotifyContacts"];
      },
      workingAppDelegatorList() {
        return orderBy(
          this.$store.getters["getWorkingAppDelegatorList"],
          ["cognome_delega", "nome_delega"],
          ["asc", "asc"]
        );
      },
      delegatorSelected() {
        return this.$store.getters["getDelegatorSelected"];
      },
      notebook() {
        return this.$store.getters["getNotebook"];
      },
      isDelegationTacWeak() {
        return this.$store.getters["isDelegationTacWeak"];
      },
      workingAppName() {
        return this.workingApp?.descrizione;
      },
      isWorkingAppDelegable() {
        return this.workingApp?.delegabile ?? false;
      },
      isNotebookVisible() {
        return !this.notebook?.oscurato;
      },
      delegatorListError(){
        return this.$store.getters["getDelegatorListError"];
      },
      enrollmentConsent() {
        return this.$store.getters["getEnrollmentConsent"];
      },
      isConsentFseEnabled() {
        return this.enrollmentConsent?.consenso_consultazione === true;
      },
      activeUserEnrollmentInfo() {
        return this.$store.getters["getActiveUserEnrollmentInfo"];
      },
      enrollmentCode() {
        return this.activeUserEnrollmentInfo?.codice_risposta;
      },
      isEnrollmentCodeBlocker() {
        let BLOCK_CODE_LIST = [
          "000",
          "001",
          "002",
          "004",
          "005",
          "007",
          "010",
          "011",
          "012",
          "013",
          "015"
        ];

        return BLOCK_CODE_LIST.includes(this.enrollmentCode);
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
          apiErrorNotifyDialog({error, message});
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

        // this.$store.dispatch("setDelegatorSelected", { delegatorSelected });
        // this.$router.push(DETECTION_LIST);
      },
      onDelegatorUnselected() {
        let url = new URL(window.location.origin + window.location.pathname);
        window.location.assign(url.origin + url.pathname);
        // window.location.reload();

        // let delegatorSelected = null;
        // this.$store.dispatch("setDelegatorSelected", { delegatorSelected });
        // this.$router.push(DETECTION_LIST);
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
        let appCode = this.workingApp?.portale_codice ?? null
        let url = isAssistance ? appAssistanceTree(appCode) : appAssistanceForm(appCode)
        window.location.assign(url);
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
      openNotebookVisibilityDialog() {
        // this.isOpenVisibilityDialog = true;
        this.isNotebookVisibilityChangeDialogVisible = true;
      },
      async onToggleNotebookVisibility() {
        // this.isNotebookVisibilityChangeDialogVisible = true;
        // return;

        let taxCode = this.$store.getters["getTaxCode"];
        let notebookId = this.notebook?.id;
        let payload = {
          oscurato: !this.notebook?.oscurato
        };

        this.isSavingNotebookVisibility = true;

        try {
          await updateNotebookVisibility(taxCode, notebookId, payload);
          // Aggiorniamo le informazioni del taccuino nello store globale
          let notebook = {...this.notebook, oscurato: payload.oscurato};
          this.$store.dispatch("setNotebook", {notebook});

          let message = payload.oscurato
            ? "Taccuino oscurato"
            : "Taccuino deoscurato";
          notifySuccess(message);
        } catch (error) {
          let message =
            "Non è stato possibile aggiornare lo stato di visibilità del taccuino";
          apiErrorNotifyDialog({error, message});
        }

        this.isSavingNotebookVisibility = false;
        this.isOpenVisibilityDialog = false;
      },
      mustShowInMenu(item) {
        if (this.$q.platform.is.mobile) return item.visibile_menu_mobile;
        if (this.$q.platform.is.desktop) return item.visibile_menu_desktop;
        return true;
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

    .tac-toolbar-title
      display: inline-block
      max-width: 200px
      text-overflow: ellipsis
      overflow-x: hidden
      vertical-align: middle

      @media (min-width: 450px)
        max-width: none


</style>
