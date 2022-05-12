<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-page class="bg-white q-pb-md">

    <q-toolbar color="transparent" text-color="black">
      <q-toolbar-title class="q-pl-none">Notifiche</q-toolbar-title>
      <q-btn flat round color="primary" icon="settings" @click="goToPreferences" />
    </q-toolbar>

    <!-- FILTRI -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <q-collapsible icon="filter_list" label="Filtra">
      <div class="group">
        <!-- @TODO: Attualmente commentato dal momento che non sappiamo come usare le API per la ricerca full-text -->
        <!--<q-field>-->
        <!--<q-search-->
        <!--v-model="searchValue"-->
        <!--float-label="Cerca"-->
        <!--@input="loadFilteredNotifications"-->
        <!--/>-->
        <!--</q-field>-->

        <q-field>
          <q-select
            v-model="selectedStatus"
            :options="statusOptions"
            float-label="Stato"
            clearable
          />
        </q-field>

        <q-field>
          <q-select
            v-model="selectedSenders"
            :options="sendersOptions"
            float-label="Servizi"
            clearable
            multiple
          />
        </q-field>

        <csi-buttons class="q-mt-md">
          <csi-button prmary label="Filtra" @click="loadFilteredNotifications" />
        </csi-buttons>
      </div>
    </q-collapsible>

    <!-- LISTA -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <q-infinite-scroll :handler="loadMoreNotifications" ref="infiniteScroll">
      <csi-notification-list
        :notifications="notifications"
        :loading="isLoadingNotifications"
        hide-loading
        class="q-mt-md"
        @click-notification="onNotificationClick"
        @removed-notification="onNotificationRemoved"
      />

      <div slot="message" class="q-pa-md text-center">
        <q-spinner-mat size="30px" color="primary" />
      </div>
    </q-infinite-scroll>
  </q-page>
</template>


<script>
  import CsiNotificationList from 'components/global/user-profile/CsiNotificationList'
  import {getUserMessages, updateMessagesStatus} from '@services/api/messages'
  import {
    getCallToAction,
    getNotificationsTotalCount,
    hasCallToAction,
    isMessageRead
  } from '@services/global/business-logic'
  import {isEmpty} from '@services/global/utils'
  import {config} from '@plugins/config'

  export default {
    name: 'PageUserNotifications',
    components: {CsiNotificationList},
    props: {},
    data() {
      return {
        limit: 10,
        notifications: [],
        isLoadingNotifications: false,
        totalNotificationsCount: Number.MAX_SAFE_INTEGER,
        searchValue: '',
        selectedStatus: null,
        selectedSenders: [],
      }
    },
    computed: {
      user() {
        return this.$store.getters['global/user']
      },
      userContacts() {
        return this.user.contacts
      },
      appServices() {
        return this.$store.getters['global/appServices']
      },
      statusOptions() {
        return [
          {label: 'Letto', value: 'READ'},
          {label: 'Non letto', value: 'NOT_READ'},
        ]
      },
      sendersOptions() {
        return this.appServices
          .filter(s => s.notificabile)
          .map(s => ({label: s.descrizione, value: s.codice_servizio}))
      }
    },
    methods: {
      // onSelectedSendersChange(val) {
      //   this.selectedSenders = val
      //   this.loadFilteredNotifications()
      // },
      goToPreferences() {
        this.$router.push(this.$routes.GLOBAL.USER_NOTIFICATION_PREFERENCES)
      },
      getQueryFilter() {
        let result = {}

        if (this.search && this.search.trim().length) {
          // @TODO: chiedere al gruppo UNP come effettuare la ricerca full-text
        }

        if (this.selectedStatus !== null) {
          result.read_at = {'null': this.selectedStatus === 'NOT_READ'}
        }

        if (!isEmpty(this.selectedSenders)) {
          result.sender = {in: this.selectedSenders}
        }

        return result
      },
      async loadFilteredNotifications() {
        this.notifications = []
        // Diciamo che "non sappiamo quanti items ci sono in totale"
        this.totalNotificationsCount = Number.MAX_SAFE_INTEGER
        // triggeriamo manualmente l'infinite scroll
        this.$refs.infiniteScroll.loadMore()
      },
      async loadMoreNotifications(index, done) {
        // Se si è verificato un errore con il notificatore => non facciamo nulla
        if (config.errorContacts) return done()
        // Se non ci sono elementi da caricare oppure se li abbiamo già caricati tutti => non facciamo nulla
        if (this.totalNotificationsCount <= 0 || this.notifications.length >= this.totalNotificationsCount) return done()

        // Altrimenti carichiamo la nuova pagina
        let filter = this.getQueryFilter()
        let offset = this.notifications.length
        let limit = this.limit
        let response = await this.loadNotifications({offset, limit, filter})
        this.notifications = [...this.notifications, ...response.data]
        done()
      },
      async loadNotifications({offset = 0, limit = 10, filter = {}}) {
        let params = {offset, limit, filter}
        this.isLoadingNotifications = true
        let response = await getUserMessages(this.user.cf, {params})
        this.isLoadingNotifications = false
        this.totalNotificationsCount = getNotificationsTotalCount(response)
        return response
      },
      async onNotificationClick(notification) {
        let name = this.$routes.GLOBAL.USER_NOTIFICATION_DETAIL.name
        let params = {notificationId: notification.id, notification}
        this.$router.push({name, params})
      },
      onNotificationRemoved(notification) {
        this.notifications = this.notifications.filter(n => n.id !== notification.id)
      }
    },
  }
</script>


<style scoped lang="stylus"></style>
