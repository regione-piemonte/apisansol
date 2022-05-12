<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-page padding>


    <div class="row gutter-md">

      <!-- INFORMAZIONI -->
      <!-- --------------------------------------------------------------------------------------------------------- -->
      <div class="col-12">
        <q-alert color="info">
          <span v-html="$t('HEALTH_PAYMENTS.ANONYMOUS_HOME.INFO')"></span>
        </q-alert>
      </div>


      <!-- PAGAMENTI SANITARI -->
      <!-- --------------------------------------------------------------------------------------------------------- -->
      <div class="col-12">
        <q-card class="bg-white">
          <q-card-main>
            <div class="row gutter-md">

              <div class="col-12 col-md-5 col-xl-5">
                <img
                  src="statics/images/banners/health-payments-empty.svg"
                  alt="Icona Pagamenti sanitari"
                  class="responsive"
                />
              </div>

              <div class="col-12 col-md">

                <div class="column full-height">

                  <div class="col">
                    <div v-html="$t('HEALTH_PAYMENTS.ANONYMOUS_HOME.PAYMENTS.MAIN')"></div>

                    <!-- BOTTONE "Mostra di più" -->
                    <div class="row items-center q-mb-md text-primary text-weight-bold cursor-pointer"
                         @click="toggleShowMore">
                      <div class="col-auto">
                        <q-icon
                          name="keyboard_arrow_down"
                          class="csi-icon--sm show-more-icon"
                          :class="{'show-more-icon--active': isShowingMore}"
                        />
                      </div>
                      <div class="col">
                        <span v-if="isShowingMore">Mostra di meno</span>
                        <span v-else>Mostra di più</span>
                      </div>
                    </div>


                    <q-slide-transition>
                      <div v-if="isShowingMore" v-html="$t('HEALTH_PAYMENTS.ANONYMOUS_HOME.PAYMENTS.MORE')"></div>
                    </q-slide-transition>
                  </div>

                  <div class="col-auto">
                    <csi-buttons class="q-pa-sm">
                      <csi-button primary label="Paga"
                                  @click="$router.push($routes.HEALTH_PAYMENTS.ANONYMOUS_HEALTH_PAYMENTS)" />
                    </csi-buttons>
                  </div>

                </div>


              </div>

            </div>
          </q-card-main>
        </q-card>
      </div>


      <!-- ALTRI PAGAMENTI -->
      <!-- ----------------------------------------------------------------------------------------------------------- -->
      <!--      <div v-if="!$config.global.isProduction" class="col-12 col-md-6">-->
      <!--        <q-card class="bg-white">-->
      <!--          <q-card-main>-->
      <!--            <div v-html="$t('HEALTH_PAYMENTS.ANONYMOUS_HOME.OTHER_PAYMENTS')"></div>-->
      <!--          </q-card-main>-->

      <!--          <csi-buttons class="q-pa-sm">-->
      <!--            <csi-button primary label="Paga" @click="$router.push($routes.HEALTH_PAYMENTS.ANONYMOUS_OTHER_PAYMENTS)" />-->
      <!--          </csi-buttons>-->
      <!--        </q-card>-->
      <!--      </div>-->


      <!-- RICEVUTA PAGAMENTO -->
      <!-- ----------------------------------------------------------------------------------------------------------- -->
      <!--      <div class="col-12 col-md-6">-->
      <div class="col-12">
        <q-card class="bg-white">
          <q-card-main>
            <div v-html="$t('HEALTH_PAYMENTS.ANONYMOUS_HOME.RECEIPT')"></div>
          </q-card-main>

          <csi-buttons class="q-pa-sm">
            <csi-button primary label="Recupera" @click="$router.push($routes.HEALTH_PAYMENTS.ANONYMOUS_RECEIPT)" />
          </csi-buttons>
        </q-card>
      </div>

    </div>




  </q-page>
</template>


<script>

    export default {
        name: 'PageAnonymousWelcome',
        data() {
            return {
                isShowingMore: false
            };
        },
        computed: {
            isUserLogged() {
                return this.$store.getters['global/isUserLogged']
            }
        },
        created() {
            console.debug('PageAnonymousHome created()', {isLogged: this.isUserLogged})
            if (this.isUserLogged) this.$router.push(this.$routes.HEALTH_PAYMENTS.APP)
        },
        methods: {
            toggleShowMore() {
                this.isShowingMore = !this.isShowingMore
            }
        }
    }
</script>


<style scoped lang="stylus">
  .show-more-icon
    transition all .5s ease

    &--active
      transform rotateZ(-180deg)
</style>
