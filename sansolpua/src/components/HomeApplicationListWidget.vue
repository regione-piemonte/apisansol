<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="home-application-list-widget">
    <!-- INTESTAZIONE -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <div class="row items-end">
      <div class="col-auto">
        <div class="text-h5 text-bold">
          Servizi
        </div>
        <div class="q-mt-xs">Vai al servizio che ti interessa</div>
      </div>

      <q-space />

      <div class="col-auto" v-if="$q.screen.gt.sm">
        <router-link :to="APP_LIST" class="lms-link" aria-label="Vedi tutti i servizi">
          Vedi tutti
        </router-link>
      </div>
    </div>



    <!-- LISTA APPLICAZIONI -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <div class="q-mt-md">
      <transition-group name="app-list" tag="div" class="row q-col-gutter-md">
        <div
          v-for="app in appListToShow"
          :key="app.id"
          class="col-12 col-sm-6 col-lg-12 col-xl-6"
        >
          <template v-if="isInMaintenance(app)">
            <home-application-list-item
              :app="app"
              :anonymous="!user"
              :favorite="app.__favorite"
              is-in-maintenance
              more-actions
              flat
              bordered
              class="cursor-pointer"
              @click-favorite-add="onFavoriteAdd(app)"
              @click-favorite-remove="onFavoriteRemove(app)"
              @click="onAppInMaintenanceClick(app)"
            />
          </template>

          <template v-else>
            <a :href="app.url" class="lms-link-seamless">
            <home-application-list-item
              :app="app"
              :anonymous="!user"
              :favorite="app.__favorite"
              more-actions
              flat
              bordered
              @click-favorite-add="onFavoriteAdd(app)"
              @click-favorite-remove="onFavoriteRemove(app)"
            />
            </a>
          </template>


        </div>
      </transition-group>
    </div>


      <lms-buttons class="q-mt-md" v-if="$q.screen.lt.md">
        <lms-button outline :to="APP_LIST" aria-label="Vedi tutti i servizi">Vedi tutti</lms-button>
      </lms-buttons>

  </div>
</template>

<script>
import HomeApplicationListItem from "./HomeApplicationListItem";
import {
  addAppFavorite,
  deleteAppFavorite,
  getAppFavoriteList
} from "../services/api";
import { apiErrorNotify, orderBy } from "../services/utils";
import { APP_LIST } from "../router/routes";
import HomeAppInMaintenanceDialogScreening from "./HomeAppInMaintenanceDialogScreening";

export default {
  name: "HomeApplicationListWidget",
  components: { HomeApplicationListItem },
  props: {},
  data() {
    return {
      APP_LIST,
      appFavoriteList: []
    };
  },
  computed: {
    user() {
      return this.$store.getters["getUser"];
    },
    appList() {
      return this.$store.getters["getAppList"];
    },
    appListVisible() {
      return this.appList.filter(
        a => a.visibile_home_desktop || a.visibile_home_mobile
      );
    },
    appAuthList() {
      let favoriteIdList = this.appFavoriteList.map(a => a.applicazione_id);

      let favoriteList = this.appListVisible.filter(a =>
        favoriteIdList.includes(a.id)
      );

      let notFavoriteList = this.appListVisible.filter(
        a => !favoriteIdList.includes(a.id)
      );

      favoriteList = favoriteList.map(a => ({ ...a, __favorite: true }));
      notFavoriteList = notFavoriteList.map(a => ({ ...a, __favorite: false }));

      favoriteList = orderBy(favoriteList, ["numero_accessi"], ["desc"]);
      notFavoriteList = orderBy(notFavoriteList, ["numero_accessi"], ["desc"]);

      return [...favoriteList, ...notFavoriteList];
    },
    appPublicList() {
      let result = this.appListVisible;
      // let result = this.appListVisible.filter(a => a.pubblico);
      result = orderBy(result, ["numero_accessi"], ["desc"]);
      return result;
    },
    appListToShow() {
      let result = this.appPublicList;
      if (this.user) result = this.appAuthList;
      //nascondiamo Trova un sul widget perché già presente la sezione dedicata in homepage
      result = result.filter(r => r.codice !== "TROVA_UN");
      return result.slice(0, 8);
    }
  },
  async created() {
    if (this.user) {
      try {
        this.loadAppFavoriteList();
      } catch (err) {
        console.error(err);
      }
    }
  },
  methods: {
    isLocked(app) {
      return !this.user && !app?.pubblico;
    },
    isInMaintenance(app) {
      // Al momento solo il vecchio screening è in manutenzione
      return ["RISCRE_OLD"].includes(app.codice);
    },
    onAppInMaintenanceClick(app) {
      // Se l'applicazione in manutenzione è il vecchio SCREENING => mostriamo la dialog di screening
      if (["RISCRE_OLD"].includes(app.codice)) {
        this.$q.dialog({
          parent: this,
          component: HomeAppInMaintenanceDialogScreening
        });

        return;
      }
    },
    async loadAppFavoriteList() {
      let taxCode = this.user?.cf;
      let { data } = await getAppFavoriteList(taxCode);
      this.appFavoriteList = data;
      return data;
    },
    async onFavoriteAdd(app) {
      try {
        let taxCode = this.user?.cf;
        let payload = {
          applicazione_id: app.id
        };

        let { data } = await addAppFavorite(taxCode, payload);

        // aggiungiamo l'app alle preferite
        this.appFavoriteList = [...this.appFavoriteList, data];
      } catch (error) {
        let message =
          "Non è stato possibile salvare il servizio come preferito";
        apiErrorNotify({ error, message });
      }
    },
    async onFavoriteRemove(app) {
      try {
        let taxCode = this.user?.cf;
        let favorite = this.appFavoriteList.find(
          f => f.applicazione_id === app.id
        );
        let id = favorite.id;

        await deleteAppFavorite(taxCode, id);

        // rimuoviamo l'app dalle preferite
        this.appFavoriteList = this.appFavoriteList.filter(
          f => f.applicazione_id !== app.id
        );
      } catch (error) {
        let message =
          "Non è stato possibile salvare il servizio come preferito";
        apiErrorNotify({ error, message });
      }
    }
  }
};
</script>

<style scoped lang="sass">
.app-list-move
  transition: transform 1s ease-in-out
</style>
