<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div id="q-app">
    <the-guard-bootstrap>
      <the-guard-auth-valid>
        <the-guard-fcm>
            <router-view />
        </the-guard-fcm>
      </the-guard-auth-valid>
    </the-guard-bootstrap>
  </div>
</template>
<script>
import TheGuardBootstrap from "src/components/TheGuardBootstrap";
import TheGuardFcm from "./components/TheGuardFcm";
import TheGuardAuthValid from "./components/TheGuardAuthValid";


export default {
  name: "App",
  components: {

    TheGuardAuthValid,
    TheGuardFcm,
    TheGuardBootstrap
  }
};
</script>
