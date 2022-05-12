<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="home-login-widget" :class="{'home-login-widget--background': $q.screen.lt.md}">
    <h1
      class="h-text-font-nunito text-body1 text-primary text-bold q-mb-xl q-mt-md login-widget--title"
    >
      Il modo più facile di pensare alla tua salute
    </h1>

    <div class="row">
      <div class="col-12 col-md-6 col-lg">
        <div>
          <lms-layout-header-login-button
            :min-width="$q.screen.lt.lg"
            color="secondary"
            unelevated
            :flat="false"
            :dense="false"
          />
        </div>
        <div class="q-mt-sm text-body1">
          <span class="q-mr-xs">Non hai le credenziali?</span>
          <br v-if="$q.screen.gt.md"/>
          <a :href="urls.authGetCredentials()" class="lms-link">
            Scopri come ottenerle
          </a>
        </div>
        <div class=" text-body1" :class="$q.screen.gt.md ? 'q-mt-lg' : 'q-mt-sm'">
          Nel frattempo dai un'occhiata ai servizi ad
          <router-link :to="routeAppListPublic" class="lms-link">
            accesso libero
          </router-link>
        </div>
      </div>

      <div class="col">
        <!-- Spazio per le immagini -->
      </div>
    </div>
  </div>
</template>

<script>
import LmsLayoutHeaderLoginButton from "./core/LmsLayoutHeaderLoginButton";
import * as urls from "src/services/urls";
import { APP_LIST } from "../router/routes";

export default {
  name: "HomeLoginWidget",
  components: { LmsLayoutHeaderLoginButton },
  props: {

  },
  data() {
    return {
      urls,
      APP_LIST
    };
  },
  computed: {
    routeAppListPublic() {
      let name = APP_LIST.name;
      let query = { autorizzazione: "P" };
      return { name, query };
    }
  },
  created() {},
  methods: {}
};
</script>

<style scoped lang="sass">
.login-widget--title
  max-width: 420px
  font-size: 46px
  body.screen--md &
    max-width: 600px
@media (max-width: $breakpoint-sm-max)
  .login-widget--title
    font-size: 38px

.home-login-widget--background
  background: url(../../public/blob-alto-anonimo.svg)
  background-size: cover
  background-position: center bottom
  background-repeat: no-repeat

</style>
