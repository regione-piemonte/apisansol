<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <lms-page padding>
    <lms-page-title>
      Dettaglio notifica
    </lms-page-title>

    <template v-if="!isLoading">
      <q-card class="q-mt-md">
        <q-card-section>
          <q-item class="no-padding">
            <q-item-section v-if="sender" side avatar class="no-padding">
              <q-chip
                dense
                square
                class="no-margin"
                color="info"
                text-color="black"
              >
                <span class="q-item-stamp">{{ sender }}</span>
              </q-chip>
            </q-item-section>

            <q-item-section></q-item-section>

            <q-item-section side class="no-padding">
              {{ notification.timestamp | datetime }}
            </q-item-section>
          </q-item>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="text-body1 text-weight-bold">
            {{ message.title }}
          </div>
          <div v-if="notification.read_at" class="text-caption">
            Letto il {{ notification.read_at | datetime }}
          </div>
        </q-card-section>

        <q-card-section>
          <div class="text-body1" v-html="message.body"></div>
        </q-card-section>

        <q-card-section>
          <lms-buttons class="q-mt-lg">
            <lms-button
              v-if="hasCallToAction"
              label="Vai"
              @click="onCallToAction"
            />
            <lms-button
              outline
              color="negative"
              label="Rimuovi"
              :loading="isDeleting"
              @click="onRemove"
            />
          </lms-buttons>
        </q-card-section>
      </q-card>
    </template>

    <!-- LOADING -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <lms-inner-loading :showing="isLoading" block />
  </lms-page>
</template>

<script>
import { PROFILE_NOTIFICATION_LIST } from "src/router/routes";
import {
  getCallToAction,
  hasCallToAction,
  isMessageRead
} from "src/services/business-logic";
import { extend } from "quasar";
import {
  getNotifyMessage,
  deleteMessage,
  updateNotifyMessageStatus
} from "src/services/api";

export default {
  name: "PageProfileNotificationDetail",
  props: {},
  data() {
    return {
      notification: null,
      isLoading: false,
      isDeleting: false
    };
  },
  computed: {
    user() {
      return this.$store.getters["getUser"];
    },
    appList() {
      return this.$store.getters["getAppList"];
    },
    sender() {
      if (!this.notification || !this.notification.sender) return;
      let sender = this.notification.sender;
      let service = this.appList.find(
        s => s.codice_servizio?.toUpperCase() === sender?.toUpperCase()
      );
      return service?.descrizione ?? "";
    },
    message() {
      if (!this.notification) return {};
      return this.notification.mex;
    },
    hasCallToAction() {
      return this.notification && hasCallToAction(this.notification);
    },
    callToAction() {
      return this.notification && getCallToAction(this.notification);
    }
  },
  async created() {
    this.loadNotification();
  },
  beforeRouteUpdate(to, from, next) {
    // don't forget to call next()
    // react to route changes...
    next();
    this.loadNotification();
  },
  methods: {
    onBack() {
      this.$router.back();
    },
    async loadNotification() {
      let { notification, id } = this.$route.params;

      if (!notification) {
        // @TODO: gestire errori HTTP
        this.isLoading = true;
        let response = await getNotifyMessage(this.user.cf, id);
        this.isLoading = false;
        notification = response.data;
      }

      this.notification = extend(true, {}, notification);

      // Impostiamo eventualmente il messaggio come "letto"
      // Dopodichè aggiorniamo il model per aggiornare la UI
      if (!isMessageRead(this.notification)) {
        let response = await this.setAsRead(this.notification);
        this.notification = response.data[0];
        this.$root.$emit(
          "notification-read",
          extend(true, {}, response.data[0])
        );
      }
    },
    async setAsRead(notification) {
      let data = [{ id: notification.id, read_at: new Date().toISOString() }];
      return updateNotifyMessageStatus(this.user.cf, data);
    },
    onCallToAction() {
      location.assign(this.callToAction);
    },
    async onRemove() {
      this.isDeleting = true;
      await deleteMessage(this.user.cf, this.notification.id);
      this.isDeleting = false;
      this.$router.push(PROFILE_NOTIFICATION_LIST);
    }
  }
};
</script>

<style lang="sass"></style>
