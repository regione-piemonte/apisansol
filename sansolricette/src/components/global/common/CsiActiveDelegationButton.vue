<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<style scoped></style>


<template>
  <q-btn flat dense :round="$q.screen.lt.md" no-caps icon="people">
    <q-popover style="min-width: 180px" max-height="80%">

      <template v-if="hasAjaxError">
        <q-item>
          <q-item-main>
            Siamo spiacenti, al momento non è possibile recuperare informazioni sulle deleghe
          </q-item-main>
        </q-item>
      </template>

      <template v-else>
        <q-list v-if="delegators.length <= 0">
          <q-item>
            <q-item-main>
              Non hai ancora deleghe a tuo nome.
            </q-item-main>
          </q-item>
        </q-list>

        <q-list v-else link class="no-padding">
          <q-item dense>
            <q-item-main>
              <q-item-tile sublabel>Deleghe</q-item-tile>
            </q-item-main>
          </q-item>
          <q-item v-for="delegator in delegators"
                  :key="delegator.uuid"
                  @click.native="$emit('click', delegator)"
                  v-close-overlay>
            {{getFullName(delegator) | startCase}}
            <template v-if="$config.global.isDevelopment || $config.global.isTest">
              <br>
              {{delegator.codice_fiscale_delega}}
            </template>
          </q-item>
        </q-list>

        <q-item @click.native="goToDelegations" class="bg-grey-3" link>
          <q-item-main>Gestisci deleghe</q-item-main>
        </q-item>
      </template>
    </q-popover>
    <div class="gt-sm q-pl-xs">Deleghe</div>
    <q-tooltip>Deleghe</q-tooltip>
  </q-btn>
</template>


<script>
  export default {
    name: "CsiActiveDelegationButton",
    props: {
      delegators: {type: Array, required: true},
      hasAjaxError: {type: Boolean, required: false, default: false},
    },
    methods: {
      getFullName(delegator) {
        let {cognome_delega, nome_delega} = delegator
        return `${nome_delega} ${cognome_delega}`
      },
      goToDelegations() {
        // @TODO: prendere dalle API
        window.location.assign('/la-mia-salute/deleghe/');
        // this.$router.push(this.$routes.DELEGATIONS.APP)
      }
    }
  }
</script>
