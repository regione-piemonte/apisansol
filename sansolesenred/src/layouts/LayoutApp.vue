<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<style>
</style>


<template>
  <q-layout>

    <!-- APP HEADER -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <csi-app-header
      @menu-click="toggleLeftDrawer"
      @logo-click="$router.push($routes.GLOBAL.APP)">

      <template slot="toolbar-right">
        <q-btn v-if="!isUserLogged" @click="onLogin" flat dense>
          Accedi
        </q-btn>

        <div v-else>
          <q-btn
            @click="toggleNotificationsDrawer"
            flat
            round
            dense
            icon="notifications"
            :class="{'bg-tertiary': isNotificationsDrawerOpen}">
            <q-chip v-if="notificationsCount > 0" floating dense color="red">
              {{notificationsCount}}
            </q-chip>
            <q-tooltip>Notifiche</q-tooltip>
          </q-btn>

          <q-btn flat round dense class="bg-tertiary q-ml-xs">
            {{user.nome.charAt(0).toUpperCase()}}{{user.cognome.charAt(0).toUpperCase()}}

            <q-popover style="min-width: 180px;">
              <q-list separator link sparse class="no-padding">
                <q-item v-close-overlay @click.native="onProfileClick">
                  <q-item-side icon="person"></q-item-side>
                  <q-item-main>
                    <q-item-tile label>Profilo</q-item-tile>
                  </q-item-main>
                </q-item>

                <q-item v-close-overlay @click.native="onLogout">
                  <q-item-side icon="exit_to_app"></q-item-side>
                  <q-item-main>
                    <q-item-tile label>Esci</q-item-tile>
                  </q-item-main>
                </q-item>
              </q-list>
            </q-popover>

            <q-tooltip>Profilo</q-tooltip>
          </q-btn>
        </div>
      </template>

      <template slot="after-toolbar">
        <portal-target name="layout-app-toolbar-after">
          <!--
          This component can be located anwhere in your App.
          The slot content of the above portal component will be rendered here.
          -->
        </portal-target>
      </template>
    </csi-app-header>


    <!-- LEFT MENU -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <q-layout-drawer
      v-model="leftDrawer"
      side="left"
      behavior="mobile">
      <q-scroll-area class="fit q-layout-drawer-delimiter">
<!--        <csi-navigation :navigation="navigation"/>-->
        <csi-navigation2 />
      </q-scroll-area>
    </q-layout-drawer>


    <!-- NOTIFICATION DRAWER -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <q-layout-drawer
      v-if="isUserLogged"
      v-model="isNotificationsDrawerOpen"
      side="right"
      behavior="mobile">

      <!-- LINK ALLE IMPOSTAZIONI DELLE NOTIFICHE -->
      <q-item>
        <q-item-main>
          <q-item-tile label class="q-body-2">Notifiche</q-item-tile>
        </q-item-main>

        <q-item-side right>
          <q-btn flat round color="primary" icon="settings" @click="goToPreferences"/>
        </q-item-side>
      </q-item>

      <q-item-separator class="q-my-none"/>

      <!-- LISTA -->
      <csi-notification-list
        :notifications="notifications"
        :loading="isLoadingNotifications"
        @click-notification="onNotificationClick"
        @removed-notification="onNotificationRemoved"
      />

      <!-- VEDI TUTTE -->
      <q-item v-if="!isLoadingNotifications && totalNotificationsCount > notifications.length">
        <q-item-main>
          <q-item-tile>
            <q-btn @click="goToNotifications" color="primary" class="full-width">Vedi tutte</q-btn>
          </q-item-tile>
        </q-item-main>
      </q-item>
    </q-layout-drawer>


    <!-- PAGE CONTAINER -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <q-page-container>
      <router-view></router-view>
    </q-page-container>


    <!-- FOOTER -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <csi-app-footer :no-rating="!isRatingVisible" @rating-click="goToRatingPage">
    </csi-app-footer>

  </q-layout>
