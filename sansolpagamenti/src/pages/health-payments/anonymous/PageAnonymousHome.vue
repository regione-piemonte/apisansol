<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<style scoped></style>


<template>
  <q-page>

    <!-- TABS -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <q-tabs>
      <q-route-tab
        label="Pagamenti sanitari"
        :to="$routes.HEALTH_PAYMENTS.ANONYMOUS_HEALTH_PAYMENTS"
        slot="title"
      />

      <q-route-tab
        label="Altri pagamenti"
        :to="$routes.HEALTH_PAYMENTS.ANONYMOUS_OTHER_PAYMENTS"
        exact
        slot="title"
      />

      <q-route-tab
        label="Recupera ricevuta"
        :to="$routes.HEALTH_PAYMENTS.ANONYMOUS_RECEIPT"
        slot="title"
      />
    </q-tabs>

    <div>
      <router-view></router-view>
    </div>
  </q-page>
</template>


<script>
    export default {
        name: 'PageAnonymousHome',
        data() {
            return {}
        },
        computed: {
            isUserLogged() {
                return this.$store.getters['global/isUserLogged']
            }
        },
        created() {
            console.debug('PageAnonymousHome created()', {isLogged: this.isUserLogged});
            if (this.isUserLogged) this.$router.push(this.$routes.HEALTH_PAYMENTS.APP)
        }
    }
</script>

