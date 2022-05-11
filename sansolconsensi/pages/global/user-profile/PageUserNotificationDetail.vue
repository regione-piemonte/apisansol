<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-page padding>

    <csi-page-title @back="onBack" title="Dettaglio notifica" />


    <q-card v-if="!isLoading" class="q-mt-md">

      <q-item>
        <q-item-side v-if="sender">
          <q-chip dense square class="no-margin" color="info" text-color="black">
            <span class="q-item-stamp">{{sender}}</span>
          </q-chip>
        </q-item-side>

        <q-item-main></q-item-main>

        <q-item-side right stamp>
          {{notification.timestamp | format}}
        </q-item-side>
      </q-item>

      <q-card-title class="q-pt-none">
        {{message.title}}
        <q-item-tile v-if="notification.read_at" class="q-caption">
          Letto il {{notification.read_at | format}}
        </q-item-tile>
      </q-card-title>

      <q-card-main>
        <div v-html="message.body"></div>

        <csi-buttons class="q-mt-lg">
          <csi-button v-if="hasCallToAction" label="Vai" @click="onCallToAction" />
          <csi-button secondary color="negative" label="Rimuovi" :loading="isDeleting" @click="onRemove" />
        </csi-buttons>
      </q-card-main>
    </q-card>


    <!-- LOADING -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <q-inner-loading :visible="isLoading">
      <q-spinner-mat size="50px" color="primary" />
    </q-inner-loading>
  </q-page>
</template>


<script>
  import {deleteMessage, getMessage, updateMessagesStatus} from "@services/api/messages";
  import CsiPageTitle from "components/global/common/CsiPageTitle";
  import {getCallToAction, hasCallToAction, isMessageRead} from "@services/global/business-logic";
  import {deepClone} from '@services/global/utils'

  export default {
    name: 'PageUserNotificationDetail',
    components: {CsiPageTitle},
    props: {},
    data() {
      return {
        notification: null,
        isLoading: false,
        isDeleting: false,
      }
    },
    computed: {
      sender() {
        if (!this.notification || !this.notification.sender) return
        let sender = this.notification.sender
        return this.$config.global.appServiceCode2Label[sender.toUpperCase()] || this.$config.global.appServiceCode2Label[sender]
      },
      user() {
        return this.$store.getters['global/user']
      },
      message() {
        if (!this.notification) return {}
        return this.notification.mex
      },
      hasCallToAction() {
        return this.notification && hasCallToAction(this.notification)
      },
      callToAction() {
        return this.notification && getCallToAction(this.notification)
      }
    },
    async created() {
        this.loadNotification()
    },
      beforeRouteUpdate (to, from, next) {
          // don't forget to call next()
          // react to route changes...
          next()
          this.loadNotification()
      },
    methods: {
      onBack() {
        this.$router.back()
      },
        async loadNotification(){
            let {notification, notificationId} = this.$route.params

            if (!notification && !this.$config.errorContacts) {
                // @TODO: gestire errori HTTP
                this.isLoading = true
                let response = await getMessage(this.user.cf, notificationId)
                this.isLoading = false
                notification = response.data
            }

            this.notification = deepClone(notification)

            // Impostiamo eventualmente il messaggio come "letto"
            // Dopodichè aggiorniamo il model per aggiornare la UI
            if (!isMessageRead(this.notification)) {
              try{
                let response = await this.setAsRead(this.notification)
                this.notification = response.data[0]
                this.$root.$emit('notification-read', deepClone(response.data[0]))
              } catch(e){
                console.error(e)
              }
            }
        },
      async setAsRead(notification) {
        let data = [
          {id: notification.id, read_at: new Date().toISOString()},
        ];

        return updateMessagesStatus(this.user.cf, data, {_no5XXRedirect: true});
      },
      onCallToAction() {
        location.assign(this.callToAction)
      },
      async onRemove() {
        this.isDeleting = true
        let response = await deleteMessage(this.user.cf, this.notification.id)
        this.isDeleting = false
        this.$router.push(this.$routes.GLOBAL.USER_NOTIFICATIONS)
      }
    },
  }
</script>


<style scoped lang="stylus">

</style>