</template>


<script>
  import {NAVIGATION} from '@router/navigation'
  import CsiNavigation from 'components/global/common/CsiNavigation'
  import CsiNotificationList from 'components/global/user-profile/CsiNotificationList'
  import {login, logout} from '@services/global/session'
  import {isNil, supportThirdPartyCookie} from '@services/global/utils'
  import {getUnseenMessages, getUserMessages, updateMessagesStatus} from '@services/api/messages'
  import {getNotificationsTotalCount, markMessageAsSeen} from '@services/global/business-logic'
  import CsiAppFooter from 'components/global/common/CsiAppFooter'
  import CsiAppHeader from 'components/global/common/CsiAppHeader'
  import {config} from '@plugins/config'
  import CsiNavigation2 from "components/global/common/CsiNavigation2";

  export default {
    name: 'LayoutApp',
    components: {CsiNavigation2, CsiAppHeader, CsiAppFooter, CsiNotificationList, CsiNavigation},
    data() {
      return {
        leftDrawer: false,
        isNotificationsDrawerOpen: false,
        unseenNotifications: [],
        notifications: [],
        totalNotificationsCount: Number.MAX_SAFE_INTEGER,
        isLoadingNotifications: false,
      }
    },
    computed: {
      user() {
        return this.$store.getters['global/user']
      },
      userContacts() {
        return this.user.contacts
      },
      isUserLogged() {
        return this.$store.getters['global/isUserLogged']
      },
      isUserMinor() {
        return this.$store.getters['global/isUserMinor']
      },
      notificationsCount() {
        let offset = isNil(this.userContacts) ? 1 : 0
        return offset + this.unseenNotifications.length
      },
      isRatingVisible() {
        return this.$route && this.$route.meta && this.$route.meta.appServiceCode
      },
      navigation() {
        return NAVIGATION.filter(this.mustShowInMenu)
      }
    },
    watch: {
      userContacts: {
        immediate: true,
        // deep: true,
        handler(val, oldVal) {
          // Nel caso in cui il CF non cambia => non ricarichiamo le notifiche
          if (val && oldVal && val.user_id === oldVal.user_id) return
          if (!this.isUserLogged) return
          if (!config.errorContacts)
            this.loadNotificationsCount()
        }
      }
    },
    async created() {
      // @note: vogliamo mostrare all'utente i messaggi anche se non ha i contatti del notificatore impostati
      //        questo permette all'utente di vedere cosa fanno i delegati
      // if (!isNil(this.userContacts)) {

      // Proviamo ad ottenere i messaggi solo se l'utente è loggato
      if (this.isUserLogged && !config.errorContacts) {
        this.isLoadingNotifications = true
        let response = await getUserMessages(this.user.cf, {_no5XXRedirect: true, offset: 0, limit: 10})
        this.notifications = response.data
        this.totalNotificationsCount = getNotificationsTotalCount(response)
        this.isLoadingNotifications = false
        // Se qualcuno ci dice che una notifica è stata "letta" => la aggiorniamo lo stato di questo componente
        //                                                         per riflettere la modifica
        this.$root.$on('notification-read', this.onNotificationRead)
      }

      // }
    },
    methods: {
      mustShowInMenu(item) {
        // Facciamo prima il controllo su ciò che può eventualmente vedere il minore
        if (this.isUserMinor && !item.meta.isVisibleToMinor) return false

        // In test mostriamo sempre tutte le card per comodità
        if (this.$config.global.isTest) return true

        if (this.$q.platform.is.mobile) return !item.meta.isHiddenInMobileMenu

        return true
      },
      toggleLeftDrawer() {
        this.leftDrawer = !this.leftDrawer
      },
      toggleNotificationsDrawer() {
        this.isNotificationsDrawerOpen = !this.isNotificationsDrawerOpen
        // if (this.isNotificationsDrawerOpen && !isNil(this.userContacts)) this.markNotificationsAsSeen()
        if (this.isNotificationsDrawerOpen) this.markNotificationsAsSeen()
      },
      onLogin() {

        // Se siamo sul cup e siamo su un browser che non supporta i cookie di terze parti
        // => non eseguiamo il login ma mostriamo una modale con un messaggio
        // let isReservation = this.$route.name === this.$routes.RESERVATIONS.HOME.name;
        // if (isReservation && !supportThirdPartyCookie()) {
        //
        //   let message = `
        //       Siamo spiacenti, al momento la tua versione di Safari non è supportata per il log-in sul servizio
        //       Prenotazioni visite ed esami (Cup-Piemonte). Puoi comunque continuare l'utilizzo in modalità anonima,
        //       oppure
        //       ti consigliamo di usare Firefox, da computer fisso o portatile, aggiornati all'ultima versione disponibile.
        //     `;
        //
        //   if (this.$q.platform.is.chrome) {
        //     message = `
        //       Siamo spiacenti, in seguito all'aggiornamento delle policy di sicurezza, la tua versione di Chrome o Edge non
        //       è supportata per l’accesso autenticato al servizio di prenotazione CUP regionale.
        //       L'utilizzo è comunque possibile in modalità non autenticata. In alternativa, ti consigliamo di usare Firefox, da computer fisso o portatile, aggiornati all'ultima versione disponibile.
        //     `;
        //   }
        //
        //   this.$q.dialog({
        //     title: 'Browser non supportato',
        //     message
        //   });
        //   return;
        // }


        login()
      },
      onLogout() {
        logout()
      },
      onNotificationRead(notification) {
        this.notifications = this.notifications.map(n => {
          if (n.id === notification.id) {
            return notification
          }

          return n
        })
      },
      async loadNotificationsCount() {
        // if (isNil(this.userContacts)) return
        let response = await getUnseenMessages(this.user.cf, {_no5XXRedirect: true})
        this.unseenNotifications = response.data
      },
      async markNotificationsAsSeen() {
        // if (isNil(this.userContacts)) return
        if (this.unseenNotifications.length <= 0) return

        // aggiungiamo il tag che imposta il messaggio come "visto"
        let seenNotifications = this.unseenNotifications.map(m => {
          let tag = markMessageAsSeen(m.tag)
          let read_at = m.read_at || null
          return {id: m.id, read_at, tag}
        })

        try {
          let response = await updateMessagesStatus(this.user.cf, seenNotifications, {_no5XXRedirect: true})
          this.unseenNotifications = []
        } catch (e) {
          console.error(e)
        }
      },
      async onNotificationClick(notification) {
        let name = this.$routes.GLOBAL.USER_NOTIFICATION_DETAIL.name
        let params = {notificationId: notification.id, notification}
        this.$router.push({name, params})
      },
      onNotificationRemoved(notification) {
        this.notifications = this.notifications.filter(n => n.id !== notification.id)
      },
      goToRatingPage() {
        if (!this.$route.meta || !this.$route.meta.appServiceCode) return
        let query = {servizio: this.$route.meta.appServiceCode}
        let route = {name: this.$routes.GLOBAL.SERVICE_RATING.name, query}
        this.$router.push(route)
      },
      goToPreferences() {
        if (!config.errorContacts)
          this.goToNotificationPreferences();
          // this.$router.push(this.$routes.GLOBAL.USER_NOTIFICATION_PREFERENCES)
        else
          this.goToProfile();
          // this.$router.push(this.$routes.GLOBAL.USER_PROFILE)
      },
      goToNotifications() {
        this.$router.push(this.$routes.GLOBAL.USER_NOTIFICATIONS)
      },
      goToNotificationPreferences() {
        let url = '/la-mia-salute/profilo-utente/#/preferenze';
        window.location.assign(url);
      },
      goToProfile(){
        let url = '/la-mia-salute/profilo-utente/#/';
        window.location.assign(url);
      },
      onProfileClick(){
        this.goToProfile();
      }
    },
  }
</script>
