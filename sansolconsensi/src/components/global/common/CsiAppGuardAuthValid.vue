<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="csi-app-guard-auth-valid">
    <slot v-if="isAuthValid"/>

    <template v-else>
      <q-layout>
        <csi-app-header no-menu-button/>

        <q-page-container>
          <q-page padding>
            <q-alert color="info">
              <div>
                Siamo spiacenti ma le tue credenziali non sono abilitate ad accedere a questo servizio.
                <br>
                <br>
                <a href="#" @click.prevent="goToGetCredentials">
                  <strong>Scopri come attenere le nuove credenziali</strong>
                </a>
              </div>
            </q-alert>
          </q-page>
        </q-page-container>

        <csi-app-footer no-rating no-version no-help/>
      </q-layout>
    </template>
  </div>
</template>


<script>
  import CsiAppHeader from "components/global/common/CsiAppHeader";
  import CsiAppFooter from "components/global/common/CsiAppFooter";
  import {openUrl} from "@services/global/utils";

  export default {
    name: 'CsiAppGuardAuthValid',
    components: {CsiAppFooter, CsiAppHeader},
    props: {},
    data() {
      return {}
    },
    computed: {
      user() {
        return this.$store.getters['global/user']
      },
      isUserLogged() {
        return this.$store.getters['global/isUserLogged']
      },
      isAuthValid() {
        if (!this.isUserLogged) return true;
        return this.user && this.user.autenticazione_valida
      }
    },
    created() {
    },
    methods: {
      goToGetCredentials() {
        let url = 'url'
        openUrl(url)
      }
    },
  }
</script>


<style scoped lang="stylus"></style>
