<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <lms-page padding>

    <!--   FILTRI  ------------->
    <!-- -------------------------->
    <q-card class="bg-transparent q-mb-lg" flat v-if="isFirstLoading">
      <q-card-section class="no-padding">
        <div class="row reverse" v-if="$q.screen.lt.md">
          <q-btn flat text-color="black" icon="filter_list" label="Filtri"
                 @click="openFilters"/>
        </div>
        <div class="row q-col-gutter-md items-center">
          <div class="col-auto gt-sm  text-bold q-pr-sm" v-if="$q.screen.gt.sm">
            <q-icon name="filter_list" size="sm" class="q-mr-sm"/>
            Filtri
          </div>
          <q-slide-transition>
            <div v-show="isOpenFilters" class="col">
              <div class="row items-center q-col-gutter-x-lg q-col-gutter-y-md q-mb-md">
                <div class="col-md-6 col-12">
                  <q-select
                    v-model="selectedStatus"
                    :options="statusOptions"
                    label="Stato"
                    clearable
                    dense
                    emit-value
                    map-options
                    @input="setFilters"
                  />
                </div>
                <div class="col-md-6 col-12">
                  <q-select
                    v-model="selectedSenders"
                    :options="appListNotifiable"
                    label="Servizi"
                    option-value="codice_servizio"
                    option-label="descrizione"
                    emit-value
                    dense
                    map-options
                    clearable
                    multiple
                    use-chips
                    @input="setFilters"
                  >
                    <template v-slot:option="{ itemProps, itemEvents, opt, selected, checkOption }">
                      <q-item
                        dense
                        class="q-px-sm"
                        v-bind="itemProps"
                        v-on="itemEvents"
                      >
                        <q-item-section side>
                          <q-checkbox
                            dense
                            :value="selected"
                            @input="checkOption(opt)"
                          />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label v-html="opt.descrizione"/>
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </div>
              </div>
            </div>
          </q-slide-transition>
        </div>
      </q-card-section>
    </q-card>

    <!-- LISTA -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <q-card flat>
      <q-card-section class="no-padding">

        <q-infinite-scroll
          ref="infiniteScroll"
          :debounce="100"
          @load="loadMoreNotifications"
        >

          <lms-notification-list-item
            v-for="notification in notificationList"
            :key="notification.id"
            :id="notification.id"
            :title="notification.mex.title"
            :sender="notification.sender"
            :datetime="notification.timestamp"
            :read="!!notification.read_at"
            clickable
            removable
            @click="onNotificationClick(notification)"
            @remove="onNotificationRemove(notification)"
          >
            <span class="pre-line text-wrap-word">{{
                notification.mex.body
              }}</span>
          </lms-notification-list-item>

          <template v-if="isLoadingNotificationList">
            <div v-for="i in 6" :key="i">
              <account-notification-list-item-skeleton/>
              <q-separator/>
            </div>
          </template>
        </q-infinite-scroll>
      </q-card-section>
    </q-card>

    <template v-if="!isLoadingNotificationList && notificationList.length<= 0">
      <q-banner class="q-banner--info q-mt-md">
        <div class="text-body1">
          Nessun messaggio ricevuto.
        </div>
      </q-banner>
    </template>
  </lms-page>
</template>

<script>
import {PROFILE_NOTIFICATION_DETAIL} from "src/router/routes";
import {getNotificationsTotalCount} from "src/services/business-logic";
import {getNotifyMessages, deleteMessage} from "../services/api";
import {apiErrorNotify, isEmpty} from "../services/utils";
import LmsNotificationListItem from "../components/core/LmsNotificationListItem";
import {date, Screen} from "quasar";
import AccountNotificationListItemSkeleton from "components/AccountNotificationListItemSkeleton";

