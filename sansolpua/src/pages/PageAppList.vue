<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-page padding class="home-page-app-list">
    <lms-page-title>
      I servizi di Salute Piemonte
    </lms-page-title>

    <!-- FILTRI -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <q-card flat bordered class="q-mt-md q-mb-xl" v-if="$q.screen.gt.sm">
      <q-card-section>
        <div class="row q-col-gutter-md">
          <div class="col-auto gt-sm self-center text-bold">
            <q-icon name="filter_list" size="sm" class="q-mr-sm" />
            Filtri
          </div>

          <div class="col-12 col-md col-lg-3">
            <q-select
              v-model="categorySelected"
              :options="categoryList"
              option-value="codice"
              option-label="descrizione"
              label="Categoria"
              dense
              :loading="isLoading"
              clearable
            />
          </div>

          <q-space class="gt-sm" />

          <div class="col-12 col-md col-lg-3">
            <q-select
              v-model="visibilitySelected"
              :options="visibilityList"
              option-value="codice"
              optionLabel="descrizione"
              label="Autenticazione"
              dense
              clearable
            />
          </div>

          <div class="col-12 col-md col-lg-3">
            <q-select
              v-model="orderSelected"
              :options="orderList"
              option-value="codice"
              optionLabel="descrizione"
              emit-value
              map-options
              label="Ordina per"
              dense
              clearable
            />
          </div>
        </div>
      </q-card-section>
    </q-card>
    <template v-else>
      <div
        class="text-right text-bold cursor-pointer "
        @click="toggleFilter()"
        style="z-index:1000"
      >
        <q-icon name="filter_list" size="sm" class="q-mr-sm" />
        Filtri
      </div>

      <div>
        <q-slide-transition>
          <q-card flat bordered class="q-mt-md q-mb-xl" v-if="isOpenFilter">
            <q-card-section class="q-pa-md row q-col-gutter-x-lg">
              <div class="col-12 col-sm-4 q-pb-lg">
                <q-select
                  v-model="categorySelected"
                  :options="categoryList"
                  option-value="codice"
                  option-label="descrizione"
                  label="Categoria"
                  dense
                  :loading="isLoading"
                  clearable
                />
              </div>
              <div class="col-12 col-sm-4 q-pb-lg">
                <q-select
                  v-model="visibilitySelected"
                  :options="visibilityList"
                  option-value="codice"
                  optionLabel="descrizione"
                  label="Autenticazione"
                  dense
                  clearable
                />
              </div>
              <div class="col-12 col-sm-4 q-pb-lg">
                <q-select
                  v-model="orderSelected"
                  :options="orderList"
                  option-value="codice"
                  optionLabel="descrizione"
                  emit-value
                  map-options
                  label="Ordina per"
                  dense
                  clearable
                />
              </div>
            </q-card-section>
          </q-card>
        </q-slide-transition>
      </div>
    </template>
    <!-- LISTA APPLICAZIONI -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <div class="q-mt-md row q-col-gutter-md items-stretch">
      <div
        v-for="app in appListEnhancedFiltered"
        :key="app.codice"
        class="col-12 col-md-6 col-lg-4"
      >
        <home-application-list-item
          :app="app"
          description
          actions
          more-actions
          :anonymous="!user"
          :favorite="app.__favorite"
          :is-in-maintenance="isInMaintenance(app)"
          style="min-height: 300px"
          @click-favorite-add="onFavoriteAdd(app)"
          @click-favorite-remove="onFavoriteRemove(app)"
          @click="onAppInMaintenanceClick(app)"
        />
      </div>
    </div>
  </q-page>
</template>

<script>
import HomeApplicationListItem from "../components/HomeApplicationListItem";
import {
  addAppFavorite,
  deleteAppFavorite,
  getAppCategoryList,
  getAppFavoriteList
} from "../services/api";
import { apiErrorNotify, orderBy } from "../services/utils";
import {ORDER_APP_LIST_MAP} from "src/services/config";
import HomeAppInMaintenanceDialogScreening from "../components/HomeAppInMaintenanceDialogScreening";


const ORDER_LIST = [
  { codice: ORDER_APP_LIST_MAP.USE, descrizione: "Più utilizzati" },
  { codice: ORDER_APP_LIST_MAP.ALPHABETIC, descrizione: "Nome servizio" }
  ];
const VISIBILITY_MAP = {
  AUTH: "A",
  PUBLIC: "P"
};

const VISIBILITY_LIST = [
  { codice: VISIBILITY_MAP.PUBLIC, descrizione: "Facoltativa" },
  { codice: VISIBILITY_MAP.AUTH, descrizione: "Obbligatoria" }
];

export default {
  name: "PageAppList",
  components: { HomeApplicationListItem },
  props: {},
  data() {
    return {
      isLoading: false,
      categoryList: [],
      categorySelected: "",
      visibilityList: VISIBILITY_LIST,
      visibilitySelected: null,
      orderList: ORDER_LIST,
      orderSelected: null,
      appFavoriteList: [],
      isOpenFilter: false
    };
  },
  computed: {
    appList() {
      return this.$store.getters["getAppList"];
    },
    user() {
      return this.$store.getters["getUser"];
    },
    appListEnhanced() {
      let favoriteIdList = this.appFavoriteList.map(a => a.applicazione_id);

      return this.appList.map(a => {
        return {
          ...a,
          __favorite: favoriteIdList.includes(a.id)
        };
      });
    },
    appListEnhancedFiltered() {
      let isMobile = this.$q.platform.is.mobile;
      let result = this.appListEnhanced.filter(a => {
        if (isMobile) return a.visibile_home_mobile;
        return a.visibile_home_desktop;
      });

      if (this.categorySelected) {
        result = result.filter(
          a => a.categoria_id === this.categorySelected?.codice
        );
      }

      if (this.visibilitySelected) {
        let isPublic =
          this.visibilitySelected?.codice === VISIBILITY_MAP.PUBLIC;
        result = result.filter(a => a.pubblico === isPublic);
      }

      if (this.orderSelected === ORDER_APP_LIST_MAP.USE) {
          result = orderBy(
            result,
            ["numero_accessi", "posizione"],
            ["desc", "asc"]
          );
      }else if(this.orderSelected === ORDER_APP_LIST_MAP.ALPHABETIC){
        result = orderBy(result, ["descrizione"], ["asc"]);
      }else{
        result = orderBy(result, ["posizione"], ["asc"]);
      }
      return result;
    }
  },
  async created() {
    let { autorizzazione } = this.$route.query;
    this.visibilitySelected = this.visibilityList.find(
      v => v.codice === autorizzazione
    );

    let favoriteListPromise = null;
    let taxCode = this.user?.cf;

    if (this.user) favoriteListPromise = getAppFavoriteList(taxCode);
    let categoryListPromise = getAppCategoryList();

    this.isLoading = true;

    if (favoriteListPromise) {
      try {
        let { data } = await favoriteListPromise;
        this.appFavoriteList = data;
      } catch (error) {
        console.error(error);
      }
    }

    try {
      let { data } = await categoryListPromise;
      this.categoryList = data;
    } catch (error) {
      console.error(error);
    }

    this.isLoading = false;
  },
  methods: {
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
    },
    toggleFilter() {
      this.isOpenFilter = !this.isOpenFilter;
    },
  }
};
</script>

<style scoped lang="sass">
.home-page-app-list
  max-width: 1440px
  margin: auto
</style>
