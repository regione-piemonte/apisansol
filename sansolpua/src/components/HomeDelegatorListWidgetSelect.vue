<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="home-delegator-list-widget-select">
    <!-- INTESTAZIONE -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <div class="text-h5 text-bold">
      Deleghe
      <q-icon name="keyboard_arrow_right" size="xs"></q-icon>
      <a class="lms-link" href="#" @click.prevent="">
        {{ selectTitle }}
        <q-icon name="keyboard_arrow_down" size="sm"/>

        <q-menu>
          <q-list style="min-width: 100px">
            <q-item v-close-popup clickable @click="tab = TABS.DELEGATES">
              <q-item-section>Chi hai delegato</q-item-section>
            </q-item>
            <q-item v-close-popup clickable @click="tab = TABS.ADULT">
              <q-item-section>Chi ti ha delegato</q-item-section>
            </q-item>
            <q-item v-close-popup clickable @click="tab = TABS.MINOR">
              <q-item-section>I tuoi figli minori</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </a>
    </div>

    <!-- CARICAMENTO -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <template v-if="isLoading">
      <div class="q-py-md">
        <lms-scroll-horizontal
          classes="row no-wrap"
          controls
          controls-invisible-on-threshold
          hide-scrollbar
        >
          <div v-for="i in 3" :key="i" class="col-auto q-pa-md">
            <div class="row q-col-gutter-x-sm items-center">
              <div class="col-auto">
                <q-skeleton animation="none" size="46px" type="circle"/>
              </div>

              <div class="col">
                <q-skeleton type="text" width="80px"/>
                <q-skeleton type="text" width="110px"/>
              </div>
            </div>
          </div>
        </lms-scroll-horizontal>
      </div>
    </template>

    <!-- TABS -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <template v-else>
      <q-tab-panels v-model="tab" class="bg-transparent">
        <!-- DELEGATI -->
        <!-- ------------------------------------------------------------------------------------------------------- -->
        <q-tab-panel :name="TABS.DELEGATES" class="q-px-none">
          <lms-scroll-horizontal
            classes="row no-wrap"
            controls
            controls-invisible-on-threshold
            hide-scrollbar
          >
            <template v-if="delegateListSortedActive.length <= 0">
              <div class="col text-center">
                Non hai delegato nessuno
              </div>
            </template>

            <a
              v-for="delegate in delegateListSortedActive"
              :key="delegate.uuid"
              :href="urls.delegateDetail(delegate.uuid)"
              class="home-delegator-list-item col-auto q-pa-md lms-link-seamless"
            >
              <div class="row q-col-gutter-x-sm items-center">
                <div class="col-auto">
                  <q-icon
                    :name="getDelegatorIcon(delegate)"
                    class="no-pointer-events"
                    size="xl"
                  />
                </div>

                <div class="col">
                  {{ delegate.nome_delega }} <br/>
                  {{ delegate.cognome_delega }}
                </div>
              </div>
            </a>
          </lms-scroll-horizontal>
        </q-tab-panel>

        <!-- TAB ADULTI -->
        <!-- ---------- -->
        <q-tab-panel :name="TABS.ADULT" class="q-px-none">
          <lms-scroll-horizontal
            classes="row no-wrap"
            controls
            controls-invisible-on-threshold
            hide-scrollbar
          >
            <template v-if="delegatorAdultListSortedActive.length <= 0">
              <div class="col text-center">
                Non hai deleganti adulti
              </div>
            </template>
            <template v-if="!isTest">
              <a
                v-for="delegator in delegatorAdultListSortedActive"
                :key="delegator.uuid"
                :href="urls.delegatorListAdult()"
                class="home-delegator-list-item col-auto q-pa-md lms-link-seamless"
              >
                <div class="row q-col-gutter-x-sm items-center">
                  <div class="col-auto">
                    <q-icon
                      :name="getDelegatorIcon(delegator)"
                      class="no-pointer-events"
                      size="xl"
                    />
                  </div>

                  <div class="col">
                    {{ delegator.nome_delega }} <br/>
                    {{ delegator.cognome_delega }}
                  </div>
                </div>
              </a>
            </template>
            <template v-else>
              <div
                v-for="delegator in delegatorAdultListSortedActive"
                :key="delegator.uuid"
                class="home-delegator-list-item col-auto q-pa-md lms-link-seamless"
                @click="showDelegatorModal(delegator)"
              >
                <div class="row q-col-gutter-x-sm items-center">
                  <div class="col-auto">
                    <q-icon
                      :name="getDelegatorIcon(delegator)"
                      class="no-pointer-events"
                      size="xl"
                    />
                  </div>

                  <div class="col">
                    {{ delegator.nome_delega }} <br/>
                    {{ delegator.cognome_delega }}
                  </div>
                </div>
              </div>
            </template>
          </lms-scroll-horizontal>
        </q-tab-panel>

        <!-- TAB MINORI -->
        <!-- ---------- -->
        <q-tab-panel :name="TABS.MINOR" class="q-px-none">
          <lms-scroll-horizontal
            classes="row no-wrap"
            controls
            controls-invisible-on-threshold
            hide-scrollbar
          >
            <template v-if="delegatorAdultListSorted.length <= 0">
              <div class="col text-center">
                Non hai deleganti minori
              </div>
            </template>

            <a
              v-for="delegator in delegatorMinorListSorted"
              :key="delegator.uuid"
              :href="urls.delegatorListMinor()"
              class="home-delegator-list-item col-auto q-pa-md lms-link-seamless"
            >
              <div class="row q-col-gutter-x-sm items-center">
                <div class="col-auto">
                  <q-icon
                    :name="getDelegatorIcon(delegator)"
                    class="no-pointer-events"
                    size="xl"
                  />
                </div>

                <div class="col">
                  {{ delegator.nome_delega }} <br/>
                  {{ delegator.cognome_delega }}
                </div>
              </div>
            </a>
          </lms-scroll-horizontal>
        </q-tab-panel>
      </q-tab-panels>
    </template>

    <template v-if="isTest">
      <home-delegator-services-dialog
        v-model="isOpenDelegatorModal"
        :delegator="selectedDelegator"

      />
    </template>
  </div>
