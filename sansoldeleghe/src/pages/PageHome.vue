<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <lms-page padding>
    <template v-if="isUserMinor">
      <q-banner  class="h-banner h-banner--warning q-my-lg">
        <div class="text-body1">
          Questo servizio non è accessibile ai cittadini minorenni
        </div>
      </q-banner>
    </template>
    <template v-else>

      <!-- NUOVA GESTIONE ARRUOLAMENTO -->
      <!-- ----------------------------------------------------------------------------------------------------------- -->
      <template v-if="IS_NEW_ENROLLABLE_ACTIVE">
        <div class="q-my-md">
          <the-guard-enrollment2 :code="enrollmentCode" />
        </div>
      </template>

      <q-tabs v-model="tab" active-color="primary" align="left" no-caps>
        <template v-if="isPiedmontUser">
          <q-route-tab
            class="text-subtitle1 q-py-sm"
            label="Chi hai delegato"
            :to="DELEGATE_LIST"
            name="delegati"
          />

        </template>

        <q-route-tab
          class="text-subtitle1 q-py-sm"
          label="Chi ti ha delegato"
          :to="DELEGATOR_LIST"
          name="deleganti"
        />

        <q-route-tab
          class="text-subtitle1 q-py-sm"
          label="I tuoi figli minori"
          :to="DECLARATION_MINOR_LIST"
          name="minori"
        />

        <!--      <q-route-tab-->
        <!--        class="text-subtitle1 q-py-sm"-->
        <!--        label="Tutelati"-->
        <!--        :to="DECLARATION_PROTECTED_LIST"-->
        <!--        name="tutelati"-->
        <!--      />-->

      </q-tabs>
      <transition
        enter-active-class="animated fadeIn csi-animation-duration--300"
        leave-active-class="animated fadeOut csi-animation-duration--300"
        mode="out-in">
        <keep-alive :include="keepAlive">
          <router-view></router-view>
        </keep-alive>
      </transition>
    </template>
  </lms-page>
</template>

<script>
import {
  DECLARATION_MINOR_LIST,
  DECLARATION_PROTECTED_LIST,
  DELEGATE_LIST,
  DELEGATOR_LIST,
  HOME
} from "src/router/routes";
import {getAppDelegables, getDelegablesApp} from "src/services/api";
import {apiErrorNotify} from "src/services/utils";
import {isMinor} from "src/services/business-logic";
import {IS_NEW_ENROLLABLE_ACTIVE} from "src/services/config";
import TheGuardEnrollment2 from "components/TheGuardEnrollment2";

export default {
  name: "PageHome",
  components: {TheGuardEnrollment2},
  data() {
    return {
      DECLARATION_MINOR_LIST,
      DECLARATION_PROTECTED_LIST,
      DELEGATE_LIST,
      IS_NEW_ENROLLABLE_ACTIVE,
      DELEGATOR_LIST,
      HOME,
      keepAlive: [
        // PagePiedmontDelegates.name,
        // PagePiedmontDelegators.name,
        // PagePiedmontMinors.name,
        // PagePiedmontProtectionList.name,
      ],
      tab: "",
    };
  },
  computed: {
    user(){
      return this.$store.getters['getUser']
    },
    isPiedmontUser() {
      return this.$store.getters['isPiedmontUser']
    },

    userInfo(){
      return this.$store.getters['getUserInfo']
    },
    isUserMinor(){
      let birthDate = this.userInfo?.info_anag?.dati_primari?.data_nascita;
      return isMinor(birthDate)
    },
    activeUserEnrollmentInfo(){
      return this.$store.getters["getEnrollmentInfo"];
    },
    enrollmentCode() {
      return this.activeUserEnrollmentInfo?.codice_risposta;
    },
  },
  beforeRouteUpdate(to, from, next) {
    this.handleNavigation(to, from, next)
  },
  created() {
    this.handleNavigation(this.$route)
  },
  methods: {
    handleNavigation(to, from, next) {
      // @TODO: cosa fare in caso di utente non loggato?
      if (!this.user || this.isUserMinor) return;


      // Quando la route target è proprio la home
      // => significa che l'utente ha cliccato sul box di "deleghe" oppure
      //    è arrivato da qualche URL che punta direttamente al servizio
      //
      // In questo caso gestiamo dove redirigere l'utente
      if (to.name === HOME.name) {
        // Di default effettuiamo il redirect alla lista di delegati
        let route = DELEGATE_LIST

        // Gli utenti non piemontesi invece di default atterrano sulla lista dei deleganti
        if (!this.isPiedmontUser) route = DELEGATOR_LIST

        // Se nella query string abbiamo il parametro tab, lo usaiamo per decidere su quale delle 3 atterrare.
        let {tab} = this.$route.query

        // Se ci dicono di andare sul tab "deleganti" => andiamo sul tab deleganti
        if (tab === 'deleganti') route = DELEGATOR_LIST

        // Se ci dicono di andare sul tab "minori" => andiamo sul tab minori
        if (tab === 'minori') route = DECLARATION_MINOR_LIST

        // Se ci dicono di andare sul tab "tutelati" => andiamo sul tab tutelati
        if (tab === 'tutelati') route = DECLARATION_PROTECTED_LIST

        console.log('pushing:', route.name)
        next ? next(route) : this.$router.push(route)
        return
      }

      if (!this.isPiedmontUser && to.name === DELEGATE_LIST) {
        let route = DELEGATOR_LIST
        next ? next(route) : this.$router.push(route)
        return;
      }

      if (next) next()
    }
  }
};
</script>
