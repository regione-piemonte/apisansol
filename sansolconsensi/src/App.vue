<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div id="q-app">
    <template v-if="$isRedirecting"></template>

    <template v-else-if="false">
      <maintenance no-actions/>
    </template>

    <template v-else>
      <csi-app-guard-session-id>
        <csi-app-guard-service-worker>
          <csi-app-guard-browser>
            <!--        <csi-app-guard-alpha>-->
            <csi-app-bootstrap>
              <csi-app-guard-maintenance2>
                <csi-app-guard-auth-valid>
                  <csi-app-guard-fcm>
                    <csi-app-guard-pwa-install-ios-modal>
                      <!--                      <csi-enrollment-guard>-->
                      <router-view/>
                      <!--                      </csi-enrollment-guard>-->
                    </csi-app-guard-pwa-install-ios-modal>
                  </csi-app-guard-fcm>
                </csi-app-guard-auth-valid>
              </csi-app-guard-maintenance2>
            </csi-app-bootstrap>
            <!--        </csi-app-guard-alpha>-->
          </csi-app-guard-browser>
        </csi-app-guard-service-worker>
      </csi-app-guard-session-id>
    </template>
  </div>
</template>

<script>

  import CsiAppGuardFcm from "components/global/common/CsiAppGuardFcm"
  import CsiAppBootstrap from "components/global/common/CsiAppBootstrap";
  import CsiAppGuardBrowser from "components/global/common/CsiAppGuardBrowser";
  // import CsiAppGuardAlpha from "components/global/common/CsiAppGuardAlpha";
  import CsiAppGuardMaintenance from "components/global/common/CsiAppGuardMaintenance";
  import CsiAppGuardServiceWorker from "components/global/common/CsiAppGuardServiceWorker";
  import CsiAppGuardUpdateMandatory from "components/global/common/CsiAppGuardUpdateMandatory";
  import CsiAppGuardAuthValid from "components/global/common/CsiAppGuardAuthValid";
  import CsiAppGuardPwaInstallIosModal from "components/global/common/CsiAppGuardPwaInstallIosModal";
  import CsiAppGuardSessionId from "components/global/common/CsiAppGuardSessionId";
  import Maintenance from "pages/global/errors/Maintenance";
  // import CsiEnrollmentGuard from "./components/enrollment/CsiEnrollmentGuard";
  import CsiAppGuardMaintenance2 from "./components/global/common/CsiAppGuardMaintenance2";


  export default {
    name: "App",
    components: {
      CsiAppGuardMaintenance2,
      // CsiEnrollmentGuard,
      Maintenance,
      CsiAppGuardSessionId,
      CsiAppGuardPwaInstallIosModal,
      CsiAppGuardAuthValid,
      CsiAppGuardUpdateMandatory,
      CsiAppGuardServiceWorker,
      CsiAppGuardMaintenance,
      // CsiAppGuardAlpha,
      CsiAppGuardBrowser,
      CsiAppBootstrap,
      CsiAppGuardFcm,

    },
    data() {
      return {}
    },
  };
</script>

<style>
</style>
