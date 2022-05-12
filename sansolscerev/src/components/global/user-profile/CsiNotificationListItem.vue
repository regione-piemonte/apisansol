<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-item
    class="csi-notification-list-item"
    :class="{'unread-message': !isRead}">
    <q-item-main class="gutter-y-xs">

      <!-- HEADER -->
      <q-item-tile label>
        <div class="row items-center">
          <div class="col">
            <div>
              {{notification.mex.title}}
            </div>

            <div v-if="sender">
              <q-chip dense square class="no-margin" color="info" text-color="black">
                <span class="q-item-stamp">{{sender}}</span>
              </q-chip>
            </div>
          </div>

          <div class="col-auto">
            <q-btn flat round icon="close" @click.stop="onRemove"/>
          </div>
        </div>
      </q-item-tile>


      <!-- BODY -->
      <q-item-tile sublabel lines="3" text-color="black">
        {{notification.mex.body}}
      </q-item-tile>

      <!-- FOOTER -->
      <q-item-tile stamp>
        <div class="row justify-between">
          <div class="col-auto">
            <span>
              {{notification.timestamp | format('DD MMM YYYY HH:mm')}}
            </span>
          </div>
          <!--<div class="col-auto">-->
          <!--<q-icon v-if="isRead" name="done_all" color="primary" />-->
          <!--<q-icon v-else-if="isSeen" name="done" color="primary" />-->
          <!--</div>-->
        </div>
      </q-item-tile>
    </q-item-main>


    <!-- DIALOGS -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <q-dialog v-model="isRemovingNotification">
      <div slot="message" class="text-black">
        <div>
          Stai per rimuovere la notifica <i>"{{notification.mex.title}}"</i>
        </div>
        <div>Vuoi proseguire?</div>
      </div>

      <template slot="buttons" slot-scope="props">
        <csi-buttons>
          <csi-button primary color="negative" label="Sì, rimuovi" :loading="isRemoving" @click="onRemoveConfirmed"/>
          <csi-button secondary label="No, annulla" @click="props.cancel"/>
        </csi-buttons>
      </template>
    </q-dialog>

  </q-item>
</template>

<script>

  import {getCallToAction, isMessageRead, isMessageSeen} from "@services/global/business-logic";
  import {deleteMessage} from "@services/api/messages";

  export default {
    name: 'CsiNotificationListItem',
    props: {
      notification: {type: Object, required: true}
    },
    data() {
      return {
        // Un flag che gestisce la dialog di converma cancellazione
        isRemovingNotification: false,
        // Un flag che indica se è in corso la richiesta di cancellazione notifica
        isRemoving: false,
      }
    },
    computed: {
      user() {
        return this.$store.getters['global/user']
      },
      isSeen() {
        return this.notification && isMessageSeen(this.notification.tag)
      },
      isRead() {
        return this.notification && isMessageRead(this.notification)
      },
      senderCode(){
        return this.notification && this.notification.sender
      },
      appService(){
        if(!this.senderCode) return null;
        let appService = this.$store.getters['global/appService'](this.senderCode);
        if (!appService) appService = this.$store.getters['global/appService'](this.senderCode.toUpperCase());
        return appService
      },
      sender() {
        if (!this.senderCode) return;

        // Se lo troviamo tra i servizi di apisancross => restituiamo la descrizione presente in apisancross
        if (this.appService) return this.appService.descrizione;

        // Altrimenti proviamo a prenderlo dalla mappa in locale
        return this.$config.global.appServiceCode2Label[this.senderCode.toUpperCase()] || this.$config.global.appServiceCode2Label[this.senderCode]
      },
      callToAction() {
        return getCallToAction(this.notification)
      },
    },
    methods: {
      onRemove() {
        this.isRemovingNotification = true
      },
      async onRemoveConfirmed() {
        this.isRemoving = true
        let response = await deleteMessage(this.user.cf, this.notification.id)
        this.isRemoving = false
        // Una volta rimossa la notifica
        // => chiudiamo la modal edemettiamo l'evento per notificare il componente padre
        this.isRemovingNotification = true
        this.$emit('removed', this.notification)
      }
    }
  }
</script>


<style scoped lang="stylus">

  @require '~variables'

  .csi-notification-list-item
    &.unread-message
      background-color $blue-1
</style>
