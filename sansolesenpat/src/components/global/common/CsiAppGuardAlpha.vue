<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="csi-alpha-guard">

    <!-- Mostriamo l'app se non siamo su Alpha oppure se l'utente ha inserito la password corretta -->
    <slot v-if="!isAlpha || canAccess" />
<!--    <slot v-if="canAccess" />-->

    <!-- Schermata di login alla versione di alpha  -->
    <div v-else class="q-pa-lg fixed-center">

      <q-card>
        <q-card-title>
          Per accedere alla versione di Alpha devi inserire la password che solo pochi eletti conoscono 😉
        </q-card-title>
        <q-card-main class="q-mt-md">
          <q-field>
            <q-input type="password" v-model="alphaPass" float-label="Password" />
          </q-field>

          <csi-buttons class="q-mt-xl">
            <csi-button primary label="Accedi" @click="onLogin" />
          </csi-buttons>
        </q-card-main>
      </q-card>
    </div>

  </div>
</template>


<script>
  const PASS_ALPHA = 'che solo pochi eletti conoscono';

  export default {
    name: "CsiAppGuardAlpha",
    components: {},
    props: {},
    data() {
      return {
        canAccess: false,
        alphaPass: ""
      };
    },
    computed: {
      isAlpha(){
        return this.$config.global.isAlpha
      }
    },
    created() {
    },
    methods: {
      onLogin() {

        if (this.alphaPass === PASS_ALPHA) {
          this.canAccess = true;
          return
        }

        this.$q.notify({
          color: 'negative',
          message: 'Password errata',
        })
      }
    }
  };
</script>


<style scoped lang="stylus"></style>
