<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div id="q-app">
    <template v-if="false">
      <q-layout>
        <lms-layout-header />

        <q-page-container>
          <q-page class="flex flex-center">
            <lms-maintenance class="full-width" />
          </q-page>
        </q-page-container>

        <lms-layout-footer />
      </q-layout>
    </template>

    <template v-else>
      <the-guard-bootstrap>
        <the-guard-auth-valid>
          <the-guard-fcm>
            <the-guard-pwa-install-ios-dialog>
<!--              <the-guard-enrollment>-->
                <router-view />
<!--              </the-guard-enrollment>-->
            </the-guard-pwa-install-ios-dialog>
          </the-guard-fcm>
        </the-guard-auth-valid>
      </the-guard-bootstrap>
    </template>
  </div>
</template>
<script>
import TheGuardBootstrap from "src/components/TheGuardBootstrap";
import TheGuardFcm from "./components/TheGuardFcm";
import TheGuardAuthValid from "./components/TheGuardAuthValid";
// import TheGuardEnrollment from "./components/TheGuardEnrollment";
import LmsMaintenance from "./components/core/LmsMaintenance";
import LmsLayoutHeader from "./components/core/LmsLayoutHeader";
import LmsLayoutFooter from "./components/core/LmsLayoutFooter";
import TheGuardPwaInstallIosDialog from "components/TheGuardPwaInstallIosDialog";

export default {
  name: "App",
  components: {
    TheGuardPwaInstallIosDialog,
    LmsLayoutFooter,
    LmsLayoutHeader,
    LmsMaintenance,
    // TheGuardEnrollment,
    TheGuardAuthValid,
    TheGuardFcm,
    TheGuardBootstrap
  }
};
</script>