</template>

<script>
import {getDelegateList, getDelegatorList} from "../services/api";
import {date} from "quasar";
import {orderBy} from "../services/utils";
import LmsScrollHorizontal from "./core/LmsScrollHorizontal";
import * as urls from "src/services/urls";
import HomeDelegatorServicesDialog from "./HomeDelegatorServicesDialog";
import {DELEGATION_STATUS_MAP} from "../services/config";

const {getDateDiff} = date;

const TABS = {
  MINOR: "MINOR",
  ADULT: "ADULT",
  PROTECTED: "PROTECTED",
  DELEGATES: "DELEGATES"
};

export default {
  name: "HomeDelegatorListWidgetSelect",
  components: {HomeDelegatorServicesDialog, LmsScrollHorizontal},
  props: {},
  data() {
    return {
      urls,
      TABS,
      tab: TABS.DELEGATES,
      isLoading: false,
      isOpenDelegatorModal: false,
      selectedDelegator: null
    };
  },
  computed: {
    user() {
      return this.$store.getters["getUser"];
    },
    selectTitle() {
      let result = "Chi ti ha delegato";
      if (this.tab === TABS.MINOR) result = "I tuoi figli minori";
      if (this.tab === TABS.DELEGATES) result = "Chi hai delegato";
      return result;
    },
    delegateList() {
      return this.$store.getters["getDelegateList"];
    },
    delegateListSorted() {
      return orderBy(this.delegateList, ["nome_delega", "cognome_delega"]);
    },
    // Escludiamo i deleganti che hanno tutte le deleghe scadute o revocate
    delegateListSortedActive() {
      let codes = [
        DELEGATION_STATUS_MAP.ACTIVE,
        DELEGATION_STATUS_MAP.IS_EXPIRING,
        DELEGATION_STATUS_MAP.UPDATED
      ];

      return this.delegateListSorted.filter(delegate => {
        return delegate.deleghe.some(d => codes.includes(d.stato_delega));
      });
    },
    delegatorList() {
      return this.$store.getters["getDelegatorList"];
    },
    delegatorMinorList() {
      let now = new Date();

      return this.delegatorList.filter(d => {
        let diff = getDateDiff(now, d.data_nascita_delega, "years");
        return diff < 18;
      });
    },
    delegatorMinorListSorted() {
      return orderBy(this.delegatorMinorList, [
        "nome_delega",
        "cognome_delega"
      ]);
    },
    delegatorAdultList() {
      let now = new Date();

      return this.delegatorList.filter(d => {
        let diff = getDateDiff(now, d.data_nascita_delega, "years");
        return diff > 18;
      });
    },
    delegatorAdultListSorted() {
      return orderBy(this.delegatorAdultList, [
        "nome_delega",
        "cognome_delega"
      ]);
    },
    // Escludiamo i deleganti che hanno tutte le deleghe scadute o revocate
    delegatorAdultListSortedActive() {
      let codes = [
        DELEGATION_STATUS_MAP.ACTIVE,
        DELEGATION_STATUS_MAP.IS_EXPIRING,
        DELEGATION_STATUS_MAP.UPDATED
      ];

      return this.delegatorAdultListSorted.filter(delegator => {
        return delegator.deleghe.some(d => codes.includes(d.stato_delega));
      });
    },
    isTest() {
      return process.env.APP_IS_DEV || process.env.APP_IS_TEST;
    }
  },
  async created() {
    let delegateListPromise = this.$store.dispatch("loadDelegateList");
    let delegatorListPromise = this.$store.dispatch("loadDelegatorList");
    // TODO: Agganciare le API per leggere l'elenco dei tutelati appena saranno pronte per essere rilasciate in prod

    this.isLoading = true;

    try {
      await delegateListPromise;
    } catch (err) {
      console.error(err);
    }

    try {
      await delegatorListPromise;
    } catch (err) {
      console.error(err);
    }

    this.isLoading = false;
  },
  methods: {
    getDelegatorIcon(delegator) {
      let now = new Date();
      let diff = getDateDiff(now, delegator.data_nascita_delega, "years");
      let isMinor = diff < 18;
      let isFemale = ["F", "f"].includes(delegator.sesso_delega);

      if (isMinor && isFemale)
        return "img:/statics/la-mia-salute/icone/avatar-ragazza.svg";

      if (isMinor && !isFemale)
        return "img:/statics/la-mia-salute/icone/avatar-ragazzo.svg";

      if (!isMinor && isFemale)
        return "img:/statics/la-mia-salute/icone/avatar-donna.svg";

      return "img:/statics/la-mia-salute/icone/avatar-uomo.svg";
    },
    showDelegatorModal(delegator) {
      this.selectedDelegator = delegator;
      this.isOpenDelegatorModal = true;
    },
  }
};
</script>

<style lang="sass">

.home-delegator-list-item
  cursor: pointer
  border-radius: 8px
  transition: all .4s ease

  &:hover
    background-color: transparentize($primary, .8)
</style>
