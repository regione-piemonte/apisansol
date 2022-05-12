<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div id="q-app">
      <the-guard-bootstrap>
        <the-guard-login-required>
          <the-guard-auth-valid>
            <the-guard-fcm>
              <the-guard-enrollment>
                <router-view/>
              </the-guard-enrollment>
            </the-guard-fcm>
          </the-guard-auth-valid>
        </the-guard-login-required>
      </the-guard-bootstrap>
  </div>
</template>
<script>
import TheGuardBootstrap from "src/components/TheGuardBootstrap";
import TheGuardFcm from "./components/TheGuardFcm";
import TheGuardAuthValid from "./components/TheGuardAuthValid";
import TheGuardEnrollment from "./components/TheGuardEnrollment";
import TheGuardLoginRequired from "components/TheGuardLoginRequired";


export default {
  name: "App",
  components: {
    TheGuardLoginRequired,
    TheGuardEnrollment,
    TheGuardAuthValid,
    TheGuardFcm,
    TheGuardBootstrap
  }
};
</script>
