<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-card >
    <q-card-section>
      <q-list dense class="q-mt-md">
        <!-- ITEM HEADER -->
        <!-- Permette di abilitare/disabilitare bulk il canale di notifica su tutti i servizi -->
        <!-- ------------------------------------------------------------------------------------------------------- -->
        <q-item class="q-item-profile">
          <q-item-section></q-item-section>
          <q-item-section side>
            <div>
              <div style="display: inline-block" >
                <div class="col-auto column items-center q-px-sm" >
                 <q-skeleton size="24px"/>
                  <span class="q-caption">Push</span>
                </div>
              </div>
              <div style="display: inline-block" >
                <div class="col-auto column items-center q-px-sm" >
                  <q-skeleton size="24px"/>
                  <span class="q-caption">Email</span>
                </div>
              </div>
              <div style="display: inline-block" >
                <div class="col-auto column items-center q-px-sm" >
                  <q-skeleton size="24px"/>
                  <span class="q-caption">Sms</span>
                </div>
              </div>
            </div>
          </q-item-section>
        </q-item>

        <!-- LISTA DEI SERVIZI -->
        <!-- ------------------------------------------------------------------------------------------------------- -->
        <q-item v-for="i in 6" :key="i" style="height: 50px" class="q-item-profile">
          <q-item-section class="text-subtitle1">
            <div class="row">
              <q-skeleton  class="col-12 col-sm-10 col-md-5"/>
            </div>

          </q-item-section>

            <q-item-section side>
              <div class="row">
                <div style="display: inline-block" v-for="j in 3" :key="j">
                  <div class="col-auto column items-center" style="padding: 0 12px">
                    <q-skeleton size="24px" class="bg-grey-5"/>
                  </div>
                </div>
              </div>

            </q-item-section>

        </q-item>
      </q-list>
    </q-card-section>
  </q-card>



</template>

<script>
export default {
name: "AccountNotificationPreferencesSkeleton"
}
</script>

<style scoped>

</style>
