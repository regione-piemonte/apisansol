<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="rol-report-list-item-skeleton">
    <q-card>
      <q-card-section class="no-padding">
        <lms-card-item>
          <template v-if="$q.screen.lt.sm" #header>
            <div class="q-px-md q-py-sm q-gutter-x-md">
              <q-skeleton type="text" width="40px" class="inline-block" />
              <q-skeleton type="text" width="120px" class="inline-block" />
            </div>
          </template>

          <template #primary>
            <lms-card-item-primary>
              <template #icon>
                <q-skeleton
                  type="circle"
                  size="lg"
                  animation="none"
                  class="inline-block"
                />
              </template>

              <template #text>
                <q-skeleton type="text" width="100px" class="lt-sm" />
                <q-skeleton type="text" width="80px" class="gt-xs q-mx-auto" />

                <q-skeleton type="text" width="200px" class="lt-sm" />
                <q-skeleton
                  type="text"
                  width="120px"
                  class="gt-xs q-mx-auto q-mt-sm"
                />
                <q-skeleton type="text" width="100px" class="gt-xs q-mx-auto" />
              </template>
            </lms-card-item-primary>
          </template>

          <template #secondary>
            <div class="row q-col-gutter-x-xs items-center q-pa-md">
              <div class="col-auto">
                <q-skeleton
                  type="circle"
                  size="lg"
                  animation="none"
                  class="gt-xs"
                />
              </div>

              <div class="col">
                <q-skeleton type="text" width="200px" />
              </div>
            </div>

            <div class="row q-col-gutter-md q-pa-md">
              <div class="col-12 col-lg row q-col-gutter-x-xs items-start">
                <div class="col-auto">
                  <q-skeleton
                    type="circle"
                    size="lg"
                    animation="none"
                    class="gt-xs"
                  />
                </div>

                <div class="col">
                  <q-skeleton type="text" width="120px" />
                  <q-skeleton type="text" width="90px" />
                </div>
              </div>

              <div class="col-12 col-lg row q-col-gutter-x-xs gt-xs">
                <div class="col-auto">
                  <q-skeleton type="circle" size="lg" animation="none" />
                </div>

                <div class="col">
                  <q-skeleton type="text" width="40px" />
                  <q-skeleton type="text" width="240px" />
                </div>
              </div>
            </div>

            <!-- INFORMAZIONI DI DETTAGLIO -->
            <!-- --------------------------------------------------------------------------------------------------- -->
            <template v-if="detail">
              <div class="q-pa-md q-gutter-y-sm">
                <div class="q-gutter-x-sm">
                  <q-skeleton type="text" width="60px" class="inline-block" />
                  <q-skeleton type="text" width="50%" class="inline-block" />
                </div>

                <div class="q-gutter-x-sm">
                  <q-skeleton type="text" width="80px" class="inline-block" />
                  <q-skeleton type="text" width="100px" class="inline-block" />
                </div>

                <div class="q-gutter-x-sm">
                  <q-skeleton type="text" width="100px" class="inline-block" />
                  <q-skeleton type="text" width="100px" class="inline-block" />
                </div>

                <div class="q-gutter-x-sm">
                  <q-skeleton type="text" width="100px" class="inline-block" />
                  <q-skeleton type="text" width="60%" class="inline-block" />
                </div>

                <div class="q-gutter-x-sm">
                  <q-skeleton type="text" width="130px" class="inline-block" />
                  <q-skeleton type="text" width="20%" class="inline-block" />
                  <q-skeleton type="text" width="20%" class="inline-block" />
                </div>

                <div class="q-gutter-x-sm">
                  <q-skeleton type="text" width="100px" class="inline-block" />
                  <q-skeleton type="text" width="80px" class="inline-block" />
                </div>

                <div class="q-gutter-x-sm">
                  <q-skeleton type="text" width="70px" class="inline-block" />
                  <q-skeleton type="text" width="20%" class="inline-block" />
                </div>
              </div>
            </template>

            <!-- AZIONI -->
            <!-- --------------------------------------------------------------------------------------------------- -->
            <lms-buttons class="q-pa-sm">
              <q-skeleton type="QBtn" width="100%" class="lt-sm" />
              <q-skeleton type="QBtn" width="90px" class="gt-xs" />

              <q-skeleton type="QBtn" width="100%" class="lt-sm" />
              <q-skeleton type="QBtn" width="100px" class="gt-xs" />
            </lms-buttons>
          </template>
        </lms-card-item>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import LmsCardItem from "./core/LmsCardItem";
import LmsCardItemPrimary from "src/components/core/LmsCardItemPrimary";

export default {
  name: "RolReportListItemSkeleton",
  components: {
    LmsCardItem,
    LmsCardItemPrimary
  },
  props: {
    detail: { type: Boolean, required: false, default: false }
  }
};
</script>

<style lang="sass"></style>
