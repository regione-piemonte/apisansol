<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="covid-guard-anonymous">
    <!-- UTENTE LOGGATO CON SPID -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <template v-if="user">
      <slot/>
    </template>

    <!-- UTENTE LOGGATO TRAMITE OTP -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <template v-else-if="isOtpLoginActive">
      <slot/>
    </template>

    <!-- ROUTES ACCESSIBILI ANCHE SE NON AUTENTICATO -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <template v-else-if="isFreeRoute">
      <slot/>
    </template>

    <!-- UTENTE NON LOGGATO -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <template v-else>
      <lms-page padding>
        <!--        <div class="q-px-md q-py-xl">-->
        <!--          Questo servizio è pensato per tutti i cittadini che, a vario titolo,-->
        <!--          sono stati inseriti nel percorso diagnostico per Covid-19: ad esempio-->
        <!--          su segnalazione del Medico di Medicina Generale, Pediatra di Libera-->
        <!--          Scelta, del SISP, o per aver effettuato di propria iniziativa un-->
        <!--          tampone presso laboratori di analisi privati. Hai a disposizione due-->
        <!--          modalità per accedere.-->
        <!--        </div>-->

        <div class="q-px-md q-pb-xl">
          Questo servizio è pensato per consultare gli esiti dei tamponi e i
          provvedimenti di isolamento o quarantena. Hai a disposizione due
          modalità per accedere
        </div>

        <div class="q-pa-md row q-col-gutter-md">
          <div class="col-12 col-md">
            <q-card class="covid-guard-anonymous__card" @click.native="onLogin">
              <div class="q-pa-md text-bold">
                <lms-button outline class="full-width" @click="onLogin">Accedi con Credenziali</lms-button>
              </div>

              <div class="q-pa-md q-body-1">
                Usa questa modalità per accedere con le credenziali abilitate:

                <ul>
                  <li>
                    <span class="text-bold">SPID</span> è il sistema di accesso
                    che consente di utilizzare, con un'identità digitale unica,
                    i servizi online della Pubblica Amministrazione e dei
                    privati accreditati.
                  </li>
                  <li>
                    <span class="text-bold">Carta d’identià Elettronica</span>
                    (CIE).
                  </li>
                  <li>
                    <span class="text-bold">Certificato digitale</span> in
                    formato Carta Nazionale dei Servizi (es. TS-CNS)
                  </li>
                </ul>
              </div>
            </q-card>
          </div>

          <div class="col-12 col-md">
            <q-card
              class="covid-guard-anonymous__card"
              @click.native="onLoginOtp"
            >
              <div class="q-pa-md text-bold">
                <lms-button outline class="full-width" @click="onLoginOtp"> Accedi con Tessera Sanitaria e OTP</lms-button>
              </div>

              <div class="q-pa-md q-body-1">
                Usa questa modalità se non hai nessuna delle credenziali
                abilitate. In questo caso ti verrà chiesto di inserire il
                <span class="text-bold">codice fiscale</span>, il numero di
                <span class="text-bold">tessera sanitaria</span> (TEAM) e la
                <span class="text-bold">password temporanea</span> (OTP) che ti
                verrà recapitata tramite SMS al tuo cellulare.
              </div>

              <div class="q-pa-md q-body-1">
                <span class="text-bold">Attenzione</span>: per questo tipo di
                accesso è necessario che il
                <span class="text-bold"
                >numero di telefono</span> associato al codice fiscale e alla tessera sanitaria sia stato <strong>precedentemente registrato</strong> dalla ASL o dal medico/pediatra di famiglia come contatto
                per quel codice fiscale in relazione a tamponi, isolamenti o quarantene.

              </div>
            </q-card>
          </div>
        </div>

        <covid-attachment-buttons class="q-pa-md"/>
        <!-- MODALE DI LOGIN OTP -->
        <!-- ------------------- -->
        <covid-login-otp-dialog
          v-model="isLoginOtpModalVisible"
          @success="onLoginOtpSuccess"
        />
      </lms-page>
    </template>
  </div>
</template>

<script>
import CovidLoginOtpDialog from "./CovidLoginOtpDialog";
import {login} from "../services/utils";
import {HELP_CONTACTS} from "../router/routes";
import CovidAttachmentButtons from "./CovidAttachmentButtons";

export default {
  name: "CovidGuardAnonymous",
  components: {
    CovidAttachmentButtons,
    CovidLoginOtpDialog,
  },
  data() {
    return {
      isLoginOtpModalVisible: false,
      isLoading: false,
      citizenError: null,
    };
  },
  computed: {
    user() {
      return this.$store.getters["getUser"];
    },
    isOtpLoginActive() {
      return this.$store.getters["isOtpLoginActive"];
    },
    isFreeRoute() {
      let routes = [HELP_CONTACTS.name];

      return routes.includes(this.$route.name);
    },
  },
  created() {
    this.$store.dispatch("checkOtpSession");
  },
  methods: {
    goToServiceHome() {
      this.$router.push(this.$routes.COVID.APP);
    },
    // goToFaq() {
    //   this.$router.push(this.$routes.COVID.FAQ)
    // },
    goToContacts() {
      this.$router.push(this.$routes.COVID.CONTACTS);
    },
    onLogin() {
      this.$matomo?.trackEvent?.("AZIONE", "COVID_LOGIN", "Covid - Accesso");
      login("/api/bff/login");
    },
    onLoginOtp() {
      this.isLoginOtpModalVisible = true;
    },
    onLoginOtpSuccess() {
      this.$store.dispatch("startOtpSession");
      this.$matomo?.trackEvent?.(
        "AZIONE",
        "COVID_LOGIN_OTP",
        "Covid - Accesso OTP"
      );

      // Dopo il login con OTP ricarichiamo la pagina per far scattare
      // nuovamente il bootstrap
      let url = new URL(window.location.origin + window.location.pathname);
      window.location.assign(url.origin + url.pathname);
    },
  },
};
</script>

<style lang="scss">
.covid-guard-anonymous__card {
  height: 100%;
  cursor: pointer;
  transition: $shadow-transition;

  &:hover {
    box-shadow: $shadow-10;
  }
}
</style>
