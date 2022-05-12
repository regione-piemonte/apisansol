<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="csi-app-guard-session-id">
    <slot/>
  </div>
</template>


<script>
  import {uid} from 'quasar'

  const COOKIE_NAME = 'LMS_SESSION_ID';

  export default {
    name: "CsiAppGuardSessionId",
    data() {
      return {};
    },
    computed: {},
    created() {
      let sessionId = this.$q.cookies.get(COOKIE_NAME);

      if (!sessionId) {
        console.log('Creating session id');
        this.$q.cookies.set(COOKIE_NAME, uid(), {path: '/'});
      }
    },
    methods: {}
  };
</script>


<style scoped lang="stylus"></style>
