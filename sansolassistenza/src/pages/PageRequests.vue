<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <lms-page padding>
    <lms-page-title no-back>Le tue richieste di assistenza</lms-page-title>
    <!--    <template>-->
    <!--        <div class="q-mt-md">-->
    <!--            <div class="text-h3">Le tue richieste di assistenza</div>-->
    <!--        </div>-->
    <!--    </template>-->
    <div class="row justify-end">
      <lms-buttons :class="{'full-width q-mt-md': $q.screen.lt.sm, 'q-mb-md': $q.screen.lt.md}">
        <lms-button @click="newRequest">Nuova richiesta</lms-button>
      </lms-buttons>
    </div>


    <q-tabs
      active-color="primary"
      indicator-color="primary"
      align="center"
      no-caps
    >
      <q-route-tab :to="REQUESTS_OPENED" label="Richieste Aperte"/>
      <q-route-tab :to="REQUESTS_ARCHIVED" label="Archivio"/>
    </q-tabs>


    <router-view/>

  </lms-page>
</template>

<script>
import {REQUESTS_OPENED, REQUESTS_ARCHIVED, NEW_REQUEST_CHOOSE, REQUESTS} from "../router/routes";
import PageRequestsOpened from "./PageRequestsOpened";
import PageRequestsArchived from './PageRequestsArchived'

export default {
  name: "PageRequests",

  data() {
    return {
      keepAlive: [PageRequestsOpened.name, PageRequestsArchived.name],
      REQUESTS_OPENED,
      REQUESTS_ARCHIVED,
    };
  },
  computed: {
    isUserLogged() {
      return this.$store.getters["isUserLogged"];
    }
  },
  created() {
    if (!this.isUserLogged) this.$router.replace(NEW_REQUEST_CHOOSE)

    },
  methods: {
    newRequest() {
      this.$router.push(NEW_REQUEST_CHOOSE)
    }
  }
};
</script>