export default {
  name: "PageProfileNotificationList",
  components: {AccountNotificationListItemSkeleton, LmsNotificationListItem},
  props: {},
  data() {
    return {
      Screen,
      isLoadingNotificationList: false,
      limit: 10,
      totalNotificationsCount: Number.MAX_SAFE_INTEGER,
      selectedStatus: null,
      notificationList: [],
      selectedSenders: [],
      isOpenFilters: false,
      isFirstLoading:false

    };
  },
  watch: {
    Screen: {
      deep: true,
      immediate: true,
      handler(newval, oldval) {
        if (newval.gt.sm)
          this.isOpenFilters = true
      }
    }
  },
  computed: {
    user() {
      return this.$store.getters["getUser"];
    },
    userContacts() {
      return this.user.contacts;
    },
    appList() {
      return this.$store.getters["getAppList"];
    },
    appListNotifiable() {
      return this.appList.filter(s => s.notificabile);
    },
    statusOptions() {
      return [
        {label: "Letto", value: "READ"},
        {label: "Non letto", value: "NOT_READ"}
      ];
    },
    noNotifications() {
      return this.totalNotificationsCount <= 0;
    },
    areAllNotificationLoaded() {
      return this.notificationList.length >= this.totalNotificationsCount;
    }
  },
  created() {
  },
  methods: {
    getQueryFilter() {
      let result = {};

      if (this.selectedStatus !== null) {
        result.read_at = {null: this.selectedStatus === "NOT_READ"};
      }

      if (this.selectedSenders?.length > 0) {
        result.sender = {in: this.selectedSenders};
      }

      return result;
    },
    async loadFilteredNotifications() {
      console.log('loadFilteredNotifications')
      this.notificationList = [];
      // Diciamo che "non sappiamo quanti items ci sono in totale"
      this.totalNotificationsCount = Number.MAX_SAFE_INTEGER;
      // triggeriamo manualmente l'infinite scroll
      this.$refs.infiniteScroll.reset();
      this.$refs.infiniteScroll.trigger();
      // this.loadMoreNotifications()

    },
    async loadMoreNotifications(index, done) {
      console.log('loadMoreNotifications')
      // Se abbiamo già caricato tutti gli elementi => non facciamo nulla
      if (this.noNotifications || this.areAllNotificationLoaded) {
        return done();
      }

      // Altrimenti carichiamo la nuova pagina
      let filter = this.getQueryFilter();
      let offset = this.notificationList.length;
      let limit = this.limit;
      try {
        let {data} = await this.loadNotifications({offset, limit, filter});
        this.notificationList = [...this.notificationList, ...data];
        this.isFirstLoading =true
        done();
      } catch (e) {

      }

    },
    async loadNotifications({offset = 0, limit = 10, filter = {}}) {
      console.log('loadNotifications')
      if (isEmpty(filter)) filter = undefined;
      let params = {offset, limit, filter};
      this.isLoadingNotificationList = true;
      try {
        let response = await getNotifyMessages(this.user.cf, {params});

        this.totalNotificationsCount = getNotificationsTotalCount(response);
        return response;
      } catch (e) {
        let message = "Errore durante caricamento delle notiche."
        apiErrorNotify({e, message})
        this.totalNotificationsCount = 0
        return null
      } finally {
        this.isLoadingNotificationList = false;
      }

    },
    onNotificationClick(notification) {
      let name = PROFILE_NOTIFICATION_DETAIL.name;
      let params = {id: notification.id, notification};
      this.$router.push({name, params});
    },
    async onNotificationRemove(notification) {
      let taxCode = this.user.cf;
      let id = notification.id;

      try {
        await deleteMessage(taxCode, id);
        this.notificationList = this.notificationList.filter(
          n => n.id !== notification.id
        );
      } catch (error) {
        let message = "Non è stato possibile rimuovere la notifica";
        apiErrorNotify({error, message});
      }
    },
    openFilters() {
      this.isOpenFilters = !this.isOpenFilters
    },
    setFilters(val) {
      this.loadFilteredNotifications()

    }
  }
};
</script>

<style scoped lang="sass"></style>
