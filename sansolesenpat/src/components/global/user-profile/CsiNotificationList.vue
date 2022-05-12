<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div>

    <!-- ITEM DI ATTIVAZIONE NOTIFICHE -->
    <div v-if="isNil(userContacts)" class="bg-blue-2">
      <q-item @click.native="isModelOpen = true" dense link class="q-pa-md">
        <q-item-main>
          <q-item-tile label>Attiva le notifiche via email, SMS e push</q-item-tile>
          <q-item-tile sublabel>
            Clicca qui per inserire i contatti nel tuo profilo personale ed attivare il servizio di notifiche.
          </q-item-tile>
        </q-item-main>
      </q-item>


      <!-- MODAL ATTIVAZIONE NOTIFICHE -->
      <!-- ----------------------------------------------------------------------------------------------------------- -->
      <csi-notification-activation-modal v-model="isModelOpen" />
    </div>

    <div>

      <!-- LISTA NOTIFICHE -->
      <!-- --------------------------------------------------------------------------------------------------------- -->
      <div class="relative-position">
        <div v-if="!loading && notifications.length <= 0" class="text-center text-faded q-pa-lg">
          Nessun messaggio ricevuto
        </div>


        <q-list v-else highlight link no-border separator class="q-pa-none">
          <csi-transition-fade-out-right
            tag="div"
            leave-active-class="full-width"
            is-group
          >
            <csi-notification-list-item
              v-ripple
              v-for="notification in notifications"
              :key="notification.id"
              :notification="notification"
              @click.native="$emit('click-notification', notification)"
              @removed="$emit('removed-notification', notification)"
              class="csi-transition-property-all csi-transition-duration-1000 cursor-pointer"
            />
          </csi-transition-fade-out-right>
        </q-list>

        <!-- Hack che permette di mostrare il loader -->
        <div v-if="loading && !hideLoading" class="q-pa-lg"></div>

        <q-inner-loading :visible="loading && !hideLoading">
          <q-spinner-mat size="30px" color="primary"></q-spinner-mat>
        </q-inner-loading>
      </div>

    </div>

  </div>
</template>


<script>
  import CsiNotificationListItem from "./CsiNotificationListItem";
  import CsiNotificationActivationModal from "./CsiNotificationActivationModal";
  import {isNil} from "@services/global/utils";
  import CsiTransitionFadeOutRight from "components/global/transitions/CsiTransitionFadeOutRight";


  export default {
    name: 'CsiNotificationList',
    components: {CsiTransitionFadeOutRight, CsiNotificationActivationModal, CsiNotificationListItem},
    props: {
      notifications: {type: Array, required: true},
      loading: {type: Boolean, required: false, default: false},
      hideLoading: {type: Boolean, required: false, default: false},
    },
    data() {
      return {
        // Un flag che gestisce la modal di apertura profilo
        isModelOpen: false,
      }
    },
    computed: {
      user() {
        return this.$store.getters['global/user']
      },
      userContacts() {
        return this.user.contacts
      },
    },
    methods: {
      isNil,
    },
  }
</script>

<style scoped lang="stylus">

  .csi-transition-property-all
    transition-property all

  .csi-transition-duration-1000
    transition-duration 1000ms

</style>
