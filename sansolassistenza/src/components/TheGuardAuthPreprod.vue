<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="lms-the-guard-auth-preprod">
    <template v-if="isAuthValid">
      <slot />
    </template>

    <template v-else>
      <q-layout>
        <lms-layout-header />

        <q-page-container>
          <lms-page padding>
            <q-card flat class="bg-transparent">
              <q-card-section>
                <h2 class="q-mt-none q-mb-md">
                  Sei un cittadino che ha bisogno di assistenza?
                </h2>

                <p>
                  Scrivi alla casella di posta
                  <a href="mailto:assistenza.salute@csi.it" class="lms-link"
                    >assistenza.salute@csi.it</a
                  >
                  specificando:
                </p>

                <ul>
                  <li>Codice Fiscale</li>
                  <li>Cognome</li>
                  <li>Nome</li>
                  <li>Recapito telefonico</li>
                  <li>Descrizione del problema</li>
                  <li>Servizio on line utilizzato</li>
                </ul>
              </q-card-section>
            </q-card>

            <q-card flat class="bg-transparent q-mt-md">
              <q-card-section>
                <q-form greedy ref="form" @submit="onLogin">
                  <h2 class="q-mt-none q-mb-md">
                    Sei un operatore del CSI?
                  </h2>

                  <p class="q-mb-none">
                    Inserisci le credenziali e premi conferma
                  </p>

                  <q-input
                    v-model="password"
                    :type="isPassword ? 'password' : 'text'"
                    filled
                    class="q-mt-md"
                  >
                    <template v-slot:append>
                      <q-icon
                        :name="isPassword ? 'visibility_off' : 'visibility'"
                        class="cursor-pointer"
                        @click="isPassword = !isPassword"
                      />
                    </template>
                  </q-input>

                  <lms-buttons class="q-mt-md">
                    <lms-button type="submit">
                      Conferma
                    </lms-button>
                  </lms-buttons>
                </q-form>
              </q-card-section>
            </q-card>
          </lms-page>
        </q-page-container>

        <lms-layout-footer />
      </q-layout>
    </template>
  </div>
</template>

<script>
import LmsLayoutHeader from "./core/LmsLayoutHeader";
import LmsLayoutFooter from "./core/LmsLayoutFooter";

const PSW = "PSW";
const STORAGE_KEY = 'KEY'

export default {
  name: "TheGuardAuthPreprod",
  components: { LmsLayoutFooter, LmsLayoutHeader },
  data() {
    return {
      isPassword: true,
      isAuthValid: false,
      password: ""
    };
  },
  computed: {
    user() {
      return this.$store.getters["getUser"];
    },
  },
  created(){
    this.isAuthValid = this.$q.sessionStorage.getItem(STORAGE_KEY) === true;
    // Attiviamo il controllo solo in prod
    if (!process.env.APP_IS_PROD) this.isAuthValid = true;
  },
  methods: {
    onLogin() {
      if (!this.password) {
        this.$q.notify({
          color: "negative",
          message: "Inserisci la password"
        });

        return;
      }

      if (this.password !== PSW) {
        this.$q.notify({
          color: "negative",
          message: "Inserisci la password corretta"
        });

        return;
      }

      this.$q.sessionStorage.set(STORAGE_KEY, true);
      this.isAuthValid = true;
    }
  }
};
</script>

<style scoped></style>
